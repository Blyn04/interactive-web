import { useEffect } from "react";

const MicDetector = ({ onBlowOut, onMicReady }) => {
  useEffect(() => {
    let audioCtx = null;
    let analyser = null;
    let micSource = null;
    let rafId = null;
    let blowFrames = 0;

    const initMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        try {
          const unlock = new Audio();
          unlock.muted = true;
          unlock.play().catch(() => {});
        } catch {}

        if (onMicReady) onMicReady();

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.3;

        const freqData = new Uint8Array(analyser.frequencyBinCount);
        const timeData = new Uint8Array(analyser.fftSize);

        micSource = audioCtx.createMediaStreamSource(stream);
        micSource.connect(analyser);

        const tick = () => {
          analyser.getByteTimeDomainData(timeData);

          let sumSquares = 0;
          for (let i = 0; i < timeData.length; i++) {
            const sample = (timeData[i] - 128) / 128;
            sumSquares += sample * sample;
          }
          const rms = Math.sqrt(sumSquares / timeData.length);

          analyser.getByteFrequencyData(freqData);
          const blowBand = freqData.slice(1, 20);
          const avgFreq =
            blowBand.reduce((sum, v) => sum + v, 0) / blowBand.length / 255;

          const isBlowing = rms > 0.045 || avgFreq > 0.05;

          if (isBlowing) {
            blowFrames++;
            if (blowFrames >= 2) {
              onBlowOut();
              cleanup();
              return;
            }
          } else {
            blowFrames = 0;
          }

          rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
      } catch (err) {
        console.error("❌ Microphone access denied:", err);
        if (onMicReady) onMicReady();
      }
    };

    const cleanup = () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (micSource?.mediaStream) {
        micSource.mediaStream.getTracks().forEach((t) => t.stop());
      }
      if (audioCtx && audioCtx.state !== "closed") audioCtx.close();
    };

    initMic();
    return cleanup;
  }, [onBlowOut, onMicReady]);

  return null;
};

export default MicDetector;
