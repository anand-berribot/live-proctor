import { useRef } from 'react';

const useMicrophoneTest = (onTranscript, isMicrophoneTesting) => {
  const recognition_test = useRef(null);

  const initializeMicrophoneTest = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition_test.current = new SpeechRecognition();
    } else {
      console.error('Speech Recognition API is not supported in this browser');
      return;
    }

    recognition_test.current.lang = 'en-US';
    recognition_test.current.interimResults = true;
    recognition_test.current.maxAlternatives = 1;
    recognition_test.current.continuous = true;

    recognition_test.current.onend = () => {
      if (isMicrophoneTesting.current) {
        recognition_test.current.start();
      }
    };

    recognition_test.current.onerror = (event) => {
      if (isMicrophoneTesting.current) {
        recognition_test.current.stop();
        setTimeout(() => {
          recognition_test.current.start();
        }, 1000);
      }
    };

    recognition_test.current.onresult = onTranscript;
  };

  const MicroTeststartListening = () => {
    try {
      recognition_test.current.start();
      isMicrophoneTesting.current = true;
    } catch (error) {
      console.error("Recognition has already started or another error occurred:", error);
    }
  };

  const MicroteststopListening = () => {
    if (isMicrophoneTesting.current) {
      recognition_test.current.stop();
      isMicrophoneTesting.current = false;
    }
  };

  const closeMicrophoneTest = () => {
    if (recognition_test.current) {
      recognition_test.current.stop();
      recognition_test.current = null;
      isMicrophoneTesting.current = false;
    }
  };

  return {
    MicroTeststartListening,
    MicroteststopListening,
    closeMicrophoneTest,
    initializeMicrophoneTest,
  };
};

export default useMicrophoneTest;
