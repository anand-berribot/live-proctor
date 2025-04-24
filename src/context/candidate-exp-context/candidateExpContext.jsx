import { createContext, useContext, useEffect, useState } from 'react';
// import { DetectHeadset } from 'src/pages/candidate/common/detectDevice';

export const CandidateExpContext = createContext();

export const CandidateExpProvider = ({ children }) => {
    const [showReportBtn, setShowReportBtn] = useState(true);
    const [isReported, setIsReported] = useState(false);
    const [clientLogo, setClientLogo] = useState(null);
    const [isHeadsetConnected, setIsHeadsetConnected] = useState(false);
    const [isNetworkSpeedDetected, setNetworkSpeedDetected] = useState(false);

    // useEffect(() => {
    //     const checkHeadset = async () => {
    //         const result = await DetectHeadset();
    //         setIsHeadsetConnected(result);
    //     };
    //     // Initial check on mount
    //     checkHeadset();

    //     // Listen for device connection/disconnection
    //     navigator.mediaDevices.addEventListener("devicechange", checkHeadset);

    //     // Cleanup event listener on unmount
    //     return () => {
    //         navigator.mediaDevices.removeEventListener("devicechange", checkHeadset);
    //     };
    // }, []);

    return (
        <CandidateExpContext.Provider value={{
            showReportBtn,
            setShowReportBtn,
            isReported,
            setIsReported,
            clientLogo,
            setClientLogo,
            isHeadsetConnected,
            isNetworkSpeedDetected,
            setNetworkSpeedDetected
        }}>
            {children}
        </CandidateExpContext.Provider>
    );
};

export const useCandidateExpContext = () => useContext(CandidateExpContext);