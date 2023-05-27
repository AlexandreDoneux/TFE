

CREATE EVENT DeleteExpiredSessions
ON SCHEDULE EVERY 10 MINUTE
DO
    DELETE FROM Session WHERE Expiration <= NOW();


