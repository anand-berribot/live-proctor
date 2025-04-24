import React from 'react';
import './LoadingOverlay.css';

const PageReload = async () => {
  window.location.reload();
}


export const WebSocketReconnect = () => {
  return (
    <div className="websocket-reconnect-overlay">
      <div className="websocket-reconnect-loader-container">
        <div className="websocket-reconnect-loader"></div>
        <div className="websocket-reconnect-loading-text">Reconnecting...</div>
        {/* <div className="websocket-reconnect-loading-subtext">Please wait while we reconnect to the server.</div> */}
      </div>
    </div>
  );
};

export const JobPrepOverLoading = () => {
  return (
    <div className="loading-overlay">
      <div className="loader-container">
        <div className="loader"></div>
        <div className="loading-text">Please wait...</div>
      </div>
    </div>
  );
};


export const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="loader-container">
        <div className="loader"></div>
        <div className="loading-text">You are almost there, Do not close the tab</div>
        <div className="loading-text"> Your assessment is being processed.</div>
      </div>
    </div>
  );
};

export const MicrophoneAllowAccess = () => {
  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <h3>Microphone Access Required</h3>
        <p><b>Please grant permission for microphone access in your browser settings. After making the changes, click "Okay" to continue.</b></p>
        <img
          src={require('../../assets/images/microallow.png')}
          alt="Microphone Access"
          style={{ width: '300px', height: '300px' }}
        />
        <div className="modal-buttons">
          <button onClick={PageReload}>Okay</button>
        </div>
      </div>
    </div>
  );
};


export const WebCamAllowAccess = () => {
  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <h3>Webcam Access Required</h3>
        <p><b>Please grant permission for webcam access in your browser settings. After making the changes, click "Okay" to continue.</b></p>
        <img
          src={require('../../assets/images/videoallow.png')} // Update the image source for webcam
          alt="Webcam Access"
          style={{ width: '300px', height: '300px' }}
        />
        <div className="modal-buttons">
          <button onClick={PageReload}>Okay</button>
        </div>
      </div>
    </div>
  );
};



