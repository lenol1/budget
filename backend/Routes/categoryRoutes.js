const express = require('express');
const { getCategoryById, getCategories, createCategory, updateCategory, deleteCategory } = require('../Controllers/categoryController');

const router = express.Router();

router.get('/:id', getCategoryById);
router.get('/', getCategories);
router.post('/', createCategory);
router.put('/', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;