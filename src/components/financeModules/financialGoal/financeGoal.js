import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

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
        fetchGoals(); // Оновлюємо список цілей після додавання нової
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
        fetchGoals(); // Оновлюємо список цілей після оновлення
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
        fetchGoals(); // Оновлюємо список цілей після оновлення
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
      <button  id='transactionForms' onClick={toggleFormVisibility}>
        {isFormVisible ? 'Close Form' : 'New Financial Goal'}
      </button>
      <br /><br/>
      {isFormVisible && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', backgroundColor: 'rgba(3, 111, 226, 0.05)' }}>
          <input id='transactionIB' 
            type="text"
            placeholder="Goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          />
          <input id='transactionIB' 
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <input id='transactionIB' 
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          {editingGoal && (
            <input id='transactionIB' 
              type="number"
              placeholder="Current Amount"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              required
            />
          )}
          <button id='transactionIB'  type="submit">{editingGoal ? 'Update Goal' : 'Add Goal'}</button>
          {editingGoal && <button type="button" id='transactionIB'  onClick={handleCancelEdit}>Cancel</button>}
        </form>
      )}
      {goals.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {goals.map(goal => {
              const progress = getProgress(goal.currentAmount, goal.amount);
              const isOverdue = new Date(goal.endDate) < new Date();

              const chartData = {
                labels: ['Completed', 'Remaining'],
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
                    <p>Current Amount: {goal.currentAmount}</p>
                    <p style={{ color: isOverdue ? 'red' : 'white' }}>
                      {isOverdue ? `Overdue since: ${new Date(goal.endDate).toLocaleDateString()}` : `End Date: ${new Date(goal.endDate).toLocaleDateString()}`}
                    </p>
                    <p>Progress: {progress.toFixed(2)}%</p>
                    <button style={{width:'10%',  borderRadius:'5px'}} onClick={() => handleEdit(goal)}>Edit</button>
                    <button style={{width:'10%', marginLeft:'10px', borderRadius:'5px'}} onClick={() => deleteGoal(goal._id)}>Delete</button>
                    <button style={{width:'10%', marginLeft:'10px', borderRadius:'5px'}} onClick={() => {
                      setAddingAmount(true);
                      setSelectedGoal(goal._id);
                    }}>
                      Add Amount
                    </button>
                    {addingAmount && selectedGoal === goal._id && (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        addAmountToGoal(goal._id, amountToAdd);
                      }}><td>
                        <input style={{width:'12%',  borderRadius:'5px', textAlign:'center'}}
                          type="number"
                          placeholder="Amount to Add"
                          value={amountToAdd}
                          onChange={(e) => setAmountToAdd(e.target.value)}
                          required
                        />
                        <button style={{width:'12%',  borderRadius:'5px', marginLeft:'5px'}} type="submit">Submit</button>
                        <button style={{width:'12%',  borderRadius:'5px' , marginLeft:'5px'}} type="button" onClick={() => {
                          setAddingAmount(false);
                          setSelectedGoal(null);
                          setAmountToAdd('');
                        }}>Cancel</button></td>
                      </form>
                    )}
                  </td>
                  <td style={{ width: '200px', padding: '10px' }}>
                    <Pie data={chartData} width={'100px'} height={'100px'}/>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No goals available</p>
      )}
    </div>
  );
};

export default Goals;
