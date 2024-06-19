const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  accountId: { ref: 'Account', type: mongoose.Schema.Types.ObjectId },
  amount: Number,
  currency: String,
  transactionType: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  description: String,
  date: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
