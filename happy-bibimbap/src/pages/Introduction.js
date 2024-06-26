import { motion } from 'framer-motion';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import Navbar from '../components/NavBar'; // Import the Navbar 
import egg from '../images/egg.png';
import magic from '../images/magic.png';
import symphony from '../images/symphony.png';
import yay from '../images/yay.png';
import '../styles.css';

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
      className="image"
    />
  );
};

const Introduction = () => {
  return (
    <div className="container">
      <Navbar />
      <div className="introduction-container">
        <h1 className="introduction-title">Introduction</h1>
        <div className="introduction-content">
          <p>
            Greetings, fellow culinary enthusiasts!
            <br />
            <br />
            Allow me to introduce myself in the most whimsical and delightful manner possible.
            <br />
            <br />
            I am none other than the illustrious and ever-vivacious Happy Bibimbap, the reigning monarch of all things scrumptiously satisfying and delectably delightful.
            <br />
            <br />
            My ingredients and I have quite the adventurous tale to tell, so grab your chopsticks and prepare for a journey through a world of flavor, fun, and a whole lot of heart!
            <br />
            <br />
            Now, picture this: a cozy, warm bowl filled to the brim with a rainbow of vibrant vegetables, tender meats, and the freshest of garnishes, all harmoniously mingling together.
            <br />
            <div className="image-container">
              <AnimatedImage src={yay} alt="Yay" delay={0.2} />
            </div>
            <br />
            That’s me, Happy Bibimbap, the embodiment of culinary camaraderie and gastronomic glee!
            <br />
            My existence is a testament to the beauty of diversity, with each ingredient bringing its own unique charm and personality to the mix.
            <br />
            <br />
            But let me tell you a little secret – the true hero of our story, the one who keeps us all grounded and brings balance to our flavorful fiesta, is none other than the humble yet mighty egg.
            <br />
            <div className="image-container">
              <AnimatedImage src={egg} alt="Egg" delay={0.4} />
            </div>
            Oh, what a wondrous egg it is!
            <br />
            <br />
            Poised gracefully atop our colorful assembly, its golden yolk gleaming like a beacon of unity and deliciousness.
            <br />
            This egg, my dear friends, is the glue that binds us all together, the sun in our culinary solar system, the conductor of our gastronomic orchestra.
            <br />
            <div className="image-container">
              <AnimatedImage src={symphony} alt="Symphony" delay={0.6} />
            </div>
            <br />
            Together, we create a symphony of tastes and textures that dance upon your palate, a joyful celebration of harmony in every bite.
            <br />
            <br />
            Whether you’re mixing us up with glee or savoring each individual ingredient with reverence, we promise to bring a smile to your face and a warmth to your heart.
            <br />
            <br />
            So, as you embark on this delightful dining adventure, remember that you are not just enjoying a meal – you are partaking in a culinary masterpiece, a whimsical waltz of flavors that is sure to leave you enchanted.
            <br />
            <div className="image-container">
              <AnimatedImage src={magic} alt="Magic" delay={0.8} />
            </div>
            <br />
            Welcome to the world of Happy Bibimbap, where every bite is a joyous celebration of life, love, and the magic of food!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Introduction;