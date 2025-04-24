import { useState, useEffect, useCallback, useRef } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';



const useRetellWebClient = (
  setPlayAiTranscript,
  botSpeakErrorIssue,
  questionCount,
  navigate,
  setIsUserSpeaking,
  setIsAgentSpeaking,
  isVoiceNotDetected
) => {
  const retellClient = useRef(new RetellWebClient());
  const conversationState = useRef({
    isReset: false,
    isConversationEnded: false,
  });

  // Timing configuration
  const COUNTDOWN_DURATION = 4000;
  const INACTIVITY_TIMEOUT = 40000;
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const countdownRef = useRef(COUNTDOWN_DURATION);

  // Timer references
  const timers = {
    inactivity: useRef(null),
    countdown: useRef(null),
    userSilence: useRef(null),
    agentSilence: useRef(null),
  };

  // Timer management utilities
  const clearAllTimers = useCallback(() => {
    Object.values(timers).forEach(timerRef => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    });
  }, []);

  const handleCountdownStart = useCallback(() => {
    clearAllTimers();
    setCountdown(COUNTDOWN_DURATION);
    countdownRef.current = COUNTDOWN_DURATION;

    timers.countdown.current = setInterval(() => {
      setCountdown(prev => {
        const newValue = prev - 1000;
        countdownRef.current = newValue;

        if (newValue <= 0) {
          console.warn('Countdown expired - muting microphone');
          retellClient.current.mute();
          sessionStorage.setItem('mas_bot_idle', 'true');
          clearAllTimers();
          setPlayAiTranscript('');
          return COUNTDOWN_DURATION;
        }
        return newValue;
      });
    }, 1000);
  }, [setPlayAiTranscript]);

  // Mic control utilities
  const safeMicUnmute = useCallback(() => {
    if (!conversationState.current.isConversationEnded) {
      console.debug('Unmuting microphone isConversationEnded');
      retellClient.current.unmute();
    }
  }, []);

  const safeMicMute = useCallback(() => {
    retellClient.current.mute();
  }, []);

  // Agent state handlers
  const handleAgentActivity = useCallback((isSpeaking) => {
    setIsAgentSpeaking(isSpeaking);

    if (isSpeaking) {
      safeMicMute();
      clearAllTimers();
      setCountdown(COUNTDOWN_DURATION);
    }
  }, [setIsAgentSpeaking]);

  // Event handlers
  const handleAgentStartSpeaking = useCallback(() => {
    handleAgentActivity(true);
  }, [handleAgentActivity]);

  const handleAgentStopSpeaking = useCallback(() => {
    sessionStorage.setItem('mas_bot_idle', 'false');
    conversationState.current.isReset = false;
    handleAgentActivity(false);

    safeMicUnmute();

    timers.inactivity.current = setTimeout(() => {
      console.warn('Inactivity timeout reached');
      navigate('bot-fail');
      isVoiceNotDetected.current = true;
      clearAllTimers();
    }, INACTIVITY_TIMEOUT);
  }, [handleAgentActivity, navigate]);

  const checkConversationEnd = (transcript) => {
    const endPhrases = [
      /thank you for your time and insightful responses/i,
      /best of luck[!.,;?]*\b/i,
      /be[\s_]*ready/i
    ];
    return endPhrases.some(pattern => pattern.test(transcript.toLowerCase()));
  };

  const processTranscriptUpdate = useCallback((update) => {

    if (!update.transcript?.length) {
      console.warn('Empty transcript update received');
      return;
    }

    const messages = update.transcript;
    const latestMessage = messages[messages.length - 1];
    const updatedTranscript = update.transcript;
    const lastIndex = updatedTranscript.length - 1;
    const secondLastIndex = updatedTranscript.length - 2;
    const thirdLastIndex = updatedTranscript.length - 3;
    const lastMessage = updatedTranscript[lastIndex];

    // Handle user speech
    if (latestMessage.role === 'user' && update.turntaking === undefined) {
      setIsUserSpeaking(true);
      setIsAgentSpeaking(false);
      clearAllTimers();
      handleCountdownStart();

      timers.userSilence.current = setTimeout(() => {
        setIsUserSpeaking(false);
      }, 1000);
    }

    // Handle agent speech
    if (latestMessage.role === 'agent' && update.turntaking === undefined) {
      questionCount.current += 1;
      setIsUserSpeaking(false);
      setIsAgentSpeaking(true);
      sessionStorage.setItem('mas_bot_idle', 'false');
      clearAllTimers();

      let newContent;
      if (
        updatedTranscript[secondLastIndex]?.role === 'agent' &&
        updatedTranscript[thirdLastIndex]?.role === 'agent'
      ) {
        newContent = `${updatedTranscript[thirdLastIndex].content}\n${updatedTranscript[secondLastIndex].content}\n${lastMessage.content}`;
      } else if (updatedTranscript[secondLastIndex]?.role === 'agent') {
        newContent = `${updatedTranscript[secondLastIndex].content}\n${lastMessage.content}`;
      } else {
        newContent = lastMessage.content;
      }

      setPlayAiTranscript(newContent);
      sessionStorage.setItem(
        'agentTranscript',
        `${newContent}\n${sessionStorage.getItem('agentTranscript') || ''}`
      );

      // Schedule agent silence detection
      timers.agentSilence.current = setTimeout(() => {
        setIsAgentSpeaking(false);
        safeMicUnmute();
      }, 1000);
    }

    // Check conversation end condition
    if (checkConversationEnd(latestMessage.content)) {
      conversationState.current.isConversationEnded = true;
      safeMicMute();
      sessionStorage.setItem('mas_bot_idle', 'false');
      clearAllTimers();

      timers.agentSilence.current = setTimeout(() => {
        setIsUserSpeaking(false);
        setIsAgentSpeaking(false);
        retellClient.current.stopCall();
      }, 2000);
    }
  }, [setIsUserSpeaking, setPlayAiTranscript, questionCount, handleCountdownStart]);

  const handleError = useCallback((error) => {
    console.error(`Conversation error: ${error}` );
    botSpeakErrorIssue.current = true;
    navigate('bot-fail');
    clearAllTimers();
  }, [navigate]);

  // Connection management
  const initializeConnection = useCallback(async (accessToken) => {
    try {
      console.info('Initializing connection');
      await retellClient.current.startCall({ accessToken });
      safeMicMute(); // Start with muted mic
    } catch (error) {
      console.error(`Connection failed: ${error}`);
      throw error;
    }
  }, []);

  // Effect for event listeners
  useEffect(() => {
    const client = retellClient.current;
    const eventHandlers = [
      ['agent_start_talking', handleAgentStartSpeaking],
      ['agent_stop_talking', handleAgentStopSpeaking],
      ['update', processTranscriptUpdate],
      ['error', handleError],
    ];

    eventHandlers.forEach(([event, handler]) => client.on(event, handler));

    return () => {
      eventHandlers.forEach(([event, handler]) => client.off(event, handler));
      clearAllTimers();
    };
  }, [handleAgentStartSpeaking, handleAgentStopSpeaking, processTranscriptUpdate, handleError]);

  return {
    connectSocket: initializeConnection,
    socketonclose: clearAllTimers,
    countdown,
    conversationState
  };
};

export default useRetellWebClient;