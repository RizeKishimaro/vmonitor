
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ServerLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const eventSource = new EventSource(`${import.meta.env.VITE_APP_API_URL}/server-manager/nginx`); // Replace with your actual SSE endpoint

    // Listener for new log entries
    eventSource.onmessage = (event) => {
      const logData = event.data; // logData will contain the new log message
      setLogs((prevLogs) => [...prevLogs, logData]);
    };

    // Error handling
    // eventSource.onerror = (error) => {
    //   navigate("/error")
    // };

    // Clean up the SSE connection on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="bg-gray-900 text-gray-300 p-5 rounded-lg max-w-4xl mx-auto font-mono w-full">
      <div className="text-lg text-purple-400 mb-3">Nginx Access Logs</div>
      <div className="bg-black p-4 rounded-md h-96 overflow-y-auto shadow-inner w-full">
        {logs.length === 0 ? (
          <pre className="text-yellow-400">Waiting for logs...</pre>
        ) : (
          logs.map((log, index) => (
            <pre key={index} className="mb-3 text-green-400 whitespace-pre-wrap">
              {log}
            </pre>
          ))
        )}
      </div>
    </div>
  );
};

export default ServerLogs;

