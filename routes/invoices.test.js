// process.env.NODE_ENV = 'test';

// const request = require('supertest');
// const app = require('../app');
// const db = require('../db');

// let testInvoice;

// beforeEach(async () => {
//     const company = await db.query(
//         `INSERT INTO companies (code, name, description) VALUES ('apple', 'Apple Computer', 'Maker of OSX.') RETURNING code, name, description;`
//     );
//     const result = await db.query(
//         `INSERT INTO invoices (comp_Code, amt, paid, paid_date)
//         VALUES ('apple', 300, true, '2018-01-01') RETURNING id, comp_Code, amt, paid, add_date, paid_date`
//     );
//     testInvoice = result.rows[0];
// });

// afterEach(async () => {
//     await db.query(`DELETE FROM companies`);
// });

// afterAll(async () => {
//     await db.end();
// });

// describe('GET /invoices', () => {
//     test('Get a list with one invoice', async () => {
//         const res = await request(app).get('/invoices');
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({
//             invoices: [
//                 { id: testInvoice.id, comp_code: testInvoice.comp_code },
//             ],
//         });
//     });
// });

// describe('GET /invoices/:id', () => {
//     test('Get a list with one invoice', async () => {
//         const res = await request(app).get(`/invoices/${testInvoice.id}`);
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({ invoice: testInvoice });
//     });
//     test('Responds with 404 for invalid id', async () => {
//         const res = await request(app).get(`/invoices/0`);
//         expect(res.statusCode).toBe(404);
//     });
// });
