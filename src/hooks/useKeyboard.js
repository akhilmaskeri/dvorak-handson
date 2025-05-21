import { useState, useEffect, useCallback } from 'react';
import { qwertyToDvorak } from '../components/KeyboardMapping';

export const useKeyboard = () => {
  const [text, setText] = useState('');
  const [metadata, setMetadata] = useState({
    lastKeyCode: null,
    lastEventType: null,
    lastEventTarget: null,
  });
  const [activeKeys, setActiveKeys] = useState([]);

  const handleKeyPress = useCallback(
    (event) => {
      let key = event.key;
      // Convert QWERTY key to Dvorak key if mapping exists
      if (qwertyToDvorak[event.code]) {
        key = String.fromCharCode(event.charCode); // Get the actual character
      }
      setText((prevText) => prevText + key);
    },
    []
  );

  const handleKeyDown = (event) => {
    const keyCode = event.code;
    setMetadata({
      lastKeyCode: keyCode,
      lastEventType: 'keydown',
      lastEventTarget: event.target.tagName,
    });
    setActiveKeys((prevActiveKeys) => {
      if (!prevActiveKeys.includes(keyCode)) {
        return [...prevActiveKeys, keyCode];
      }
      return prevActiveKeys;
    });
  };

  const handleKeyUp = (event) => {
    const keyCode = event.code;
    setMetadata((prevMetadata) => ({
      ...prevMetadata,
      lastEventType: 'keyup',
    }));
    setActiveKeys((prevActiveKeys) =>
      prevActiveKeys.filter((key) => key !== keyCode)
    );
  };

  useEffect(() => {
    const handlePhysicalKeyPress = (event) => {
      handleKeyPress(event);
    };

    window.addEventListener('keypress', handlePhysicalKeyPress);

    return () => {
      window.removeEventListener('keypress', handlePhysicalKeyPress);
    };
  }, [handleKeyPress]);

  return {
    text,
    metadata,
    handleKeyDown,
    handleKeyUp,
    handleKeyPress,
    activeKeys,
  };
};