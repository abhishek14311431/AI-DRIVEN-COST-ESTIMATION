import { useState, useEffect } from 'react';
import { projectConfigs } from './constants/projectConfigs';
import Dashboard from './pages/Dashboard';
import ProjectSelection from './pages/ProjectSelection';
import ProjectWizard from './pages/ProjectWizard';
import EstimationResult from './pages/EstimationResult';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

function App() {
  const [view, setView] = useState('dashboard');
  const [projectType, setProjectType] = useState(null);
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedId, setSavedId] = useState(null);

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const startProject = (type) => {
    setProjectType(type);
    setStep(0);
    setResult(null);
    setSavedId(null);

    // Initialize common defaults
    const defaults = {
      floor: 'G+1',
      bedrooms: 3,
      structural_style: 'Classic',
      zone: 'B',
      upgrade_level: 'Basic',
      total_sqft: 1000,
      style: 'Modern',
      include_compound_wall: true,
      include_waterproofing: true,
      include_gate: true,
      include_elevation: true
    };

    setInputs(defaults);
    setView('wizard');
  };

  const handleNext = async (direction = 1) => {
    const config = projectConfigs[projectType];
    if (direction === -1) {
      setStep(Math.max(0, step - 1));
      return;
    }
    if (step < config.steps.length - 1) {
      setStep(step + 1);
    } else {
      calculateEstimation();
    }
  };

  const calculateEstimation = async () => {
    setLoading(true);
    try {
      const endpoint = `${API_BASE_URL}/${projectType.replace('_', '-')}/estimate`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      const data = await res.json();
      if (res.ok) { setResult(data); setView('result'); }
      else { alert(data.detail); }
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  const saveProject = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/${projectType.replace('_', '-')}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      const data = await res.json();
      if (res.ok) { setSavedId(data.project_id); loadProjects(); }
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  const wizardStepBgs = [
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2200&q=95',  // Step 0: Plot & Dimensions
    'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=2200&q=95',  // Step 1: Floor & Grade Plan
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2200&q=95',     // Step 2: Additional Details
    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=2000&q=80',  // Step 3: Review Plan (black aesthetic)
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=2000&q=80',  // Step 4: Interior
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=2000&q=80',  // Step 5: Add-ons
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=2000&q=80',  // Step 6: Cost Estimation
  ];

  const getBg = () => {
    if (view === 'wizard') return wizardStepBgs[step] || wizardStepBgs[0];
    const staticBgs = {
      dashboard: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=2000&q=80',
      selection: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=2000&q=80',
      result: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=2000&q=80'
    };
    return staticBgs[view] || staticBgs.dashboard;
  };

  return (
    <div className="app-root">
      <div className="building-overlay"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 11, 0.2), rgba(10, 10, 11, 0.65)), url(${getBg()})` }}>
      </div>

      <div id="app">
        <nav className="navbar animate">
          <div className="logo">
            <img src="/assets/logo.svg" alt="Logo" style={{ height: 60, marginRight: 16 }} />
          </div>
        </nav>

        {view === 'dashboard' && <Dashboard setView={setView} />}

        {view === 'selection' && <ProjectSelection setView={setView} startProject={startProject} />}

        {view === 'wizard' && (
          <ProjectWizard
            projectType={projectType}
            step={step}
            inputs={inputs}
            setInputs={setInputs}
            setView={setView}
            handleNext={handleNext}
            API_BASE_URL={API_BASE_URL}
          />
        )}

        {view === 'result' && (
          <EstimationResult
            result={result}
            savedId={savedId}
            setView={setView}
            saveProject={saveProject}
            API_BASE_URL={API_BASE_URL}
          />
        )}
      </div>
    </div>
  );
}

export default App;


