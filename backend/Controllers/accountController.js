const { Account } = require('../Models/index');
const {get_objectId} = require('../storage/get_setObject');

const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id).populate('transactions');
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAccounts = async (req, res) => {
  try {
    const userId = get_objectId();
    const accounts = await Account.find({ userId });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createAccount = async (req, res) => {
  const userId = get_objectId();
  try {
    const {bankName, accountNumber, balance } = req.body;
    const newAccount = new Account({
      userId: userId,
      bankName,
      accountNumber,
      balance
    });
    const account = await newAccount.save();
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { bankName, accountNumber, balance } = req.body;
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    account.bankName = bankName;
    account.accountNumber = accountNumber;
    account.balance = balance;

    await account.save();

    res.json(account);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    await Account.findByIdAndDelete(req.params.id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  getAccountById,
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount
};
