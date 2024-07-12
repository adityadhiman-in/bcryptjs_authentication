CREATE TABLE users(
    id INT PRIMARY KEY;
    email VARCHAR NOT NULL UNIQUE;
    password VARCHAR;
)