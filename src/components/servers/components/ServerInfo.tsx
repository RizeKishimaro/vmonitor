
import axios from "axios";
import { memo, useEffect, useState } from "react";

const ServerInfo = () => {
  const [osInfo, setOsInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-row justify-between mb-3">
      <div className="flex-1 p-2">
        <h3>OS Information</h3>
        <p><strong>OS Distribution:</strong> {osInfo?.data?.distro}</p>
        <p><strong>OS Type:</strong> {osInfo?.data?.osType}</p>
        <p><strong>Platform:</strong> {osInfo?.data?.platform}</p>
      </div>
      <div className="flex-1 p-2">
        <h3>System Specs</h3>
        <p><strong>Total RAM:</strong> {osInfo?.data?.totalRam} GB</p>
        <p><strong>CPU Core Model:</strong> {osInfo?.data?.cpuCoreNames[0]}</p>
        <p><strong>CPU Cores:</strong> {osInfo?.data?.cpuCoreNames?.length}</p>
      </div>
      <div className="flex-1 p-2">
        <h3>Network</h3>
        <p><strong>Public IP:</strong> {osInfo?.data?.publicIp}</p>
        <p><strong>Internal IP(s):</strong> {osInfo?.data?.internalIps.join(', ')}</p>
      </div>
    </div>
  );
};

export default memo(ServerInfo);

