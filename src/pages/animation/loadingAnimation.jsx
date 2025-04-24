import React from 'react';
import './loadingAnimation.css';
import { Typography } from '@mui/material';

const LoadingAnimation = () => {
    return (
        <div className="loading">
            <Typography variant="h6" color="textSecondary" align="center" className="message" id="message1">Getting your interview ready...</Typography>
            <Typography variant="h6" color="textSecondary" align="center" className="message" id="message2">Bot is gearing up...</Typography>
            <Typography variant="h6" color="textSecondary" align="center" className="message" id="message3">Setting up the questions...</Typography>
            <Typography variant="h6" color="textSecondary" align="center" className="message" id="message4">Take a deep breath...</Typography>
            <Typography variant="h6" color="textSecondary" align="center" className="message" id="message5">Prepare your mind...</Typography>
            <Typography variant="h6" color="textSecondary" align="center" className="message" id="message6">Got your thinking cap on?..</Typography>
            <Typography variant="h6" color="textSecondary" align="center" className="message" id="message7">Relax, we're almost ready...</Typography>
            <Typography variant="h6" color="textSecondary" align="center" className="message" id="message8">Get ready to shine...</Typography>
            <Typography variant="h6" color="textSecondary" align="center" className="message" id="message9">Almost showtime, stay relaxed...</Typography>
            <Typography variant="h6" color="textSecondary" align="center" className="message" id="message10">Final touches, hang tight...</Typography>
            <Typography variant="h6" color="textSecondary" align="center" className="message" id="message11"></Typography>
            <span><i></i><i></i></span>
        </div>
    );
}

export default LoadingAnimation;