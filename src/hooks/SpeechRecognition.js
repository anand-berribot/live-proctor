import { useEffect, useRef, useState, useCallback } from 'react';
import { MicVAD } from '@ricky0123/vad-web';

const DEFAULT_LANGUAGE = 'en-US';
const COUNTDOWN_INTERVAL_MS = 1000;

const useSpeechRecognition = (
  { onTranscript, processAgentResponse },
  silenceThreshold,
  maxSilentDuration = 60,
  setPath,
  isVoiceNotDetected,
  networkErrorRef,
  { shouldRestartRecognition } = {}
) => {
  const recognition = useRef(null);
  const isRecognizing = useRef(false);
  const silenceTimeout = useRef(null);
  const longSilenceTimeout = useRef(null);
  const hasTranscriptReceived = useRef(false);
  const countdownInterval = useRef(null);
  const vadRef = useRef(null);
  const isDeviceSwitching = useRef(false);
  const [remainingTime, setRemainingTime] = useState(silenceThreshold);
  const networkErrorCount = useRef(0); // Added to track network errors
  const MAX_NETWORK_RETRIES = 5;

  const clearSilenceTimer = () => {
    if (silenceTimeout.current) {
      clearTimeout(silenceTimeout.current);
      silenceTimeout.current = null;
      console.debug('Cleared silence timer');
    }
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
      console.debug('Cleared countdown interval');
    }
    setRemainingTime(silenceThreshold);
  };

  const clearLongSilenceTimer = () => {
    if (longSilenceTimeout.current) {
      clearTimeout(longSilenceTimeout.current);
      longSilenceTimeout.current = null;
      console.debug('Cleared long silence timer');
    }
  };

  const startLongSilenceTimer = () => {
    clearLongSilenceTimer();
    longSilenceTimeout.current = setTimeout(() => {
      console.warn(`Long silence threshold reached (${maxSilentDuration}s). Closing recognition.`);
      closeRecognition();
      isVoiceNotDetected.current = true;
      setPath('bot-fail');
    }, maxSilentDuration * 1000);
    console.info(`Started long silence timer for ${maxSilentDuration}s`);
  };

  const startSilenceTimer = () => {
    const userMessageReceived = sessionStorage.getItem('UserMessageReceived') === 'true';
    if (userMessageReceived) {
      console.info('User message received in sessionStorage, skipping silence timer');
      return;
    }

    clearSilenceTimer();
    countdownInterval.current = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev > 1 ? prev - 1 : 0;
        console.debug(`Countdown updated: ${newTime}s remaining`);
        return newTime;
      });
    }, COUNTDOWN_INTERVAL_MS);

    silenceTimeout.current = setTimeout(() => {
      console.warn(`Silence threshold reached (${silenceThreshold}s). Stopping listening.`);
      stopListening();
      hasTranscriptReceived.current = false;
      processAgentResponse();
    }, silenceThreshold * 1000);
    console.info(`Started silence timer for ${silenceThreshold}s`);
  };

  const initializeSpeechRecognition = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.error(`Speech Recognition not supported. Browser: ${navigator.userAgent}, Platform: ${navigator.platform}`);
      return;
    }

    recognition.current = new SpeechRecognitionAPI();
    recognition.current.lang = DEFAULT_LANGUAGE;
    recognition.current.interimResults = true;
    recognition.current.maxAlternatives = 1;
    recognition.current.continuous = true;

    recognition.current.onstart = () => {
      isRecognizing.current = true;
      console.info('Speech recognition started');
    };

    recognition.current.onend = () => {
      isRecognizing.current = false;
      console.info('Speech recognition ended');
      if (shouldRestartRecognition?.()) {
        console.debug('Attempting to restart recognition');
        try {
          recognition.current.start();
          isRecognizing.current = true;
        } catch (error) {
          console.error(`Restart failed: ${error.message}`);
        }
      }
    };

    recognition.current.onresult = (event) => {
      let finalText = '';
      let interimText = '';

      if (!hasTranscriptReceived.current) {
        vadRef.current?.start();
        hasTranscriptReceived.current = true;
        console.info('First transcript received, starting VAD');
      }

      clearLongSilenceTimer();
      console.debug(`Speech recognition result: ${event}`);

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interimText += transcript;
      }
      onTranscript({ finalTranscript: finalText, interimTranscript: interimText });
    };

    recognition.current.onerror = (event) => {
      console.error(`Speech recognition error: ${event.error}`);
      
      if (event.error === 'network') {
        networkErrorCount.current += 1;
        
        // Exponential backoff with jitter
        const retryDelay = Math.min(
          1000 * Math.pow(2, networkErrorCount.current) + Math.random() * 500,
          30000
        );
        
        setTimeout(() => {
          if (shouldRestartRecognition?.() && networkErrorCount.current < MAX_NETWORK_RETRIES) {
            try {
              recognition.current.start();
            } catch (error) {
              console.error('Network error retry failed');
            }
          } else {
            console.error('Max network retries exceeded');
            networkErrorRef.current = true;
            setPath('bot-fail');
          }
        }, retryDelay);
      }
    };
  }, [onTranscript, shouldRestartRecognition]);


  const monitorConnectionQuality = () => {
    const connection = navigator.connection;
    if (connection) {
      console.debug(`Monitoring connection:
        - Effective type: ${connection.effectiveType}
        - Downlink: ${connection.downlink}Mbps
        - RTT: ${connection.rtt}ms`);
    }
  };
  
  const startListening = () => {
    monitorConnectionQuality();
    sessionStorage.setItem("isNetworkSpeedDetected", true);
    if (!recognition.current) {
      initializeSpeechRecognition();
    }

    if (!isRecognizing.current) {
      try {
        recognition.current.start();
        isRecognizing.current = true;
        startLongSilenceTimer();
        console.info('Started listening for speech');
      } catch (error) {
        console.error(`Speech recognition failed to start: ${error.message}`);
      }
    }
  };

  const stopListening = () => {
    sessionStorage.setItem("isNetworkSpeedDetected", false);
    if (recognition.current && isRecognizing.current) {
      vadRef.current?.pause();
      recognition.current.abort();
      isRecognizing.current = false;
      // Reset network error count when stopping
      networkErrorCount.current = 0;
      networkErrorRef.current = false;
      console.info('Stopped listening for speech, reset network error count');
    }
  };

  const closeRecognition = () => {
    clearSilenceTimer();
    clearLongSilenceTimer();
    if (vadRef.current) {
      vadRef.current.destroy();
      vadRef.current = null;
      console.debug('Destroyed VAD instance');
    }
    if (recognition.current) {
      recognition.current.abort();
      recognition.current = null;
      console.debug('Closed speech recognition');
    }
  };

  const handleDeviceChange = () => {
    if (isRecognizing.current) {
      isDeviceSwitching.current = true;
      stopListening();
      console.info('Device change detected, stopping listening');
    }
  };

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      console.debug('Removed device change listener');
    };
  }, []);

  const initializeVAD = useCallback(async () => {
    const vadConfig = {
      onVADMisfire: () => {
        startSilenceTimer();
      },
      onSpeechStart: () => {
        clearSilenceTimer();
        console.info('Speech detected, cleared silence timer');
      },
      onSpeechEnd: (audio) => {
        startSilenceTimer();
        console.info('Silence detected, started silence timer');
      },
    };

    try {
      vadRef.current = await MicVAD.new(vadConfig);
      console.info('VAD initialized successfully');
    } catch (error) {
      console.error(`VAD initialization failed: ${error.message}. Browser: ${navigator.userAgent}`);
    }
  }, []);

  return {
    startListening,
    stopListening,
    closeRecognition,
    remainingTime,
    initializeVAD,
    initializeSpeechRecognition,
  };
};

export default useSpeechRecognition;