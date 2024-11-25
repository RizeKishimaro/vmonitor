import { useEffect, useState } from 'react'
import StatusChart from '../charts/StatusChart';
import ServerLogs from './components/ServerLogs';
import DatePicker from './utils/DatePicker';
import ServerInfo from './components/ServerInfo';
import NetworkDownChart from '../charts/NetworkDownChart';
import CpuUsageChart from '../charts/CPUUsageChart';
import RamUsageChart from '../charts/RamUsageChart';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Status = () => {
  const [status, setStatus] = useState('Checking server status...');
  const [networkData, setNetworkData] = useState([]);
  const [ramData, setRamData] = useState([]);
  const [cpuData, setCpuData] = useState([]);
  const { id } = useParams()

  const getNetworkData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/servers/${id}/getNetworkUsage`);
      setNetworkData(response.data.data); // Assuming the data is in response.data.data
    } catch (error) {
      console.error("Error fetching network data:", error);
    }
  };

  const getCpuData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/servers/${id}/getCpuUsage`);
      setCpuData(response.data.data); // Assuming the data is in response.data.data
    } catch (error) {
      console.error("Error fetching CPU data:", error);
    }
  };

  const getRamData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/servers/${id}/getRamUsage`);
      setRamData(response.data.data); // Assuming the data is in response.data.data
    } catch (error) {
      console.error("Error fetching RAM data:", error);
    }
  };

  useEffect(() => {
    const eventSource = new EventSource(`${import.meta.env.VITE_APP_API_URL}/server-manager/status`);

    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      console.log(data)
      setStatus(`Status: ${data.status} (Checked at: ${new Date(data.timestamp).toLocaleTimeString()})`);
    };

    eventSource.onerror = function(error) {
      console.error('SSE connection error:', error);
      setStatus('Error retrieving status');
    };
    getNetworkData()
    getRamData()
    getCpuData()

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1 className='text-2xl font-bold'>Server Status</h1>
      <p>{status}</p>

      <div className='my-3'>
        <h1 className='text-2xl font-bold'>System Specification</h1>
        <ServerInfo />
      </div>
      <DatePicker />
      {/* <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-1 w-screen p-4'> */}
      {/*   <ServerLogs /> */}
      {/* </div> */}
      <div className='grid grid-cols-4 md:grid-cols-2 lg:grid-cols-2 gap-1 w-screen p-4 items-center'>
        <CpuUsageChart data={cpuData} />
        <NetworkDownChart data={networkData} />
        <RamUsageChart data={ramData} />
        {/* <StatusChart /> */}
      </div>
    </div>
  );
}

export default Status
