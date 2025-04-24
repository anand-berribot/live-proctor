// C:\Users\prave\Desktop\berribot\mastermind-v2\berribot_mui\src\new_hooks\useMediaPermissions.js
import { useState } from 'react';
import { useMediaStatus } from 'src/new_contexts/media-status-context';

export const useMediaPermissions = () => {
  const { setShowAlert } = useMediaStatus();
  const [permissionStep, setPermissionStep] = useState('camera');
  const [warningMessage, setWarningMessage] = useState('');

  const handleNextPermission = async (cameraAllowed, micAllowed) => {
    if (permissionStep === 'camera') {
      if (!cameraAllowed) {
        setWarningMessage('Camera access is required to continue. Please allow camera access in your browser settings.');
        setShowAlert(true);
        return false;
      }
      setPermissionStep('microphone');
      return true;
    }

    if (permissionStep === 'microphone') {
      if (!micAllowed) {
        setWarningMessage('Microphone access is required to continue. Please allow microphone access in your browser settings.');
        setShowAlert(true);
        return false;
      }
      setPermissionStep('done');
      return true;
    }

    return true;
  };

  return {
    permissionStep,
    warningMessage,
    handleNextPermission,
  };
};