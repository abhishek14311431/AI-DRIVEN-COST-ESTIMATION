import React, { useState, useEffect } from 'react';

const Dashboard = ({ setView }) => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = dateTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <main className="animate dashboard-main">
            <div className="liquid-glass-panel">
                <div className="hero-text" style={{ padding: 0, flex: 1 }}>
                    <div style={{ marginBottom: '3rem', animation: 'fadeInDown 1s ease' }}>
                        <img src="/assets/logo.svg" alt="App Logo" style={{ width: '120px', height: '120px', filter: 'drop-shadow(0 0 20px rgba(253, 185, 49, 0.4))' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                        <div className="greeting-label" style={{ margin: 0 }}>{getGreeting()},</div>
                        <div className="live-clock" style={{ fontSize: '0.8rem', opacity: 0.5, letterSpacing: '2px', fontWeight: 600 }}>
                            {formatDate(dateTime)} | {formatTime(dateTime)}
                        </div>
                    </div>
                    <h1 className="user-name-hero" style={{ marginBottom: '1rem' }}>ABHISHEK</h1>
                    <div className="hero-subtitle">
                        Your design intelligence system is ready.<br />
                        Let's architect the future of living.
                    </div>
                </div>

                <div className="dashboard-actions" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'flex-end', flex: 1 }}>
                    <div className="action-card" onClick={() => setView('selection')} style={{ width: '500px' }}>
                        <div className="card-label">
                            <span>01. INITIALIZE</span>
                            <span style={{ color: '#ffea00' }}>⚡</span>
                        </div>
                        <h3>New Project</h3>
                        <p>Launch Estimator →</p>
                    </div>

                    <div className="action-card" onClick={() => { }}>
                        <div className="card-label">
                            <span>02. DATABASE</span>
                            <span>📁</span>
                        </div>
                        <h3>View Archives</h3>
                        <div className="btn-circle" style={{ width: '30px', height: '30px', fontSize: '0.8rem', position: 'absolute', bottom: '2.5rem', right: '2.5rem' }}>→</div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
