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
import MicPermissionModal from './components/MicPermissionModal'; // ✅ modal import

const App = () => {
  const [permissionGranted, setPermissionGranted] = useState(false); // ✅ modal state
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioRef = useRef(null);

const handleMicReady = () => {
  try {
    const audio = new Audio();
    audio.src = birthdaySong;
    audio.preload = "auto";
    audio.load();
    audio.volume = 1.0;
    audioRef.current = audio;

    // Unlock with muted play
    audio.muted = true;
    audio.play().then(() => {
      audio.pause();
      audio.muted = false;

      // Detect if mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // Pre-decode audio ONLY on mobile to reduce latency
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        fetch(birthdaySong)
          .then(res => res.arrayBuffer())
          .then(buffer => ctx.decodeAudioData(buffer))
          .then(() => {
            console.log("✅ Audio pre-decoded on mobile");
            setAudioUnlocked(true);
          })
          .catch(e => {
            console.warn("❌ Audio decode failed:", e);
            setAudioUnlocked(true); // fallback unlock
          });
      } else {
        // Instantly unlock for desktop
        console.log("✅ Audio unlocked on desktop");
        setAudioUnlocked(true);
      }

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

        {/* 🎉 Show title only after mic permission */}
        {permissionGranted && <BirthdayTitle />}

        {/* 🎂 Show cake only after permission */}
        {permissionGranted && <CakeNCandle isBlownOut={isBlownOut} />}

        {/* 🎤 Start mic listening only after permission */}
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
        <p>Blow out the candle by making a loud sound!</p>
      </div>

      {/* 🔒 Show mic permission modal first */}
      {!permissionGranted && (
        <MicPermissionModal onAllow={() => setPermissionGranted(true)} />
      )}
    </>
  );
};

export default App;
