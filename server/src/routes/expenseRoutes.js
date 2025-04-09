const express = require('express');
const router = express.Router();
const { getTopExpenses } = require('../controllers/expenseController');

router.get('/top-expenses', getTopExpenses);

module.exports = router;
