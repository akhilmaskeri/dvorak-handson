import React from 'react';
import '../styles/test-analysis.css';

const TestAnalysis = ({ results, onRestart }) => {
  if (!results) {
    return <div>No results available</div>;
  }

  // Debug information
  console.log('TestAnalysis Results:', results);

  return (
    <div className="test-analysis">
      <div className="analysis-header">
        <h2>Test Results</h2>
        <button className="restart-button" onClick={onRestart}>
          Take Another Test
        </button>
      </div>

      <div className="results-grid">
        <div className="result-card primary">
          <div className="result-label">Words Per Minute</div>
          <div className="result-value">{results.wpm || 0}</div>
        </div>

        <div className="result-card">
          <div className="result-label">Accuracy</div>
          <div className="result-value">{results.accuracy || 0}%</div>
        </div>

        <div className="result-card">
          <div className="result-label">Consistency</div>
          <div className="result-value">{results.consistency || 0}%</div>
        </div>

        <div className="result-card">
          <div className="result-label">Characters Typed</div>
          <div className="result-value">{results.charactersTyped || 0}</div>
        </div>

        <div className="result-card">
          <div className="result-label">Correct Characters</div>
          <div className="result-value">{results.correctCharacters || 0}</div>
        </div>

        <div className="result-card">
          <div className="result-label">Test Duration</div>
          <div className="result-value">{Math.round(results.testDuration || 0)}s</div>
        </div>
      </div>

      {results.errors && (
        <div className="error-analysis">
          <h3>Error Analysis</h3>
          <div className="error-stats">
            <div className="error-stat">
              <span className="error-label">Total Errors:</span>
              <span className="error-value">{results.errors.total}</span>
            </div>
            <div className="error-stat">
              <span className="error-label">Substitutions:</span>
              <span className="error-value">{results.errors.substitutions}</span>
            </div>
            <div className="error-stat">
              <span className="error-label">Omissions:</span>
              <span className="error-value">{results.errors.omissions}</span>
            </div>
            <div className="error-stat">
              <span className="error-label">Insertions:</span>
              <span className="error-value">{results.errors.insertions}</span>
            </div>
          </div>
        </div>
      )}

      <div className="test-info">
        <h3>Test Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Test Type:</span>
            <span className="info-value">
              {results.testSettings?.testType === 'duration' ? 'Timed Test' : 'Word Count Test'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Target:</span>
            <span className="info-value">
              {results.testSettings?.testType === 'duration' 
                ? `${results.testSettings.duration} seconds`
                : `${results.testSettings.wordCount} words`
              }
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Completion:</span>
            <span className="info-value">
              {results.completionStatus === 'completed' ? 'Finished' : 'Time Up'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAnalysis;