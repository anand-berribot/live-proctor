import React, { useEffect, useCallback } from 'react';
import moment from 'moment';
import { useParams } from 'react-router-dom';

// Components
import TermsAndConditions from './TermsAndConditions';
import CountdownToInterviewStart from './CountdownToInterviewStart';
import BotFail from './BotFail';
import BotSuccess from './BotSuccess';
import { SplashScreen } from 'src/components/loading-screen';
import useScreenRecording from 'src/new_hooks/useScreenRecording';

// Contexts
import LoggingService from 'src/new_services/logging-service';

// Services
import { getCandidate } from 'src/new_services/candidateService';
import Hints from './hints';
import IdentityVerification from './IdentityVerification';
import AudioVideo from './AudioVideo';
import { handleApiResponse } from 'src/new_services/apiService';
import { MastermindProvider, useMastermind } from 'src/context/mastermind-context';

export default function InterviewRoomWrapper() {
  const { h } = useParams();
  return (
    <MastermindProvider>
      <InterviewRoom accesskey={h} />
    </MastermindProvider>
  );
}

function InterviewRoom({ h }) {
  // const { setCurrentPage, setCandidateData, setErrorType } = useMastermind();

  // const fetchCandidateData = useCallback(async () => {
  //   LoggingService.info(`Fetching candidate data for access key: ${accesskey}`);
  //   setCurrentPage('LOADING');

  //   try {
  //     const data = await getCandidate(accesskey);
  //     if (data && data !== 'fail') {
  //       LoggingService.info(`Candidate data fetched successfully - Candidate ID: ${data?.id}`, data);
  //       setCandidateData(data);
  //     } else {
  //       LoggingService.error(`Invalid candidate data received for access key: ${accesskey}`);
  //       setErrorType('DoNotEnter');
  //       setCurrentPage('BOT_FAIL');
  //     }
  //   } catch (error) {
  //     LoggingService.critical(`Failed to fetch candidate data: ${error.message}`);
  //     setErrorType('DoNotEnter');
  //     setCurrentPage('BOT_FAIL');
  //   }
  // }, [accesskey, setCandidateData, setCurrentPage, setErrorType]);

  // useEffect(() => {
  //   fetchCandidateData();
  // }, [fetchCandidateData]);

  return <InterviewContent accesskey={h} />;
}

function InterviewContent({ accesskey }) {
  const { currentPage } = useMastermind();
  const screens = {
    LOADING: <SplashScreen />,
    HINTS: <Hints />,
    TERMS_AND_CONDITIONS: <TermsAndConditions accesskey={accesskey} />,
    COUNTDOWN_TO_INTERVIEW_START: <CountdownToInterviewStart />,
    IDENTITY_VERIFICATION: <IdentityVerification />,
    AUDIO_VIDEO_VERIFICATION: <AudioVideo />,
    // PERMISSION_CHECK: <PermissionCheck startScreenRecording={startScreenRecording} />,
    BOT_FAIL: <BotFail />,
    BOT_SUCCESS: <BotSuccess />,
  };

  const CurrentScreen = screens[currentPage];
  if (!CurrentScreen) {
    LoggingService.error(`No screen found for current page: ${currentPage}`, candidateData);
    return null;
  }

  return <>{CurrentScreen}</>;
}