import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.css';

const GameCard = ({ title, description, path, image }) => {
  return (
    <Link to={path} style={{ textDecoration: 'none' }}>
      <div className="game-card">
        <h2 className="game-card-title">
          {title}
        </h2>
        <p className="game-card-description">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default GameCard; 