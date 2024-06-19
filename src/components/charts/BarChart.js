import React from 'react';
import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень'],
  datasets: [{
    label: 'Витрати',
    data: [100, 150, 200, 250, 300],
    backgroundColor: 'blue',
    borderColor: 'blue',
    borderWidth: 1,
  }]
};

const options = {
  title: {
    display: true,
    text: 'Графік витрат',
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
      },
    }],
    xAxes: [{
      ticks: {
        display: true,
      },
    }],
  },
};

function BarChart() {
  return (
    <div className='home'>
      <Bar data={data} options={options} width={150} height={50}/>
    </div>
  );
}

export default BarChart;