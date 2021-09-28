SELECT 'CREATE DATABASE main'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'main')\gexec
CREATE TABLE jsonTable (
    id character varying(32),
    data jsonb,
    text text
);

INSERT INTO jsonTable (id, data) VALUES ('1', '{"id": 1, "age": 1, "name": "Mike", "newline": "this is text with a\n newline in it"}');

CREATE VIEW jsonView AS SELECT
	x.id,
	x.age,
	x.name,
	x.newline
FROM
	jsonTable c,
	LATERAL jsonb_to_record(c.data) x (id character varying(32),
		age BIGINT,
		name TEXT,
		newline TEXT
		);
