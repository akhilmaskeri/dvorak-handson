import React, { useEffect } from 'react';
import Display from './Display';
import Keyboard from './Keyboard';
import Timer from './Timer';
import TestAnalysis from './TestAnalysis';
import { useTypingTest } from '../hooks/useTypingTest';
import '../styles/typing-test.css';

const TypingTest = ({ 
  testSettings, 
  targetText, 
  onTestComplete,
  onTestReset 
}) => {
  const {
    testState,
    testResults,
    handleKeyDown,
    activeKeys,
    cursorPosition,
    typedCharacters,
    restartTest,
    handleTimerTimeout,
    getProgress,
    // getElapsedTime,
    // getCurrentWPM,
    // getCurrentAccuracy
  } = useTypingTest(testSettings, targetText);

  // Notify parent of test completion
  useEffect(() => {
    if (testResults && onTestComplete) {
      onTestComplete(testResults);
    }
  }, [testResults, onTestComplete]);

  const handleRestart = () => {
    restartTest();
    if (onTestReset) {
      onTestReset();
    }
  };

  if (testState === 'completed' && testResults) {
    return (
      <div className="typing-test">
        <TestAnalysis 
          results={testResults}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  return (
    <div className="typing-test">
      <div className="test-header">
        <div className="test-info">
          {testState === 'ready' && (
            <div className="start-message">
              Start typing to begin the test...
            </div>
          )}
          
          {testState === 'active' && (
            <div className="test-stats">
              <div className="stat-item">
                <span className="stat-label">Progress:</span>
                <span className="stat-value">{Math.round(getProgress())}%</span>
              </div>
              
              {testSettings.testType === 'duration' && (
                <Timer
                  duration={testSettings.duration}
                  isActive={testState === 'active'}
                  onTimeUp={handleTimerTimeout}
                  compact={true}
                  inline={true}
                />
              )}
              
              {testSettings.testType === 'wordCount' && (
                <div className="stat-item">
                  <span className="stat-label">Words:</span>
                  <span className="stat-value">
                    {Math.floor(cursorPosition / 5)} / {testSettings.wordCount}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="test-actions">
          {testState !== 'ready' && (
            <button 
              className="restart-button" 
              onClick={handleRestart}
              title="Restart test (Ctrl+R)"
            >
              � Restart
            </button>
          )}
        </div>
      </div>

      <div className="test-content">
        <Display
          text={targetText}
          cursorPosition={cursorPosition}
          typedCharacters={typedCharacters}
        />
        
        <Keyboard
          onKeyDown={handleKeyDown}
          activeKeys={activeKeys}
        />
      </div>

      {testState === 'active' && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default TypingTest;