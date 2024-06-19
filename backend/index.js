const express = require('express');
const app = express();
const cors = require("cors");
const connectToDatabase = require('./DB/ConnectDB');
const registerRoute = require('./Routes/Register');
const loginRoute = require('./Routes/Login');
const userRoutes = require('./Routes/userRoutes');
const accountRoutes = require('./Routes/accountRoutes');
const transactionRoutes = require('./Routes/transactionRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const budgetRoutes = require('./Routes/budgetRoutes');
const financialGoalRoutes = require('./Routes/financialGoalRoutes');
const { LinearRegression } = require('ml-regression');

connectToDatabase();

console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("App is Working");
});

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/users", userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', financialGoalRoutes);

app.post('/api/regression', (req, res) => {
  try {
      const { independent_variables, dependent_variable } = req.body;

      if (!independent_variables || !dependent_variable) {
          return res.status(400).json({ error: "Invalid input data" });
      }

      const regression = new LinearRegression(independent_variables, dependent_variable);
      const coefficients = regression.coefficients;
      const intercept = regression.intercept;

      res.json({ intercept, coefficients });
  } catch (error) {
      console.error('Regression Error:', error); // Log error to the server console
      res.status(500).json({ error: 'Internal server error' });
  }
});
  
  app.post('/api/optimize', (req, res) => {
    const { costs, constraints, resources } = req.body;
    const optimalExpenses = costs.map(cost => cost * 0.9); 
  
    const totalCost = optimalExpenses.reduce((acc, expense) => acc + expense, 0);
  
    res.json({ optimal_expenses: optimalExpenses, total_cost: totalCost });
  });

app.listen(5000);