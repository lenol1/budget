import React, { useState } from 'react';
import UserDashboard from '../../../integration/monobank/userDashBoard';

const AddMTransaction = () => {
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);

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
        {isFormVisible ? 'Close Form' : 'Connect Monobank'}
      </button>
      <br />
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <br />
          <div className="highlighted-form">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h3 style={{ margin: '0', marginRight: '10px' }}>Follow the link and generate a token:</h3>
              <a href='https://api.monobank.ua/index.html' style={{ textDecoration: 'none', color: 'blue' }}>Monobank Token</a>
            </div>
            <br />
            <div>
              <input
                id='transactionIB'
                type="password"
                placeholder="Paste token here"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
            {errorMessage && <p>{errorMessage}</p>}
            <br />
            <button id='transactionIB' type="submit">Confirm</button>
          </div>
        </form>
      )}<br/>
      {isDashboardVisible && <UserDashboard token={token}/>}
    </div>
  );
};

export default AddMTransaction;
