import React, { useState, useEffect } from 'react';
import sortTransactions from './sortTransactions';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleTransactions, setVisibleTransactions] = useState(10);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const currentDate = new Date();

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions');
      const data = await response.json();
      setTransactions(sortTransactions(data));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/accounts');
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(category => category._id === categoryId);
    return category ? category.name : categoryId;
  };

  const isTransactionThisMonth = (transactionDate) => {
    const transactionMonth = new Date(transactionDate).getMonth();
    const transactionYear = new Date(transactionDate).getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return transactionMonth === currentMonth && transactionYear === currentYear;
  };

  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction);
    setEditModalOpen(true);
  };

  const handleDeleteClick = async (transactionId) => {
    try {
      await fetch(`http://localhost:5000/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });
      setTransactions(transactions.filter(transaction => transaction._id !== transactionId));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${currentTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentTransaction),
      });
      const updatedTransaction = await response.json();
      setTransactions(transactions.map(transaction =>
        transaction._id === updatedTransaction._id ? updatedTransaction : transaction
      ));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error editing transaction:', error);
    }
  };

  return (
    <div style={{ color: 'white', overflowY: 'auto', maxHeight: '600px' }}>
      {accounts.length > 0 ? (
        accounts.map(account => (
          <div key={account._id} style={{ marginBottom: '40px'}}>
            <h2>Account № {account.accountNumber} ({account.bankName})</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{backgroundColor:'rgba(3, 111, 226, 0.1)' }}>
                  <th id='transactionsList'>Amount</th>
                  <th id='transactionsList'>Currency</th>
                  <th id='transactionsList'>Type</th>
                  <th id='transactionsList'>Category</th>
                  <th id='transactionsList'>Description</th>
                  <th id='transactionsList'>Date</th>
                  <th id='transactionsList'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .filter(transaction => transaction.accountId === account._id)
                  .slice(0, visibleTransactions)
                  .map(transaction => (
                    <tr key={transaction._id} style={{backgroundColor: isTransactionThisMonth(transaction.date) ? 'rgba(3, 111, 226, 0.1)' : 'transparent', boxShadow:' 0 4px 8px rgba(0, 0, 0, 0.9)'}}>
                      <td id='transactionsList'>{parseFloat(transaction.amount)}</td>
                      <td id='transactionsList'>{transaction.currency}</td>
                      <td id='transactionsList'>{transaction.transactionType}</td>
                      <td id='transactionsList'>{getCategoryName(transaction.category)}</td>
                      <td id='transactionsList'>{transaction.description}</td>
                      <td id='transactionsList'>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td id='transactionsList'>
                        <button style={{width:'50%'}} onClick={() => handleEditClick(transaction)}>Edit</button>
                        <button onClick={() => handleDeleteClick(transaction._id)}>Х</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {transactions.filter(transaction => transaction.accountId === account._id).length > visibleTransactions && (
              <button onClick={() => setVisibleTransactions(prev => prev + 10)}>Show More Transactions</button>
            )}
            {visibleTransactions > 10 && ( 
              <button onClick={() => setVisibleTransactions(10)}>Close Transactions</button>
            )}
          </div>
        ))
      ) : (
        <p>No accounts found.</p>
      )}

      {editModalOpen && (
        <div className="modal" style={{display:'grid', placeItems:'center', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgb(255,255,255,0.8)', padding: '20px', zIndex: 1000 }}>
          <h2 style={{color:'black'}}>Edit Transaction</h2><br/>
          <form onSubmit={handleEditSubmit}>
              <input id='transactionI'
                type="number"
                value={currentTransaction.amount}
                onChange={(e) => setCurrentTransaction({ ...currentTransaction, amount: e.target.value })}
              />
              <input id='transactionI'
                type="text"
                value={currentTransaction.currency}
                onChange={(e) => setCurrentTransaction({ ...currentTransaction, currency: e.target.value })}
              />
              <input id='transactionI'
                type="text"
                value={currentTransaction.transactionType}
                onChange={(e) => setCurrentTransaction({ ...currentTransaction, transactionType: e.target.value })}
              />
              <select id='transactionI'
                value={currentTransaction.category}
                onChange={(e) => setCurrentTransaction({ ...currentTransaction, category: e.target.value })}
              >
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
              <input id='transactionI'
                type="text"
                value={currentTransaction.description}
                onChange={(e) => setCurrentTransaction({ ...currentTransaction, description: e.target.value })}
              />
              <input id='transactionI'
                type="date"
                value={new Date(currentTransaction.date).toISOString().substr(0, 10)}
                onChange={(e) => setCurrentTransaction({ ...currentTransaction, date: e.target.value })}
              />
            <br />
            <button id='transactionI' type="submit">Save</button>
            <button id='transactionI' type="button" onClick={() => setEditModalOpen(false)}>Cancel</button>
          </form>
        </div>
      )}

      {editModalOpen && <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setEditModalOpen(false)} />}
    </div>
  );
};

export default TransactionList;
