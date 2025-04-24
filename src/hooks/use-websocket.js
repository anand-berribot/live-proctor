import { useRef, useCallback } from 'react';
import { isIP } from 'is-ip';

const useWebsocket = (token, onOpen, onMessage, candidate, setPath, handleDisconnect, stopScreenRecording, isWebSocketReconnect) => {
    const socketRef = useRef(null);
    const speechRecognitionModel = useRef('JS_PACKAGE');
    const gptModel = useRef('gpt-4');
    const apiKey = useRef(1);
    const pingIntervalRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const pingInterval = 30000; // 30 seconds
    const maxReconnectAttempts = 50;
    const MASTERMIND_API_URL = process.env.VITE_REACT_APP_API_URL;
    let WebSocketRetry;

    const getCurrentDatetime = () => new Date().toLocaleString();

    if (candidate?.Interviews?.length) {
        const { speech_recognize_model, gpt_model, api_key_id } = candidate.Interviews[0];
        speechRecognitionModel.current = speech_recognize_model;
        gptModel.current = gpt_model;
        apiKey.current = api_key_id;
    }

    const handleSlackAlert = (error, severity) => {
        const candidateId = candidate.Interviews[0].id.toString();
        const interviewId = candidate.Interviews[0].candidate_id.toString();

        fetch(`${MASTERMIND_API_URL}front-end-log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error_message: error,
                severity: severity,
                candidateId: candidateId,
                interviewId: interviewId
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to trigger Slack alert');
            }
            console.log('Slack alert triggered successfully');
        })
        .catch(error => console.error('Error triggering Slack alert:', error));
    };


    const connectSocket = useCallback(() => {
        console.log(`[${getCurrentDatetime()}] Attempting to connect WebSocket...`);
        handleSlackAlert(`[${getCurrentDatetime()}] Attempting to connect WebSocket...`, 'error');
        console.error(reconnectAttemptsRef.current, 'GGGGGGGGGGGGGGGGGGGGGGGGg')
        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            const errorMsg = `[${getCurrentDatetime()}] Maximum reconnection attempts reached.`;
            console.error(errorMsg);
            handleSlackAlert(errorMsg, 'error');
            setTimeout(() => {stopScreenRecording()}, 10000);
            handleDisconnect();
            // isWebsocketAttemptExceeded.current = true;
            setPath('bot-fail');
            return;
        }

        if (!socketRef.current) {
            reconnectAttemptsRef.current += 1;
            const interviewId = candidate.Interviews[0].id;
            const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
            let hostname = window.location.hostname;
            let port = '8000';

            if (hostname !== 'localhost' && !isIP(hostname)) {
                hostname = `api-${hostname}`;
                port = window.location.protocol === 'https:' ? '443' : '80';
            }

            const wsPath = `${wsScheme}://${hostname}:${port}/ws/${interviewId}?key_id=${apiKey.current}&llm_model=${gptModel.current}&token=${token}&speech_to_text_model=${speechRecognitionModel.current}`;
            socketRef.current = new WebSocket(wsPath);

            socketRef.current.binaryType = 'arraybuffer';
            socketRef.current.onopen = () => {
                onOpen();
                reconnectAttemptsRef.current = 0;
            };
            socketRef.current.onmessage = onMessage;

            pingIntervalRef.current = setInterval(() => {
                if (socketRef.current?.readyState === WebSocket.OPEN && localStorage.getItem('web_ping_interval') === 'true' && localStorage.getItem('SocketClose') === 'false') {
                    socketRef.current.send('[&]ping');
                }
            }, pingInterval);

            socketRef.current.onerror = (error) => {
                localStorage.setItem('SocketClose', 'true');
                localStorage.setItem('web_ping_interval', 'false');         
                clearInterval(pingIntervalRef.current);

                const errorMsg = `WebSocket Error: ${error.message || error.type}`;
                console.error(`[${getCurrentDatetime()}] ${errorMsg}`, error);
                handleSlackAlert(`[${getCurrentDatetime()}] ${errorMsg}`, 'error');

                if (error.target.readyState === WebSocket.CLOSED && localStorage.getItem('manualSocketClose') !== 'true') {
                    const reconnectMsg = "WebSocket closed due to network issue.";
                    console.error(reconnectMsg);
                    handleSlackAlert(`[${getCurrentDatetime()}] ${reconnectMsg}`, 'error');
                    socketRef.current = null;
                    isWebSocketReconnect.current = true;
                    WebSocketRetry = setTimeout(connectSocket, 5000);
                }
            };

            socketRef.current.onclose = (event) => {
                localStorage.setItem('SocketClose', 'true');
                localStorage.setItem('web_ping_interval', 'false');
                clearInterval(pingIntervalRef.current);

                const closeMsg = `WebSocket closed with code: ${event.code}, reason: ${event.reason}`;
                console.error(closeMsg);
                handleSlackAlert(`[${getCurrentDatetime()}] ${closeMsg}`, 'error');

                if (localStorage.getItem('manualSocketClose') !== 'true') {
                    socketRef.current = null;
                    isWebSocketReconnect.current = true;
                    WebSocketRetry = setTimeout(connectSocket, 5000);
                }
            };
        }
    }, [onOpen, onMessage, token]);

    const send = async (data, blob = null) => {
        if (typeof data === 'string' && !data.includes("[&]")) {
            localStorage.setItem("UserMessageReceived", 'true');
        }

        if (socketRef.current?.readyState === WebSocket.OPEN) {
            if (blob) {
                const arrayBuffer = await new Response(blob).arrayBuffer();
                socketRef.current.send(arrayBuffer);
            } else {
                console.log('message send to server:', data);
                socketRef.current.send(data);
            }
        }
    };


    const closeSocket = () => {
        clearInterval(pingIntervalRef.current);
        socketRef.current?.close();
        socketRef.current = null;
    };

    return { socketRef, send, connectSocket, closeSocket };
};

export default useWebsocket;
