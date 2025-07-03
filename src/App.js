import React, { useState, useEffect } from 'react';
import './App.css';
import BackgroundAnimation from './components/BackgroundAnimation';
import BirthdayTitle from './components/BirthdayTitle';
import CakeNCandle from './components/CakeNCandle';
import MicDetector from './components/MicDetector';
import { triggerConfetti, endlessConfetti } from './components/Confetti';
import birthdaySong from './assets/hbd.mp3';
import BirthdayCard from './components/BirthdayCard'; // 🎈 New Import
import EnvelopeCard from './components/EnvelopeCard';

const App = () => {
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [micReady, setMicReady] = useState(false);

  const blowOutCandle = () => {
    setIsBlownOut(true);
  };

  useEffect(() => {
    if (isBlownOut && micReady) {
      const audio = new Audio(birthdaySong);
      audio.volume = 1.0;

      audio.play().then(() => {
        console.log("🎵 Birthday song playing");
      }).catch((e) => {
        console.warn("❌ Still blocked:", e);
      });

      triggerConfetti();
      endlessConfetti();

      setTimeout(() => {
        alert("Happy Birthday!");
      }, 500);
    }
  }, [isBlownOut, micReady]);

  return (
    <>
      <div className="App">
        <BackgroundAnimation />
        <BirthdayTitle />
        <CakeNCandle isBlownOut={isBlownOut} />

        {!isBlownOut && (
          <MicDetector
            onBlowOut={blowOutCandle}
            onMicReady={() => setMicReady(true)}
          />
        )}

        {isBlownOut && (
          <p className="cake-ready-message">🎂 Cake is ready! 🎂</p>
        )}
      </div>

      {/* Floating envelope rendered above other elements */}
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
