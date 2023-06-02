INSERT INTO User (Name, Firstname, Email, Password)
VALUES
('Doe', 'John', 'john@doe.com', 'passjohn'),
('Lang', 'Jack', 'jack@lang.com', 'passjack');

INSERT INTO Probe (Name, Password, UserId)
VALUES
('Toto', '$argon2id$v=19$m=65536,t=3,p=4$HrovBOZFKoC1Evst1LagPw$PTnKwETU1QX1xLUSahLtsPNEQI0em0VxbMnCIRQcMaw', 1), -- password : mdptoto
('Tata', '$argon2id$v=19$m=65536,t=3,p=4$ml/aLKFjJbNAC2EOrfvfBw$MJa7JftJ0I1a6R1xIMqL2cl8Cv0W0gPAPKByJ5U1LOI', 1), -- password : mdptata
('Tutu', '$argon2id$v=19$m=65536,t=3,p=4$XJKMqOIuSRQjPBkQ/O7GGA$zJnNMrKGcqnwztVGC9eHxHi8+fkxUjyukKbNUF56ilc', 2); -- password : mdptutu


INSERT INTO Monitoring (StartDate, EndDate, ProbeId)
VALUES
('2023-04-28 14:30:00', NULL, 1),
('2023-04-25 14:30:00', NULL, 2),
('2023-03-15 14:30:00', NULL, 3);


INSERT INTO Session (UserId, Expiration)
VALUES
  (2, '2023-05-24 09:30:00');


