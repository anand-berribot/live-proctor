import { useRef, useCallback, useEffect } from "react";
import { io } from "socket.io-client";
import { isIP } from "is-ip";

const API_SOCKET_IO = process.env.VITE_REACT_APP_SOCKET_IO;

const useSocketIO = () => {
  const videoSocketRef = useRef(null);

  useEffect(() => {
    const checkSocketState = () => {
      if (videoSocketRef.current && videoSocketRef.current.disconnected) {
        console.error("Socket.IO connection is lost!");
      }
    };

    const interval = setInterval(checkSocketState, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [videoSocketRef]);

  // Initialize Socket.IO and connect to the server
  const connectStreamSocket = useCallback(async (candidate_id, interview_id) => {
    console.log("Connecting to Socket.IO for live streaming...");

    if (!videoSocketRef.current) {

      // Initialize Socket.IO connection
      videoSocketRef.current = io(API_SOCKET_IO, {
        path: "/sockets",
        query: {
          candidate_id: candidate_id,
          interview_id: interview_id,
        },
        transports: ["websocket"],
        pingInterval: 25000,  // Adjust the ping interval value as needed
        pingTimeout: 60000   // Adjust the ping timeout value as needed
      });

      const socket = videoSocketRef.current;

      socket.on("connect", () => {
        console.info("Socket.IO connection for live streaming opened.");
      });

      socket.on("message", (data) => {
        console.log("Message received:", data);
      });

      socket.on("disconnect", (reason) => {
        console.warn(`Socket.IO connection for live streaming closed => reason: ${reason}`);
        videoSocketRef.current.close();
        videoSocketRef.current = null;
      });

      socket.on("connect_error", (error) => {

        console.error(error.req); // the request object
        console.error(error.code); // the error code, for example 1
        console.error(error.message); // the error message, for example "Session ID unknown"
        console.error(error.context); // some additional error context

        console.error(`Socket.IO connection Error: ${error}`);
        videoSocketRef.current.close();
      });
    }
  }, []);

  // Send video data to the server through Socket.IO
  const sendBytes = async (bytesVideo) => {
    if (videoSocketRef.current && videoSocketRef.current.connected) {
      videoSocketRef.current.emit("video_stream", bytesVideo);
      console.log("Video stream data sent to the server.");
    } else {
      console.warn("Socket.IO connection is not open and disconnected.");
    }
  };

  const closeStreamSocket = async () => {
    if (videoSocketRef.current) {
      console.warn("closeStreamSocket function triggered.");
      videoSocketRef.current.disconnect();
      videoSocketRef.current = null;
      console.log("Socket.IO connection closed.");
    }
  };

  return { videoSocketRef, sendBytes, connectStreamSocket, closeStreamSocket };
};

export default useSocketIO;
