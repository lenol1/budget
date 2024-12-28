import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { useTranslation } from 'react-i18next';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [addingAmount, setAddingAmount] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/goals');
      const data = await response.json();
      setGoals(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Error fetching goals');
      setLoading(false);
    }
  };

  const addGoal = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ goal, amount, endDate, currentAmount: 0 })
      });
      if (response.ok) {
        fetchGoals();
        clearForm();
      } else {
        console.error('Error adding goal');
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const updateGoal = async (goalId, updatedGoal) => {
    try {
      const response = await fetch(`http://localhost:5000/api/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedGoal)
      });
      if (response.ok) {
        fetchGoals();
        clearForm();
      } else {
        console.error('Error updating goal');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await fetch(`http://localhost:5000/api/goals/${goalId}`, {
        method: 'DELETE'
      });
      setGoals(goals.filter(goal => goal._id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const addAmountToGoal = async (goalId, amountToAdd) => {
    const goal = goals.find(g => g._id === goalId);
    const newCurrentAmount = parseFloat(goal.currentAmount) + parseFloat(amountToAdd);

    try {
      const response = await fetch(`http://localhost:5000/api/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...goal, currentAmount: newCurrentAmount })
      });
      if (response.ok) {
        fetchGoals();
        setAddingAmount(false);
        setAmountToAdd('');
        setSelectedGoal(null);
      } else {
        console.error('Error adding amount to goal');
      }
    } catch (error) {
      console.error('Error adding amount to goal:', error);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setGoal(goal.goal);
    setAmount(goal.amount);
    setEndDate(new Date(goal.endDate).toISOString().substring(0, 10));
    setCurrentAmount(goal.currentAmount);
    setIsFormVisible(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingGoal) {
      updateGoal(editingGoal._id, { goal, amount, endDate, currentAmount });
    } else {
      addGoal();
    }
  };

  const handleCancelEdit = () => {
    clearForm();
  };

  const clearForm = () => {
    setEditingGoal(null);
    setGoal('');
    setAmount('');
    setEndDate('');
    setCurrentAmount('');
    setIsFormVisible(false);
  };

  const getProgress = (currentAmount, goalAmount) => {
    return (currentAmount / goalAmount) * 100;
  };

  const toggleFormVisibility = () => {
    console.log('Toggling form visibility:', !isFormVisible);
    setIsFormVisible(!isFormVisible);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <button id='transactionForms' onClick={toggleFormVisibility}>
        {isFormVisible ? t('form.close') : t('form.addgoal')}
      </button>
      <br /><br />
      {isFormVisible && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', backgroundColor: 'rgba(3, 111, 226, 0.05)' }}>
          <div className="input-container">
            <input id='transactionIB'
              type="text"
              placeholder=""
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
            <label for="transactionIB" class="labelA">{t('goal.goal')}</label>
          </div>
          <div className="input-container">
            <input id='transactionIB'
              type="number"
              placeholder=""
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <label for="transactionIB" class="labelA">{t('goal.amount')}</label>
          </div>
          <div className="input-container">
          <input id='transactionIB'
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <label for="transactionIB" class="labelA">{t('transaction.date')}</label>
          </div>
          {editingGoal && (
            <div className="input-container">
              <input id='transactionIB'
                type="number"
                placeholder=""
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                required
              />
              <label for="transactionIB" class="labelA">{t('goal.current')}</label>
            </div>
          )}<br />
          <button id='transactionIB' type="submit">{editingGoal ? t('goal.update') : t('goal.add')}</button>
          {editingGoal && <button type="button" id='transactionIB' onClick={handleCancelEdit}>{t('form.cancel')}</button>}
        </form>
      )}
      {goals.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {goals.map(goal => {
              const progress = getProgress(goal.currentAmount, goal.amount);
              const isOverdue = new Date(goal.endDate) < new Date();

              const chartData = {
                labels: [t('chart.complete'), t('chart.remain')],
                datasets: [{
                  data: [goal.currentAmount, goal.amount - goal.currentAmount],
                  backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 99, 132)'],
                  borderColor: 'white',
                  borderWidth: 1,
                }]
              };

              return (
                <tr key={goal._id} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.95)', backgroundColor: 'rgba(3, 111, 226, 0.05)' }}>
                  <td style={{ padding: '10px' }}>
                    <h4>{goal.goal}: {goal.amount}</h4>
                    <p>{t('goal.current')}: {goal.currentAmount}</p>
                    <p style={{ color: isOverdue ? 'red' : 'white' }}>
                      {isOverdue ? t('goal.overdue') + `: ${new Date(goal.endDate).toLocaleDateString()}` : t('goal.end') + `: ${new Date(goal.endDate).toLocaleDateString()}`}
                    </p>
                    <p>{t('goal.progress')}: {progress.toFixed(2)}%</p>
                    <button style={{ width: '5%', marginTop: '20px', backgroundColor: "transparent" }} onClick={() => handleEdit(goal)}>
                      <img src="/../materials/edit.png" alt="edit" style={{ width: '20px' }} />
                    </button>
                    <button style={{ width: '5%', marginLeft: '10px', backgroundColor: "transparent" }} onClick={() => deleteGoal(goal._id)}>
                      <img src="/../materials/delete.png" alt="delete" style={{ width: '20px' }} />
                    </button>
                    <button style={{ width: '5%', marginLeft: '10px', backgroundColor: "transparent" }} onClick={() => {
                      setAddingAmount(true);
                      setSelectedGoal(goal._id);
                    }}>
                      <img src="/../materials/add.png" alt="add" style={{ width: '20px' }} />
                    </button>
                    {addingAmount && selectedGoal === goal._id && (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        addAmountToGoal(goal._id, amountToAdd);
                      }}><td>
                          <div className="input-container">
                            <input style={{ width: '15%', borderRadius: '5px', textAlign: 'right', marginTop: '5px', height: '17px' }}
                              type="number"
                              placeholder=""
                              value={amountToAdd}
                              onChange={(e) => setAmountToAdd(e.target.value)}
                              required
                            />
                            <label class="labelG">{t('goal.addamount')}</label>
                          </div>
                          <button style={{ width: '15%', borderRadius: '5px' }} type="submit">{t('form.submit')}</button>
                          <button style={{ width: '15%', borderRadius: '5px', marginLeft: '5px' }} type="button" onClick={() => {
                            setAddingAmount(false);
                            setSelectedGoal(null);
                            setAmountToAdd('');
                          }}>{t('form.cancel')}</button></td>
                      </form>
                    )}
                  </td>
                  <td style={{ width: '200px', padding: '10px' }}>
                    <Pie data={chartData} width={'100px'} height={'100px'} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>{t('goal.empty')}</p>
      )}
    </div>
  );
};

export default Goals;