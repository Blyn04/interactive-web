import confetti from 'canvas-confetti';

const themeColors = ['#FFD43B', '#FFE566', '#66BB6A', '#A8E063', '#FFF3B0'];

export const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: themeColors,
  });
};

export const endlessConfetti = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: themeColors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: themeColors,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  })();
};
