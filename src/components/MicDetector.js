// import React, { useEffect } from "react";

// /**
//  * MicDetector
//  * ----------
//  * – Starts listening immediately.
//  * – Calls onMicReady once mic access is granted (used to unlock audio).
//  * – Triggers onBlowOut() once a blow is detected.
//  */
// const MicDetector = ({ onBlowOut, threshold = 0.12, onMicReady }) => {
//   useEffect(() => {
//     let audioCtx = null;
//     let analyser = null;
//     let micSource = null;
//     let rafId = null;

//     const initMic = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//         // ✅ Unlock audio autoplay by playing a muted sound
//         try {
//           const unlock = new Audio();
//           unlock.muted = true;
//           unlock.play().catch(() => {});
//         } catch {}

//         // ✅ Tell parent mic is ready
//         if (onMicReady) onMicReady();

//         // Set up Web Audio API
//         audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//         analyser = audioCtx.createAnalyser();
//         analyser.fftSize = 256;
//         const data = new Uint8Array(analyser.frequencyBinCount);

//         micSource = audioCtx.createMediaStreamSource(stream);
//         micSource.connect(analyser);

//         const tick = () => {
//           analyser.getByteFrequencyData(data);

//           const lowFreqData = data.slice(0, data.length / 4);
//           const avgLow = lowFreqData.reduce((sum, v) => sum + v, 0) / (lowFreqData.length * 255);
//           const maxLow = Math.max(...lowFreqData) / 255;
//           const dynamicRange = maxLow - avgLow;

//           // 🎯 Less strict blow detection (works better on mobile)
//           if (avgLow > threshold && dynamicRange < 0.15) {
//             onBlowOut();
//             cleanup();
//           } else {
//             rafId = requestAnimationFrame(tick);
//           }
//         };

//         rafId = requestAnimationFrame(tick);
//       } catch (err) {
//         console.error("❌ Microphone access denied:", err);
//       }
//     };

//     const cleanup = () => {
//       if (rafId) cancelAnimationFrame(rafId);
//       if (micSource?.mediaStream) micSource.mediaStream.getTracks().forEach((t) => t.stop());
//       if (audioCtx && audioCtx.state !== "closed") audioCtx.close();
//     };

//     initMic();
//     return cleanup;
//   }, [onBlowOut, threshold, onMicReady]);

//   return null;
// };

// export default MicDetector;

// import React, { useEffect } from "react";

// const MicDetector = ({ onBlowOut, threshold = 0.08, onMicReady }) => {
//   useEffect(() => {
//     let audioCtx = null;
//     let analyser = null;
//     let micSource = null;
//     let rafId = null;

//     const initMic = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//         try {
//           const unlock = new Audio();
//           unlock.muted = true;
//           unlock.play().catch(() => {});
//         } catch {}

//         if (onMicReady) onMicReady();

//         audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//         analyser = audioCtx.createAnalyser();
//         analyser.fftSize = 512;
//         const data = new Uint8Array(analyser.frequencyBinCount);

//         micSource = audioCtx.createMediaStreamSource(stream);
//         micSource.connect(analyser);

//         const tick = () => {
//           analyser.getByteFrequencyData(data);

//           // Target only low-mid range (e.g., bins 2–15)
//           const blowBand = data.slice(2, 16);
//           const avg = blowBand.reduce((sum, v) => sum + v, 0) / blowBand.length / 255;
//           const max = Math.max(...blowBand) / 255;
//           const dynamicRange = max - avg;

//           // Blow usually has medium energy, low dynamic range
//           if (avg > threshold && dynamicRange < 0.12) {
//             onBlowOut();
//             cleanup();
//           } else {
//             rafId = requestAnimationFrame(tick);
//           }
//         };

//         rafId = requestAnimationFrame(tick);
//       } catch (err) {
//         console.error("❌ Microphone access denied:", err);
//       }
//     };

//     const cleanup = () => {
//       if (rafId) cancelAnimationFrame(rafId);
//       if (micSource?.mediaStream) micSource.mediaStream.getTracks().forEach((t) => t.stop());
//       if (audioCtx && audioCtx.state !== "closed") audioCtx.close();
//     };

//     initMic();
//     return cleanup;
//   }, [onBlowOut, threshold, onMicReady]);

//   return null;
// };

// export default MicDetector;

import React, { useEffect } from "react";

/**
 * Unified MicDetector
 * – Uses desktop config on desktop.
 * – Uses mobile config on mobile browsers.
 */

const isMobile = () => {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const MicDetector = ({ onBlowOut, onMicReady }) => {
  const threshold = isMobile() ? 0.08 : 0.12;
  const fftSize = isMobile() ? 512 : 256;

  useEffect(() => {
    let audioCtx = null;
    let analyser = null;
    let micSource = null;
    let rafId = null;

    const initMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Unlock autoplay on some devices
        try {
          const unlock = new Audio();
          unlock.muted = true;
          unlock.play().catch(() => {});
        } catch {}

        if (onMicReady) onMicReady();

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = fftSize;
        const data = new Uint8Array(analyser.frequencyBinCount);

        micSource = audioCtx.createMediaStreamSource(stream);
        micSource.connect(analyser);

        const tick = () => {
          analyser.getByteFrequencyData(data);

          if (isMobile()) {
            // 🎯 Mobile: low-mid band focus (bins 2–15), tighter range
            const blowBand = data.slice(2, 16);
            const avg = blowBand.reduce((sum, v) => sum + v, 0) / blowBand.length / 255;
            const max = Math.max(...blowBand) / 255;
            const dynamicRange = max - avg;

            if (avg > threshold && dynamicRange < 0.12) {
              onBlowOut();
              cleanup();
              return;
            }
          } else {
            // 🖥 Desktop: general low frequencies (first 1/4 of bins)
            const lowFreqData = data.slice(0, data.length / 4);
            const avgLow = lowFreqData.reduce((sum, v) => sum + v, 0) / (lowFreqData.length * 255);
            const maxLow = Math.max(...lowFreqData) / 255;
            const dynamicRange = maxLow - avgLow;

            if (avgLow > threshold && dynamicRange < 0.15) {
              onBlowOut();
              cleanup();
              return;
            }
          }

          rafId = requestAnimationFrame(tick);
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
  }, [onBlowOut, onMicReady]);

  return null;
};

export default MicDetector;
