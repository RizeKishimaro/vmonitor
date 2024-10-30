import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RamUsageChart = ({ data }) => {

  // Transform data into a format suitable for the chart
  const sortedData = data
    .filter(item => item.start_time && item.end_time) // Ensure both times are present
    .map(item => ({
      start_time: new Date(item.start_time),
      ram_usage: parseFloat(item.ram_usage) || 0, // Ensure ram_usage is a float
    }))
    .sort((a, b) => a.start_time - b.start_time); // Sort by start_time

  const categories = sortedData.map(item => item.start_time.toISOString().split('T')[1].split('.')[0]); // Extract time
  const usageData = sortedData.map(item => item.ram_usage); // Extract RAM usage

  const option = {
    title: {
      text: 'RAM Usage Over Time',
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const time = params[0].name; // Get the time
        const ramUsage = `${params[0].value} %`; // RAM usage formatted as MB

        return `Time: ${time}<br/>RAM Usage: ${ramUsage}`;
      },
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
      name: 'RAM Usage (%)',
      max: 100, // Adjust based on expected maximum RAM
    },
    series: [
      {
        name: 'RAM Usage',
        type: 'line',
        data: usageData, // Use transformed data for y-values
        itemStyle: {
          color: 'blue', // Set line color to blue
        },
        smooth: true, // Smooth the line
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
  );
};

export default RamUsageChart;

