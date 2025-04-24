import { useRef } from 'react';

const useMicrophoneTest = (onTranscript, isMicrophoneTesting) => {
  const recognitionTest = useRef(null);

  // Initialize speech recognition
  const initializeMicrophoneTest = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionTest.current = new SpeechRecognition();
    } else {
      console.error('Speech Recognition API is not supported in this browser');
      return;
    }

    recognitionTest.current.lang = 'en-US';
    recognitionTest.current.interimResults = true;
    recognitionTest.current.maxAlternatives = 1;

    recognitionTest.current.onend = () => {
      console.info('Speech recognition service disconnected');
      if (isMicrophoneTesting.current) {
        recognitionTest.current.start();
      }
    };

    recognitionTest.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (isMicrophoneTesting.current) {
        recognitionTest.current.stop();
        setTimeout(() => {
          console.info('Restarting recognition due to error...');
          recognitionTest.current.start();
        }, 1000);
      }
    };

    recognitionTest.current.onresult = onTranscript;
  };

  const startListening = () => {
    try {
      recognitionTest.current.start();
      isMicrophoneTesting.current = true;
      console.info("Started listening...");
    } catch (error) {
      console.warn("Unable to start recognition:", error);
    }
  };

  const stopListening = () => {
    if (isMicrophoneTesting.current) {
      recognitionTest.current.stop();
      console.info("Stopped listening.");
      isMicrophoneTesting.current = false;
    }
  };

  const closeMicrophoneTest = () => {
    if (recognitionTest.current) {
      recognitionTest.current.stop();
      recognitionTest.current = null;
      isMicrophoneTesting.current = false;
      console.info("Microphone test closed.");
    }
  };

  return {
    startListening,
    stopListening,
    closeMicrophoneTest,
    initializeMicrophoneTest,
  };
};

export default useMicrophoneTest;
