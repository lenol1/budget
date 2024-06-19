import React, { useState, useEffect } from 'react';
import monobankApiClient from './monobankAPIClient';

const MonobankAccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const token = 'u5fGLXcHpkaP71bToo7mTuaJJtccPkqdAH_FeDY11-Vo'; // Замість цього додайте реальний токен користувача

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await monobankApiClient.getUserInfoAsync(token);
        const userInfo = response.data;
        setAccounts(userInfo.accounts);
      } catch (error) {
        setError(error);
      }
    };

    fetchUserInfo();
  }, [token]);

  return (
    <div>
      <h2>Monobank Accounts</h2>
      {error && <p style={{color: 'red'}}>Error fetching user info: {error.message}</p>}
      <ul>
        {accounts.map(account => (
          <li key={account.id}>
            <p>Account ID: {account.id}</p>
            <p>Balance: {account.balance / 100} {account.currencyCode}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonobankAccountList;
