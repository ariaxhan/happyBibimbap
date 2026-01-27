import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageTransition - Wraps page content with smooth entrance/exit animations
 *
 * Animation timings:
 * - Fade: 400ms with ease-out
 * - Slide: 500ms with spring effect
 * - Scale: 400ms with ease-out
 */

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: [0.33, 1, 0.68, 1], // ease-out cubic
  duration: 0.4,
};

function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      className={`page-transition ${className}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
