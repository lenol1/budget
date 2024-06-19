const { Budget, Transaction, Category } = require('../Models/index');
const {get_objectId} = require('../storage/get_setObject');

const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id).populate('category');
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getBudgets = async (req, res) => {
  try {
    const userId = get_objectId();
    const budgets = await Budget.find({ userId });
    const budgetsWithTransactions = await Promise.all(budgets.map(async budget => {
      const transactions = await Transaction.find({
        category: budget.categoryId,
        date: { $gte: budget.startDate, $lte: budget.endDate } 
      });
      const totalAmount = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
      const category = await Category.findById(budget.categoryId);
      return { ...budget.toObject(), totalSpent: totalAmount, categoryName: category.name }; 
    }));
    res.json(budgetsWithTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createBudget = async (req, res) => {
  try {
    const userId = get_objectId();
    const { categoryId, budgetAmount, startDate, endDate } = req.body;
    const newBudget = new Budget({
      userId,
      categoryId,
      budgetAmount,
      startDate,
      endDate
    });
    const budget = await newBudget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { budgetAmount, startDate, endDate } = req.body;
    const budget = await Budget.findByIdAndUpdate(req.params.id, { budgetAmount, startDate, endDate }, { new: true });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget
};
