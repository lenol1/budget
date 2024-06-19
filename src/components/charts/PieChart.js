import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data }) => {
  const options = {
    title: {
      display: true,
      text: 'Розподіл витрат',
    },
    plugins: { legend: { display: false, }, },
   
    maintainAspectRatio: false,
  };

  return (
    <div>
      <Pie width={100} height={100} data={data} options={options} />
    </div>
  );
};

export default PieChart;
