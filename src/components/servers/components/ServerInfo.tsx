
import axios from "axios";
import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ServerInfo = () => {
  const [osInfo, setOsInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverData, setServerData] = useState<any>({});
  const { id } = useParams()
  const getServerData = async () => {
    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/servers/${id}`);
    console.log(response.data.data)
    setServerData(response.data.data);
  }

  const getOsData = async () => {
    try {
      console.log(serverData)
      const response = await axios.get(`${serverData?.server_url}/os-info`);
      console.log(response.data)
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
  }, [serverData]);
  useEffect(() => {
    getServerData();
  }, [])
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

        <h4>Storage Devices</h4>
        {osInfo?.data?.storageBlock?.map((device, index) => (
          <p key={index}>
            <strong>Device:</strong><span> {device.device}</span><br />
            <strong>Type:</strong> {device.type}
          </p>
        ))}
      </div>      <div className="flex-1 p-2">
        <h3>Network</h3>
        <p><strong>Public IP:</strong> {osInfo?.data?.publicIp}</p>
        <p><strong>Internal IP(s):</strong> {osInfo?.data?.internalIps.join(', ')}</p>
      </div>
    </div>
  );
};

export default memo(ServerInfo);

