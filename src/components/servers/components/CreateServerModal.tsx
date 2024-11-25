
import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import axios from 'axios';

const CreateServerModal = () => {
  const [formData, setFormData] = useState({
    name: '',
    server_url: '',
    ssh_host: '',
    ssh_port: 22,
    ssh_username: '',
    ssh_password: '',
    ssh_key: null,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [usePasswordAuth, setUsePasswordAuth] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value, user_id: getUserId() }));
  };
  const { getUserId } = useAuth();

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, ssh_key: e.target.files[0], }));
  };

  const handleAuthMethodChange = (e) => {
    setUsePasswordAuth(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access_token');

      const updatedFormData = {
        ...formData,
        user_id: getUserId(token),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/servers/`,
        updatedFormData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Attach the token dynamically
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setFormData({
          name: '',
          server_url: '',
          ssh_host: '',
          ssh_port: 22,
          ssh_username: '',
          ssh_password: '',
          ssh_key: null,
        });
        setIsOpen(false);
      } else {
        console.error('Error creating server:', response);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="btn btn-primary">Create Server</button>

      {isOpen && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Create Server</h3>
            <form onSubmit={handleSubmit} className="py-4 space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Name:</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Server URL:</span>
                </label>
                <input
                  type="text"
                  name="server_url"
                  value={formData.server_url}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">SSH Host:</span>
                </label>
                <input
                  type="text"
                  name="ssh_host"
                  value={formData.ssh_host}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">SSH Port:</span>
                </label>
                <input
                  type="number"
                  name="ssh_port"
                  value={formData.ssh_port}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">SSH Username:</span>
                </label>
                <input
                  type="text"
                  name="ssh_username"
                  value={formData.ssh_username}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={usePasswordAuth}
                  onChange={handleAuthMethodChange}
                  className="checkbox"
                />
                <label className="label ml-2">
                  <span className="label-text">Use SSH Password Authentication</span>
                </label>
              </div>
              {usePasswordAuth ? (
                <div>
                  <label className="label">
                    <span className="label-text">SSH Password:</span>
                  </label>
                  <input
                    type="password"
                    name="ssh_password"
                    value={formData.ssh_password}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
              ) : (
                <div>
                  <label className="label">
                    <span className="label-text">SSH Private Key:</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input w-full max-w-xs"
                    accept=".pem,.key" // Accepting specific file types
                  />
                </div>
              )}
              <div className="modal-action">
                <button type="button" onClick={() => setIsOpen(false)} className="btn">Close</button>
                <button type="submit" className="btn btn-primary">Create Server</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateServerModal;

