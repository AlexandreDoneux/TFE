DELIMITER //

CREATE PROCEDURE InsertData(IN TempValue FLOAT, IN FloatDensityValue FLOAT, IN RefractDensityValue Float,
                            IN Timestamp DATETIME, IN ProbeId INT)
BEGIN
    SET monitoringId = (SELECT MonitorId
                        FROM Monitoring
                        WHERE ProbeId=ProbeId);
    
    INSERT INTO Data (TempValue, FloatDensityValue, RefractDensityValue, Timestamp, MonitorId)
        TempValue, FloatDensityValue, RefractDensityValue, Timestamp, MonitorId;

END//

DELIMITER ;