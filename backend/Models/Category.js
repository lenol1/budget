const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: String,
  type: String, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
