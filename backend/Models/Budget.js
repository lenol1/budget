const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  budgetAmount: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Budget = mongoose.model('Budget', BudgetSchema);
module.exports = Budget;
