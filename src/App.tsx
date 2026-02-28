import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import GPACalculator from './components/GPACalculator';
import CGPACalculator from './components/CGPACalculator';
import Analytics from './components/Analytics';
import GoalPredictor from './components/GoalPredictor';
import Settings from './components/Settings';
import { Semester, AppSettings } from './types';
import { loadFromStorage, saveToStorage } from './utils/storage';
import './styles/App.css';

/**
 * Main App component - manages application state and routing
 */
function App() {
  // Active view state for navigation
  const [activeView, setActiveView] = useState<string>('dashboard');
  
  // Semesters data - stores all academic records
  const [semesters, setSemesters] = useState<Semester[]>([]);
  
  // Application settings - theme and grading scale
  const [settings, setSettings] = useState<AppSettings>({
    gradingScale: 4.0,
    theme: 'light',
  });

  // Welcome modal state for new users
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  // Load saved data from localStorage on initial mount
  useEffect(() => {
    const savedSemesters = loadFromStorage<Semester[]>('semesters') || [];
    const savedSettings = loadFromStorage<AppSettings>('settings');
    const hasVisited = loadFromStorage<boolean>('hasVisited');
    
    if (savedSettings) {
      setSemesters(savedSemesters);
      setSettings(savedSettings);
      document.body.className = savedSettings.theme;
    } else {
      // New user - show welcome modal
      setShowWelcome(true);
    }
    
    // Mark as visited if not already
    if (!hasVisited) {
      saveToStorage('hasVisited', true);
    }
  }, []);

  // Save semesters to localStorage whenever they change
  useEffect(() => {
    saveToStorage('semesters', semesters);
  }, [semesters]);

  // Save settings to localStorage and apply theme whenever settings change
  useEffect(() => {
    saveToStorage('settings', settings);
    document.body.className = settings.theme;
  }, [settings]);

  /**
   * Adds a new semester to the list
   */
  const addSemester = (semester: Semester) => {
    setSemesters([...semesters, semester]);
  };

  /**
   * Updates an existing semester
   */
  const updateSemester = (id: string, updated: Semester) => {
    setSemesters(semesters.map(s => s.id === id ? updated : s));
  };

  /**
   * Deletes a semester by ID
   */
  const deleteSemester = (id: string) => {
    setSemesters(semesters.filter(s => s.id !== id));
  };

  /**
   * Resets all data and shows welcome banner
   */
  const handleResetAll = () => {
    setSemesters([]);
    setShowWelcome(true);
  };

  /**
   * Handles navigation
   */
  const handleNavigate = (view: string) => {
    setActiveView(view);
  };

  /**
   * Handles grading scale selection from welcome modal
   */
  const handleScaleSelection = (scale: number) => {
    const newSettings = { ...settings, gradingScale: scale };
    setSettings(newSettings);
    saveToStorage('settings', newSettings);
    setShowWelcome(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <img src="/images/app-icon.png" alt="GPA Calculator" className="header-icon" />
            <h1>GPA Calculator</h1>
          </div>
        </div>
        <nav className="nav-menu desktop-nav">
          <button onClick={() => handleNavigate('dashboard')} className={activeView === 'dashboard' ? 'active' : ''}>Dashboard</button>
          <button onClick={() => handleNavigate('gpa')} className={activeView === 'gpa' ? 'active' : ''}>GPA Calculator</button>
          <button onClick={() => handleNavigate('cgpa')} className={activeView === 'cgpa' ? 'active' : ''}>CGPA Tracker</button>
          <button onClick={() => handleNavigate('analytics')} className={activeView === 'analytics' ? 'active' : ''}>Analytics</button>
          <button onClick={() => handleNavigate('goals')} className={activeView === 'goals' ? 'active' : ''}>Goal Predictor</button>
          <button onClick={() => handleNavigate('settings')} className={activeView === 'settings' ? 'active' : ''}>Settings</button>
        </nav>
      </header>

      <main className="app-main">
        {activeView === 'dashboard' && <Dashboard semesters={semesters} onNavigate={setActiveView} gradingScale={settings.gradingScale} showWelcome={showWelcome} onSelectScale={handleScaleSelection} />}
        {activeView === 'gpa' && <GPACalculator onSave={addSemester} gradingScale={settings.gradingScale} onNavigate={setActiveView} />}
        {activeView === 'cgpa' && <CGPACalculator semesters={semesters} onUpdate={updateSemester} onDelete={deleteSemester} gradingScale={settings.gradingScale} />}
        {activeView === 'analytics' && <Analytics semesters={semesters} />}
        {activeView === 'goals' && <GoalPredictor semesters={semesters} gradingScale={settings.gradingScale} />}
        {activeView === 'settings' && <Settings settings={settings} onUpdate={setSettings} onReset={handleResetAll} onNavigate={setActiveView} />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        <button onClick={() => handleNavigate('dashboard')} className={activeView === 'dashboard' ? 'active' : ''}>
          <span className="nav-icon">📊</span>
          <span className="nav-label">Dashboard</span>
        </button>
        <button onClick={() => handleNavigate('gpa')} className={activeView === 'gpa' ? 'active' : ''}>
          <span className="nav-icon">🧮</span>
          <span className="nav-label">GPA</span>
        </button>
        <button onClick={() => handleNavigate('cgpa')} className={activeView === 'cgpa' ? 'active' : ''}>
          <span className="nav-icon">📚</span>
          <span className="nav-label">CGPA</span>
        </button>
        <button onClick={() => handleNavigate('analytics')} className={activeView === 'analytics' ? 'active' : ''}>
          <span className="nav-icon">📈</span>
          <span className="nav-label">Analytics</span>
        </button>
        <button onClick={() => handleNavigate('goals')} className={activeView === 'goals' ? 'active' : ''}>
          <span className="nav-icon">🎯</span>
          <span className="nav-label">Goals</span>
        </button>
        <button onClick={() => handleNavigate('settings')} className={activeView === 'settings' ? 'active' : ''}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
