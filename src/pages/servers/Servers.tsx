
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CreateServerModal from '../../components/servers/components/CreateServerModal';
import { PenBox, Trash } from 'lucide-react';
import { useAuth } from '../../components/servers/utils/AuthContext';
import UpdateServerModal from '../../components/servers/components/UpdateServerModal';
import axiosClient from '../../services/axiosClient';

const getStatusClass = async (host) => {

  try {
    const response = await axios.get(host, { timeout: 20000 });
    return handleResponse(response.status);
  } catch (error) {
    console.error('Error fetching server status:', error);

    if (error.code === 'ERR_NETWORK' && error.request.status === 0) {
      return { status: 'Network Error', class: 'badge badge-error' };
    }

    const responseCode = error.response?.status;
    return handleResponse(responseCode) || { status: 'Error', class: 'badge badge-error' };
  }
};
const toastMessage = (message) => {
  return (
    <div className="toast">
      <div className="alert alert-info">
        <span>{message}</span>
      </div>
    </div>
  )
}
const DeleteServer = async (id) => {
  await axios.delete(`${import.meta.env.VITE_APP_API_URL}/servers/${id}`);
  toastMessage('Server Deleted');
}

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
  const [servers, setServers] = useState([]);
  const [serverStatuses, setServerStatuses] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverId, setServerId] = useState(null);
  const { getUserId } = useAuth();
  const token = localStorage.getItem('access_token');

  const handleOpenModal = (serverId) => {
    setServerId(serverId)
    setIsModalOpen(true)
  };
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await axiosClient.get(`${import.meta.env.VITE_APP_API_URL}/servers/?id=${getUserId(token)}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
        );
        console.log(response.data)
        if (response.data?.data) {
          setServers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching servers:', error);
      }
    };

    fetchServers();
  }, []);

  useEffect(() => {
    const fetchStatus = async (server) => {
      const status = await getStatusClass(server.server_url);
      setServerStatuses((prevStatuses) => ({
        ...prevStatuses,
        [server.id]: status
      }));
    };

    // Fetch each server status individually, updating the state as each one is fetched
    servers.forEach(server => {
      fetchStatus(server);
    });
  }, [servers]);

  const filteredServers = servers.filter(server =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.server_url.toLowerCase().includes(searchTerm.toLowerCase()) // Searching by URL
  );

  return (
    <div className="p-4">
      <div className='flex flex-col lg:flex-row justify-between mb-3'>
        <h2 className="text-2xl font-bold mb-2">Server Status</h2>
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

      <div className="mb-4">
        <CreateServerModal />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredServers.map((server, index) => (
          <div
            key={server.id}
            className="card bg-base-300 hover:bg-base-200 shadow-xl transition duration-300 ease-in-out"
          >
            <div className="card-body">

              <div className="flex items-center justify-between">
                <h3 className="card-title">{server.name}</h3>
                <span className={serverStatuses[server.id]?.class || 'badge badge-neutral'}>
                  {serverStatuses[server.id]?.status || 'Connecting...'}
                </span>
              </div>


              <div className='flex justify-between'>

                <Link to={`/servers/${server.id}/status`}>
                  <div className="mt-2">
                    <p><strong>Server URL:</strong> {server.server_url}</p>
                    <p><strong>SSH Username:</strong> {server.ssh_username}</p>
                    <p><strong>SSH Password:</strong> {server.ssh_password}</p>
                  </div>

                </Link>
                <div className='flex flex-col z-50'>
                  <button onClick={() => { handleOpenModal(server.id) }} className="btn btn-primary mb-3">
                    <PenBox />
                  </button>
                  <button onClick={() => DeleteServer(server.id)} className='btn btn-error'><Trash /></button>
                </div>


              </div>
              {isModalOpen && (
                <UpdateServerModal serverId={serverId} onClose={handleCloseModal} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servers;

