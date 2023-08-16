INSERT INTO User (Name, Firstname, Email, Password)
VALUES
('Doe', 'John', 'john@doe.com', '$argon2id$v=19$m=65536,t=3,p=4$cTaTRaQai2yyDJ7MAggSlg$nYTjaVnlY01icHPPBCU7BYdwgrcM/o69qqRvyMgpVQg'),
('Lang', 'Jack', 'jack@lang.com', '$argon2id$v=19$m=65536,t=3,p=4$uM9PJp2w4wV4iEyjGH4lWQ$8PJiylcN+8zfSyYqi211lc+VdOw+5rLX0AcF7jdmplA'),
('Doe', 'John', 'john2@doe.com', '$argon2id$v=19$m=65536,t=3,p=4$cTaTRaQai2yyDJ7MAggSlg$nYTjaVnlY01icHPPBCU7BYdwgrcM/o69qqRvyMgpVQg'); -- same password, user for tests (no probes, etc...)

INSERT INTO Probe (Name, Password, UserId)
VALUES
('Toto', '$argon2id$v=19$m=65536,t=3,p=4$HrovBOZFKoC1Evst1LagPw$PTnKwETU1QX1xLUSahLtsPNEQI0em0VxbMnCIRQcMaw', 1), -- password : mdptoto
('Tata', '$argon2id$v=19$m=65536,t=3,p=4$ml/aLKFjJbNAC2EOrfvfBw$MJa7JftJ0I1a6R1xIMqL2cl8Cv0W0gPAPKByJ5U1LOI', 1), -- password : mdptata
('Tutu', '$argon2id$v=19$m=65536,t=3,p=4$XJKMqOIuSRQjPBkQ/O7GGA$zJnNMrKGcqnwztVGC9eHxHi8+fkxUjyukKbNUF56ilc', 2); -- password : mdptutu


INSERT INTO Monitoring (Name, StartDate, EndDate, ProbeId)
VALUES
("aaa", '2023-05-28 14:30:00', NULL, 1),
-- ("bbb", '2023-05-25 14:30:00', NULL, 2), 
-- setting no active monitoring to probe 2 by commenting this line
("ccc", '2023-05-15 14:30:00', NULL, 3),
("ddd", '2023-04-25 14:30:00', '2023-05-10 14:30:00', 1),
("eee", '2023-03-15 14:30:00', '2023-04-20 14:30:00', 2),
("fff", '2023-04-01 14:30:00', '2023-04-17 14:30:00', 3),
("ggg", '2023-03-26 14:30:00', '2023-04-04 14:30:00', 1),
("hhh", '2023-03-01 14:30:00', '2023-03-14 14:30:00', 2);


INSERT INTO Session (UserId, Expiration)
VALUES
  (2, '2023-05-24 09:30:00');


INSERT INTO Data (TempValue, FloatDensityValue, RefractDensityValue, Timestamp, MonitorId)
VALUES
  -- Monitoring ID 1
  (25.5, 1.2, 3.4, '2023-05-28 14:30:00', 1),
  (26.0, 1.3, 3.5, '2023-05-28 15:00:00', 1),
  (26.3, 1.3, 3.5, '2023-05-28 15:30:00', 1),
  (26.2, 1.3, 3.5, '2023-05-28 16:00:00', 1),
  (25.3, 1.3, 3.5, '2023-05-28 16:30:00', 1),
  (25.0, 1.3, 3.5, '2023-05-28 17:00:00', 1),
  (25.4, 1.3, 3.5, '2023-05-28 17:30:00', 1),
  (25.9, 1.3, 3.5, '2023-05-28 18:00:00', 1),
  (26.4, 1.3, 3.5, '2023-05-28 18:30:00', 1),
  (26.9, 1.3, 3.5, '2023-05-28 19:00:00', 1),
  -- ... add more data entries for Monitoring ID 1
  
  -- Monitoring ID 2
  (24.8, 1.1, 3.3, '2023-05-25 14:30:00', 2),
  (25.2, 1.2, 3.4, '2023-05-25 15:00:00', 2),
  (25.4, 1.2, 3.4, '2023-05-25 15:30:00', 2),
  (25.7, 1.2, 3.4, '2023-05-25 16:00:00', 2),
  (25.6, 1.2, 3.4, '2023-05-25 16:30:00', 2),
  (25.1, 1.2, 3.4, '2023-05-25 17:00:00', 2),
  (24.8, 1.2, 3.4, '2023-05-25 17:30:00', 2),
  (25.2, 1.2, 3.4, '2023-05-25 18:00:00', 2),
  (25.7, 1.2, 3.4, '2023-05-25 18:30:00', 2),
  (26.3, 1.2, 3.4, '2023-05-25 19:00:00', 2),
  (26.9, 1.2, 3.4, '2023-05-25 19:30:00', 2),
  -- ... add more data entries for Monitoring ID 2
  
  -- Monitoring ID 3
  (26.3, 1.3, 3.5, '2023-05-15 14:30:00', 3),
  (25.9, 1.2, 3.4, '2023-05-15 15:00:00', 3),
  (25.9, 1.2, 3.4, '2023-05-15 15:30:00', 3),
  (25.9, 1.2, 3.4, '2023-05-15 16:00:00', 3),
  (25.9, 1.2, 3.4, '2023-05-15 16:30:00', 3),
  (25.9, 1.2, 3.4, '2023-05-15 17:00:00', 3),
  (25.9, 1.2, 3.4, '2023-05-15 17:30:00', 3),
  (25.9, 1.2, 3.4, '2023-05-15 18:00:00', 3),
  (25.9, 1.2, 3.4, '2023-05-15 18:30:00', 3),
  -- ... add more data entries for Monitoring ID 3
  
  -- Monitoring ID 4 => no data, for testing on postman
  -- (24.7, 1.1, 3.3, '2023-04-25 14:30:00', 4),
  
  -- ... add more data entries for Monitoring ID 4
  
  -- Monitoring ID 5
  (25.6, 1.2, 3.4, '2023-03-15 14:30:00', 5),
  (25.8, 1.2, 3.4, '2023-03-15 15:00:00', 5),
  (25.5, 1.2, 3.4, '2023-03-15 15:30:00', 5),
  (25.6, 1.2, 3.4, '2023-03-15 16:00:00', 5),
  (25.3, 1.2, 3.4, '2023-03-15 16:30:00', 5),
  (25.4, 1.2, 3.4, '2023-03-15 17:00:00', 5),
  (25.6, 1.2, 3.4, '2023-03-15 17:30:00', 5),
  (25.8, 1.2, 3.4, '2023-03-15 18:00:00', 5),
  (26.3, 1.2, 3.4, '2023-03-15 18:30:00', 5),
  -- ... add more data entries for Monitoring ID 5
  
  -- Monitoring ID 6
  (26.4, 1.3, 3.5, '2023-06-02 15:00:00', 6),
  (26.2, 1.3, 3.5, '2023-06-02 15:05:00', 6),
  -- ... add more data entries for Monitoring ID 6
  
  -- Monitoring ID 7
  (24.9, 1.1, 3.3, '2023-06-02 16:00:00', 7),
  (25.3, 1.2, 3.4, '2023-06-02 16:05:00', 7);
  -- ... add more data entries for Monitoring ID 7
  
  -- Monitoring ID 8 
  -- (25.7, 1.2, 3.4, '2023-06-02 17:00:00', 8),
  -- (26.1, 1.3, 3.5, '2023-06-02 17:05:00', 8);
  -- ... add more data entries for Monitoring ID 8
