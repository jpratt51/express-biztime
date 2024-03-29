DROP DATABASE IF EXISTS test_biztime;

CREATE DATABASE test_biztime;

\c test_biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date text DEFAULT CURRENT_DATE NOT NULL,
    paid_date text,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);
