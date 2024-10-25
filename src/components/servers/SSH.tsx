
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import io from 'socket.io-client';
import { themes } from './utils/theme';
import { Outlet } from 'react-router-dom';

interface ServerProps {
  server: {
    username: string;
    password: string;
    host: string;
  };
}

const SSH: React.FC<ServerProps> = ({ server }) => {
  const terminalRef = useRef<HTMLElement | null>(null);
  const term = useRef<any>(null);
  const socket = useRef<any>(null);

  useEffect(() => {
    // Initialize xterm.js terminal only once
    term.current = new Terminal({
      cursorBlink: true,
      rows: 47,
      cols: 100,
      theme: themes.theme,

    });
    term.current.open(terminalRef?.current);
    term.current.focus()

    const logo = [
      "██╗   ██╗███╗   ███╗ ██████╗ ███╗   ██╗██╗████████╗ ██████╗ ██████╗ ",
      "██║   ██║████╗ ████║██╔═══██╗████╗  ██║██║╚══██╔══╝██╔═══██╗██╔══██╗",
      "██║   ██║██╔████╔██║██║   ██║██╔██╗ ██║██║   ██║   ██║   ██║██████╔╝",
      "╚██╗ ██╔╝██║╚██╔╝██║██║   ██║██║╚██╗██║██║   ██║   ██║   ██║██╔══██╗",
      " ╚████╔╝ ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██║   ██║   ╚██████╔╝██║  ██║",
      "  ╚═══╝  ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝",
      "                                                                    "
    ];

    // Using writeln for each line to print the logo
    logo.forEach(line => {
      term?.current?.writeln(`\x1b[34m${line}\x1b[0m`);
    });


    // term.current.write('\n\x1b[31mWelcome To Vmonitor Console.\x1b[0m\n');
    term.current.writeln('\n\x1b[31mSSH Terminal Client For Web Browser.Thank You For Using Vmonitor.\x1b[0m');
    // Initialize WebSocket connection to the NestJS backend
    socket.current = io(`${import.meta.env.VITE_APP_SOCKET_URL}/socket.io`); // Change to your WebSocket server address

    // Listen for SSH session data from the backend
    socket.current.on('data', (data) => {
      term.current.write(data);
    });

    // Start an SSH session when the component is mounted
    socket.current.emit('start-ssh-session', {
      host: server.host,
      username: server.username,
      password: server.password, // Optional: can use keys
    });

    // Handle user input and send to the backend via WebSocket
    term.current.onData((input: string) => {
      // Check if the user is trying to use the `sudo` command

      // Emit the input through the socket
      socket.current.emit('input', input);
    });
    // Cleanup function to dispose of the terminal and disconnect the socket
    return () => {
      term.current.dispose(); // Dispose of the terminal instance
      socket.current.disconnect(); // Disconnect the socket
    };
  }, [server]); // The server prop determines when to re-run the effect

  return (
    <div className='overflow-hidden'>
      <div
        ref={terminalRef}
        style={{
          width: 'auto',  // Set width to 100% of the viewport width
          overflow: "hidden",
          overflowX: "hidden"
        }} />
      <Outlet />
    </div>
  );
};

export default SSH;

