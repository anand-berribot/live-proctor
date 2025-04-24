import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const FaceCapture1 = ({ onStartStopWebcam, onTakePicture }) => {
    const webcamRef = useRef(null);
    const [isWebcamStarted, setIsWebcamStarted] = useState(false);
    const [isWebcamReady, setIsWebcamReady] = useState(false); // Track webcam readiness

    const startStopWebcam = () => {
        setIsWebcamStarted(!isWebcamStarted);
        onStartStopWebcam(!isWebcamStarted); // Notify the parent component about webcam status
    };

    const handleWebcamReady = () => {
        setIsWebcamReady(true); // Set webcam readiness when it's ready
    };

    const capture = () => {
        if (isWebcamReady) { // Ensure webcam is ready before capturing
            const imageSrc = webcamRef.current.getScreenshot();
            onTakePicture(); // Notify the parent component that a picture has been taken
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            {isWebcamStarted && (
                <Webcam
                    audio={false}
                    mirrored={true}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={{ width: 300 }} // Hide the webcam initially
                    onUserMedia={() => handleWebcamReady()} // Call when webcam is ready
                />
            )}
            <Button onClick={startStopWebcam}>{`${isWebcamStarted ? 'Stop Webcam' : 'Start Webcam'}`}</Button>
            {isWebcamStarted && isWebcamReady && (
                <Button onClick={capture} variant="contained" sx={{ mt: 2 }}>
                    Take Picture
                </Button>
            )}
        </Box>
    );
};

export default FaceCapture1;
