import React from 'react';
import { motion } from 'framer-motion';

/**
 * LoadingSpinner - Animated loading indicator
 *
 * Animation timing: 0.8s per rotation (linear)
 *
 * @param {string} size - 'sm' | 'md' | 'lg', default 'md'
 * @param {string} message - Optional loading message
 * @param {string} variant - 'spinner' | 'dots', default 'spinner'
 */
function LoadingSpinner({ size = 'md', message = '', variant = 'spinner' }) {
  const sizeMap = {
    sm: { width: 16, border: 2 },
    md: { width: 32, border: 3 },
    lg: { width: 48, border: 4 },
  };

  const { width, border } = sizeMap[size];

  if (variant === 'dots') {
    return (
      <div className="loader-dots" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              style={{
                width: size === 'sm' ? 8 : size === 'lg' ? 14 : 10,
                height: size === 'sm' ? 8 : size === 'lg' ? 14 : 10,
                background: '#d74d8b',
                borderRadius: '50%',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
        {message && (
          <span style={{ color: '#666', fontSize: size === 'sm' ? '12px' : '14px' }}>
            {message}
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <motion.div
        style={{
          width: `${width}px`,
          height: `${width}px`,
          border: `${border}px solid rgba(215, 77, 139, 0.2)`,
          borderTopColor: '#d74d8b',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {message && (
        <motion.span
          style={{ color: '#666', fontSize: size === 'sm' ? '12px' : '14px' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.span>
      )}
    </div>
  );
}

export default LoadingSpinner;
