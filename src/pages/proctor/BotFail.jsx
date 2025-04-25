import { Box, Button, Card, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  DoNotEnter,
  InterviewCompleted,
  InterviewEnd,
  VoiceNotRecognized,
  BrowserValidation,
  donotEnter,
  internetError,
  isScreenShareDisable,
  isOptedOut
} from 'src/assets/mastermind_animation';
import { useMastermind } from 'src/context/mastermind-context';
import useNetworkSpeedTest from 'src/new_hooks/useNetworkSpeed';

const MessageContent = ({ imgSrc, altText, mainText, subText, setCurrentPage }) => (
  <Stack
    direction="column"
    spacing={3}
    sx={{
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <img
      src={imgSrc}
      alt={altText}
      style={{
        width: '30%',
        height: 'auto',
        maxHeight: '200px',
        marginBottom: '16px',
      }}
    />
    <Typography
      variant="h4"
      sx={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'text.primary',
      }}
    >
      {mainText}
    </Typography>
    <Typography
      variant="h6"
      sx={{
        fontSize: '1.25rem',
        color: 'text.secondary',
      }}
    >
      {subText}
    </Typography>
    <Button
      variant="contained"
      color="primary"
      onClick={() => setCurrentPage('TECHNICAL_READINESS_CHECK')}
      sx={{
        mt: 2,
        width: '100%',
        maxWidth: '300px',
      }}
    >Reload</Button>
  </Stack>
);


export default function BotFail({ }) {
  const { errorType, setCurrentPage } = useMastermind();
  const { networkSpeed, networkStatus } = useNetworkSpeedTest();
  console.log('networkSpeed', networkSpeed);
  const contentMap = {
    isInterviewNotAvailable: {
      imgSrc: DoNotEnter,
      altText: "Do Not Enter",
      mainText: "We regret to inform you that the interview link has expired as it exceeded the date/time limit.",
      subText: "Please reach out to your coordinator to know more. Thank you for your understanding."
    },
    isInterviewCompleted: {
      imgSrc: InterviewCompleted,
      altText: "Interview Completed",
      mainText: "We are thrilled with your enthusiasm.",
      subText: "You have already completed your assessment, however we wish to see you soon."
    },
    isInterviewExpired: {
      imgSrc: DoNotEnter,
      altText: "Interview Expired",
      mainText: "We apologize for any inconvenience. The interview link has expired.",
      subText: "Please contact your coordinator. Thank you."
    },
    isHandleEndInterview: {
      imgSrc: InterviewEnd,
      altText: "Interview Ended",
      mainText: "We apologize for any inconvenience. It appears you have ended the interview.",
      subText: "If you did not intend to exit and wish to rejoin, please use the same link to re-enter the interview. Contact your coordinator for further assistance. Thank you."
    },
    botSpeakErrorIssue: {
      imgSrc: DoNotEnter,
      altText: "Error",
      mainText: "Oops, it seems like there has been a disruption. Please, do not worry. Take a brief 10-minute break.",
      subText: "Refresh and restart the session using the same link."
    },
    isVoiceNotDetected: {
      imgSrc: VoiceNotRecognized,
      altText: "Voice Not Recognized",
      mainText: "Currently, we are not receiving a response from you. It appears that your voice may be too soft.",
      subText: "Could you please speak more clearly and audibly? We would greatly appreciate it."
    },
    isBrowserValidation: {
      imgSrc: BrowserValidation,
      altText: "Browser Validation Error",
      mainText: "Welcome! However, you are currently using an unsupported browser.",
      subText: "For the best user experience, please open this link in the Chrome browser."
    },
    domEventBlocked: {
      imgSrc: donotEnter,
      altText: "Browser proxy error",
      mainText: "Oops! It looks like your browser is blocking certain website features.",
      subText: "Please disable any extensions that may be blocking DOM events and reopen the link to continue."
    },
    networkErrorRef: {
      imgSrc: internetError,
      altText: "Network issue",
      mainText: `Your internet connection seems to be slower than 8 Mbps.`,
      subText: "To ensure a seamless interview experience, please connect to a faster network and refresh the page."
    },
    isScreenSharingNotActive: {
      imgSrc: isScreenShareDisable,
      altText: "Screen Sharing Disabled",
      mainText: "You have disabled Screen Sharing.",
      subText: "Please enable screen sharing to continue with the assessment since you are in a proctored environment.",
    },
    isCandidateOptedOut: {
      imgSrc: isOptedOut,
      altText: "Candidate Opted Out",
      mainText: "You have already opted out.",
      subText: "This interview link is no longer active as you have opted out. Please contact support if you need assistance."
    },
    isDeviceChanged: {
      imgSrc: VoiceNotRecognized,
      altText: "Audio Device Changed",
      mainText: "Your audio device has changed.",
      subText: "We detected a change in your audio device. Please ensure your preferred headset or microphone is selected and working correctly. Avoid changing your audio device frequently during the assessment. Refresh the page or restart the session using the same link."
    },
    isCameraDisabled: {
      imgSrc: DoNotEnter,
      altText: "Camera Disabled",
      mainText: "Your camera is turned off.",
      subText: "To proceed with the assessment, please enable your camera in your device settings or browser permissions. Do not turn off your camera during the assessment. Refresh and restart the session using the same link."
    },
    isMicrophoneDisabled: {
      imgSrc: VoiceNotRecognized,
      altText: "Microphone Disabled",
      mainText: "Your microphone is turned off.",
      subText: "To proceed with the assessment, please enable your microphone in your device settings or browser permissions. Do not turn off your microphone during the assessment. Refresh and restart the session using the same link."
    },
  };
  const content = useMemo(() => contentMap[errorType], [errorType]);

  return (
    <Card
      sx={{
        pt: '3vh',
        pb: '3vh',
        pl: '3vw',
        pr: '3vw',
        m: 2,
        ml: { xs: 2, sm: 4 },
        mr: { xs: 2, sm: 4 },
        bgcolor: 'background.bg',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 3,
          width: { xs: '90vw', sm: '80vw', md: '80vw' },
          minHeight: { xs: '90vh', sm: '75vh', md: '77vh' },
        }}
      >
        {content && <MessageContent {...content} setCurrentPage={setCurrentPage} />}
      </Card>

    </Card>
  );
}
