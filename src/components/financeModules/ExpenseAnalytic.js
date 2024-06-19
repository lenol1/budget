import axios from 'axios';
import React, { useState, useEffect } from 'react';
import PieChart from '../../components/charts/PieChart';
import { Line } from 'react-chartjs-2';

const ExpenseAnalysis = () => {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [optimizationResults, setOptimizationResults] = useState(null);
  const [regressionResults, setRegressionResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Error fetching categories');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions');
      const data = await response.json();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Error fetching transactions');
      setLoading(false);
    }
  };

  const performOptimization = async () => {
    const costs = categories.map(cat => cat.cost);
    const constraints = transactions.map(trans => [trans.amount]);
    const resources = [1000];

    try {
        const response = await axios.post('http://127.0.0.1:5000/api/optimize', {
            costs, constraints, resources
        });
        setOptimizationResults(response.data);
    } catch (error) {
        console.error('Error performing optimization:', error);
       
    }
};

const performRegression = async () => {
    const X = transactions.map(trans => [trans.amount, trans.date]);
    const y = transactions.map(trans => trans.amount);

    try {
        const response = await axios.post('http://127.0.0.1:5000/api/regression', {
            independent_variables: X, dependent_variable: y
        });
        setRegressionResults(response.data);
    } catch (error) {
        console.error('Error performing regression:', error);
       
    }
};
  useEffect(() => {
    performOptimization();
    performRegression();
  }, [transactions, categories]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ width: '100%', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.95)', backgroundColor:'rgba(3, 111, 226, 0.05)' }}>
      <h2>Expense Analysis</h2>
      
      {optimizationResults && (
        <div>
          <h3>Optimization Results</h3>
          <p>Total Cost: {optimizationResults.total_cost}</p>
          <ul>
            {optimizationResults.optimal_expenses.map((expense, index) => (
              <li key={index}>Expense {index + 1}: {expense}</li>
            ))}
          </ul>
        </div>
      )}

      {regressionResults && (
        <div>
          <h3>Regression Results</h3>
          <p>Intercept: {regressionResults.intercept}</p>
          <ul>
            {regressionResults.coefficients.map((coeff, index) => (
              <li key={index}>Coefficient {index + 1}: {coeff}</li>
            ))}
          </ul>
        </div>
      )}

      <PieChart data={{
        labels: categories.map(cat => cat.name),
        datasets: [{
          data: transactions.map(trans => trans.amount),
          backgroundColor: categories.map((_, index) => `hsl(${index * 40}, 70%, 50%)`),
          borderColor: 'white',
          borderWidth: 1,
        }]
      }} />

      <Line data={{
        labels: transactions.map(trans => new Date(trans.date).toLocaleDateString()),
        datasets: [{
          label: 'Transaction Amounts',
          data: transactions.map(trans => trans.amount),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }]
      }} />
    </div>
  );
};

export default ExpenseAnalysis;
