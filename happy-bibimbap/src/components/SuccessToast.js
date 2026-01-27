import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SuccessToast - Displays success feedback with animation
 *
 * Animation timings:
 * - Enter: 300ms with spring effect
 * - Exit: 200ms with ease-out
 * - Auto-hide: 3000ms default
 *
 * @param {string} message - Success message to display
 * @param {boolean} show - Whether to show the toast
 * @param {function} onHide - Callback when toast hides
 * @param {number} duration - Duration before auto-hide (ms)
 */
function SuccessToast({ message, show, onHide, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onHide) {
          setTimeout(onHide, 300); // Wait for exit animation
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onHide]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="toast-success visible"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#4caf50',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '9999px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SuccessToast;
