import { useState, useRef, useEffect } from 'react';
import useLiveStream from './useVideoLiveStream';

const useScreenRecording = (candidate, handleSlackAlert, isCandidateOS, setPath, isScreenSharingNotActive) => {
  const { videoSocketRef, sendBytes, connectStreamSocket, closeStreamSocket } = useLiveStream(candidate);
  const mediaRecorderRef = useRef(null);
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const screenRecorderRef = useRef(null);
  const mergedScreenRecorderRef = useRef(null);
  const intervalRef = useRef(null);

  const PROCTOR_API_URL = process.env.VITE_REACT_APP_PROCTOR_API_URL;

  const captureAndDownloadImage = async () => {
    if (!screenRecorderRef.current) {
      console.error("No active screen recording stream found.");
      return;
    }

    if (!mediaRecorderRef.current) {
      console.error("No active media recorder found.");
      return;
    };

    const videoTrack = screenRecorderRef.current.getVideoTracks()[0];
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
        const response = await fetch(`${PROCTOR_API_URL}humanless/Verification_tab_change_image/candidate/${candidate.Interviews[0].candidate_id}/session/${candidate.Interviews[0].id}`, {
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


  // let mergedStream ;
  const startScreenRecording = async () => {
    try {

      // screen recorder
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'monitor' },
        audio: true
      });

      const screenShareTrack = screenStream.getTracks()[0];
      screenRecorderRef.current = screenStream;

      // Add an event listener to detect when screen sharing stops
      screenShareTrack.addEventListener('ended', () => {
        isScreenSharingNotActive.current = true;
        setPath('bot-fail');
        console.debug('Candidate Manually Stopped Screen Sharing');
        stopScreenRecording();
      });

      const hasAudioTrack = screenStream.getAudioTracks().length > 0;
      const isEntireScreenSelected = screenStream.getVideoTracks()[0].getSettings().displaySurface === 'monitor';

      let osConditionCheck;
      const candidateOS = sessionStorage.getItem('mas_candidate_os');
      if (candidateOS !== 'Windows') {
        osConditionCheck = isEntireScreenSelected !== true;
      } else {
        osConditionCheck = isEntireScreenSelected !== true || !hasAudioTrack;
      }

      if (osConditionCheck) {
        sessionStorage.setItem("system-audio-enable", false);
        screenStream.getTracks().forEach(track => track.stop())
        console.debug('Entire screen sharing and system audio denied by candidate');
        return;
      } else {
        sessionStorage.setItem("system-audio-enable", true);
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true
          }
        });

        const AudioTracks = screenStream.getAudioTracks();

        if (AudioTracks.length === 0) {
          mergedScreenRecorderRef.current = mergeStreammicroaudio(screenStream, audioStream);
          console.log('---AudioTracks.length equal zero---');
        } else {
          console.log('---AudioTracks.length not zero---');
          mergedScreenRecorderRef.current = mergeStreams(screenStream, audioStream);
        }

        await getMediaRecorder();

        setIsScreenRecording(true);
        await connectStreamSocket();
        // return true
      }
      
      // screenShareTrack.addEventListener('ended', async () => {
      //   // Check if screen video track is still live before treating as stopped
      //   const screenTracks = screenRecorderRef.current?.getVideoTracks() || [];

      //   if (screenTracks.length > 0 && screenTracks[0].readyState === 'live') {
      //     console.debug('Audio device changed, but screen sharing is still active.');
      //     return; // Ignore this event since only audio changed
      //   }

      //   // If no active screen video track, treat as stopped
      //   isScreenSharingNotActive.current = true;
      //   setPath('bot-fail');
      //   console.debug('Candidate Manually Stopped Screen Sharing');
      //   stopScreenRecording();
      // });

      // Handle audio device switching separately
      // navigator.mediaDevices.addEventListener('devicechange', async () => {
      //   console.debug('Audio device changed. Ensuring screen sharing remains active.');

      //   if (!screenRecorderRef.current) return;

      //   const screenTracks = screenRecorderRef.current.getVideoTracks();

      //   if (screenTracks.length > 0 && screenTracks[0].readyState === 'live') {
      //     console.debug('Screen sharing is still active, no need to stop.');
      //     return;
      //   }

      //   console.warn('Screen sharing stopped unexpectedly.');
      //   isScreenSharingNotActive.current = true;
      //   setPath('bot-fail');
      //   stopScreenRecording();
      // });

      return true;

    } catch (error) {
      console.error(`
        Error starting screen recording:
        - Error Message: ${error.message}
        - Stack Trace: ${error.stack}
        - Candidate OS: ${sessionStorage.getItem('mas_candidate_os')}
        - Is Entire Screen Selected: ${screenStream?.getVideoTracks()[0]?.getSettings()?.displaySurface === 'monitor'}
        - Has Audio Track: ${screenStream?.getAudioTracks().length > 0}
        - System Audio State: ${sessionStorage.getItem("system-audio-enable")}
        - Screen Settings: ${JSON.stringify(screenStream?.getVideoTracks()[0]?.getSettings(), null, 2)}
      `);

      console.error("Error starting screen recording and entire sharing screen was denied by candidate");
      setIsScreenRecording(false);
    }
  };

  const getMediaRecorder = async () => {
    try {
      const connection = navigator.connection;

      let videoBits = 1500000; // Minimum 1.5 Mbps (720p guaranteed)

      if (connection) {
        videoBits = connection.downlink > 5 ? 2500000 :  // 2.5 Mbps for better quality
                    connection.downlink > 2 ? 2000000 :  // 2 Mbps for stable 720p+
                    1500000;  // 1.5 Mbps as absolute minimum for 720p
      }

      const stream = mergedScreenRecorderRef.current;
      const newMediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: videoBits, // Ensuring at least 720p
        audioBitsPerSecond: 128000  // 128 kbps for high-quality audio
      });

      mediaRecorderRef.current = newMediaRecorder;

      newMediaRecorder.ondataavailable = async (event) => {

        if (event.data.size > 0 && videoSocketRef.current) {
          // send bytes to the server
          await sendBytes(event.data);

        } else {
          // stop the media recorder
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.ondataavailable = null;
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
            console.warn("previous media recorder stopped...");
          }

          // Reconnect the socket and media recorder
          await new Promise((resolve) => setTimeout(resolve, 500));
          console.warn("waiting time for reconnection...");

          // Reconnect the socket
          await connectStreamSocket();
          console.warn("video socket got disconnected reconnection triggered...");

          // Reconnect the media recorder
          await getMediaRecorder();
          console.warn("new media recorder triggered...");

        }
      };

      newMediaRecorder.start(2000);
    } catch (error) {
      console.error("Error capturing screen:", error);
    }
  };

  const stopScreenRecording = async () => {
    console.debug('Triggered stopScreenRecording ');
    closeStreamSocket();

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.ondataavailable = null;
      await mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;

      // this is for close stop sharing popup
      const stop_Individual_Video = screenRecorderRef.current ? screenRecorderRef.current.getTracks().forEach(track => track.stop()) : null;
      setIsScreenRecording(false);
    } else {
      console.log('mediaRecorderRef.current is not defined');
    }
    sessionStorage.setItem('screen-record-send', true);
  };

  const mergeStreammicroaudio = (screenStream, audioStream) => {
    const tracks = [
      ...screenStream.getVideoTracks(),
      ...audioStream.getAudioTracks()
    ];
    return new MediaStream(tracks);
  };

  const mergeStreams = (screenStream, audioStream) => {
    const videoTracks = screenStream.getVideoTracks();

    // Create a new audio context
    const audioContext = new AudioContext();

    // Create audio sources for each track
    const systemAudioSource = audioContext.createMediaStreamSource(screenStream);
    const userAudioSource = audioContext.createMediaStreamSource(audioStream);

    // Create a destination node to connect the audio sources
    const destination = audioContext.createMediaStreamDestination();

    // Connect the audio sources to the destination
    systemAudioSource.connect(destination);
    userAudioSource.connect(destination);

    // Create a new media stream with the combined tracks
    const combinedStream = new MediaStream([
      ...videoTracks,
      destination.stream.getAudioTracks()[0] // Use the first audio track from the destination stream
    ]);

    return combinedStream;
  };

  return { isScreenRecording, startScreenRecording, stopScreenRecording, captureAndDownloadImage };
};

export default useScreenRecording;
