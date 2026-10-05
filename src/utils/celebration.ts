import confetti from 'canvas-confetti';

// PAK-HOMECEO Brand Colors for Confetti (Forest Green, Ochre Gold, Terracotta, Emerald, Ivory, Coral)
const PAK_PALETTE = ['#01411C', '#86EFAC', '#D9822B', '#C05638', '#2B6CB0', '#F59E0B', '#FAF9F6'];

/**
 * 1. Celebration when moving from Welcome to Login / Landing celebration
 */
export const triggerWelcomeToLoginCelebration = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: PAK_PALETTE,
      ticks: 200,
      gravity: 1.1,
      scalar: 1,
    });
  } catch {
    // Graceful fallback
  }
};

/**
 * 2. Celebration when selecting Citizen, Business Builder, Skill Partner, or Community Connector
 */
export const triggerRoleSelectCelebration = (role?: string) => {
  try {
    let colors = PAK_PALETTE;
    if (role === 'builder') colors = ['#2B6CB0', '#60A5FA', '#01411C', '#86EFAC'];
    else if (role === 'partner') colors = ['#C05638', '#F87171', '#D9822B', '#FDE047'];
    else if (role === 'connector') colors = ['#01411C', '#86EFAC', '#34D399', '#10B981'];
    else colors = ['#D9822B', '#F59E0B', '#01411C', '#86EFAC']; // Citizen / default

    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
  } catch {
    // Graceful fallback
  }
};

/**
 * 3. Celebration when a Citizen places an order or submits an order brief
 */
export const triggerOrderPlacedCelebration = () => {
  try {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: PAK_PALETTE,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } catch {
    // Graceful fallback
  }
};

/**
 * 4. Celebration when an order or batch process is completed / delivered / paid out
 */
export const triggerProcessCompleteCelebration = () => {
  try {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999, colors: PAK_PALETTE };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  } catch {
    // Graceful fallback
  }
};
