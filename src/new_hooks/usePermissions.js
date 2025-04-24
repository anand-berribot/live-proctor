import { enqueueSnackbar } from "notistack";
import { useState, useEffect, useRef } from "react";
import useMediaRecorder from "src/hooks/useMediaRecorder";

const usePermissions = () => {
  const { connectMicrophone, disconnectMicrophone } = useMediaRecorder();

  const [permissions, setPermissions] = useState({
    camera: "prompt",
    microphone: "prompt",
  });

  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);
  const [videoStream, setVideoStream] = useState(null);

  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  // const isCameraEnabled = useRef(false);
  // const isMicrophoneEnabled = useRef(false);

  const handlePermissionChange = (name, state) => {
    setPermissions((prev) => ({
      ...prev,
      [name]: state,
    }));
    // console.log("Permission changed:", name, state);
    // if (state === "denied") {
    //   showPermissionError(name);
    // }
    if (state === "denied") {
      // showPermissionError(name);
      if (name === "camera") {
        disableCamera();
      } else if (name === "microphone") {
        disableMicrophone();
      }
    } else if (state === "granted") {
      if (name === "camera") {
        restartCamera();
      } else if (name === "microphone") {
        enableMicrophone();
      }
    }
  };

  const checkPermissions = async () => {
    try {
      const cameraPermission = await navigator.permissions.query({ name: "camera" });
      handlePermissionChange("camera", cameraPermission.state);
      cameraPermission.onchange = () => handlePermissionChange("camera", cameraPermission.state);

      const microphonePermission = await navigator.permissions.query({ name: "microphone" });
      handlePermissionChange("microphone", microphonePermission.state);
      microphonePermission.onchange = () => handlePermissionChange("microphone", microphonePermission.state);
    } catch (error) {
      console.error(`Error checking permissions: ${error}`);
    }
  };

  const showPermissionError = (device) => {
    enqueueSnackbar(
      `${device.charAt(0).toUpperCase() + device.slice(1)} access is blocked. Enable it in browser settings.`,
      {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      }
    );
  };
  const restartCamera = async () => {
    console.info(`Restarting webcam after permission grant...`);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      setIsCameraEnabled(true);
      console.info(`Webcam enabled.`);
      sessionStorage.setItem('webcam-enable', true);
    } catch (error) {
      console.error(`Error restarting webcam: ${error}`);
      enqueueSnackbar("Failed to restart Webcam. Please refresh the page.", {
        variant: "error",
      });
    }
  };
  const handleDisruption = (type) => {
    console.error(`${type === 'camera' ? 'webcam' : 'microphone'} stream disrupted! Attempting to reconnect...`);

    if (retryCountRef.current < MAX_RETRIES) {
      retryCountRef.current += 1;

      enqueueSnackbar(`${type === 'camera' ? 'webcam' : 'Microphone'} stream disrupted. Reconnecting... (${retryCountRef.current}/${MAX_RETRIES})`, {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      setTimeout(() => {
        if (type === "camera") {
          enableCamera();
        } else {
          enableMicrophone();
        }
      }, RETRY_DELAY);
    } else {
      enqueueSnackbar(`${type === 'camera' ? 'Webcam' : 'Microphone'} stream failed after multiple retries. Please refresh the page.`, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };
  // const enableCamera = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });      
  //     setIsCameraEnabled(true);
  //     // isCameraEnabled.current = true;
  //     stream.getTracks().forEach((track) => track.stop()); // Stop stream after enabling
  //   } catch (error) {
  //     enqueueSnackbar(
  //       `camera access is blocked. Enable it in browser settings.`,
  //       {
  //         variant: "error",
  //         anchorOrigin: { vertical: "top", horizontal: "right" },
  //       }
  //     );
  //     console.error("Error enabling camera:", error);
  //   }
  // };
  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getVideoTracks().forEach((track) => {
        console.info(`webcam stream is playing.`);
        track.onended = () => {
          console.warn(`webcam stream has stopped.`);
        };
      });
      // stream.getVideoTracks().forEach((track) => {
      //   track.onended = () => handleDisruption("camera");
      // });
      setIsCameraEnabled(true);
      setVideoStream(stream);
      console.info(`Webcam enabled.`);
      sessionStorage.setItem('webcam-enable', true);
    } catch (error) {
      enqueueSnackbar(`Webcam access is blocked. Enable it in browser settings.`, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      console.error(`Error enabling webcam: ${error}`);
    }
  };

  // const disableCamera = () => {
  //   setIsCameraEnabled(false);
  //   // isCameraEnabled.current = false;
  // };
  const disableCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }
    console.warn(`webcam stream has stopped.`);
    setIsCameraEnabled(false);
    setVideoStream(null);
    console.warn(`Webcam disabled.`);
    sessionStorage.setItem('webcam-enable', false);
  };

  const enableMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // stream.getAudioTracks().forEach((track) => {
      //   track.onended = () => handleDisruption("microphone");
      // });
      stream.getAudioTracks().forEach((track) => {
        console.info(`Microphone stream is playing.`);
        track.onended = () => {
          console.warn(`Microphone stream has stopped.`);
        };
      });
      sessionStorage.setItem("MicMute", false);
      setIsMicrophoneEnabled(true);
      console.info(`Microphone enabled. ${stream}`);
      console.log("Microphone enabled.", stream);
      // isMicrophoneEnabled.current = true;
      // stream.getTracks().forEach((track) => track.stop()); // Stop stream after enabling
    } catch (error) {
      console.error(`Error enabling microphone: ${error}`);
      enqueueSnackbar(
        `Microphone access is blocked. Enable it in browser settings.`,
        {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        }
      );
    }
  };
  // const enableMicrophone = async () => {
  //   try {
  //     const devices = await navigator.mediaDevices.enumerateDevices();
  //     const audioInputDevices = devices.filter((device) => device.kind === "audioinput");

  //     if (audioInputDevices.length > 0) {
  //       await connectMicrophone(audioInputDevices[0].deviceId);
  //       setIsMicrophoneEnabled(true);
  //       console.info("Microphone connected successfully.");
  //     } else {
  //       console.warn("No audio input devices found. Trying to capture stream.");
  //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //       setIsMicrophoneEnabled(true);
  //     }
  //   } catch (error) {
  //     // disableMicrophone();
  //     // setMicrophoneEnabled(false);
  //     console.error("Error enabling microphone:", error);
  //     enqueueSnackbar("Microphone access is blocked. Enable it in browser settings.", {
  //       variant: "error",
  //       anchorOrigin: { vertical: "top", horizontal: "right" },
  //     });
  //   }
  // };

  const disableMicrophone = () => {
    sessionStorage.setItem("MicMute", true);
    setIsMicrophoneEnabled(false);
    console.warn(`Microphone disabled.`);
    // isMicrophoneEnabled.current = false;
  };

  // useEffect(() => {
  //   checkPermissions();
  //   if (permissions.camera === "granted") {
  //     enableCamera();
  //   }
  //   if (permissions.microphone === "granted") {
  //     enableMicrophone();
  //   }
  // }, []);

  useEffect(() => {
    checkPermissions();
    if (permissions.camera === "granted") {
      enableCamera();
    }
    if (permissions.microphone === "granted") {
      enableMicrophone();
    }
    // Listen for device connection/disconnection
    // const handleDeviceChange = async () => {
    //   enableMicrophone();
    // console.log("Device change detected! Checking for available devices...");
    // const devices = await navigator.mediaDevices.enumerateDevices();
    // const audioInputDevices = devices.filter(device => device.kind === "audioinput");

    // if (audioInputDevices.length > 0) {
    //   enableMicrophone(); // Reconnect microphone if available
    // } else {
    //   // setIsMicrophoneEnabled(false); // No mic detected
    //   console.warn("No microphone detected! Microphone disabled.");
    // }
    // };

    // navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    // return () => {
    //   navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
    // };
  }, []);


  return {
    permissions,
    isCameraEnabled,
    isMicrophoneEnabled,
    // isCameraEnabled: isCameraEnabled.current,
    // isMicrophoneEnabled: isMicrophoneEnabled.current,
    videoStream,
    enableCamera,
    disableCamera,
    enableMicrophone,
    disableMicrophone,
  };
};

export default usePermissions;
