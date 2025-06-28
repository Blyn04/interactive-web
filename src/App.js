import React, { useState, useEffect } from 'react';
import Candle from './components/Candle';
import MicRecorder from './components/MicRecorder';
import MicDetector from "./components/MicDetector";
import './App.css';
import AnimatedBackground from './components/AnimatedBackground';
import BackgroundAnimation from './components/BackgroundAnimation';

const App = () => {
  const [isBlownOut, setIsBlownOut] = useState(false);

  const blowOutCandle = () => {
    setIsBlownOut(true); // This triggers the animation
  };

  useEffect(() => {
    if (isBlownOut) {
      setTimeout(() => {
        alert("Happy Birthday!");
      }, 500);
    }
  }, [isBlownOut]);

  return (
    <div className="App">
      {/* <AnimatedBackground/> */}
      <BackgroundAnimation/>
      <h1>Happy Birthday!</h1>
      <p>Blow out the candle by making a loud sound!</p>
      
      <Candle isBlownOut={isBlownOut} /> {/* Pass isBlownOut to Candle */}
      
      {!isBlownOut && <MicDetector onBlowOut={blowOutCandle} />}
      
      {isBlownOut && <p>🎂 Cake is ready! 🎂</p>}
    </div>
  );
};

export default App;
