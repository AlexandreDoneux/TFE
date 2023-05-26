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
  DECLARE storedPassword VARCHAR(255);

  SET storedPassword = (SELECT Password FROM User WHERE Email = _userEmail);
  
  
  IF storedPassword = _userPassword THEN
    SELECT 'Password matches' AS Response;
  ELSE
    SELECT 'Password does not match' AS Response;
  END IF;
  
END//

DELIMITER ;