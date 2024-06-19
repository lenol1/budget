const express = require('express');
const { getGoals, addGoal, updateGoal, deleteGoal } = require('../Controllers/financialGoalController');
const router = express.Router();

router.post('/', addGoal);
router.get('/', getGoals);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

module.exports = router;