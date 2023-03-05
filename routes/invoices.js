const db = require('../db');
const ExpressError = require('../expressError');
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        const results = await db.query(`SELECT id, comp_Code FROM invoices`);

        return res.json({ invoices: results.rows });
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;

        const result = await db.query(`SELECT * FROM invoices WHERE id = $1`, [
            id,
        ]);

        if (result.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id of ${id}`, 404);
        }

        return res.json({ invoice: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        const { comp_Code, amt, paid, paid_date } = req.body;

        const result = await db.query(
            `INSERT INTO invoices (comp_Code, amt, paid, paid_date)
            VALUES ($1, $2, $3, $4) RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_Code, amt, paid, paid_date]
        );

        return res.status(201).json({ invoice: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        const { comp_Code, amt, paid, paid_date } = req.body;

        const result = await db.query(
            `UPDATE invoices SET comp_Code=$1, amt=$2, paid=$3, paid_date=$4
           WHERE id = $5
           RETURNING id, comp_Code, amt, paid, add_date, paid_date`,
            [comp_Code, amt, paid, paid_date, id]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(
                `Can't update invoice with code of ${id}`,
                404
            );
        }

        return res.json({ company: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        const result = await db.query('DELETE FROM invoices WHERE id = $1', [
            req.params.id,
        ]);

        return res.json({ message: 'Deleted' });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
