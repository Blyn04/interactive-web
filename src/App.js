import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BackgroundAnimation from './components/BackgroundAnimation';
import BirthdayTitle from './components/BirthdayTitle';
import CakeNCandle from './components/CakeNCandle';
import MicDetector from './components/MicDetector';
import { triggerConfetti, endlessConfetti } from './components/Confetti';
import birthdaySong from './assets/hbd.mp3';
import birthdaySongLongLive from './assets/longlive2.mp3';
import EnvelopeCard from './components/EnvelopeCard';
import MicPermissionModal from './components/MicPermissionModal'; 

const App = () => {
  const [permissionGranted, setPermissionGranted] = useState(false); 
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioRef = useRef(null);

  const handleMicReady = () => {
    try {
      const audio = new Audio(birthdaySongLongLive);
      audio.volume = 1.0;
      audioRef.current = audio;

      audio.muted = true;
      audio.play().then(() => {
        audio.pause();
        audio.muted = false;
        setAudioUnlocked(true);
        console.log("✅ Audio unlocked");
      }).catch((e) => {
        console.warn("❌ Audio unlock failed:", e);
      });

    } catch (e) {
      console.warn("❌ Audio creation failed:", e);
    }

    setMicReady(true);
  };

  const blowOutCandle = () => {
    setIsBlownOut(true);
  };

  useEffect(() => {
    if (isBlownOut && micReady && audioUnlocked && audioRef.current) {
      audioRef.current.play().then(() => {
        console.log("🎵 Birthday song playing");

      }).catch((e) => {
        console.warn("❌ Audio still blocked:", e);
      });

      triggerConfetti();
      endlessConfetti();
    }
  }, [isBlownOut, micReady, audioUnlocked]);

  return (
    <>
      <div className="App">
        <BackgroundAnimation />

        {permissionGranted && isBlownOut && <BirthdayTitle />}

        {permissionGranted && <CakeNCandle isBlownOut={isBlownOut} />}

        {!isBlownOut && permissionGranted && (
          <MicDetector
            onBlowOut={blowOutCandle}
            onMicReady={handleMicReady}
          />
        )}

        {isBlownOut && (
          <p className="cake-ready-message">🎂 Cake is ready! 🎂</p>
        )}
      </div>

      {isBlownOut && (
        <div className="floating-envelope">
          <EnvelopeCard />
        </div>
      )}

      <div className="instruction-card">
        <h4>Instruction</h4>
        <p>Blow out the candle by making a big blow!</p>
        <p>Don't forget to open the card.</p>
      </div>

      {!permissionGranted && (
        <MicPermissionModal onAllow={() => setPermissionGranted(true)} />
      )}
    </>
  );
};

export default App;
