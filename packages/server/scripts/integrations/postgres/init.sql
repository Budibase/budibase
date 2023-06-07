SELECT 'CREATE DATABASE main'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'main')\gexec
CREATE SCHEMA test;
CREATE TYPE person_job AS ENUM ('qa', 'programmer', 'designer');
CREATE TABLE Persons (
    PersonID SERIAL PRIMARY KEY,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255) DEFAULT 'Belfast',
    Age INTEGER DEFAULT 20 NOT NULL,
    Type person_job
);
CREATE TABLE Tasks (
    TaskID SERIAL PRIMARY KEY,
    ExecutorID INT,
    QaID INT,
    Completed BOOLEAN,
    TaskName varchar(255),
    CONSTRAINT fkexecutor
        FOREIGN KEY(ExecutorID)
            REFERENCES Persons(PersonID),
    CONSTRAINT fkqa
        FOREIGN KEY(QaID)
	    REFERENCES Persons(PersonID)
);
CREATE TABLE Products (
    ProductID SERIAL PRIMARY KEY,
    ProductName varchar(255)
);
CREATE TABLE Products_Tasks (
    ProductID INT NOT NULL,
    TaskID INT NOT NULL,
    CONSTRAINT fkProducts
        FOREIGN KEY(ProductID)
            REFERENCES Products(ProductID),
    CONSTRAINT fkTasks
        FOREIGN KEY(TaskID)
            REFERENCES Tasks(TaskID),
    PRIMARY KEY (ProductID, TaskID)
);
CREATE TABLE test.table1 (
  id SERIAL PRIMARY KEY,
  Name varchar(255)
);
INSERT INTO Persons (FirstName, LastName, Address, City, Type) VALUES ('Mike', 'Hughes', '123 Fake Street', 'Belfast', 'qa');
INSERT INTO Persons (FirstName, LastName, Address, City, Type) VALUES ('John', 'Smith', '64 Updown Road', 'Dublin', 'programmer');
INSERT INTO Tasks (ExecutorID, QaID, TaskName, Completed) VALUES (1, 2, 'assembling', TRUE);
INSERT INTO Tasks (ExecutorID, QaID, TaskName, Completed) VALUES (2, 1, 'processing', FALSE);
INSERT INTO Products (ProductName) VALUES ('Computers');
INSERT INTO Products (ProductName) VALUES ('Laptops');
INSERT INTO Products (ProductName) VALUES ('Chairs');
INSERT INTO Products_Tasks (ProductID, TaskID) VALUES (1, 1);
INSERT INTO Products_Tasks (ProductID, TaskID) VALUES (2, 1);
INSERT INTO Products_Tasks (ProductID, TaskID) VALUES (3, 1);
INSERT INTO Products_Tasks (ProductID, TaskID) VALUES (1, 2);
INSERT INTO test.table1 (Name) VALUES ('Test');
