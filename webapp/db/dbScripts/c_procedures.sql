DELIMITER //

CREATE PROCEDURE InsertData(IN _tempValue FLOAT, IN _floatDensityValue FLOAT, IN _refractDensityValue Float,
                            IN _timestamp DATETIME, IN _probeId INT, OUT _response VARCHAR(40))

BEGIN
    DECLARE monitoringId INT;
    SET monitoringId = (SELECT MonitorId
                        FROM Monitoring
                        WHERE ProbeId=_probeId);

    IF monitoringId = NULL THEN
      SET _response = "no active monitoring available";

    ELSEIF monitoringID = 1 THEN
      INSERT INTO Data (TempValue, FloatDensityValue, RefractDensityValue, Timestamp, MonitorId) VALUES
        (_tempValue, _floatDensityValue, _refractDensityValue, _timestamp, monitoringId);
    
      SET _response = "ok";
      
    ELSE
      SET _response = "too many";

    END IF;

END//


CREATE PROCEDURE SelectData(IN MonitorId INT)
BEGIN
  SELECT * FROM Data WHERE MonitorId = MonitorId;
END//

DELIMITER ;