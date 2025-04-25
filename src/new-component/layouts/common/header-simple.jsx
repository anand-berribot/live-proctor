import React, { useEffect, useState, useRef } from 'react';
import { AppBar, Toolbar, Typography, Stack, Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ReactInternetSpeedMeter } from "react-internet-meter";
import { enqueueSnackbar } from 'notistack';

import { bgBlur } from 'src/theme/css';
import ClientLogo from 'src/components/logo/clientLogo';
import SvgColor from 'src/components/svg-color';
import CustomSwitch from 'src/new-component/custom-switch';
import { useSettingsContext } from 'src/components/settings';
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { HEADER } from '../config-layout';
import HeaderShadow from './header-shadow';
import { useCandidateExpContext } from 'src/context/candidate-exp-context/candidateExpContext';
// import CustomPopover from 'src/components/custom-popover';
// import AudioSettings from 'src/pages/candidate/common/audio-settings';
// import usePermissions from 'src/pages/candidate/hooks/usePermissions';
import Iconify from 'src/components/iconify';
import usePermissions from 'src/new_hooks/usePermissions';
import { getBrowserAndOS } from 'src/pages/proctor/browserUtils';
// import useAudioDevices from 'src/pages/candidate/hooks/useAudioDevice';
// import { getBrowserAndOS } from 'src/pages/candidate/common/browserUtils';

