/*import React, { useState, useEffect } from 'react';
import monobankApiClient from './monobankAPIClient';
import sortTransactions from '../../components/financeModules/Transactions/sortTransactions';

const TransactionListM = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentDate = new Date();

  const fetchMonobankTransactions = async () => {
    const token = 'u5fGLXcHpkaP71bToo7mTuaJJtccPkqdAH_FeDY11-Vo'; // Замініть на реальний токен користувача
    setLoading(true);

    try {
      const userInfoResponse = await monobankApiClient.getUserInfoAsync(token);
      const userInfo = userInfoResponse.data;
      const accountIds = userInfo.accounts.map(account => account.id);
      
      let allTransactions = [];
      const from = Math.floor(new Date('2023-01-01').getTime() / 1000); // Початковий час виписки в Unix
      const to = Math.floor(new Date().getTime() / 1000); // Кінцевий час виписки в Unix

      for (const accountId of accountIds) {
        let hasMoreTransactions = true;
        let currentTo = to;

        while (hasMoreTransactions) {
          const response = await monobankApiClient.getStatementsAsync(token, accountId, from, currentTo);
          const transactions = response.data;
          allTransactions = allTransactions.concat(transactions);
          if (transactions.length < 500) {
            hasMoreTransactions = false;
          } else {
            currentTo = transactions[transactions.length - 1].time - 1;
          }
        }
      }

      setTransactions(sortTransactions(allTransactions));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const isTransactionThisMonth = (transactionDate) => {
    const transactionMonth = new Date(transactionDate * 1000).getMonth();
    const transactionYear = new Date(transactionDate * 1000).getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return transactionMonth === currentMonth && transactionYear === currentYear;
  };

  return (
    <div>
      <button onClick={fetchMonobankTransactions} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Monobank Transactions'}
      </button>
      <div style={{ maxHeight: '400px', overflowY: 'auto', color: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(3, 111, 226, 0.1)' }}>
              <th>Account ID</th>
              <th>Amount</th>
              <th>Currency Code</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map(transaction => (
                <tr key={transaction.id} style={{ backgroundColor: isTransactionThisMonth(transaction.time) ? 'rgba(3, 111, 226, 0.1)' : 'transparent', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.9)' }}>
                  <td>{transaction.accountId}</td>
                  <td>{parseFloat(transaction.amount / 100).toFixed(2)}</td>
                  <td>{transaction.currencyCode}</td>
                  <td>{transaction.description}</td>
                  <td>{new Date(transaction.time * 1000).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionListM;*/
