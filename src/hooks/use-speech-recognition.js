import { useRef, useEffect } from 'react';
import hark from 'hark';

const useSpeechRecognition = (onResult, callActive, listening, isPlaying) => {
  const vadEvents = useRef(null);
  const mediaRecorder = useRef(null);
  const speakingMaxGap = useRef(2000); // in ms
  const delayedSpeakingTimeoutID = useRef(null);

  const recognition = useRef(null);
  const audioContext = useRef(null);
  const currentDeviceId = useRef(null);

  useEffect(() => {
    // Initialize Web Audio API
    if ('AudioContext' in window) {
      audioContext.current = new window.AudioContext();
      console.debug('Web Audio API initialized with AudioContext.');
    } else if ('webkitAudioContext' in window) {
      audioContext.current = new window.webkitAudioContext();
      console.debug('Web Audio API initialized with webkitAudioContext.');
    } else {
      console.error('Web Audio API is not supported in this browser.');
      return; // Exit early if AudioContext is not supported
    }

    // Cleanup on unmount
    return () => {
      if (recognition.current) {
        recognition.current.abort();
        recognition.current = null;
        console.debug('Speech recognition aborted and cleaned up.');
      }
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
        console.debug('Audio context closed and cleaned up.');
      }
    };
  }, []);

  // Function to get the audio input device (headset or Bluetooth)
  const getAudioInputDevice = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
      console.debug('Audio input devices found:', audioDevices);
      
      if (audioDevices.length === 0) {
        console.warn('No audio input devices found.');
        return null;
      }

      // Find the Bluetooth or headset device by label or fallback to the first one
      const selectedDevice = audioDevices.find(device => {
        return device.label && (device.label.toLowerCase().includes('headset') || device.label.toLowerCase().includes('bluetooth'));
      });

      if (selectedDevice) {
        console.debug('Selected audio device:', selectedDevice);
        return selectedDevice.deviceId;
      } else {
        console.warn('No specific headset/Bluetooth device found. Using the first available input device.');
        return audioDevices[0]?.deviceId;
      }
    } catch (error) {
      console.error('Error fetching audio input devices:', error);
      return null;
    }
  };

  // Initialize speech recognition and VAD (Voice Activity Detection)
  const initializeSpeechRecognition = async () => {
    console.debug("Initializing speech recognition...");

    try {
      const deviceId = await getAudioInputDevice();
      
      if (!deviceId) {
        console.error('Failed to find a valid audio input device.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId,
          noiseSuppression: true,
          echoCancellation: true,
          channelCount: 1,
          autoGainControl: true,
        },
      }); 

      if (!audioContext.current) {
        console.error("AudioContext not initialized properly.");
        return;
      }

      const source = audioContext.current.createMediaStreamSource(stream);
      const processor = audioContext.current.createScriptProcessor(1024, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.current.destination);

      mediaRecorder.current = new MediaRecorder(stream);
      console.debug("Media stream initialized and connected to audio processor.");

      // Initialize SpeechRecognition
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition.current = new SpeechRecognition();
        console.debug('SpeechRecognition API is available and initialized.');
      } else {
        console.error('Speech Recognition API is not supported in this browser.');
        return;
      }

      // Initialize Voice Activity Detection (VAD)
      vadEvents.current = hark(mediaRecorder.current.stream, { interval: 0, threshold: -53 });
      setupVADListeners();

      // Set recognition properties
      recognition.current.lang = 'en-US';
      recognition.current.interimResults = true;
      recognition.current.maxAlternatives = 1;

      // Bind recognition event handlers
      recognition.current.onend = handleRecognitionEnd;
      recognition.current.onerror = handleRecognitionError;
      recognition.current.onresult = onResult;

      console.debug("Speech recognition initialized successfully.");
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
    }
  };

  const setupVADListeners = () => {
    if (!vadEvents.current) return;

    vadEvents.current.on('speaking', () => {
      console.log("=== User is speaking ===");
      clearTimeout(delayedSpeakingTimeoutID.current);
      sessionStorage.setItem('isHarkDetected', 'speaking');
      sessionStorage.setItem('mas_bot_listening', true);
    });

    vadEvents.current.on('stopped_speaking', () => {
      sessionStorage.setItem('mas_bot_listening', false);
      delayedSpeakingTimeoutID.current = setTimeout(() => {
        console.log("=== User stopped speaking ===");
        sessionStorage.setItem('isHarkDetected', 'stopped_speaking');
      }, speakingMaxGap.current);
    });
  };

  const handleRecognitionEnd = () => {
    if (shouldRestartRecognition()) {
      console.warn('Speech recognition ended unexpectedly. Restarting...');
      restartRecognition();
    }
  };

  const shouldRestartRecognition = () => {
    const botCode_Question = sessionStorage.getItem('botCode_Question') === 'false';
    return (
      listening.current &&
      sessionStorage.getItem('UserMessageReceived') === 'false' &&
      callActive.current &&
      botCode_Question
    );
  };

  const handleRecognitionError = (event) => {
    console.warn('Speech recognition error:', event.error, {
      listening: listening.current,
      userMessageReceived: sessionStorage.getItem('UserMessageReceived') === 'true',
      callActive: callActive.current,
    });

    if (shouldRestartRecognition()) {
      restartRecognition();
    }
  };

  const restartRecognition = () => {
    stopListening();
    setTimeout(startListening, 1000);
  };

  const startListening = () => {
    try {
      recognition.current.start();
      listening.current = true;
      console.debug('Started listening.');
    } catch (error) {
      console.debug('Speech recognition already started.');
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      listening.current = false;
      console.debug('Stopped listening.');
    }
  };

  const closeRecognition = () => {
    stopListening();
    recognition.current = null;
    console.debug('Speech recognition closed.');
    if (vadEvents.current) {
      vadEvents.current.stop();
      vadEvents.current = null;
      console.debug('Voice Activity Detection stopped.');
    }
  };

  return {
    startListening,
    stopListening,
    closeRecognition,
    initializeSpeechRecognition,
  };
};

export default useSpeechRecognition;
