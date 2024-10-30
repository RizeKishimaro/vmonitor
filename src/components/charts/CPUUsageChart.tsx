import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CpuUsageChart = ({ data }) => {


  // Transform data into a format suitable for the chart
  const sortedData = data
    .filter((item: any) => item.start_time && (item.end_time || new Date().toISOString())) // Ensure both times are present
    .map((item: any) => ({
      start_time: new Date(item.start_time),
      cpu_usage: parseFloat(item.cpu_usage) || 0, // Ensure cpu_usage is a float
    }))
    .sort((a: any, b: any) => a.start_time - b.start_time); // Sort by start_time

  const categories = sortedData.map(item => item.start_time.toISOString().split('T')[1].split('.')[0]); // Extract time
  const usageData = sortedData.map(item => item.cpu_usage); // Extract CPU usage

  const option = {
    title: {
      text: 'CPU Usage Over Time',
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const time = params[0].name; // Get the time
        const cpuUsage = `${params[0].value}%`; // CPU usage formatted as percentage

        return `Time: ${time}<br/>CPU Usage: ${cpuUsage}`;
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
      name: 'CPU Usage (%)',
      max: 100, // Set max to 100% for CPU usage
    },
    series: [
      {
        name: 'CPU Usage',
        type: 'line',
        data: usageData, // Use transformed data for y-values
        itemStyle: {
          color: 'green', // Set line color to green
        },
        smooth: true, // Smooth the line
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
  );
};

export default CpuUsageChart;

