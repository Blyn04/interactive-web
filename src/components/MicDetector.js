import React, { useEffect } from "react";

/**
 * MicDetector
 * ----------
 * – Starts listening immediately.
 * – Computes the current average volume 60× per second.
 * – If the volume exceeds `threshold` (default ≈ 20% of max),
 *   triggers onBlowOut() exactly once.
 */
const MicDetector = ({ onBlowOut, threshold = 0.2 }) => {
  useEffect(() => {
    let audioCtx = null;
    let analyser = null;
    let micSource = null;
    let rafId = null;

    const initMic = async () => {
      try {
        // Ask for mic access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Create Web Audio graph
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256; // small FFT for faster updates
        const data = new Uint8Array(analyser.frequencyBinCount);

        micSource = audioCtx.createMediaStreamSource(stream);
        micSource.connect(analyser);

        // Continuous volume check
        const tick = () => {
          analyser.getByteFrequencyData(data);

          // Compute average (0–255) → normalize to 0–1
          const avg = data.reduce((sum, v) => sum + v, 0) / (data.length * 255);

          if (avg > threshold) {
            onBlowOut(); // 🎉 Candle out!
            cleanup();   // stop further checks
          } else {
            rafId = requestAnimationFrame(tick);
          }
        };

        rafId = requestAnimationFrame(tick);
      } catch (err) {
        console.error("Microphone access denied:", err);
      }
    };

    const cleanup = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      if (micSource?.mediaStream) {
        micSource.mediaStream.getTracks().forEach((t) => t.stop());
        micSource = null;
      }

      if (audioCtx && audioCtx.state !== "closed") {
        audioCtx.close();
      }

      audioCtx = null;
    };

    initMic();

    return cleanup;
  }, [onBlowOut, threshold]);

  return null; // No UI
};

export default MicDetector;
