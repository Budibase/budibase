SELECT 'CREATE DATABASE main'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'main')\gexec
CREATE SCHEMA test;
CREATE TABLE territories (
    territory_id character varying(20) PRIMARY KEY,
    territory_description character varying(60) NOT NULL
);
CREATE TABLE employees (
    employee_id smallint PRIMARY KEY,
    last_name character varying(20) NOT NULL,
    first_name character varying(10) NOT NULL,
    title character varying(30),
    title_of_courtesy character varying(25),
    birth_date date,
    hire_date date,
    address character varying(60),
    city character varying(15),
    region character varying(15),
    postal_code character varying(10),
    country character varying(15),
    home_phone character varying(24),
    extension character varying(4),
    photo bytea,
    notes text,
    reports_to smallint REFERENCES employees(employee_id),
    photo_path character varying(255)
);
CREATE TABLE employee_territories (
    employee_id smallint REFERENCES employees(employee_id),
    territory_id character varying(20) REFERENCES territories(territory_id),
    CONSTRAINT pk_employee_territories PRIMARY KEY (employee_id, territory_id)
);
