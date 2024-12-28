import React from 'react';
import '../styles/Main.css';
import AddTransaction from '../financeModules/Transactions/addTransaction.js';
import TransactionList from '../financeModules/Transactions/transactionList.js';
import BudgetManagement from '../financeModules/Budgets/budgetManadment.js';
import Budgets from '../financeModules/Budgets/budgetList.js';
import Budget from '../financeModules/Budgets/Budget.js';
import AddMTransaction from '../financeModules/Transactions/addMTransaction.js';
import FinancialGoals from '../financeModules/financialGoal/financeGoal.js';
import { useTranslation } from 'react-i18next';
import CurrencyPanel from '../../integration/monobank/currencyPanel.js';

/**
 * Financial Management Dashboard
 *
 * This component renders a dashboard for managing finances, including:
 *  - Currency exchange rates (using CurrencyPanel)
 *  - Transaction management (AddTransaction, AddMTransaction, TransactionList)
 *  - Financial goal setting (FinancialGoals)
 *  - Budget management (Budget, BudgetManagement, Budgets)
 *  - Localized text labels (using useTranslation from react-i18next)
 *
 *  @author len_oli
 * 
 * @returns {JSX.Element} - JSX element representing the financial management dashboard
 */

function Category() {
  const { t } = useTranslation();

  return (
    <div>
      <div id='main'><br />
        <h2>{t('main.currency')}</h2>
        <CurrencyPanel />
      </div>
      <div className='home' id='main'><br />
        <h2>{t('main.transaction')}</h2><br />
        <div>
          <div>
            <AddTransaction /></div>
          <div style={{ marginTop: '5px' }}>
            <AddMTransaction></AddMTransaction><br />
          </div>
          <TransactionList /><br />
        </div></div>
      <div className='home' id='main'><br />
        <h2>{t('main.goal')}</h2><br />
        <div>
          <FinancialGoals /><br />
        </div>
      </div>
      <div className='home' id='main'><br />
        <h2>{t('main.budget')}</h2><br />
        <div>
          <h3>{t('main.total')}</h3><br />
          <Budget /><br /><br />
          <BudgetManagement />
          <h3>{t('main.bycategory')}</h3><br />
          <Budgets />
        </div>
      </div>
    </div>
  );
}

export default Category;