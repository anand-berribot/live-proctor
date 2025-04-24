import { useRef, useCallback, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

/**
 * Unlocks the AudioContext on iOS or other devices that suspend it by default
 */
const unlockAudioContext = (audioCtx) => {
  if (audioCtx.state === 'suspended') {
    const unlock = () => {
      audioCtx.resume().then(() => {
        document.body.removeEventListener('touchstart', unlock);
        document.body.removeEventListener('touchend', unlock);
        console.log('[Audio] AudioContext resumed on user interaction');
      });
    };

    document.body.addEventListener('touchstart', unlock, false);
    document.body.addEventListener('touchend', unlock, false);
    console.log('[Audio] Added touch event listeners to unlock AudioContext');
  }
};

const useAudioPlayback = (setBotVisualState, setShowErrorPopup, startListening) => {
  const audioCtxRef = useRef(null);
  const audioPlayerRef = useRef(new Audio());
  const queueRef = useRef([]);

  // Resume AudioContext if tab becomes visible again
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        audioCtxRef.current?.resume();
        console.log('[Audio] Resumed AudioContext on tab visibility');
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  /**
   * Stops current audio playback and clears the queue
   */
  const stopPlayback = useCallback(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = ''; // Clear the source to release the resource
      console.log('[Audio] Stopped current audio playback');
    }

    // Clear the queue
    queueRef.current = [];
    console.log('[Audio] Cleared audio queue');

    // Close AudioContext if it exists
    if (audioCtxRef.current) {
      audioCtxRef.current.close().then(() => {
        console.log('[Audio] Closed AudioContext');
      });
      audioCtxRef.current = null;
    }

    // Reset bot visual state
    setBotVisualState('idle');
  }, [setBotVisualState]);

  /**
   * Decodes and plays a single base64 audio chunk
   */
  const playSingleAudio = useCallback((base64Audio) => {
    return new Promise((resolve, reject) => {
      if (!base64Audio) {
        console.error('[Audio] No audio data provided');
        return reject(new Error('No audio data'));
      }

      console.log('[Audio] Preparing to play single audio chunk');

      // Initialize AudioContext if needed
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        unlockAudioContext(audioCtxRef.current);
        console.log('[Audio] Initialized new AudioContext');
      }

      try {
        const byteArray = new Uint8Array(atob(base64Audio).split('').map(c => c.charCodeAt(0)));
        const blob = new Blob([byteArray], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);

        audioPlayerRef.current.src = url;

        audioPlayerRef.current.play()
          .then(() => {
            console.log('[Audio] Audio started playing');
            audioPlayerRef.current.onended = () => {
              URL.revokeObjectURL(url);
              console.log('[Audio] Audio playback completed');
              resolve();
            };
          })
          .catch((error) => {
            URL.revokeObjectURL(url);
            console.error('[Audio] Error during playback:', error);
            reject(error);
          });
      } catch (e) {
        console.error('[Audio] Failed to decode and play audio:', e);
        reject(e);
      }
    });
  }, []);

  /**
   * Plays all queued audios in sequence
   */
  const playQueue = useCallback(async (NonCoding, isInterviewEnd, setCurrentPage) => {
    if (queueRef.current.length === 0) return;

    console.log(`[AudioQueue] Starting queue playback (${queueRef.current.length} items)`);

    while (queueRef.current.length > 0) {
      const currentAudio = queueRef.current[0];
      setBotVisualState('speaking');

      try {
        await playSingleAudio(currentAudio);
        console.log('[AudioQueue] Audio playback succeeded');
      } catch (error) {
        setShowErrorPopup(true);
        enqueueSnackbar(`Audio playback failed: ${error.message}`, { variant: 'error' });
        console.warn('[AudioQueue] Audio playback failed, continuing with next item');
      }

      queueRef.current.shift();

      if (isInterviewEnd && queueRef.current.length === 0) {
        setCurrentPage('BOT_SUCCESS');
        console.log('[AudioQueue] Interview ended, switching to end page');
      }

      // Update bot state after each audio
      if (NonCoding) {
        setBotVisualState('listening');
        console.log('[Bot] Switched to listening state (NonCoding)');
        startListening();
      } else {
        setBotVisualState('idle');
        console.log('[Bot] Switched to idle state (Coding)');
      }
    }

    console.log('[AudioQueue] Finished processing audio queue');
  }, [playSingleAudio, setBotVisualState, setShowErrorPopup, startListening]);

  /**
   * Adds audio to the playback queue
   */
  const addToQueue = useCallback((audio, NonCoding, isInterviewEnd, setCurrentPage) => {
    if (!audio) {
      console.warn('[AudioQueue] Tried to add empty audio to queue');
      return;
    }

    queueRef.current.push(audio);
    console.log(`[AudioQueue] Added new audio to queue. Queue length: ${queueRef.current.length}`);

    if (queueRef.current.length === 1) {
      // Start playing if not already in process
      playQueue(NonCoding, isInterviewEnd, setCurrentPage);
    }
  }, [playQueue]);

  return { addToQueue, stopPlayback };
};

export default useAudioPlayback;