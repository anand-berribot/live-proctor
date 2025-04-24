import React, { useRef } from "react";

const API_URL = process.env.VITE_REACT_APP_API_URL;

const useAudioRecorder = (candidate) => {
  const audioRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleAudioStartRecording = async (botQuestion) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      const mediaRecorder = new MediaRecorder(stream);
      audioRecorderRef.current = mediaRecorder;

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const question = botQuestion || sessionStorage.getItem("agentTranscript");
        await handleAudioSend(chunksRef.current, question);
        chunksRef.current = []; // Clear chunks after sending
      };

      mediaRecorder.start(); // Start recording
    } catch (error) {
      console.error("Error recording audio:", error);
    }
  };

  const handleAudioStopRecording = () => {
    if (audioRecorderRef.current) {
      console.debug("Stopping MediaRecorder.");
      audioRecorderRef.current.stop();
    }
  };

  const handleAudioSend = async (audioChunks, botQuestion) => {
    if (botQuestion.includes('[CODE]')) {
      console.debug("Code detected, not sending audio.");
      return;
    }

    try {
      const { candidate_id, id: proctorInterviewId } = candidate.Interviews[0];
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const currentDate = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "").replace(" ", "-");
      const audioFile = new File([audioBlob], `${currentDate}-candidate-audio-${candidate_id}-${proctorInterviewId}.webm`, { type: 'audio/webm' });

      // Create FormData to send the audio file
      const formData = new FormData();
      formData.append("candidate_id", candidate_id);
      formData.append("interview_id", proctorInterviewId);
      formData.append("bot_question", botQuestion);
      formData.append("audio_file", audioFile);

      // Send POST request to upload the audio file
      const response = await fetch(`${API_URL}upload-candidate-audio-to-bucket`, {
        method: "POST",
        body: formData,
      });

      console.debug("Upload response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.debug("Upload successful:", await response.json());
    } catch (error) {
      console.error("Error sending audio:", error);
    }
  };

  return { handleAudioStartRecording, handleAudioStopRecording, handleAudioSend };
};

export default useAudioRecorder;
