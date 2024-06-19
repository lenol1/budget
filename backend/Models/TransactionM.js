const mongoose = require('mongoose');
const TransactionMSchema = new mongoose.Schema({
    accountId: { ref: 'Account', type: mongoose.Schema.Types.ObjectId },
    time: Number,
    description: String,
    mcc: Number,
    originalMcc: Number,
    amount: Number,
    operationAmount: Number,
    currencyCode: Number,
    commissionRate: Number,
    cashbackAmount: Number,
    balance: Number,
  });
const TransactionM = mongoose.model('TransactionM', TransactionMSchema);
module.exports = TransactionM;