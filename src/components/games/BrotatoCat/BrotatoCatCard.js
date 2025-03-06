import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BrotatoCatCard.css';

const BrotatoCatCard = () => {
  const navigate = useNavigate();

  return (
    <div className="game-card" onClick={() => navigate('/games/brotato-cat')}>
      <div className="game-card-content">
        <img 
          src="/assets/charachers/cat_1.png"
          alt="Brotato Cat" 
          className="game-card-image"
        />
        <h2>Brotato Cat</h2>
        <p>一隻會射擊的貓咪</p>
      </div>
    </div>
  );
};

export default BrotatoCatCard; 