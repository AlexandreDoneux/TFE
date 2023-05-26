DELIMITER //

CREATE PROCEDURE InsertData(IN _tempValue FLOAT, IN _floatDensityValue FLOAT, IN _refractDensityValue FLOAT,
                            IN _timestamp DATETIME, IN _probeId INT)
BEGIN
    DECLARE monitoringId INT;
    SET monitoringId = (SELECT MonitorId
                        FROM Monitoring
                        WHERE ProbeId=_probeId);

    IF monitoringId IS NULL THEN
      SELECT 'no active monitoring available' AS Response;

    ELSEIF monitoringId = 1 THEN
      INSERT INTO Data (TempValue, FloatDensityValue, RefractDensityValue, Timestamp, MonitorId) VALUES
        (_tempValue, _floatDensityValue, _refractDensityValue, _timestamp, monitoringId);
    
      SELECT 'ok' AS Response;
      
    ELSE
      SELECT 'too many' AS Response;

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
  
  SET sessionCount = (SELECT COUNT(*) FROM Session WHERE SessionId = _sessionId);
  
  IF sessionCount > 0 THEN
    SELECT true AS Response;
  ELSE
    SELECT false AS Response;
  END IF;
  
END//


CREATE PROCEDURE CheckPasswordMatch(IN _userEmail VARCHAR(255), IN _userPassword VARCHAR(255))
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


CREATE PROCEDURE CreateSession(IN _userId INT, OUT _sessionId INT)
BEGIN
  INSERT INTO Session (UserId)
  VALUES (_userId);

  SET _sessionId = LAST_INSERT_ID();
END//


DELIMITER ;