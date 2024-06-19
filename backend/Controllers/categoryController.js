const { Category, Budget } = require('../Models/index');
const { get_objectId } = require('../storage/get_setObject');

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    const category = new Category({ name, type });
    await category.save();
    
    const userId = get_objectId();
    const categoryId = category._id;
    const budgetAmount = 100;
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); 
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const budget = null;
    if(category.type != 'Income'){
      const budget = new Budget({ userId, categoryId, budgetAmount, startDate, endDate });
      await budget.save();
    }
    res.status(201).json({ category, budget });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = name;
    category.type = type;

    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  getCategoryById,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
