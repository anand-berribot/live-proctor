import { useState, useRef, useEffect } from 'react';

const useAudioRecorders = (enqueueSnackbar) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioChunks = useRef([]);
  const audioContextRef = useRef(null);
  const audioWorkletNodeRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await audioContext.audioWorklet.addModule('audio-processor.js');
      const node = new AudioWorkletNode(audioContext, 'recorder-processor');

      const input = audioContext.createMediaStreamSource(stream);
      input.connect(node);
      node.connect(audioContext.destination);

      node.port.onmessage = (event) => {
        if (event.data.recordedChunks) {
          audioChunks.current = event.data.recordedChunks;
        }
      };

      setIsRecording(true);
      audioContextRef.current = audioContext;
      audioWorkletNodeRef.current = node;
      mediaStreamRef.current = stream;

    } catch (error) {
      console.error('Error accessing microphone:', error);
      enqueueSnackbar('Error accessing microphone: ' + error, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center', } });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    processRecording();
  };

  const processRecording = () => {
    const bufferLength = audioChunks.current.reduce((sum, chunk) => sum + chunk.length, 0);
    const resultBuffer = new Float32Array(bufferLength);
    let offset = 0;
    for (const chunk of audioChunks.current) {
      resultBuffer.set(chunk, offset);
      offset += chunk.length;
    }
    const wavBlob = encodeWAV(resultBuffer);
    setAudioBlob(wavBlob);
  };

  const encodeWAV = (samples) => {
    const sampleRate = 44100;
    const numChannels = 1;
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    floatTo16BitPCM(view, 44, samples);

    return new Blob([view], { type: 'audio/wav' });
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const floatTo16BitPCM = (output, offset, input) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  };

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isRecording]);

  return { isRecording, audioBlob, startRecording, stopRecording };
};

export default useAudioRecorders;
