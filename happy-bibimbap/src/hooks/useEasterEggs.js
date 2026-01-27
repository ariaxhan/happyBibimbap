import { useEffect, useCallback, useState, useRef } from 'react';

/**
 * Easter Eggs Hook for Happy Bibimbap
 *
 * Contains multiple delightful surprises:
 * 1. Konami Code - Special bibimbap celebration
 * 2. Logo Click (5x) - Spinning bowl surprise
 * 3. Type "bibimbap" - Confetti explosion
 * 4. Console secret message
 * 5. Shift + Hover on title - Secret message
 */

// Konami Code sequence
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

// Secret word to trigger confetti
const SECRET_WORD = 'bibimbap';

// Bibimbap emoji ingredients for confetti
const BIBIMBAP_EMOJIS = ['🍚', '🥕', '🥒', '🥬', '🍳', '🌶️', '🥩', '✨', '💖', '🎉'];

// Create confetti particles
const createConfetti = () => {
  const container = document.createElement('div');
  container.className = 'easter-egg-confetti-container';
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  `;

  // Create 50 confetti particles
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    const emoji = BIBIMBAP_EMOJIS[Math.floor(Math.random() * BIBIMBAP_EMOJIS.length)];
    particle.textContent = emoji;
    particle.style.cssText = `
      position: absolute;
      font-size: ${20 + Math.random() * 20}px;
      left: ${Math.random() * 100}%;
      top: -50px;
      animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    container.appendChild(particle);
  }

  document.body.appendChild(container);

  // Clean up after animation
  setTimeout(() => {
    container.remove();
  }, 6000);
};

// Create Konami celebration
const createKonamiCelebration = () => {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'easter-egg-konami-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;

  // Create message container
  const message = document.createElement('div');
  message.innerHTML = `
    <div style="text-align: center; color: white; font-family: sans-serif;">
      <div style="font-size: 100px; animation: bounce 0.5s ease infinite alternate;">🍲</div>
      <h1 style="font-size: 2.5rem; color: #f1823c; margin: 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
        Achievement Unlocked!
      </h1>
      <p style="font-size: 1.3rem; color: #d74d8b; margin: 10px 0;">
        You discovered the secret Konami Bibimbap!
      </p>
      <p style="font-size: 1rem; color: #fff; opacity: 0.8; margin-top: 20px;">
        Click anywhere to continue...
      </p>
      <div style="margin-top: 30px; font-size: 2rem;">
        ${BIBIMBAP_EMOJIS.join(' ')}
      </div>
    </div>
  `;

  overlay.appendChild(message);
  document.body.appendChild(overlay);

  // Create lots of confetti
  createConfetti();

  // Remove on click
  overlay.addEventListener('click', () => {
    overlay.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => overlay.remove(), 300);
  });

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => overlay.remove(), 300);
    }
  }, 10000);
};

