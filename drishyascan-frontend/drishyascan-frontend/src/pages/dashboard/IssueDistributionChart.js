import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, CircularProgress } from '@mui/material';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const IssueDistributionChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  const chartData = {
    labels: ['Critical', 'Major', 'Minor', 'Info'],
    datasets: [
      {
        data: [
          data.critical,
          data.major,
          data.minor,
          data.info,
        ],
        backgroundColor: [
          '#ef4444', // Critical - Red
          '#f97316', // Major - Orange
          '#eab308', // Minor - Yellow
          '#3b82f6', // Info - Blue
        ],
        borderColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#3b82f6',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.parsed * 100) / total);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      },
    },
    cutout: '70%',
  };

  return <Doughnut data={chartData} options={options} />;
};

export default IssueDistributionChart; 