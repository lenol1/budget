import React from 'react';
import '../styles/Main.css';
import LineChart from '../charts/LineChart.js';
import AccountAnalysis from './ExpenseForm.js';

/**
 * Financial Report Component
 *
 * This component displays a financial report, including:
 *  - A line chart to visualize financial trends
 *  - An account analysis form to analyze expenses
 *
 * @author len_oli
 * @returns {JSX.Element} - JSX element representing the financial report
 */

function Report() {

  return (
    <div>
      <div className='home' id='main'><br />
        <div>
          <LineChart />
        </div>
      </div>
      <div className='home' id='main'><br />
        <AccountAnalysis />
      </div>

    </div>
  );
}

export default Report;