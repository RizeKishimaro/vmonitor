
import axios from "axios";
import { memo, useEffect, useState } from "react";

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mb-3">
      <p><strong>OS Distribution:</strong> {osInfo?.data?.distro}</p>
      <p><strong>OS Type:</strong> {osInfo?.data?.osType}</p>
      <p><strong>Platform:</strong> {osInfo?.data?.platform}</p>
      <p><strong>Total RAM:</strong> {osInfo?.data?.totalRam} GB</p>
      <p><strong>Public IP:</strong> {osInfo?.data?.publicIp}</p>
      <p><strong>Internal IP(s):</strong> {osInfo?.data?.internalIps.join(', ')}</p>
      <p><strong>CPU Core Names:</strong> {osInfo?.data?.cpuCoreNames[0]}</p>
    </div>
  );
};

export default memo(ServerInfo);

