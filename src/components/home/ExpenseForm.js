import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ExpenseAnalysis = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regressionResults, setRegressionResults] = useState(null);
  const [optimizationResults, setOptimizationResults] = useState(null);
  const { nextMonthPrediction } = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
    fetchBudgets();
  }, [t]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data.filter(category => category.type !== 'Income'));
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

  const fetchBudgets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/budgets');
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError('Error fetching budgets');
    }
  };

  const filterTransactionsByDate = (transactions, startDate, endDate) => {
    if (!startDate && !endDate) return transactions;
    const start = startDate ? new Date(startDate) : new Date('1970-01-01');
    const end = endDate ? new Date(endDate) : new Date();
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
  };

  const calculateCategoryExpenses = (filteredTransactions) => {
    const categoryExpenses = categories.reduce((acc, category) => {
      acc[category._id] = 0;
      return acc;
    }, {});

    filteredTransactions.forEach(transaction => {
      if (categoryExpenses.hasOwnProperty(transaction.category)) {
        categoryExpenses[transaction.category] += parseFloat(transaction.amount);
      }
    });

    return categoryExpenses;
  };

  const getTopCategories = (categoryExpenses, topN = 3) => {
    const sortedCategories = Object.entries(categoryExpenses).sort(([, a], [, b]) => b - a);
    return sortedCategories.slice(0, topN);
  };

  const performRegression = async () => {
    try {
      const filteredTransactions = filterTransactionsByDate(transactions, startDate, endDate);
      const expensesData = filteredTransactions.map(transaction => parseFloat(transaction.amount));

      const response = await axios.post('http://localhost:5000/api/regression', {
        independent_variables: expensesData.map((_, index) => [index]),
        dependent_variable: expensesData
      });

      setRegressionResults(response.data);
    } catch (error) {
      console.error('Error performing regression:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        config: error.config,
        request: error.request,
        response: error.response
      });
    }
  };

  const performOptimization = async () => {
    try {
      const filteredTransactions = filterTransactionsByDate(transactions, startDate, endDate);
      const categoryExpenses = calculateCategoryExpenses(filteredTransactions);

      const costs = Object.values(categoryExpenses);
      const constraints = Object.keys(categoryExpenses).map(() => [1]);
      const resources = [1000];

      const response = await axios.post('http://localhost:5000/api/optimize', {
        costs, constraints, resources
      });

      const optimizedExpenses = response.data.optimal_expenses;

      const optimizationDetails = Object.keys(categoryExpenses).map((categoryId, index) => {
        const budgetEntry = budgets.find(budget => budget.categoryId === categoryId);
        const budget = budgetEntry ? budgetEntry.budgetAmount : 0;
        return {
          categoryId,
          currentExpense: categoryExpenses[categoryId],
          optimalExpense: optimizedExpenses[index],
          status: categoryExpenses[categoryId] > budget ? t('budget.overuse') : t('budget.underuse')
        };
      });

      setOptimizationResults({
        total_cost: response.data.total_cost,
        details: optimizationDetails
      });
    } catch (error) {
      console.error('Error performing optimization:', error);
    }
  };

  const closeRegressionResults = () => setRegressionResults(null);
  const closeOptimizationResults = () => setOptimizationResults(null);

  if (loading) {
    return <div>{t('form.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!categories.length || !transactions.length || !budgets.length) {
    return <div>{t('form.empty')}</div>;
  }

  const filteredTransactions = filterTransactionsByDate(transactions, startDate, endDate);
  const categoryExpenses = calculateCategoryExpenses(filteredTransactions);
  const topCategories = getTopCategories(categoryExpenses);

  const pieChartData = {
    labels: topCategories.map(([categoryId]) => {
      const category = categories.find(cat => cat._id === categoryId);
      return category ? t(`transactionL.${category.name}`) : t('category.uknown');
    }),
    datasets: [{
      data: topCategories.map(([, expense]) => expense),
      backgroundColor: ['rgb(214, 40, 40)', 'rgb(0, 48, 73)', 'rgb(252, 191, 73)'],
      borderColor: 'white',
      borderWidth: 1,
    }]
  };

  const barChartData = {
    labels: categories.map(category => t(`transactionL.${category.name}`)),
    datasets: [{
      label: t('budget.totalexp'),
      data: categories.map(category => {
        const expenses = filteredTransactions.filter(transaction => transaction.category === category._id);
        return expenses.reduce((total, transaction) => total + parseFloat(transaction.amount), 0);
      }),
      backgroundColor: 'blue',
      borderColor: 'blue',
      borderWidth: 1,
    }, {
      label: t('budget.budget'),
      data: categories.map(category => {
        const budgetEntry = budgets.find(budget => budget.categoryId === category._id);
        return budgetEntry ? budgetEntry.budgetAmount : 0;
      }),
      backgroundColor: 'grey',
      borderColor: 'grey',
      borderWidth: 1,
    }]
  };

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'left', marginBottom: '20px', textDecoration: 'underline' }}>{t('analyse.expense')}</h2>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <table style={{ width: '200%', borderCollapse: 'collapse', alignItems: 'center' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(3, 111, 226, 0.1)' }}>
              <th style={{ color: 'white', padding: '5px 5px 0 5px' }}>{t('linegraph.startdate')}</th>
              <th style={{ color: 'white', padding: '5px 5px 0 10px' }}>{t('linegraph.enddate')}</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ textAlign: 'center', backgroundColor: 'rgba(3, 111, 226, 0.1)' }} >
              <td ><input type="date" style={{ width: '100px', marginLeft: '10px' }} value={startDate} onChange={(e) => setStartDate(e.target.value)} /></td>
              <td ><input type="date" style={{ width: '100px', marginLeft: '10px' }} value={endDate} onChange={(e) => setEndDate(e.target.value)} /></td>
            </tr>
          </tbody>
        </table>
      </div><br />
      <h3>{t('analyse.top')}</h3>
      <div style={{ height: '200px', margin: '20px 0', textAlign: 'center' }}>
        <Pie data={pieChartData} style={{ backgroundColor: 'rgba(3, 111, 226, 0.01)', borderRadius: '8px' }} />
      </div>
      <br />
      <div style={{ height: '200px', margin: '20px 0', textAlign: 'center' }}>
        <h3>{t('analyse.category')}</h3><br />
        <Bar data={barChartData} options={barChartOptions} width={'1000px'} style={{ backgroundColor: 'rgba(3, 111, 226, 0.01)', borderRadius: '8px' }} />
      </div>
      <br />
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ alignItems: 'center' }}>
          <button onClick={performRegression} style={{ marginLeft: '-30px', marginRight: '10px', width: '60%', borderRadius: '8px' }}>{t('analyse.regresult')}</button>
          <button onClick={performOptimization} style={{ width: '60%', borderRadius: '8px' }}>{t('analyse.optresult')}</button>
        </div>
        {regressionResults && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={closeRegressionResults} style={{ marginBottom: '10px', borderRadius: '8px' }}>{t('analyse.close')}</button>
            <p>{t('analyse.intercept')}: {regressionResults.intercept}</p>
            <ul>
              {regressionResults.coefficients.map((coeff, index) => (
                <li key={index}>{t('analyse.coef')} {index + 1}: {coeff}</li>
              ))}
            </ul>
            {nextMonthPrediction !== null && (
              <div>
                <h3>{t('analyse.predict')}: {nextMonthPrediction.toFixed(2)} UAH</h3>
              </div>
            )}
          </div>
        )}
        {optimizationResults && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={closeOptimizationResults} style={{ marginBottom: '10px', borderRadius: '8px' }}>{t('analyse.close')}</button><br />
            <p>{t('analyse.totalam')}: {optimizationResults.total_cost.toFixed(2)} UAH</p>
            <table style={{ color: 'white', width: '80%', margin: '20px auto', borderCollapse: 'collapse', backgroundColor: 'rgba(3, 111, 226, 0.05)' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>{t('form.category')}</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>{t('budget.currentexp')} (UAH)</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>{t('budget.amount')} (UAH)</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>{t('budget.status')}</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>{t('budget.optimalexp')} (UAH)</th>
                </tr>
              </thead>
              <tbody>
                {optimizationResults.details.map(({ categoryId, currentExpense, optimalExpense, status }) => {
                  const category = categories.find(cat => cat._id === categoryId);
                  const budgetEntry = budgets.find(budget => budget.categoryId === categoryId);
                  const budgetAmount = budgetEntry ? budgetEntry.budgetAmount : 'N/A';
                  return (
                    <tr style={{ textAlign: 'center' }} key={categoryId}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{category ? t(`transactionL.${category.name}`) : 'Unknown'}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{currentExpense.toFixed(2)}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{budgetAmount}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{status}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{optimalExpense.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseAnalysis;