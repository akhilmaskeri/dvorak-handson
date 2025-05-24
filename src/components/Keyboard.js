import React, { useState, useEffect } from 'react';
import '../styles/keyboard.css';
import { keyboardRowsDvorak } from './KeyboardLayouts';
import { qwertyToDvorak } from './KeyboardMapping';

const Keyboard = () => {
  const [activeKey, setActiveKey] = useState(null);
  // const [isQwerty, setIsQwerty] = useState(false);
  const isQwerty = false;
  const keyboardRows = keyboardRowsDvorak;

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyCode = event.code;
      let mappedCode = keyCode;

      console.log(isQwerty, qwertyToDvorak[keyCode]);

      if (isQwerty === false && keyCode.startsWith('Key') && qwertyToDvorak[keyCode]) {
        mappedCode = 'Key' + qwertyToDvorak[keyCode].toUpperCase();
      }
      setActiveKey(mappedCode);
    };

    const handleKeyUp = (event) => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isQwerty]);

  // const toggleLayout = () => {
  //   setIsQwerty(!isQwerty);
  // };

  const handleClick = (key) => {
    setActiveKey(key.code);
  };

  return (
    <div className="keyboard-container">

      {/*
      <button className="layout-toggle" onClick={toggleLayout}>
        {isQwerty ? 'QWERTY' : 'DVORAK'}
      </button> */}

      <div className="keyboard">
        {keyboardRows.map((row, rowIdx) => (
          <div className="keyboard-row" key={rowIdx}>
            {row.map((key) => (
              <button
                key={key.code}
                className={
                  `keyboard-key` +
                  (activeKey === key.code ? ' active' : '') +
                  (key.bump ? ' bump' : '') +
                  (key.type ? ` ${key.type}` : '')
                }
                onClick={() => handleClick(key)}
              >
                {key.label}
              </button>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Keyboard;