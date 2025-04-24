// FaceCapture.js
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const FaceCapture = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const retake = () => {
    setCapturedImage(null);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
      <Webcam
        audio={false}
        mirrored={true}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      {capturedImage ? (
        <>
          <img src={capturedImage} alt="Captured face" />
          <Button onClick={retake}>Retake</Button>
        </>
      ) : (
        <Button onClick={capture}>Capture</Button>
      )}
    </Box>
  );
};

export default FaceCapture;
