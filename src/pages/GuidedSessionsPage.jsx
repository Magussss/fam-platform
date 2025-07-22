import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GuidedSessionsPage() {
  const [duration, setDuration] = useState('5');
  const [level, setLevel] = useState('Beginner');
  const [anchorType, setAnchorType] = useState('Auditory');
  const [anchor, setAnchor] = useState('');

  const navigate = useNavigate();

  const auditoryAnchors = ['Breath', 'Tibetan Bowl', 'Metronome'];
  const visualAnchors = ['Dot on Screen', 'Candle Flame', 'Nature Loop'];

  const getAnchorOptions = () => {
    return anchorType === 'Auditory' ? auditoryAnchors : visualAnchors;
  };

  const handleStart = () => {
    if (!anchor) {
      alert("Please select an anchor.");
      return;
    }

    navigate('/session', {
      state: {
        duration: parseInt(duration),
        level,
        anchorType,
        anchor
      }
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧘 Build Your Guided Session</h1>

      <label>
        <strong>Duration:</strong>
        <select value={duration} onChange={(e) => setDuration(e.target.value)} style={{ marginLeft: '1rem' }}>
          <option value="2">2 min</option>
          <option value="5">5 min</option>
          <option value="10">10 min</option>
          <option value="20">20 min</option>
        </select>
      </label>
      <br /><br />

      <label>
        <strong>Experience Level:</strong>
        <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ marginLeft: '1rem' }}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </label>
      <br /><br />

      <label>
        <strong>Anchor Type:</strong>
        <select value={anchorType} onChange={(e) => { setAnchorType(e.target.value); setAnchor(''); }} style={{ marginLeft: '1rem' }}>
          <option>Auditory</option>
          <option>Visual</option>
        </select>
      </label>
      <br /><br />

      <label>
        <strong>Choose Anchor:</strong>
        <select value={anchor} onChange={(e) => setAnchor(e.target.value)} style={{ marginLeft: '1rem' }}>
          <option value="" disabled>Select an anchor</option>
          {getAnchorOptions().map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </label>
      <br /><br />

      <button onClick={handleStart} disabled={!anchor} style={{ padding: '0.5rem 1.5rem', fontSize: '1rem' }}>
        ▶ Start Session
      </button>
    </div>
  );
}

export default GuidedSessionsPage;
