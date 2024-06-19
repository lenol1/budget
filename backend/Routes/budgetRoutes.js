const express = require('express');
const { getBudgets, createBudget, getBudgetById, updateBudget, deleteBudget } = require('../Controllers/budgetController');

const router = express.Router();

router.get('/:id', getBudgetById);
router.post('/', createBudget);
router.get('/', getBudgets);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;