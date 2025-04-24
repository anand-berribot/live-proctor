// C:\Users\prave\Desktop\berribot\mastermind-v2\berribot_mui\src\new_hooks\useVideoLiveStream.js
import { useRef, useCallback, useEffect } from 'react';

const VIDEO_SOCKET_URL = process.env.VITE_REACT_APP_VIDEO_SOCKET_URL;

const useLiveStream = (candidate) => {
  const videoSocketRef = useRef(null);

  useEffect(() => {
    return () => {
      if (videoSocketRef.current) {
        videoSocketRef.current.close();
        console.info(`[useVideoLiveStream] WebSocket closed during cleanup`);
      }
    };
  }, []);

  const connectVideoSocket = useCallback(async () => {
    if (videoSocketRef.current) {
      console.debug(`[useVideoLiveStream] WebSocket already connected`);
      return;
    }

    const candidateId = candidate.Interviews[0].candidate_id;
    const interviewId = candidate.Interviews[0].id;
    const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socketUrl = `${wsScheme}://${VIDEO_SOCKET_URL}/ws/store-live-video/${candidateId}/${interviewId}`;

    try {
      console.info(`[useVideoLiveStream] Connecting to WebSocket: ${socketUrl}`);
      videoSocketRef.current = new WebSocket(socketUrl);

      videoSocketRef.current.onopen = () => {
        console.info(`[useVideoLiveStream] WebSocket connection opened for candidate ID: ${candidateId}`);
      };
      videoSocketRef.current.onerror = (error) => {
        console.error(`[useVideoLiveStream] WebSocket error: ${error.message || 'Unknown error'}`);
      };
      videoSocketRef.current.onclose = (event) => {
        console.warn(`[useVideoLiveStream] WebSocket closed - Code: ${event.code}, Reason: ${event.reason}`);
        videoSocketRef.current = null;
      };
    } catch (error) {
      console.error(`[useVideoLiveStream] Error connecting to WebSocket: ${error.message}`);
    }
  }, [candidate]);

  const sendVideoData = async (videoData) => {
    if (videoSocketRef.current && videoSocketRef.current.readyState === WebSocket.OPEN) {
      try {
        videoSocketRef.current.send(videoData);
        console.debug(`[useVideoLiveStream] Video data sent - Size: ${videoData.size} bytes`);
      } catch (error) {
        console.error(`[useVideoLiveStream] Error sending video data: ${error.message}`);
      }
    } else {
      console.warn(`[useVideoLiveStream] WebSocket not open`);
    }
  };

  const closeVideoSocket = () => {
    if (videoSocketRef.current) {
      try {
        videoSocketRef.current.close();
        console.info(`[useVideoLiveStream] WebSocket connection closed`);
        videoSocketRef.current = null;
      } catch (error) {
        console.error(`[useVideoLiveStream] Error closing WebSocket: ${error.message}`);
      }
    }
  };

  return { videoSocketRef, sendVideoData, connectVideoSocket, closeVideoSocket };
};

export default useLiveStream;