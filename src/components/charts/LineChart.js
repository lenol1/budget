import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import sortTransactions from '../financeModules/Transactions/sortTransactions';
import { useTranslation } from 'react-i18next';

Chart.register(...registerables);

const LineChart = () => {
  const { t } = useTranslation()
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Expense',
      data: [],
      fill: false,
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
    },
    {
      label: 'Income',
      data: [],
      fill: false,
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
    }],
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: '',
        color: 'white'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white'
        },
      },
      x: {
        ticks: {
          color: 'white'
        },
        grid: {
          display: false
        }
      }
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/transactions');
        const data = await response.json();
        let filteredData = sortTransactions(data);

        if (selectedCategory) {
          filteredData = filteredData.filter(transaction => transaction.category === selectedCategory);
        }

        if (startDate) {
          filteredData = filteredData.filter(transaction => new Date(transaction.date) >= new Date(startDate));
        }

        if (endDate) {
          filteredData = filteredData.filter(transaction => new Date(transaction.date) <= new Date(endDate));
        }
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
        const transactionsByDate = filteredData.reduce((acc, transaction) => {
          const date = new Date(transaction.date).toLocaleDateString(); 
          if (!acc[date]) {
            acc[date] = { income: 0, expense: 0 };
          }

          const category = categories.find(cat => cat._id === transaction.category);
          if (category && category.type === 'Income') {
            acc[date].income += transaction.amount;
          } else if (category && category.type === 'Expense') {
            acc[date].expense += Math.abs(transaction.amount);
          }

          return acc;
        }, {});
        
        const labels = Object.keys(transactionsByDate);
        const incomeData = labels.map(date => transactionsByDate[date].income);
        const expensesData = labels.map(date => transactionsByDate[date].expense);
        setChartData({
          labels,
          datasets: [{
            label: 'Expense',
            data: expensesData,
            fill: false,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
          },{
            label: 'Income',
            data: incomeData,
            fill: false,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, .85)',
            borderWidth: 2,
          }]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedCategory, categories, startDate, endDate]);

  return (
    <div style={{borderRadius:'8px'}}>
      <h2 style={{ marginBottom: '20px', textDecoration:'underline' }}>Total</h2>
      <div style={{backgroundColor:'rgba(3, 111, 226, 0.05)', borderRadius:'8px', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{backgroundColor:'rgba(3, 111, 226, 0.1)'}}>
            <th style={{color:'white'}}>{t('linegraph.category')}</th>
            <th style={{color:'white'}}>{t('linegraph.startdate')}</th>
            <th style={{color:'white'}}>{t('linegraph.enddate')}</th>
          </tr>
        </thead>
        <tbody>
              <tr style={{textAlign:'center'}} >
                <td>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </select>
                </td>
                <td ><input type="date" style={{width:'100px'}} value={startDate} onChange={(e) => setStartDate(e.target.value)} /></td>
                <td ><input type="date" style={{width:'100px'}} value={endDate} onChange={(e) => setEndDate(e.target.value)} /></td>
              </tr>

        </tbody>
      </table>
      </div>
      <Line data={chartData} options={options} width={150} height={50} />
    </div>
  );
};

export default LineChart;