import { motion, animate } from 'framer-motion';
import { ArrowLeft, Calculator, Home, Sparkles, Loader2, PenTool, CheckCircle, TrendingUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../services/api';


function AnimatedCounter({ value, delay = 0, prefix = '₹' }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const controls = animate(0, value, {
                duration: 1.2,
                ease: [0.25, 0.1, 0.25, 1],
                onUpdate: (v) => setDisplayValue(Math.floor(v))
            });
            return controls.stop;
        }, delay / 2);
        return () => clearTimeout(timeout);
    }, [value, delay]);

    return <span>{prefix}{displayValue.toLocaleString('en-IN')}</span>;
}

export default function EstimateScreen({ onBack, selectedData, onUpgradeSelect, onViewBreakdown, onSave, onHome, isReadOnly = false }) {
    const [estimateData, setEstimateData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wantsUpgrade, setWantsUpgrade] = useState(null);

    const [analyzing, setAnalyzing] = useState(true);
    const [agreed, setAgreed] = useState(false);
    const [signature, setSignature] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [projectName, setProjectName] = useState(selectedData?.client_name || "Abhishek");
    const [isSaved, setIsSaved] = useState(false);
    const [saveToast, setSaveToast] = useState({ show: false, message: "" });
    const canvasRef = useRef(null);

    const startDrawing = (e) => {
        if (e.cancelable) e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        if (e.cancelable) e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) setSignature(true);
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature(false);
    };

    useEffect(() => {
        const fetchEstimate = async () => {
            try {
                setLoading(true);
                const normalizeFloors = (f) => {
                    if (!f) return 1;
                    if (typeof f === 'number') return f;
                    const match = f.toLowerCase().match(/g\+(\d+)/);
                    if (match) return parseInt(match[1]) + 1;
                    return parseInt(f) || 1;
                };

                const payload = {
                    project_type: selectedData.projectType,
                    plot_size: selectedData.dimensions || selectedData.plotSize,
                    floors: normalizeFloors(selectedData.floors),
                    zone: selectedData.zone || "Zone 1",
                    selected_tier: selectedData.plan || "Classic",
                    site_type: selectedData.plotSize?.includes('double') ? 'double' : (selectedData.plotSize?.includes('half') ? 'half' : 'full'),
                    family_details: selectedData.answers || {},
                    lift_required: selectedData.answers?.lift === "Yes",
                    generate_pdf: false,
                    upgrades: selectedData.upgrades || {},
                    interior: selectedData.interior || null,
                    dimensions: selectedData.dimensions || "",
                    compound_wall: selectedData.additionalRequirements?.compoundWall || false,
                    rain_water_harvesting: selectedData.additionalRequirements?.rainWater || false
                };

                const response = await fetch(`${API_BASE_URL}/estimate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    if (response.status === 422) {
                        const detail = errorData.detail || [];
                        const errorMessage = Array.isArray(detail)
                            ? detail.map(d => `${d.loc.join('.')} - ${d.msg}`).join(', ')
                            : (detail || `Server error: ${response.status}`);
                        throw new Error(`Validation Error: ${errorMessage}`);
                    }
                    throw new Error(`Server error: ${response.status}`);
                }
                const data = await response.json();
                setEstimateData(data);
                setLoading(false);

                setTimeout(() => {
                    setAnalyzing(false);

                    if (isReadOnly) {
                        setWantsUpgrade(false);
                        setAgreed(true);
                        setSignature(true);
                        setProjectName(selectedData.client_name || "Abhishek");
                    }
                }, 100);
            } catch (err) {
                console.error("Estimate Error:", err);
                setError(`Estimation Error: ${err.message}`);
                setLoading(false);
                setAnalyzing(false);
            }
        };
        if (selectedData) fetchEstimate();
    }, [selectedData, isReadOnly]);

    useEffect(() => {
        if (!analyzing && isReadOnly && selectedData?.signature && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = selectedData.signature;
        }
    }, [analyzing, isReadOnly, selectedData?.signature]);

    const handleSaveProject = async () => {
        try {
            const canvas = canvasRef.current;
            const signatureImage = signature ? canvas.toDataURL('image/png') : null;

            const pdfData = {
                project_type: selectedData.projectType,
                plot_size: selectedData.dimensions || selectedData.plotSize,
                floors: selectedData.floors,
                plan: selectedData.plan || 'Classic',
                answers: selectedData.answers || {},
                upgrades: selectedData.upgrades || {},
                active_upgrade_features: estimateData?.breakdown?.active_upgrade_features || [],
                interior: selectedData.interior || null,
                additionalRequirements: selectedData.additionalRequirements || {},
                breakdown: estimateData?.breakdown || {},
                explanation: estimateData?.explanation || {},
                total_cost: isReadOnly ? (selectedData.total_cost || estimateData?.breakdown?.total_cost) : (estimateData?.breakdown?.total_cost || 0),
                upgrades_cost: isReadOnly ? (selectedData.upgrades_cost || estimateData?.breakdown?.upgrades_cost || 0) : (estimateData?.breakdown?.upgrades_cost || 0),
                signature: signatureImage || (isReadOnly ? selectedData.signature : null),
                project_id: isReadOnly ? (selectedData.project_id || `AI-PNR-2026-${Date.now().toString().slice(-6)}`) : `AI-PNR-2026-${Date.now().toString().slice(-6)}`,
                city: selectedData.city || 'N/A',
                state: selectedData.state || 'N/A',
                generated_at: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                client_name: projectName
            };

            if (!isReadOnly && !isSaved) {
                const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
                const newProject = {
                    id: Date.now(),
                    ...pdfData,
                    source: 'COST_ESTIMATION',
                    saved_at: new Date().toISOString()
                };
                savedProjects.push(newProject);
                localStorage.setItem('savedProjects', JSON.stringify(savedProjects));
                setIsSaved(true);

                if (onSave) onSave(newProject);

                setSaveToast({
                    show: true,
                    message: `Project for "${projectName}" has been saved. Redirecting you to home page in 5 seconds...`
                });

                setTimeout(() => {
                    setSaveToast({ show: false, message: "" });
                    if (onHome) onHome();
                }, 5000);
            }
        } catch (err) {
            console.error("Save Error:", err);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="text-center z-10">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-8"
                />
                <h2 className="text-3xl font-black text-white mb-3">Calculating Your Dream Home</h2>
                <p className="text-white/50 text-lg">Processing construction costs...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-10">
            <div className="text-center p-12 bg-red-900/10 border-2 border-red-500/30 rounded-[3rem] backdrop-blur-xl max-w-lg">
                <h2 className="text-3xl font-black mb-4">Calculation Failed</h2>
                <p className="text-white/60 mb-8 text-lg">{error}</p>
                <button onClick={onBack} className="px-10 py-4 bg-white/10 border-2 border-white/20 rounded-2xl hover:bg-white/20 transition-all font-bold text-lg">
                    Go Back
                </button>
            </div>
        </div>
    );

    const baseCost = Number(estimateData?.breakdown?.total_cost || 0);
    const upgradeSuggestions = estimateData?.upgrade_suggestions || [];
    const pinToPinDetails = estimateData?.breakdown?.pin_to_pin_details || [];

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2400&auto=format&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.6,
                    filter: 'grayscale(100%)'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/20 to-black/40 z-0" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 max-w-[1600px] mx-auto px-6 py-8 space-y-8"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <motion.button
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={onBack}
                        className="flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-white/20 hover:border-blue-400/50 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-2xl"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-bold">Go Back</span>
                    </motion.button>

                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="flex items-center gap-4 mb-1">
                            <div className="w-10 h-10 flex items-center justify-center bg-black rounded-lg border border-white/20 shadow-lg overflow-hidden shrink-0">
                                <span className="text-white font-black text-lg tracking-tighter" style={{ fontFamily: "'Montserrat', sans-serif" }}>LA</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white">Cost Intelligence</h1>
                        </div>
                    </motion.div>

                    <div className="w-24 hidden md:block" />
                </div>

                {/* Compact Input Summary at Top */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Home className="w-6 h-6 text-blue-400" />
                        <h3 className="text-xl font-black">Project Summary</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Type</p>
                            <p className="text-base font-bold capitalize truncate">{selectedData?.projectType?.replace('-', ' ')}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Plot</p>
                            <p className="text-base font-bold">{selectedData?.dimensions || selectedData?.plotSize}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Floors</p>
                            <p className="text-base font-bold uppercase">{selectedData?.floors}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Plan</p>
                            <p className="text-base font-bold capitalize">{selectedData?.plan || 'Classic'}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Location</p>
                            <p className="text-base font-bold truncate">{selectedData?.city && selectedData?.state ? `${selectedData.city}, ${selectedData.state}` : 'N/A'}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Lift</p>
                            <p className="text-base font-bold">
                                {selectedData?.answers?.lift || 'No'}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Analyzing Animation */}
                {analyzing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="p-12 rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-white/20 backdrop-blur-3xl text-center"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 mx-auto mb-6"
                        >
                            <Loader2 className="w-16 h-16 text-blue-400" />
                        </motion.div>
                        <h3 className="text-3xl font-black mb-3 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">ANALYZING...</h3>
                        <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-black">Optimizing Project Specifications</p>
                    </motion.div>
                )}

                {/* Main Content */}
                {!analyzing && (
                    <div className="space-y-8">
                        {/* Total Cost */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
                            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-blue-500/[0.05] via-purple-500/[0.05] to-pink-500/[0.05] border-2 border-white/10 backdrop-blur-3xl text-center">
                                <p className="text-white/50 text-sm mb-3 uppercase tracking-widest font-bold">
                                    {isReadOnly ? "Saved Total Investment" : "Total Investment"}
                                </p>
                                <h2 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
                                    <AnimatedCounter value={isReadOnly ? (selectedData.total_cost || baseCost) : baseCost} delay={400} />
                                </h2>
                                <p className="text-white/40 text-sm">
                                    {isReadOnly ? `Finalized Audit for ${selectedData.client_name || projectName}` : "Complete construction estimate"}
                                </p>
                            </div>
                        </motion.div>

                        {/* Cost Breakdown */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Calculator className="w-5 h-5 text-purple-400" />
                                    <h3 className="text-xl font-black">Detailed Breakdown</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {pinToPinDetails.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + i * 0.05 }}
                                        className="p-4 rounded-xl bg-white/[0.02] border border-white/10"
                                    >
                                        <p className="text-sm text-white/30 uppercase font-bold tracking-wider mb-2">{item.category}</p>
                                        <p className="text-base font-bold text-white/70 mb-3 leading-tight min-h-[32px]">{item.item}</p>
                                        <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                            <AnimatedCounter value={item.amount} delay={500 + i * 100} />
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Lower Sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Side: Market Analysis & Digital Auth */}
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <TrendingUp className="w-6 h-6 text-blue-400" />
                                        <h3 className="text-2xl font-black">Market Analysis</h3>
                                    </div>
                                    <div className="p-8 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                                        <p className="text-white/80 text-xl leading-relaxed font-bold">
                                            As per <span className="text-blue-400 font-black">2026 market rates</span>, <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"><AnimatedCounter value={baseCost} delay={1000} /></span> is the professional estimation for your site location in {selectedData?.city || 'India'}.
                                        </p>
                                    </div>
                                </motion.div>

                                {(wantsUpgrade === false || isReadOnly) && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl space-y-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <PenTool className="w-6 h-6 text-green-400" />
                                                <h3 className="font-black uppercase tracking-widest text-lg">Digital Authorization</h3>
                                            </div>
                                            {!isReadOnly && <button onClick={clearSignature} className="text-xs font-black text-red-400 uppercase tracking-widest underline">Reset</button>}
                                        </div>

                                        {!isReadOnly && (
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest font-bold">Client Name</label>
                                                <input
                                                    type="text"
                                                    value={projectName}
                                                    onChange={(e) => setProjectName(e.target.value)}
                                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold"
                                                    placeholder="Enter name..."
                                                />
                                            </div>
                                        )}

                                        <div className="bg-white rounded-2xl h-[200px] relative overflow-hidden border-4 border-white/10">
                                            <canvas
                                                ref={canvasRef}
                                                width={1000}
                                                height={500}
                                                className="w-full h-full"
                                                onMouseDown={!isReadOnly ? startDrawing : undefined}
                                                onMouseMove={!isReadOnly ? draw : undefined}
                                                onMouseUp={!isReadOnly ? stopDrawing : undefined}
                                                onMouseLeave={!isReadOnly ? stopDrawing : undefined}
                                                onTouchStart={!isReadOnly ? startDrawing : undefined}
                                                onTouchMove={!isReadOnly ? draw : undefined}
                                                onTouchEnd={!isReadOnly ? stopDrawing : undefined}
                                            />
                                            {(!signature && !selectedData?.signature) && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                                    <p className="text-black font-black uppercase tracking-[0.4em]">Sign Here</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer" onClick={() => !isReadOnly && setAgreed(!agreed)}>
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${agreed ? 'bg-blue-500 border-blue-500' : 'border-white/20'}`}>
                                                {agreed && <CheckCircle className="w-4 h-4" />}
                                            </div>
                                            <span className="text-xs font-bold text-white/70 uppercase">I authorize these specifications.</span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Right Side: Smart Upgrades */}
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <Sparkles className="w-6 h-6 text-cyan-400" />
                                        <h3 className="text-2xl font-black">{isReadOnly ? 'Applied Features' : 'Smart Upgrades'}</h3>
                                    </div>

                                    {isReadOnly ? (
                                        <div className="space-y-3">
                                            {(selectedData?.active_upgrade_features || []).map((feat, idx) => (
                                                <div key={idx} className="p-4 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{feat.category}</span>
                                                        <p className="text-base font-bold text-white">{feat.item}</p>
                                                    </div>
                                                    <CheckCircle className="w-5 h-5 text-cyan-400" />
                                                </div>
                                            ))}
                                            {!(selectedData?.active_upgrade_features?.length) && (
                                                <p className="text-white/30 text-center py-4 uppercase font-black text-xs">Base Project Only</p>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-white/60 mb-6">Enhance your property with our AI-curated upgrades.</p>
                                            <div className="flex gap-4 mb-8">
                                                <button onClick={() => setWantsUpgrade(true)} className={`flex-1 py-4 rounded-xl font-black border transition-all ${wantsUpgrade === true ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-white/10'}`}>YES</button>
                                                <button onClick={() => setWantsUpgrade(false)} className={`flex-1 py-4 rounded-xl font-black border transition-all ${wantsUpgrade === false ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-white/10'}`}>NO</button>
                                            </div>

                                            {wantsUpgrade === true && (
                                                <div className="space-y-3">
                                                    {upgradeSuggestions.map((upgrade, i) => (
                                                        <div
                                                            key={i}
                                                            className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-400/50 cursor-pointer transition-all"
                                                            onClick={() => onUpgradeSelect(estimateData, upgrade.tier)}
                                                        >
                                                            <div className="flex justify-between items-center mb-1">
                                                                <h4 className="font-black text-white">{upgrade.tier}</h4>
                                                                <span className="text-cyan-400 font-bold">+₹{upgrade.upgrade_cost.toLocaleString('en-IN')}</span>
                                                            </div>
                                                            <p className="text-xs text-white/40">{upgrade.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </motion.div>

                                {/* Final Action - Only if NO upgrade or isReadOnly view is finished */}
                                {!isReadOnly && wantsUpgrade === false && (
                                    <motion.button
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        whileHover={{ scale: 1.02 }}
                                        disabled={!signature || !agreed || isSaved}
                                        onClick={handleSaveProject}
                                        className={`w-full py-8 rounded-3xl font-black text-2xl uppercase tracking-widest transition-all ${(!signature || !agreed || isSaved) ? 'bg-white/5 text-white/10 grayscale' : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400'}`}
                                    >
                                        {isSaved ? 'PROJECT SAVED' : 'FINALIZE & SAVE'}
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Save Toast */}
            {saveToast.show && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl bg-zinc-900 border-2 border-green-500 shadow-2xl flex items-center gap-4">
                    <CheckCircle className="text-green-500" />
                    <p className="text-white font-bold">{saveToast.message}</p>
                </div>
            )}
        </div>
    );
}
