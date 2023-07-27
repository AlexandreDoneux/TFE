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



CREATE PROCEDURE GetStoredPasswordAndUserId(IN _userEmail VARCHAR(255))
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
    SELECT 'Account exists' AS Response, stored_Password AS StoredPassword, user_Id AS UserId;
  END IF;
END;


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


CREATE PROCEDURE CreateMonitoring(
  IN _monitoringName VARCHAR(255),
  IN _probeId INT,
  IN _userId INT
)
BEGIN
  DECLARE monitorExists INT;
  DECLARE probeBelongsToUser INT;
  DECLARE newMonitoringId INT;

  -- Check if the provided probe id belongs to the given user id
  SELECT COUNT(*) INTO probeBelongsToUser FROM Probe WHERE ProbeId = _probeId AND UserId = _userId;

  IF probeBelongsToUser = 0 THEN
    -- The provided probe does not belong to the user, return an error
    SELECT 'Probe does not belong to the user' AS Response, 0 AS MonitoringId;
  ELSE
    -- Check if a monitoring already exists for the given probe id
    SELECT COUNT(*) INTO monitorExists FROM Monitoring WHERE ProbeId = _probeId AND EndDate IS NULL;

    IF monitorExists > 0 THEN
      -- Monitoring already exists for the probe, handle it accordingly (e.g., update, return an error)
      SELECT 'Monitoring already exists for the probe' AS Response, 0 AS MonitoringId;
    ELSE
      -- No active monitoring exists for the probe, create a new monitoring
      INSERT INTO Monitoring (Name, StartDate, ProbeId)
      VALUES (_monitoringName, NOW(), _probeId);

      -- Get the last inserted monitoring ID and return it
      SET newMonitoringId = LAST_INSERT_ID();

      SELECT 'Monitoring created successfully' AS Response, newMonitoringId AS MonitoringId;
    END IF;
  END IF;
END //



CREATE PROCEDURE CreateProbe(
  IN _userId INT,
  IN _probeName VARCHAR(255),
  IN _password VARCHAR(255)
)
BEGIN
  DECLARE userExists INT;
  DECLARE probeExists INT;
  DECLARE newProbeId INT;
  
  -- Check if the provided user id exists in the User table
  SELECT COUNT(*) INTO userExists FROM User WHERE UserId = _userId;

  IF userExists = 0 THEN
    -- The provided user id does not exist, return an error
    SELECT 'User does not exist' AS Response, 0 AS ProbeId;
  ELSE
    -- Check if the probe name already exists for the given user id
    SELECT COUNT(*) INTO probeExists FROM Probe WHERE Name = _probeName AND UserId = _userId;
  
    IF probeExists > 0 THEN
      -- Probe name already exists for the user, return an error
      SELECT 'Probe name already exists for the user' AS Response, 0 AS ProbeId;
    ELSE
      -- No probe with the given name exists for the user, create a new probe
      INSERT INTO Probe (Name, Password, UserId)
      VALUES (_probeName, _password, _userId);
  
      -- Get the last inserted probe ID and return it
      SET newProbeId = LAST_INSERT_ID();
  
      SELECT 'Probe created successfully' AS Response, newProbeId AS ProbeId; 
      -- Technically do not need the probe id, it will be displayed when watching the probe data
    END IF;
  END IF;
END //


CREATE PROCEDURE DeleteProbe(
  IN _userId INT,
  IN _probeId INT
)
BEGIN
  DECLARE probeBelongsToUser INT;

  -- Check if the provided probe id belongs to the given user id
  SELECT COUNT(*) INTO probeBelongsToUser FROM Probe WHERE ProbeId = _probeId AND UserId = _userId;

  IF probeBelongsToUser = 0 THEN
    -- The provided probe does not belong to the user, return an error or handle it accordingly
    SELECT 'Probe does not belong to the user' AS Response;
  ELSE
    -- Probe belongs to the user, delete the probe and related monitorings
    DELETE FROM Probe WHERE ProbeId = _probeId;

    SELECT 'Probe deleted successfully' AS Response;
  END IF;
END //



DELIMITER ;

