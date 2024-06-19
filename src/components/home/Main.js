import React from 'react';
import '../styles/Main.css';
import AddTransaction from '../financeModules/Transactions/addTransaction.js';
import TransactionList from '../financeModules/Transactions/transactionList.js';
import BudgetManagement from '../financeModules/Budgets/budgetManadment.js';
import Budgets from '../financeModules/Budgets/budgetList.js';
import Budget from '../financeModules/Budgets/Budget.js';
import AddMTransaction from '../financeModules/Transactions/addMTransaction.js';
import FinancialGoals from '../financeModules/financialGoal/financeGoal.js';

function Category() {
  
  return (
    <div>
    <div className='home' id='main'><br />
      <h2>Transactions</h2><br/>
      <div>
      <div>
        <AddTransaction /></div>
        <div style={{marginTop:'5px'}}>
        <AddMTransaction></AddMTransaction><br/>
        </div>
        <TransactionList /><br/>
      </div></div>
      <div className='home' id='main'><br />
      <h2>Financial Goals</h2><br/>
      <div>
        <FinancialGoals /><br/>
      </div>
    </div>
      <div className='home' id='main'><br />
      <h2>Budgets</h2><br/>
      <div>
        <BudgetManagement /><br/>
        <h3>Total</h3>
        <Budget/><br/>
        <h3>By Categories</h3>
        <Budgets />
      </div>
    </div>
    </div>
  );
}

export default Category;