import { LoadingButton } from '@mui/lab';
import { Box, Card, IconButton, LinearProgress, ListItemText, Stack, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { MotionContainer, varBounce } from 'src/components/animate';
import getVariant from 'src/sections/_examples/extra/animate-view/get-variant';
import SoundWave from '../soundWave/soundWave';
import useMicrophoneTest from 'src/hooks/use-microphone-test';
import axios from 'axios';
import { WarningDialog } from 'src/new-component/dialog';
import usePermissions from 'src/new_hooks/usePermissions';
import { useMastermind } from 'src/context/mastermind-context';

export default function AudioVideo({ }) {
  const {setCurrentPage,candidateData}=useMastermind();
  const candidateId = candidateData?.Interviews?.[0]?.candidate_id;
  const PROCTOR_API_URL = process.env.VITE_REACT_APP_PROCTOR_API_URL;
  const {
    permissions,
    isCameraEnabled,
    isMicrophoneEnabled,
    videoStream,
    enableCamera,
    disableCamera,
    enableMicrophone,
    disableMicrophone,
  } = usePermissions();

  const transcript = useRef([]);
  const isInterimTranscript = useRef([]);
  const isMicrophoneTestDone = useRef(false);
  const { enqueueSnackbar } = useSnackbar();

  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadFailed, setUploadFailed] = useState(false); // Track upload failure

  // Media data now uses imageUri instead of imageBlob
  const [mediaData, setMediaData] = useState({ videoBlob: null, audioBlob: null, imageUri: '' });

  const videoElement = useRef(null);
  const audioChunks = useRef([]);

  const isMicrophoneTesting = useRef(false);

  const handleMicroTranscript = (event) => {
    const result = event.results[event.results.length - 1];
    const transcriptObj = result[0];
    const finaltranscript = transcriptObj.transcript;
    const isFinal = result.isFinal;
    if (isFinal) {
      transcript.current.push(finaltranscript);
    } else {
      isInterimTranscript.current.push(finaltranscript);
    }
  };

  // Reset all states for a fresh start
  const resetRecording = () => {
    setIsRecording(false);
    setLoading(false);
    setProgress(0);
    setUploadFailed(false);
    setMediaData({ videoBlob: null, audioBlob: null, imageUri: '' });
    audioChunks.current = [];
    transcript.current = [];
    isMicrophoneTestDone.current = false;
    if (videoElement.current && videoElement.current.srcObject) {
      videoElement.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    console.debug(`Recording reset for fresh start`);
  };

  const handleStartRecording = async () => {
    console.debug(`audioVideo: Recording started`);
    setIsRecording(true);
    setUploadFailed(false); // Clear previous failure state
    let mediaRecorder;
    let recordedChunks = [];

    // Clear previous data
    resetRecording(); // Reset everything before starting
    setIsRecording(true); // Set recording state again after reset

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoElement.current.srcObject = stream;
      videoElement.current.play();

      // Start video recording
      mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
      mediaRecorder.start();

      // Start audio recording
      let audioContext;
      if ('AudioContext' in window) {
        audioContext = new window.AudioContext();
      } else if ('webkitAudioContext' in window) {
        audioContext = new window.webkitAudioContext();
      } else {
        console.error(`Web Audio API is not supported in this browser`);
        enqueueSnackbar(`Web Audio API is not supported in this browser`, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        setIsRecording(false);
        return;
      }

      const input = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      input.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        const data = e.inputBuffer.getChannelData(0);
        audioChunks.current.push(new Float32Array(data));
      };

      // Start progress bar
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 5;
          return newProgress > 100 ? 100 : newProgress; // Cap at 100%
        });
      }, 1000);

      // Capture image as URI after 10 seconds
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.current.videoWidth;
        canvas.height = videoElement.current.videoHeight;
        canvas.getContext('2d').drawImage(videoElement.current, 0, 0, canvas.width, canvas.height);
        const imageUri = canvas.toDataURL('image/jpeg');
        console.debug(`Image URI created, length: ${imageUri.length}`);
        setMediaData((prev) => ({ ...prev, imageUri }));
      }, 10000);

      // Stop microphone test after 10 seconds
      setTimeout(async () => {
        await onStopMicrophoneTest();
      }, 10000);

      // Stop recording after 20 seconds
      setTimeout(() => {
        clearInterval(progressInterval);

        // Stop audio recording
        processor.disconnect();
        input.disconnect();
        audioContext.close();

        // Stop video recording
        mediaRecorder.stop();
        videoElement.current.srcObject.getTracks().forEach((track) => track.stop());

        mediaRecorder.onstop = async () => {
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          console.debug(`Video blob created, size: ${blob.size}`);
          setMediaData((prev) => ({ ...prev, videoBlob: blob }));
        };

        // Process audio recording
        processRecording();

        setIsRecording(false);
        console.debug(`audioVideo: Recording stopped`);
      }, 20000);
    } catch (error) {
      console.error(`audioVideo: Error during recording: ${error.message}`, error);
      enqueueSnackbar(`Recording error: ${error.message}`, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      resetRecording();
    }
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
    console.debug(`Audio blob created, size: ${wavBlob.size}`);
    setMediaData((prev) => ({ ...prev, audioBlob: wavBlob }));
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
      let s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  };

  const onStartMicrophoneTest = async () => {
    isMicrophoneTesting.current = true;
    startListening();
    transcript.current = [];
  };

  const onStopMicrophoneTest = async () => {
    stopListening();
    console.debug(`proctor captured STT -> ${transcript.current}`);
    isMicrophoneTesting.current = false;
    closeMicrophoneTest();
    isMicrophoneTestDone.current = transcript.current.length > 0 || isInterimTranscript.current.length > 0;
  };

  useEffect(() => {
    if (mediaData.videoBlob && mediaData.audioBlob && mediaData.imageUri) {
      postVideo();
    }
  }, [mediaData.videoBlob, mediaData.audioBlob, mediaData.imageUri]);

  const postVideo = async () => {
    const { videoBlob, audioBlob, imageUri } = mediaData;

    if (!videoBlob || !audioBlob || !imageUri) {
      console.error(`Media data is incomplete`, { videoBlob, audioBlob, imageUri });
      setUploadFailed(true);
      return;
    }

    const base64Image = imageUri.split(',')[1];
    if (videoBlob.size === 0 || audioBlob.size === 0 || !base64Image || base64Image.length === 0) {
      console.error(`One or more media files are empty`, {
        videoSize: videoBlob.size,
        audioSize: audioBlob.size,
        imageBase64Length: base64Image?.length || 0,
      });
      enqueueSnackbar('Media capture failed. Please retake.', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      setUploadFailed(true);
      setLoading(false);
      return;
    }

    if (!isMicrophoneTestDone.current) {
      console.warn(`No audio detected in microphone test`);
      setIsRecording(false);
      setLoading(false);
      enqueueSnackbar('No audio detected, please try again.', { variant: 'error' });
      setUploadFailed(true);
      return;
    }

    const fileName = `${candidateId}-biometric.webm`;
    const file = new File([videoBlob], fileName, { type: 'video/webm' });
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('candidate_id', candidateId);
      formData.append('video_file', file);
      formData.append('audio_file', audioBlob, 'recording.wav');
      formData.append('image_file', base64Image); // Send base64 string

      console.debug(`Uploading video size: ${videoBlob.size}`);
      console.debug(`Uploading audio size: ${audioBlob.size}`);
      console.debug(`Uploading image base64 length: ${base64Image.length}`);

      const response = await axios.post(`${PROCTOR_API_URL}candidate/candidate_save_video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data;
      if (data.status === 'success') {
        console.info(`Video uploaded successfully`, data);
        setPath('uploadFile');
        enqueueSnackbar(data.message, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      } else {
        console.error(`Video upload failed with status: ${data.status}`, data);
        enqueueSnackbar(data.message, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        setUploadFailed(true);
      }
    } catch (error) {
      console.error(`Error during video uploading: ${error.message}`, error);
      if (error.response) {
        console.error(`Response data: ${JSON.stringify(error.response.data)}`);
        console.error(`Response status: ${error.response.status}`);
        console.error(`Response headers: ${JSON.stringify(error.response.headers)}`);
      } else if (error.request) {
        console.error(`No response received: ${error.request}`);
      } else {
        console.error(`Error details: ${error.message}`);
      }
      enqueueSnackbar('Video upload failed. Click to retake.', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        action: (key) => (
          <IconButton
            onClick={() => {
              enqueueSnackbar.dismiss(key);
              resetRecording();
              handleStartRecording(); // Start fresh recording
            }}
          >
            <Typography color="inherit">Retake</Typography>
          </IconButton>
        ),
      });
      setUploadFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      resetRecording(); // Cleanup on unmount
    };
  }, []);

  const { startListening, stopListening, closeMicrophoneTest, initializeMicrophoneTest } = useMicrophoneTest(
    handleMicroTranscript,
    isMicrophoneTesting
  );

  return (
    <>
      <WarningDialog
        open={!isMicrophoneEnabled}
        onclosebutton='true'
        title={'Microphone Access Required'}
        content={"Please enable your Microphone in your browser. If problems persist, close all the tabs and restart the assessment using incognito mode for optimal performance."}
      />
      <WarningDialog
        open={!isCameraEnabled}
        title={"WebCam Access Required To Continue"}
        onclosebutton='true'
        content={"To continue, please enable your WebCam in your browser. If problems persist, close all the tabs and restart the assessment using incognito mode for optimal performance."}
      />
      {loading && (
        <LinearProgress
          variant="indeterminate"
          sx={{
            width: '100%',
            position: 'fixed',
            top: { xs: 50, sm: 63, md: 66 },
            left: 0,
            zIndex: 2,
          }}
        />
      )}
      <Box
        component={m.div}
        {...getVariant('fadeInRight')}
        spacing={2}
        sx={{
          pt: '3vh',
          pb: '3vh',
          pl: '3vw',
          pr: '3vw',
          m: 2,
          ml: 4,
          mr: 4,
          bgcolor: 'background.bg',
          borderRadius: 2,
          minHeight: '77vh',
        }}
      >
        <ListItemText
          aria-label="2"
          primary={'We need your sample video & audio for additional verification'}
          primaryTypographyProps={{ typography: 'h6' }}
          sx={{ mb: 2 }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <m.div
              initial={{ scale: 1 }}
              animate={{ scale: isRecording || loading ? 1 : [1, 1.1, 1] }}
              transition={{ repeat: isRecording || loading ? 0 : Infinity, repeatType: 'loop', duration: 1 }}
            >
              <Typography variant="body2" color={'text.secondary'}>
                Click on Start Recording and read the following text
              </Typography>
            </m.div>
            <Typography variant="body1" color={'info'} sx={{ mt: '1%' }}>
              “On a bright and sunny day, the children happily played in the park, while their parents enjoyed a relaxing afternoon picnic under the shade of a large tree.”
            </Typography>
          </Card>
          {isRecording ? (
            <>
              <MotionContainer>
                <Stack
                  flexDirection={'column'}
                  sx={{ alignItems: 'center', justifyContent: 'center', mt: 2 }}
                  component={m.div}
                  {...getVariant('zoomInUp')}
                >
                  <video
                    ref={videoElement}
                    muted
                    style={{ zIndex: 0, width: '60%', height: '60%', borderRadius: 2, boxShadow: 2 }}
                    autoPlay
                    playsInline
                  />
                  {isRecording && videoElement.current && (
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ width: '60%', visibility: progress <= 0 && 'hidden' }}
                    />
                  )}
                </Stack>
              </MotionContainer>
              <Box sx={{ mt: 3, mb: 3 }}>
                <SoundWave />
              </Box>
            </>
          ) : (
            <MotionContainer>
              <IconButton
                component={m.div}
                variants={varBounce().in}
                onClick={() => {
                  handleStartRecording();
                  initializeMicrophoneTest();
                  onStartMicrophoneTest();
                  setProgress(0);
                }}
                disabled={isRecording || loading}
                sx={{ mt: 2 }}
                color="primary"
                aria-label="upload picture"
              >
                <img src="/assets/new-icon/audio_video.svg" alt="SVG" />
              </IconButton>
            </MotionContainer>
          )}
          {uploadFailed && !isRecording && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              Please click below to retake.
            </Typography>
          )}
        </Box>
      </Box>
      <LoadingButton
        variant="contained"
        color="primary"
        size="medium"
        loading={isRecording || loading}
        sx={{ ml: 'auto', mr: 'auto', width: 200, textDecoration: 'none', borderRadius: 0.5, fontWeight: 500 }}
        onClick={() => {
          handleStartRecording();
          initializeMicrophoneTest();
          onStartMicrophoneTest();
          setProgress(0);
        }}
      >
        {uploadFailed ? 'RETAKE RECORDING' : 'START RECORDING'}
      </LoadingButton>
    </>
  );
}