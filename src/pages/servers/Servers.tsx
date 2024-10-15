
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const fakeServers = [
  { id: 1, name: 'Server 1', cpuUsage: '40%', storage: '500 GB', ram: '16 GB', url: "https://www.shopify.com/" },
  { id: 2, name: 'Server 2', cpuUsage: 'N/A', storage: '1 TB', ram: '32 GB', url: "https://localhost/" },
  { id: 3, name: 'Server 3', cpuUsage: '80%', storage: '250 GB', ram: '8 GB', url: "https://localhost/" },
  { id: 4, name: 'Server 4', cpuUsage: '20%', storage: '2 TB', ram: '64 GB', url: "https://localhost/" },
  { id: 5, name: 'Server 5', cpuUsage: 'N/A', storage: '500 GB', ram: '16 GB', url: "https://localhost/" },
  { id: 6, name: 'Server 6', cpuUsage: 'N/A', storage: '500 GB', ram: '16 GB', url: "https://localhost/" },
];

const getStatusClass = async (host: string) => {
  try {
    const response = await axios.get(host, {
      timeout: 20000,
    });
    const responseCode = response.status;

    switch (responseCode) {
      case 200:
        return { status: 'Online', class: 'badge badge-success' };
      case 502:
      case 500:
        return { status: 'Down', class: 'badge badge-error' };
      case 403:
        return { status: 'Under Maintenance', class: 'badge badge-warning' };
      default:
        return { status: 'Unknown', class: 'badge badge-neutral' };
    }
  } catch (error) {
    console.error('Error fetching server status:', error);
    const responseCode = error?.response?.status;
    switch (responseCode) {
      case 200:
        return { status: 'Online', class: 'badge badge-success' };
      case 502:
      case 500:
        return { status: 'Down', class: 'badge badge-error' };
      case 403:
        return { status: 'Under Maintenance', class: 'badge badge-warning' };
      case 404:
        return { status: 'OK', class: 'badge badge-success' };
      default:
        console.log('Unknown status code:', responseCode);
        return { status: 'Unknown', class: 'badge badge-neutral' };
    }

    return { status: 'Error', class: 'badge badge-error' };
  }
};

const Servers = () => {
  const [serverStatuses, setServerStatuses] = useState({});

  useEffect(() => {
    const fetchStatuses = async () => {
      const statuses = {};
      for (const server of fakeServers) {
        const status = await getStatusClass(server.url);
        statuses[server.id] = status; // Store status by server ID
      }
      setServerStatuses(statuses);
    };

    fetchStatuses();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Server Status</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {fakeServers.map(server => (
          <div
            key={server.id}
            className="card bg-base-300 hover:bg-base-200 shadow-xl transition duration-300 ease-in-out"
          >
            <Link to={`/servers/${server.id}/status`}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h3 className="card-title">{server.name}</h3>
                  <span className={serverStatuses[server.id]?.class || 'badge badge-neutral'}>
                    {serverStatuses[server.id]?.status || 'Connecting...'}
                  </span>
                </div>
                <div className="mt-2">
                  <p><strong>CPU Usage:</strong> {server.cpuUsage}</p>
                  <p><strong>Storage:</strong> {server.storage}</p>
                  <p><strong>RAM:</strong> {server.ram}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servers;

