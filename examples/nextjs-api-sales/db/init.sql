CREATE TABLE IF NOT EXISTS sales_people (
  person_id SERIAL PRIMARY KEY,
  name varchar(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS sales (
  sale_id SERIAL PRIMARY KEY,
  sale_name varchar(200) NOT NULL,
  sold_by INT,
  CONSTRAINT sold_by_fk
    FOREIGN KEY(sold_by)
      REFERENCES sales_people(person_id)
);

INSERT INTO sales_people (name)
select 'Salesperson ' || id
FROM GENERATE_SERIES(1, 50) as id;

INSERT INTO sales (sale_name, sold_by)
select 'Sale ' || id, floor(random() * 50 + 1)::int
FROM GENERATE_SERIES(1, 200) as id;
