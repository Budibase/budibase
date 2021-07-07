SELECT 'CREATE DATABASE main'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'main')\gexec
CREATE TABLE Persons (
    PersonID INT NOT NULL PRIMARY KEY,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
);
CREATE TABLE Tasks (
    TaskID INT NOT NULL PRIMARY KEY,
    PersonID INT,
    TaskName varchar(255),
    CONSTRAINT fkPersons
        FOREIGN KEY(PersonID)
	    REFERENCES Persons(PersonID)
);
CREATE TABLE Products (
    ProductID INT NOT NULL PRIMARY KEY,
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
INSERT INTO Persons (PersonID, FirstName, LastName, Address, City) VALUES (1, 'Mike', 'Hughes', '123 Fake Street', 'Belfast');
INSERT INTO Tasks (TaskID, PersonID, TaskName) VALUES (1, 1, 'assembling');
INSERT INTO Tasks (TaskID, PersonID, TaskName) VALUES (2, 1, 'processing');
INSERT INTO Products (ProductID, ProductName) VALUES (1, 'Computers');
INSERT INTO Products (ProductID, ProductName) VALUES (2, 'Laptops');
INSERT INTO Products (ProductID, ProductName) VALUES (3, 'Chairs');
INSERT INTO Products_Tasks (ProductID, TaskID) VALUES (1, 1);
INSERT INTO Products_Tasks (ProductID, TaskID) VALUES (2, 1);
INSERT INTO Products_Tasks (ProductID, TaskID) VALUES (3, 1);
INSERT INTO Products_Tasks (ProductID, TaskID) VALUES (1, 2);
