import React, { useState, useEffect } from 'react';

const AnimatedConstructionLogo = () => {
    return (
        <div className="construction-logo active" style={{ perspective: '1000px' }}>
            <div className="blueprint-grid" />
            <div className="building-block-1" />
            <div className="building-block-2" />
            <div className="building-block-3" />
            <div className="connecting-line line-1" />
            <div className="connecting-line line-2" />
        </div>
    );
};

const Archives = ({ setView, API_BASE_URL }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        loadProjects();
    }, [API_BASE_URL]);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/projects/`);
            if (!res.ok) {
                throw new Error(`API error: ${res.status}`);
            }
            const data = await res.json();
            const sortedData = Array.isArray(data) ? data.sort((a, b) => {
                const dateA = new Date(a.created_at || 0).getTime();
                const dateB = new Date(b.created_at || 0).getTime();
                return dateA - dateB;
            }) : [];
            setProjects(sortedData);
            setLoading(false);
        } catch (e) {
            console.error('Failed to load projects:', e);
            setProjects([]);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0';
        return '₹' + amount.toLocaleString('en-IN');
    };

    const getProjectTypeLabel = (type) => {
        const labels = {
            'own_house': '👤 Own House',
            'villa': '🏡 Villa',
            'commercial': '🏢 Commercial',
            'interior': '🎨 Interior',
            'exterior': '🏗️ Exterior',
            'rental': '🏘️ Rental'
        };
        return labels[type] || type;
    };

    const handleDownloadPDF = async (project) => {
        try {
            const element = document.createElement('div');
            element.innerHTML = `
                <div style="font-family: Arial, sans-serif; padding: 40px; background: white; color: black;">
                    <h1 style="text-align: center; margin-bottom: 10px;">CONSTRUCTION COST ESTIMATION</h1>
                    <p style="text-align: center; color: #666; margin-bottom: 30px;">AI-DRIVEN VALUATION REPORT 2026</p>
                    
                    <div style="border: 1px solid #ddd; padding: 20px; margin-bottom: 30px; background: #f9f9f9;">
                        <p><strong>Project ID:</strong> ${project.id || 'ARCH-' + new Date().getTime()}</p>
                        <p><strong>Project Type:</strong> ${getProjectTypeLabel(project.project_type)}</p>
                        <p><strong>Created Date:</strong> ${formatDate(project.created_at)}</p>
                    </div>

                    <div style="text-align: center; margin: 40px 0;">
                        <p style="font-size: 14px; color: #666;">TOTAL ESTIMATED INVESTMENT</p>
                        <h2 style="font-size: 48px; margin: 10px 0; color: #000;">₹${(project.total_cost || 0).toLocaleString('en-IN')}</h2>
                        <p style="color: #666; margin-top: 10px;">PRECISION AI VALUATION · 2026 LIVE</p>
                    </div>

                    <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">
                        <h3 style="margin-bottom: 20px;">COST BREAKDOWN</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f0f0f0;">
                                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Component</th>
                                    <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Amount</th>
                                    <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">%</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(project.breakdown_json?.items || project.breakdown_json || [])
                                    .map(item => `
                                    <tr>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${item.component || item.category}</td>
                                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">₹${(item.amount || 0).toLocaleString('en-IN')}</td>
                                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${item.percentage}%</td>
                                    </tr>
                                    `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div style="margin-top: 40px; padding: 20px; background: #f9f9f9; border: 1px solid #ddd;">
                        <h3 style="margin-top: 0;">TERMS & CONDITIONS</h3>
                        <p style="font-size: 12px; line-height: 1.6;">
                            1. Valuation indexed to 2026 market benchmarks.<br/>
                            2. Final execution costs subject to ±5% variance based on site-specific reports.<br/>
                            3. This AI-driven appraisal is valid for 30 calendar days from authorization.<br/>
                            4. Construction delays and material sourcing not covered under this estimation.<br/>
                            5. Final cost subject to verification upon site inspection.
                        </p>
                    </div>

                    <div style="margin-top: 40px; padding: 20px; background: #fffacd; border: 1px solid #daa520;">
                        <p style="margin: 0; font-weight: bold; color: #ff0000;">⚠️ IMMUTABLE DOCUMENT</p>
                        <p style="margin: 5px 0 0 0; font-size: 12px; color: #333;">This estimation has been digitally signed and authorized. No changes can be made after generation. This is a permanent record of the project valuation.</p>
                    </div>

                    <p style="margin-top: 40px; text-align: center; font-size: 10px; color: #999;">Generated on ${new Date().toLocaleString('en-IN')} | AI Builder EST. 2026</p>
                </div>
            `;

            alert(`PDF Ready: Project ${project.id || 'ARCHIVE-' + new Date().getTime()}\n\nTo implement full PDF download, integrate html2pdf library.\n\nFile would be saved as: Project_${project.id}.pdf`);
            console.log('PDF Content:', element.innerHTML);
        } catch (err) {
            console.error('PDF generation error:', err);
            alert('Failed to generate PDF');
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, { method: 'DELETE' });
            if (res.ok) {
                setProjects(projects.filter((p, idx) => (p.id || idx) !== projectId));
                setSelectedProject(null);
                alert('Project deleted successfully');
            } else {
                alert('Failed to delete project');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Error deleting project');
        }
    };

    return (
        <div>
            {selectedProject ? (
                // VALUATION PAGE VIEW - EstimationResult Style Layout
                <div style={{
                    minHeight: '100vh', width: '100%', color: '#fff',
                    fontFamily: "'Outfit', sans-serif", overflowX: 'hidden',
                    background: 'transparent', position: 'relative',
                    scrollBehavior: 'smooth'
                }}>
                    {/* Background Layers */}
                    <div style={{ position: 'fixed', inset: 0, background: '#05030A', zIndex: -3 }} />
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: -2,
                        backgroundImage: 'url(https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=2000&q=95)',
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        opacity: 0.85, filter: 'contrast(1.15) saturate(1.2) brightness(0.65)'
                    }} />
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: -1,
                        background: 'radial-gradient(circle at center, transparent 0%, rgba(5,3,10,0.7) 100%)'
                    }} />

                    {/* Glow Orbs */}
                    <div style={{
                        position: 'fixed', top: '5%', left: '20%', width: '50vw', height: '50vw',
                        background: 'radial-gradient(circle, rgba(0,242,255,0.12) 0%, transparent 70%)',
                        borderRadius: '50%', zIndex: -1, pointerEvents: 'none'
                    }} />
                    <div style={{
                        position: 'fixed', bottom: '10%', right: '15%', width: '45vw', height: '45vw',
                        background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
                        borderRadius: '50%', zIndex: -1, pointerEvents: 'none'
                    }} />

                    {/* Scrollable Content */}
                    <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                        <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                            {/* Header with Logo */}
                            <div style={{
                                position: 'absolute',
                                top: '2rem',
                                left: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                zIndex: 100
                            }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(135deg, rgba(0,242,255,0.15), rgba(124,58,237,0.15))',
                                    border: '2px solid rgba(0,242,255,0.3)',
                                    borderRadius: '12px',
                                    padding: '0.7rem',
                                    boxShadow: '0 8px 25px rgba(0,242,255,0.15)'
                                }}>
                                    <AnimatedConstructionLogo />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                    <div style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 900,
                                        letterSpacing: '1.5px',
                                        color: '#00f2ff',
                                        textTransform: 'uppercase'
                                    }}>AI Builder</div>
                                    <div style={{
                                        fontSize: '0.6rem',
                                        fontWeight: 700,
                                        letterSpacing: '1px',
                                        color: 'rgba(0,242,255,0.5)',
                                        textTransform: 'uppercase'
                                    }}>Est. 2026</div>
                                </div>
                            </div>

                            {/* Main Title Section */}
                            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4rem' }}>
                                <div>
                                    <button onClick={() => setSelectedProject(null)} style={{
                                        background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)',
                                        padding: '12px 24px', borderRadius: '10px', cursor: 'pointer',
                                        color: '#fff', fontSize: '14px', fontWeight: 700, transition: 'all 0.25s',
                                        marginBottom: '1.5rem', fontFamily: "'Outfit', sans-serif"
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                    >← BACK</button>
                                    <h2 style={{ fontSize: '4.5rem', fontWeight: 900, margin: 0, letterSpacing: '-3px', color: '#fff' }}>VALUATION</h2>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                        ARCHIVE ID
                                    </div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#67E8F9' }}>
                                        {selectedProject.id || 'ARCHIVE-' + new Date().getTime()}
                                    </div>
                                </div>
                            </div>

                            {/* Liquid Glass Panel with Cost */}
                            <div style={{ padding: '4rem', marginBottom: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px' }}>
                                <p style={{ fontSize: '0.9rem', letterSpacing: '6px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 900 }}>
                                    Total Estimated Investment
                                </p>
                                <div style={{
                                    fontSize: '8rem', fontWeight: 1000, letterSpacing: '-6px',
                                    margin: '1.5rem 0', color: '#fff',
                                    textShadow: '0 0 60px rgba(103,232,249,0.3)'
                                }}>
                                    ₹{(selectedProject.total_cost || 0).toLocaleString('en-IN')}
                                </div>
                                <button onClick={() => setSelectedProject(null)} style={{
                                    background: 'linear-gradient(135deg, #00f2ff, #67E8F9)', border: 'none',
                                    padding: '1.2rem 3rem', borderRadius: '12px', cursor: 'pointer',
                                    color: '#000', fontSize: '1.1rem', fontWeight: 900, transition: 'all 0.25s',
                                    marginTop: '2rem', fontFamily: "'Outfit', sans-serif", textTransform: 'uppercase',
                                    letterSpacing: '1.5px', boxShadow: '0 8px 25px rgba(0,242,255,0.2)'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,242,255,0.4)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,242,255,0.2)'}
                                >
                                    VIEW IN WIZARD
                                </button>
                            </div>

                            {/* Cost Breakdown Grid */}
                            {selectedProject.breakdown_json && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                                    {(selectedProject.breakdown_json.items || selectedProject.breakdown_json).map((item, idx) => (
                                        <div key={idx} style={{
                                            padding: '2rem', background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                                <span>{item.category}</span>
                                                <span style={{ color: '#67E8F9' }}>{item.percentage}%</span>
                                            </div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
                                                {item.component}
                                            </div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>
                                                ₹{(item.amount || 0).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ height: '4rem' }} />
                        </section>
                    </div>
                </div>
            ) : (
                // ARCHIVES TABLE VIEW
                <div style={{
                    minHeight: '100vh', width: '100%', color: '#fff',
                    fontFamily: "'Inter', 'Outfit', sans-serif", overflowX: 'hidden',
                    background: 'transparent', position: 'relative', scrollBehavior: 'smooth'
                }}>
                    {/* Background Layers */}
                    <div style={{ position: 'fixed', inset: 0, background: '#05030A', zIndex: -3 }} />
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: -2,
                        backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=2000&q=95)',
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        opacity: 0.5, filter: 'contrast(1.1) saturate(1.1) brightness(0.4)'
                    }} />
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: -1,
                        background: 'radial-gradient(circle at center, transparent 0%, rgba(5,3,10,0.85) 100%)'
                    }} />

                    {/* Glow Orbs */}
                    <div style={{
                        position: 'fixed', top: '10%', left: '25%', width: '40vw', height: '40vw',
                        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                        borderRadius: '50%', zIndex: -1, pointerEvents: 'none'
                    }} />
                    <div style={{
                        position: 'fixed', bottom: '20%', right: '20%', width: '35vw', height: '35vw',
                        background: 'radial-gradient(circle, rgba(0,242,255,0.08) 0%, transparent 70%)',
                        borderRadius: '50%', zIndex: -1, pointerEvents: 'none'
                    }} />

                    {/* Main Content */}
                    <div style={{ position: 'relative', zIndex: 10, width: '100%', padding: '3rem 2rem' }}>
                        <div style={{ maxWidth: '1900px', margin: '0 auto' }}>
                            {/* Header */}
                            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <button
                                    onClick={() => setView('dashboard')}
                                    style={{
                                        background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)',
                                        padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
                                        color: '#fff', fontSize: '14px', fontWeight: 700, transition: 'all 0.25s',
                                        fontFamily: "'Outfit', sans-serif"
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                >← BACK</button>
                                <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: 0, color: '#fff', textTransform: 'uppercase', flex: 1, textAlign: 'center' }}>ARCHIVES</h1>
                                <div style={{ width: '100px' }} />
                            </div>

                            {/* Stats */}
                            {!loading && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                                    <StatBox label="Total Projects" value={projects.length} />
                                    <StatBox label="Latest Estimate" value={projects.length > 0 ? formatDate(projects[projects.length - 1]?.created_at) : '—'} />
                                </div>
                            )}

                            {/* Table */}
                            <div style={{
                                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '24px', overflow: 'hidden'
                            }}>
                                {/* Header */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '70px minmax(140px, 1.2fr) minmax(140px, 1.2fr) 180px 130px 150px',
                                    columnGap: '12px', padding: '24px 32px', borderBottom: '2px solid rgba(0,242,255,0.2)',
                                    background: 'rgba(0,242,255,0.15)', fontWeight: 700, fontSize: '13px',
                                    letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)'
                                }}>
                                    <div>S.NO</div>
                                    <div>CLIENT NAME</div>
                                    <div>PROJECT TYPE</div>
                                    <div style={{ textAlign: 'right' }}>COST</div>
                                    <div style={{ textAlign: 'center' }}>DATE</div>
                                    <div style={{ textAlign: 'center' }}>ACTIONS</div>
                                </div>

                                {/* Rows */}
                                {loading ? (
                                    <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading projects...</div>
                                ) : projects.length === 0 ? (
                                    <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No projects archived yet</div>
                                ) : (
                                    projects.map((project, idx) => (
                                        <div key={idx} style={{
                                            display: 'grid', gridTemplateColumns: '70px minmax(140px, 1.2fr) minmax(140px, 1.2fr) 180px 130px 150px',
                                            columnGap: '12px', padding: '26px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)',
                                            alignItems: 'center', background: idx % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.5)',
                                            transition: 'all 0.3s ease'
                                        }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = 'rgba(0,242,255,0.15)';
                                                e.currentTarget.style.boxShadow = 'inset 0 0 25px rgba(0,242,255,0.1)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.5)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{ fontSize: '18px', fontWeight: 900, color: '#00F2FF' }}>{idx + 1}</div>
                                            <div style={{ fontSize: '17px', fontWeight: 750, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {project.input_json?.client_name || 'Not Specified'}
                                            </div>
                                            <div style={{ fontSize: '17px', fontWeight: 750, color: 'rgba(255,255,255,0.95)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {getProjectTypeLabel(project.project_type).replace('👤 ', '').replace('🏡 ', '').replace('🏢 ', '').replace('🎨 ', '').replace('🏗️ ', '').replace('🏘️ ', '')}
                                            </div>
                                            <div style={{ fontSize: '19px', fontWeight: 1000, color: '#20E3B2', textAlign: 'right' }}>
                                                {formatCurrency(project.total_cost)}
                                            </div>
                                            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', textAlign: 'center', fontWeight: 700 }}>
                                                {formatDate(project.created_at)}
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                                <button 
                                                    onClick={() => setSelectedProject(project)}
                                                    style={{
                                                        padding: '10px 14px', borderRadius: '8px',
                                                        background: 'rgba(103,232,249,0.35)', border: '1.5px solid rgba(103,232,249,0.6)',
                                                        color: '#67E8F9', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                                                        transition: '0.2s'
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(103,232,249,0.55)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(103,232,249,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
                                                >👁️</button>
                                                <button 
                                                    onClick={() => handleDownloadPDF(project)}
                                                    style={{
                                                        padding: '10px 14px', borderRadius: '8px',
                                                        background: 'rgba(32,227,178,0.35)', border: '1.5px solid rgba(32,227,178,0.6)',
                                                        color: '#20E3B2', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                                                        transition: '0.2s'
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(32,227,178,0.55)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(32,227,178,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
                                                >📄</button>
                                                <button 
                                                    onClick={() => handleDeleteProject(project.id || idx)}
                                                    style={{
                                                        padding: '10px 14px', borderRadius: '8px',
                                                        background: 'rgba(239,68,68,0.35)', border: '1.5px solid rgba(239,68,68,0.6)',
                                                        color: '#FCA5A5', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                                                        transition: '0.2s'
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.55)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
                                                >🗑️</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatBox = ({ label, value }) => (
    <div style={{
        padding: '24px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px', textAlign: 'center'
    }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
            {label}
        </div>
        <div style={{ fontSize: '24px', fontWeight: 900, color: '#67E8F9', letterSpacing: '-0.5px' }}>
            {value}
        </div>
    </div>
);

export default Archives;
