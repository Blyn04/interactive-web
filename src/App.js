import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BackgroundAnimation from './components/BackgroundAnimation';
import BirthdayTitle from './components/BirthdayTitle';
import CakeNCandle from './components/CakeNCandle';
import MicDetector from './components/MicDetector';
import { triggerConfetti, endlessConfetti } from './components/Confetti';
import birthdaySong from './assets/hbd.mp3';
import BirthdayCard from './components/BirthdayCard';
import EnvelopeCard from './components/EnvelopeCard';

const App = () => {
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioRef = useRef(null);

  // Unlock audio once mic is ready
  const handleMicReady = () => {
    try {
      const audio = new Audio(birthdaySong);
      audio.volume = 1.0;
      audioRef.current = audio;

      // Attempt to "unlock" it with a muted play
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

      setTimeout(() => {
        alert("Happy Birthday!");
      }, 500);
    }
  }, [isBlownOut, micReady, audioUnlocked]);

  return (
    <>
      <div className="App">
        <BackgroundAnimation />
        <BirthdayTitle />
        <CakeNCandle isBlownOut={isBlownOut} />

        {!isBlownOut && (
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
        <p>Blow out the candle by making a loud sound!</p>
      </div>
    </>
  );
};

export default App;
