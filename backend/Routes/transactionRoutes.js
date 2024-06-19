const express = require('express');
const { getTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction, getTransactionsByCategoryAndDateRange, updateTransactionAmount } = require('../Controllers/transactionController');

const router = express.Router();

router.get('/:id', getTransactionById);
router.get('/', getTransactions);
router.get('/category/:categoryId/:startDate/:endDate', getTransactionsByCategoryAndDateRange);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.patch('/:id', updateTransactionAmount);
router.delete('/:id', deleteTransaction);

module.exports = router;
