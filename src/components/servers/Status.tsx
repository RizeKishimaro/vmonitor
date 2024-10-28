import { useEffect, useState } from 'react'
import StatusChart from '../charts/StatusChart';
import ServerLogs from './components/ServerLogs';
import NetworkChart from '../charts/NetworkChart';
import CpuChart from '../charts/CpuChart';
import RamChart from '../charts/RamChart';
import DiskChart from '../charts/DiskChart';
import DatePicker from './utils/DatePicker';
import ServerInfo from './components/ServerInfo';

const Status = () => {
  const [status, setStatus] = useState('Loading...');
  const [statusColor, setStatusColor] = useState('text-warning'); // Default color for loading
  useEffect(() => {
    const eventSource = new EventSource(`${import.meta.env.VITE_APP_API_URL}/server-manager/status`);


    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      const isServerDown = data.status.toLowerCase() === 'down';

      setStatus(
        `Status: ${data.status} (Checked at: ${new Date(data.timestamp).toLocaleTimeString()})`
      );
      setStatusColor(isServerDown ? 'text-error' : 'text-success'); // Apply color based on status
    };

    eventSource.onerror = function (error) {
      console.error('SSE connection error:', error);
      setStatus('Error retrieving status');
      setStatusColor('text-warning');
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Server Dashboard <span className={`text-sm font-semibold ${statusColor}`}>{status}</span></h1>

      <ServerInfo />
      <DatePicker />
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-1 w-screen p-4'>
        <StatusChart />
        <ServerLogs />


      </div>
      <div className="p-0 grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-6 mt-8">
        <NetworkChart serverUrl={`${import.meta.env.VITE_APP_API_URL}/network-speed`} />
        <CpuChart serverUrl={`${import.meta.env.VITE_APP_API_URL}/cpu-usage`} />
        <RamChart serverUrl={`${import.meta.env.VITE_APP_API_URL}/ram-usage`} />
        <DiskChart serverUrl={`${import.meta.env.VITE_APP_API_URL}/disk-partitions`} />
      </div>
    </div>
  );
}

export default Status
