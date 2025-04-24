// File: C:\Users\prave\Desktop\berribot\mastermind-v2\berribot_mui\src\new_services\candidateService.js
import { fetchWithRetry } from './apiService';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';

const PROCTOR_API_URL = process.env.VITE_REACT_APP_PROCTOR_API_URL;

export const getCandidate = async (accesskey) => {
  try {
    const url = `${PROCTOR_API_URL}candidate/get_candidate?accesskey_url=${accesskey}`;
    const responseData = await fetchWithRetry(url);

    if (!responseData) {
      enqueueSnackbar('No candidate data found.', { variant: 'error' });
      return 'fail';
    }

    return responseData;
  } catch (error) {
    enqueueSnackbar('Something went wrong. Try again later.', { variant: 'error' });
    return 'fail';
  }
};
export const updateCandidate = async ({
  candidateId,
  file,
  firstName,
  lastName,
  date,
  fileExtension,
  capturedImage,
  setCurrentPage,
  setLoading,
  candidate,
  enqueueSnackbar,
}) => {
  if (file === null && !candidate.Interviews[0].skip_identity_verification) {
    console.error(`CandidateDeclaration: ID proof missing for candidate ID ${candidateId}`);
    enqueueSnackbar("Please upload your ID Proof", {
      variant: 'warning', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
    });
  } else if (capturedImage === null) {
    console.error(`CandidateDeclaration: Selfie not captured for candidate ID ${candidateId}`);
    enqueueSnackbar("Please capture your face", {
      variant: 'warning', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
    });
  }
  else {
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
        setCurrentPage('AUDIO_VIDEO_VERIFICATION');
      } else {
        console.error(`CandidateDeclaration: API returned non-success status for candidate ID ${candidateId}: ${response.data.message}`);
        enqueueSnackbar(response.data.message, {
          variant: 'error', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        // Server responded with a status code outside of 2xx
        console.error(`CandidateDeclaration: Server error for candidate ID ${candidateId} - Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
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
        console.error(`CandidateDeclaration: No response received for candidate ID ${candidateId} - Request: ${error.request}`);
        enqueueSnackbar('No response from server, please try again!', {
          variant: 'error', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      } else {
        // Error setting up the request
        console.error(`CandidateDeclaration: Request setup error for candidate ID ${candidateId} - Message: ${error.message}`);
        enqueueSnackbar('Something went wrong, please try again!', {
          variant: 'error', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      }
    } finally {
      setLoading(false);
    }
  }
};
export const updateCandidate1 = async ({
  userId,
  typeOfIdProof,
  firstName,
  lastName,
  dob,
  idProofImageData,
  idProofFileExtension,
  selfieImageData,
  skipIdentityVerification,
  setCurrentPage,
  setIsLoading,
  enqueueSnackbar, // Add enqueueSnackbar to the params
}) => {
  // Validate inputs
  if (!skipIdentityVerification && !idProofImageData) {
    enqueueSnackbar('Please upload your ID proof.', {
      variant: 'warning',
      autoHideDuration: 3000,
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
    });
    setIsLoading(false);
    return;
  }

  if (!selfieImageData) {
    enqueueSnackbar('Please capture your selfie.', {
      variant: 'warning',
      autoHideDuration: 3000,
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
    });
    setIsLoading(false);
    return;
  }

  try {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('type_of_id_proof', typeOfIdProof);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('dob', dob || null);
    // Append ID proof image data (split to remove base64 prefix)
    formData.append('id_proof_front', idProofImageData ? idProofImageData.split(',')[1] : null);
    formData.append('id_front_file_type', idProofFileExtension || null);
    // Append selfie image data (split to remove base64 prefix)
    formData.append('image_url', selfieImageData.split(',')[1]);

    const response = await axios.post(`${process.env.VITE_REACT_APP_PROCTOR_API_URL}candidate/update_candidate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const resData = response.data;

    if (response.status === 200 && resData.status === 'success') {
      enqueueSnackbar(resData.message, {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      setCurrentPage('AUDIO_VIDEO_VERIFICATION');
    } else {
      enqueueSnackbar(resData.message || 'Submission failed.', {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
  } catch (error) {
    if (error.response && error.response.status === 500) {
      if (!idProofFileExtension || skipIdentityVerification) {
        enqueueSnackbar('Face detection failed. Please try again by taking a live selfie in a well-lit environment.', {
          variant: 'warning',
          autoHideDuration: 3000,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      } else {
        enqueueSnackbar('Please upload a clear, readable image of the front side of the Aadhaar card.', {
          variant: 'warning',
          autoHideDuration: 3000,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      }
    } else {
      enqueueSnackbar('Something went wrong, please try again!', {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
    console.error('Submission error:', error);
  } finally {
    setIsLoading(false);
  }
};

export const saveCandidateVideo = async (candidateId, videoBlob, audioBlob, imageUrl) => {
  try {
    const fileName = `${candidateId}-biometric.webm`;
    const file = new File([videoBlob], fileName, { type: 'video/webm' });
    const audioFile = new File([audioBlob], `${candidateId}-audio.webm`, { type: 'audio/webm' });

    const formData = new FormData();
    formData.append('candidate_id', candidateId);
    formData.append('video_file', file);
    formData.append('audio_file', audioFile);
    formData.append('image_file', imageUrl.split(',')[1]);

    console.info('Initiating video upload', { candidateId, videoSize: videoBlob.size });

    const response = await axios.post(
      `${PROCTOR_API_URL}candidate/candidate_save_video`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    const data = response.data;

    if (response.status === 200 && data.status === 'success') {
      console.info('Video upload successful', {
        candidateId,
        message: data.message
      });
      enqueueSnackbar(data.message, { variant: 'success' });
      return 'success';
    } else {
      console.error('Video upload failed', {
        candidateId,
        status: response.status,
        responseData: data
      });
      enqueueSnackbar(data.message || 'Failed to save video', { variant: 'error' });
      return 'fail';
    }
  } catch (error) {
    console.error('Video upload error:', {
      error: error.message,
      candidateId,
      response: error.response?.data
    });
    enqueueSnackbar('Failed to upload video. Please try again.', { variant: 'error' });
    return 'fail';
  }
};


export const updateJoinTime = async (sessionId) => {
  try {
    const formData = new FormData();
    formData.append('user_type', 'candidate');
    formData.append('session_id', sessionId);
    formData.append('join_time', true);

    const response = await axios.post(`${PROCTOR_API_URL}humanless/update_join_exit_time`, formData);

    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to update join time');
    }

    console.log('Join time updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating join time: ${error.message}`);
    return null;
  }
};