export default function HeaderSimple() {
  const theme = useTheme();
  const settings = useSettingsContext();
  const { browser, os } = getBrowserAndOS();
  const { showReportBtn, setShowReportBtn, isReported, setIsReported, isHeadsetConnected, isNetworkSpeedDetected } = useCandidateExpContext();
  const { isMicrophoneEnabled } = usePermissions();
  // const { microphone, speaker } = useAudioDevices();

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);
  const [wifiSpeed, setWifiSpeed] = useState(0);
  const [network, setNetwork] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [audioSettingPopover, setAudioSettingPopover] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(true);
  const [touched, setTouched] = useState(false);
  const [isFormSubmit, setIsFormSubmit] = useState(false);

  const MAX_SPEEDS = 5;
  const MIN_SPEED_MBPS = 2;
  const MAX_SAMPLES = 10;
  const CONSECUTIVE_FAILURES = 3;


  useEffect(() => {
    settings.onUpdate('themeMode', 'dark');
    const popovertimer = setTimeout(() => {
      setPopoverOpen(false);
    }, 15000);
    return () => clearTimeout(popovertimer);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('created_by_id')?.includes('31') || sessionStorage.getItem('created_by_id')?.includes('5')) {
      setNetwork(true);
    } else {
      setNetwork(false);
    }
  }, [sessionStorage.getItem('created_by_id')]);

  const getStoredSpeeds = () => {
    const speeds = sessionStorage.getItem('wifi-speed');
    return speeds ? JSON.parse(speeds) : [];
  };

  const updateStoredSpeeds = (speeds) => {
    sessionStorage.setItem('wifi-speed', JSON.stringify(speeds));
  };

  const handleNetworkTest = (speed) => {
    if (sessionStorage.getItem("isNetworkSpeedDetected") === 'false') {
      sessionStorage.setItem('wifi-speed', JSON.stringify([]));
      return;
    }
  
    const speeds = getStoredSpeeds();
    const updatedSpeeds = [...speeds, speed].slice(-MAX_SAMPLES);
    
    // Calculate moving average of last 5 samples
    const recentSpeeds = updatedSpeeds.slice(-5);
    const averageSpeed = recentSpeeds.reduce((a, b) => a + b, 0) / recentSpeeds.length;
    
    // Check for consecutive low readings
    const lowReadings = updatedSpeeds.slice(-CONSECUTIVE_FAILURES).every(s => s < MIN_SPEED_MBPS);
    
    if (averageSpeed < MIN_SPEED_MBPS || lowReadings) {
      sessionStorage.setItem('network-status', 'not-good');
      console.warn(`Network issues detected. Average: ${averageSpeed} Last readings: ${updatedSpeeds}`);
    } else {
      sessionStorage.setItem('network-status', 'good');
    }
    
    updateStoredSpeeds(updatedSpeeds);
  
    setWifiSpeed(speed);
  };
  

  useEffect(() => {
    const handleConnectionChange = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        console.warn(`Connection type: ${connection.effectiveType}, Downlink: ${connection.downlink}Mbps`);
        sessionStorage.setItem('connection-type', connection.effectiveType);
      }
    };
  
    navigator.connection?.addEventListener('change', handleConnectionChange);
    return () => navigator.connection?.removeEventListener('change', handleConnectionChange);
  }, []);



  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setIssueText("");
    setTouched(false);
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
  };

  const handleSubmitIssue = async () => {
    if (isFormSubmit) return;

    if (!issueText.trim()) {
      enqueueSnackbar('Please describe the issue before submitting.', {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      return;
    }

    const candidateDatas = JSON.parse(sessionStorage.getItem('candidate_details'));
    const candidateInfo = `Candidate Information: ${candidateDatas.first_name} ${candidateDatas.last_name} | ${candidateDatas.email_id}`;

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const payload = {
      channel: '#berris-mastermind-candidate-support',
      username: `*New Issue Received from ${candidateDatas.Interviews[0].client_name} Candidate*`,
      text: `New Issue:\nCandidate ID: ${candidateDatas.Interviews[0].candidate_id} | Interview ID: ${candidateDatas.Interviews[0].id} | Client: ${candidateDatas.Interviews[0].client_name} | Job Role: ${candidateDatas.Interviews[0].job_role}\n*${candidateInfo}*\n\n**Browser:** ${browser} | **OS:** ${os} | **Region:** ${tz}\n\n**ISSUE DESCRIPTION:**\n- *${issueText}* -\nPlease check and resolve the issue as soon as possible.`
    };

    setIsFormSubmit(true);
    try {
      const MASTERMIND_API_URL = process.env.VITE_REACT_APP_API_URL;
      const response = await fetch(`${MASTERMIND_API_URL}candidate_support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        enqueueSnackbar(errorData.message || 'Something went wrong. Please try again later.', { variant: 'error', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        return;
      }
      if (response.status === 200) {
        handleClosePopup();
        setIsReported(true);
        setShowReportBtn(false);
        enqueueSnackbar('Thank you for reaching out. Our team will reach out to you.', {
          variant: 'success',
          autoHideDuration: 4000,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      }
    } catch (error) {
      setIsFormSubmit(false);
      enqueueSnackbar(error.message, {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
  };

  const handleCloseAudioSetting = () => {
    setAudioSettingPopover(false);
  };

  return (
    <>
      <AppBar onContextMenu={(event) => event.preventDefault()}>
        {/* {isNetworkSpeedDetected && (
          <ReactInternetSpeedMeter
            txtSubHeading=""
            outputType="alert"
            customClassName={null}
            txtMainHeading=""
            pingInterval={4000}
            thresholdUnit='megabyte'
            threshold={100}
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/WP20Symbols_MediaWiki_light_background.svg/312px-WP20Symbols_MediaWiki_light_background.svg.png"
            downloadSize="1781287"
            callbackFunctionOnNetworkDown={(speed) => console.log(`Internet speed is down ${speed}`)}
            callbackFunctionOnNetworkTest={handleNetworkTest}
          />
        )} */}

        <Toolbar
          sx={{
            justifyContent: 'space-between',
            height: {
              xs: HEADER.H_MOBILE - 10,
              md: HEADER.H_DESKTOP - 10,
            },
            transition: theme.transitions.create(['height'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.shorter,
            }),
            ...(offsetTop && {
              ...bgBlur({
                color: theme.palette.background.default,
              }),
              height: {
                md: HEADER.H_DESKTOP_OFFSET,
              },
            }),
            borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <ClientLogo />
          </Stack>

          <Stack flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
            {/* <Tooltip title="Audio Settings">
              <IconButton id='audio' onClick={() => setAudioSettingPopover(!audioSettingPopover)} sx={{ border: "1px solid", borderRadius: 1, padding: "6px" }}>
                <Iconify icon={isHeadsetConnected ? "mdi:headset" : "mdi:speaker"} width={24} color={isMicrophoneEnabled && 'primary.main'} />
                <Iconify icon={audioSettingPopover ? "mdi:chevron-up" : "mdi:chevron-down"} width={20} sx={{ ml: 0.5 }} />
              </IconButton>
            </Tooltip> */}

            {/* {showReportBtn && !isReported && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title="Need Support">
                  <IconButton
                    id="report-issue-btn"
                    onClick={handleOpenPopup} sx={{ p: 1 }}>
                    <SvgColor
                      src="/assets/new-icon/emojione-monotone--handshake.svg"
                      sx={{ width: 30, height: 30 }}
                      color={'primary.main'}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            )} */}

            {/* {network && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
                <SvgColor src="/assets/new-icon/wifi.svg" color='primary.main' sx={{ width: 20, height: 20 }} />
                <Typography variant="caption" sx={{ fontSize: '0.55rem' }}>{wifiSpeed} Mbps</Typography>
              </Box>
            )} */}

            <CustomSwitch
              value={settings.themeMode}
              onChange={(newValue) => settings.onUpdate('themeMode', newValue)}
              options={['light', 'dark']}
              icons={['sun', 'moon']}
            />
          </Stack>
        </Toolbar>
        {offsetTop && <HeaderShadow />}
      </AppBar>

      {/* {showReportBtn &&
        <CustomPopover open={popoverOpen} onClose={handleClosePopover} anchorEl={document.getElementById('report-issue-btn')}>
          <Box sx={{ m: 1, maxWidth: 250 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Need Support?
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              If you're encountering any issues, please click this button to report your problem.
            </Typography>
            <Box
              sx={{
                mt: 1,
                p: 1,
                borderRadius: 1,
                textAlign: 'center',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              Our support team is ready to assist you promptly.
            </Box>
          </Box>
        </CustomPopover>
      } */}

      {/* <CustomPopover open={audioSettingPopover} onClose={handleCloseAudioSetting}
        anchorEl={document.getElementById('audio')}
      >
        <AudioSettings />
      </CustomPopover> */}

      <Dialog open={openPopup} onClose={handleClosePopup} maxWidth="sm" fullWidth>
        <DialogTitle>What issue are you facing?</DialogTitle>
        <DialogContent sx={{}}>
          <TextField
            autoFocus
            margin="dense"
            label="Describe your issue"
            multiline
            minRows={4}
            fullWidth
            variant="outlined"
            value={issueText}
            onChange={(e) => {
              setIssueText(e.target.value);
              setTouched(true);
            }}
            sx={{ width: '100%' }}
            error={!issueText.trim() && touched}
            helperText={!issueText.trim() && touched ? "This field cannot be empty" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} variant='outlined'>
            Cancel
          </Button>
          <Button onClick={handleSubmitIssue} variant='contained'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}