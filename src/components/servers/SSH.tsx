
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { themes } from '../../components/servers/utils/theme';

const SSH = () => {
  const { id } = useParams(); // Get the server ID from the URL

  const terminalRef = useRef<HTMLElement | null>(null);
  const socket = useRef<any>(null);

  useEffect(() => {
    // Initialize terminal
    const terminal = new Terminal({
      cursorBlink: true,
      rows: 47,
      cols: 120,
      fontWeight: '600',
      fontWeightBold: '800',
      fontFamily: 'monospace',
      theme: themes.theme,
    });
    if (terminalRef.current) {
      console.log(terminalRef.current)
      terminal.open(terminalRef.current);
      terminal.focus();

    }


    // Display logo in the terminal
    const logo = [
      "██╗   ██╗███╗   ███╗ ██████╗ ███╗   ██╗██╗████████╗ ██████╗ ██████╗ ",
      "██║   ██║████╗ ████║██╔═══██╗████╗  ██║██║╚══██╔══╝██╔═══██╗██╔══██╗",
      "██║   ██║██╔████╔██║██║   ██║██╔██╗ ██║██║   ██║   ██║   ██║██████╔╝",
      "╚██╗ ██╔╝██║╚██╔╝██║██║   ██║██║╚██╗██║██║   ██║   ██║   ██║██╔══██╗",
      " ╚████╔╝ ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██║   ██║   ╚██████╔╝██║  ██║",
      "  ╚═══╝  ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝",
      "                                                                    "
    ];

    logo.forEach(line => {
      terminal.writeln(`\x1b[34m${line}\x1b[0m`);
    });

    terminal.writeln('\n\x1b[31mWelcome to Vmonitor Console. Thank you for using our SSH Terminal Client!\x1b[0m');

    // Initialize WebSocket connection to the backend
    socket.current = io(`${import.meta.env.VITE_APP_SOCKET_URL}/socket.io`);

    // Start an SSH session when the component is mounted
    socket.current.emit('start-ssh-session', { serverId: id }); // Send server ID to backend

    // Handle incoming data from the backend
    socket.current.on('data', (data) => {
      terminal.write(data);
    });

    // Handle user input and send it to the backend via WebSocket
    terminal.onData((input: string) => {
      socket.current.emit('input', input);
    });

    // Cleanup
    return () => {
      if (terminal) {
        terminal.dispose();
      }
      socket.current.disconnect();
    };
  }, []);

  return (
    <div className='overflow-hidden'>
      <div ref={terminalRef} style={{ width: '100%', overflow: 'hidden' }} />
    </div>
  );
};

export default SSH;

