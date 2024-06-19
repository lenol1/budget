const express = require('express');
const { getAccountById, getAccounts, createAccount, updateAccount, deleteAccount } = require('../controllers/accountController');
const router = express.Router();

router.get('/:id', getAccountById);
router.get('/', getAccounts);
router.post('/', createAccount);
router.put('/', updateAccount);
router.delete('/:id', deleteAccount);

module.exports = router;
