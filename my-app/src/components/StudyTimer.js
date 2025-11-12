import React, { useState, useEffect } from 'react';

export default function StudyTimer({ onClose }) {
  const [selectedTime, setSelectedTime] = useState(null); // in minutes
  const [timeLeft, setTimeLeft] = useState(null); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTime, setCustomTime] = useState({ hours: '00', minutes: '00', seconds: '00' });

  const timeOptions = [
    { label: '25 minutes', value: 25 },
    { label: '45 minutes', value: 45 },
    { label: '60 minutes', value: 60 },
    { label: '90 minutes', value: 90 },
    { label: 'Custom', value: 'custom' }
  ];

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setIsComplete(true);
      // Play a sound when timer completes
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  function handleTimeSelect(minutes) {
    if (minutes === 'custom') {
      setShowCustomInput(true);
      setSelectedTime(null);
      setTimeLeft(null);
    } else {
      setShowCustomInput(false);
      setSelectedTime(minutes);
      setTimeLeft(minutes * 60);
    }
  }

  function handleCustomTimeChange(e, unit) {
    const input = e.target.value;
    
    // Allow empty input temporarily
    if (input === '') {
      setCustomTime(prev => ({ ...prev, [unit]: '00' }));
      return;
    }

    // Remove any non-digits
    const digits = input.replace(/\D/g, '');
    
    const maxValues = {
      hours: 23,
      minutes: 59,
      seconds: 59
    };

    // Convert to number for validation
    let numValue = parseInt(digits, 10);

    // Apply max value constraints
    if (numValue > maxValues[unit]) {
      numValue = maxValues[unit];
    }

    // Format the value
    const formattedValue = numValue.toString().padStart(2, '0');
    setCustomTime(prev => ({ ...prev, [unit]: formattedValue }));
  }

  function startCustomTimer() {
    const hours = Number(customTime.hours);
    const minutes = Number(customTime.minutes);
    const seconds = Number(customTime.seconds);
    
    if (hours === 0 && minutes === 0 && seconds === 0) {
      return;
    }

    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    setSelectedTime(totalSeconds / 60);
    setTimeLeft(totalSeconds);
    setShowCustomInput(false);
  }

  function formatTime(seconds) {
    if (!seconds) return '--:--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }

  if (!selectedTime) {
    return (
      <div className="study-timer">
        <h2>Let's Study Today!</h2>
        <p className="note">Select your study session duration</p>
        <div className="time-options">
          {timeOptions.map(option => (
            <button 
              key={option.value} 
              className="time-option-btn"
              onClick={() => handleTimeSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {showCustomInput && (
          <div className="custom-time-inputs">
            <div className="time-input-group">
              <input
                type="number"
                className="time-input"
                value={customTime.hours}
                onChange={(e) => handleCustomTimeChange(e, 'hours')}
                min="0"
                max="23"
                step="1"
                autoComplete="off"
              />
              <span className="time-input-label">Hours</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-input-group">
              <input
                type="number"
                className="time-input"
                value={customTime.minutes}
                onChange={(e) => handleCustomTimeChange(e, 'minutes')}
                min="0"
                max="59"
                step="1"
                autoComplete="off"
              />
              <span className="time-input-label">Minutes</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-input-group">
              <input
                type="number"
                className="time-input"
                value={customTime.seconds}
                onChange={(e) => handleCustomTimeChange(e, 'seconds')}
                min="0"
                max="59"
                step="1"
                autoComplete="off"
              />
              <span className="time-input-label">Seconds</span>
            </div>
          </div>
        )}
        
        {showCustomInput && (
          <div className="timer-controls">
            <button className="primary-btn timer-btn" onClick={startCustomTimer}>Start Custom Timer</button>
            <button className="secondary-btn timer-btn" onClick={() => {
              setShowCustomInput(false);
              setCustomTime({ hours: '00', minutes: '00', seconds: '00' });
            }}>Cancel</button>
          </div>
        )}
        
        {!showCustomInput && <button className="secondary-btn" onClick={onClose}>Cancel</button>}
      </div>
    );
  }

  // Calculate circle progress
  const calculateProgress = () => {
    if (!selectedTime || !timeLeft) return 0;
    const totalSeconds = selectedTime * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const progress = calculateProgress();
  const circumference = 2 * Math.PI * 90; // Circle radius is 90
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="study-timer">
      <div className="timer-circle-container">
        <svg className="timer-circle" viewBox="0 0 200 200">
          <circle 
            className="timer-circle-bg"
            cx="100" 
            cy="100" 
            r="90"
          />
          <circle 
            className="timer-circle-progress"
            cx="100" 
            cy="100" 
            r="90"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
          />
        </svg>
        <div className="timer-circle-text">
          {formatTime(timeLeft)}
        </div>
      </div>

      {isComplete ? (
        <div className="timer-complete">
          <h3>Great job! Study session complete! 🎉</h3>
          <div className="timer-controls">
            <button className="primary-btn timer-btn" onClick={() => {
              setSelectedTime(null);
              setTimeLeft(null);
              setIsRunning(false);
              setIsComplete(false);
              setCustomTime({ hours: '00', minutes: '00', seconds: '00' });
            }}>Start New Session</button>
            <button className="secondary-btn timer-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      ) : (
        <div className="timer-controls">
          {!isRunning ? (
            <button className="primary-btn timer-btn" onClick={() => setIsRunning(true)}>
              {timeLeft === selectedTime * 60 ? 'Start' : 'Resume'}
            </button>
          ) : (
            <button className="primary-btn timer-btn" onClick={() => setIsRunning(false)}>Pause</button>
          )}
          <button className="secondary-btn timer-btn" onClick={() => {
            setSelectedTime(null);
            setTimeLeft(null);
            setIsRunning(false);
            setIsComplete(false);
            setCustomTime({ hours: '00', minutes: '00', seconds: '00' });
          }}>Reset</button>
          <button className="secondary-btn timer-btn" onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
}