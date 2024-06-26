import React, { useState } from "react";
import Navbar from '../components/NavBar'; // Import the Navbar component
import happybibimbap from "../happybibimbap.png";
import "../styles.css";

// Audio file paths (relative to the public directory)
const songs = [
  { 
    title: "Happy Bibimbap", 
    src: "/music/HappyBibimbap.mp3",
    lyrics: `
야채 조각들이 눈부셔
비빔밤 내 맘 밝히네

고소한 참기름 한 방울
Spicy gochujang mixing all around
온 세상이 맛있어

Happy bibimbap
Smiling with each bite
어깨를 들썩들썩
밥 한 술 뜨고 나

따뜻한 사랑 담아서
Sauteed veggies blend in harmony
Every color shines in the bowl

Happy bibimbap
Smiling with each bite
어깨를 들썩들썩
밥 한 술 뜨고 나

Harmony in a bowl
우리 함께 즐겨봐요
Nothing else compares
Just this meal and cheerful hearts
    `
  },
  { 
    title: "Bibimbap Bliss", 
    src: "/music/HappyBibimbap2.mp3",
    lyrics: `
Ingredients in the air
비빔밥 everywhere
Mix it up with care
맛있게 let's share

With a sunny-side egg
고소해 toasted taste
I'll take a big bite
온 세상 너무 bright

Happy in a bowl
고소한 my soul
All the colors gleam
비벼 봐 let's dream

Carrots crisp and fresh
채소들 at their best
Rice so warm and white
맛있는 delight

All together now
너와 나 just how
Mix in harmony
평화의 symphony

Happy in a bowl
고소한 my soul
All the colors gleam
비벼 봐 let's dream
    `
  },
  { 
    title: "Bibimbap Delight", 
    src: "/music/HappyBibimbap3.mp3",
    lyrics: `
Cooking in the kitchen
Colorful and bright
들판의 야채와 고기의 맛
Mixing all together
Perfect harmony
비빔밥을 만들자

Sizzling on the skillet
Fresh and tender beef
밥 위에 참기름
Aromatic feast
Egg atop a mountain
Beauty in a bowl
함께 먹는 이 순간

Bibimbap delight
Feeling so right
Every bite a piece of heaven
하나 되는 순간
Joy in every grain
Let the flavors reign
우리의 비빔밥

Laughing with our friends
Stories that we share
사랑이 가득한
맘 가득히 채워
Mix it with a smile
Taste the caring hearts
비벼먹는 행복

In each spoonful I taste
Memories we made
간장이 살짝 스르르
From morning till the night
It’s a simple joy
비빔밥과 함께

Bibimbap delight
Feeling so right
Every bite a piece of heaven
하나 되는 순간
Joy in every grain
Let the flavors reign
우리의 비빔밥
    `
  }
];

function Home() {
  const [visibleLyrics, setVisibleLyrics] = useState(Array(songs.length).fill(false));

  const toggleLyrics = (index) => {
    setVisibleLyrics(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="container">
      <Navbar />
      <div className="introduction-container">
        <img
          src={happybibimbap}
          className="logo"
          alt="Happy Bibimbap"
        />
        <h1 className="introduction-title">Hello!</h1>
        <div className="introduction-content">
          <p>
            Welcome to my portfolio!
            <br />
            <br />
            I'm Happy Bibimbap, a creative culinary enthusiast who loves to bring joy and flavor to every dish. 
            Explore my work and join me on this delicious journey!
          </p>
        </div>
      </div>
      {/* New music gallery section */}
      <div className="music-container">
        <h2 className="music-title">Enjoy Some Music</h2>
        <p className="music-description">Relax and enjoy these soothing, calming, and happy tracks inspired by the joys of making and enjoying bibimbap.</p>
        <div className="audio-gallery">
          {songs.map((song, index) => (
            <div key={index} className="audio-item">
              <h3 className="audio-title">{song.title}</h3>
              <audio controls>
                <source src={song.src} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <button onClick={() => toggleLyrics(index)}>
                {visibleLyrics[index] ? "Hide Lyrics" : "Show Lyrics"}
              </button>
              {visibleLyrics[index] && (
                <div className="lyrics">
                  <p>{song.lyrics}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;