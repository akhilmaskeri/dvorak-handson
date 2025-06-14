/**
 * Math and calculation utilities for typing analysis
 */

/**
 * Calculate percentile rank of a value in an array
 * Returns what percentile the value represents (0-100)
 */
export const calculatePercentile = (value, array) => {
  if (!array || array.length === 0) return 50;
  
  const sorted = [...array].sort((a, b) => a - b);
  const below = sorted.filter(v => v < value).length;
  const equal = sorted.filter(v => v === value).length;
  
  const percentile = ((below + equal / 2) / sorted.length) * 100;
  return Math.round(percentile);
};

/**
 * Calculate moving average over a specified window
 * Useful for smoothing WPM data over time
 */
export const calculateMovingAverage = (data, windowSize = 5) => {
  if (!data || data.length === 0) return [];
  if (windowSize <= 0) return data;
  
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = data.slice(start, i + 1);
    const average = window.reduce((sum, val) => sum + val, 0) / window.length;
    result.push(Math.round(average * 100) / 100);
  }
  
  return result;
};

/**
 * Calculate exponential moving average
 * Gives more weight to recent values
 */
export const calculateEMA = (data, smoothingFactor = 0.2) => {
  if (!data || data.length === 0) return [];
  
  const result = [data[0]];
  for (let i = 1; i < data.length; i++) {
    const ema = smoothingFactor * data[i] + (1 - smoothingFactor) * result[i - 1];
    result.push(Math.round(ema * 100) / 100);
  }
  
  return result;
};

/**
 * Calculate standard deviation of an array
 */
export const calculateStandardDeviation = (data) => {
  if (!data || data.length <= 1) return 0;
  
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  return Math.sqrt(variance);
};

/**
 * Calculate coefficient of variation (relative variability)
 * Returns CV as a percentage
 */
export const calculateCoefficientOfVariation = (data) => {
  if (!data || data.length === 0) return 0;
  
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  if (mean === 0) return 0;
  
  const stdDev = calculateStandardDeviation(data);
  return Math.round((stdDev / mean) * 100 * 100) / 100;
};

/**
 * Find outliers in data using IQR method
 * Returns indices of outlier values
 */
export const findOutliers = (data) => {
  if (!data || data.length < 4) return [];
  
  const sorted = [...data].sort((a, b) => a - b);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  const iqr = q3 - q1;
  
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  const outlierIndices = [];
  data.forEach((value, index) => {
    if (value < lowerBound || value > upperBound) {
      outlierIndices.push(index);
    }
  });
  
  return outlierIndices;
};

/**
 * Calculate trend direction and strength
 * Returns {direction: 'up'|'down'|'stable', strength: 0-1}
 */
export const calculateTrend = (data, minPoints = 5) => {
  if (!data || data.length < minPoints) {
    return { direction: 'stable', strength: 0 };
  }
  
  // Use linear regression to calculate trend
  const n = data.length;
  const sumX = (n * (n - 1)) / 2; // Sum of indices 0,1,2,...,n-1
  const sumY = data.reduce((sum, val) => sum + val, 0);
  const sumXY = data.reduce((sum, val, index) => sum + index * val, 0);
  const sumXX = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares of indices
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  // Determine direction
  let direction = 'stable';
  if (slope > 0.1) direction = 'up';
  else if (slope < -0.1) direction = 'down';
  
  // Calculate strength (normalized slope)
  const dataRange = Math.max(...data) - Math.min(...data);
  const strength = Math.min(1, Math.abs(slope * n) / dataRange);
  
  return {
    direction,
    strength: Math.round(strength * 100) / 100,
    slope: Math.round(slope * 100) / 100
  };
};

/**
 * Calculate performance score based on multiple metrics
 * Combines WPM, accuracy, and consistency into a single score
 */
export const calculatePerformanceScore = (wpm, accuracy, consistency) => {
  // Normalize each metric to 0-100 scale
  const normalizedWPM = Math.min(100, (wpm / 100) * 100); // Assuming 100 WPM is excellent
  const normalizedAccuracy = accuracy; // Already 0-100
  const normalizedConsistency = consistency; // Already 0-100
  
  // Weighted combination (accuracy is most important)
  const weights = { wpm: 0.4, accuracy: 0.4, consistency: 0.2 };
  const score = 
    normalizedWPM * weights.wpm +
    normalizedAccuracy * weights.accuracy +
    normalizedConsistency * weights.consistency;
  
  return Math.round(score);
};

