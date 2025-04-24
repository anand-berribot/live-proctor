import React, { useEffect, useRef, useState } from 'react';
import botIdle from 'src/assets/mastermind_animation/Idle_Transparent.webm';
import botSpeaking from 'src/assets/mastermind_animation/Speaking_Transparent.webm';
import botThinking from 'src/assets/mastermind_animation/Thinking_Transparent.webm';
import botListening from 'src/assets/mastermind_animation/Listening_Transparent.webm';
import botAnalyzing from 'src/assets/mastermind_animation/Thinking_Transparent.webm';
import botBerry from 'src/assets/mastermind_animation/Berry_Transparent.webm';

function BotAnimation({ botState, isCodingMode }) {
  const [currentAnimation, setCurrentAnimation] = useState(botIdle);
  const videoRef = useRef(null);
  const backgroundVideoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const animationMap = {
    idle: botIdle,
    speaking: botSpeaking,
    thinking: botThinking,
    listening: botListening,
    analyzing: botAnalyzing,
  };

  useEffect(() => {
    setCurrentAnimation(animationMap[botState] || botIdle);
  }, [botState]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && backgroundVideoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch((err) => console.error('Foreground video play failed:', err));
        backgroundVideoRef.current.play().catch((err) => console.error('Background video play failed:', err));
      } else {
        videoRef.current.pause();
        backgroundVideoRef.current.pause();
      }
    }
  }, [isVisible, currentAnimation]);

  const containerStyle = {
    position: 'relative',
    width: isCodingMode ? '20vw' : '25vw', // Reduced from 30vw
    height: isCodingMode ? '40vh' : '35vh', // Reduced from 40vh
    overflow: 'hidden',
    borderRadius: '12px',
    visibility: isVisible ? 'visible' : 'hidden',
  };

  const videoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {isVisible && (
        <video
          ref={backgroundVideoRef}
          src={botBerry}
          muted
          loop
          autoPlay={isVisible}
          style={{ ...videoStyle, zIndex: 1 }}
          aria-hidden="true"
        />
      )}
      {isVisible && (
        <video
          ref={videoRef}
          src={currentAnimation}
          muted
          loop
          autoPlay={isVisible}
          style={{ ...videoStyle, zIndex: 2 }}
          aria-label={`Bot animation: ${botState}`}
        />
      )}
    </div>
  );
}

export default BotAnimation;