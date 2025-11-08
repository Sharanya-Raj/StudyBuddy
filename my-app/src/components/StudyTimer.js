import React, { useState, useEffect } from 'react';

export default function StudyTimer({ onClose }) {
  const [selectedTime, setSelectedTime] = useState(null); // in minutes
  const [timeLeft, setTimeLeft] = useState(null); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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
      const customMinutes = prompt('Enter study time in minutes:');
      if (customMinutes && !isNaN(customMinutes) && customMinutes > 0) {
        setSelectedTime(Number(customMinutes));
        setTimeLeft(Number(customMinutes) * 60);
      }
    } else {
      setSelectedTime(minutes);
      setTimeLeft(minutes * 60);
    }
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
        <button className="secondary-btn" onClick={onClose}>Cancel</button>
      </div>
    );
  }

  return (
    <div className="study-timer">
      <div className="timer-display">{formatTime(timeLeft)}</div>
      {isComplete ? (
        <div className="timer-complete">
          <h3>Great job! Study session complete! 🎉</h3>
          <div className="timer-controls">
            <button className="primary-btn" onClick={() => {
              setSelectedTime(null);
              setTimeLeft(null);
              setIsRunning(false);
              setIsComplete(false);
            }}>Start New Session</button>
            <button className="secondary-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      ) : (
        <div className="timer-controls">
          {!isRunning ? (
            <button className="primary-btn" onClick={() => setIsRunning(true)}>
              {timeLeft === selectedTime * 60 ? 'Start' : 'Resume'}
            </button>
          ) : (
            <button className="primary-btn" onClick={() => setIsRunning(false)}>Pause</button>
          )}
          <button className="secondary-btn" onClick={() => {
            setSelectedTime(null);
            setTimeLeft(null);
            setIsRunning(false);
            setIsComplete(false);
          }}>Reset</button>
          <button className="secondary-btn" onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
}