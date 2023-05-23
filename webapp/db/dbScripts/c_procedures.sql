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
    SELECT 'No monitoring found for the specified MonitorId' AS ErrorMessage;
  END IF;
END//


CREATE PROCEDURE CheckSessionExists(IN _sessionId INT)
BEGIN
  DECLARE sessionCount INT;
  
  SELECT COUNT(*) INTO sessionCount
  FROM Session
  WHERE SessionId = _sessionId;
  
  IF sessionCount > 0 THEN
    SELECT true AS Result;
  ELSE
    SELECT false AS Result;
  END IF;
  
END//

DELIMITER ;