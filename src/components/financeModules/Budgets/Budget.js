import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';

const Budget = () => {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchAccounts();
    fetchCategories();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/accounts');
      const data = await response.json();
      setAccounts(data);
      console.log(accounts);
      fetchTransactions();
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Error fetching accounts');
    }
  };
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
      const filteredTransactions = data.filter(transaction =>
        accounts.every(account => account._id === transaction.accountId)
      );
      setTransactions(filteredTransactions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Error fetching transactions');
      setLoading(false);
    }
  };
  const getMonthTransactions = (month) => {
    if (month === "") {
      return transactions;
    } else {
      const monthNumber = new Date(2000, monthOptions.findIndex(option => option.props.value === month), 1).getMonth() + 1;
      return transactions.filter(transaction => new Date(transaction.date).getMonth() + 1 === monthNumber);
    }
  };

  const calculateTotals = (monthTransactions) => {
    let totalIncome = 0;
    let totalExpenses = 0;

    monthTransactions.forEach(transaction => {
      const category = categories.find(cat => cat._id === transaction.category);
      if (category) {
        if (category.type === 'Income') {
          totalIncome += parseFloat(transaction.amount);
        } else if (category.type === 'Expense') {
          totalExpenses += parseFloat(transaction.amount);
        }
      }
    });

    return { totalIncome, totalExpenses };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{color:'white'}}>No data</div>;
  }

  const hasAccounts = accounts.length > 0;

  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const monthName = new Date(2000, index, 1).toLocaleString('default', { month: 'long' });
    return <option key={index} value={monthName}>{monthName}</option>;
  });

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const monthTransactions = getMonthTransactions(selectedMonth);
  const { totalIncome, totalExpenses } = calculateTotals(monthTransactions);
  const isOverBudget = totalExpenses > totalIncome;

  const chartData = {
    labels: ['Доходи', 'Витрати'],
    datasets: [{
      data: [totalIncome, totalExpenses],
      backgroundColor: isOverBudget ? ['rgb(255, 99, 132)', 'rgb(255, 0, 0)'] : ['rgb(54, 162, 235)', 'rgb(255, 99, 132)'],
      borderColor: 'white',
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      {hasAccounts ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.95)', backgroundColor: 'rgba(3, 111, 226, 0.05)' }}>
          <tbody>
            <tr>
              <td style={{ padding: '10px' }}>
                <p>Total Income: {totalIncome} UAH</p>
                <p>Total Expenses: {Math.round(totalExpenses * 100)/100} UAH</p>
                {isOverBudget && <p style={{ color: 'red' }}>Over Budget by: {Math.round((totalExpenses - totalIncome) * 100)/100} UAH</p>}<br />
                <select value={selectedMonth} onChange={handleMonthChange}>
                  <option value="">All Months</option>
                  {monthOptions}
                </select>
              </td>
              <td style={{ width: '200px', padding: '10px' }}>
                <Doughnut data={chartData} options={chartOptions} width={'100px'} height={'100px'}/>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No accounts available</p>
      )}
    </div>
  );
};

export default Budget;
