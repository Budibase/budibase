SELECT 'CREATE DATABASE main'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'main')\gexec
CREATE TABLE Persons (
    PersonID int NOT NULL PRIMARY KEY,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
);
