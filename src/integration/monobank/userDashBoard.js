import React, { useState, useEffect } from 'react';
import monobankApiClient from './monobankAPIClient';

const currencyCodes = {
    980: 'UAH',
    840: 'USD',
    978: 'EUR',
};

const UserDashboard = ({ token }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [timeframe, setTimeframe] = useState(7);
    const [visibleTransactions, setVisibleTransactions] = useState(10);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const currentDate = new Date();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await monobankApiClient.getUserInfoAsync(token);
                setUserInfo(response.data);
            } catch (error) {
                setError(error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Error fetching categories');
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

        fetchUserInfo();
        fetchCategories();
        fetchAccounts();
    }, [token]);

    const fetchTransactions = async () => {
        try {
            const to = Math.floor(Date.now() / 1000);
            const from = to - (timeframe * 24 * 60 * 60);
            const transactionsResponse = await monobankApiClient.getUserTransactionsAsync(token, from, to);
            setTransactions(transactionsResponse.data);

            let accountIds = selectedAccount ? [selectedAccount] : userInfo.accounts.map(account => account.id);
            const accountTransactionsResponse = await monobankApiClient.getUserAllTransactionsAsync(token, accountIds, from, to);
            let filteredTransactions = accountTransactionsResponse.data;

            if (selectedCategory) {
                filteredTransactions = filteredTransactions.filter(transaction => transaction.category === selectedCategory);
            }

            setAllTransactions(filteredTransactions);
        } catch (error) {
            setError(error);
        }
    };

    const saveTransactionsToDB = async (transactions) => {
        try {
            for (const transaction of transactions) {
                const regex = /(.+) - (.+)/;

                const matches = (transaction.accountId).match(regex);
                let account = accounts.find(account => account.name === transaction.accountName||account.bankName === transaction.bankName);
                if (matches) {
                    const accountNumber = matches[1]; 
                    const bankName = matches[2]; 
                    account = accounts.find(account => account.name === accountNumber||account.bankName === bankName);
                } else {
                    console.error("Unable to parse account ID");
                }
                const accountId = account ? account._id : null;
                const amount = Math.abs(transaction.amount / 100);
                const currency = currencyCodes[transaction.currencyCode];
                const transactionType = 'Card Payment';
                const categoryId = categories.find(category => category.name === transaction.category);
                const category = categoryId ? categoryId._id : null;
                const description = transaction.description;
                const newTransaction = {
                    accountId,
                    amount: parseFloat(amount),
                    currency,
                    transactionType,
                    category,
                    description,
                    date: new Date(transaction.time * 1000)
                };
                const response = await fetch('http://localhost:5000/api/transactions', {
                    method: "post",
                    body: JSON.stringify(newTransaction),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                console.warn(result);
            }
        } catch (error) {
            console.error('Error saving transactions:', error);
        }
    };

    const handleAccountChange = (e) => {
        setSelectedAccount(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleTimeframeChange = (e) => {
        setTimeframe(e.target.value);
    };

    const handleFetchTransactions = () => {
        fetchTransactions();
    };

    const isTransactionThisMonth = (transactionDate) => {
        const transactionMonth = new Date(transactionDate).getMonth();
        const transactionYear = new Date(transactionDate).getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        return transactionMonth === currentMonth && transactionYear === currentYear;
    };

    const getCurrencySymbol = (currencyCode) => {
        return currencyCodes[currencyCode] || currencyCode;
    };

    const handleSaveData = () => {
        setIsModalOpen(true);
        setTransactionToEdit(0);
    };

    const handleModalSave = () => {
        saveTransactionsToDB(allTransactions);
        setIsModalOpen(false);
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    const handleAccountSelectChange = (e, index) => {
        const updatedTransactions = [...allTransactions];
        setSelectedAccount(e.target.value);
        updatedTransactions[index].accountId = e.target.value;
        setAllTransactions(updatedTransactions);
    };

    const handleCategorySelectChange = (e, index) => {
        const updatedTransactions = [...allTransactions];
        updatedTransactions[index].category = e.target.value;
        setAllTransactions(updatedTransactions);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{backgroundColor:'rgba(3, 111, 226, 0.1)', borderRadius:'8px'}}><br/>
            <h2 style={{textAlign:'center'}}>User Dashboard</h2>
            <h3 style={{textAlign:'center'}}>Name: {userInfo.name}</h3>
            <h3 style={{padding:'0px 20px'}}>Accounts:</h3>
            <ul style={{ color: 'white' }}>
                {userInfo.accounts.map(account => (
                    <li key={account.id}>
                        {account.type}: {account.balance / 100} {getCurrencySymbol(account.currencyCode)}
                    </li>
                ))}
            </ul>
            <label htmlFor="accountSelect" style={{padding:'0px 0px 0px 20px'}}>Select Account:</label>
            <select value={selectedAccount} onChange={handleAccountChange}>
                <option value=""> All Accounts </option>
                {userInfo.accounts.map(account => (
                    <option key={account.id} value={account.id}>
                        {account.type}: {getCurrencySymbol(account.currencyCode)}
                    </option>
                ))}
            </select>
            <label htmlFor="timeframeSelect">| Select Timeframe (from 1 up to 31 days): </label>
            <input style={{width:'40px', marginRight:'10px', padding:'0px 0px 0px 5px', borderRadius:'3px',}}
                id="timeframeSelect" 
                type="number" 
                value={timeframe} 
                onChange={handleTimeframeChange} 
                min="1" 
                max="30" 
            />
            <button style={{width:'20%', borderRadius:'3px'}} onClick={handleFetchTransactions}> Fetch Transactions</button><br/>
            <h2 style={{padding:'0px 20px'}}>Transactions:</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', color:'white' }}>
                <thead>
                    <tr style={{ backgroundColor: 'rgba(3, 111, 226, 0.1)' }}>
                        <th id='transactionsList'>Amount</th>
                        <th id='transactionsList'>Currency</th>
                        <th id='transactionsList'>Description</th>
                        <th id='transactionsList'>Date</th>
                    </tr>
                </thead>
                <tbody style={{ overflowY: 'auto' }}>
                    {allTransactions.slice(0, visibleTransactions).map((transaction, index) => (
                        <tr key={transaction.id} style={{ backgroundColor: isTransactionThisMonth(transaction.date) ? 'rgba(3, 111, 226, 0.1)' : 'transparent', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.9)' }}>
                            <td id='transactionsList'>{parseFloat(transaction.amount / 100)}</td>
                            <td id='transactionsList'>{getCurrencySymbol(transaction.currencyCode)}</td>
                            <td id='transactionsList'>{transaction.description}</td>
                            <td id='transactionsList'>{new Date(transaction.time * 1000).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {allTransactions.length > visibleTransactions && (
                <button onClick={() => setVisibleTransactions(prev => prev + 10)}>Show More Transactions</button>
            )}
            {visibleTransactions > 10 && (
                <button onClick={() => setVisibleTransactions(10)}>Close Transactions</button>
            )}<br/>
            <button onClick={handleSaveData} style={{width:'15%', borderRadius:'3px', marginLeft:'5px', marginBottom:'20px',border:'1px solid white'}} > Save Data</button><br/>

            {isModalOpen && (
                <div className="modal" style={modalStyle}>
                    <div className="modal-content" style={modalContentStyle}>
                        <h2 style={{color:'black', textDecoration:'underline'}}>Select Account and Category for Each Transaction</h2>
                        <div style={{maxHeight: '400px', overflowY: 'auto'}}><br/>
                            {allTransactions.map((transaction, index) => (
                                <div key={transaction.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <p style={{ color: 'black', flex: '1', marginRight: '10px', minWidth: '30%' }}>{transaction.description}: {parseFloat(transaction.amount / 100)} {getCurrencySymbol(transaction.currencyCode)}</p>
                                <select style={{ flex: '1', borderRadius: '5px', marginRight: '5px', minWidth: '10%' }} value={transaction.accountId} onChange={(e) => handleAccountSelectChange(e, index)}>
                                    <option value="">Select Account</option>
                                    {accounts.map(account => (
                                        <option key={account.id} value={account.id}>
                                            {( account.accountNumber|| account.bankName) + ' - ' + ( account.bankName ||account.accountNumber )}
                                        </option>
                                    ))}
                                </select>
                                <select style={{ flex: '1', marginLeft: '5px', borderRadius: '5px', minWidth: '10%' }} value={transaction.category || ""} onChange={(e) => handleCategorySelectChange(e, index)}>
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            
                            ))}<br/>
                        </div><br/>
                        <button style={{borderRadius:'5px', width:'10%'}} onClick={handleModalSave}>Save</button>
                        <button style={{borderRadius:'5px', width:'10%', marginLeft:'24px'}} onClick={handleModalClose}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const modalStyle = {
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    borderRadius:'8px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
};

const modalContentStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: '15% auto',
    padding: '20px',
    border: '1px solid #888',
    width: '60%',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius:'8px'
};

export default UserDashboard;
