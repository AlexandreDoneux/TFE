DELIMITER //

CREATE PROCEDURE InsertData(IN _tempValue FLOAT, IN _floatDensityValue FLOAT, IN _refractDensityValue Float,
                            IN _timestamp DATETIME, IN _probeId INT)

BEGIN
    DECLARE monitoringId INT;
    SET monitoringId = (SELECT MonitorId
                        FROM Monitoring
                        WHERE ProbeId=_probeId);

    SELECT monitoringId;

    INSERT INTO Data (TempValue, FloatDensityValue, RefractDensityValue, Timestamp, MonitorId) VALUES
      (_tempValue, _floatDensityValue, _refractDensityValue, _timestamp, monitoringId);


END//


DELIMITER ;