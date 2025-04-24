import { m } from 'framer-motion';
import { Box, Button, Card, CardContent, CardHeader, FormControlLabel, Grid, IconButton, LinearProgress, Link, ListItemText, Snackbar, Stack, Switch, TextField, Typography, Tooltip } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, UploadAvatar, UploadBox } from 'src/components/upload';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import Camera from './camera';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import getVariant from 'src/sections/_examples/extra/animate-view/get-variant';
import { InfoDialog, WarningDialog } from 'src/new-component/dialog';
import axios from 'axios';
import { useMastermind } from '../../context/mastermind-context';
import usePermissions from 'src/new_hooks/usePermissions';

export default function IdentityVerification({ }) {
  const navigate=useNavigate();
  const { setCurrentPage, candidateData } = useMastermind();
  const MASTERMIND_API_URL = process.env.VITE_REACT_APP_API_URL;
  const PROCTOR_API_URL = process.env.VITE_REACT_APP_PROCTOR_API_URL;

  // const { first_name, last_name, d_o_b, id_proof_front, image_url, Interviews } = candidateData;
  let first_name = '';
  let last_name = '';
  let d_o_b = '';
  // const {
  //   permissions,
  //   isCameraEnabled,
  //   isMicrophoneEnabled,
  //   videoStream,
  //   enableCamera,
  //   disableCamera,
  //   enableMicrophone,
  //   disableMicrophone,
  // } = usePermissions();
  // const candidateId =  Interviews?.[0]?.candidate_id;
  const candidateId = 123;
  // const webcamRef = useRef(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState(null);
  const [date, setDate] = useState(null);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [dobError, setDobError] = useState(false);
  const [file, setFile] = useState(null);
  const [isWebcamStarted, setIsWebcamStarted] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [fileExtension, setFileExtension] = useState('');
  const [loading, setLoading] = useState(false);
  const [webCamAlert, setwebCamAlert] = useState('');
  const [tooltipMessage, setTooltipMessage] = useState('');

  useEffect(() => {
    setFirstName(first_name);
    setLastName(last_name);
    setDob(d_o_b || null);
    console.debug('IdentityVerification: Page loaded');
  }, [candidateData]);

  // useEffect(() => {
  //   const checkWebcamStatus = async () => {
  //     const webCamData = await enableWebcam(); // Assuming enableWebcam() is async
  //     if (!webCamData) {
  //       setwebCamAlert(true);
  //     } else {
  //       setwebCamAlert(false);
  //     }
  //   };
  //   checkWebcamStatus();
  // }, []);

  function isImageFile(filename) {
    if (!filename) return {};
    var extension = filename.split('.').pop().toLowerCase();
    let pass = /^(jpeg|jpg|png)$/.test(extension);
    return { pass: pass, extension: extension };
  }

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    let fileData = isImageFile(newFile.name);
    if (newFile) {
      const isImageFile = /\.(jpg|jpeg|png)$/i.test(newFile.name);
      if (!isImageFile) {
        console.error(`IdentityVerification: Invalid file type: ${newFile.type}`);
        enqueueSnackbar("Please choose a file in either JPG, JPEG, or PNG format.", {
          variant: 'info', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
        setFile(null);
        return;
      }
      const fileSizeInKB = newFile.size / 1000;
      if (fileSizeInKB < 32 || fileSizeInKB > 4096) {
        console.error(`IdentityVerification: File size out of range: ${fileSizeInKB}KB (must be between 32KB and 4MB)`);
        enqueueSnackbar("Please ensure that the file size is between 32KB and 4MB.", {
          variant: 'info',
          autoHideDuration: 2000,
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
        setFile(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFile(reader.result);
      };
      reader.readAsDataURL(newFile);
      setFileExtension(fileData.extension);
    }
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return setDate(`${day}-${month}-${year}`);
  };

  const FieldsCheck = () => {
    let hasError = false;
    if (!firstName) {
      setFirstNameError(true);
      hasError = true;
    } else {
      setFirstNameError(false);
    }
    if (!hasError) {
      submit();
    }
  };

  const submit = async () => {
    if (file === null) {
      console.error(`IdentityVerification: ID proof missing for candidate ID ${candidateId}`);
      enqueueSnackbar("Please upload your ID Proof", {
        variant: 'warning', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } else if (capturedImage === null) {
      console.error(`IdentityVerification: Selfie not captured for candidate ID ${candidateId}`);
      enqueueSnackbar("Please capture your face", {
        variant: 'warning', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } else {
      setLoading(true);
      try {
        let formData = new FormData();
        formData.append('user_id', candidateId);
        formData.append('type_of_id_proof', 'Aadhar');
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('dob', date);
        formData.append('id_proof_front', file ? file.split(',')[1] : null);
        formData.append('image_url', capturedImage.split(',')[1]);
        formData.append('id_front_file_type', fileExtension);

        const response = await axios.post(`${PROCTOR_API_URL}candidate/update_candidate`, formData);
        setLoading(false);

        if (response.data.status === 'success') {
          enqueueSnackbar(response.data.message, {
            variant: 'success', autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
          });
          navigate('/audio-video-verification');
        } else {
          console.error(`IdentityVerification: API returned non-success status for candidate ID ${candidateId}: ${response.data.message}`);
          enqueueSnackbar(response.data.message, {
            variant: 'error', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
          });
        }
        navigate('/audio-video-verification');
      } catch (error) {
        setLoading(false);
        navigate('/audio-video-verification');
        if (error.response) {
          // Server responded with a status code outside of 2xx
          console.error(`IdentityVerification: Server error for candidate ID ${candidateId} - Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
          if (error.response.status === 500) {
            if (!fileExtension) {
              enqueueSnackbar('Face detection failed. Please try again by taking a live selfie in a well-lit environment.', {
                variant: 'warning', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
              });
            } else {
              enqueueSnackbar('Please upload a clear, readable image of the front side of the Aadhaar card.', {
                variant: 'warning', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
              });
            }
          } else {
            enqueueSnackbar('Something went wrong, please try again!', {
              variant: 'error', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
          }
        } else if (error.request) {
          // Request was made but no response received (e.g., network error)
          console.error(`IdentityVerification: No response received for candidate ID ${candidateId} - Request: ${error.request}`);
          enqueueSnackbar('No response from server, please try again!', {
            variant: 'error', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
          });
        } else {
          // Error setting up the request
          console.error(`IdentityVerification: Request setup error for candidate ID ${candidateId} - Message: ${error.message}`);
          enqueueSnackbar('Something went wrong, please try again!', {
            variant: 'error', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
          });
        }
      }
    }
  };

  const handleCapture = (image) => {
    setCapturedImage(image);
  };

  const handleRecapture = () => {
    // Handle recapture logic here if needed
  };

  const handleImageChange = (image) => {
    setCapturedImage(image);
  };

  // const updateTooltipMessage = () => {
  //   // console.error(webCamAlert)
  //   if (!isMicrophoneEnabled || !isCameraEnabled) {
  //     setTooltipMessage('Please enable both your webcam and microphone.');
  //   } else if (!isMicrophoneEnabled) {
  //     setTooltipMessage('Please enable your microphone.');
  //   } else if (!isCameraEnabled) {
  //     setTooltipMessage('Please enable your webcam.');
  //   } else {
  //     setTooltipMessage('');
  //   }
  // };

  // useEffect(() => {
  //   updateTooltipMessage();
  // }, [isMicrophoneEnabled, isCameraEnabled]);

  return (
    <>
      {/* <WarningDialog
        open={!isCameraEnabled}
        // open={webCamAlert || sessionStorage.getItem('webcam-enable') === 'false'}
        onclosebutton='true'
        // onClose={() => setwebCamAllowAccess(false)}
        title={"WebCam Access Required To Continue"}
        content={"To continue, please enable your WebCam in your browser. If problems persist, close all the tabs and restart the assessment using incognito mode for optimal performance."}
      /> */}

      {loading && (
        <LinearProgress
          variant="indeterminate"
          sx={{
            width: '100%',
            position: 'fixed',
            top: { xs: 50, sm: 63, md: 65 },
            left: 0,
            zIndex: 2,
          }}
        />
      )}

      <Stack component={m.div} {...getVariant('fadeInRight')}>
        <Stack
          component={Card}
          spacing={1}
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
          }}
        >
          <ListItemText
            primary={"Candidate Declaration"}
            primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
            secondaryTypographyProps={{ component: 'span' }}
          />
          <Card>
            <Stack
              direction={'row'}
              spacing={3}
              sx={{
                p: 3,
                pl: 5,
                mt: 1,
                flexWrap: 'wrap',
                '& > *': {
                  flex: '1 1 200px',
                  minWidth: 0,
                  maxWidth: 300,
                },
              }}
            >
              <TextField
                variant={'outlined'}
                label="Legal First Name"
                type='text'
                size='medium'
                name='firstName'
                value={firstName}
                disabled={loading}
                onChange={(e) => setFirstName(e.target.value)}
                error={firstNameError && firstName === ''}
                helperText={firstNameError && firstName === '' ? 'Please enter your first name' : ''}
                sx={{ width: 200 }}
              />
              <TextField
                variant={'outlined'}
                label="Legal Last Name"
                type='text'
                size='medium'
                name='lastName'
                value={lastName}
                disabled={loading}
                onChange={(e) => setLastName(e.target.value)}
                error={lastNameError && lastName === ''}
                helperText={lastNameError && lastName === '' ? 'Please enter your last name' : ''}
                sx={{ width: 200 }}
              />
              {/* Uncomment and use if DatePicker is required */}
              {/* 
                <DatePicker
                  label="Date Of Birth"
                  value={dob}
                  disabled={loading}
                  onChange={(value) => { setDob(value); formatDate(value) }}
                  views={['year', 'month', 'day']}
                  slotProps={{
                    textField: {
                      error: dobError && dob == null,
                      helperText: dobError && dob == null ? 'Please select your date of birth' : ''
                    },
                  }}
                /> 
                */}
            </Stack>

              <Stack
                direction='row'
                sx={{
                  mt: -3,
                  p: 3,
                  pl: 5,
                  mb: 0.5,
                  flexWrap: 'wrap',
                  '& > *': {
                    flex: '1 1 520px',
                    minWidth: 300,
                    maxWidth: 610,
                  },
                  '& > :nth-of-type(1)': {
                    flexBasis: '40%',
                  },
                  '& > :nth-of-type(2)': {
                    flexBasis: '40%',
                  },
                }}
                spacing={5}
              >
                <Card
                  sx={{
                    bgcolor: 'background.bg',
                    minHeight: 360,
                    maxHeight: 360,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ textAlign: 'center', fontSize: 18, fontWeight: 600, mt: 2 }}>
                    National ID
                  </Typography>
                  <Box
                    sx={
                      file
                        ? {
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflow: 'hidden',
                          pt: 1,
                          pr: 2,
                          pl: 2,
                          pb: 5,
                        }
                        : {
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mt: 3,
                        }
                    }
                  >
                    <Upload
                      candidate={true}
                      disabled={loading}
                      file={file}
                      onDrop={handleDropSingleFile}
                      onDelete={() => setFile(null)}
                      helperText={
                        !file && (
                          <Typography
                            variant="caption"
                            sx={{
                              mt: '-2%',
                              mx: 'auto',
                              display: 'block',
                              textAlign: 'center',
                              color: 'text.secondary',
                            }}
                          >
                            Allowed *.jpeg, *.jpg, *.png, <br />
                            File size between 32KB and 4MB <br />
                            Maximum supported resolution 64MPx
                          </Typography>
                        )
                      }
                    />
                  </Box>
                </Card>
                <Camera
                  file={capturedImage}
                  onCapture={handleCapture}
                  onRecapture={handleRecapture}
                  onImageChange={handleImageChange}
                  loading={loading}
                />
              </Stack>
            {/* ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: -3,
                  p: 3,
                  pl: 5,
                  mb: 0.5,
                }}
              >
                <Camera
                  file={capturedImage}
                  onCapture={handleCapture}
                  onRecapture={handleRecapture}
                  onImageChange={handleImageChange}
                  loading={loading}
                />
              </Box>
            )} */}
          </Card>
        </Stack>

        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Tooltip title={tooltipMessage} open={!!tooltipMessage} arrow>
            <span>
              <LoadingButton
                variant='contained'
                color='primary'
                size='medium'
                disabled={!capturedImage}

                // disabled={!isMicrophoneEnabled || !isCameraEnabled || !capturedImage}
                // disabled={!microphoneAllowAccess || webCamAlert === '' || sessionStorage.getItem('webcam-enable') === 'false'}
                sx={{
                  mr: 3.5, // margin-right instead of margin-left
                  width: 100,
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  borderRadius: 0.5,
                  fontWeight: 500,
                }}
                loading={loading}
                onClick={FieldsCheck}
              >
                PROCEED
              </LoadingButton>
            </span>
          </Tooltip>
        </Box>

      </Stack>
    </>
  );
}