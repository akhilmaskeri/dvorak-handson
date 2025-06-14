import React, { useState } from 'react';
import '../styles/test-settings.css';

const TestSettings = ({ settings, onSettingsChange }) => {
  const [customDuration, setCustomDuration] = useState('');
  const [customWordCount, setCustomWordCount] = useState('');
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [showCustomWordCount, setShowCustomWordCount] = useState(false);

  const handleTestTypeChange = (testType) => {
    onSettingsChange({ ...settings, testType });
    setShowCustomDuration(false);
    setShowCustomWordCount(false);
  };

  const handleDurationChange = (duration) => {
    if (duration === 'custom') {
      setShowCustomDuration(true);
      return;
    }
    onSettingsChange({ ...settings, duration: parseInt(duration) });
    setShowCustomDuration(false);
  };

  const handleWordCountChange = (wordCount) => {
    if (wordCount === 'custom') {
      setShowCustomWordCount(true);
      return;
    }
    onSettingsChange({ ...settings, wordCount: parseInt(wordCount) });
    setShowCustomWordCount(false);
  };

  const handleCustomDurationSubmit = () => {
    const duration = parseInt(customDuration);
    if (duration && duration > 0) {
      onSettingsChange({ ...settings, duration });
      setShowCustomDuration(false);
      setCustomDuration('');
    }
  };

  const handleCustomWordCountSubmit = () => {
    const wordCount = parseInt(customWordCount);
    if (wordCount && wordCount > 0) {
      onSettingsChange({ ...settings, wordCount });
      setShowCustomWordCount(false);
      setCustomWordCount('');
    }
  };

  return (
    <div className="test-settings">
      <div className="settings-container">
        <div className="setting-group">
          <span className="setting-label">Test by:</span>
          <button
            className={`setting-button ${settings.testType === 'duration' ? 'active' : ''}`}
            onClick={() => handleTestTypeChange('duration')}
          >
            Time
          </button>
          <button
            className={`setting-button ${settings.testType === 'wordCount' ? 'active' : ''}`}
            onClick={() => handleTestTypeChange('wordCount')}
          >
            Words
          </button>
        </div>

        {settings.testType === 'duration' && (
          <div className="setting-group">
            <span className="setting-label">Duration:</span>
            <button
              className={`setting-button ${settings.duration === 60 ? 'active' : ''}`}
              onClick={() => handleDurationChange('60')}
            >
              60s
            </button>
            <button
              className={`setting-button ${settings.duration === 120 ? 'active' : ''}`}
              onClick={() => handleDurationChange('120')}
            >
              120s
            </button>
            <button
              className={`setting-button ${showCustomDuration || (settings.duration !== 60 && settings.duration !== 120) ? 'active' : ''}`}
              onClick={() => handleDurationChange('custom')}
            >
              Custom
            </button>
            {showCustomDuration && (
              <div className="custom-input-group">
                <input
                  type="number"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  placeholder="Enter seconds"
                  className="custom-input"
                  min="1"
                  max="600"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomDurationSubmit();
                    }
                  }}
                />
                <button
                  className="custom-submit"
                  onClick={handleCustomDurationSubmit}
                >
                  Set
                </button>
              </div>
            )}
          </div>
        )}

        {settings.testType === 'wordCount' && (
          <div className="setting-group">
            <span className="setting-label">Word count:</span>
            <button
              className={`setting-button ${settings.wordCount === 100 ? 'active' : ''}`}
              onClick={() => handleWordCountChange('100')}
            >
              100
            </button>
            <button
              className={`setting-button ${showCustomWordCount || settings.wordCount !== 100 ? 'active' : ''}`}
              onClick={() => handleWordCountChange('custom')}
            >
              Custom
            </button>
            {showCustomWordCount && (
              <div className="custom-input-group">
                <input
                  type="number"
                  value={customWordCount}
                  onChange={(e) => setCustomWordCount(e.target.value)}
                  placeholder="Enter word count"
                  className="custom-input"
                  min="1"
                  max="1000"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomWordCountSubmit();
                    }
                  }}
                />
                <button
                  className="custom-submit"
                  onClick={handleCustomWordCountSubmit}
                >
                  Set
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSettings;