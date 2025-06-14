import React from 'react';
import '../styles/navigation.css';

const Navigation = ({ activeMode, onModeChange }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <button
          className={`nav-button ${activeMode === 'test' ? 'active' : ''}`}
          onClick={() => onModeChange('test')}
        >
          Test
        </button>
        <button
          className={`nav-button ${activeMode === 'practice' ? 'active' : ''}`}
          onClick={() => onModeChange('practice')}
        >
          Practice
        </button>
      </div>
    </nav>
  );
};

export default Navigation;