// import React, { useEffect } from "react";

// /**
//  * MicDetector
//  * ----------
//  * – Starts listening immediately.
//  * – Computes the current average volume 60× per second.
//  * – If the volume exceeds `threshold` (default ≈ 20% of max),
//  *   triggers onBlowOut() exactly once.
//  */
// const MicDetector = ({ onBlowOut, threshold = 0.2 }) => {
//   useEffect(() => {
//     let audioCtx = null;
//     let analyser = null;
//     let micSource = null;
//     let rafId = null;

//     const initMic = async () => {
//       try {
//         // Ask for mic access
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//         // Create Web Audio graph
//         audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//         analyser = audioCtx.createAnalyser();
//         analyser.fftSize = 256; // small FFT for faster updates
//         const data = new Uint8Array(analyser.frequencyBinCount);

//         micSource = audioCtx.createMediaStreamSource(stream);
//         micSource.connect(analyser);

//         // Continuous volume check
//         const tick = () => {
//         analyser.getByteFrequencyData(data);

//         const lowFreqData = data.slice(0, data.length / 4); // focus on low freqs
//         const avgLow = lowFreqData.reduce((sum, v) => sum + v, 0) / (lowFreqData.length * 255);

//         const maxLow = Math.max(...lowFreqData) / 255;
//         const dynamicRange = maxLow - avgLow;

//             // Blow-like: loud + flat spectrum = small dynamic range
//             if (avgLow > threshold && dynamicRange < 0.1) {
//                 onBlowOut(); // 🎉 Detected blowing!
//                 cleanup();
//             } else {
//                 rafId = requestAnimationFrame(tick);
//             }
//         };

//         rafId = requestAnimationFrame(tick);
//       } catch (err) {
//         console.error("Microphone access denied:", err);
//       }
//     };

//     const cleanup = () => {
//       if (rafId !== null) {
//         cancelAnimationFrame(rafId);
//         rafId = null;
//       }

//       if (micSource?.mediaStream) {
//         micSource.mediaStream.getTracks().forEach((t) => t.stop());
//         micSource = null;
//       }

//       if (audioCtx && audioCtx.state !== "closed") {
//         audioCtx.close();
//       }

//       audioCtx = null;
//     };

//     initMic();

//     return cleanup;
//   }, [onBlowOut, threshold]);

//   return null; // No UI
// };

// export default MicDetector;


import React, { useEffect } from "react";

/**
 * MicDetector
 * ----------
 * – Starts listening immediately.
 * – Calls onMicReady once mic access is granted.
 * – Triggers onBlowOut() once a blow is detected.
 */
const MicDetector = ({ onBlowOut, threshold = 0.2, onMicReady }) => {
  useEffect(() => {
    let audioCtx = null;
    let analyser = null;
    let micSource = null;
    let rafId = null;

    const initMic = async () => {
      try {
        // Ask for mic access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // ✅ Tell parent mic is ready (to unlock audio)
        if (onMicReady) onMicReady();

        // Set up Web Audio API
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const data = new Uint8Array(analyser.frequencyBinCount);

        micSource = audioCtx.createMediaStreamSource(stream);
        micSource.connect(analyser);

        // Start detecting
        const tick = () => {
          analyser.getByteFrequencyData(data);

          const lowFreqData = data.slice(0, data.length / 4);
          const avgLow = lowFreqData.reduce((sum, v) => sum + v, 0) / (lowFreqData.length * 255);
          const maxLow = Math.max(...lowFreqData) / 255;
          const dynamicRange = maxLow - avgLow;

          if (avgLow > threshold && dynamicRange < 0.1) {
            onBlowOut();
            cleanup();
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
