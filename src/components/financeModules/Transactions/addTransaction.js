import React, { useState, useEffect } from 'react';
import AddAccount from '../Accounts/addAccount.js';
import AddCategory from '../Categories/addCategory.js';
import { useTranslation } from 'react-i18next';

const AddTransaction = () => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const currencies = ['UAH', 'USD', 'EUR', 'GBP', 'CAD'];
  const [transactionType, setTransactionType] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchAccounts();
    fetchCategories();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountId || !amount || !currency || !transactionType || !category || !date) {
      return;
    }
    const newTransaction = {
      accountId,
      amount: parseFloat(amount),
      currency,
      transactionType,
      category,
      description,
      date
    };
    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: "post",
        body: JSON.stringify(newTransaction),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      console.warn(result);
      if (response.ok) {
        setTimeout(() => {
          fetchCategories();
        }, 1000);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      setErrorMessage("Internal server error");
    }
  };
  function formatCardNumber(cardNumber) {
    if (!cardNumber || cardNumber.length !== 16) {
      return cardNumber;
    }
    const firstPart = cardNumber.substring(0, 4);
    const lastPart = cardNumber.substring(12, 16);
    const maskedPart = '**** ****';
    return `${firstPart} ${maskedPart} ${lastPart}`;
  }
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };
  function refreshPage() {
    window.location.reload();
  };
  return (
    <div>
      <button id='transactionForms' onClick={toggleFormVisibility}>
        {isFormVisible ? t('form.close') : t('form.transaction')}
      </button><br />
      {isFormVisible && (
        <form onSubmit={handleSubmit}> <br />
          <div className="highlighted-form">
            <div>
              <select id='transactionIB' style={{ display: 'inline-block' }} value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                <option id='transactionIB' value="">{t('transaction.account')}</option>
                {accounts.map(account => (
                  <option key={account._id} value={account._id}>{account.bankName} - {formatCardNumber(account.accountNumber)}</option>
                ))}
              </select> <AddAccount />
            </div>
            <div className="input-container">
              <input id='transactionIB' type="number" placeholder="" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <label for="transactionIB" class="labelA">{t('transaction.amount')}</label>
            </div>
            <div>
              <select id='transactionIB' style={{ display: 'inline-block' }} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="">{t('transaction.currency')}</option>
                {currencies.map((currency, index) => (
                  <option key={index} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <div>
              <select id='transactionIB' value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                <option value="">{t('transaction.type')}</option>
                <option value="Cash Transaction">{t('transaction.cash')}</option>
                <option value="Card Transaction">{t('transaction.card')}</option>
              </select>
            </div>
            <div>
              <select id='transactionIB' style={{ display: 'inline-block' }} value={category} onChange={(e) => setCategory(e.target.value)} >
                <option id='transactionIB' value="">{t('transaction.category')}</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{t(`transactionL.${category.name}`)}</option>
                ))}
              </select><AddCategory />
            </div>
            <div className="input-container">
              <input id='transactionIB' type="text" value={description} placeholder="" onChange={(e) => setDescription(e.target.value)} />
              <label for="transactionIB" class="labelA">{t('transaction.description')}</label>
            </div>
            <div className="input-container">
              <input id='transactionIB' type="date" value={date} placeholder="Date" onChange={(e) => setDate(e.target.value)} />
              <label for="transactionIB" class="labelA">{t('transaction.date')}</label>
            </div>
            {errorMessage && <p>{errorMessage}</p>}
            <br /><button id='transactionIB' onClick={refreshPage} type="submit">{t('transaction.submit')}</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddTransaction;