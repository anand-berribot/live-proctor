import React, { useEffect, useRef } from 'react';
import './SoundWave.css';
import { useTheme } from '@mui/material/styles';

const SoundWave = () => {
  const theme = useTheme();

  const color= theme.palette.primary;
  const canvasRef = useRef(null);
  let ctx;
  let animationFrameId;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Set canvas background to transparent
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const maxAmplitude = canvas.height / 5;
    const baseLine = canvas.height / 1.8;
    let globalTime = 0;

    const drawWave = (dataArray, analyser) => {
      if (dataArray.some((value) => value > 0)) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = (Math.sin(i * 0.1 + globalTime) + 1) * 64;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      globalTime += 0.05;

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "#00A76F"); // Start color
        gradient.addColorStop(0.5, "#5BE49B"); // Middle color
        gradient.addColorStop(1, "#00A76F"); // End color
        // gradient.addColorStop(0, color); // Start color
        // gradient.addColorStop(0.5, color); // Middle color
        // gradient.addColorStop(1, color); // End color

      for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = gradient;

        let x = 0;
        let sliceWidth = ((canvas.width * 1.0) / dataArray.length);
        let lastX = 0;
        let lastY = baseLine;

        for (let i = 0; i < dataArray.length; i++) {
          let v = dataArray[i] / 96.0;
          let mid = dataArray.length / 2;
          let distanceFromMid = Math.abs(i - mid) / mid;
          let dampFactor = 1 - Math.pow((2 * i / dataArray.length - 1), 2);
          let amplitude = maxAmplitude * dampFactor * (1 - distanceFromMid);
          let frequency = (j === 1 ? -1 : 1) * (0.05 + 0.25);
          let baselineSkew = 0.5 * Math.sin(Math.PI * (x / canvas.width));
          const y = baseLine + Math.sin(i * frequency + globalTime + j) * amplitude * v;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            let xc = (x + lastX) / 2;
            let yc = (y + lastY) / 2;
            ctx.quadraticCurveTo(lastX, lastY, xc, yc);
          }

          lastX = x;
          lastY = y;
          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, lastY);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(() => drawWave(dataArray, analyser));
    };

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const waves = dataArray.slice(0, 250);

        drawWave(waves, analyser);
      })
      .catch((error) => {
        console.error("Access to microphone denied", error);
      });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="sound-wave-container">
      <canvas ref={canvasRef} id="waveCanvas"></canvas>
    </div>
  );
};

export default SoundWave;
