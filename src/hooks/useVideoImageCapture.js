import { useRef, useState } from 'react';

const useVideoImageCapture = () => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  const startVideoCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsRecording(true);
      } else {
        console.error('Video element not found');
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const stopVideoCapture = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsRecording(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png');
    }
    return null;
  };

  return { videoRef, isRecording, startVideoCapture, stopVideoCapture, captureImage };
};

export default useVideoImageCapture;
