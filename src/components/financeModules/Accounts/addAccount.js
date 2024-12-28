import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AddAccount = () => {
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();

  const handleAddAccount = async () => {
    console.log('Додавання рахунку:', bankName);
    setShowAddAccountForm(false);
    try {
      const response = await fetch('http://localhost:5000/api/accounts', {
        method: "post",
        body: JSON.stringify({ bankName, accountNumber, balance }),
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
            <input className='add_accountIB' style={{ width: '100%' }} type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="" />
            <label class="labelC">{t('account.bank')}</label>
            <input className='add_accountIB' type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="" />
            <label class="labelH" style={{ left: '35%' }}>{t('account.account')}</label>
            <input className='add_accountIB' type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="" />
            <label class="labelH" style={{ left: '69%' }}>{t('account.balance')}</label>
            <button className='add_accountIB' style={{ textAlign: 'center' }} onClick={handleAddAccount}>{t('category.add')}</button>
          </div>
        </div>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default AddAccount;