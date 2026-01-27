import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import useEasterEggs from '../hooks/useEasterEggs';
import '../styles.css';

// Sad messages that rotate
const sadMessages = [
  "This page got lost on the way to the kitchen...",
  "Oops! Someone ate this page before you got here.",
  "404: Page not found. Maybe it's being bibimbaped?",
  "The ingredients for this page are missing!",
  "This bowl is empty. Try another one!"
];

// Secret ingredient sequence easter egg
const SECRET_SEQUENCE = ['rice', 'egg', 'veggies', 'gochujang'];

function NotFound() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [clickedIngredients, setClickedIngredients] = useState([]);
  const [showSecret, setShowSecret] = useState(false);
  const { triggerConfetti } = useEasterEggs();

  // Rotate messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % sadMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Check for secret sequence
  const handleIngredientClick = (ingredient) => {
    const newClicked = [...clickedIngredients, ingredient];

    // Check if matches start of sequence
    const matchesSoFar = SECRET_SEQUENCE.slice(0, newClicked.length).every(
      (item, i) => item === newClicked[i]
    );

    if (!matchesSoFar) {
      // Wrong sequence, reset
      setClickedIngredients([]);
    } else if (newClicked.length === SECRET_SEQUENCE.length) {
      // Completed the sequence!
      setShowSecret(true);
      triggerConfetti();
      setClickedIngredients([]);
    } else {
      setClickedIngredients(newClicked);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="not-found-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <div style={{ fontSize: '120px', marginBottom: '20px' }}>
          {showSecret ? '🎉' : '🍲'}
        </div>

        <h1 style={{
          fontSize: '4rem',
          color: '#d74d8b',
          margin: '0 0 20px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          {showSecret ? 'Secret Found!' : '404'}
        </h1>

        <p style={{
          fontSize: '1.3rem',
          color: '#fff',
          maxWidth: '500px',
          marginBottom: '30px',
          minHeight: '60px'
        }}>
          {showSecret
            ? 'You made a perfect bibimbap! You are a true chef!'
            : sadMessages[messageIndex]
          }
        </p>

        {/* Hidden ingredient clicking game */}
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '30px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => handleIngredientClick('rice')}
            style={ingredientButtonStyle}
            title="Rice"
          >
            🍚
          </button>
          <button
            onClick={() => handleIngredientClick('egg')}
            style={ingredientButtonStyle}
            title="Egg"
          >
            🍳
          </button>
          <button
            onClick={() => handleIngredientClick('veggies')}
            style={ingredientButtonStyle}
            title="Vegetables"
          >
            🥬
          </button>
          <button
            onClick={() => handleIngredientClick('gochujang')}
            style={ingredientButtonStyle}
            title="Gochujang"
          >
            🌶️
          </button>
        </div>

        {/* Progress hint */}
        {clickedIngredients.length > 0 && (
          <p style={{ color: '#fff', opacity: 0.7, marginBottom: '20px' }}>
            {clickedIngredients.length}/4 ingredients selected...
          </p>
        )}

        <Link
          to="/"
          style={{
            background: 'linear-gradient(135deg, #d74d8b, #f1823c)',
            color: 'white',
            padding: '15px 40px',
            borderRadius: '30px',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(215, 77, 139, 0.4)',
            transition: 'transform 0.2s ease'
          }}
        >
          Back to Home
        </Link>

        {/* Hidden hint */}
        <p style={{
          marginTop: '40px',
          fontSize: '0.9rem',
          color: '#fff',
          opacity: 0.5
        }}>
          Hint: Make a bibimbap in the right order...
        </p>
      </div>
    </div>
  );
}

const ingredientButtonStyle = {
  fontSize: '2.5rem',
  padding: '15px 20px',
  background: 'rgba(255, 255, 255, 0.9)',
  border: 'none',
  borderRadius: '15px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

export default NotFound;
