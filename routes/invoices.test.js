process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testInvoice;

beforeEach(async () => {
    const company = await db.query(
        `INSERT INTO companies (code, name, description) VALUES ('apple', 'Apple Computer', 'Maker of OSX.') RETURNING code, name, description;`
    );
    const result = await db.query(
        `INSERT INTO invoices (comp_Code, amt, paid, paid_date)
        VALUES ('apple', 300, true, '2018-01-01') RETURNING id, comp_Code, amt, paid, add_date, paid_date`
    );
    testInvoice = result.rows[0];
});

afterEach(async () => {
    await db.query(`DELETE FROM companies`);
});

afterAll(async () => {
    await db.end();
});

describe('GET /invoices', () => {
    test('Get a list with one invoice', async () => {
        const res = await request(app).get('/invoices');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            invoices: [
                {
                    comp_code: testInvoice.comp_code,
                    id: testInvoice.id,
                },
            ],
        });
    });
});

describe('GET /invoices/:id', () => {
    test('Get a list with one invoice', async () => {
        const res = await request(app).get(`/invoices/${testInvoice.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            invoice: {
                add_date: testInvoice.add_date,
                amt: testInvoice.amt,
                comp_code: testInvoice.comp_code,
                id: testInvoice.id,
                paid: testInvoice.paid,
                paid_date: testInvoice.paid_date,
            },
        });
    });
    test('Responds with 404 for invalid id', async () => {
        const res = await request(app).get(`/invoices/0`);
        expect(res.statusCode).toBe(404);
    });
});

describe('POST /invoices', () => {
    test('Creates a single invoice', async () => {
        const res = await request(app).post('/invoices').send({
            comp_Code: 'apple',
            amt: 1000,
            paid: false,
            paid_date: null,
        });
        console.log(res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            invoice: {
                comp_code: 'apple',
                amt: 1000,
                paid: false,
                paid_date: null,
            },
        });
    });
    test('Responds with 404 for invalid entry', async () => {
        const res = await request(app).put(`/invoices`).send({
            comp_Code: 'apple',
        });
        expect(res.statusCode).toBe(404);
    });
});

describe('PUT /invoices/:id', () => {
    test('Updates a single invoice', async () => {
        const res = await request(app).put(`/invoices/${testInvoice.id}`).send({
            amt: 1200,
            paid: true,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            company: {
                comp_code: testInvoice.comp_code,
                amt: 1200,
                paid: true,
                paid_date: expect.any(String),
                id: testInvoice.id,
                add_date: testInvoice.add_date,
            },
        });
    });
    test('Responds with 404 for invalid id', async () => {
        const res = await request(app).put(`/invoices/0`).send({
            amt: 150,
            paid: true,
            paid_date: '2023-03-05',
        });
        expect(res.statusCode).toBe(404);
    });
});

describe('DELETE /invoices/:id', () => {
    test('Deletes a single invoice', async () => {
        const res = await request(app).delete(`/invoices/${testInvoice.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted' });
    });
});
