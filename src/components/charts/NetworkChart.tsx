
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { TriangleAlert } from 'lucide-react';

const NetworkChart = ({ serverUrl }: { serverUrl: string }) => {
  const [data, setData] = useState([]);
  const [showWarning, setShowWarning] = useState(false);

  // Subscribe to the SSE stream and update chart data
  useEffect(() => {
    const eventSource = new EventSource(serverUrl);

    eventSource.onmessage = function(event) {
      const newNetworkData = JSON.parse(event.data);

      // Append the new data and maintain only the last 10 entries
      setData((prevData) => {
        const updatedData = [...prevData, newNetworkData];

        if (updatedData.length > 10) {
          updatedData.shift(); // Remove the oldest entry if we exceed 10
        }

        return updatedData;
      });
    };

    eventSource.onerror = function(err) {
      console.error('SSE connection error:', err);
    };

    // Clean up the event source when the component is unmounted
    return () => {
      eventSource.close();
    };
  }, []);

  // Watch the `data` array to update the warning state based on speeds
  useEffect(() => {
    // Check if any speed exceeds 5 MiB/s (5 * 1024 * 1024 bytes)
    const exceeds5MiB = data.some(item => item.downloadSpeed > 2 * 1024 * 1024 || item.uploadSpeed > 2 * 1024 * 1024);

    // Check if all speeds are less than 2 MiB/s (2 * 1024 * 1024 bytes)
    const allBelow2MiB = data.every(item => item.downloadSpeed < 2 * 1024 * 1024 && item.uploadSpeed < 2 * 1024 * 1024);

    // Update the warning state based on the conditions
    if (exceeds5MiB) {
      setShowWarning(true); // Show warning if any speed exceeds 5 MiB/s
    } else if (allBelow2MiB) {
      setShowWarning(false); // Hide warning if all speeds are below 2 MiB/s
    }
  }, [data]);

  // Generate the x-axis labels (timestamps) and the y-axis values for download and upload
  const dateList = data.map(item => new Date(item.timestamp).toLocaleTimeString()); // Use actual timestamp
  const downloadList = data.map(item => item.downloadSpeed); // Download speeds in bytes
  const uploadList = data.map(item => item.uploadSpeed); // Upload speeds in bytes

  const formatSpeed = (speedInBytes) => {
    const speedInKiB = speedInBytes / 1024; // Convert bytes to KiB
    const speedInMiB = speedInKiB / 1024; // Convert KiB to MiB
    const speedInGiB = speedInMiB / 1024; // Convert MiB to GiB

    // Return formatted speed based on its value
    if (speedInGiB >= 1) {
      return `${speedInGiB.toFixed(2)} GiB/s`; // Display in GiB/s
    } else if (speedInMiB >= 1) {
      return `${speedInMiB.toFixed(2)} MiB/s`; // Display in MiB/s
    } else if (speedInKiB >= 1) {
      return `${speedInKiB.toFixed(2)} KiB/s`; // Display in KiB/s
    } else {
      return `${speedInBytes} Bytes`; // Keep as Bytes
    }
  };

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const time = params[0].axisValue; // Time from axis
        const download = formatSpeed(params[0].data); // Formatted download speed
        const upload = formatSpeed(params[1].data); // Formatted upload speed
        return `Time: ${time}<br/>Download Speed: ${download}<br/>Upload Speed: ${upload}`;
      },
      axisPointer: {
        type: 'cross',
      },
    },
    xAxis: {
      type: 'category',
      data: dateList, // X-axis labels (timestamps)
    },
    yAxis: {
      type: 'value',
      min: 0, // Start from 0
    },
    series: [
      {
        name: 'Download Speed',
        data: downloadList, // Y-axis values for download speed in bytes
        type: 'line',
        smooth: false,
        color: '#3b82f6', // Optional: blue color for download
      },
      {
        name: 'Upload Speed',
        data: uploadList, // Y-axis values for upload speed in bytes
        type: 'line',
        smooth: false,
        color: '#f97316', // Optional: orange color for upload
      },
    ],
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-0 lg:p-3">
        <div className="flex items-center">
          <h2 className="card-title">Network Usage</h2>
          {showWarning && (
            <span className="tooltip tooltip-warning" data-tip="Your Usage For The Last 3 second Exceeds The Threshold.">
              <TriangleAlert className=' ml-4 text-yellow-700' />
            </span>
          )}
        </div>
        <ReactECharts option={option} style={{ height: "400px" }} className='w-full' />
      </div>
    </div>
  );
};

export default NetworkChart;

