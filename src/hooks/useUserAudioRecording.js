import { useState, useRef } from 'react';

const useUserAudioRecording = () => {
  const [isUserAudioRecording, setIsUserAudioRecording] = useState(false);
  const userAudioRecorderRef = useRef(null);
  const userAudioChunksRef = useRef([]);

  const handleUserAudioRecordingStop = async () => {
    const userAudioChunks = userAudioChunksRef.current;
    const userAudioBlob = new Blob(userAudioChunks, { type: 'audio/wav' });
  
    try {
      const formDataAudio = new FormData();
      formDataAudio.append('user_audio', userAudioBlob, 'recorded-user-audio.wav');
      const interviewId = sessionStorage.getItem("proctorinterviewId");
      const candidateId = sessionStorage.getItem("proctorCandidateId");
  
      const responseAudio = await fetch(
        `https://demo-impersonation-server.berribot.com/api/v1/proctor/humanless/verification_live_audio/candidate/${candidateId}/session/${interviewId}`,
        {
          method: 'POST',
          body: formDataAudio,
        }
      );
      const dataAudio = await responseAudio.json();
      sessionStorage.setItem('audio-record-send', true);
      console.log('Audio API Response:', dataAudio);

      setIsUserAudioRecording(false);
      userAudioChunksRef.current = [];
    } catch (error) {
        sessionStorage.setItem('audio-record-send', true);
        console.error('Error sending recorded audio to API:', error);
  
    }
  };


  const startUserAudioRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioRecorder = new MediaRecorder(audioStream);

      audioRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          userAudioChunksRef.current.push(event.data);
        }
      };

      audioRecorder.onstop = () => {
        handleUserAudioRecordingStop();
      };

      userAudioRecorderRef.current = audioRecorder;

      userAudioRecorderRef.current.start();
      setIsUserAudioRecording(true);
    } catch (error) {
      console.error('Error starting user audio recording:', error);
      setIsUserAudioRecording(false);
    }
  };

  const stopUserAudioRecording = async () => {
    if (userAudioRecorderRef.current) {
      userAudioRecorderRef.current.stop();
    //   await handleUserAudioRecordingStop();
    } else {
      console.log('userAudioRecorderRef.current is not defined');
    }
  };

  return { isUserAudioRecording, startUserAudioRecording, stopUserAudioRecording };
};

export default useUserAudioRecording;
