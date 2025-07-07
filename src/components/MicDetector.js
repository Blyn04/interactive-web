import React, { useEffect } from "react";

/**
 * MicDetector
 * ----------
 * – Starts listening immediately.
 * – Calls onMicReady once mic access is granted (used to unlock audio).
 * – Triggers onBlowOut() once a blow is detected.
 */
const MicDetector = ({ onBlowOut, threshold = 0.12, onMicReady }) => {
  useEffect(() => {
    let audioCtx = null;
    let analyser = null;
    let micSource = null;
    let rafId = null;

    const initMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // ✅ Unlock audio autoplay by playing a muted sound
        try {
          const unlock = new Audio();
          unlock.muted = true;
          unlock.play().catch(() => {});
        } catch {}

        // ✅ Tell parent mic is ready
        if (onMicReady) onMicReady();

        // Set up Web Audio API
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const data = new Uint8Array(analyser.frequencyBinCount);

        micSource = audioCtx.createMediaStreamSource(stream);
        micSource.connect(analyser);

        const tick = () => {
          analyser.getByteFrequencyData(data);

          const lowFreqData = data.slice(0, data.length / 4);
          const avgLow = lowFreqData.reduce((sum, v) => sum + v, 0) / (lowFreqData.length * 255);
          const maxLow = Math.max(...lowFreqData) / 255;
          const dynamicRange = maxLow - avgLow;

          // 🎯 Less strict blow detection (works better on mobile)
          if (avgLow > threshold && dynamicRange < 0.15) {
            onBlowOut();
            cleanup();
          } else {
            rafId = requestAnimationFrame(tick);
          }
        };

        rafId = requestAnimationFrame(tick);
      } catch (err) {
        console.error("❌ Microphone access denied:", err);
      }
    };

    const cleanup = () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (micSource?.mediaStream) micSource.mediaStream.getTracks().forEach((t) => t.stop());
      if (audioCtx && audioCtx.state !== "closed") audioCtx.close();
    };

    initMic();
    return cleanup;
  }, [onBlowOut, threshold, onMicReady]);

  return null;
};

export default MicDetector;
