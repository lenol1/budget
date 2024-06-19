import React, { useState, useEffect } from 'react';
import AddCategory from '../Categories/addCategory';

const AddBudget = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBudget = {
      categoryId,
      budgetAmount: parseFloat(budgetAmount),
      startDate,
      endDate
    };
    try {
      const response = await fetch('http://localhost:5000/api/budgets', {
        method: 'POST',
        body: JSON.stringify(newBudget),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      if (response.ok) {
        
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Error adding budget:', error);
      setErrorMessage('Internal server error');
    }
  };
const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
};
function refreshPage(){ 
  window.location.reload(); 
};
  return (
  <div>
    <button id='transactionForms' onClick={toggleFormVisibility}>
        {isFormVisible ? 'Close Form' : 'New Budget'}
      </button>
      {isFormVisible && (
      <form onSubmit={handleSubmit}> <br />
      <div className="highlighted-form">
      <div>
        <select id='transactionIB' value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select><AddCategory />
      </div>
      <div>
        <input id='transactionIB' type="number" placeholder="Budget Amount" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} required />
      </div>
      <div>
        <input id='transactionIB' type="date" placeholder='Start Date' value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      </div>
      <div>
        <input id='transactionIB' type="date" placeholder='End Date' value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      </div><br />
      {errorMessage && <p>{errorMessage}</p>}
      <button id='transactionIB' onClick={refreshPage} type="submit">Add Budget</button>
      </div>
    </form>
    )}
    </div>
  );
};

export default AddBudget;
