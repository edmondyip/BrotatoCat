import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { Preloader } from './scenes/Preloader';
import { gameConfig } from './config/gameConfig';
import './BrotatoCat.css';

const BrotatoCat = () => {
  const gameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: gameConfig.width,
      height: gameConfig.height,
      parent: 'game-container',
      physics: gameConfig.physics,
      scene: [Preloader, GameScene]
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return (
    <div className="game-page">
      <button className="back-button" onClick={() => navigate('/')}>
        返回遊戲列表
      </button>
      <div id="game-container" ref={gameRef} />
    </div>
  );
};

export default BrotatoCat; 