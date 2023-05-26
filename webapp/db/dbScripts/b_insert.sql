INSERT INTO User (Name, Firstname, Email, Password, Salt)
VALUES
('Doe', 'John', 'john@doe.com', 'passjohn', NULL),
('Lang', 'Jack', 'jack@lang.com', 'passjack', NULL);

INSERT INTO Probe (Name, Password, Salt, UserId)
VALUES
('Toto', 'mdptoto', NULL, 1),
('Tata', 'mdptata', NULL, 1),
('Tutu', NULL, NULL, 2);


INSERT INTO Monitoring (StartDate, EndDate, ProbeId)
VALUES
('2023-04-28 14:30:00', NULL, 1),
('2023-04-25 14:30:00', NULL, 2),
('2023-03-15 14:30:00', NULL, 3);


INSERT INTO Session (UserId, Expiration)
VALUES
  (1, '2023-05-23 18:00:00'),
  (2, '2023-05-24 09:30:00');


