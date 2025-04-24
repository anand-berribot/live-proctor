import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function App() {
  const webcamRef = useRef(null);
  const [imageCaptured, setImageCaptured] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioData, setAudioData] = useState([]);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return alert("No image captured!");
    localStorage.setItem("capturedImage", imageSrc);
    setImageCaptured(true);
    setStatus("✅ Face captured. Now record your voice.");
  };

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMediaStream(stream);

        const recorder = new MediaRecorder(stream);
        const chunks = [];
        let videoBlob = null;

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = async () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            const videoBlob = new Blob(chunks, { type: "video/webm" }); // Capture video blob

            const image = localStorage.getItem("capturedImage");

            const formData = new FormData();
            formData.append("image", image); // still base64
            formData.append("audio", blob);  // binary blob
            formData.append("video", videoBlob); // video blob

            setLoading(true);
            try {
                await axios.post("http://localhost:8001/upload-face-voice", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setStatus("✅ Face, voice, and video submitted successfully!");
            } catch (err) {
                console.error(err);
                setStatus("❌ Upload failed.");
            } finally {
                setLoading(false);
            }
        };

        recorder.start();
        setMediaRecorder(recorder);
        setRecording(true);
        setStatus("🎙️ Recording...");
    } catch (err) {
        console.error("🎤 Microphone error:", err);
        alert("Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      setStatus("⏳ Processing and uploading...");
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Teams Face & Voice Verification</h2>
      {!imageCaptured ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
          />
          <br />
          <button onClick={captureImage} style={{ marginTop: 10 }}>
            📸 Capture Face
          </button>
        </>
      ) : (
        <>
          <button onClick={startRecording} disabled={recording}>
            🎙️ Start Recording
          </button>
          <br /><br />
          <button onClick={stopRecording} disabled={!recording || loading}>
            ✅ Stop and Submit
          </button>
        </>
      )}
  
      {recording && mediaStream && (
        <video
          autoPlay
          playsInline
          muted
          ref={(video) => {
            if (video) video.srcObject = mediaStream;
          }}
          width={400}
          style={{ marginTop: 20 }}
        />
      )}
  
      <p style={{ marginTop: 20 }}>{status}</p>
    </div>
  );
  
}

export default App;