import axios from 'axios';
import { memo, useEffect, useState } from 'react';

const ServerInfo = () => {
  const [osInfo, setOsInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOsData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/server-manager/os-info`);
      setOsInfo(response.data);
    } catch (err) {
      console.error('Error fetching OS data:', err);
      setError('Failed to fetch OS information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOsData();
  }, []);

  if (loading) return <p>Loading...</p>;

  // Default to "Unknown" values if fetching data fails
  const fallbackData = {
    distro: 'Unknown',
    osType: 'Unknown',
    platform: 'Unknown',
    totalRam: 'Unknown',
    publicIp: 'Unknown',
    internalIps: ['Unknown'],
    cpuCoreNames: ['Unknown'],
  };
  const data = error ? fallbackData : osInfo?.data || fallbackData;

  return (
    <div className="flex flex-wrap gap-4 border p-4 rounded-lg shadow-lg w-full justify-between">
      {/* Specifications Column */}
      <div className="flex flex-col w-[250px] space-y-2">
        <h2 className="text-lg font-bold mb-2">Specifications</h2>
        <div className="flex justify-between">
          <p><strong>RAM:</strong></p>
          <p className='text-sm font-thin'>{data.totalRam} GB</p>
        </div>
        <div className="flex justify-between">
          <p><strong>Storage:</strong></p>
          <p className='text-sm font-thin'>300 GB</p>
        </div>
        <div className="flex justify-between">
          <p><strong>CPU:</strong></p>
          <p className='text-sm font-thin'>{data.cpuCoreNames[0]}</p>
        </div>
      </div>

      {/* OS Column */}
      <div className="flex flex-col w-[250px] space-y-2">
        <h2 className="text-lg font-bold mb-2">Operating System</h2>
        <div className="flex justify-between">
          <p><strong>Distribution:</strong></p>
          <p className='text-sm font-thin'>{data.distro}</p>
        </div>
        <div className="flex justify-between">
          <p><strong>OS Type:</strong></p>
          <p className='text-sm font-thin'>{data.osType}</p>
        </div>
        <div className="flex justify-between">
          <p><strong>Platform:</strong></p>
          <p className='text-sm font-thin'>{data.platform}</p>
        </div>
      </div>

      {/* Network Column */}
      <div className="flex flex-col w-[250px] space-y-2">
        <h2 className="text-lg font-bold mb-2">Network</h2>
        <div className="flex justify-between">
          <p><strong>Public IP:</strong></p>
          <p className='text-sm font-thin'>{data.publicIp}</p>
        </div>
        <div className="flex justify-between">
          <p><strong>Internal IP(s):</strong></p>
          <p className='text-sm font-thin'>{data.internalIps.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(ServerInfo);
