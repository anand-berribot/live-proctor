import { enqueueSnackbar } from "notistack";
import { useState, useEffect } from "react";

function useWebCamMedia(showSweetAlert) {
  const [webcamStream, setWebcamStream] = useState(null);
  const [error, setError] = useState(null);

  const enableWebcam = async () => {
    try {
      disableWebCam(); // Stop the existing stream if it exists

      // Access the new webcam stream
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      const videoTrack = newStream.getVideoTracks()[0];

      videoTrack.onended = () => {
        enqueueSnackbar('Camera has been disabled.', { variant: 'error', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        // showSweetAlert('Camera has been disabled.', 'error');
        console.debug('Webcam stream ended.');
        sessionStorage.setItem('webcam-enable', false);
        setWebcamStream(null);
      };
      

      // Update the state with the new stream
      setWebcamStream(newStream);
      setError(null); // Clear any previous errors
      console.debug('Webcam enabled.');
      sessionStorage.setItem('webcam-enable', true);
      return true;
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setError(error); // Set the error state
      return false;
    }
  };

  const disableWebCam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
      console.debug('Webcam disabled.');
      sessionStorage.setItem('webcam-enable', false);
    }
  };

  useEffect(() => {
    // Clean up the webcam stream when the component unmounts
    return () => {
      disableWebCam();
      console.debug('Webcam cleanup completed.');
    };
  }, []);

  return { enableWebcam, disableWebCam, webcamStream, error };
}

export default useWebCamMedia;
