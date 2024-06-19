import React, { useState } from 'react';

const AddCategory = () => {
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!type) {
      return;
    }
    console.log('Додавання категорії:', name);
    setShowAddCategoryForm(false);
    try {
        const response = await fetch('http://localhost:5000/api/categories', {
            method: "post",
            body: JSON.stringify({name, type}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        console.warn(result);
        if (response.ok) {
            
        } else {
            setErrorMessage(result.message);
        }
    } catch (error) {
        console.error('Error adding transaction:', error);
        setErrorMessage("Internal server error");
    }
  };

  return (
    <div id='insert_button'>
    <button id='insert_button' onClick={() => setShowAddCategoryForm(true)}>+</button>
    {showAddCategoryForm && (
      <div id='add_category'>
        <span id='exit_span' onClick={() => setShowAddCategoryForm(false)}>x</span>
        <div className='input-container'>
        <input className='add_accountIB' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category" />
        <select className='add_accountIB' value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Select type</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <button className='add_accountIB' onClick={handleAddCategory}>Add</button>
        </div>
      </div>
    )}
    {errorMessage && <p>{errorMessage}</p>}
  </div>
  );
};

export default AddCategory;
