import React, { useState, useEffect } from 'react';
import PieChart from '../../charts/PieChart';
import { useTranslation } from 'react-i18next';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const { t } = useTranslation();

  const fetchBudgets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/budgets');
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
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

  const updateBudget = async (budgetId, newAmount, newStartDate, newEndDate) => {
    try {
      const response = await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          budgetAmount: newAmount,
          startDate: newStartDate,
          endDate: newEndDate
        })
      });
      if (response.ok) {
        fetchBudgets();
      } else {
        console.error('Error updating budget');
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const deleteBudget = async (budgetId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setBudgets(budgets.filter(budget => budget._id !== budgetId));
      } else {
        console.error('Error deleting budget');
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };
  useEffect(() => {
    fetchBudgets();
    fetchAccounts();
  }, []);

  const toggleFormVisibility = (budgetId) => {
    setEditingBudgetId(prevId => (prevId === budgetId ? null : budgetId));
  };

  const hasAccounts = accounts.length > 0;

  return (
    <div>
      {hasAccounts ? (
        <div>
          {budgets.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {budgets.map(budget => {
                  const remainingAmount = budget.budgetAmount - budget.totalSpent;
                  const isOverBudget = remainingAmount < 0;

                  const chartData = {
                    labels: [t('budget.spent'), isOverBudget ? t('budget.over') : t('budget.remain')],
                    datasets: [{
                      data: [budget.totalSpent, Math.abs(remainingAmount)],
                      backgroundColor: [
                        'rgb(255, 99, 132)',
                        isOverBudget ? 'rgb(255, 0, 0)' : 'rgb(54, 162, 235)'
                      ],
                      borderColor: 'white',
                      borderWidth: 1,
                    }]
                  };

                  return (
                    <tr key={budget._id} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.95)', backgroundColor: 'rgba(3, 111, 226, 0.05)' }}>
                      <td style={{ padding: '10px' }}>
                        <h4>{t(`transactionL.${budget.categoryName}`)}: {budget.budgetAmount} UAH</h4>
                        <p>{t('budget.spent')}: {Math.round(budget.totalSpent * 100) / 100} UAH</p>
                        <p style={{ color: isOverBudget ? 'red' : 'white' }}>
                          {isOverBudget ? t('budget.over') + ` ${-(Math.round(remainingAmount * 100) / 100)} UAH` : t('budget.remain') + `: ${Math.round(remainingAmount * 100) / 100} UAH`}
                        </p>
                        <p>{t('budget.from')} {new Date(budget.startDate).toLocaleDateString()} {t('budget.to')} {new Date(budget.endDate).toLocaleDateString()}</p>
                        <button style={{ width: '5%', marginTop: '10px', backgroundColor: 'transparent' }} onClick={() => toggleFormVisibility(budget._id)}>
                          {editingBudgetId === budget._id ?
                            <img src="/../materials/cancel.png" alt="cancel" style={{ width: '20px' }} /> :
                            <img src="/../materials/edit.png" alt="edit" style={{ width: '20px' }} />}</button>
                        <button style={{ width: '5%', marginLeft: '5px', backgroundColor: 'transparent' }} onClick={ () =>{deleteBudget(budget._id);}}>
                          <img src="/../materials/delete.png" alt="delete" style={{ width: '20px' }} />
                        </button>
                        {editingBudgetId === budget._id && (
                          <div>
                            <input style={{ width: '10%', marginLeft: '10px', borderRadius: '5px', textAlign: 'center' }}
                              type="number"
                              value={budget.budgetAmount}
                              onChange={(e) => updateBudget(budget._id, e.target.value, budget.startDate, budget.endDate)}
                            />
                            <input style={{ width: '12%', marginLeft: '10px', borderRadius: '5px', textAlign: 'center' }}
                              type="date"
                              value={new Date(budget.startDate).toISOString().substring(0, 10)}
                              onChange={(e) => updateBudget(budget._id, budget.budgetAmount, e.target.value, budget.endDate)}
                            />
                            <input style={{ width: '12%', marginLeft: '10px', borderRadius: '5px', textAlign: 'center' }}
                              type="date"
                              value={new Date(budget.endDate).toISOString().substring(0, 10)}
                              onChange={(e) => updateBudget(budget._id, budget.budgetAmount, budget.startDate, e.target.value)}
                            />
                          </div>
                        )}
                      </td>
                      <td style={{ width: '250px', padding: '10px' }}>
                        <PieChart data={chartData} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>{t('budget.empty')}</p>
          )}
        </div>
      ) : (
        <p>{t('transaction.empty')}</p>
      )}
    </div>
  );
};

export default Budgets;