import { useState, useEffect, useCallback } from 'react';
import { useKeyboard } from './useKeyboard';
import { generateTypingStats } from '../utils/statistics';

export const useTypingTest = (testSettings, targetText) => {
  const [testState, setTestState] = useState('ready'); // 'ready', 'active', 'completed'
  const [testStartTime, setTestStartTime] = useState(null);
  const [testEndTime, setTestEndTime] = useState(null);
  const [keystrokeTimestamps, setKeystrokeTimestamps] = useState([]);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [testResults, setTestResults] = useState(null);

  const {
    handleKeyDown,
    activeKeys,
    cursorPosition,
    typedCharacters,
    resetEditor
  } = useKeyboard(targetText);

  // Track keystroke timestamps for rhythm analysis
  useEffect(() => {
    if (testState === 'active' && cursorPosition > 0) {
      setKeystrokeTimestamps(prev => [...prev, Date.now()]);
    }
  }, [cursorPosition, testState]);

  // Start test on first keypress
  useEffect(() => {
    if (cursorPosition > 0 && testState === 'ready') {
      setTestState('active');
      setTestStartTime(Date.now());
    }
  }, [cursorPosition, testState]);

  const checkTestCompletion = useCallback(() => {
    if (testSettings.testType === 'wordCount') {
      // Complete when user has typed the required number of words
      const wordsTyped = Math.floor(cursorPosition / 5); // Approximate words
      return wordsTyped >= testSettings.wordCount;
    } else {
      // Duration tests are handled by timer timeout
      // But also complete if user finishes all text
      return cursorPosition >= targetText.length;
    }
  }, [testSettings, cursorPosition, targetText.length]);

  const completeTest = useCallback(() => {
    const endTime = Date.now();
    setTestEndTime(endTime);
    setTestState('completed');

    let timeElapsed = testStartTime ? (endTime - testStartTime) / 1000 : 0;
    
    // For duration tests, use the set duration if timer expired
    if (testSettings.testType === 'duration' && timeElapsed >= testSettings.duration - 1) {
      timeElapsed = testSettings.duration;
    }
    
    // Generate comprehensive test results
    const results = generateTypingStats({
      typedCharacters,
      targetText,
      timeElapsedSeconds: timeElapsed,
      keystrokeTimestamps,
      wpmHistory
    });

    // Add additional metadata
    results.testSettings = testSettings;
    results.testDuration = timeElapsed;
    results.completionStatus = cursorPosition >= targetText.length ? 'completed' : 'timeout';

    setTestResults(results);
    return results;
  }, [
    testStartTime, 
    typedCharacters, 
    targetText, 
    keystrokeTimestamps, 
    wpmHistory, 
    testSettings, 
    cursorPosition
  ]);

  // Handle test completion based on test type
  useEffect(() => {
    if (testState === 'active') {
      const shouldComplete = checkTestCompletion();
      if (shouldComplete) {
        completeTest();
      }
    }
  }, [cursorPosition, testState, testSettings, checkTestCompletion, completeTest]);

  // Update WPM history for consistency calculation
  useEffect(() => {
    if (testState === 'active' && testStartTime) {
      const timeElapsed = (Date.now() - testStartTime) / 1000;
      if (timeElapsed >= 5 && timeElapsed % 2 < 0.1) { // Update every 2 seconds after 5 seconds
        const correctChars = typedCharacters.filter(char => char && char.status === 'correct').length;
        const currentWPM = Math.round((correctChars / 5) / (timeElapsed / 60));
        setWpmHistory(prev => [...prev, currentWPM]);
      }
    }
  }, [testState, testStartTime, typedCharacters]);

  const handleTimerTimeout = useCallback(() => {
    if (testState === 'active') {
      return completeTest();
    }
  }, [testState, completeTest]);

  const restartTest = useCallback(() => {
    setTestState('ready');
    setTestStartTime(null);
    setTestEndTime(null);
    setKeystrokeTimestamps([]);
    setWpmHistory([]);
    setTestResults(null);
    resetEditor();
  }, [resetEditor]);

  const getElapsedTime = useCallback(() => {
    if (!testStartTime) return 0;
    const endTime = testEndTime || Date.now();
    return Math.floor((endTime - testStartTime) / 1000);
  }, [testStartTime, testEndTime]);

  const getProgress = useCallback(() => {
    if (testSettings.testType === 'wordCount') {
      const wordsTyped = Math.floor(cursorPosition / 5);
      return Math.min(100, (wordsTyped / testSettings.wordCount) * 100);
    } else {
      return Math.min(100, (cursorPosition / targetText.length) * 100);
    }
  }, [testSettings, cursorPosition, targetText.length]);

  const getCurrentWPM = useCallback(() => {
    if (!testStartTime || testState !== 'active') return 0;
    const timeElapsed = (Date.now() - testStartTime) / 1000;
    if (timeElapsed < 1) return 0;
    
    const correctChars = typedCharacters.filter(char => char && char.status === 'correct').length;
    return Math.round((correctChars / 5) / (timeElapsed / 60));
  }, [testStartTime, testState, typedCharacters]);

  const getCurrentAccuracy = useCallback(() => {
    const totalChars = typedCharacters.length;
    if (totalChars === 0) return 100;
    
    const correctChars = typedCharacters.filter(char => char && char.status === 'correct').length;
    return Math.round((correctChars / totalChars) * 100);
  }, [typedCharacters]);

  // Only reset when component first mounts or when explicitly restarted
  // Don't auto-reset during active tests

  return {
    // Test state
    testState,
    testResults,
    
    // Keyboard integration
    handleKeyDown,
    activeKeys,
    cursorPosition,
    typedCharacters,
    
    // Test controls
    restartTest,
    handleTimerTimeout,
    
    // Progress tracking
    getProgress,
    getElapsedTime,
    getCurrentWPM,
    getCurrentAccuracy,
    
    // Test completion
    completeTest,
    
    // Real-time stats
    wpmHistory,
    keystrokeTimestamps
  };
};