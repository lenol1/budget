import React, { useState } from 'react';

const AddAccount = () => {
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddAccount = async () => {
        console.log('Додавання рахунку:', bankName);
    setShowAddAccountForm(false);
    try {
        const response = await fetch('http://localhost:5000/api/accounts', {
            method: "post",
            body: JSON.stringify({bankName, accountNumber, balance}),
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
      <button id='insert_button' onClick={() => setShowAddAccountForm(true)}>+</button>
      {showAddAccountForm && (
        <div id='add_account'>
          <span id='exit_span' onClick={() => setShowAddAccountForm(false)}>x</span>
          <div className='input-container'>
          <input className='add_accountIB' type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Bank name" />
          <input className='add_accountIB' type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account number" />
          <input className='add_accountIB' type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="Balance" />
          <button className='add_accountIB' onClick={handleAddAccount}>Add</button>
          </div>
        </div>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default AddAccount;