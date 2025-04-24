// C:\Users\prave\Desktop\berribot\mastermind-v2\berribot_mui\src\new_hooks\useScreenRecording.js
import { useState, useRef } from 'react';
import { enqueueSnackbar } from 'notistack';
import useLiveStream from './useVideoLiveStream';

const useScreenRecording = (candidateData, setCurrentPage, setErrorType, os) => {
  const { videoSocketRef, sendVideoData, connectVideoSocket, closeVideoSocket } = useLiveStream(candidateData);
  const [isRecording, setIsRecording] = useState(false);
  const screenStreamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const mergedStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const isMacOS = os.toLowerCase().includes('mac');

  const PROCTOR_API_URL = process.env.VITE_REACT_APP_PROCTOR_API_URL;


  const captureAndDownloadImage = async () => {
    if (!screenStreamRef.current) {
      console.error("No active screen recording stream found.");
      return;
    }

    if (!mediaRecorderRef.current) {
      console.error("No active media recorder found.");
      return;
    };

    const videoTrack = screenStreamRef.current.getVideoTracks()[0];
    if (!videoTrack) {
      console.error("No video track found in the stream.");
      return;
    }

    const videoElement = document.createElement("video");
    videoElement.srcObject = new MediaStream([videoTrack]);
    await videoElement.play();

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    videoElement.pause();
    videoElement.srcObject = null;

    // Convert canvas to a blob
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('screen_shot_image', blob, 'tabchange-screenshot.png');

      try {
        const response = await fetch(`${PROCTOR_API_URL}humanless/Verification_tab_change_image/candidate/${candidateData?.Interviews[0]?.candidate_id}/session/${candidateData?.Interviews[0].id}`, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          console.log(`Image uploaded successfully: ${result}`);
        } else {
          console.error(`Failed to upload image: ${result}`);
        }
      } catch (error) {
        console.error(`Error uploading image: ${error}`);
      }
    }, 'image/png');
  };

  const startScreenRecording = async () => {
    console.info(`[useScreenRecording] Starting screen recording for candidate ID: ${candidateData.Interviews[0].candidate_id}`);
    try {
      const screenConstraints = {
        video: { displaySurface: 'monitor' },
        audio: !isMacOS, // Disable system audio for macOS
      };
      const screenStream = await navigator.mediaDevices.getDisplayMedia(screenConstraints);
      screenStreamRef.current = screenStream;
      console.debug(`[useScreenRecording] Screen stream initialized - Video tracks: ${screenStream.getVideoTracks().length}, Audio tracks: ${screenStream.getAudioTracks().length}`);

      screenStream.getVideoTracks()[0].onended = () => {
        console.warn(`[useScreenRecording] Screen sharing stopped by user`);
        stopScreenRecording();
        enqueueSnackbar('Screen sharing stopped. Please restart.', { variant: 'warning' });
        setErrorType('isScreenSharingNotActive');
        setCurrentPage('BOT_FAIL');
      };

      const isEntireScreen = screenStream.getVideoTracks()[0].getSettings().displaySurface === 'monitor';
      const hasSystemAudio = screenStream.getAudioTracks().length > 0;

      if (!isEntireScreen || (!isMacOS && !hasSystemAudio)) {
        screenStream.getTracks().forEach(track => track.stop());
        console.warn(`[useScreenRecording] Invalid screen share - Entire screen: ${isEntireScreen}, System audio: ${hasSystemAudio}`);
        enqueueSnackbar(`Please share your entire screen${isMacOS ? '' : ' with system audio'}.`, { variant: 'warning' });
        return false;
      }

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      audioStreamRef.current = audioStream;
      console.debug(`[useScreenRecording] Audio stream initialized - Audio tracks: ${audioStream.getAudioTracks().length}`);

      audioStream.getAudioTracks()[0].onended = () => {
        console.info(`[useScreenRecording] Audio device disconnected`);
        updateAudioStream();
      };

      mergedStreamRef.current = hasSystemAudio && !isMacOS
        ? mergeStreamsWithSystemAudio(screenStream, audioStream)
        : mergeStreamsWithoutSystemAudio(screenStream, audioStream);
      console.debug(`[useScreenRecording] Streams merged - Has system audio: ${hasSystemAudio}`);

      await initializeMediaRecorder();
      setIsRecording(true);
      await connectVideoSocket();
      console.info(`[useScreenRecording] Screen recording started successfully`);
      return true;
    } catch (error) {
      console.error(`[useScreenRecording] Error starting screen recording: ${error.message}`);
      enqueueSnackbar('Failed to start screen recording. Please try again.', { variant: 'error' });
      setIsRecording(false);
      return false;
    }
  };

  const initializeMediaRecorder = async () => {
    try {
      const stream = mergedStreamRef.current;
      if (!stream) {
        console.error(`[useScreenRecording] No merged stream available`);
        enqueueSnackbar('Recording setup failed. Please try again.', { variant: 'error' });
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        bitsPerSecond: 2000000,
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && videoSocketRef.current) {
          await sendVideoData(event.data);
          console.debug(`[useScreenRecording] Video data sent - Size: ${event.data.size} bytes`);
        } else if (!videoSocketRef.current) {
          console.warn(`[useScreenRecording] WebSocket disconnected`);
          mediaRecorder.stop();
          await connectVideoSocket();
          await initializeMediaRecorder();
        }
      };

      mediaRecorder.start(2000);
      console.info(`[useScreenRecording] MediaRecorder started`);
    } catch (error) {
      console.error(`[useScreenRecording] Error initializing MediaRecorder: ${error.message}`);
      enqueueSnackbar('Recording setup failed. Please try again.', { variant: 'error' });
    }
  };

  const stopScreenRecording = () => {
    try {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
        console.debug(`[useScreenRecording] MediaRecorder stopped`);
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
        console.debug(`[useScreenRecording] Screen stream stopped`);
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
        console.debug(`[useScreenRecording] Audio stream stopped`);
      }
      closeVideoSocket();
      setIsRecording(false);
      console.info(`[useScreenRecording] Screen recording stopped`);
    } catch (error) {
      console.error(`[useScreenRecording] Error stopping recording: ${error.message}`);
      enqueueSnackbar('Error stopping recording. Please try again.', { variant: 'error' });
    }
  };

  const updateAudioStream = async () => {
    console.info(`[useScreenRecording] Updating audio stream`);
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      console.debug(`[useScreenRecording] Previous audio stream stopped`);
    }

    try {
      const newAudioStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      audioStreamRef.current = newAudioStream;
      console.debug(`[useScreenRecording] New audio stream initialized`);

      const screenStream = screenStreamRef.current;
      if (!screenStream) {
        console.error(`[useScreenRecording] No active screen stream`);
        enqueueSnackbar('Audio update failed. Please restart recording.', { variant: 'error' });
        return;
      }

      const hasSystemAudio = screenStream.getAudioTracks().length > 0;
      mergedStreamRef.current = hasSystemAudio && !isMacOS
        ? mergeStreamsWithSystemAudio(screenStream, newAudioStream)
        : mergeStreamsWithoutSystemAudio(screenStream, newAudioStream);
      console.debug(`[useScreenRecording] Streams re-merged`);

      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        console.debug(`[useScreenRecording] Previous MediaRecorder stopped`);
      }
      await initializeMediaRecorder();
      console.info(`[useScreenRecording] Audio stream updated`);
    } catch (error) {
      console.error(`[useScreenRecording] Error updating audio stream: ${error.message}`);
      enqueueSnackbar('Audio update failed. Please try again.', { variant: 'error' });
    }
  };

  const mergeStreamsWithoutSystemAudio = (screenStream, audioStream) => {
    try {
      const mergedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);
      console.debug(`[useScreenRecording] Merged streams without system audio`);
      return mergedStream;
    } catch (error) {
      console.error(`[useScreenRecording] Error merging streams: ${error.message}`);
      enqueueSnackbar('Stream merging failed.', { variant: 'error' });
      return null;
    }
  };

  const mergeStreamsWithSystemAudio = (screenStream, audioStream) => {
    try {
      const audioContext = new AudioContext();
      const systemAudioSource = audioContext.createMediaStreamSource(screenStream);
      const userAudioSource = audioContext.createMediaStreamSource(audioStream);
      const destination = audioContext.createMediaStreamDestination();

      systemAudioSource.connect(destination);
      userAudioSource.connect(destination);

      const mergedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        destination.stream.getAudioTracks()[0],
      ]);
      console.debug(`[useScreenRecording] Merged streams with system audio`);
      return mergedStream;
    } catch (error) {
      console.error(`[useScreenRecording] Error merging streams with system audio: ${error.message}`);
      enqueueSnackbar('Stream merging failed.', { variant: 'error' });
      return null;
    }
  };

  return { isRecording, startScreenRecording, stopScreenRecording, captureAndDownloadImage };
};

export default useScreenRecording;