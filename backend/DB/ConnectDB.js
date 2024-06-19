const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/', {
            dbName: 'BudgetApp'
        });
        console.log('Connected to database');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}

module.exports = connectToDatabase;