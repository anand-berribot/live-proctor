import { useRef, useState, useCallback } from 'react';
import { MicVAD } from '@ricky0123/vad-web';

const DEFAULT_LANGUAGE = 'en-US';
const MAX_NETWORK_RETRIES = 3;

const useSpeechRecognition = ({
  utteranceThreshold = 7,
  userSilenceThreshold = 60,
  onUpdateUserTranscription,
  onProcessAgentResponse,
  setCurrentPage,
  onError,
  isDeepgram,
}) => {
  const recognitionRef = useRef(null);
  const vadRef = useRef(null);
  const isRecognizing = useRef(false);
  const timers = useRef({});
  const networkRetries = useRef(0);
  const [remainingTime, setRemainingTime] = useState(utteranceThreshold);
  const hasTranscriptReceived = useRef(false);

  const handleError = useCallback(
    (message, error) => {
      console.error(`[useSpeechRecognition] Critical error: ${message}`, error);
      onError?.(message);
      closeAll();
      setCurrentPage?.('bot-fail');
    },
    [onError, setCurrentPage]
  );

  const closeAll = useCallback(() => {
    console.log('[useSpeechRecognition] Closing all resources');
    Object.values(timers.current).forEach(clearTimeout);
    if (timers.current.countdown) clearInterval(timers.current.countdown);
    timers.current = {};
    if (vadRef.current) {
      vadRef.current.destroy();
      vadRef.current = null;
      console.log('[useSpeechRecognition] VAD destroyed');
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
      console.log('[useSpeechRecognition] Speech recognition closed');
    }
    isRecognizing.current = false;
    networkRetries.current = 0;
  }, []);

  const initializeSpeech = useCallback(() => {
    if (isDeepgram) {
      console.log('[useSpeechRecognition] Deepgram initialization placeholder');
      return;
    }

    console.log('[useSpeechRecognition] Initializing Web Speech API');
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      handleError('Speech Recognition not supported');
      return;
    }

    recognitionRef.current = new SpeechRecognitionAPI();
    recognitionRef.current.lang = DEFAULT_LANGUAGE;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = true;

    recognitionRef.current.onresult = (event) => {
      console.log('[useSpeechRecognition] Received speech result');
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();
        if (event.results[i].isFinal) {
          finalTranscript = transcript;
        } else {
          interimTranscript = transcript;
        }
      }

      console.log('[useSpeechRecognition] Processed transcripts:', { finalTranscript, interimTranscript });
      onUpdateUserTranscription?.({ finalTranscript, interimTranscript });

      if (!hasTranscriptReceived.current && !vadRef.current?.isRunning) {
        vadRef.current?.start();
        hasTranscriptReceived.current = true;
        console.info('[useSpeechRecognition] First transcript received, starting VAD');
        clearTimeout(timers.current.longSilence);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error(`[useSpeechRecognition] Speech recognition error: ${event.error}`);
      if (event.error === 'network' && networkRetries.current < MAX_NETWORK_RETRIES) {
        networkRetries.current++;
        console.log(`[useSpeechRecognition] Network error, retrying (${networkRetries.current}/${MAX_NETWORK_RETRIES})`);
        setTimeout(() => recognitionRef.current?.start(), 1000 * Math.pow(2, networkRetries.current));
      } else if (event.error === 'no-speech') {
        console.error('[useSpeechRecognition] No speech detected, stopping listening');
        startListening();
      } else {
        console.error(`[useSpeechRecognition] Non-critical error, stopping listening: ${event.error}`);
      }
    };

    recognitionRef.current.onend = () => {
      if (isRecognizing.current) {
        console.log('[useSpeechRecognition] Speech recognition ended, restarting');
        recognitionRef.current?.start();
      }
    };
  }, [onUpdateUserTranscription, handleError, isDeepgram]);

  const initializeVAD = useCallback(async () => {
    if (isDeepgram) return;
    console.log('[useSpeechRecognition] Initializing VAD');
    try {
      vadRef.current = await MicVAD.new({
        onSpeechStart: () => {
          console.log('[useSpeechRecognition] Speech started, clearing timers');
          clearTimeout(timers.current.silence);
          clearInterval(timers.current.countdown);
          timers.current = { ...timers.current, silence: null, countdown: null };
        },
        onSpeechEnd: () => {
          console.log('[useSpeechRecognition] Speech ended, starting silence timer');
          startSilenceTimer();
        },
        onVADMisfire: () => {
          console.log('[useSpeechRecognition] VAD misfire, no action');
        },
      });
      vadRef.current.pause();
      console.log('[useSpeechRecognition] VAD initialized successfully');
    } catch (error) {
      handleError('VAD initialization failed', error);
    }
  }, [handleError, isDeepgram]);

  const startSilenceTimer = () => {
    if (timers.current.silence) return;
    console.log(`[useSpeechRecognition] Starting silence timer for ${utteranceThreshold}s`);
    setRemainingTime(utteranceThreshold);
    timers.current.countdown = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev > 0 ? prev - 1 : 0;
        console.log(`[useSpeechRecognition] Silence countdown: ${newTime}s`);
        return newTime;
      });
    }, 1000);
    timers.current.silence = setTimeout(() => {
      console.log('[useSpeechRecognition] Silence threshold reached, stopping listening');
      stopListening();
      onProcessAgentResponse?.();
    }, utteranceThreshold * 1000);
  };

  const resetRemainingTime = useCallback(() => {
    console.log(`[useSpeechRecognition] Resetting remainingTime to ${utteranceThreshold}`);
    setRemainingTime(utteranceThreshold);
  }, [utteranceThreshold]);

  const startListening = useCallback(() => {
    if (isRecognizing.current || !recognitionRef.current) {
      console.log('[useSpeechRecognition] Cannot start listening: already recognizing or recognition not initialized');
      return;
    }
    try {
      recognitionRef.current.start();
      isRecognizing.current = true;
      timers.current.longSilence = setTimeout(() => {
        console.log('[useSpeechRecognition] Long silence threshold reached (60s)');
        handleError('Long silence detected');
      }, userSilenceThreshold * 1000);
      console.log('[useSpeechRecognition] Started listening');
    } catch (error) {
      console.error('[useSpeechRecognition] Failed to start listening:', error);
      stopListening();
    }
  }, [userSilenceThreshold, handleError]);

  const stopListening = useCallback(() => {
    if (!isRecognizing.current) {
      console.log('[useSpeechRecognition] Not recognizing, no need to stop');
      return;
    }
    vadRef.current?.pause();
    recognitionRef.current?.abort();
    isRecognizing.current = false;
    hasTranscriptReceived.current = false;
    Object.values(timers.current).forEach(clearTimeout);
    if (timers.current.countdown) clearInterval(timers.current.countdown);
    timers.current = {};
    console.log('[useSpeechRecognition] Stopped listening');
  }, []);

  return {
    startListening,
    stopListening,
    closeAll,
    remainingTime,
    initializeVAD,
    initializeSpeech,
    resetRemainingTime,
  };
};

export default useSpeechRecognition;