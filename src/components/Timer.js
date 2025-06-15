import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/timer.css';

const Timer = ({ 
  duration, 
  isActive, 
  onStart, 
  onTimeUp, 
  onTick,
  showCountdown = false,
  countdownDuration = 3,
  compact = false,
  inline = false 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownTime, setCountdownTime] = useState(countdownDuration);
  const intervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stopCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setIsCountingDown(false);
    setCountdownTime(countdownDuration);
  }, [countdownDuration]);

  const startTimer = useCallback(() => {
    if (onStart) onStart();
    
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        
        if (onTick) onTick(newTime);
        
        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
  }, [onStart, onTick, onTimeUp]);

  const startCountdown = useCallback(() => {
    setIsCountingDown(true);
    setCountdownTime(countdownDuration);
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdownTime(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          setIsCountingDown(false);
          startTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [countdownDuration, startTimer]);

  // Start countdown when isActive becomes true and showCountdown is enabled
  useEffect(() => {
    if (isActive && showCountdown && !isCountingDown) {
      startCountdown();
    } else if (isActive && !showCountdown) {
      startTimer();
    } else if (!isActive) {
      stopTimer();
      stopCountdown();
    }

    return () => {
      stopTimer();
      stopCountdown();
    };
  }, [isActive, showCountdown, isCountingDown, startCountdown, startTimer, stopTimer, stopCountdown]);

  const formatTime = (seconds) => {
    return `${seconds}s`;
  };

  const getTimeColor = () => {
    if (isCountingDown) return 'countdown';
    if (timeLeft <= 10) return 'critical';
    if (timeLeft <= 30) return 'warning';
    return 'normal';
  };

  if (isCountingDown) {
    return (
      <div className={`timer-container ${inline ? 'inline' : 'standalone'}`}>
        <div className="timer-display countdown">
          <div className="countdown-number">{countdownTime}</div>
          <div className="countdown-text">Get ready...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`timer-container ${inline ? 'inline' : 'standalone'}`}>
      <div className={`timer-display ${getTimeColor()} ${compact ? 'compact' : ''}`}>
        {!compact && <div className="timer-label">Time</div>}
        <div className={`timer-time ${compact ? 'compact' : ''}`}>{formatTime(timeLeft)}</div>
        {!compact && timeLeft <= 10 && timeLeft > 0 && (
          <div className="timer-warning">Time's almost up!</div>
        )}
      </div>
    </div>
  );
};

export default Timer;