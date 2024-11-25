
// src/components/charts/DiskChart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import ReactECharts from 'echarts-for-react';

const DiskChart = ({ serverUrl }: { serverUrl: string }) => {
  const [data, setData] = useState([]); // State to hold partition data

  // Fetch disk partition data on component mount
  useEffect(() => {
    const fetchDiskData = async () => {
      try {
        console.log(serverUrl)
        const response = await axios.get(serverUrl); // Fetch data from the backend
        console.log(response)
        const formattedData = response.data && response.data.map(partition => ({
          name: partition.filesystem, // Set filesystem name
          total: parseFloat(partition.size), // Total size in GB
          used: parseFloat(partition.used) // Used size in GB
        }));

        setData(formattedData); // Update state with formatted data
      } catch (error) {
        console.error('Error fetching disk partition data:', error);
      }
    };

    fetchDiskData();
  }, []);

  // Prepare data for used space pie chart
  const usedData = data.map(partition => ({
    value: partition.used,
    name: partition.name
  }));

  // Prepare data for total space pie chart
  const totalData = data.map(partition => ({
    value: partition.total,
    name: partition.name
  }));

  // Chart option configuration for used space
  const usedOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} G'
    },
    legend: {
      top: '0%',
      left: 'center',
      textStyle: {
        color: 'white' // Change legend font color to black
      }
    },
    series: [
      {
        name: 'Used Space',
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['50%', '60%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 1,
        },
        label: {
          show: false,
          color: "white",
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '15',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: usedData, // Use the used data for the chart
      }
    ]
  };

  // Chart option configuration for total space
  const totalOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} G'
    },
    legend: {
      top: '0%',
      left: 'center',
      textStyle: {
        color: 'white' // Change legend font color to black
      }
    },
    series: [
      {
        name: 'Total Space',
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['50%', '60%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 1,
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '15',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: totalData, // Use the total data for the chart
      }
    ],
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Disk Usage</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ width: '45%' }}>
            <h3 className='text-center mb-3'>Used Space</h3>
            <ReactECharts option={usedOption} style={{ height: '350px' }} />
          </div>
          <div style={{ width: '45%' }}>
            <h3 className='text-center mb-3'>Total Space</h3>
            <ReactECharts option={totalOption} style={{ height: '350px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiskChart;

