import React from 'react';
import './styles/MicPermissionModal.css';

const MicPermissionModal = ({ onAllow }) => {
  return (
    <div className="mic-modal-overlay">
      <div className="mic-modal">
        <h2>Hope you'll like this!</h2>
        <p>This experience needs access to your microphone to detect your blow and play music.</p>
        <button className="start-button" onClick={onAllow}>Allow & Start</button>
      </div>
    </div>
  );
};

export default MicPermissionModal;
