import { m } from 'framer-motion'
import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Card, CardContent, Link, Typography } from '@mui/material';
import getVariant from 'src/sections/_examples/extra/animate-view/get-variant';

const Camera = ({ onCapture, onRecapture, onImageChange, file, loading, isCameraEnabled }) => {
    const [face, setFace] = useState(null); // State to store captured face image
    const [webcamStream, setWebcamStream] = useState(null);
    const videoElement = useRef(null);

    useEffect(() => {
        if (file) {
            setFace(file)
        } else {
            initCamera(); // Initialize webcam stream when component mounts
        }
        return () => {
            // Cleanup function to stop webcam stream when component unmounts
            if (webcamStream) {
                webcamStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isCameraEnabled]); // Empty dependency array ensures the effect runs only once on mount


    const initCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setWebcamStream(stream);

            if (videoElement.current) {
                videoElement.current.srcObject = stream;
            }

            console.debug('`Proctor Webcam initialized`');
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error accessing webcam: \`${err.message}\``);
            } else {
                console.error(`Unknown error accessing webcam ${err}`);
            }

            if (err.name === 'NotFoundError') {
                console.error('`No media devices found (e.g., no webcam connected).`');
            } else if (err.name === 'NotAllowedError') {
                console.error('`Permission to access webcam was denied.`');
            } else if (err.name === 'OverconstrainedError') {
                console.error('`Requested video constraints could not be met (e.g., requested resolution not available).`');
            }
        }
    };

    const handleCapture = () => {
        console.debug('Proctor Capturing snapshot');
        triggerSnapshot();
    };

    const triggerSnapshot = () => {
        if (webcamStream) {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.current.videoWidth;
            canvas.height = videoElement.current.videoHeight;
            canvas.getContext('2d').drawImage(videoElement.current, 0, 0, canvas.width, canvas.height);
            const captureImage = canvas.toDataURL('image/jpeg');
            setFace(captureImage);
            onImageChange(captureImage);
        }
    };

    const handleRecapture = () => {
        // Reinitialize webcam stream for recapture
        if (webcamStream) {
            webcamStream.getTracks().forEach(track => track.stop());
        }
        initCamera();
        // Clear the captured face
        setFace(null);
        // Trigger the recapture callback
        onRecapture();
    };

    useEffect(() => {
        onImageChange(face); // Call onImageChange whenever the face state changes
    }, [face, onImageChange]);

    return (
        <Card sx={{ bgcolor: 'background.bg', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 360, maxHeight: 360 }}>
            <Typography sx={{ textAlign: 'center', fontSize: 18, fontWeight: 600, mt: 2 }}>Capture Face</Typography>
            <CardContent component={m.div} {...getVariant('zoomIn')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                {!face && <video ref={videoElement} style={{ width: '87%', marginTop: '-30px' }} height="300" autoPlay playsInline></video>}
                {face && <Box sx={{ width: 300, height: 300, objectFit: 'cover' }}><img src={face} alt="Captured Face" /></Box>}
            </CardContent>
            {!loading &&
                <>
                    {!face && <Link type="button" variant="contained" onClick={handleCapture} sx={{ fontSize: 15, cursor: 'pointer', textDecoration: 'underline', position: 'absolute', bottom: 12, ':hover': { textDecoration: 'none' } }}>Click here to Take Picture</Link>}
                    {face && <Link type="button" variant="contained" onClick={handleRecapture} sx={{ mt: 2, fontSize: 15, cursor: 'pointer', textDecoration: 'underline', position: 'absolute', bottom: 12, ':hover': { textDecoration: 'none' } }}>Click here to Retake your Face</Link>}
                </>
            }
        </Card>
    );
};

export default Camera;
