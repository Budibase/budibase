CREATE DATABASE IF NOT EXISTS main;
USE main;
CREATE TABLE Persons (
    PersonID int NOT NULL AUTO_INCREMENT,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255),
    PRIMARY KEY (PersonID)
);
CREATE TABLE Tasks (
    TaskID int NOT NULL AUTO_INCREMENT,
    PersonID INT,
    TaskName varchar(255),
    PRIMARY KEY (TaskID),
    CONSTRAINT fkPersons
        FOREIGN KEY(PersonID)
	    REFERENCES Persons(PersonID)
);
INSERT INTO Persons (FirstName, LastName, Address, City) VALUES ('Mike', 'Hughes', '123 Fake Street', 'Belfast');
INSERT INTO Tasks (PersonID, TaskName) VALUES (1, 'assembling');
INSERT INTO Tasks (PersonID, TaskName) VALUES (1, 'processing');
