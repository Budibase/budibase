SELECT 'CREATE DATABASE main'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'main')\gexec
CREATE SCHEMA "test-1";
CREATE TYPE person_job AS ENUM ('qa', 'programmer', 'designer', 'support');
CREATE TABLE Persons (
    PersonID SERIAL PRIMARY KEY,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255) DEFAULT 'Belfast',
    Age INTEGER DEFAULT 20 NOT NULL,
    Year INTEGER,
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
CREATE TABLE "test-1".table1 (
  id SERIAL PRIMARY KEY,
  Name varchar(255)
);
CREATE TABLE CompositeTable (
  KeyPartOne varchar(128),
  KeyPartTwo varchar(128),
  Name varchar(255),
  PRIMARY KEY (KeyPartOne, KeyPartTwo)
);
INSERT INTO Persons (FirstName, LastName, Address, City, Type, Year) VALUES ('Mike', 'Hughes', '123 Fake Street', 'Belfast', 'qa', 1999);
INSERT INTO Persons (FirstName, LastName, Address, City, Type, Year) VALUES ('John', 'Smith', '64 Updown Road', 'Dublin', 'programmer', 1996);
INSERT INTO Persons (FirstName, LastName, Address, City, Type, Age, Year) VALUES ('Foo', 'Bar', 'Foo Street', 'Bartown', 'support', 0, 1993);
INSERT INTO Persons (FirstName, LastName, Address, City, Type) VALUES ('Jonny', 'Muffin', 'Muffin Street', 'Cork', 'support');
INSERT INTO Persons (FirstName, LastName, Address, City, Type, Age, Year) VALUES ('Dave', 'Bar', '2 Foo Street', 'Bartown', 'support', 0, 1993);
INSERT INTO Persons (FirstName, LastName, Address, City, Type, Age, Year) VALUES ('James', 'Bar', '3 Foo Street', 'Bartown', 'support', 0, 1993);
INSERT INTO Persons (FirstName, LastName, Address, City, Type, Age, Year) VALUES ('Jenny', 'Bar', '4 Foo Street', 'Bartown', 'support', 0, 1993);
INSERT INTO Persons (FirstName, LastName, Address, City, Type, Age, Year) VALUES ('Grace', 'Bar', '5 Foo Street', 'Bartown', 'support', 0, 1993);
INSERT INTO Persons (FirstName, LastName, Address, City, Type, Age, Year) VALUES ('Sarah', 'Bar', '6 Foo Street', 'Bartown', 'support', 0, 1993);
INSERT INTO Persons (FirstName, LastName, Address, City, Type, Age, Year) VALUES ('Kelly', 'Bar', '7 Foo Street', 'Bartown', 'support', 0, 1993);

-- insert a lot of tasks for testing
WITH RECURSIVE generate_series AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM generate_series WHERE n < 6000
),
random_data AS (
  SELECT
    n,
    (random() * 9 + 1)::int AS ExecutorID,
    (random() * 9 + 1)::int AS QaID,
    'assembling' AS TaskName,
    (random() < 0.5) AS Completed
  FROM generate_series
)
INSERT INTO Tasks (ExecutorID, QaID, TaskName, Completed)
SELECT ExecutorID, QaID, TaskName, Completed
FROM random_data;
INSERT INTO Products (ProductName) VALUES ('Computers');
INSERT INTO Products (ProductName) VALUES ('Laptops');
INSERT INTO Products (ProductName) VALUES ('Chairs');
INSERT INTO Products_Tasks (ProductID, TaskID) VALUES (1, 1);
INSERT INTO Products_Tasks (ProductID, TaskID) VALUES (2, 1);
INSERT INTO Products_Tasks (ProductID, TaskID) VALUES (3, 1);
INSERT INTO Products_Tasks (ProductID, TaskID) VALUES (1, 2);
INSERT INTO "test-1".table1 (Name) VALUES ('Test');
INSERT INTO CompositeTable (KeyPartOne, KeyPartTwo, Name) VALUES ('aaa', 'bbb', 'Michael');
INSERT INTO CompositeTable (KeyPartOne, KeyPartTwo, Name) VALUES ('bbb', 'ccc', 'Andrew');
INSERT INTO CompositeTable (KeyPartOne, KeyPartTwo, Name) VALUES ('ddd', '', 'OneKey');
