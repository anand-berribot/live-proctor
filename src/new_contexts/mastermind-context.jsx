import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import useNetworkSpeedTest from 'src/new_hooks/useNetworkSpeed';
import { getBrowserAndOS } from 'src/pages/proctor/browserUtils';
const MastermindContext = createContext();

export const MastermindProvider = ({ children }) => {
  const [errorType, setErrorType] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [currentPage, setCurrentPage] = useState('HINTS');
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const { browser, os } = getBrowserAndOS();
  const { networkSpeed, networkStatus } = useNetworkSpeedTest();

  const value = useMemo(() => ({
    errorType,
    setErrorType,
    currentPage,
    setCurrentPage,
    candidateData,
    setCandidateData,
    showAlert,
    setShowAlert,
    alertMessage,
    setAlertMessage,
    alertTitle,
    setAlertTitle,
    loading,
    setLoading,
    browser,
    os,
    networkSpeed,
    networkStatus,
  }), [
    errorType,
    currentPage,
    candidateData,
    showAlert,
    alertMessage,
    alertTitle,
    loading,
    browser,
    os,
  ]);

  return (
    <MastermindContext.Provider value={value}>
      {children}
    </MastermindContext.Provider>
  );
};

export const useMastermind = () => {
  const context = useContext(MastermindContext);
  console.log("MastermindContext:", context);
  if (!context) {
    throw new Error('useMastermind must be used within a MastermindProvider');
  }
  return context;
};
