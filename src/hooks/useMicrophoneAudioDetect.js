import { useState, useRef, useEffect } from 'react';
import hark from 'hark';

const useMicrophoneAudioDetect = () => {
  const mediaRecorder = useRef(null);
  const [isAudioDetecting, setIsAudioDetecting] = useState(false);
  const [isSpeakingDetected, setIsSpeakingDetected] = useState(false);
  const streamRef = useRef(null); // Store the stream reference
  const speechEventsRef = useRef(null); // Store the hark speech events reference

  const connectMicrophoneforaudiodetect = async (deviceId) => {
    try {
      if (mediaRecorder.current) return true; // Already connected

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: deviceId ? { exact: deviceId } : undefined, echoCancellation: true },
      });

      streamRef.current = stream; // Save the stream reference
      mediaRecorder.current = new MediaRecorder(stream);
    //   startAudioDetection();
      return true;
    } catch (err) {
      console.log('An error occurred: ' + err);
      return false; // Failed to connect
    }
  };

  const startAudioDetection = () => {
    if (!mediaRecorder.current) return;

    if (mediaRecorder.current.state === 'recording') {
      console.log('MediaRecorder is already recording');
      stopAudioDetection();
    }

    mediaRecorder.current.start();
    setIsAudioDetecting(true);
    console.log('Audio detection started');

    const options = {};
    const speechEvents = hark(streamRef.current, options); // Use the stream reference

    speechEvents.on('speaking', () => {
      setIsSpeakingDetected(true);
      console.log('User is speaking');
    });

    speechEvents.on('stopped_speaking', () => {
      setIsSpeakingDetected(false);
      console.log('User stopped speaking');
    });

    speechEventsRef.current = speechEvents; // Save the speech events reference
  };

  const stopAudioDetection = () => {
    if (!mediaRecorder.current) return;

    mediaRecorder.current.stop();
    setIsAudioDetecting(false);
    console.log('Audio detection stopped');

    if (speechEventsRef.current) {
      speechEventsRef.current.stop(); // Stop hark speech events
      speechEventsRef.current = null; // Reset the reference
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
        mediaRecorder.current.stop();
        setIsAudioDetecting(false);
        console.log('Audio detection stopped');
      }
    };
  }, []);

  return {
    isAudioDetecting,
    isSpeakingDetected,
    connectMicrophoneforaudiodetect,
    startAudioDetection,
    stopAudioDetection,
  };
};

export default useMicrophoneAudioDetect;
