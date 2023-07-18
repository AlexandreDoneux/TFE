DELIMITER //

CREATE PROCEDURE InsertData(IN _tempValue FLOAT, IN _floatDensityValue FLOAT, IN _refractDensityValue FLOAT,
                            IN _timestamp DATETIME, IN _probeId INT)
BEGIN
    DECLARE monitoringId INT;
    SET monitoringId = (SELECT MonitorId
                        FROM Monitoring
                        WHERE ProbeId = _probeId AND EndDate IS NULL);

    IF monitoringId IS NULL THEN
        SELECT 'no active monitoring available' AS Response;
    ELSE
        INSERT INTO Data (TempValue, FloatDensityValue, RefractDensityValue, Timestamp, MonitorId) VALUES
        (_tempValue, _floatDensityValue, _refractDensityValue, _timestamp, monitoringId);
    
        SELECT 'ok' AS Response;
    END IF;
END//


CREATE PROCEDURE SelectData(IN _monitorId INT)
BEGIN
  DECLARE MonitorCount INT;
  SET MonitorCount = (SELECT COUNT(*) FROM Monitoring WHERE MonitorId = _monitorId);

  IF MonitorCount > 0 THEN
    SELECT * FROM Data WHERE MonitorId = _monitorId;
  ELSE
    SELECT 'No monitoring found for the specified MonitorId' AS Response;
  END IF;
END//


CREATE PROCEDURE CheckSessionExists(IN _sessionId INT)
BEGIN
  DECLARE sessionCount INT;
  DECLARE user_Id INT;
  
  SET sessionCount = (SELECT COUNT(*) FROM Session WHERE SessionId = _sessionId);
  
  IF sessionCount > 0 THEN
    SET user_Id = (SELECT UserId FROM Session WHERE SessionId = _sessionId);
    SELECT true AS Response, user_Id AS UserId;
  ELSE
    SELECT false AS Response;
  END IF;
  
END//



CREATE PROCEDURE CheckUserPasswordMatch(IN _userEmail VARCHAR(255), IN _userPassword VARCHAR(255))
BEGIN
  DECLARE email_Count INT;
  DECLARE stored_Password VARCHAR(255);
  DECLARE user_Id INT;
  

  SET email_Count = (SELECT COUNT(*) FROM User WHERE Email = _userEmail);

  IF email_Count = 0 THEN
    SELECT 'Account not existing' AS Response;
  ELSE

    SET stored_Password = (SELECT Password FROM User WHERE Email = _userEmail);
    SET user_Id = (SELECT UserId FROM User WHERE Email = _userEmail);


    IF stored_Password = _userPassword THEN
      SELECT 'Password matches' AS Response, user_Id AS UserId;
    ELSE
      SELECT 'Password does not match' AS Response;
    END IF;
  END IF;

END//


CREATE PROCEDURE RetrieveProbePassword(IN _probeId INT)
BEGIN

    -- Check if the probe exists
    IF EXISTS (SELECT 1 FROM Probe WHERE ProbeId = _probeId) THEN
        -- Retrieve the password for the probe
        SELECT Password AS Response
        FROM Probe
        WHERE ProbeId = _probeId;

    ELSE
        SELECT 'Probe not existing' AS Response;
    END IF;

END//



CREATE PROCEDURE CreateSession(IN _userId INT)
BEGIN
  DECLARE session_Id INT;

  -- Check if a session already exists for the user
  IF EXISTS (SELECT 1 FROM Session WHERE UserId = _userId) THEN
    SELECT 'Session already exists' AS Response, SessionId
    FROM Session
    WHERE UserId = _userId;
    
  ELSE
    -- Create a new session with expiration date two hours from now
    INSERT INTO Session (UserId, Expiration)
    VALUES (_userId, DATE_ADD(NOW(), INTERVAL 2 HOUR));

    SET session_Id = LAST_INSERT_ID();
    SELECT 'New session' AS Response, session_Id AS SessionId;
  END IF;
  
END//


CREATE PROCEDURE DeleteSession(IN _sessionId INT)
BEGIN
  DELETE FROM Session WHERE SessionId = _sessionId;
  SELECT 'Session deleted' AS Response;
