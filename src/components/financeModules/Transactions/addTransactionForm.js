import React, { useState } from 'react';
import axios from 'axios';

const AddTransactionForm = () => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    bankName: '',
    userId: '',
    amount: 0,
    currency: '',
    transactionType: '',
    category: '',
    description: '',
    date: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/transactions', formData);
      console.log('Transaction added:', response.data);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Account Number" />
      <input name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" />
      <input name="userId" value={formData.userId} onChange={handleChange} placeholder="User ID" />
      <input name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="Amount" />
      <input name="currency" value={formData.currency} onChange={handleChange} placeholder="Currency" />
      <input name="transactionType" value={formData.transactionType} onChange={handleChange} placeholder="Transaction Type" />
      <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
      <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
      <input name="date" type="date" value={formData.date} onChange={handleChange} placeholder="Date" />
      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default AddTransactionForm;
