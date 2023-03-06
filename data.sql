DROP DATABASE IF EXISTS biztime;

CREATE DATABASE biztime;

\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS companies_industries;

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

CREATE TABLE industries (
  code text PRIMARY KEY,
  name text NOT NULL UNIQUE
);

INSERT INTO companies (code, name, description)
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

CREATE TABLE companies_industries (
  comp_code text NOT NULL REFERENCES companies,
  ind_code text NOT NULL REFERENCES industries,
  PRIMARY KEY(comp_code, ind_code)
);

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries (code, name)
  VALUES ('tech', 'Technology'),
         ('mrkt', 'Marketing'),
         ('ag', 'Agriculture');

INSERT INTO companies_industries (comp_code, ind_code)
  VALUES ('apple', 'tech'),
         ('ibm', 'tech'),
         ('apple', 'mrkt'),
         ('ibm', 'mrkt');

SELECT comp.name, ind.code FROM companies AS comp
  JOIN companies_industries AS ci
    ON comp.code = ci.comp_code
  JOIN industries AS ind
    ON ci.ind_code = ind.code;