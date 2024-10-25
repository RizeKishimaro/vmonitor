
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { TriangleAlert } from 'lucide-react';

const CpuChart = ({ serverUrl }: { serverUrl: string }) => {
  const [data, setData] = useState([]);
  const [warning, setWarning] = useState(false); // State to track if CPU exceeds 70%

  useEffect(() => {
    const eventSource = new EventSource(serverUrl);

    eventSource.onmessage = function(event) {
      try {
        const newCpuData = JSON.parse(event.data);
        const timestamp = new Date(newCpuData.timestamp).toLocaleString(); // Use the actual timestamp from the data
        const usage = newCpuData.usage.toFixed(2); // Format to 2 decimal places

        setData(prevData => {
          const updatedData = [...prevData, [timestamp, usage]];

          // Keep only the last 10 data points
          if (updatedData.length > 10) {
            updatedData.shift();
          }

          // Check if any value in the updated data exceeds 70%
          const exceedsThreshold = updatedData.some(item => item[1] > 70);
          setWarning(exceedsThreshold); // Set warning state

          return updatedData;
        });
      } catch (err) {
        console.error('Error parsing CPU data:', err);
      }
    };

    eventSource.onerror = function(err) {
      console.error('EventSource failed:', err);
    };

    return () => {
      eventSource.close(); // Cleanup when component unmounts
    };
  }, []);

  const dateList = data.map(item => item[0]); // Use actual timestamp from data
  const valueList = data.map(item => item[1]); // CPU Usage values

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const date = params[0].name;
        const value = params[0].value;
        return `Time: ${date}<br/>CPU Usage: ${value}%`;
      },
      axisPointer: {
        type: 'cross',
      },
    },
    xAxis: {
      type: 'category',
      data: dateList,
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100, // CPU usage is in percentage (0-100%)
    },
    series: [
      {
        data: valueList,
        type: 'line',
        smooth: true,
        color: '#3b82f6',
      },
    ],
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-2 lg:p-5">
        <div className="flex items-center">
          <h2 className="card-title">CPU Usage</h2>
          {warning && (
            <span className="ml-3 tooltip tooltip-warning" data-tip="Your Usage For The Last 3 second Exceeds The Threshold.">
              <TriangleAlert color="red" /> {/* Show warning icon when CPU > 70% */}
            </span>
          )}
        </div>
        <ReactECharts option={option} style={{ height: '400px' }} />
      </div>
    </div>
  );
};

export default CpuChart;

