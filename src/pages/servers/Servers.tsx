
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const fakeServers = [
  { id: 1, name: 'Server 1', cpuUsage: '40%', storage: '500 GB', ram: '16 GB', url: "https://www.shopify.com/" },
  { id: 2, name: 'Server 2', cpuUsage: 'N/A', storage: '1 TB', ram: '32 GB', url: "https://bun.sh/" },
  { id: 3, name: 'Server 3', cpuUsage: '80%', storage: '250 GB', ram: '8 GB', url: "https://hapi.com/" },
  { id: 4, name: 'Server 4', cpuUsage: '20%', storage: '2 TB', ram: '64 GB', url: "https://localhost/" },
  { id: 5, name: 'Server 5', cpuUsage: 'N/A', storage: '500 GB', ram: '16 GB', url: "https://localhost/" },
  { id: 6, name: 'Server 6', cpuUsage: 'N/A', storage: '500 GB', ram: '16 GB', url: "https://localhost/" },
];

const getStatusClass = async (host) => {
  try {
    const response = await axios.get(host, { timeout: 20000 });
    return handleResponse(response.status);
  } catch (error) {
    console.error('Error fetching server status:', error);

    if (error.code === 'ERR_NETWORK' && error.request.status === 0) {
      console.log('This might be a CORS error or network issue.');
      return { status: 'Network Error', class: 'badge badge-error' };
    }

    const responseCode = error.response?.status;
    return handleResponse(responseCode) || { status: 'Error', class: 'badge badge-error' };
  }
};

const handleResponse = (responseCode) => {
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
      return { status: 'Invalid Domain', class: 'badge badge-neutral' };
  }
};

const Servers = () => {
  const [serverStatuses, setServerStatuses] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStatus = async (server) => {
      const status = await getStatusClass(server.url);
      setServerStatuses(prevStatuses => ({
        ...prevStatuses,
        [server.id]: status
      }));
    };

    // Fetch each server status individually, updating the state as each one is fetched
    fakeServers.forEach(server => {
      fetchStatus(server);
    });
  }, []);

  const filteredServers = fakeServers.filter(server =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.cpuUsage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.storage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.ram.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className='flex flex-col lg:flex-row justify-between mb-5'>
        <h2 className="text-2xl font-bold mb-4">Server Status</h2>
        <div>
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={searchTerm}  // Controlled input
              onChange={(e) => setSearchTerm(e.target.value)}  // Update searchTerm on input change
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd" />
            </svg>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredServers.map(server => (
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

