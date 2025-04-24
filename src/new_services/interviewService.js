import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { fetchWithRetry } from './apiService';

const MASTERMIND_API_URL = process.env.VITE_REACT_APP_API_URL;
const PROCTOR_API_URL = process.env.VITE_REACT_APP_PROCTOR_API_URL;

// Centralized axios instance
const apiClient = axios.create({
  baseURL: MASTERMIND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Centralized error handler
const handleError = (error, defaultMessage) => {
  console.error(`[API Error]: ${defaultMessage}`, error);
  const message = error.response?.data?.message || defaultMessage;
  enqueueSnackbar(message, { variant: 'error' });
  throw error;
};

// Fetch interview data
export const getInterviewData = async (candidate) => {
  try {
    const interviewId = candidate.Interviews[0].id;
    const candidateId = candidate.Interviews[0].candidate_id;

    const url = `${MASTERMIND_API_URL}interview_data/?interview_id=${interviewId}&candidate_id=${candidateId}`;
    const response = await axios.get(url);

    if (!response.data) {
      console.debug('No interview data found.');
      return null;
    }

    return response.data.data;
  } catch (error) {
    console.error(`Error fetching interview data: ${error}`);
    throw error;
  }
};



export const restBotConnection = async (candidate, resumeExtractedText = '') => {
  try {
    const { 
      candidate_id, 
      id, 
      job_role, 
      interview_type, 
      question_bank, 
      created_by, 
      api_key_id, 
      mas_resume_text, 
      mas_conversation_history, 
      is_coding_question, 
      mas_interview_status, 
      question_level, 
      coding_level 
    } = candidate.Interviews[0];

    const finalResumeText = resumeExtractedText || mas_resume_text;

    const send_candidate_data = {
      platform: "web",
      candidate_id,
      interview_id: id,
      skill: job_role,
      is_proctor: interview_type === 'Proctor_Humanless',
      is_humanless: false,
      is_question_bank: question_bank,
      is_coding_question,
      resumeExtractedText: finalResumeText,
      created_by_id: created_by,
      mas_interview_status,
      mas_resume_text,
      mas_conversation_history,
      final_transcript: '',
      question_level,
      coding_level,
    };

    const requestData = new FormData();
    requestData.append('json_text', JSON.stringify(send_candidate_data));
    requestData.append('speech_to_text_model', 'JS_PACKAGE');
    requestData.append('key_id', api_key_id);
    requestData.append('is_playai', false);

    const response = await axios.post(`${MASTERMIND_API_URL}questions_generation`, requestData);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error in restBotConnection: ${error}`);
    throw error;
  }
};




// Retrieve candidate sub-topic data
export const retrieveCandidateSubTopicData = async (candidateId, interviewId, jdId) => {
  try {
    if (!candidateId || !interviewId || !jdId) {
      throw new Error('Missing required parameters for sub-topic data.');
    }

    const apiUrl = `${MASTERMIND_API_URL}sub_topics_check/${interviewId}/${candidateId}/${jdId}`;
    const response = await apiClient.get(apiUrl);

    if (!response.data.sub_topics_check && !response.data.multiple_skill_check) {
      console.debug('No sub-topics or multiple skill check data found.');
      return null;
    }

    return response.data;
  } catch (error) {
    return handleError(error, 'Error fetching sub-topics data');
  }
};

// Upload resume
export const uploadResume = async (newFile, candidateData) => {
  console.info(`Uploading resume for candidate ID: ${candidateData.Interviews[0].candidate_id}`);
  
  const resumeFormData = new FormData();
  const fileFormData = new FormData();
  resumeFormData.append('candidate_id', candidateData.Interviews[0].candidate_id);
  resumeFormData.append('resumeFile', newFile);
  fileFormData.append('resume', newFile);

  try {
    console.debug(`Sending resume to proctor API`);
    const uploadResponse = await axios.post(
      `${PROCTOR_API_URL}humanless/resumeupload/candidate/${candidateData.Interviews[0].candidate_id}/session/${candidateData.Interviews[0].id}`,
      fileFormData
    );
    console.debug(`Resume upload response: ${JSON.stringify(uploadResponse.data)}`);

    console.debug(`Extracting text from resume via mastermind API`);

    const textResponse = await axios.post(
      `${MASTERMIND_API_URL}resume_to_text`,
      resumeFormData
    );

    const textData = textResponse.data;

    if (textResponse.status === 200) {
      console.info(`Resume text extracted: ${textData.extracted_text}`);
      enqueueSnackbar(textData?.message || 'Resume uploaded successfully', {
        variant: 'success',
        autoHideDuration: 2000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      return true;
    } else {
      throw new Error(textData?.message || 'Error processing resume');
    }
  } catch (error) {
    return handleError(error, 'Failed to upload resume');
  }
};

// Agent bot response API
export const AgentBotResponse = async (message, interviewId, candidateId, attempt = 1) => {
  if (!interviewId || !candidateId) {
    throw new Error(`Missing InterviewId or CandidateId | InterviewId: ${interviewId}, CandidateId: ${candidateId}`);
  }

  const formData = new FormData();
  formData.append('candidate_id', candidateId);
  formData.append('interview_id', interviewId);
  formData.append('userinput', message);
  formData.append('is_playai', 'false');

  console.debug(`[AgentBotResponse] Attempt ${attempt} | Sending message: "${message}"`);

  try {
    const response = await axios.post(`${MASTERMIND_API_URL}get_response`, formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
      },
    });

    if (!response?.data) {
      throw new Error('No response data received from server');
    }

    // Validate audio data
    const audio = response.data.audio && /^[A-Za-z0-9+/=]+$/.test(response.data.audio) ? response.data.audio : null;
    console.debug(`[AgentBotResponse] Response received | InterviewId: ${interviewId} | CandidateId: ${candidateId}`);
    console.debug('> Transcript:', response.data.text);

    return {
      audio,
      text: response.data.text || '',
      code_template : response.data.code_template || null,
    };
  } catch (error) {
    return handleError(error, `AgentBotResponse failed on attempt ${attempt}`);
  }
};

// Save coding question
export const saveCodingQuestion = async (interviewId, question, answer, description = '') => {
  try {
    const response = await apiClient.post(`/add_coding_question/${interviewId}`, {
      question,
      answer,
      description,
    });
    console.debug('Coding question saved:', response.data.message);
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to save coding question');
  }
};

// Compile code
export const compileCode = async (candidateId, interviewId, code) => {
  try {
    const formData = new FormData();
    formData.append('candidate_id', candidateId);
    formData.append('interview_id', interviewId);
    formData.append('code', code);

    const response = await apiClient.post('/compile_code_editor', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.result || 'No feedback provided';
  } catch (error) {
    return handleError(error, 'Failed to compile code');
  }
};