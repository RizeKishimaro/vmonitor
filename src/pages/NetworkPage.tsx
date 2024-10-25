// src/pages/NetworkPage.jsx
import React, { useState, useEffect } from 'react';
import NetworkChart from '../components/charts/NetworkChart';
import axiosClient from '../services/axiosClient';
import CpuChart from '../components/charts/CpuChart';
import RamChart from '../components/charts/RamChart';
import DiskChart from '../components/charts/DiskChart';

const NetworkPage = () => {
  // const dummyNetworkData = [["2000-06-05", 116], ["2000-06-06", 129], ["2000-06-07", 135], ["2000-06-08", 86]];
  // const dummyCpuData = [["2024-01-01", 20], ["2024-01-02", 30], ["2024-01-03", 40]];
  // const dummyRamData = [["2024-01-01", 60], ["2024-01-02", 70], ["2024-01-03", 75]];
  // const dummyDiskData = [["2024-01-01", 100], ["2024-01-02", 200], ["2024-01-03", 150]];
  // const dummyOverallData = [["2024-01-01", 90], ["2024-01-02", 95], ["2024-01-03", 100]];

  return (
    <div className="p-0 grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-6 mt-8">
      <NetworkChart serverUrl={`${import.meta.env.VITE_APP_API_URL}/network-speed`} />
      <CpuChart serverUrl={`${import.meta.env.VITE_APP_API_URL}/cpu-usage`} />
      <RamChart serverUrl={`${import.meta.env.VITE_APP_API_URL}/ram-usage`} />
      <DiskChart serverUrl={`${import.meta.env.VITE_APP_API_URL}/disk-partitions`} />
    </div>
  );
};

export default NetworkPage;

