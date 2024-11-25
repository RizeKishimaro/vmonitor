// src/pages/NetworkPage.jsx
import React, { useState, useEffect } from 'react';
import NetworkChart from '../components/charts/NetworkChart';
import axiosClient from '../services/axiosClient';
import CpuChart from '../components/charts/CpuChart';
import RamChart from '../components/charts/RamChart';
import DiskChart from '../components/charts/DiskChart';
import { useAuth } from '../components/servers/utils/AuthContext';

const NetworkPage = () => {
  const [server, setServer] = useState<any>(null)
  const { getUserId } = useAuth();
  const token = localStorage.getItem('access_token');
  const firstServer = async () => {
    const response = await axiosClient.get(`${import.meta.env.VITE_APP_API_URL}/server-manager/get-first-server?id=${getUserId(token)}`);
    setServer(response.data)
    console.log(response.data)
    return response.data;
  }
  useEffect(() => {
    firstServer()
  }, [])
  return (
    <div className="p-0 grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-6 mt-8">
      {server && (<>
        <NetworkChart serverUrl={`${server.server_url}/network-speed`} />
        <CpuChart serverUrl={`${server.server_url}/cpu-usage`} />
        <RamChart serverUrl={`${server.server_url}/ram-usage`} />
        <DiskChart serverUrl={`${server.server_url}/disk-partitions`} />

      </>)}
    </div>
  );
};

export default NetworkPage;

