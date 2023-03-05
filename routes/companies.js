const db = require('../db');
const ExpressError = require('../expressError');
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        const results = await db.query(
            `SELECT code, name, description FROM companies`
        );

        return res.json({ companies: results.rows });
    } catch (err) {
        return next(err);
    }
});

router.get('/:code', async function (req, res, next) {
    try {
        const { code } = req.params;

        const result = await db.query(
            `SELECT * FROM companies WHERE code = $1`,
            [code]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(
                `Can't find company with code of ${code}`,
                404
            );
        }

        const invoice = await db.query(
            `SELECT * FROM invoices WHERE comp_code = $1`,
            [code]
        );

        return res.json({ company: result.rows[0], invoices: invoice.rows });
    } catch (err) {
        return next(err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        const { code, name, description } = req.body;

        const result = await db.query(
            `INSERT INTO companies (code, name, description) 
           VALUES ($1, $2, $3)
           RETURNING code, name, description`,
            [code, name, description]
        );

        return res.status(201).json({ company: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

router.put('/:code', async function (req, res, next) {
    try {
        const { code } = req.params;
        const { name, description } = req.body;

        const result = await db.query(
            `UPDATE companies SET name=$1, description=$2
           WHERE code = $3
           RETURNING code, name, description`,
            [name, description, code]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(
                `Can't update company with code of ${code}`,
                404
            );
        }

        return res.json({ company: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

router.delete('/:code', async function (req, res, next) {
    try {
        const result = await db.query('DELETE FROM companies WHERE code = $1', [
            req.params.code,
        ]);

        return res.json({ message: 'Deleted' });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
