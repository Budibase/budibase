CREATE TABLE IF NOT EXISTS sales_people (
  person_id INT NOT NULL,
  name varchar(200) NOT NULL,
  PRIMARY KEY (person_id)
);

CREATE TABLE IF NOT EXISTS sales (
  sale_id INT NOT NULL,
  sale_name varchar(200) NOT NULL,
  sold_by INT,
  PRIMARY KEY (sale_id),
  CONSTRAINT sold_by_fk
    FOREIGN KEY(sold_by)
      REFERENCES sales_people(person_id)
);

INSERT INTO sales_people
select id, concat('Sales person ', id)
FROM GENERATE_SERIES(1, 50) as id;

INSERT INTO sales
select id, concat('Sale ', id), floor(random() * 50 + 1)::int
FROM GENERATE_SERIES(1, 200) as id;