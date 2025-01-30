CREATE DATABASE IF NOT EXISTS main;
USE main;
CREATE TABLE Persons (
    PersonID int NOT NULL AUTO_INCREMENT,
    CreatedAt datetime,
    Age float DEFAULT 20 NOT NULL,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255),
    PRIMARY KEY (PersonID)
);
CREATE TABLE Person (
    PersonID int NOT NULL AUTO_INCREMENT,
    Name varchar(255),
    PRIMARY KEY (PersonID)
);
CREATE TABLE Tasks (
    TaskID int NOT NULL AUTO_INCREMENT,
    PersonID INT,
    TaskName varchar(255),
    CreatedAt DATE,
    PRIMARY KEY (TaskID),
    CONSTRAINT fkPersons
        FOREIGN KEY(PersonID)
	    REFERENCES Persons(PersonID)
);
CREATE TABLE Products (
    id serial primary key,
    name text,
    updated time
);
CREATE TABLE `table with space` (
    id serial primary key,
    name text
);
INSERT INTO Persons (FirstName, LastName, Age, Address, City, CreatedAt) VALUES ('Mike', 'Hughes', 28.2, '123 Fake Street', 'Belfast', '2021-01-19 03:14:07');
INSERT INTO Persons (FirstName, LastName, Age, Address, City, CreatedAt) VALUES ('Dave', 'Johnson', 29, '124 Fake Street', 'Belfast', '2022-04-01 00:11:11');
INSERT INTO Person (Name) VALUES ('Elf');
INSERT INTO Tasks (PersonID, TaskName, CreatedAt) VALUES (1, 'assembling', '2020-01-01');
INSERT INTO Tasks (PersonID, TaskName, CreatedAt) VALUES (2, 'processing', '2019-12-31');
INSERT INTO Products (name, updated) VALUES ('Meat', '11:00:22'), ('Fruit', '10:00:00');
