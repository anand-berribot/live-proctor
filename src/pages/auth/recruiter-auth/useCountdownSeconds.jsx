// src/hooks/useCountdownSeconds.jsx
import { useState, useEffect, useRef, useCallback } from 'react';

export const useCountdownSeconds = (initialSeconds = 0) => {
  const [countdown, setCountdown] = useState(initialSeconds);
  const [counting, setCounting] = useState(false);
  const timerRef = useRef(null);

  const startCountdown = useCallback((seconds) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCountdown(seconds);
    setCounting(true);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const resetCountdown = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCountdown(initialSeconds);
    setCounting(false);
  }, [initialSeconds]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return { countdown, counting, startCountdown, resetCountdown };
};