
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { TriangleAlert } from 'lucide-react'; // Import warning icon

const RamChart = ({ serverUrl }: { serverUrl: string }) => {
  const [data, setData] = useState([]); // State to hold RAM usage data
  const [timestamp, setTimestamp] = useState([]); // State to hold timestamps
  const [warning, setWarning] = useState(false); // State to track if RAM usage exceeds 70%

  // Fetch RAM usage data using SSE
  useEffect(() => {
    const eventSource = new EventSource(serverUrl); // Connect to SSE endpoint

    eventSource.onmessage = (event) => {
      const ramData = JSON.parse(event.data);

      setData(prevData => {
        const newData = [...prevData, ramData.usedMemory]; // Add new usage
        if (newData.length > 10) newData.shift(); // Remove the first element if length exceeds 10

        // Check if any value in the updated data exceeds 70%
        const exceedsThreshold = newData.some(item => item > 70);
        setWarning(exceedsThreshold); // Set warning state if RAM usage exceeds 70%

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
        return `Time: ${date}<br/>RAM Usage: ${value.toFixed(2)}%`; // Show RAM usage with 2 decimal places
      },
      axisPointer: {
        type: 'cross',
      },
    },
    xAxis: {
      type: 'category',
      data: timestamp, // Use timestamps for the x-axis
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100, // Set max value to 100% for better representation
      axisLabel: {
        formatter: '{value}%' // Label y-axis as percentage
      },
    },
    series: [
      {
        data: data,
        type: 'line',
        smooth: true,
        // areaStyle: {}, // Optional: Adds a filled area below the line for better visualization
      },
    ],
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-2 lg:p-3">
        <div className="flex items-center">
          <h2 className="card-title">RAM Usage</h2>
          {warning && (
            <span className='ml-3'>
              <TriangleAlert color="red" /> {/* Show warning icon when RAM > 70% */}
            </span>
          )}
        </div>
        <ReactECharts option={option} style={{ height: '400px' }} />
      </div>
    </div>
  );
};

export default RamChart;

