import React from 'react';
import '../styles/display.css';

const Display = ({ text, cursorPosition, typedCharacters }) => {
  return (
    <div className="display-container">
      {text.split('').map((char, index) => (
        <span key={index} className={`
          character
          ${index === cursorPosition ? 'cursor' : ''}
          ${typedCharacters[index]?.status || ''}
        `}>
          {char}
        </span>
      ))}
    </div>
  );
};

export default Display;