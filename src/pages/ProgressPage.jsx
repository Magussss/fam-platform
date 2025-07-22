import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

function ProgressPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('meditationHistory') || '[]');
    setHistory(data.reverse());
  }, []);

  const focusEntries = history.filter(entry => entry.focusRating !== '');

  // === AVERAGE FOCUS & TRENDS ===
  const getWeekNumber = (date) => {
    const d = new Date(date);
    const start = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d - start) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  const grouped = focusEntries.reduce((acc, entry) => {
    const week = getWeekNumber(entry.date);
    const year = new Date(entry.date).getFullYear();
    const key = `${year}-W${week}`;
    acc[key] = acc[key] || [];
    acc[key].push(Number(entry.focusRating));
    return acc;
  }, {});

  const allScores = focusEntries.map(e => Number(e.focusRating));
  const averageAllTime = allScores.length > 0
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
    : 'N/A';

  const weeks = Object.keys(grouped).sort(); // oldest to newest
  const thisWeek = weeks[weeks.length - 1];
  const lastWeek = weeks[weeks.length - 2];

  const avgThisWeek = thisWeek
    ? (grouped[thisWeek].reduce((a, b) => a + b, 0) / grouped[thisWeek].length).toFixed(1)
    : null;

  const avgLastWeek = lastWeek
    ? (grouped[lastWeek].reduce((a, b) => a + b, 0) / grouped[lastWeek].length).toFixed(1)
    : null;

  const trend =
    avgThisWeek && avgLastWeek
      ? ((avgThisWeek - avgLastWeek) / avgLastWeek * 100).toFixed(1)
      : null;

  // === CHART ===
  const chartData = {
    labels: focusEntries.map((entry) =>
      new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Focus Rating',
        data: focusEntries.map((entry) => Number(entry.focusRating)),
        fill: false,
        borderColor: '#36a2eb',
        backgroundColor: '#36a2eb',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Focus Progress Over Time',
        font: { size: 20 },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: { stepSize: 1 },
        title: { display: true, text: 'Focus Rating' },
      },
    },
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Your Session History</h1>

      {history.length === 0 ? (
        <p>No sessions logged yet. Try one from the Sessions page!</p>
      ) : (
        <>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2>📊 Insights</h2>
            <p><strong>Average Focus (All Time):</strong> {averageAllTime}</p>
            {avgThisWeek && avgLastWeek && (
              <p>
                <strong>This Week vs Last Week:</strong> {avgThisWeek} → {avgLastWeek}{' '}
                ({trend > 0 ? '🔼' : trend < 0 ? '🔽' : '⏸'} {Math.abs(trend)}%)
              </p>
            )}
          </div>

          <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <Line data={chartData} options={chartOptions} />
          </div>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {history.map((entry, index) => (
              <li key={index} style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: '#f8f8f8',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
              }}>
                <strong>{new Date(entry.date).toLocaleString()}</strong><br />
                ⏱ Duration: {entry.duration} min<br />
                🔎 Anchor: {entry.anchorType} — {entry.anchor}<br />
                🎯 Focus: {entry.focusRating || 'N/A'}<br />
                📝 Notes: {entry.notes || '—'}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ProgressPage;
