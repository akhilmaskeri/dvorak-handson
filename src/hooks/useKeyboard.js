import { useState, useEffect, useCallback } from 'react';
import { qwertyToDvorak } from '../components/KeyboardMapping';

export const useKeyboard = (initialText = '') => {

  const [text, setText] = useState(initialText);

  const [metadata, setMetadata] = useState({
    lastKeyCode: null,
    lastEventType: null,
    lastEventTarget: null,
  });
  const [activeKeys, setActiveKeys] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [typedCharacters, setTypedCharacters] = useState([]);
  const [capsLockActive, setCapsLockActive] = useState(false);

  useEffect(() => {
    setText(initialText);
    setTypedCharacters([]);
    setCursorPosition(0);
  }, [initialText]);

  // Check if caps lock is active
  const checkCapsLock = useCallback((event) => {
    setCapsLockActive(event.getModifierState('CapsLock'));
  }, []);

  const getCharacterCase = useCallback((char, shiftPressed, capsLockActive) => {
    if (!char) return '';
    const shouldBeUppercase = (shiftPressed && !capsLockActive) || (!shiftPressed && capsLockActive);
    return shouldBeUppercase ? char.toUpperCase() : char.toLowerCase();
  }, []);

  const handleKeyDown = useCallback((event) => {
    // Ignore keystrokes when focus is on input elements
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }
    
    // Always check caps lock state
    checkCapsLock(event);
    
    // Update active keys for visualization (except for modifier keys)
    if (!event.repeat && !['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(event.key)) {
      setActiveKeys(prev => [...prev, event.code]);
    }

    setMetadata(prev => ({
      ...prev,
      lastKeyCode: event.code,
      lastEventType: 'keydown',
      lastEventTarget: event.target.tagName,
    }));

    // Handle special keys
    switch (event.key) {
      case 'Backspace':
        event.preventDefault();
        if (cursorPosition > 0) {
          setText(prev => prev.slice(0, cursorPosition - 1) + prev.slice(cursorPosition));
          setCursorPosition(prev => prev - 1);
          setTypedCharacters(prev => {
            const newTyped = [...prev];
            newTyped.splice(cursorPosition - 1, 1);
            return newTyped;
          });
        }
        break;

      case 'Delete':
        event.preventDefault();
        if (cursorPosition < text.length) {
          setText(prev => prev.slice(0, cursorPosition) + prev.slice(cursorPosition + 1));
          setTypedCharacters(prev => {
            const newTyped = [...prev];
            newTyped.splice(cursorPosition, 1);
            return newTyped;
          });
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        setCursorPosition(prev => Math.max(0, prev - 1));
        break;

      case 'ArrowRight':
        event.preventDefault();
        setCursorPosition(prev => Math.min(text.length, prev + 1));
        break;

      case 'Home':
        event.preventDefault();
        setCursorPosition(0);
        break;

      case 'End':
        event.preventDefault();
        setCursorPosition(text.length);
        break;

      case 'Enter':
        event.preventDefault();
        break;

      case 'Tab':
        event.preventDefault();
        const tabChar = '\t';
        setText(prev => prev.slice(0, cursorPosition) + tabChar + prev.slice(cursorPosition));
        setTypedCharacters(prev => [...prev, { char: tabChar, status: 'typed' }]);
        setCursorPosition(prev => prev + 1);
        break;

      case ' ':
        event.preventDefault();
        const spaceChar = ' ';
        
        // Check if space is correct against target text
        const targetSpaceChar = initialText[cursorPosition];
        let spaceStatus = 'wrong'; // Default to wrong
        
        if (targetSpaceChar && spaceChar === targetSpaceChar) {
          spaceStatus = 'correct';
        } else if (!targetSpaceChar) {
          spaceStatus = 'extra'; // Typed beyond target text
        }
        
        setText(prev => prev.slice(0, cursorPosition) + spaceChar + prev.slice(cursorPosition));
        setTypedCharacters(prev => [...prev, { char: spaceChar, status: spaceStatus }]);
        setCursorPosition(prev => prev + 1);
        break;

      default:
        // Handle character keys
        if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
          event.preventDefault();
          
          let charToInsert = event.key;
          
          // Apply Dvorak mapping for letter keys
          const mappedChar = qwertyToDvorak[event.code];
          if (mappedChar) {
            charToInsert = getCharacterCase(mappedChar, event.shiftKey, capsLockActive);
          }

          // Safety check for null/undefined characters
          if (!charToInsert) {
            return;
          }

          // Check if character is correct against target text
          const targetChar = initialText[cursorPosition];
          let status = 'wrong'; // Default to wrong
          
          if (targetChar && charToInsert === targetChar) {
            status = 'correct';
          } else if (!targetChar) {
            status = 'extra'; // Typed beyond target text
          }

          setText(prev => prev.slice(0, cursorPosition) + charToInsert + prev.slice(cursorPosition));
          setTypedCharacters(prev => {
            const newArray = [...prev, { char: charToInsert, status: status }];
            console.log('Adding character:', charToInsert, 'Status:', status, 'Total typed:', newArray.length);
            return newArray;
          });
          setCursorPosition(prev => prev + 1);
        }
        break;
    }
  }, [cursorPosition, text, capsLockActive, checkCapsLock, getCharacterCase, initialText]);

  const handleKeyUp = useCallback((event) => {
    // Ignore keystrokes when focus is on input elements
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }
    
    const keyCode = event.code;
    
    setMetadata(prev => ({
      ...prev,
      lastEventType: 'keyup',
    }));
    
    setActiveKeys(prev => prev.filter(key => key !== keyCode));
  }, []);

  // Clean up cursor position if it goes out of bounds
  useEffect(() => {
    if (cursorPosition > text.length) {
      setCursorPosition(text.length);
    }
  }, [text.length, cursorPosition]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Utility functions
  const resetEditor = useCallback(() => {
    setText('');
    setCursorPosition(0);
    setTypedCharacters([]);
  }, []);

  const insertText = useCallback((textToInsert) => {
    setText(prev => prev.slice(0, cursorPosition) + textToInsert + prev.slice(cursorPosition));
    setCursorPosition(prev => prev + textToInsert.length);
  }, [cursorPosition]);

  return {
    text,
    setText,
    metadata,
    activeKeys,
    cursorPosition,
    setCursorPosition,
    typedCharacters,
    capsLockActive,
    
    // Event handlers
    handleKeyUp,
    handleKeyDown,
    
    // Utility functions
    resetEditor,
    insertText,
    
    // Editor state
    textLength: text.length,
    isEmpty: text.length === 0,
  };
};