import { useState, useEffect, useCallback } from 'react';

export const useMicrophone = () => {
  const [micDevices, setMicDevices] = useState([]);
  const [selectedMic, setSelectedMic] = useState('');
  const [micStream, setMicStream] = useState(null);
  const [micError, setMicError] = useState(null);
  const [micAllowed, setMicAllowed] = useState(false);

  const refreshMics = useCallback(async () => {
    try {
      console.log('[MIC] Refreshing microphone devices...');
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      console.log(`[MIC] Found ${audioDevices.length} microphone devices`);
      setMicDevices(audioDevices);
      if (audioDevices.length > 0 && !selectedMic) {
        setSelectedMic(audioDevices[0].deviceId);
      }
    } catch (error) {
      console.error('[MIC] Error refreshing devices:', error);
      setMicError(error);
    }
  }, [selectedMic]);

  const checkMicPermission = useCallback(async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
      console.log('[MIC] Initial permission state:', permissionStatus.state);
      setMicAllowed(permissionStatus.state === 'granted');
      if (permissionStatus.state === 'granted') {
        await refreshMics();
      }
      return permissionStatus.state === 'granted';
    } catch (error) {
      console.error('[MIC] Permission check failed:', error);
      setMicAllowed(false);
      return false;
    }
  }, [refreshMics]);

  const requestMicAccess = useCallback(async (deviceId = null) => {
    try {
      console.log(`[MIC] Requesting access for device: ${deviceId || 'default'}`);
      const constraints = deviceId 
        ? { audio: { deviceId: { exact: deviceId } } } 
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('[MIC] Microphone access granted');
      setMicStream(stream);
      setMicAllowed(true);
      await refreshMics();
      return true;
    } catch (error) {
      console.error('[MIC] Access denied:', error);
      setMicAllowed(false);
      setMicError(error);
      return false;
    }
  }, [refreshMics]);

  const handleMicChange = useCallback(async (deviceId) => {
    console.log(`[MIC] Changing to device: ${deviceId}`);
    try {
      setSelectedMic(deviceId);
      if (micStream) {
        console.log('[MIC] Stopping previous stream');
        micStream.getTracks().forEach(track => track.stop());
      }
      await requestMicAccess(deviceId);
    } catch (error) {
      console.error('[MIC] Device change failed:', error);
      setMicError(error);
    }
  }, [micStream, requestMicAccess]);

  // New cleanup function
  const cleanupMic = useCallback(() => {
    console.log('[MIC] Cleaning up microphone...');
    if (micStream) {
      console.log('[MIC] Stopping all tracks');
      micStream.getTracks().forEach(track => track.stop());
      setMicStream(null);
    }
    setMicAllowed(false);
    setSelectedMic('');
    setMicDevices([]);
    setMicError(null);
    console.log('[MIC] Microphone cleanup complete');
  }, [micStream]);

  useEffect(() => {
    checkMicPermission();
  }, [checkMicPermission]);

  useEffect(() => {
    const handleDeviceChange = () => {
      console.log('[MIC] Device change detected');
      refreshMics();
    };
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [refreshMics]);

  return {
    micDevices,
    selectedMic,
    micStream,
    micError,
    micAllowed,
    requestMicAccess,
    handleMicChange,
    refreshMics,
    checkMicPermission,
    cleanupMic, 
  };
};