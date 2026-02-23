import React, { useState, useEffect } from 'react';
import { projectConfigs } from '../constants/projectConfigs';

const STEP_LABELS = [
    'Plot & Site', 'Building Height', 'Grade', 'Details',
    'Floor Plan', 'Review', 'Interiors', 'Add-ons', 'Cost Est.'
];

const InfoPill = ({ inputs, config }) => {
    const items = [
        { label: 'PROJECT', value: config.title },
        { label: 'PLOT', value: inputs.plot_size ? (inputs.plot_size === 'full' ? 'Full Site' : 'Double Site') : null },
        { label: 'SIZE', value: inputs.dimensions || null },
        { label: 'FLOOR', value: inputs.floor || null },
        { label: 'GRADE', value: inputs.structural_style || null },
        { label: 'BEDROOMS', value: inputs.bedrooms ? `${inputs.bedrooms} BHK` : null },
        { label: 'LIFT', value: inputs.lift_required === true ? 'Yes' : inputs.lift_required === false ? 'No' : null },
    ].filter(item => item.value);

    return (
        <div style={{
            display: 'flex', gap: '1.5rem', alignItems: 'center',
            background: 'linear-gradient(145deg, rgba(8,10,14,0.78), rgba(12,14,20,0.62))', backdropFilter: 'blur(42px) saturate(170%)',
            border: '1px solid rgba(255,255,255,0.16)', borderRadius: '100px',
            padding: '0.8rem 2.2rem', flexWrap: 'wrap', justifyContent: 'flex-start'
        }}>
            {items.map((item, i) => (
                <React.Fragment key={item.label}>
                    {i > 0 && <div style={{ width: '1px', height: '2.8rem', background: 'rgba(255,255,255,0.12)' }} />}
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.6rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>{item.label}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.2rem' }}>{item.value}</div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

const WizardShell = ({ children, config, step, inputs, onBack, onNext, nextLabel, nextDisabled, total, showTopNext = true }) => (
    <main className="animate" style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0 6rem', overflowY: 'auto', background: 'transparent' }}>
        {/* Top bar */}
        <div style={{ width: '92vw', maxWidth: '1584px', display: 'flex', alignItems: 'center', justifyContent: showTopNext ? 'space-between' : 'flex-start', marginBottom: '2.5rem', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <img src="/logo.svg" alt="Logo" style={{ width: '40px', height: '40px', filter: 'drop-shadow(0 0 10px rgba(253, 185, 49, 0.3))' }} />
                <button onClick={onBack} style={{
                    padding: '0.9rem 2rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.15)',
                    background: 'linear-gradient(145deg, rgba(12,14,20,0.8), rgba(16,18,26,0.66))', backdropFilter: 'blur(30px) saturate(170%)',
                    color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.6rem', letterSpacing: '0.5px',
                    transition: 'all 0.2s ease'
                }}>
                    ← Back
                </button>
            </div>
            <InfoPill inputs={inputs} config={config} />
            {showTopNext && (
                <button onClick={() => { if (!nextDisabled) onNext(); }} style={{
                    padding: '0.9rem 2rem', borderRadius: '100px',
                    border: nextDisabled ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,242,255,0.4)',
                    background: nextDisabled ? 'rgba(20,24,32,0.62)' : 'linear-gradient(135deg, rgba(39,147,170,0.38), rgba(92,69,140,0.34))',
                    backdropFilter: 'blur(20px)', color: nextDisabled ? 'rgba(255,255,255,0.3)' : '#fff',
                    fontSize: '1rem', fontWeight: 600, cursor: nextDisabled ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.6rem', letterSpacing: '0.5px',
                    transition: 'all 0.3s ease'
                }}>
                    {nextLabel || 'Next ?'}
                </button>
            )}
        </div>

        {/* Content */}
        {children}
    </main>
);

const GlassCard = ({ children, style = {} }) => (
    <div style={{
        width: '92vw', maxWidth: '1584px', padding: '3rem 4rem', borderRadius: '2rem',
        background: 'linear-gradient(145deg, rgba(10,12,18,0.84), rgba(14,16,24,0.7))', backdropFilter: 'blur(58px) saturate(175%)',
        border: '1px solid rgba(255,255,255,0.16)',
        boxShadow: '0 28px 85px rgba(2, 6, 16, 0.5), inset 0 1px 0 rgba(255,255,255,0.14)', marginBottom: '2rem', minHeight: '72vh', animation: 'none',
        ...style
    }}>
        {children}
    </div>
);

const BottomStepButton = ({ label, disabled = false, onClick, top = '0.5rem' }) => (
    <div style={{ width: '92vw', maxWidth: '420px', marginTop: top, marginBottom: '1.3rem', margin: '0 auto' }}>
        <button
            onClick={onClick}
            style={{
                width: '100%',
                padding: '1.3rem 1.6rem',
                borderRadius: '1rem',
                border: disabled ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(145,229,255,0.72)',
                background: disabled ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, rgba(39,147,170,0.38), rgba(92,69,140,0.34))',
                color: disabled ? 'rgba(255,255,255,0.55)' : '#fff',
                fontSize: '1.08rem',
                fontWeight: 700,
                cursor: disabled ? 'not-allowed' : 'pointer',
                letterSpacing: '1px'
            }}
        >
            {label}
        </button>
    </div>
);

const fmt = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

const getCategory = (name) => {
    const n = name.toLowerCase();
    if (n.includes('excav') || n.includes('rcc') || n.includes('foundation') || n.includes('masonry') || n.includes('steel') || n.includes('concrete') || n.includes('earthwork') || n.includes('structure')) return 'STRUCTURE';
    if (n.includes('plumb') || n.includes('elect') || n.includes('sanit') || n.includes('septic') || n.includes('wiring') || n.includes('utility')) return 'UTILITIES';
    if (n.includes('floor') || n.includes('paint') || n.includes('plaster') || n.includes('tile') || n.includes('door') || n.includes('window') || n.includes('woodwork') || n.includes('finish')) return 'FLOORING';
    if (n.includes('compound') || n.includes('parking') || n.includes('rain') || n.includes('lift') || n.includes('gate') || n.includes('waterproof') || n.includes('solar') || n.includes('staircase')) return 'EXTERIOR';
    if (n.includes('interior')) return 'OPTIONAL';
    return 'STRUCTURE';
};

const catColor = {
    'STRUCTURE': { bg: 'rgba(139,92,246,0.18)', text: '#A78BFA', border: 'rgba(139,92,246,0.4)' },
    'UTILITIES': { bg: 'rgba(6,182,212,0.15)', text: '#22D3EE', border: 'rgba(6,182,212,0.4)' },
    'BATHROOM': { bg: 'rgba(251,191,36,0.13)', text: '#FCD34D', border: 'rgba(251,191,36,0.35)' },
    'ELECTRICAL': { bg: 'rgba(52,211,153,0.13)', text: '#6EE7B7', border: 'rgba(52,211,153,0.35)' },
    'FLOORING': { bg: 'rgba(244,114,182,0.13)', text: '#F9A8D4', border: 'rgba(244,114,182,0.35)' },
    'EXTERIOR': { bg: 'rgba(167,139,250,0.13)', text: '#C4B5FD', border: 'rgba(167,139,250,0.35)' },
    'OPTIONAL': { bg: 'rgba(236,72,153,0.13)', text: '#F472B6', border: 'rgba(236,72,153,0.35)' }
};

const liquidGlass = {
    background: 'rgba(255,255,255,0.005)', /* Ultra Transparent */
    backdropFilter: 'blur(32px) saturate(160%)',
    WebkitBackdropFilter: 'blur(32px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    boxShadow: '0 4px 24px 0 rgba(0,0,0,0.2)',
};

const CountUp = ({ end, duration = 1200 }) => {
    const [count, setCount] = useState(0);
    const target = typeof end === 'string' ? parseFloat(end.replace(/[^0-9.]/g, '')) : end;

    useEffect(() => {
        if (!target || isNaN(target)) {
            setCount(0);
            return;
        }

        // Always start from 0 when the component mounts or target changes
        let startValue = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quad
            const easeProgress = progress * (2 - progress);
            const currentCount = Math.floor(easeProgress * target);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };

        requestAnimationFrame(animate);
        return () => { }; // Cleanup not needed for simple RAF version as progress < 1 check handles it
    }, [target, duration]);

    return (
        <span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(count)}</span>
    );
};

const SignaturePad = ({ onSave, onClear }) => {
    const canvasRef = React.useRef(null);
    const [isDrawing, setIsDrawing] = React.useState(false);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }, []);

    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        const pos = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const pos = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const endDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        onSave(canvasRef.current.toDataURL());
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onClear();
    };

    return (
        <div style={{ position: 'relative', background: '#fff', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', height: '200px', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}>
            <canvas
                ref={canvasRef}
                width={600}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
                style={{ cursor: 'crosshair', width: '100%', height: '100%', touchAction: 'none' }}
            />
            <button
                onClick={clearCanvas}
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.08)', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, cursor: 'pointer', color: '#000', letterSpacing: '0.1em' }}
            >CLEAR SIGNATURE</button>
        </div>
    );
};

const ProjectWizard = ({ projectType, step, inputs, setInputs, setView, handleNext }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
    const [estData, setEstData] = useState(null);
    const [loadingEst, setLoadingEst] = useState(false);
    const [displayTotal, setDisplayTotal] = useState(0);
    const [countStarted, setCountStarted] = useState(false);
    const [isLoadedHUD, setIsLoadedHUD] = useState(false);
    const [filterHUD, setFilterHUD] = useState('ALL');

    // Project Finalization States
    const [showFinalize, setShowFinalize] = useState(false);
    const [clientName, setClientName] = useState('');
    const [signature, setSignature] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showUpgradeOptions, setShowUpgradeOptions] = useState(false);

    const config = projectConfigs[projectType] || projectConfigs.own_house;
    const currentStep = config.steps[step];
    const total = config.steps.length;

    useEffect(() => {
        if (currentStep.type === 'final-estimate') {
            fetchEstimation();
        } else if (currentStep.type === 'addons') {
            // Pre-fetch in background
            fetchEstimation(true);
        }
    }, [currentStep.type, step]);

    // Trigger HUD load animations only on the final step
    useEffect(() => {
        if (currentStep.type !== 'final-estimate') {
            setIsLoadedHUD(false);
            setCountStarted(false);
            setDisplayTotal(0);
            return;
        }

        const loadTimer = setTimeout(() => {
            setIsLoadedHUD(true);
            const countTimer = setTimeout(() => setCountStarted(true), 600);
            return () => clearTimeout(countTimer);
        }, 100);

        return () => clearTimeout(loadTimer);
    }, [currentStep.type]);

    // Animate the total valuation once data is present and animation is allowed
    useEffect(() => {
        if (currentStep.type !== 'final-estimate' || !countStarted || !estData?.total_cost) return;

        let start = 0;
        const end = estData.total_cost;
        const duration = 2000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayTotal(end);
                clearInterval(timer);
            } else {
                setDisplayTotal(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [countStarted, estData, currentStep.type]);

    const fetchEstimation = async (isBackground = false) => {
        if (!isBackground) setLoadingEst(true);
        try {
            const endpoint = `${API_BASE_URL}/${projectType.replace('_', '-')}/estimate`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs)
            });

            if (res.ok) {
                const data = await res.json();
                setEstData(data);
                if (!isBackground) {
                    setDisplayTotal(data.total_cost || 0);
                }
            } else if (!isBackground) {
                const errData = await res.json();
                setEstData({ error: true, message: errData.detail || "Verification Failed" });
            }
        } catch (err) {
            console.error(err);
            if (!isBackground) setEstData({ error: true, message: "Network Connectivity Issue" });
        } finally {
            if (!isBackground) setLoadingEst(false);
        }
    };

    const [saveError, setSaveError] = useState(null);

    const handleSaveProject = async () => {
        if (!clientName) {
            setSaveError("Client Name is required for architectural sign-off.");
            return;
        }
        if (!signature || signature.length < 100) {
            setSaveError("Please provide a digital signature to authorize this estimation.");
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/projects/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_type: projectType,
                    input_json: {
                        ...inputs,
                        client_name: clientName,
                        signature: signature,
                        inflation_factor: "1.02%",
                        valuation_year: "2026"
                    },
                    total_cost: estData.total_cost,
                    breakdown_json: { items: estData.breakdown }
                })
            });

            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => {
                    window.location.href = '/';
                }, 6000);
            } else {
                const errData = await res.json();
                setSaveError(errData.detail || "Database Persistence Error. Please check site connectivity.");
            }
        } catch (err) {
            console.error("Failed to save project:", err);
            setSaveError("Network infrastructure failure. Project could not be persisted.");
        } finally {
            setIsSaving(false);
        }
    };

    const onBack = () => step === 0 ? setView('selection') : handleNext(-1);
    const setField = (field, value) => setInputs(prev => ({ ...prev, [field]: value }));

    if (currentStep.type === 'split-selection') {
        const left = currentStep.leftSide;
        const right = currentStep.rightSide;
        const leftValue = inputs[left.field];
        const rightOptions = leftValue ? (right.optionsByParent?.[leftValue] || []) : [];
        const canProceed = Boolean(leftValue && inputs[right.field]);

        const plotImages = {
            full: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=95',
            double: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1800&q=95'
        };

        const dimensionImages = {
            '30x40': 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=1800&q=95',
            '30x50': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=95',
            '40x40': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=95',
            '40x50': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=95',
            '40x60': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1800&q=95',
            '50x80': 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1800&q=95',
            '60x80': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1800&q=95',
            '60x100': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=95'
        };

        return (
            <WizardShell config={config} step={step} inputs={inputs} onBack={onBack} onNext={handleNext} total={total} showTopNext={false}>
                <GlassCard>
                    <h2 style={{ fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: '2.2rem' }}>{currentStep.title}</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.4rem' }}>
                        <div>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', opacity: 0.62, letterSpacing: '2px' }}>{left.label.toUpperCase()}</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.2rem' }}>
                                {left.options.map(opt => {
                                    const isActive = inputs[left.field] === opt.value;
                                    const image = plotImages[opt.value];
                                    return (
                                        <div key={opt.value}
                                            onClick={() => { setField(left.field, opt.value); setField(right.field, null); }}
                                            style={{
                                                cursor: 'pointer',
                                                minHeight: '250px',
                                                borderRadius: '1.2rem',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                border: isActive ? '2px solid rgba(0,242,255,0.7)' : '2px solid rgba(255,255,255,0.08)',
                                                boxShadow: isActive ? '0 0 18px rgba(0,242,255,0.2)' : 'none'
                                            }}>
                                            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.16)', filter: 'saturate(1.12) contrast(1.08)', opacity: 0.75 }} />
                                            <div style={{ position: 'relative', height: '100%', padding: '1.45rem', background: 'linear-gradient(to top, rgba(10,18,35,0.56), rgba(10,18,35,0.12))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                                <div style={{ fontSize: '1.45rem', fontWeight: 800 }}>{opt.label}</div>
                                                <div style={{ fontSize: '1.05rem', opacity: 0.8, marginTop: '0.35rem' }}>{opt.desc}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', opacity: 0.62, letterSpacing: '2px' }}>{right.label.toUpperCase()}</h4>
                            {!leftValue ? (
                                <div style={{ fontSize: '1.02rem', opacity: 0.65, padding: '1.1rem 0.55rem' }}>Select plot size first to view dimensions.</div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.2rem' }}>
                                    {rightOptions.map(opt => {
                                        const isActive = inputs[right.field] === opt.value;
                                        const image = dimensionImages[opt.value];
                                        return (
                                            <div key={opt.value}
                                                onClick={() => setField(right.field, opt.value)}
                                                style={{
                                                    cursor: 'pointer',
                                                    minHeight: '250px',
                                                    borderRadius: '1.2rem',
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    border: isActive ? '2px solid rgba(0,242,255,0.7)' : '2px solid rgba(255,255,255,0.08)',
                                                    boxShadow: isActive ? '0 0 18px rgba(0,242,255,0.2)' : 'none'
                                                }}>
                                                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.16)', filter: 'saturate(1.12) contrast(1.08)', opacity: 0.75 }} />
                                                <div style={{ position: 'relative', height: '100%', padding: '1.45rem', background: 'linear-gradient(to top, rgba(10,18,35,0.56), rgba(10,18,35,0.12))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                                    <div style={{ fontSize: '1.45rem', fontWeight: 800 }}>{opt.label}</div>
                                                    <div style={{ fontSize: '1.05rem', opacity: 0.8, marginTop: '0.35rem' }}>{opt.desc}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </GlassCard>
                <BottomStepButton
                    label={canProceed ? 'NEXT ->' : 'SELECT PLOT SIZE AND DIMENSION TO CONTINUE'}
                    disabled={!canProceed}
                    onClick={() => { if (canProceed) handleNext(); }}
                />
            </WizardShell >
        );
    }

    if (currentStep.type === 'floor-grade') {
        const canProceed = Boolean(inputs[currentStep.floorField] && inputs[currentStep.gradeField]);

        return (
            <WizardShell config={config} step={step} inputs={inputs} onBack={onBack} onNext={handleNext} total={total} showTopNext={false}>
                <GlassCard>
                    <h2 style={{ fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: '2.2rem' }}>{currentStep.title}</h2>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.1rem', opacity: 0.72, letterSpacing: '2px' }}>BUILDING HEIGHT</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        {currentStep.floorOptions.map(opt => {
                            const isActive = inputs[currentStep.floorField] === opt.value;
                            return (
                                <div key={opt.value}
                                    onClick={() => setField(currentStep.floorField, opt.value)}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: '1.2rem',
                                        overflow: 'hidden',
                                        minHeight: '210px',
                                        position: 'relative',
                                        border: isActive ? '2px solid rgba(145,229,255,0.85)' : '1px solid rgba(255,255,255,0.2)',
                                        boxShadow: isActive ? '0 0 24px rgba(116,224,255,0.35), inset 0 0 20px rgba(255,255,255,0.2)' : '0 8px 24px rgba(0,0,0,0.18)'
                                    }}>
                                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${opt.img})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.16)', filter: 'saturate(1.15) contrast(1.08)', opacity: 0.82 }} />
                                    <div style={{ position: 'relative', height: '100%', padding: '1.15rem', background: 'linear-gradient(to top, rgba(10,18,35,0.62), rgba(10,18,35,0.12))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                        <div style={{ fontSize: '1.08rem', fontWeight: 800 }}>{opt.label}</div>
                                        <div style={{ fontSize: '0.84rem', opacity: 0.76, marginTop: '0.28rem' }}>{opt.desc}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.1rem', opacity: 0.72, letterSpacing: '2px' }}>CONSTRUCTION GRADE</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {currentStep.gradeOptions.map(opt => {
                            const isActive = inputs[currentStep.gradeField] === opt.value;
                            return (
                                <div key={opt.value}
                                    onClick={() => setField(currentStep.gradeField, opt.value)}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: '1.2rem',
                                        overflow: 'hidden',
                                        minHeight: '210px',
                                        position: 'relative',
                                        border: isActive ? '2px solid rgba(145,229,255,0.85)' : '1px solid rgba(255,255,255,0.2)',
                                        boxShadow: isActive ? '0 0 24px rgba(116,224,255,0.35), inset 0 0 20px rgba(255,255,255,0.2)' : '0 8px 24px rgba(0,0,0,0.18)'
                                    }}>
                                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${opt.img})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.16)', filter: 'saturate(1.15) contrast(1.08)', opacity: 0.82 }} />
                                    <div style={{ position: 'relative', height: '100%', padding: '1.15rem', background: 'linear-gradient(to top, rgba(10,18,35,0.62), rgba(10,18,35,0.12))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                        <div style={{ fontSize: '1.08rem', fontWeight: 800 }}>{opt.label}</div>
                                        <div style={{ fontSize: '0.84rem', opacity: 0.76, marginTop: '0.28rem' }}>{opt.desc}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </GlassCard>
                <BottomStepButton
                    label={canProceed ? 'NEXT ->' : 'SELECT FLOOR AND GRADE TO CONTINUE'}
                    disabled={!canProceed}
                    onClick={() => { if (canProceed) handleNext(); }}
                />
            </WizardShell>
        );
    }

    if (currentStep.type === 'complex-grid') {
        const sectionValid = (section) => {
            const value = inputs[section.field];
            if (section.type === 'toggle') return value === true || value === false;
            return value !== undefined && value !== null && value !== '';
        };

        const canProceed = (currentStep.sections || []).every(sectionValid);

        return (
            <WizardShell config={config} step={step} inputs={inputs} onBack={onBack} onNext={handleNext} total={total} showTopNext={false}>
                <GlassCard>
                    <h2 style={{ fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: '2rem' }}>{currentStep.title}</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.9rem' }}>
                        {(currentStep.sections || []).map(section => {
                            const value = inputs[section.field];
                            const options = section.optionsByPlotSize?.[inputs.plot_size] || section.options || [];
                            const customField = `${section.field}_custom`;

                            return (
                                <div key={section.field} style={{
                                    border: '1px solid rgba(255,255,255,0.22)',
                                    borderRadius: '1rem',
                                    background: 'linear-gradient(145deg, rgba(16,20,28,0.72), rgba(12,16,24,0.56))',
                                    boxShadow: '0 10px 24px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.28)',
                                    padding: '1.45rem 1.45rem 1.55rem'
                                }}>
                                    <div style={{ fontSize: '1.28rem', fontWeight: 700, marginBottom: '0.9rem', opacity: 0.96 }}>{section.label}</div>

                                    {section.type === 'toggle' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.95rem' }}>
                                            {[{ label: 'Yes', value: true }, { label: 'No', value: false }].map(opt => {
                                                const active = value === opt.value;
                                                return (
                                                    <button key={opt.label}
                                                        onClick={() => setField(section.field, opt.value)}
                                                        style={{
                                                            padding: '1rem 1.1rem',
                                                            borderRadius: '0.82rem',
                                                            border: active ? '1px solid rgba(145,229,255,0.85)' : '1px solid rgba(255,255,255,0.22)',
                                                            background: active ? 'linear-gradient(135deg, rgba(39,147,170,0.38), rgba(92,69,140,0.34))' : 'rgba(255,255,255,0.07)',
                                                            color: '#fff',
                                                            cursor: 'pointer',
                                                            fontWeight: 700,
                                                            fontSize: '1.2rem'
                                                        }}>
                                                        {opt.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {section.type === 'number-custom' && (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
                                                {options.map(opt => {
                                                    const optValue = opt.value;
                                                    const active = value === optValue;
                                                    return (
                                                        <button key={String(optValue)}
                                                            onClick={() => setInputs(prev => ({ ...prev, [section.field]: optValue, [customField]: '' }))}
                                                            style={{
                                                                padding: '0.95rem 0.8rem',
                                                                borderRadius: '0.78rem',
                                                                border: active ? '1px solid rgba(145,229,255,0.85)' : '1px solid rgba(255,255,255,0.22)',
                                                                background: active ? 'linear-gradient(135deg, rgba(39,147,170,0.38), rgba(92,69,140,0.34))' : 'rgba(255,255,255,0.07)',
                                                                color: '#fff',
                                                                cursor: 'pointer',
                                                                fontSize: '1.02rem',
                                                                fontWeight: 700
                                                            }}>
                                                            {opt.label || optValue}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {section.hasCustom && (
                                                <div style={{ marginTop: '1.05rem' }}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        placeholder="Custom"
                                                        value={inputs[customField] || ''}
                                                        onChange={(e) => {
                                                            const raw = e.target.value;
                                                            const parsed = raw === '' ? '' : Number(raw);
                                                            setInputs(prev => ({ ...prev, [customField]: raw, [section.field]: parsed === '' ? null : parsed }));
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            background: 'rgba(20,24,32,0.62)',
                                                            border: '1px solid rgba(255,255,255,0.24)',
                                                            borderRadius: '0.78rem',
                                                            color: '#fff',
                                                            padding: '1rem 1.1rem',
                                                            fontSize: '1.04rem',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </GlassCard>
                <BottomStepButton
                    label={canProceed ? 'NEXT ->' : 'FILL ALL DETAILS TO CONTINUE'}
                    disabled={!canProceed}
                    onClick={() => { if (canProceed) handleNext(); }}
                />
            </WizardShell>
        );
    }
    /* STEP 6: Review Your Plan */
    if (currentStep.type === 'review') {
        const baseFacilities = [
            { title: 'Structure', detail: 'Standard RCC framed structure with IS-compliant design mix and workmanship.' },
            { title: 'Foundation', detail: 'Standard RCC footing foundation with appropriate soil excavation and PCC bed.' },
            { title: 'Masonry', detail: 'High-quality Solid/AAC block walls for durable external and internal partitions.' },
            { title: 'Flooring', detail: 'Premium Ceramic/Vitrified tiles in all rooms with specialized anti-skid tiles in wet areas.' },
            { title: 'Staircase', detail: 'RCC staircase finished with Polished Granite treads and risers with matching skirting.' },
            { title: 'Doors', detail: 'Decorative Main door plus high-quality flush doors with standard hardware.' },
            { title: 'Windows', detail: 'Powder-coated Aluminum/uPVC sliding windows with integrated safety grills.' },
            { title: 'Electrical', detail: 'Concealed copper wiring with branded modular switches and safety MCB setup.' },
            { title: 'Terrace', detail: 'Waterproofed terrace with weathering course and oriented rainwater outlets.' },
            { title: 'Plumbing', detail: 'Branded CPVC/PVC plumbing network with standard-grade sanitary fixtures.' },
            { title: 'Plaster & Putty', detail: 'Smooth internal plaster with double-coat wall putty for a refined finish.' },
            { title: 'Painting', detail: 'Interior emulsion and weather-shield exterior paint for lasting aesthetics.' },
            { title: 'Waterproofing', detail: 'Specialized chemical waterproofing for terrace, toilets, and balcony areas.' }
        ];

        const gradeUpgrades = {
            Classic: {
                Structure: 'Enhanced RCC structure with tighter rebar detailing and superior concrete quality control.',
                Foundation: 'Upgraded foundation system with enhanced reinforcement and stricter curing protocols.',
                Masonry: 'Superior masonry work with improved joint finishing and precision corner detailing.',
                Flooring: 'High-grade Granite flooring (18mm) across living areas for a durable and timeless finish.',
                Staircase: 'Premium 18mm Granite staircase with full bull-nosing and high-gloss polish.',
                Doors: 'Teak wood main door frame and premium skin doors with upgraded designer hardware.',
                Windows: 'Upgraded uPVC windows with thicker sections and improved sound/dust insulation.',
                Electrical: 'Enhanced electrical planning with more points and premium branded modular switches.',
                Terrace: 'Advanced weathering treatment with better thermal insulation and slope management.',
                Plumbing: 'Premium branded CP fittings and sanitaryware with superior chrome finish.',
                'Plaster & Putty': 'Superior leveling with high-grade putty for a perfectly flat wall surface.',
                Painting: 'Multi-coat premium emulsion for a richer look and better washability.',
                Waterproofing: 'Double-layer waterproofing system with reinforced mesh for long-term reliability.'
            },
            Premium: {
                Structure: 'Industrial-grade structural execution with enhanced seismic resistance and QA logs.',
                Foundation: 'Heavy-duty foundation standards with chemical soil treatment and premium concrete mix.',
                Masonry: 'Elite block work with precision bonding and specialized crack-resistant detailing.',
                Flooring: 'Luxury Imported Marble flooring with high-precision laying and mirror-finish polish.',
                Staircase: 'Imported Marble staircase with designer nosing and integrated LED profile slots.',
                Doors: 'Exotic Teak wood main door and premium veneer-finish internal doors.',
                Windows: 'High-end uPVC/Architectural Aluminum sections with toughened glass performance.',
                Electrical: 'Comprehensive smart-ready electrical package with designer glass switches.',
                Terrace: 'Architectural terrace finish with cool-roof tiling and superior drainage planning.',
                Plumbing: 'Luxury range CP/Sanitaryware (Jaguar/Kohler) with concealed divertors.',
                'Plaster & Putty': 'Artisanal plaster finish with ultra-smooth gypsum/premium putty base.',
                Painting: 'Luxury velvet-finish paints with accent wall textures for a designer interior.',
                Waterproofing: 'Advanced crystalline waterproofing treatment for 100% leak-proof assurance.'
            },
            Luxury: { // Elite
                Structure: 'Elite-grade structural engineering with maximum durability and highest safety factors.',
                Foundation: 'World-class foundation design with specialized waterproofing and elite supervision.',
                Masonry: 'Zero-tolerance masonry work with specialized alignment and premium bonding material.',
                Flooring: 'Exquisite Italian Marble flooring with bespoke book-matching and seamless finish.',
                Staircase: 'Designer Italian Marble staircase with glass railings and premium stone detailing.',
                Doors: 'Custom-crafted Solid Wood doors with biometric access and premium PVD hardware.',
                Windows: 'Slimline system windows with acoustic laminations and high-performance glazing.',
                Electrical: 'Full home automation ready package with elite-series touch panels and scene control.',
                Terrace: 'Elite rooftop finish with landscaped deck suitability and advanced insulation.',
                Plumbing: 'Ultra-luxury sanitaryware (Toto/Grohe/Kohler) with wall-hung premium fixtures.',
                'Plaster & Putty': 'High-precision wall engineering with specialized surface treatments for elite finish.',
                Painting: 'Designer-series paints and royal textures with maximum durability and depth.',
                Waterproofing: 'Premium membrane-based waterproofing with multi-year performance warranty.'
            }
        };

        const buildGradeFacilities = (upgrades = null) =>
            baseFacilities.map(item => ({
                title: item.title,
                detail: upgrades?.[item.title] || item.detail
            }));

        const gradeFacilities = {
            Base: buildGradeFacilities(),
            Classic: buildGradeFacilities(gradeUpgrades.Classic),
            Premium: buildGradeFacilities(gradeUpgrades.Premium),
            Luxury: buildGradeFacilities(gradeUpgrades.Luxury)
        };

        const selectedGrade = inputs.structural_style || 'Base';
        const facilitiesForGrade = gradeFacilities[selectedGrade] || gradeFacilities.Base;
        const selectedGradeLabel = selectedGrade === 'Luxury' ? 'Elite' : selectedGrade;

        const facilityPriorityOrder = {
            Structure: 100,
            Foundation: 95,
            Masonry: 88,
            Flooring: 82,
            Electrical: 76,
            Plumbing: 74,
            Doors: 66,
            Windows: 62,
            Staircase: 58,
            Terrace: 52,
            'Plaster & Putty': 48,
            Painting: 44,
            Waterproofing: 40
        };

        const facilitiesForGradeSorted = [...facilitiesForGrade].sort(
            (a, b) => (facilityPriorityOrder[b.title] || 0) - (facilityPriorityOrder[a.title] || 0)
        );

        return (
            <WizardShell config={config} step={step} inputs={inputs} onBack={onBack} onNext={handleNext} nextLabel="LOOKS GOOD - CONTINUE NEXT" total={total} showTopNext={false}>
                <GlassCard style={{ padding: '3.5rem 4rem 2.5rem', minHeight: '82vh', maxWidth: '1480px' }}>
                    <h2 style={{ fontSize: '3.4rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: '0.6rem', letterSpacing: '-0.6px' }}>Structure Plan</h2>
                    <p style={{ opacity: 0.55, fontSize: '1rem', letterSpacing: '1.1px', marginBottom: '1.8rem' }}>CONFIRM THE INCLUDED FACILITIES BEFORE PROCEEDING</p>

                    <div style={{
                        marginTop: '0.5rem',
                        background: 'linear-gradient(135deg, rgba(0,242,255,0.06), rgba(112,0,255,0.05))',
                        border: '1px solid rgba(0,242,255,0.2)',
                        borderRadius: '1.6rem',
                        padding: '1.8rem 1.9rem'
                    }}>
                        <h4 style={{ fontSize: '1.08rem', fontWeight: 800, marginBottom: '1rem', opacity: 0.95, letterSpacing: '1.7px' }}>
                            FACILITIES INCLUDED IN {selectedGradeLabel.toUpperCase()} GRADE
                        </h4>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '1.1rem',
                            maxHeight: '52vh',
                            overflowY: 'auto',
                            paddingRight: '0.5rem',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(0,242,255,0.3) transparent'
                        }}>
                            {facilitiesForGradeSorted.map(f => (
                                <div key={f.title} style={{
                                    background: 'rgba(255,255,255,0.035)',
                                    border: '1px solid rgba(255,255,255,0.09)',
                                    borderRadius: '1.1rem',
                                    padding: '1.15rem 1.3rem',
                                    minHeight: '145px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                                }}>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#00f2ff', letterSpacing: '1.2px', marginBottom: '0.55rem' }}>{f.title.toUpperCase()}</div>
                                    <div style={{ fontSize: '1.04rem', opacity: 0.85, lineHeight: 1.55 }}>{f.detail}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>
                <div style={{ width: '92vw', maxWidth: '1480px', marginTop: '0.8rem' }}>
                    <BottomStepButton
                        label="CONTINUE NEXT"
                        onClick={handleNext}
                        top="0"
                    />
                </div>
            </WizardShell>
        );
    }

    /* STEP 7: Interior Selection */
    if (currentStep.type === 'interior-select') {
        const section = currentStep.sections[0];
        const canProceed = Boolean(inputs[section.field]);
        const selectedGrade = inputs.structural_style || 'Base';

        const packageLabels = {
            none: 'None',
            base: 'Base',
            semi: 'Semi',
            full_furnished: 'Full'
        };

        const getAIRecommendation = (pkgValue) => {
            if (selectedGrade === 'Base' && pkgValue === 'base') return 'OPTIMAL COST-VALUE BALANCE';
            if (selectedGrade === 'Classic' && pkgValue === 'semi') return 'PERFECT LIFESTYLE MATCH';
            if (selectedGrade === 'Premium' && pkgValue === 'full_furnished') return 'LUXURY SYNERGY CHOICE';
            if (selectedGrade === 'Luxury' && pkgValue === 'full_furnished') return 'ULTIMATE TURNKEY EXCELLENCE';
            return null;
        };

        return (
            <WizardShell config={config} step={step} inputs={inputs} onBack={onBack} onNext={handleNext} total={total} showTopNext={false}>
                <div style={{ padding: '1.5rem 2.5rem', maxWidth: '1820px', margin: '0 auto', height: '90vh', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '3rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#fff', marginBottom: '0.4rem', letterSpacing: '-1.2px' }}>Interior Selection</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                            <div style={{ width: '50px', height: '3px', background: '#00f2ff', borderRadius: '10px' }}></div>
                            <p style={{ color: '#00f2ff', opacity: 0.8, fontSize: '0.9rem', letterSpacing: '3px', fontWeight: 950, textTransform: 'uppercase' }}>
                                AI SYNCING WITH {selectedGrade.toUpperCase()} GRADE
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem', alignItems: 'stretch', flex: 1, minHeight: 0 }}>
                        {section.options.map(opt => {
                            const isActive = inputs[section.field] === opt.value;
                            const aiRec = getAIRecommendation(opt.value);
                            const displayLabel = packageLabels[opt.value] || opt.label;

                            return (
                                <div
                                    key={opt.value}
                                    onClick={() => setField(section.field, opt.value)}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: '2.2rem',
                                        border: isActive ? '2.5px solid #00f2ff' : aiRec ? '1px solid rgba(0,242,255,0.3)' : '1px solid rgba(255,255,255,0.12)',
                                        background: isActive ? 'rgba(0,242,255,0.06)' : 'rgba(10, 14, 20, 0.96)',
                                        backdropFilter: 'blur(40px)',
                                        padding: '2rem',
                                        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        position: 'relative',
                                        boxShadow: isActive ? '0 15px 30px rgba(0,242,255,0.1)' : '0 20px 40px rgba(0,0,0,0.4)',
                                        overflow: 'hidden',
                                        height: '100%'
                                    }}>

                                    {aiRec && (
                                        <div style={{
                                            position: 'absolute', top: '0', right: '0',
                                            background: 'linear-gradient(135deg, #00f2ff, #20e3b2)', color: '#000',
                                            fontSize: '0.7rem', fontWeight: 1000, padding: '0.4rem 1.2rem', borderRadius: '0 0 0 1.5rem',
                                            whiteSpace: 'nowrap', letterSpacing: '1px', zIndex: 5
                                        }}>
                                            ✨ AI CHOICE
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ fontSize: '1.6rem', fontWeight: 1000, letterSpacing: '0.5px', color: isActive ? '#00f2ff' : '#fff' }}>{displayLabel.toUpperCase()}</div>
                                        {isActive && (
                                            <div style={{
                                                fontSize: '0.7rem', fontWeight: 1000, letterSpacing: '1px',
                                                color: '#000', background: '#00f2ff',
                                                borderRadius: '999px', padding: '0.3rem 0.8rem'
                                            }}>SELECTED</div>
                                        )}
                                    </div>

                                    <div style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.4, fontWeight: 400, color: '#fff' }}>{opt.desc}</div>

                                    <div style={{ fontSize: '0.85rem', color: '#00f2ff', fontWeight: 1000, letterSpacing: '2px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginTop: '0.5rem' }}>
                                        INCLUSIONS
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr',
                                        gap: '0.6rem',
                                        overflowY: 'auto',
                                        flex: 1,
                                        paddingRight: '0.5rem',
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: 'rgba(0,242,255,0.2) transparent'
                                    }}>
                                        {(opt.inclusions || []).map(point => (
                                            <div key={point} style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.3, display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                                                <div style={{ minWidth: '6px', height: '6px', background: '#00f2ff', borderRadius: '50%', marginTop: '0.3rem' }} />
                                                <span style={{ fontWeight: 300, color: '#fff' }}>{point}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#00f2ff', fontWeight: 1000, letterSpacing: '2px', marginBottom: '0.5rem' }}>
                                            EXPLAINABLE AI
                                        </div>
                                        <div style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: 1.4, fontStyle: 'italic', color: '#fff', borderLeft: '3px solid #00f2ff', paddingLeft: '1rem', fontWeight: 300 }}>
                                            "{opt.aiExplain}"
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <div
                            onClick={() => { if (canProceed) handleNext(); }}
                            style={{
                                width: '100%',
                                maxWidth: '600px',
                                height: '70px',
                                background: canProceed ? 'linear-gradient(90deg, #131722, #1d2230)' : 'rgba(255,255,255,0.05)',
                                border: canProceed ? '2px solid #00f2ff' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: canProceed ? 'pointer' : 'not-allowed',
                                transition: 'all 0.4s ease',
                                boxShadow: canProceed ? '0 20px 40px rgba(0,242,255,0.15)' : 'none'
                            }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 950, color: canProceed ? '#fff' : 'rgba(255,255,255,0.2)', letterSpacing: '4px' }}>
                                {canProceed ? 'LOOKS GOOD - CONTINUE →' : 'SELECT TO CONTINUE'}
                            </span>
                        </div>
                    </div>
                </div>
            </WizardShell>
        );
    }

    /* STEP 8: Addons */
    if (currentStep.type === 'addons') {
        const configForType = projectConfigs[inputs.project_type] || projectConfigs.own_house;
        const floorGradeStep = configForType.steps.find(s => s.type === 'floor-grade');
        const selectedFloor = floorGradeStep?.floorOptions.find(o => o.value === inputs.floor);
        const selectedGrade = floorGradeStep?.gradeOptions.find(o => o.value === (inputs.structural_style || 'Base'));

        const isDouble = inputs.plot_size === 'double';
        const areaFt = isDouble ? '2,400' : '1,200';

        const GlassPanel = ({ children, title, subtitle }) => (
            <div style={{
                background: 'rgba(15, 20, 25, 0.45)',
                backdropFilter: 'blur(45px) saturate(180%)',
                borderRadius: '2.5rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                boxShadow: '0 50px 100px rgba(0,0,0,0.6)',
                height: '100%'
            }}>
                {title && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ color: '#00f2ff', fontSize: '0.85rem', fontWeight: 1000, letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '0.6rem' }}>{subtitle}</div>
                        <h3 style={{ fontSize: '2.8rem', fontWeight: 900, margin: 0, letterSpacing: '-1.5px' }}>{title}</h3>
                    </div>
                )}
                {children}
            </div>
        );

        const ListDetail = ({ label, value, action = null }) => (
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.6rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                width: '100%'
            }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>{label}</span>
                {action ? action : <span style={{ fontSize: '1.25rem', fontWeight: 1000, color: '#fff' }}>{value}</span>}
            </div>
        );

        const YesNoToggle = ({ active, onClick }) => (
            <div onClick={onClick} style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.03)',
                padding: '5px',
                borderRadius: '14px',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
                width: '130px',
                transition: '0.3s'
            }}>
                <div style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px 0',
                    fontSize: '0.8rem',
                    fontWeight: 1000,
                    borderRadius: '10px',
                    background: active ? '#00f2ff' : 'transparent',
                    color: active ? '#000' : 'rgba(255,255,255,0.2)',
                    transition: '0.3s'
                }}>YES</div>
                <div style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px 0',
                    fontSize: '0.8rem',
                    fontWeight: 1000,
                    borderRadius: '10px',
                    background: !active ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: !active ? '#fff' : 'rgba(255,255,255,0.2)',
                    transition: '0.3s'
                }}>NO</div>
            </div>
        );

        return (
            <div style={{
                width: '100vw',
                minHeight: '100vh',
                background: `linear-gradient(rgba(10,12,18,0.7), rgba(10,12,18,0.9)), url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                padding: '6rem 8vw',
                display: 'flex',
                flexDirection: 'column',
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                gap: '5rem',
                overflowY: 'auto'
            }}>

                {/* HEADER SECTION: BACK BUTTON ON LEFT */}
                <div style={{ width: '100%', maxWidth: '1728px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '4rem' }}>
                    <div
                        onClick={onBack}
                        style={{
                            cursor: 'pointer',
                            padding: '1.2rem 2.4rem',
                            borderRadius: '1.2rem',
                            background: 'rgba(255,255,255,0.04)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            fontSize: '0.85rem',
                            fontWeight: 900,
                            color: 'rgba(255,255,255,0.6)',
                            letterSpacing: '3px',
                            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                            flexShrink: 0
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateX(-5px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                        ← GO BACK
                    </div>
                    <h1 style={{ fontSize: '4.8rem', fontWeight: 900, letterSpacing: '-3.5px', margin: 0 }}>Project Specification</h1>
                </div>

                <div style={{ width: '100%', maxWidth: '1728px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(600px, 1.3fr) 1fr', gap: '5vw', alignItems: 'start' }}>

                    {/* LEFT Panel (Architectural Specs) */}
                    <GlassPanel>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <ListDetail label="Project Type" value="Dream House" />
                            <ListDetail label="Building Elevation" value="G+1 DUPLEX" />
                            <ListDetail label="Building Grade" value="BASE" />
                            <ListDetail
                                label="Interior Selection"
                                action={
                                    <span
                                        onClick={() => {
                                            const options = ['None', 'Base', 'Semi', 'Full'];
                                            const idx = options.indexOf(inputs.interior_package || 'None');
                                            setField('interior_package', options[(idx + 1) % options.length]);
                                        }}
                                        style={{
                                            fontSize: '1.25rem',
                                            fontWeight: 1000,
                                            color: inputs.interior_package !== 'None' ? '#00f2ff' : 'rgba(255,255,255,0.4)',
                                            cursor: 'pointer',
                                            transition: '0.3s'
                                        }}
                                    >
                                        {(inputs.interior_package || 'NONE').toUpperCase()}
                                    </span>
                                }
                            />
                            <ListDetail label="Primary Plot Area" value={`${areaFt} SQ FT`} />
                            <ListDetail label="Site Dimensions" value={inputs.dimensions || (isDouble ? '40 x 60' : '30 x 40')} />
                            <ListDetail label="Structural Volume" value={`${inputs.bedrooms || 3} BHK`} />
                            <ListDetail label="Household Members" value={`${inputs.family_count || 4} PERSONS`} />
                            <ListDetail label="Seniors in Residency" value={inputs.grandparents_living ? 'YES' : 'NONE'} />
                            <ListDetail label="Lift" value={inputs.lift_required ? 'YES' : 'NO'} />
                            <ListDetail label="Pooja Room" value={inputs.pooja_room ? 'YES' : 'NO'} />
                        </div>
                    </GlassPanel>

                    {/* RIGHT: ADDITIONAL ADD-ONS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5vw' }}>
                        <GlassPanel title="Additional Add-ons" subtitle="System Enhancement">
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {['include_compound_wall', 'include_rainwater_harvesting', 'include_car_parking'].map(field => {
                                    const addon = currentStep.addons.find(a => a.field === field);
                                    return (
                                        <ListDetail
                                            key={field}
                                            label={addon?.label || 'ADD-ON'}
                                            action={
                                                <YesNoToggle active={inputs[field]} onClick={() => setField(field, !inputs[field])} />
                                            }
                                        />
                                    );
                                })}
                            </div>

                            <div
                                onClick={handleNext}
                                style={{
                                    marginTop: '3.5rem',
                                    background: 'transparent',
                                    border: '1px solid #fff',
                                    padding: '1.2rem 2.4rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '1.2rem',
                                    fontWeight: 1000,
                                    letterSpacing: '8px',
                                    color: '#fff',
                                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                    textTransform: 'uppercase',
                                    fontSize: '0.9rem',
                                    maxWidth: '320px',
                                    margin: '3.5rem auto 0'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; e.currentTarget.style.transform = 'scale(1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                Generate Estimate ↗
                            </div>
                        </GlassPanel>

                        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'rgba(255,255,255,0.12)', letterSpacing: '6px', padding: '0 2.5rem' }}>
                            ARCHITECTURAL_OS_v4.5 // LIQUID_GLASS_CORE
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // Unified logic moved outside or handled globally

    const getCategory = (name) => {
        const n = name.toLowerCase();
        if (n.includes('excav') || n.includes('rcc') || n.includes('foundation') || n.includes('masonry') || n.includes('steel') || n.includes('concrete') || n.includes('earthwork') || n.includes('structure')) return 'STRUCTURE';
        if (n.includes('plumb') || n.includes('elect') || n.includes('sanit') || n.includes('septic') || n.includes('wiring') || n.includes('utility')) return 'FIXED COST';
        if (n.includes('floor') || n.includes('paint') || n.includes('plaster') || n.includes('tile') || n.includes('door') || n.includes('window') || n.includes('woodwork') || n.includes('finish')) return 'FINISH';
        if (n.includes('compound') || n.includes('parking') || n.includes('rain') || n.includes('lift') || n.includes('gate') || n.includes('waterproof') || n.includes('solar') || n.includes('staircase')) return 'ADJUSTMENT';
        if (n.includes('interior')) return 'INTERIOR';
        return 'STRUCTURE';
    };

    const catColor = {
        'STRUCTURE': { bg: 'rgba(139,92,246,0.18)', text: '#A78BFA', border: 'rgba(139,92,246,0.4)' },
        'UTILITIES': { bg: 'rgba(6,182,212,0.15)', text: '#22D3EE', border: 'rgba(6,182,212,0.4)' },
        'BATHROOM': { bg: 'rgba(251,191,36,0.13)', text: '#FCD34D', border: 'rgba(251,191,36,0.35)' },
        'ELECTRICAL': { bg: 'rgba(52,211,153,0.13)', text: '#6EE7B7', border: 'rgba(52,211,153,0.35)' },
        'FLOORING': { bg: 'rgba(244,114,182,0.13)', text: '#F9A8D4', border: 'rgba(244,114,182,0.35)' },
        'EXTERIOR': { bg: 'rgba(167,139,250,0.13)', text: '#C4B5FD', border: 'rgba(167,139,250,0.35)' },
        'OPTIONAL': { bg: 'rgba(236,72,153,0.13)', text: '#F472B6', border: 'rgba(236,72,153,0.35)' }
    };

    const liquidGlass = {
        background: 'rgba(255,255,255,0)', /* Maximum Transparency */
        backdropFilter: 'blur(8px) saturate(110%)',
        WebkitBackdropFilter: 'blur(8px) saturate(110%)',
        border: '1px solid rgba(255,255,255,0.03)',
        borderRadius: '32px',
        boxShadow: '0 24px 80px 0 rgba(0,0,0,0.5)',
    };

    /* ─── STEP 9: Cost Estimation — Premium AI Dashboard ─── */
    if (currentStep.type === 'final-estimate') {

        const totalCost = estData?.total_cost || 0;
        const breakdown = Array.isArray(estData?.breakdown) ? estData.breakdown : [];
        const sorted = [...breakdown].sort((a, b) => (b.amount || 0) - (a.amount || 0));

        return (
            <div style={{
                minHeight: '100vh', width: '100vw', color: '#fff',
                fontFamily: "'Inter', 'Outfit', sans-serif", overflowY: 'auto',
                background: 'transparent', /* Transparent to show the layers below */
                position: 'relative',
                scrollBehavior: 'smooth'
            }}>
                {/* Layer -1: Deep Base Color */}
                <div style={{ position: 'fixed', inset: 0, background: '#05030A', zIndex: -3 }} />

                {/* Layer 0: High-definition cityscape background */}
                <div style={{
                    position: 'fixed', inset: 0, zIndex: -2,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=2000&q=95)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    opacity: 0.95,
                    filter: 'contrast(1.1) saturate(1.1) brightness(0.7)'
                }} />

                {/* Layer 1: Subtle Vignette to keep text readable */}
                <div style={{
                    position: 'fixed', inset: 0, zIndex: -1,
                    background: 'radial-gradient(circle at center, transparent 0%, rgba(5,3,10,0.6) 100%)'
                }} />

                {/* Layer 2: Main Content Stack */}
                <div style={{ position: 'relative', zIndex: 2 }}>

                    {/* Glow orbs - clearly floating */}
                    <div style={{ position: 'fixed', top: '10%', left: '25%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }} />
                    <div style={{ position: 'fixed', bottom: '0%', right: '15%', width: '35vw', height: '35vw', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }} />

                    {/* ── 1. FLOATING HEADER (Centered) ── */}
                    <div style={{ position: 'relative', zIndex: 100, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', color: '#fff', fontSize: '13px', fontWeight: 600, transition: 'all 0.25s', whiteSpace: 'nowrap', fontFamily: "'Outfit', sans-serif" }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            >← Go Back</button>
                            <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.12)' }} />
                            <div style={{ background: '#fff', color: '#000', padding: '6px 14px', borderRadius: '4px', fontWeight: 1000, fontSize: '16px', letterSpacing: '0.1em' }}>AI</div>
                            <h1 style={{ fontSize: '56px', fontWeight: 1000, margin: 0, color: '#fff', letterSpacing: '-2px', fontFamily: "'Outfit', sans-serif", textTransform: 'uppercase' }}>Cost Estimation</h1>
                        </div>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '1550px', margin: '0 auto', padding: '0 32px 100px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                        {/* Loading */}
                        {(loadingEst || !estData || estData.error) && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', minHeight: '60vh' }}>
                                {loadingEst ? (
                                    <>
                                        <div style={{ width: '64px', height: '64px', border: '3px solid rgba(139,92,246,0.2)', borderTop: '3px solid #8B5CF6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                        <div style={{ fontSize: '14px', letterSpacing: '0.25em', color: '#A78BFA', fontWeight: 600 }}>COMPUTING YOUR ESTIMATE...</div>
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                                        <div style={{ fontSize: '18px', color: '#ef4444', fontWeight: 800 }}>ESTIMATION UNAVAILABLE</div>
                                        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>{estData?.message || "Please check your connectivity or plot specifications."}</div>
                                        <button onClick={onBack} style={{ marginTop: '24px', padding: '10px 30px', borderRadius: '12px', border: '1px solid #8B5CF6', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Back to Wizard</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {estData && !loadingEst && !estData.error && (<>

                            {/* ── 2. PROJECT SUMMARY ── */}
                            <div style={{
                                ...liquidGlass,
                                padding: '28px 48px',
                                background: 'rgba(255,255,255,0)', // 40% more transparent
                                backdropFilter: 'blur(8px) saturate(110%)',  // Near-invisible glass
                                WebkitBackdropFilter: 'blur(8px) saturate(110%)',
                                border: '1px solid rgba(255,255,255,0.04)',
                                animation: 'fadeInUp 0.6s ease',
                                fontFamily: "'Outfit', sans-serif"
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ color: '#8B5CF6', fontSize: '22px' }}>🏠</div>
                                        <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Outfit', sans-serif" }}>Project Configuration</h2>
                                    </div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', fontFamily: "'Outfit', sans-serif" }}>SYNCED WITH AI CORE</div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                    {Object.entries(estData.project_summary || {}).map(([label, value], i) => (
                                        <div key={i} style={{
                                            padding: '14px 20px',
                                            borderRadius: '14px',
                                            border: '1px solid rgba(255,255,255,0.04)',
                                            background: 'rgba(255,255,255,0)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '6px',
                                            transition: 'all 0.3s ease',
                                            fontFamily: "'Outfit', sans-serif"
                                        }}>
                                            <div style={{ fontSize: '9px', color: 'rgba(103,232,249,0.85)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', fontFamily: "'Outfit', sans-serif" }}>
                                                {label.replace(/_/g, ' ')}
                                            </div>
                                            <div style={{ fontSize: '17px', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.02em' }}>
                                                {value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── 3. TOTAL INVESTMENT HERO BOX ── */}
                            <div style={{
                                ...liquidGlass,
                                padding: '80px 72px',
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.10) 0%, rgba(107,33,173,0.07) 100%)',
                                textAlign: 'center',
                                animation: 'fadeInUp 0.7s ease 0.1s both',
                                border: '1px solid rgba(139,92,246,0.12)',
                                backdropFilter: 'blur(8px) saturate(110%)', // Near-invisible glass
                                WebkitBackdropFilter: 'blur(8px) saturate(110%)',
                                position: 'relative',
                                overflow: 'hidden',
                                transform: 'scale(1.05)',
                                boxShadow: '0 40px 100px rgba(0,0,0,0.3), 0 0 60px rgba(139,92,246,0.05)'
                            }}>
                                {/* Ambient Glow Inside Hero */}
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', height: '90%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

                                <div style={{ fontSize: '16px', letterSpacing: '0.6em', color: 'rgba(255,255,255,0.5)', marginBottom: '24px', textTransform: 'uppercase', fontWeight: 900 }}>Total Investment</div>
                                <div style={{ fontSize: '144px', fontWeight: 1000, letterSpacing: '-8px', color: '#fff', lineHeight: 1, textShadow: '0 0 100px rgba(103,232,249,0.4), 0 0 40px rgba(139,92,246,0.6)', position: 'relative' }}>
                                    <span style={{ fontSize: '56px', verticalAlign: 'top', marginRight: '10px', opacity: 0.7 }}>₹</span>
                                    <CountUp end={estData.total_cost} />
                                </div>
                                <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginTop: '30px', fontWeight: 700, letterSpacing: '0.15em' }}>PRECISION AI VALUATION · 2026 LIVE</div>
                            </div>

                            {/* ── 4. DETAILED BREAKDOWN GRID ── */}
                            <div style={{
                                ...liquidGlass,
                                padding: '28px 40px',
                                background: 'rgba(255,255,255,0)',
                                backdropFilter: 'blur(8px) saturate(110%)', // Near-invisible glass
                                WebkitBackdropFilter: 'blur(8px) saturate(110%)',
                                border: '1px solid rgba(255,255,255,0.03)',
                                animation: 'fadeInUp 0.8s ease 0.2s both',
                                fontFamily: "'Outfit', sans-serif"
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ fontSize: '20px' }}>📑</div>
                                        <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#fff' }}>Detailed Breakdown</h2>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', fontFamily: "'Outfit', sans-serif" }}>
                                    {(estData.breakdown || []).map((item, idx) => {
                                        const cat = item.category || 'STRUCTURE';
                                        const c = catColor[cat] || catColor['STRUCTURE'];
                                        return (
                                            <div key={idx} style={{
                                                padding: '14px 24px', // Reduced vertical by further 15%
                                                background: 'rgba(255,255,255,0.001)', // Near-Invisible Floating
                                                borderRadius: '20px',
                                                border: '1px solid rgba(255,255,255,0.03)',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px',
                                                animation: `fadeInUp 0.6s ease ${0.3 + idx * 0.05}s both`,
                                                fontFamily: "'Outfit', sans-serif"
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{
                                                        fontSize: '10px', fontWeight: 800, color: c.text, background: c.bg,
                                                        border: `1px solid ${c.border}`, padding: '3px 9px', borderRadius: '5px',
                                                        letterSpacing: '0.18em', fontFamily: "'Outfit', sans-serif"
                                                    }}>{cat}</span>
                                                    <div style={{ fontSize: '12px', color: '#67E8F9', fontWeight: 700, fontFamily: "'Outfit', sans-serif", letterSpacing: '0.05em' }}>{item.percentage}%</div>
                                                </div>
                                                <div style={{
                                                    fontSize: '17px', fontWeight: 400, color: 'rgba(255,255,255,0.88)',
                                                    minHeight: '40px', lineHeight: '1.5', letterSpacing: '0.02em',
                                                    fontFamily: "'Outfit', sans-serif"
                                                }}>{item.component}</div>
                                                <div style={{
                                                    fontSize: '29px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px',
                                                    fontFamily: "'Outfit', sans-serif"
                                                }}>
                                                    <CountUp end={item.amount} />
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* ── 2026 Inflation Margin Card ── */}
                                    {estData && (
                                        <>
                                            <div style={{
                                                ...liquidGlass,
                                                background: 'rgba(103,232,249,0.03)',
                                                border: '1px solid rgba(103,232,249,0.15)',
                                                padding: '24px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                fontFamily: "'Outfit', sans-serif"
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{
                                                        fontSize: '10px', fontWeight: 800, color: '#22D3EE', background: 'rgba(6,182,212,0.1)',
                                                        border: '1px solid rgba(6,182,212,0.3)', padding: '3px 9px', borderRadius: '5px',
                                                        letterSpacing: '0.15em'
                                                    }}>2026 INFLATION MARGIN</span>
                                                    <div style={{ fontSize: '12px', color: '#67E8F9', fontWeight: 700 }}>1.02%</div>
                                                </div>
                                                <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>Market Escalation Factor</div>
                                                <div style={{ fontSize: '29px', fontWeight: 900, color: '#67E8F9', letterSpacing: '-0.5px' }}>
                                                    + ₹<CountUp end={estData.inflation_amount || (estData.total_cost - (estData.total_cost / 1.0102))} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* ── 5. FINAL DECISION SECTION ── */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
                                <div style={{ ...liquidGlass, padding: '40px', background: 'rgba(255,255,255,0)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                        <div style={{ color: '#67E8F9', fontSize: '20px' }}>📈</div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#fff' }}>Market Analysis</h3>
                                    </div>
                                    <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(103,232,249,0.03)', border: '1px solid rgba(103,232,249,0.1)' }}>
                                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                                            Based on our deep logic analysis of the <strong style={{ color: '#67E8F9' }}>2026 market dynamics</strong>, this valuation represents the most accurate and competitive fit for your specific project requirements.
                                            We have benchmarked this against current Tier-1 city construction indices to ensure that every structural and finish component is priced for maximum cost-efficiency.{' '}
                                            This estimation is engineered to withstand current material volatility while maintaining a premium standard of civil architectural quality.{' '}
                                            Your current configuration stands as the <strong style={{ color: '#FCD34D' }}>best architectural investment</strong> as per current market trends and professional construction benchmarks.
                                        </p>
                                    </div>
                                </div>

                                <div style={{ ...liquidGlass, padding: '40px', background: 'rgba(255,255,255,0)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                        <div style={{ color: '#FCD34D', fontSize: '20px' }}>✨</div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#fff' }}>Smart Upgrades</h3>
                                    </div>
                                    <div style={{ fontSize: '19px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', marginBottom: '32px', fontFamily: "'Outfit', sans-serif" }}>
                                        Upgrade costs tailored to your project — based on bedrooms, family size, and lift requirements.{' '}
                                        These intelligent enhancements are specifically calculated to ensure optimal space utility and architectural flow for your unique BHK configuration.{' '}
                                        Integrating these premium finishes and mechanical assets now can significantly reduce long-term maintenance overheads while maximizing the property's future equity.{' '}
                                        Our AI model suggests these specific additions to future-proof your structural investment against evolving modern lifestyle standards and high-density residential trends.
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                                        {!showUpgradeOptions ? (
                                            <>
                                                <button
                                                    onClick={() => { setShowUpgradeOptions(true); setShowFinalize(false); }}
                                                    style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                >YES</button>
                                                <button
                                                    onClick={() => setShowFinalize(true)}
                                                    style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                >NO (Finalize Estimate)</button>
                                            </>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                                                {['Classic', 'Premium', 'Elite'].map(grade => {
                                                    const multipliers = { 'Base': 1.0, 'Classic': 1.15, 'Premium': 1.30, 'Elite': 1.45 };
                                                    const currentGrade = inputs.structural_style || 'Base';
                                                    const currentTotal = estData?.total_cost || 0;
                                                    const baseTotal = currentTotal / multipliers[currentGrade];
                                                    const upgradedTotal = baseTotal * multipliers[grade];

                                                    return (
                                                        <button
                                                            key={grade}
                                                            onClick={async () => {
                                                                const newInputs = { ...inputs, structural_style: grade };
                                                                setInputs(newInputs);
                                                                setShowUpgradeOptions(false);

                                                                // Manual re-fetch with new inputs
                                                                setLoadingEst(true);
                                                                try {
                                                                    const endpoint = `${API_BASE_URL}/${projectType.replace('_', '-')}/estimate`;
                                                                    const res = await fetch(endpoint, {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify(newInputs)
                                                                    });
                                                                    const data = await res.json();
                                                                    setEstData(data);
                                                                    setDisplayTotal(data.total_cost || 0);
                                                                } catch (err) { console.error(err); }
                                                                finally { setLoadingEst(false); }
                                                            }}
                                                            style={{
                                                                width: '100%', padding: '24px', borderRadius: '14px',
                                                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                                                color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                                cursor: 'pointer', transition: '0.2s', fontFamily: "'Outfit', sans-serif"
                                                            }}
                                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                                        >
                                                            <span style={{ fontSize: '20px', fontWeight: 600 }}>{grade === 'Elite' ? 'LUXURY' : grade.toUpperCase()} GRADE</span>
                                                            <span style={{ fontWeight: 900, color: '#67E8F9', fontSize: '24px' }}>₹{new Intl.NumberFormat('en-IN').format(Math.round(upgradedTotal))}</span>
                                                        </button>
                                                    );
                                                })}
                                                <button
                                                    onClick={() => setShowUpgradeOptions(false)}
                                                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '18px', cursor: 'pointer', marginTop: '4px', fontFamily: "'Outfit', sans-serif" }}
                                                >← Back to Decison</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ── 6. FINAL AUTHORIZATION BLOCK (Digital Signature) ── */}
                            {showFinalize && !showUpgradeOptions && (
                                <div style={{ ...liquidGlass, padding: '48px', marginTop: '32px', animation: 'fadeInUp 0.6s ease', background: 'rgba(255,255,255,0)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '64px' }}>
                                        {/* Left: Digital Signature */}
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '32px', letterSpacing: '0.05em', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>DIGITAL AUTHORIZATION</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '0.15em', fontFamily: "'Outfit', sans-serif" }}>CLIENT FULL NAME</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Type full legal name..."
                                                        value={clientName}
                                                        onChange={(e) => setClientName(e.target.value)}
                                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '18px 24px', borderRadius: '14px', color: '#fff', fontSize: '16px', fontFamily: "'Outfit', sans-serif", outline: 'none' }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '0.15em', fontFamily: "'Outfit', sans-serif" }}>DIGITAL SIGNATURE (DRAW BELOW)</label>
                                                    <SignaturePad onSave={(data) => { setSignature(data); setSaveError(null); }} onClear={() => setSignature('')} />
                                                </div>
                                                {saveError && (
                                                    <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#FCA5A5', fontSize: '12px', fontWeight: 600 }}>
                                                        ⚠️ {saveError}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Terms & Conditions */}
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '32px', letterSpacing: '0.05em', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>TERMS & CONDITIONS</h3>
                                            <div style={{ padding: '28px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.8', fontFamily: "'Outfit', sans-serif", flex: 1 }}>
                                                1. Valuation indexed to 2026 market benchmarks for plot size {inputs.plot_size}.<br /><br />
                                                2. Final execution costs subject to ±5% variance based on site-specific geotechnical reports.<br /><br />
                                                3. This AI-driven appraisal is valid for persistent architectural planning for 30 calendar days.
                                            </div>

                                            {saveSuccess ? (
                                                <div style={{
                                                    marginTop: '32px', padding: '32px', borderRadius: '20px',
                                                    background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.3)',
                                                    color: '#6EE7B7', textAlign: 'center', fontWeight: 800,
                                                    fontFamily: "'Outfit', sans-serif", letterSpacing: '0.05em',
                                                    animation: 'pulse 2s infinite'
                                                }}>
                                                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>✓ PROJECT SECURED</div>
                                                    <div style={{ fontSize: '13px', opacity: 0.8 }}>REDIRECTING TO ARCHIVE IN 6 SECONDS...</div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={handleSaveProject}
                                                    disabled={isSaving}
                                                    style={{
                                                        width: '100%', marginTop: '32px', padding: '24px', borderRadius: '16px',
                                                        background: isSaving ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #00F2FF, #006AFF)',
                                                        border: 'none', color: '#fff', fontWeight: 900, fontSize: '18px',
                                                        cursor: isSaving ? 'not-allowed' : 'pointer', transition: '0.3s',
                                                        letterSpacing: '0.1em', fontFamily: "'Outfit', sans-serif",
                                                        boxShadow: isSaving ? 'none' : '0 10px 30px rgba(0,106,255,0.3)',
                                                        opacity: (!clientName || !signature) ? 0.4 : 1
                                                    }}
                                                    onMouseEnter={e => !isSaving && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                                    onMouseLeave={e => !isSaving && (e.currentTarget.style.transform = 'translateY(0)')}
                                                >
                                                    {isSaving ? 'VALIDATING & PERSISTING...' : 'AUTHORIZE & SAVE PROJECT'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </>)}
                    </div>

                </div> {/* End Outer Wrapper */}
            </div>
        );
    }


    /* ─── Default Steps (Building Height, Construction Grade, etc.) ─── */
    const field = currentStep.field;
    return (
        <WizardShell config={config} step={step} inputs={inputs} onBack={onBack} onNext={handleNext} total={total}>
            <GlassCard>
                <h2 style={{ fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: '3rem' }}>{currentStep.title}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {(currentStep.options || []).map(opt => (
                        <div key={opt.value} className={`chip ${inputs[field] === opt.value ? 'active' : ''}`}
                            onClick={() => setField(field, opt.value)}
                            style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', position: 'relative', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                            {opt.img && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${opt.img})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.08)', filter: 'saturate(1.12) contrast(1.08)', opacity: 0.75 }} />}
                            <div style={{ position: 'relative', padding: '2rem', background: opt.img ? 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' : 'none' }}>
                                {opt.icon && <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{opt.icon}</div>}
                                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{opt.label}</div>
                                {opt.desc && <div style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '0.3rem' }}>{opt.desc}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </WizardShell>
    );
};

export default ProjectWizard;
