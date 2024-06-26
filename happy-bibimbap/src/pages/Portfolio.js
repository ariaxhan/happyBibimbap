import { motion } from 'framer-motion';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import Navbar from '../components/NavBar'; // Import the Navbar component
import happybibimbap10 from '../images/happybibimbap10.png';
import happybibimbap11 from '../images/happybibimbap11.png';
import happybibimbap12 from '../images/happybibimbap12.png';
import happybibimbap13 from '../images/happybibimbap13.png';
import happybibimbap14 from '../images/happybibimbap14.png';
import happybibimbap15 from '../images/happybibimbap15.png';
import happybibimbap16 from '../images/happybibimbap16.png';
import happybibimbap2 from '../images/happybibimbap2.png';
import happybibimbap3 from '../images/happybibimbap3.png';
import happybibimbap4 from '../images/happybibimbap4.png';
import happybibimbap5 from '../images/happybibimbap5.png';
import happybibimbap6 from '../images/happybibimbap6.png';
import happybibimbap7 from '../images/happybibimbap7.png';
import happybibimbap8 from '../images/happybibimbap8.png';
import happybibimbap9 from '../images/happybibimbap9.png';

const images = [
  happybibimbap2,
  happybibimbap3,
  happybibimbap4,
  happybibimbap5,
  happybibimbap6,
  happybibimbap7,
  happybibimbap8,
  happybibimbap9,
  happybibimbap10,
  happybibimbap11,
  happybibimbap12,
  happybibimbap13,
  happybibimbap14,
  happybibimbap15,
  happybibimbap16,
];

// Function to shuffle the images
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const shuffledImages = shuffleArray(images);

const imageVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const AnimatedImage = ({ src, alt, delay }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.img 
      ref={ref}
      src={src} 
      alt={alt} 
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={imageVariants}
      transition={{ duration: 0.5, delay }}
      className="pic"
    />
  );
};

const Portfolio = () => {
  return (
    <div className="container">
      <Navbar /> {/* Use the Navbar component */}
      <div className="portfolio-container">
        <h1>Welcome to Happy Bibimbap's Portfolio!</h1>
        <p>We are here to serve you some sweet, colorful, funny, unique, and creative dishes!</p>
        <p>Check out our amazing creations below:</p>
        <div className="image-wrapper">
          {shuffledImages.map((image, index) => (
            <AnimatedImage 
              key={index} 
              src={image} 
              alt={`Happy Bibimbap ${index + 2}`} 
              delay={index * 0.2} // Staggered delay for animations
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;