// src/services/apiService.js

import { enqueueSnackbar } from 'notistack';

export const handleApiResponse = async (response) => {

  if (!response.ok || response.status === 204) {
    console.debug(`No data found or empty response.`);
    return null;
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to parse API response:${error}`);
    return null;
  }
};


export const handleApiError = (error, url) => {

  if (error.response) {
    console.error(`API Error: ${{
      url,
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
    }}`);
  } else if (error.request) {
    console.error(`No response from API:${{
      url,
      message: error.message,
    }}`);
  } else {
    console.error(`Network Error: ${{
      url,
      message: error.message,
    }}`);
  }

  return null;
};


export const fetchWithRetry = async (url, options = {}, retries = 3) => {
  try {
    const response = await fetch(url, options);
    return handleApiResponse(response);
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying... Attempts left: ${retries}`);
      return fetchWithRetry(url, options, retries - 1);
    }
    return handleApiError(error, url);
  }
};