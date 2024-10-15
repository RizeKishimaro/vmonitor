
// src/components/charts/RamChart.jsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const RamChart = () => {
  const [data, setData] = useState([]); // State to hold RAM usage data
  const [timestamp, setTimestamp] = useState([]); // State to hold timestamps

  // Fetch RAM usage data using SSE
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/ram-usage'); // Connect to SSE endpoint

    eventSource.onmessage = (event) => {
      const ramData = JSON.parse(event.data);

      // Update RAM usage data
      setData(prevData => {
        const newData = [...prevData, ramData.usedMemory]; // Add new usage
        if (newData.length > 10) newData.shift(); // Remove the first element if length exceeds 10
        return newData;
      });

      // Update timestamps
      setTimestamp(prevTimestamp => {
        const newTimestamp = [...prevTimestamp, ramData.timestamp]; // Add new timestamp
        if (newTimestamp.length > 10) newTimestamp.shift(); // Remove the first element if length exceeds 10
        return newTimestamp;
      });
    };

    // Cleanup on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  // Chart option configuration
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const date = params[0].name;
        const value = params[0].value;
        return `Time: ${date}<br/>RAM Usage: ${value.toFixed(2)}%`;
      },
      axisPointer: {
        type: 'cross',
      },
    },
    xAxis: {
      type: 'category',
      data: timestamp,
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100, // Set max value to 100% for better representation
    },
    series: [
      {
        data: data,
        type: 'line',
        smooth: true,
      },
    ],
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">RAM Usage</h2>
        <ReactECharts option={option} style={{ height: '350px' }} />
      </div>
    </div>
  );
};

export default RamChart;

