import { useCallback, useState, useEffect, useRef } from 'react';

const MASTERMIND_API_URL = process.env.VITE_REACT_APP_API_URL;

async function postConversationId(conversationId, interviewId) {
    try {
        console.debug(`Posting conversation ID: ${conversationId} for interview ID: ${interviewId}`);
        const response = await fetch(`${MASTERMIND_API_URL}update_conversation/?interview_id=${interviewId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playai_conversationId: conversationId }),
        });

        if (!response.ok) throw new Error('Network response was not ok');
        console.debug(`Conversation ID posted successfully for interview ID: ${interviewId}`, { conversationId });
    } catch (error) {
        console.error(`Error posting conversation ID for interview ID ${interviewId}:`, error);
    }
}

const usePlayAiWebsocket = (
    setPlayAiTranscript,
    playAiTranscript,
    candidate,
    botSpeakErrorIssue,
    questionCount,
    setPath,
    setIsUserSpeaking,
    setIsAgentSpeaking,
    isUserSpeaking,
    isAgentSpeaking,
    handleAudioStartRecording,
    handleAudioStopRecording,
) => {
    const defaultThreshold = 4000; 
    const [countdown, setCountdown] = useState(defaultThreshold);
    const countdownInterval = useRef(null);
    const conversationRef = useRef(null);
    const isResetTriggered = useRef(false); // Renamed for clarity

    const clearCountdownInterval = () => {
        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
            countdownInterval.current = null;
        }
    };

    const startCountdown = () => {
        clearCountdownInterval(); 
        
        countdownInterval.current = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1000) {
                    clearCountdownInterval();
                    return 0;
                }
                return prevCountdown - 1000;
            });
        }, 1000);
    };

    const socketonclose = useCallback(() => {
        console.warn(`Socket connection closed for interview ID: ${sessionStorage.getItem('interview_id')}...`);
        if (conversationRef.current) {
            conversationRef.current.hangup();
            console.debug(`Conversation ended for interview ID: ${sessionStorage.getItem('interview_id')}.`);
        }
        clearCountdownInterval();
    }, []);
 const connectSocket = useCallback(async (interviewData) => {
        const interviewId = sessionStorage.getItem('interview_id');
        console.debug(`Opening WebSocket connection to PLAY AI for interview ID: ${interviewId}`);
 
        const agentId = "test-KMTNNY0qZPuH0uwHMYjoY";
        const apiKey = "ak-7a431501fd4c4ea5861449354861ae62";

        try {
            const conversationId = interviewData?.playai_conversationId;
           
            const prompt = conversationId
                ? `This conversation is being resumed. The conversationId is ${conversationId}. \nCall the function select-question whenever you select a new interview question to the user.\nBerriMastermindId=${candidate.Interviews[0].id}`
                : `\nCall the function select-question whenever you select a new interview question to the user.\nBerriMastermindId=${candidate.Interviews[0].id}`;
            console.debug(`Prompt message for interview ID ${interviewId}:`, prompt, `Conversation ID:`, conversationId);

            conversationRef.current = await window.PlayAI.startConversationWithAgent({
                apiKey,
                agentId,
                prompt: prompt,
                ...(conversationId && { continueConversation: conversationId }),
                outputFormat: 'mp3',
                utteranceEndThreshold: 5000,
              
                listeners: {
                    onUserTranscript: (transcript) => {
                        console.warn(`USER said for interview ID ${interviewId}: "${transcript}".`);
                    },

                    onAgentTranscript: async (transcript) => {
                        const transcriptMessage = transcript.trim();
                        console.warn(`Transcript message received for interview ID ${interviewId}:`, transcriptMessage);

                        await new Promise(resolve => setTimeout(resolve, 300));

                        const cleanedMessage = transcriptMessage.replace("*", "").replace(/[;:]/g, "");
                        setPlayAiTranscript(prevTranscript => `${prevTranscript}\n ${cleanedMessage}`);

                        const currentTranscript = sessionStorage.getItem('agentTranscript') || '';
                        sessionStorage.setItem('agentTranscript', `${currentTranscript}\n${cleanedMessage}`);

                    },
                    
                    onUserStartedSpeaking: () => {
                        console.warn(`USER started speaking for interview ID: ${interviewId}...`, playAiTranscript);
                        handleAudioStartRecording(sessionStorage.getItem('agentTranscript'));
                        clearCountdownInterval();
                        setCountdown(4000);
                        setIsUserSpeaking(true);
                    },
                    onUserStoppedSpeaking: () => {
                        // Capture the current time in IST (Indian Standard Time)
                        const stopTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                        console.warn(`USER stopped speaking at ${stopTime} for interview ID: ${interviewId}.`);
                        setIsUserSpeaking(false);
                        startCountdown();
                    },
                                        
                    onAgentStartedSpeaking: () => {
                        questionCount.current += 1;
                        setCountdown(4000);
                        sessionStorage.setItem('mas_bot_idle', 'false');
                        console.warn(`AGENT started speaking for interview ID: ${interviewId}...`);
                        setIsAgentSpeaking(true);
                        conversationRef.current.mute();
                        clearCountdownInterval();
                    },
                    onAgentStoppedSpeaking: () => {
                        console.warn(`AGENT stopped speaking for interview ID: ${interviewId}.`);
                        isResetTriggered.current = false; // Reset triggered status
                        setIsAgentSpeaking(false);
                        conversationRef.current.unmute();
                    },
                    onHangup: (endedBy) => {
                        console.warn(`Conversation has ended by ${endedBy.toUpperCase()} for interview ID: ${interviewId}`);
                        socketonclose();
                    },
                    onAgentDecidedToSpeak: () => {
                        conversationRef.current.mute();
                        setCountdown(4000);
                        clearCountdownInterval();
                        console.warn('Agent decided to speak...', questionCount.current);
                        if (questionCount.current !== 0) {
                            handleAudioStopRecording();
                            sessionStorage.setItem('agentTranscript', '');
                        }
                        setPlayAiTranscript(''); 
                        sessionStorage.setItem('mas_bot_idle', 'true');
                        console.debug(`Agent decided to speak for interview ID: ${interviewId}...`);
                    },
                    onError: (err) => {
                        botSpeakErrorIssue.current = true;
                        setPath('bot-fail');
                        console.error(`ERROR during conversation for interview ID ${interviewId}:`, err);
                    }                    
                },
            });

            const newConversationId = conversationRef.current.conversationId;
            conversationRef.current.mute();
            clearCountdownInterval();
            console.debug(`Conversation started with ID: ${newConversationId} for interview ID: ${interviewId}.`);
            postConversationId(newConversationId, candidate.Interviews[0].id);

        } catch (error) {
            botSpeakErrorIssue.current = true;
            setPath('bot-fail');
            console.error(`Failed to start conversation for interview ID ${candidate.Interviews[0].id}:`, error);
        }
    }, [candidate]);
   

    useEffect(() => {
        return () => {
            if (conversationRef.current) {
                conversationRef.current.hangup();
                console.debug(`Cleanup: Conversation hung up for interview ID: ${sessionStorage.getItem('interview_id')}.`);
            }
            clearCountdownInterval();
        };
    }, []);

    return { connectSocket, socketonclose, isUserSpeaking, isAgentSpeaking, countdown, isResetTriggered };
};

export default usePlayAiWebsocket;
