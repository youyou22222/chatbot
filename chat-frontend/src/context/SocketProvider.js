import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import SocketContext from './SocketContext';

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);


   useEffect(() => {
    const newSocket = io('https://api.cheeseispower.xyz', 
			 { withCredentials: true,
			 transports: ['websocket', 'polling']
			 });
    
    newSocket.on('connect', () => {
        console.log('Socket connected!');
    });
    newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected due to:', reason);
    });
    newSocket.on('connect_error', (error) => {
        console.log('Connection error:', error);
    });
    
    setSocket(newSocket);

    return () => {
        newSocket.close();
	};
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
