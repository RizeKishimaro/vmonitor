import React, { useState, useEffect } from 'react';
import NetworkChart from '../charts/NetworkChart';
import CpuChart from '../charts/CpuChart';
import RamChart from '../charts/RamChart';
import DiskChart from '../charts/DiskChart';
import axiosClient from '../../services/axiosClient';
import { useParams } from 'react-router-dom';


const MonitorServer = () => {
  const [server, setServer] = useState<any>({})
  const { id } = useParams()
  const firstServer = async () => {
    const response = await axiosClient.get(`${import.meta.env.VITE_APP_API_URL}/servers/${id}`);
    setServer(response.data?.data)
    return response.data;
  }
  useEffect(() => {
    firstServer()
  }, [])
  return (
    <div className="p-0 grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-6 mt-8">
      {server?.server_url && (<>
        <NetworkChart serverUrl={`${server?.server_url}/network-speed`} />
        <CpuChart serverUrl={`${server?.server_url}/cpu-usage`} />
        <RamChart serverUrl={`${server?.server_url}/ram-usage`} />
        <DiskChart serverUrl={`${server?.server_url}/disk-partitions`} />

      </>)}
    </div>
  );
};

export default MonitorServer;
