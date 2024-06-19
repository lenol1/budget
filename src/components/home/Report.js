import React from 'react';
import '../styles/Main.css';
import LineChart from '../charts/LineChart.js';
import AccountAnalysis from './ExpenseForm.js';

function Report() {
  
  return (
    <div>
         <div className='home' id='main'><br />
      <div>
       <LineChart  />
      </div>
    </div>
    <div className='home' id='main'><br />
      <AccountAnalysis />
      </div>
   
    </div>
  );
}

export default Report;