import React, { useEffect, useState } from 'react'

const Status = () => {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/server-manager/status');

    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      console.log(data)
      setStatus(`Status: ${data.status} (Checked at: ${new Date(data.timestamp).toLocaleTimeString()})`);
    };

    eventSource.onerror = function(error) {
      console.error('SSE connection error:', error);
      setStatus('Error retrieving status');
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>Server Status</h1>
      <p>{status}</p>
    </div>
  );
}

export default Status
