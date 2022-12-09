SELECT 'CREATE DATABASE main'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'main')\gexec

CREATE TABLE IF NOT EXISTS public."Employee"
(
    id integer NOT NULL,
    name text COLLATE pg_catalog."default",
    CONSTRAINT "Employee_pkey" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

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

insert into public."jt_employee_skills_Skills_employee" ("id", "employee_id", "skills_id") VALUES (1, 1, 1);
insert into public."jt_employee_skills_Skills_employee" ("id", "employee_id", "skills_id") VALUES (2, 1, 2);
insert into public."jt_employee_skills_Skills_employee" ("id", "employee_id", "skills_id") VALUES (3, 1, 3);
insert into public."jt_employee_skills_Skills_employee" ("id", "employee_id", "skills_id") VALUES (4, 2, 2);
insert into public."jt_employee_skills_Skills_employee" ("id", "employee_id", "skills_id") VALUES (5, 2, 3);
insert into public."jt_employee_skills_Skills_employee" ("id", "employee_id", "skills_id") VALUES (6, 2, 4);
