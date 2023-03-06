const db = require('../db');
const ExpressError = require('../expressError');
const express = require('express');
const router = express.Router();

router.post('/', async function (req, res, next) {
    try {
        const { code, name } = req.body;

        const result = await db.query(
            `INSERT INTO industries (code, name) 
            VALUES ($1, $2)
            RETURNING code, name`,
            [code, name]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Invalid input`, 404);
        }

        return res.status(201).json({ industry: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

router.get('/', async function (req, res, next) {
    try {
        const results = await db.query(`SELECT code FROM industries`);

        return res.json({ industries: results.rows });
    } catch (err) {
        return next(err);
    }
});

router.get('/:code', async function (req, res, next) {
    try {
        const { code } = req.params;

        const result = await db.query(
            `SELECT comp.name, ind.code 
            FROM companies AS comp
            JOIN companies_industries AS ci
              ON comp.code = ci.comp_code
            JOIN industries AS ind
              ON ci.ind_code = ind.code
            WHERE ind.code = $1`,
            [code]
        );

        const results = result.rows;

        return res.json({ company: results });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
