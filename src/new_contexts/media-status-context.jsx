import { createContext, useState, useEffect, useContext } from 'react';
import { useMastermind } from './mastermind-context';

// Create the context
const MediaStatusContext = createContext({
  cameraEnabled: true,
  microphoneEnabled: true,
  // showAlert: false,
  // alertMessage: '',
  // setShowAlert: () => { },
});

// Context Provider Component
export const MediaStatusProvider = ({ children }) => {
  const { candidateData, setErrorType, setAlertMessage, setAlertTitle, setShowAlert } = useMastermind();

  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);

  const cameraRequired = candidateData?.Interviews[0]?.candidate_camera_required ?? true;

  // Function to check camera and microphone permissions
  const checkPermissions = async () => {
    try {
      if (cameraRequired) {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' });
        setCameraEnabled(cameraPermission.state === 'granted');
        if (cameraPermission.state === 'denied') {
          setAlertMessage('Camera access is required. Please enable it in your browser settings.');
          setShowAlert(true);
        }
      } else {
        setCameraEnabled(true); // Assume camera is enabled if not required
      }

      const micPermission = await navigator.permissions.query({ name: 'microphone' });
      setMicrophoneEnabled(micPermission.state === 'granted');

      if (micPermission.state === 'denied') {
        setAlertMessage('Microphone access is required. Please enable it in your browser settings.');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Permission check error:', error);
    }
  };

  // Periodically check permissions
  useEffect(() => {
    checkPermissions(); // Initial check
    const interval = setInterval(checkPermissions, 5000); // Check every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [cameraRequired]);

  // Provide context values to children
  return (
    <MediaStatusContext.Provider
      value={{
        cameraEnabled,
        microphoneEnabled,
        showAlert,
        setShowAlert,
        alertMessage,
      }}
    >
      {children}
    </MediaStatusContext.Provider>
  );
};

// Custom hook to use the media status context
export const useMediaStatus = () => useContext(MediaStatusContext);