END//



CREATE PROCEDURE GetArchivedMonitoringsByUser(IN _userId INT)
BEGIN
  DECLARE userExists INT;

  -- Check if the user exists
  SELECT COUNT(*) INTO userExists FROM User WHERE UserId = _userId;

  IF userExists > 0 THEN
    -- User exists, retrieve the archived monitorings
    SELECT 'user exists' AS Response, GROUP_CONCAT(Monitoring.MonitorId) AS MonitoringIds
    FROM Monitoring
    INNER JOIN Probe ON Monitoring.ProbeId = Probe.ProbeId
    INNER JOIN User ON Probe.UserId = User.UserId
    WHERE User.UserId = _userId
    AND Monitoring.EndDate IS NOT NULL;
  ELSE
    -- User does not exist
    SELECT 'user does not exist' AS Response;
  END IF;
END //



CREATE PROCEDURE GetProbesByUser(IN _userId INT)
BEGIN
  DECLARE userExists INT;

  -- Check if the user exists
  SELECT COUNT(*) INTO userExists FROM User WHERE UserId = _userId;

  IF userExists > 0 THEN
    -- User exists, retrieve the probes and their active monitoring
    SELECT 'user exists' AS Response,
           GROUP_CONCAT(Probe.ProbeId) AS ProbeIds,
           GROUP_CONCAT(Probe.Name) AS ProbeNames,
           IFNULL(Monitoring.MonitorId, 0) AS ActiveMonitoringId
    FROM Probe
    LEFT JOIN Monitoring ON Probe.ProbeId = Monitoring.ProbeId AND Monitoring.EndDate IS NULL
    INNER JOIN User ON Probe.UserId = User.UserId
    WHERE User.UserId = _userId
    GROUP BY Probe.ProbeId;
  ELSE
    -- User does not exist
    SELECT 'user does not exist' AS Response;
  END IF;
END //





CREATE PROCEDURE GetMonitoringData(IN _monitoringId INT)
BEGIN
  DECLARE monitoring_exists INT ;


  -- Check if the monitoring exists
  SELECT COUNT(*) INTO monitoring_exists FROM Monitoring WHERE MonitorId = _monitoringId;

  IF monitoring_exists = 0 THEN
    -- Monitoring does not exist
    SELECT 'monitoring does not exist' AS Response;
  ELSE
    -- Retrieve monitoring data
    SELECT 'monitoring exists' AS Response,  Name AS monitoringName, StartDate AS monitoringStartDate, EndDate AS monitoringEndDate
    FROM Monitoring
    WHERE MonitorId = _monitoringId;

  END IF;
END //



DELIMITER //
CREATE PROCEDURE ArchiveMonitoring(IN _userId INT, IN _monitorId INT)
BEGIN
  DECLARE monitorExists INT;
  DECLARE isArchived INT;

  -- Check if the monitoring exists and is related to the user
  SELECT COUNT(*) INTO monitorExists FROM Monitoring
  WHERE MonitorId = _monitorId AND EXISTS (
    SELECT 1 FROM Probe
    INNER JOIN User ON Probe.UserId = User.UserId
    WHERE Probe.ProbeId = Monitoring.ProbeId AND User.UserId = _userId
  );

  IF monitorExists > 0 THEN
    -- Check if the monitoring is already archived (has an end date)
    SELECT COUNT(*) INTO isArchived FROM Monitoring
    WHERE MonitorId = _monitorId AND EndDate IS NOT NULL;

    IF isArchived = 0 THEN
      -- Monitoring exists, update the end date
      UPDATE Monitoring
      SET EndDate = NOW()
      WHERE MonitorId = _monitorId;

      SELECT 'monitoring has been archived' AS Response;
    ELSE
      -- Monitoring is already archived
      SELECT 'monitoring is already archived' AS Response;
    END IF;
  ELSE
    -- Monitoring does not exist or is not related to the user
    SELECT 'monitoring does not exist or is not related to the user' AS Response;
  END IF;
END //




DELIMITER ;