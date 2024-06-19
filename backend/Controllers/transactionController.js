const { Transaction, Account, Category } = require('../Models/index');
const { get_objectId } = require('../storage/get_setObject');

const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('category');
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTransactionsByCategoryAndDateRange = async (req, res) => {
  try {
    const { categoryId, startDate, endDate } = req.params;
    const transactions = await Transaction.find({ 
      category: categoryId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { accountId, amount, currency, transactionType, category, description, date } = req.body;
    const account = await Account.findById(req.body.accountId);
    const _category = await Category.findById(req.body.category);
    
    if (!account || !category) {
      return res.status(404).json({ message: 'Account or category not found' });
    }
    const userId = get_objectId();
    if (!account) {
      account = new Account({
        userId: userId,
        bankName,
        accountNumber,
        balance: 0,
      });
      await account.save();
    }

    const newTransaction = new Transaction({
      accountId: account._id,
      amount,
      currency,
      transactionType,
      category: _category._id,
      description,
      date
    });

    const transaction = await newTransaction.save();
    
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    account.transactions.push(transaction._id);
    await account.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { accountId, amount, currency, transactionType, category, description, date } = req.body;
    const account = await Account.findById(accountId);
    const _category = await Category.findById(category);
    if (!account || !_category) {
      return res.status(404).json({ message: 'Account or category not found' });
    }

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.accountId = account._id;
    transaction.amount = amount;
    transaction.currency = currency;
    transaction.transactionType = transactionType;
    transaction.category = _category._id;
    transaction.description = description;
    transaction.date = date;

    await transaction.save();

    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTransactionAmount = async (req, res) => {
  try {
    const { amount } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.amount = amount;

    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const accountId = transaction.accountId;
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    account.transactions = account.transactions.filter(id => id.toString() !== req.params.id);
    await account.save();

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTransactionById,
  getTransactions,
  getTransactionsByCategoryAndDateRange,
  createTransaction,
  updateTransaction,
  updateTransactionAmount,
  deleteTransaction
};
