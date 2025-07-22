import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';
import GuidedSessionsPage from './pages/GuidedSessionsPage';
import AnchorLibraryPage from './pages/AnchorLibraryPage';
import ProgressPage from './pages/ProgressPage';
import SessionPage from './pages/SessionPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/sessions" element={<GuidedSessionsPage />} />
        <Route path="/anchors" element={<AnchorLibraryPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/session" element={<SessionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
