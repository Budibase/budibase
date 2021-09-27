SELECT 'CREATE DATABASE main'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'main')\gexec
CREATE TABLE Vehicles (
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    Registration text COLLATE pg_catalog."default",
    Make text COLLATE pg_catalog."default",
    Model text COLLATE pg_catalog."default",
    Colour text COLLATE pg_catalog."default",
    Year smallint,
    CONSTRAINT Vehicles_pkey PRIMARY KEY (id)
);

CREATE TABLE ServiceLog (
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    Description text COLLATE pg_catalog."default",
    VehicleId bigint,
    ServiceDate timestamp without time zone,
    Category text COLLATE pg_catalog."default",
    Mileage bigint,
    CONSTRAINT ServiceLog_pkey PRIMARY KEY (id),
    CONSTRAINT vehicle_foreign_key FOREIGN KEY (VehicleId)
        REFERENCES Vehicles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

INSERT INTO Vehicles (Registration, Make, Model, Colour, Year)
VALUES ('FAZ 9837','Volkswagen','Polo','White',2002);
INSERT INTO Vehicles (Registration, Make, Model, Colour, Year)
VALUES ('JHI 8827','BMW','M3','Black',2013);
INSERT INTO Vehicles (Registration, Make, Model, Colour, Year)
VALUES ('D903PI','Volvo','XC40','Grey',2014);
INSERT INTO Vehicles (Registration, Make, Model, Colour, Year)
VALUES ('YFI002','Volkswagen','Golf','Dark Blue',2018);
INSERT INTO Vehicles (Registration, Make, Model, Colour, Year)
VALUES ('HGT5677','Skoda','Octavia','Graphite',2009);
INSERT INTO Vehicles (Registration, Make, Model, Colour, Year)
VALUES ('PPF9276','Skoda','Octavia','Graphite',2021);
INSERT INTO Vehicles (Registration, Make, Model, Colour, Year)
VALUES ('J893FT','Toyota','Corolla','Red',2015);
INSERT INTO Vehicles (Registration, Make, Model, Colour, Year)
VALUES ('MJK776','Honda','HR-V','Silver',2015);


INSERT INTO ServiceLog (Description, VehicleId, ServiceDate, Category, Mileage)
VALUES ('Change front brakes', 1, '2021-05-04', 'Brakes', 20667);
INSERT INTO ServiceLog (Description, VehicleId, ServiceDate, Category, Mileage)
VALUES ('Tyres - full set', 1, '2021-05-04', 'Brakes', 20667);
INSERT INTO ServiceLog (Description, VehicleId, ServiceDate, Category, Mileage)
VALUES ('Engine tune up', 2, '2021-07-14', 'Brakes', 50889);
INSERT INTO ServiceLog (Description, VehicleId, ServiceDate, Category, Mileage)
VALUES ('Replace transmission', 3, '2021-09-26', 'Transmission', 98002);
