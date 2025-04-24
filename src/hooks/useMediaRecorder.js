import { useState } from 'react';

const useMediaRecorder = () => {
  const [mediaRecorder, setmediaRecorder] = useState(null);

  // Function to initialize media recorder
  const connectMicrophone = async (deviceId) => {
    try {
      if (mediaRecorder) {
        console.debug('Microphone is already connected.');
        return true; // Already connected
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: deviceId ? { exact: deviceId } : undefined, echoCancellation: true }
      });

      // Handle the case where the audio track ends unexpectedly
      stream.getAudioTracks()[0].onended = () => {
        console.debug('Microphone audio track ended unexpectedly.');
        sessionStorage.setItem("MicMute", true);
        setmediaRecorder(null);
      };

      let new_mediarecorder = new MediaRecorder(stream);
      setmediaRecorder(new_mediarecorder);
      sessionStorage.setItem("MicMute", false);
      console.debug('Microphone connected successfully.');
      return true;
    } catch (err) {
      sessionStorage.setItem("MicMute", true);
      console.log('An error occurred: ' + err);
      return false; // Failed to connect
    }
  };

  // Function to stop and disconnect the media recorder
  const disconnectMicrophone = () => {
    if (mediaRecorder) {
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      console.debug('Microphone disconnected.');
      setmediaRecorder(null);
      sessionStorage.setItem("MicMute", true);
    }
  };

  return { connectMicrophone, disconnectMicrophone };
};

export default useMediaRecorder;
