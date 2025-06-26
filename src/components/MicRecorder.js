import React, { useState, useEffect } from 'react';
import MicRecorderLib from 'mic-recorder-to-mp3'; // Renamed import

const MicRecorder = ({ onBlowOut }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    // Create a new recorder instance using the renamed import
    const newRecorder = new MicRecorderLib({ bitRate: 128 });
    setRecorder(newRecorder);
  }, []);

  // Start recording
  const startRecording = () => {
    if (recorder) {
      recorder.start().then(() => {
        setIsRecording(true);
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (recorder) {
      recorder.stop().getMp3().then(([buffer, blob]) => {
        // Estimate the sound level based on the length of the buffer
        const soundLevel = buffer.length; // Check the length of the MP3 buffer

        // Adjust the threshold value (5000 in this case) to match your sound detection needs
        if (soundLevel > 5000) {
          onBlowOut(); // Trigger the blow-out action if sound level is high enough
        }

        setIsRecording(false);
      });
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
    </div>
  );
};

export default MicRecorder;
