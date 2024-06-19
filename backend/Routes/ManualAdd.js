const express = require('express');
const router = express.Router();
const Transaction = require('../Models/Transaction');
const User = require('../Models/User');
const authenticate = require('../middleware/authenticate');

// Додавання нової операції
router.post('/', authenticate, async (req, res) => {
    try {
        const { type, amount, description } = req.body;
        const transaction = new Transaction({
            user: req.user._id,
            type,
            amount,
            description
        });
        const result = await transaction.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Отримання всіх операцій для поточного користувача
router.get('/', authenticate, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id });
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Видалення операції
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        if (transaction.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await transaction.remove();
        res.status(200).json({ message: 'Transaction deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
