import { useState, useEffect, useRef } from 'react';

const useListeningCountdown = (BotState, elapsedSeconds) => {
  const [countdown, setCountdown] = useState(true);
  const [remainingTime, setRemainingTime] = useState(elapsedSeconds);
  const prevElapsedSeconds = useRef(elapsedSeconds);
  const lastUpdateTime = useRef(Date.now());

  useEffect(() => {
    if (BotState === 'listening' && elapsedSeconds !== 0 && elapsedSeconds < 8) {
      setCountdown(true);
      const now = Date.now();
      if (prevElapsedSeconds.current !== elapsedSeconds) {
        prevElapsedSeconds.current = elapsedSeconds;
        lastUpdateTime.current = now;
        setRemainingTime(elapsedSeconds);
      } else if (now - lastUpdateTime.current > 2000) { // 2000 milliseconds = 2 seconds
        setCountdown(false);
      }
    } else {
      setCountdown(false);
    }

    const intervalId = setInterval(() => {
      if (Date.now() - lastUpdateTime.current > 2000) { // 2000 milliseconds = 2 seconds
        setCountdown(false);
      }
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [BotState, elapsedSeconds]);

  return [countdown, remainingTime];
};

export default useListeningCountdown;
