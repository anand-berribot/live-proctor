// File: src/new_hooks/useMicrophoneTest.js
import { useState, useEffect, useRef } from 'react';

const useMicrophoneTest = () => {
  const [isMicrophoneSupported, setIsMicrophoneSupported] = useState(false);
  const [microphoneTestTranscript, setMicrophoneTestTranscript] = useState('');
  const [isListen, setIsListen] = useState(false);
  const microphoneTestRef = useRef(null);

  const initializeMicrophoneTest = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        microphoneTestRef.current = new SpeechRecognition();
        microphoneTestRef.current.continuous = true;
        microphoneTestRef.current.interimResults = true;

        setIsMicrophoneSupported(true);
        console.info(`${`Microphone test initialized successfully at ${new Date().toISOString()}`}`);
      } catch (err) {
        setIsMicrophoneSupported(false);
        console.error(`${`Failed to initialize microphone test: ${err.message} at ${new Date().toISOString()} - System: ${navigator.userAgent}, Platform: ${navigator.platform}`}`);
      }
    } else {
      setIsMicrophoneSupported(false);
      console.warn(`${`Microphone test not supported in this browser at ${new Date().toISOString()} - System: ${navigator.userAgent}, Platform: ${navigator.platform}, Language: ${navigator.language}`}`);
    }

    if (microphoneTestRef.current) {
      microphoneTestRef.current.onresult = (event) => {
        try {
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += result + ' ';
            } else {
              interimTranscript += result;
            }
          }
          const currentTranscript = interimTranscript || finalTranscript.trim();
          if (currentTranscript) {
            setMicrophoneTestTranscript(currentTranscript);
            console.debug(`${`Microphone test captured ${interimTranscript ? 'interim' : 'final'} transcript: "${currentTranscript}" at ${new Date().toISOString()}`}`);
          }
        } catch (err) {
          console.error(`${`Error processing microphone test results: ${err.message} at ${new Date().toISOString()}`}`);
        }
      };

      microphoneTestRef.current.onerror = (event) => {
        const errorMsg = event.error;
        console.error(`${`Microphone test error: ${errorMsg} at ${new Date().toISOString()} - System: ${navigator.userAgent}, Platform: ${navigator.platform}`}`);
        switch (errorMsg) {
          case 'no-speech':
            console.warn(`${`No speech detected during microphone test at ${new Date().toISOString()}`}`);
            break;
          case 'aborted':
            console.warn(`${`Microphone test aborted at ${new Date().toISOString()}`}`);
            break;
          case 'network':
            console.error(`${`Network error during microphone test at ${new Date().toISOString()}`}`);
            break;
          default:
            console.error(`${`Unknown microphone test error: ${errorMsg} at ${new Date().toISOString()}`}`);
        }
      };

      microphoneTestRef.current.onend = () => {
        console.log(`${`Microphone test recognition ended naturally at ${new Date().toISOString()}`}`);
        if (isListen) {
          console.debug(`${`Restarting microphone test listening due to natural end at ${new Date().toISOString()}`}`);
          startMicrophoneListen();
        } else {
          console.log(`${`Microphone test not restarted as it was not in listening phase at ${new Date().toISOString()}`}`);
        }
      };
    }
  };

  const startMicrophoneListen = () => {
    if (!isMicrophoneSupported || !microphoneTestRef.current) {
      console.warn(`${`Cannot start microphone test: Not supported or not initialized at ${new Date().toISOString()}`}`);
      return;
    }

    try {
      setMicrophoneTestTranscript('');
      setIsListen(true);
      microphoneTestRef.current.start();
      console.info(`${`Microphone test listening started at ${new Date().toISOString()}`}`);
    } catch (err) {
      setIsListen(false);
      console.error(`${`Error starting microphone test: ${err.message} at ${new Date().toISOString()} - System: ${navigator.userAgent}`}`);
    }
  };

  const stopMicrophoneListen = () => {
    if (!isMicrophoneSupported || !microphoneTestRef.current) {
      console.warn(`${`Cannot stop microphone test: Not supported or not initialized at ${new Date().toISOString()}`}`);
      return;
    }

    try {
      microphoneTestRef.current.stop();
      setIsListen(false);
      console.info(`${`Microphone test listening stopped at ${new Date().toISOString()} - Transcript: "${microphoneTestTranscript}"`}`);
    } catch (err) {
      setIsListen(false);
      console.error(`${`Error stopping microphone test: ${err.message} at ${new Date().toISOString()} - System: ${navigator.userAgent}`}`);
    }
  };

  const closeMicrophoneTest = () => {
    if (microphoneTestRef.current) {
      try {
        microphoneTestRef.current.stop();
        microphoneTestRef.current = null;
        setIsListen(false);
        console.debug(`${`Microphone test recognition closed at ${new Date().toISOString()}`}`);
      } catch (err) {
        console.error(`${`Error closing microphone test: ${err.message} at ${new Date().toISOString()}`}`);
      }
    } else {
      console.log(`${`No active microphone test to close at ${new Date().toISOString()}`}`);
    }
  };

  useEffect(() => {
    return () => {
      closeMicrophoneTest();
      console.debug(`${`Microphone test cleanup completed at ${new Date().toISOString()}`}`);
    };
  }, []);

  return {
    initializeMicrophoneTest,
    startMicrophoneListen,
    stopMicrophoneListen,
    closeMicrophoneTest,
    microphoneTestTranscript,
    isMicrophoneSupported,
  };
};

export default useMicrophoneTest;