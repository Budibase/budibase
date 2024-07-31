-- Create the first table
CREATE TABLE first_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Create the second table
CREATE TABLE second_table (
    id SERIAL PRIMARY KEY,
    first_table_id INT REFERENCES first_table(id),
    data TEXT NOT NULL
);

-- Insert 50 rows into the first table
DO
$$
BEGIN
    FOR i IN 1..50 LOOP
        INSERT INTO first_table (name, description)
        VALUES ('Name ' || i, 'Description ' || i);
    END LOOP;
END
$$;

-- Insert 10,000 rows into the second table, all related to the first row in the first table
DO
$$
BEGIN
    FOR i IN 1..10000 LOOP
        INSERT INTO second_table (first_table_id, data)
        VALUES (1, 'Data ' || i);
    END LOOP;
END
$$;
