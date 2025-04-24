import { useRef, useCallback, useEffect } from "react";


const VIDEO_SOCKET_URL = process.env.VITE_REACT_APP_VIDEO_SOCKET_URL;

const useLiveStream = (candidate) => {
  const videoSocketRef = useRef(null); 

  useEffect(() => {
    return () => {
      if (videoSocketRef.current) {
        videoSocketRef.current.close();
        console.log("WebSocket closed due to component unmounting.");
      }
    };
  }, []);

  // todo: Initialize WebSocket and connect to the server
  const connectStreamSocket = useCallback(async () => {
    console.debug("Connecting to websocket for live streaming...");
    
    if (!videoSocketRef.current) {
      console.debug("Connecting to websocket Candidate Data:", candidate);
      const candidate_id = candidate.Interviews[0].candidate_id;
      const interview_id = candidate.Interviews[0].id;

      //* Get the current host value
      //* eg: local => ws://localhost:8002/ws/store-live-video/DNCKW/J7XUQ
      //* eg: server => ws://video-mastermind-app.berribot.com/ws/store-live-video/DNCKW/J7XUQ
      const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
      let socket_endpoint;

      //* For video socket related testing
      // if (candidate?.email_id.includes('@proaibots.com')){
      // }else{
      //   socket_endpoint = `${ws_scheme}://api-mastermind.berribot.com/ws/store-live-video/${candidate_id}/${interview_id}`;
      // }

      socket_endpoint = `${ws_scheme}://${VIDEO_SOCKET_URL}/ws/store-live-video/${candidate_id}/${interview_id}`;
      console.debug(`message: socket connection endpoint => ${socket_endpoint}.`);

      //* initialize websocket...
      videoSocketRef.current = new WebSocket(socket_endpoint);
      const socket = videoSocketRef.current;

      socket.onopen = (event) => {
        console.debug("Video stream websocket for live streaming opened.");
      };

      socket.onmessage = (event) => {
        console.debug("Video stream websocket for live streaming opened.");
      };

      socket.onerror = (error) => { 
        console.error(`Video stream websocket Error: ${error}`);
      };

      socket.onclose = (event) => { 
        console.trace();
        console.debug(`video stream websocket for live streaming closed => event: ${event} code: ${event.code}, reason: ${event.reason || "No reason provided"}`); 
        console.debug(`video stream websocket for live streaming closed => wasClean: ${event.wasClean}`);
        videoSocketRef.current = null;
      };
    }
  }, [candidate]);

  // todo: Send video data to the server through WebSocket
  const sendBytes = async (bytesVideo) => {
    if (videoSocketRef.current) {
        videoSocketRef.current.send(bytesVideo);
        setTimeout(() => {console.debug("Video stream data sent to the server.")}, 1000);
    } else {
        console.debug("Video stream websocket is not open and disconnected.");
    } 
  };

  const closeStreamSocket = async () => { 
    if (videoSocketRef.current) {
      console.debug("closeStreamSocket function triggered.");
      // console.trace()

      videoSocketRef.current.close();
      console.log("Video stream websocket closed.");
    }
  };

  return { videoSocketRef, sendBytes, connectStreamSocket, closeStreamSocket };
};

export default useLiveStream;