// Create spinning bowl animation
const createSpinningBowlSurprise = (element) => {
  // Create floating message
  const message = document.createElement('div');
  message.className = 'easter-egg-spin-message';
  message.innerHTML = `
    <span style="font-size: 1.2rem; color: #d74d8b; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">
      Mix it up!
    </span>
  `;
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.95);
    padding: 20px 40px;
    border-radius: 30px;
    box-shadow: 0 4px 20px rgba(215, 77, 139, 0.4);
    z-index: 9999;
    animation: popIn 0.3s ease;
  `;

  document.body.appendChild(message);

  // Apply spinning animation to element
  if (element) {
    element.style.animation = 'spinBowl 1s ease-in-out';
    element.addEventListener('animationend', () => {
      element.style.animation = '';
    }, { once: true });
  }

  // Remove message
  setTimeout(() => {
    message.style.animation = 'popOut 0.3s ease forwards';
    setTimeout(() => message.remove(), 300);
  }, 2000);

  // Small confetti burst
  createConfetti();
};

// Console secret message (call once on mount)
const logConsoleSecret = () => {
  console.log('%c Welcome to Happy Bibimbap! ',
    'background: linear-gradient(135deg, #d74d8b, #f1823c); color: white; font-size: 20px; padding: 10px 20px; border-radius: 10px;'
  );
  console.log('%c Secret: Try the Konami Code!',
    'color: #d74d8b; font-size: 14px; font-style: italic;'
  );
  console.log('%c (Up, Up, Down, Down, Left, Right, Left, Right, B, A)',
    'color: #666; font-size: 12px;'
  );
};

/**
 * Main Easter Eggs Hook
 */
export function useEasterEggs() {
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [typedChars, setTypedChars] = useState('');
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);

  // Console message on mount + special date check
  useEffect(() => {
    logConsoleSecret();

    // Check for special dates
    const today = new Date();
    const month = today.getMonth() + 1; // 0-indexed
    const day = today.getDate();

    // December 31st - Korean Bibimbap Day / New Year's Eve
    if (month === 12 && day === 31) {
      setTimeout(() => {
        const banner = document.createElement('div');
        banner.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #d74d8b, #f1823c);
            color: white;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 1rem;
            font-weight: bold;
            z-index: 9999;
            animation: slideDown 0.5s ease;
            box-shadow: 0 4px 20px rgba(215, 77, 139, 0.5);
            text-align: center;
          ">
            Happy Bibimbap Day & New Year's Eve! May your year be full of delicious moments!
          </div>
        `;
        document.body.appendChild(banner);
        createConfetti();

        setTimeout(() => {
          banner.style.animation = 'fadeOut 0.5s ease forwards';
          setTimeout(() => banner.remove(), 500);
        }, 8000);
      }, 2000);
    }

    // January 1st - New Year
    if (month === 1 && day === 1) {
      setTimeout(() => {
        const banner = document.createElement('div');
        banner.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FFD700, #f1823c);
            color: white;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 1rem;
            font-weight: bold;
            z-index: 9999;
            animation: slideDown 0.5s ease;
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
            text-align: center;
          ">
            Happy New Year from Happy Bibimbap! Wishing you delicious adventures!
          </div>
        `;
        document.body.appendChild(banner);
        createConfetti();

        setTimeout(() => {
          banner.style.animation = 'fadeOut 0.5s ease forwards';
          setTimeout(() => banner.remove(), 500);
        }, 8000);
      }, 2000);
    }

    // Korean Thanksgiving (Chuseok) - Usually in September/October
    // Using September 15 as approximate mid-autumn date
    if (month === 9 && day >= 14 && day <= 17) {
      setTimeout(() => {
        const banner = document.createElement('div');
        banner.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #8B4513, #DAA520);
            color: white;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 1rem;
            font-weight: bold;
            z-index: 9999;
            animation: slideDown 0.5s ease;
            box-shadow: 0 4px 20px rgba(139, 69, 19, 0.5);
            text-align: center;
          ">
            Happy Chuseok! Enjoy this harvest season with your loved ones!
          </div>
        `;
        document.body.appendChild(banner);

        setTimeout(() => {
          banner.style.animation = 'fadeOut 0.5s ease forwards';
          setTimeout(() => banner.remove(), 500);
        }, 8000);
      }, 2000);
    }
  }, []);

  // Konami Code listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if current key matches expected Konami key
      if (e.code === KONAMI_CODE[konamiIndex]) {
        const newIndex = konamiIndex + 1;
        setKonamiIndex(newIndex);

        // Completed the code!
        if (newIndex === KONAMI_CODE.length) {
          createKonamiCelebration();
          setKonamiIndex(0);
        }
      } else {
        // Reset if wrong key
        setKonamiIndex(e.code === KONAMI_CODE[0] ? 1 : 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);

  // Secret word typing listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if typing in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const char = e.key.toLowerCase();
      if (char.length === 1 && char.match(/[a-z]/)) {
        const newTyped = (typedChars + char).slice(-SECRET_WORD.length);
        setTypedChars(newTyped);

        if (newTyped === SECRET_WORD) {
          createConfetti();
          setTypedChars('');

          // Show toast message
          const toast = document.createElement('div');
          toast.textContent = 'You found a secret!';
          toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #d74d8b, #f1823c);
            color: white;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: bold;
            z-index: 9999;
            animation: slideUp 0.3s ease;
            box-shadow: 0 4px 15px rgba(215, 77, 139, 0.4);
          `;
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
          }, 2000);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [typedChars]);

  // Logo click handler (5 clicks = surprise)
  const handleLogoClick = useCallback((element) => {
    logoClickCount.current += 1;

    // Clear previous timer
    if (logoClickTimer.current) {
      clearTimeout(logoClickTimer.current);
    }

    // Check if 5 clicks reached
    if (logoClickCount.current >= 5) {
      createSpinningBowlSurprise(element);
      logoClickCount.current = 0;
    } else {
      // Reset after 2 seconds of no clicks
      logoClickTimer.current = setTimeout(() => {
        logoClickCount.current = 0;
      }, 2000);
    }
  }, []);

  // Shift + hover secret message handler
  const handleShiftHover = useCallback((message) => {
    return (e) => {
      if (e.shiftKey) {
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'easter-egg-shift-tooltip';
        tooltip.textContent = message;
        tooltip.style.cssText = `
          position: fixed;
          left: ${e.clientX + 15}px;
          top: ${e.clientY + 15}px;
          background: rgba(215, 77, 139, 0.95);
          color: white;
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 0.9rem;
          z-index: 9999;
          animation: popIn 0.2s ease;
          max-width: 200px;
          pointer-events: none;
        `;
        document.body.appendChild(tooltip);

        const handleMouseLeave = () => {
          tooltip.remove();
          e.target.removeEventListener('mouseleave', handleMouseLeave);
        };
        e.target.addEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return {
    handleLogoClick,
    handleShiftHover,
    triggerConfetti: createConfetti,
    triggerKonami: createKonamiCelebration
  };
}

export default useEasterEggs;
