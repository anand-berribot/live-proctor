import { useState, useEffect, useCallback } from 'react';

// Custom hook for managing camera access and state
export const useCamera = () => {
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [cameraAllowed, setCameraAllowed] = useState(false);

  // Refresh available camera devices
  const refreshCameras = useCallback(async () => {
    try {
      console.info('[CAMERA] Refreshing camera devices');
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.debug('[CAMERA] Found %d camera devices', videoDevices.length);
      setCameraDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
        console.debug('[CAMERA] Selected default camera: %s', videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('[CAMERA] Failed to refresh devices:', error);
      setCameraError(error);
    }
  }, [selectedCamera]);

  // Check camera permission status
  const checkCameraPermission = useCallback(async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' });
      console.info('[CAMERA] Camera permission state: %s', permissionStatus.state);
      setCameraAllowed(permissionStatus.state === 'granted');
      if (permissionStatus.state === 'granted') {
        await refreshCameras();
      }
      return permissionStatus.state === 'granted';
    } catch (error) {
      console.error('[CAMERA] Permission check failed:', error);
      setCameraAllowed(false);
      return false;
    }
  }, [refreshCameras]);

  // Request camera access
  const requestCameraAccess = useCallback(async (deviceId = null) => {
    try {
      console.info('[CAMERA] Requesting camera access for device: %s', deviceId || 'default');
      const constraints = deviceId 
        ? { video: { deviceId: { exact: deviceId } } } 
        : { video: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.info('[CAMERA] Camera access granted');
      setCameraStream(stream);
      setCameraAllowed(true);
      await refreshCameras();
      return true;
    } catch (error) {
      console.error('[CAMERA] Camera access denied:', error);
      setCameraAllowed(false);
      setCameraError(error);
      return false;
    }
  }, [refreshCameras]);

  // Handle camera device change
  const handleCameraChange = useCallback(async (deviceId) => {
    console.info('[CAMERA] Changing to camera device: %s', deviceId);
    try {
      setSelectedCamera(deviceId);
      if (cameraStream) {
        console.debug('[CAMERA] Stopping previous camera stream');
        cameraStream.getTracks().forEach(track => track.stop());
      }
      await requestCameraAccess(deviceId);
    } catch (error) {
      console.error('[CAMERA] Camera device change failed:', error);
      setCameraError(error);
    }
  }, [cameraStream, requestCameraAccess]);

  // Cleanup camera resources
  const cleanupCamera = useCallback(() => {
    console.info('[CAMERA] Cleaning up camera resources');
    if (cameraStream) {
      console.debug('[CAMERA] Stopping all camera tracks');
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraAllowed(false);
    setSelectedCamera('');
    setCameraDevices([]);
    setCameraError(null);
    console.info('[CAMERA] Camera cleanup completed');
  }, [cameraStream]);

  // Check permissions on mount
  useEffect(() => {
    console.debug('[CAMERA] Initializing camera permission check');
    checkCameraPermission();
  }, [checkCameraPermission]);

  // Handle device changes
  useEffect(() => {
    const handleDeviceChange = () => {
      console.info('[CAMERA] Device change detected');
      refreshCameras();
    };
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => {
      console.debug('[CAMERA] Removing device change listener');
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [refreshCameras]);


  return {
    cameraDevices,
    selectedCamera,
    cameraStream,
    cameraError,
    cameraAllowed,
    requestCameraAccess,
    handleCameraChange,
    refreshCameras,
    checkCameraPermission,
    cleanupCamera,
  };
};