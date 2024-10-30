
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Utility functions for converting bytes to KiB and MiB
const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KiB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
};

const NetworkDownChart = ({ data }) => {
  const categories = data.map(item => new Date(item.start_time).toISOString().split('T')[1].split('.')[0]); // Extract time
  const downloadData = data.map(item => parseInt(item.download_network_usage, 10)); // Convert to numbers
  const uploadData = data.map(item => parseInt(item.upload_network_usage, 10)); // Convert to numbers

  const option = {
    title: {
      text: 'Network Usage Over Time',
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const time = params[0].name; // Get the time
        const download = formatBytes(params[0].value);
        const upload = formatBytes(params[1].value);

        return `Time: ${time}<br/>Download: ${download}<br/>Upload: ${upload}`;
      }
    },
    legend: {
      data: ['Download Usage', 'Upload Usage'],
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        rotate: 45, // Rotate for better readability if necessary
      },
    },
    yAxis: {
      type: 'value',
      name: 'Usage',
      axisLabel: {
        formatter: (value) => formatBytes(value), // Format y-axis labels
      },
    },
    series: [
      {
        name: 'Download Usage',
        type: 'bar',
        data: downloadData, // Use transformed data for y-values
        itemStyle: {
          color: 'blue', // Set download bars to blue
        },
      },
      {
        name: 'Upload Usage',
        type: 'bar',
        data: uploadData, // Use transformed data for y-values
        itemStyle: {
          color: 'orange', // Set upload bars to orange
        },
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
  );
};

export default NetworkDownChart;

