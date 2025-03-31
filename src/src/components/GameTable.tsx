import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GameTable = () => {
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <div className="game-container">
      {!gameStarted ? (
        <motion.div 
          className="start-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1>Basra Card Game</h1>
          <button onClick={() => setGameStarted(true)}>
            Start Game
          </button>
        </motion.div>
      ) : (
        <div className="game-board">
          <p>Game will appear here</p>
        </div>
      )}
    </div>
  );
};

export default GameTable;
import { CARD_IMAGES, GAME_SOUNDS, BACKGROUND_IMAGE } from '../utils/cardAssets';

// Example usage in your component:
const CardComponent = ({ card }: { card: { suit: string; rank: string } }) => {
  const cardKey = `${card.suit}-${card.rank}`.toLowerCase();
  const imageSrc = CARD_IMAGES[cardKey] || '/assets/images/cards/back.png';
  
  return (
    <img 
      src={imageSrc} 
      alt={`${card.rank} of ${card.suit}`}
      className="card-image"
    />
  );
};