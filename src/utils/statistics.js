/**
 * Calculate Words Per Minute (WPM)
 * Standard calculation: (characters typed / 5) / (time in minutes)
 * Using 5 characters as average word length
 */
export const calculateWPM = (totalCharacters, timeElapsedSeconds) => {
  if (timeElapsedSeconds === 0) return 0;
  const timeInMinutes = timeElapsedSeconds / 60;
  const wordsTyped = totalCharacters / 5;
  return Math.round(wordsTyped / timeInMinutes);
};

/**
 * Calculate Raw WPM (including errors)
 * Based on total characters typed regardless of accuracy
 */
export const calculateRawWPM = (totalCharactersTyped, timeElapsedSeconds) => {
  if (timeElapsedSeconds === 0) return 0;
  const timeInMinutes = timeElapsedSeconds / 60;
  const wordsTyped = totalCharactersTyped / 5;
  return Math.round(wordsTyped / timeInMinutes);
};

/**
 * Calculate Net WPM (accuracy-adjusted)
 * Net WPM = Raw WPM - (errors / time in minutes)
 */
export const calculateNetWPM = (totalCharactersTyped, errors, timeElapsedSeconds) => {
  if (timeElapsedSeconds === 0) return 0;
  const rawWPM = calculateRawWPM(totalCharactersTyped, timeElapsedSeconds);
  const timeInMinutes = timeElapsedSeconds / 60;
  const errorPenalty = errors / timeInMinutes;
  return Math.max(0, Math.round(rawWPM - errorPenalty));
};

/**
 * Calculate typing accuracy as a percentage
 * Accuracy = (correct characters / total characters) * 100
 */
export const calculateAccuracy = (correctCharacters, totalCharacters) => {
  if (totalCharacters === 0) return 100;
  const accuracy = (correctCharacters / totalCharacters) * 100;
  return Math.round(accuracy * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate consistency score based on WPM variation over time
 * Lower variation = higher consistency
 * Returns a score from 0-100 where 100 is perfectly consistent
 */
export const calculateConsistency = (wpmHistory) => {
  if (!wpmHistory || wpmHistory.length < 2) return 100;
  
  const mean = wpmHistory.reduce((sum, wpm) => sum + wpm, 0) / wpmHistory.length;
  const variance = wpmHistory.reduce((sum, wpm) => sum + Math.pow(wpm - mean, 2), 0) / wpmHistory.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Convert standard deviation to consistency score
  // Lower standard deviation = higher consistency
  // Normalize to 0-100 scale (assuming max reasonable std dev is ~20 WPM)
  const maxStdDev = 20;
  const consistencyScore = Math.max(0, 100 - (standardDeviation / maxStdDev) * 100);
  return Math.round(consistencyScore);
};

/**
 * Calculate typing rhythm consistency
 * Measures consistency of time between keystrokes
 */
export const calculateRhythmConsistency = (keystrokeTimestamps) => {
  if (!keystrokeTimestamps || keystrokeTimestamps.length < 3) return 100;
  
  const intervals = [];
  for (let i = 1; i < keystrokeTimestamps.length; i++) {
    intervals.push(keystrokeTimestamps[i] - keystrokeTimestamps[i - 1]);
  }
  
  const meanInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - meanInterval, 2), 0) / intervals.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Convert to consistency score (lower deviation = higher score)
  const maxStdDev = 200; // milliseconds
  const rhythmScore = Math.max(0, 100 - (standardDeviation / maxStdDev) * 100);
  return Math.round(rhythmScore);
};

/**
 * Analyze typing errors by type
 * Returns breakdown of different error types
 */
export const analyzeErrors = (typedCharacters, targetText) => {
  const errors = {
    substitutions: 0,  // Wrong character
    omissions: 0,      // Missing character
    insertions: 0,     // Extra character
    total: 0
  };
  
  let typedIndex = 0;
  let targetIndex = 0;
  
  while (typedIndex < typedCharacters.length && targetIndex < targetText.length) {
    const typedChar = typedCharacters[typedIndex];
    const targetChar = targetText[targetIndex];
    
    if (typedChar === targetChar) {
      // Correct character
      typedIndex++;
      targetIndex++;
    } else {
      // Error detected - determine type
      if (typedIndex + 1 < typedCharacters.length && 
          typedCharacters[typedIndex + 1] === targetChar) {
        // Insertion error (extra character)
        errors.insertions++;
        typedIndex++;
      } else if (targetIndex + 1 < targetText.length && 
                 typedChar === targetText[targetIndex + 1]) {
        // Omission error (missing character)
        errors.omissions++;
        targetIndex++;
      } else {
        // Substitution error (wrong character)
        errors.substitutions++;
        typedIndex++;
        targetIndex++;
      }
      errors.total++;
    }
  }
  
  // Handle remaining characters
  if (typedIndex < typedCharacters.length) {
    errors.insertions += typedCharacters.length - typedIndex;
    errors.total += typedCharacters.length - typedIndex;
  }
  
  if (targetIndex < targetText.length) {
    errors.omissions += targetText.length - targetIndex;
    errors.total += targetText.length - targetIndex;
  }
  
  return errors;
};

/**
 * Calculate words per minute over a sliding time window
 * Useful for real-time WPM tracking during typing
 */
export const calculateSlidingWPM = (typedCharacters, timeWindow = 10) => {
  if (!typedCharacters || typedCharacters.length === 0) return 0;
  
  const now = Date.now();
  const windowStart = now - (timeWindow * 1000);
  
  // Count characters typed within the time window
  const recentCharacters = typedCharacters.filter(char => 
    char && char.timestamp && char.timestamp >= windowStart
  ).length;
  
  return calculateWPM(recentCharacters, timeWindow);
};

/**
 * Generate comprehensive typing statistics
 * Returns all relevant metrics in one object
 */
export const generateTypingStats = ({
  typedCharacters,
  targetText,
  timeElapsedSeconds,
  keystrokeTimestamps = [],
  wpmHistory = []
}) => {
  const totalTyped = typedCharacters.length;
  const correctCharacters = typedCharacters.filter(char => char && char.status === 'correct').length;
  const errors = analyzeErrors(typedCharacters.filter(c => c && c.char).map(c => c.char).join(''), targetText);
  
  return {
    wpm: calculateWPM(correctCharacters, timeElapsedSeconds),
    rawWPM: calculateRawWPM(totalTyped, timeElapsedSeconds),
    netWPM: calculateNetWPM(totalTyped, errors.total, timeElapsedSeconds),
    accuracy: calculateAccuracy(correctCharacters, totalTyped),
    consistency: calculateConsistency(wpmHistory),
    rhythmConsistency: calculateRhythmConsistency(keystrokeTimestamps),
    errors: errors,
    charactersTyped: totalTyped,
    correctCharacters: correctCharacters,
    timeElapsed: timeElapsedSeconds
  };
};