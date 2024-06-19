const Goal = require('../Models/FinancialGoal'); 
const { get_objectId } = require('../storage/get_setObject');

// Отримати всі цілі користувача
const getGoals = async (req, res) => {
  try {
    const userId = get_objectId();
    const goals = await Goal.find({ userId: userId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals' });
  }
};

// Додати нову ціль
const addGoal = async (req, res) => {
  const { goal, amount, endDate } = req.body;

  if (!goal || !amount || !endDate) {
    return res.status(400).json({ message: 'Please provide goal, amount, and end date' });
  }

  try {
    const userId = get_objectId();
    const newGoal = new Goal({
      goal,
      amount,
      endDate,
      userId: userId,
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error adding goal' });
  }
};

// Оновити ціль
const updateGoal = async (req, res) => {
  const { goal: newGoal, amount, endDate, currentAmount } = req.body;

  try {
    const userId =  get_objectId(); 
    const goalToUpdate = await Goal.findById(req.params.id);

    if (!goalToUpdate || goalToUpdate.userId.toString() !== userId.toString()) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (newGoal !== undefined) goalToUpdate.goal = newGoal;
    if (amount !== undefined) goalToUpdate.amount = amount;
    if (endDate !== undefined) goalToUpdate.endDate = endDate;
    if (currentAmount !== undefined) goalToUpdate.currentAmount = currentAmount;

    const updatedGoal = await goalToUpdate.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal' });
  }
};

// Видалити ціль
const deleteGoal = async (req, res) => {
  try {
    const userId =  get_objectId(); 
    const goalToDelete = await Goal.findById(req.params.id);

    if (!goalToDelete || goalToDelete.userId.toString() !== userId.toString()) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal' });
  }
};

module.exports = {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
};
