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



DELIMITER //

CREATE PROCEDURE GetArchivedMonitoringsByUser(IN userId INT)
BEGIN
  DECLARE userExists INT;

  -- Check if the user exists
  SELECT COUNT(*) INTO userExists FROM User WHERE UserId = userId;

  IF userExists > 0 THEN
    -- User exists, retrieve the archived monitorings
    SELECT 'user exists' AS Response, GROUP_CONCAT(Monitoring.MonitorId) AS MonitoringIds
    FROM Monitoring
    INNER JOIN Probe ON Monitoring.ProbeId = Probe.ProbeId
    INNER JOIN User ON Probe.UserId = User.UserId
    WHERE User.UserId = userId
    AND Monitoring.EndDate IS NOT NULL;
  ELSE
    -- User does not exist
    SELECT 'user does not exist' AS Response;
  END IF;
END //

DELIMITER ;







DELIMITER ;