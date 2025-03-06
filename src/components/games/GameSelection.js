import React from 'react';
import GameCard from './GameCard';

const GameSelection = () => {
  const games = [
    {
      title: 'BrotatoCat',
      description: '一隻可愛的貓咪在充滿敵人的世界中生存',
      path: '/games/brotato-cat'
    },
    // 可以在這裡添加更多遊戲
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{
        color: '#333333',
        fontFamily: '"Big Shoulders Display", sans-serif',
        fontSize: '48px',
        marginBottom: '40px'
      }}>
        遊戲中心
      </h1>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {games.map((game, index) => (
          <GameCard
            key={index}
            title={game.title}
            description={game.description}
            path={game.path}
          />
        ))}
      </div>
    </div>
  );
};

export default GameSelection; 