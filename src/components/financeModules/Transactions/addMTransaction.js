import React, { useState } from 'react';
import UserDashboard from '../../../integration/monobank/userDashBoard';
import { useTranslation } from 'react-i18next';

const AddMTransaction = () => {
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const { t } = useTranslation();

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token ) {
      setIsDashboardVisible(true);
    } else {
      setErrorMessage('Please provide both token and timeframe');
    }
  };

  return (
    <div>
      <button id='transactionForms' onClick={toggleFormVisibility}>
        {isFormVisible ? t('form.close') : t('form.monobank')}
      </button>
      <br />
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <br />
          <div className="highlighted-form">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h3 style={{ margin: '0', marginRight: '10px' }}>{t('form.monoconnection')}:</h3>
              <a href='https://api.monobank.ua/index.html' style={{ textDecoration: 'none', color: 'blue' }}>{t('form.token')}</a>
            </div>
            <br />
            <div className="input-container">
              <input
                id='transactionIB'
                type="password"
                placeholder=""
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <label for="transactionIB" class="labelM">{t('form.tokenplace')}</label>
            </div>
            {errorMessage && <p>{errorMessage}</p>}
            <br />
            <button id='transactionIB' type="submit">{t('form.confirm')}</button>
          </div>
        </form>
      )}<br/>
      {isDashboardVisible && <UserDashboard token={token}/>}
    </div>
  );
};

export default AddMTransaction;
