import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import TestSettings from './components/TestSettings';
import TypingTest from './components/TypingTest';
import Keyboard from './components/Keyboard';
import { useKeyboard } from './hooks/useKeyboard';
import Display from './components/Display';
import { generateHomeRowPassage } from './utils/stringGenerator';
import { testConfig } from './utils/testConfig';

import './app.css';

function App() {
  const [mode, setMode] = useState('test');
  const [testSettings, setTestSettings] = useState({
    testType: 'duration',
    duration: 60,
    wordCount: 100
  });
  const [targetText, setTargetText] = useState('');

  useEffect(() => {
    const wordCount = testSettings.testType === 'wordCount' 
      ? testSettings.wordCount 
      : testConfig.wordCount;
    setTargetText(generateHomeRowPassage(wordCount));
  }, [testSettings]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleTestSettingsChange = (newSettings) => {
    setTestSettings(newSettings);
  };

  const handleTestComplete = (results) => {
    console.log('Test completed:', results);
  };

  const handleTestReset = () => {
    console.log('Test reset');
  };

  return (
    <div className="app-container">
      <Navigation 
        activeMode={mode} 
        onModeChange={handleModeChange} 
      />
      {mode === 'test' && (
        <TestSettings 
          settings={testSettings}
          onSettingsChange={handleTestSettingsChange}
        />
      )}
      <div className="main-content">
        {mode === 'test' ? (
          <TypingTest
            key={`${testSettings.testType}-${testSettings.duration}-${testSettings.wordCount}`}
            testSettings={testSettings}
            targetText={targetText}
            onTestComplete={handleTestComplete}
            onTestReset={handleTestReset}
          />
        ) : (
          <div className="practice-mode">
            <p>Practice mode coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;