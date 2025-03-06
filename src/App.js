import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameSelection from './components/games/GameSelection';
import BrotatoCat from './components/games/BrotatoCat/BrotatoCat';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameSelection />} />
        <Route path="/games/brotato-cat" element={<BrotatoCat />} />
      </Routes>
    </Router>
  );
}

export default App; 