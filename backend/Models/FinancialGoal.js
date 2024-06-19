const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  goal: { type: String, required: true,},
  amount: { type: Number, required: true,},
  currentAmount: { type: Number, default: 0,},
  endDate: { type: Date, required: true,},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,},
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
