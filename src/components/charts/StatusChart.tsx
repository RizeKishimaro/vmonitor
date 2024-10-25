
import React from 'react';
import ReactECharts from 'echarts-for-react';

const downtimeData = [
  { status: 'Down', issue_at: '2024-10-24T10:52:32Z', end_time: '2024-10-24T19:00:00Z' }, // ~8 hours
  { status: 'Down', issue_at: '2024-10-25T09:00:00Z', end_time: '2024-10-25T10:30:00Z' }, // 1.5 hours
  { status: 'Down', issue_at: '2024-10-26T14:00:00Z', end_time: '2024-10-26T15:00:00Z' }, // 1 hour
  { status: 'Down', issue_at: '2024-10-27T11:00:00Z', end_time: '2024-10-27T13:00:00Z' }, // 2 hours
  { status: 'Down', issue_at: '2024-10-28T06:00:00Z', end_time: '2024-10-28T09:15:00Z' }, // ~3.25 hours
  { status: 'Down', issue_at: '2024-10-29T16:00:00Z', end_time: '2024-10-29T18:00:00Z' }, // 2 hours
  { status: 'Down', issue_at: '2024-10-30T10:00:00Z', end_time: '2024-10-30T11:00:00Z' }, // 1 hour
  { status: 'Down', issue_at: '2024-10-31T13:00:00Z', end_time: '2024-10-31T15:00:00Z' }, // 2 hours
  { status: 'Down', issue_at: '2024-10-31T16:00:00Z', end_time: '2024-10-31T17:30:00Z' }, // 1.5 hours
];

// Transform data into a format suitable for a waterfall chart
const categories = downtimeData.map(item => new Date(item.issue_at).toISOString().split('T')[0]);

// Function to calculate the start hour from midnight for each event
const calculateStartHour = (dateString) => {
  const date = new Date(dateString);
  return date.getUTCHours() + date.getUTCMinutes() / 60; // Get hours and fractional minutes
};

// Calculate the exact downtime duration in hours
const seriesData = downtimeData.map(item => {
  const durationMs = new Date(item.end_time) - new Date(item.issue_at);
  const durationHours = durationMs / (1000 * 60 * 60); // Convert milliseconds to hours
  return Math.floor(durationHours);
});

// Placeholder data to ensure the bars are placed at the correct start time
const placeholderData = downtimeData.map(item => calculateStartHour(item.issue_at));

const StatusChart = () => {
  const option = {
    title: {
      text: 'Downtime Chart',
    },

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        var tar = params[1]; // The actual downtime bar data
        const downtime = downtimeData[params[1].dataIndex]; // Get the corresponding downtime data

        const startTime = new Date(downtime.issue_at).toISOString().replace('T', ' ').replace('Z', '');
        const endTime = new Date(downtime.end_time).toISOString().replace('T', ' ').replace('Z', '');

        // Calculate the duration (including fractions of an hour)
        const durationMs = new Date(downtime.end_time) - new Date(downtime.issue_at);
        const duration = Math.floor(durationMs / (1000 * 60 * 60)); // Duration in hours

        return `${tar.name}<br/>Start: ${startTime}<br/>End: ${endTime}<br/>Duration: ~${duration} hours`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      splitLine: { show: false },
      data: categories // Dates of the downtime events
    },
    yAxis: {
      type: 'value',
      name: 'Hours'
    },
    series: [
      {
        name: 'Placeholder',
        type: 'bar',
        stack: 'Total',
        itemStyle: {
          borderColor: 'transparent',
          color: 'transparent'
        },
        emphasis: {
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          }
        },
        data: placeholderData // Start times in hours
      },
      {
        name: 'Downtime',
        type: 'bar',
        stack: 'Total',
        label: {
          show: true,
          position: 'inside'
        },
        itemStyle: {
          color: 'red' // Set bar color to red
        },
        data: seriesData // Downtime durations
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

export default StatusChart;

