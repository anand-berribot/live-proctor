import { isIP } from 'is-ip';
import { useCallback, useRef } from 'react';

const useChatWebsocket = (onOpen, onMessage) => {
    const socketRef = useRef(null);

    // initialize web socket and connect to server.
    const connectSocket = useCallback(() => {
        if (!socketRef.current) {
            const clientId = Math.floor(Math.random() * 1010000);
            const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
            // Get the current host value
            var currentHost = window.location.host;

            // Split the host into IP and port number
            var parts = currentHost.split(':');

            // Extract the IP address and port number
            var hostname = parts[0];
            // Local deployment uses 8000 port by default.
            var newPort = '8000';

            if (!(hostname === 'localhost' || isIP(hostname))) {
                hostname = 'api-' + hostname;
                newPort = window.location.protocol === "https:" ? 443 : 80;
            }

            // Generate the new host value with the same IP but different port
            var newHost = hostname + ':' + newPort;
            const ws_path = ws_scheme + '://' + newHost + `/ws/chat/${clientId}?llm_model=gpt-4`;
            socketRef.current = new WebSocket(ws_path);
            const socket = socketRef.current;
            socket.binaryType = 'arraybuffer';
            socket.onopen = onOpen;
            socket.onmessage = onMessage;
            socket.onerror = (error) => {
                console.log(`WebSocket Error: ${error}`);
            };
            socket.onclose = (event) => {
                console.log(event)
            };
        }
    }, [onOpen, onMessage]);

    // send message to server
    const send = (data) => {
        console.log("message sent to server", data);
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(data);
        }
    };

    const closeSocket = () => {
        socketRef.current.close();
        socketRef.current = null;
    }

    return { send, connectSocket, closeSocket };
};

export default useChatWebsocket;