/**
 * Calculate improvement rate over time
 * Returns percentage improvement per session/time period
 */
export const calculateImprovementRate = (historicalScores, timeWindow = 10) => {
  if (!historicalScores || historicalScores.length < 2) return 0;
  
  const recent = historicalScores.slice(-timeWindow);
  if (recent.length < 2) return 0;
  
  const firstScore = recent[0];
  const lastScore = recent[recent.length - 1];
  
  if (firstScore === 0) return 0;
  
  const improvementRate = ((lastScore - firstScore) / firstScore) * 100;
  return Math.round(improvementRate * 100) / 100;
};

/**
 * Calculate typing burst analysis
 * Identifies periods of fast/slow typing
 */
export const analyzeBursts = (keystrokeTimestamps, thresholdMs = 500) => {
  if (!keystrokeTimestamps || keystrokeTimestamps.length < 3) {
    return { bursts: [], pauses: [], avgBurstLength: 0, avgPauseLength: 0 };
  }
  
  const intervals = [];
  for (let i = 1; i < keystrokeTimestamps.length; i++) {
    intervals.push(keystrokeTimestamps[i] - keystrokeTimestamps[i - 1]);
  }
  
  const bursts = [];
  const pauses = [];
  let currentBurst = { start: 0, length: 1 };
  
  intervals.forEach((interval, index) => {
    if (interval > thresholdMs) {
      // End current burst
      if (currentBurst.length > 1) {
        bursts.push(currentBurst);
      }
      // Record pause
      pauses.push({ index: index + 1, duration: interval });
      // Start new burst
      currentBurst = { start: index + 1, length: 1 };
    } else {
      currentBurst.length++;
    }
  });
  
  // Add final burst if it exists
  if (currentBurst.length > 1) {
    bursts.push(currentBurst);
  }
  
  const avgBurstLength = bursts.length > 0 
    ? bursts.reduce((sum, burst) => sum + burst.length, 0) / bursts.length 
    : 0;
  
  const avgPauseLength = pauses.length > 0
    ? pauses.reduce((sum, pause) => sum + pause.duration, 0) / pauses.length
    : 0;
  
  return {
    bursts,
    pauses,
    avgBurstLength: Math.round(avgBurstLength * 100) / 100,
    avgPauseLength: Math.round(avgPauseLength)
  };
};

/**
 * Calculate typing difficulty score for a given text
 * Based on character frequency, bigram difficulty, etc.
 */
export const calculateTextDifficulty = (text) => {
  if (!text) return 50;
  
  // Common letter frequencies in English (approximate)
  const letterFrequency = {
    'e': 12.7, 't': 9.1, 'a': 8.2, 'o': 7.5, 'i': 7.0, 'n': 6.7, 's': 6.3,
    'h': 6.1, 'r': 6.0, 'd': 4.3, 'l': 4.0, 'c': 2.8, 'u': 2.8, 'm': 2.4,
    'w': 2.4, 'f': 2.2, 'g': 2.0, 'y': 2.0, 'p': 1.9, 'b': 1.3, 'v': 1.0,
    'k': 0.8, 'j': 0.15, 'x': 0.15, 'q': 0.10, 'z': 0.07
  };
  
  let difficultySum = 0;
  let charCount = 0;
  
  for (const char of text.toLowerCase()) {
    if (char >= 'a' && char <= 'z') {
      // More frequent letters are easier (lower difficulty)
      const frequency = letterFrequency[char] || 1;
      difficultySum += Math.max(1, 13 - frequency); // Invert frequency to difficulty
      charCount++;
    } else if (char === ' ') {
      difficultySum += 2; // Spaces are easy
      charCount++;
    } else {
      difficultySum += 8; // Punctuation/numbers are harder
      charCount++;
    }
  }
  
  const avgDifficulty = charCount > 0 ? difficultySum / charCount : 5;
  
  // Normalize to 0-100 scale
  return Math.min(100, Math.max(0, Math.round((avgDifficulty / 10) * 100)));
};