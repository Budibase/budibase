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
    Type person_job

CREATE TABLE IF NOT EXISTS public."Employee"
(
    id integer NOT NULL,
    name text COLLATE pg_catalog."default",
    CONSTRAINT "Employee_pkey" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
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

INSERT INTO public."Employee" ("id", "name") VALUES (1, 'Alice');
INSERT INTO public."Employee" ("id", "name") VALUES (2, 'Bob');
CREATE TABLE IF NOT EXISTS public."Skills"
(
    id integer NOT NULL,
    name text COLLATE pg_catalog."default",
    CONSTRAINT "Skills_pkey" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);
CREATE TABLE Products (
    ProductID SERIAL PRIMARY KEY,
    ProductName varchar(255)

INSERT INTO public."Skills" ("id", "name") VALUES (1, 'Docker');
INSERT INTO public."Skills" ("id", "name") VALUES (2, 'Microservices');
INSERT INTO public."Skills" ("id", "name") VALUES (3, 'Kubernetes');
INSERT INTO public."Skills" ("id", "name") VALUES (4, 'Spring');
CREATE TABLE IF NOT EXISTS public."jt_employee_skills_Skills_employee"
(
    employee_id integer,
    skills_id integer,
    id integer NOT NULL,
    CONSTRAINT "jt_employee_skills_Skills_employee_pkey" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
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

insert into public."jt_employee_skills_Skills_employee" ("id", "employee_id", "skills_id") VALUES (1, 1, 1);
insert into public."jt_employee_skills_Skills_employee" ("id", "employee_id", "skills_id") VALUES (2, 1, 2);
insert into public."jt_employee_skills_Skills_employee" ("id", "employee_id", "skills_id") VALUES (3, 1, 3);
insert into public."jt_employee_skills_Skills_employee" ("id", "employee_id", "skills_id") VALUES (4, 2, 2);
insert into public."jt_employee_skills_Skills_employee" ("id", "employee_id", "skills_id") VALUES (5, 2, 3);
insert into public."jt_employee_skills_Skills_employee" ("id", "employee_id", "skills_id") VALUES (6, 2, 4);
