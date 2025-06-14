import React, { useMemo } from 'react';
import '../styles/display.css';

const Display = ({ text, cursorPosition, typedCharacters }) => {
  // Split text into lines based on character width
  const { lines, charToLineMap } = useMemo(() => {
    if (!text) return { lines: [], charToLineMap: [] };
    
    const words = text.split(' ');
    const lines = [];
    const charToLineMap = [];
    let currentLine = '';
    let currentCharIndex = 0;
    const maxLineLength = 60; // Characters per line
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const separator = currentLine ? ' ' : '';
      const testLine = currentLine + separator + word;
      
      if (testLine.length <= maxLineLength || !currentLine) {
        // Add separator characters to map
        if (separator) {
          charToLineMap[currentCharIndex] = lines.length;
          currentCharIndex++;
        }
        
        // Add word characters to map
        for (let j = 0; j < word.length; j++) {
          charToLineMap[currentCharIndex] = lines.length;
          currentCharIndex++;
        }
        
        currentLine = testLine;
      } else {
        // Push current line and start new line
        lines.push(currentLine);
        
        // Start new line with current word
        for (let j = 0; j < word.length; j++) {
          charToLineMap[currentCharIndex] = lines.length;
          currentCharIndex++;
        }
        currentLine = word;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return { lines, charToLineMap };
  }, [text]);
  
  // Calculate which line the cursor is on
  const currentLineIndex = charToLineMap[cursorPosition] || 0;
  
  // Calculate which lines to display (3-line window)
  const displayWindow = useMemo(() => {
    if (lines.length <= 3) {
      return { startLine: 0, endLine: lines.length };
    }
    
    // Scrolling logic based on README requirements
    if (currentLineIndex <= 1) {
      // Show lines 0, 1, 2 when cursor is on line 0 or 1
      return { startLine: 0, endLine: 3 };
    } else if (currentLineIndex >= lines.length - 1) {
      // Show last 3 lines when at the end
      return { startLine: lines.length - 3, endLine: lines.length };
    } else {
      // Show current line as middle line (lines: current-1, current, current+1)
      return { startLine: currentLineIndex - 1, endLine: currentLineIndex + 2 };
    }
  }, [lines.length, currentLineIndex]);
  
  // Render the visible lines with proper character mapping
  const renderLines = () => {
    const visibleLines = lines.slice(displayWindow.startLine, displayWindow.endLine);
    let globalCharIndex = 0;
    
    // Calculate starting character index for visible window
    for (let i = 0; i < displayWindow.startLine; i++) {
      globalCharIndex += lines[i].length;
      if (i < lines.length - 1) globalCharIndex++; // Add space between lines
    }
    
    return visibleLines.map((line, lineIndex) => {
      const actualLineIndex = displayWindow.startLine + lineIndex;
      const lineChars = [];
      
      // Render each character in the line
      for (let charIndex = 0; charIndex < line.length; charIndex++) {
        const char = line[charIndex];
        if (char != null) { // Check for null/undefined
          lineChars.push(
            <span
              key={globalCharIndex}
              className={`
                character
                ${globalCharIndex === cursorPosition ? 'cursor' : ''}
                ${typedCharacters[globalCharIndex]?.status || ''}
              `}
            >
              {char}
            </span>
          );
        }
        globalCharIndex++;
      }
      
      // Add space after line (except for last line)
      if (actualLineIndex < lines.length - 1) {
        lineChars.push(
          <span
            key={globalCharIndex}
            className={`
              character
              ${globalCharIndex === cursorPosition ? 'cursor' : ''}
              ${typedCharacters[globalCharIndex]?.status || ''}
            `}
          >
            {' '}
          </span>
        );
        globalCharIndex++;
      }
      
      return (
        <div key={actualLineIndex} className="display-line">
          {lineChars}
        </div>
      );
    });
  };
  
  return (
    <div className="display-container">
      <div className="display-lines">
        {renderLines()}
      </div>
    </div>
  );
};

export default Display;