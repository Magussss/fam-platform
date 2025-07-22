import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SessionPage.css';

function SessionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { duration = 5, anchorType = 'Auditory', anchor = 'Breath' } = location.state || {};

  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [breathPhase, setBreathPhase] = useState('Inhale');

  const [showFeedback, setShowFeedback] = useState(false);
  const [focusRating, setFocusRating] = useState('');
  const [notes, setNotes] = useState('');

  // Timer countdown
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // Session complete → show feedback
  useEffect(() => {
    if (secondsLeft === 0 && !isRunning) {
      setTimeout(() => setShowFeedback(true), 300);
    }
  }, [secondsLeft, isRunning]);

  // Breathing animation cue
  useEffect(() => {
    if (!isRunning || anchorType !== 'Visual' || anchor !== 'Breath') return;

    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev === 'Inhale' ? 'Exhale' : 'Inhale'));
    }, 4000);

    return () => clearInterval(interval);
  }, [isRunning, anchorType, anchor]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const stopSession = () => {
    if (confirm('End session early?')) {
      navigate('/sessions');
    }
  };

  const handleFeedbackSubmit = () => {
    const newEntry = {
      date: new Date().toISOString(),
      duration,
      anchorType,
      anchor,
      focusRating,
      notes,
    };

    const existing = JSON.parse(localStorage.getItem('meditationHistory') || '[]');
    existing.push(newEntry);
    localStorage.setItem('meditationHistory', JSON.stringify(existing));

    alert('Thank you! Your session has been logged.');
    navigate('/progress');
  };

  return (
    <div
      style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: anchorType === 'Visual' ? '#eafaf1' : '#f0f8ff',
        minHeight: '100vh',
      }}
    >
      <h1>🧘 Meditation Session</h1>
      <h2>{anchorType} Anchor: {anchor}</h2>

      {/* Timer */}
      <div
        style={{
          fontSize: '4rem',
          margin: '2rem auto',
          fontFamily: 'monospace',
          width: '200px',
          backgroundColor: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {formatTime(secondsLeft)}
      </div>

      {/* Visual Anchors */}
      {anchorType === 'Visual' && anchor === 'Dot on Screen' && (
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#444',
            margin: '2rem auto',
          }}
        ></div>
      )}

      {anchorType === 'Visual' && anchor === 'Breath' && (
        <div>
          <div className="breathing-circle"></div>
          <h3 style={{ marginTop: '1rem', fontStyle: 'italic', color: '#555' }}>{breathPhase}</h3>
        </div>
      )}

      {/* Auditory Anchors */}
      {anchorType === 'Auditory' && anchor === 'Tibetan Bowl' && (
        <audio autoPlay loop>
          <source src="/tibetan-bowl.mp3" type="audio/mpeg" />
        </audio>
      )}

      {anchorType === 'Auditory' && anchor === 'Breath' && (
        <p style={{ fontStyle: 'italic' }}>Focus on the sound of your breath...</p>
      )}

      {/* End Session Button */}
      {!showFeedback && (
        <button onClick={stopSession} style={{ marginTop: '2rem' }}>
          End Session
        </button>
      )}

      {/* Feedback Prompt */}
      {showFeedback && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #ccc',
          borderRadius: '10px',
          padding: '2rem',
          margin: '2rem auto',
          maxWidth: '400px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          <h2>Session Feedback</h2>

          <label>Focus Rating (0–10):</label><br />
          <input
            type="number"
            min="0"
            max="10"
            value={focusRating}
            onChange={(e) => setFocusRating(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />

          <label>Optional Notes:</label><br />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '0.5rem' }}
          />

          <button onClick={handleFeedbackSubmit} style={{ marginTop: '1rem' }}>
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}

export default SessionPage;
