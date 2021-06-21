CREATE DATABASE IF NOT EXISTS main;
USE main;
CREATE TABLE Persons (
    PersonID int NOT NULL PRIMARY KEY,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
);
