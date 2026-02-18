import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Save, FileText, PenTool, Sparkles, Calculator } from 'lucide-react';

import { API_BASE_URL } from '../services/api';

export default function OrderSummaryScreen({ onBack, onSave, estimateData, selectedData, selectedTier, upgradeCost }) {
    const [signature, setSignature] = useState(null);
    const [agreed, setAgreed] = useState(false);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [projectName, setProjectName] = useState("Abhishek");


    const baseCost = Number(estimateData?.breakdown?.total_cost || 0);


    const effectiveUpgradeCost = upgradeCost > 0 ? upgradeCost :
        selectedTier === 'Classic' ? Math.round(baseCost * 0.18) :
            selectedTier === 'Premium' ? Math.round(baseCost * 0.32) :
                selectedTier === 'Luxury' ? Math.round(baseCost * 0.59) : 0;

    const totalCost = baseCost + effectiveUpgradeCost;


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

        ctx.strokeStyle = "#10b981"; // Emerald-500
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
        setIsDrawing(false);
        setSignature(canvasRef.current.toDataURL());
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature(null);
    };

    const handleGeneratePDF = async () => {
        try {
            const pdfData = {
                project_type: selectedData.projectType,
                plot_size: selectedData.dimensions || selectedData.plotSize,
                floors: selectedData.floors,
                plan: selectedTier,
                answers: selectedData.answers || {},
                upgrades: selectedData.upgrades || {},
                interior: selectedData.interior || null,
                additionalRequirements: selectedData.additionalRequirements || {},
                breakdown: estimateData?.breakdown || {},
                explanation: estimateData?.explanation || {},
                total_cost: baseCost,
                upgrades_cost: effectiveUpgradeCost,
                signature: signature,
                project_id: `AI-PNR-2026-${Date.now().toString().slice(-6)}`,
                generated_at: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                client_name: projectName
            };


            const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
            const newProject = {
                id: Date.now(),
                ...pdfData,
                saved_at: new Date().toISOString()
            };
            savedProjects.push(newProject);
            localStorage.setItem('savedProjects', JSON.stringify(savedProjects));

            alert(`Project for "${projectName}" saved successfully!`);

            const response = await fetch(`${API_BASE_URL}/generate-pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pdfData),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Project_Agreement_${projectName}_${Date.now()}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }

        } catch (err) {

        }
    };

    return (
        <motion.div className="min-h-screen bg-black text-white p-6 relative overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 fixed" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black fixed" />

            <div className="relative z-10 max-w-[2000px] mx-auto py-12 lg:px-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 pb-8 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                            <ArrowLeft className="w-5 h-5 text-white/70" />
                            <span className="text-white/70 font-bold text-sm">Go Back</span>
                        </button>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4">
                                <svg className="w-8 h-8" viewBox="0 0 100 100">
                                    <path d="M25 20 v60 h20 M45 80 l15-60 15 60 M50 60 h20" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Project Agreement</h1>
                            </div>
                            <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mt-1 font-black">Official Project Estimate & Specification Audit</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
                            <span className="text-blue-400 font-black text-sm uppercase tracking-widest">2026 Q1 Market Index Verified</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Doc ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                            <p className="text-[10px] text-blue-400/60 font-black uppercase tracking-[0.2em]">
                                Dated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 1. Client Specification Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <PenTool className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-[0.2em] font-sansital-black">01. Project Summary</h2>
                    </div>

                    <div className="rounded-[3.5rem] bg-zinc-900/40 border border-white/10 overflow-hidden backdrop-blur-3xl relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
                        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-px bg-white/5">
                            {[
                                { label: 'Type', value: selectedData?.projectType?.replace('-', ' ')?.toUpperCase() || 'DREAM HOUSE' },
                                { label: 'Plot', value: selectedData?.dimensions || selectedData?.plotSize || '30x40' },
                                { label: 'Floors', value: (selectedData?.answers?.floors || 'G+1')?.toUpperCase() },
                                { label: 'Plan', value: selectedData?.plan?.toUpperCase() || 'BASE' },
                                { label: 'Bedrooms', value: `${selectedData?.answers?.bedrooms || '3'} BHK` },
                                { label: 'Members', value: `${selectedData?.answers?.['family-size'] || selectedData?.answers?.['total-members'] || '4'}` },
                                { label: 'Lift', value: (selectedData?.answers?.lift || 'No')?.toUpperCase() },
                                { label: 'Interior', value: selectedData?.interior?.toUpperCase() || 'NONE' },
                                { label: 'Compound', value: selectedData?.additionalRequirements?.compoundWall ? 'YES' : 'NO' },
                                { label: 'R.W.H', value: selectedData?.additionalRequirements?.rainWater ? 'YES' : 'NO' }
                            ].map((item, idx) => (
                                <div key={idx} className="p-12 bg-zinc-900/40 hover:bg-white/5 transition-all group relative overflow-hidden flex flex-col justify-center">
                                    <div className="relative z-10">
                                        <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">{item.label}</p>
                                        <p className="text-3xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors uppercase">{item.value}</p>
                                    </div>
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                                        <Sparkles className="w-8 h-8 text-blue-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Financial Audit Overview (Moved Up) */}
                <div className="mb-12 p-8 rounded-[2.5rem] bg-zinc-900/60 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 pointer-events-none" />
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Calculator className="w-48 h-48 -mr-12 -mt-12" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-xs font-black text-white/50 uppercase tracking-[0.4em] mb-4 font-sansital-black">Investment Audit</h2>
                            <p className="text-6xl lg:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">₹{totalCost.toLocaleString('en-IN')}</p>
                            <p className="text-white/60 text-xs mt-4 font-bold uppercase tracking-[0.2em] leading-none">Total Comprehensive Project Value Audit</p>
                        </div>
                        <div className="flex gap-10">
                            <div className="px-20 py-12 rounded-[3rem] bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all min-w-[450px]">
                                <p className="text-sm font-black text-white/50 uppercase tracking-[0.3em] mb-4 font-sansital-black">Base Construction</p>
                                <p className="text-4xl lg:text-5xl font-black text-white tracking-tight">₹{baseCost.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="px-20 py-12 rounded-[3rem] bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all min-w-[450px]">
                                <p className="text-sm font-black text-white/50 uppercase tracking-[0.3em] mb-4 font-sansital-black">{selectedTier} Upgrade</p>
                                <p className="text-4xl lg:text-5xl font-black text-white tracking-tight">+ ₹{effectiveUpgradeCost.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Pin-to-Pin Base Construction Breakdown */}
                <div className="mb-12 pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                <FileText className="w-5 h-5 text-white/50" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-white uppercase tracking-[0.2em] font-sansital-black">02. Pin-to-Pin: Base Construction</h2>
                                <p className="text-xs text-white/30 font-bold uppercase tracking-widest mt-2">Full itemized structural breakdown per market index</p>
                            </div>
                        </div>
                        <div className="hidden md:block px-10 py-5 rounded-2xl bg-white/10 border-2 border-white/20 shadow-lg shadow-blue-500/10">
                            <span className="text-sm lg:text-base text-blue-400 font-black uppercase tracking-[0.4em]">FEB.17.2026</span>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] bg-zinc-900/60 border border-white/10 overflow-hidden backdrop-blur-xl relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50 pointer-events-none" />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-20 gap-y-12 p-16 relative z-10">
                            {estimateData?.breakdown?.pin_to_pin_details ? (
                                estimateData.breakdown.pin_to_pin_details.map((item, idx) => (
                                    <div key={idx} className="flex flex-col py-8 border-b border-white/5 group hover:bg-white/5 px-6 transition-all rounded-3xl">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-4">
                                                <span className="text-white/10 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span>
                                                <span className="text-blue-400 font-black uppercase text-xs tracking-[0.3em]">{item.category}</span>
                                            </div>
                                            <span className="font-mono text-white font-black text-xl">₹{Number(item.amount).toLocaleString('en-IN')}</span>
                                        </div>
                                        <p className="text-base font-black text-white uppercase tracking-wider">{item.item}</p>
                                    </div>
                                ))
                            ) : (

                                <>
                                    {[
                                        { cat: 'STRUCTURE', label: 'Excavation & Earthwork (Site Prep)', price: (baseCost * 0.032).toFixed(0) },
                                        { cat: 'STRUCTURE', label: 'Foundation RCC & Pedestals (incl. Sump)', price: (baseCost * 0.111).toFixed(0) },
                                        { cat: 'STRUCTURE', label: 'Plinth Beam & Ground PCC Work', price: (baseCost * 0.065).toFixed(0) },
                                        { cat: 'STRUCTURE', label: 'Superstructure RCC (Columns/Beams/Slab)', price: (baseCost * 0.167).toFixed(0) },
                                        { cat: 'STRUCTURE', label: 'External Brickwork (9-inch Walls)', price: (baseCost * 0.116).toFixed(0) },
                                        { cat: 'STRUCTURE', label: 'Internal Partition Walls & Loft Work', price: (baseCost * 0.083).toFixed(0) },
                                        { cat: 'STRUCTURE', label: 'Plastering (Internal & External finish)', price: (baseCost * 0.039).toFixed(0) },
                                        { cat: 'STRUCTURE', label: 'Terrace Waterproofing & Parapet Walls', price: (baseCost * 0.032).toFixed(0) },
                                        { cat: 'FINISH', label: 'Ceramic Tiles & Granite Stairs Flooring', price: (baseCost * 0.130).toFixed(0) },
                                        { cat: 'FINISH', label: 'Wall Tiling (Kitchen & Bathroom areas)', price: (baseCost * 0.016).toFixed(0) },
                                        { cat: 'FINISH', label: 'Plumbing, Sanitary & Tank System', price: (baseCost * 0.081).toFixed(0) },
                                        { cat: 'FINISH', label: 'Electrical (Wiring + Modular Switches)', price: (baseCost * 0.032).toFixed(0) },
                                        { cat: 'FINISH', label: 'Painting (Putty + Weather-shield)', price: (baseCost * 0.022).toFixed(0) },
                                        { cat: 'FINISH', label: 'Doors & Windows (Teak + UPVC)', price: (baseCost * 0.042).toFixed(0) },
                                        { cat: 'FIXED', label: 'Standard Septic Tank System', price: '50000' },
                                        { cat: 'ADJUST', label: 'Market Price Adjustment (Inflation)', price: (baseCost * 0.018).toFixed(0) },
                                        { cat: 'FINISH', label: 'Basic Locks & Hardware', price: '10000' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex flex-col py-8 border-b border-white/5 group hover:bg-white/5 px-6 transition-all rounded-3xl">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-white/10 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span>
                                                    <span className="text-blue-400 font-black uppercase text-xs tracking-[0.3em]">{item.cat}</span>
                                                </div>
                                                <span className="font-mono text-white font-black text-xl">₹{Number(item.price).toLocaleString('en-IN')}</span>
                                            </div>
                                            <p className="text-base font-black text-white uppercase tracking-wider">{item.label}</p>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Project Deliverables (9 Items) */}
                <div className="mb-12 pt-12 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Sparkles className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-[0.2em] font-sansital-black">03. Project Deliverables</h2>
                    </div>

                    <div className="rounded-[2.5rem] bg-zinc-900/60 border border-white/10 overflow-hidden backdrop-blur-xl relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50 pointer-events-none" />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-20 gap-y-12 p-16 relative z-10">
                            {[
                                { cat: 'Flooring', title: 'Premium Granite Flooring', desc: 'Exotic natural granite with premium mirror polish for stairs and living areas.' },
                                { cat: 'Designer', title: 'Custom Finishes', desc: 'Designer wall putty and premium emulsion paint with custom textures.' },
                                { cat: 'Joinery', title: 'Teak Wood Main Frame', desc: "Seasoned teak wood frame (5'x3') for enhanced entrance aesthetics." },
                                { cat: 'Electrical', title: 'Modular Upgrades', desc: 'Legrand/Schneider modular switches with FRLS concealed wiring.' },
                                { cat: 'Features', title: 'Premium Sanitaryware', desc: 'Jaquar/Cera contemporary collection for all bathrooms.' },
                                { cat: 'Kitchen', title: 'Granite Platform', desc: 'Black galaxy granite counter with stainless steel sink.' },
                                { cat: 'Windows', title: 'UPVC Windows', desc: 'High-quality UPVC windows with mosquito mesh & safety grills.' },
                                { cat: 'Plumbing', title: 'CPVC/UPVC Piping', desc: 'Astral/Ashirvad concealed piping for long-lasting durability.' },
                                { cat: 'Painting', title: 'Premium Emulsion', desc: 'High-sheen washable emulsion for all internal walls.' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col py-8 border-b border-white/5 group hover:bg-white/5 px-6 transition-all rounded-3xl">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-4">
                                            <span className="text-white/10 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span>
                                            <span className="text-blue-400 font-black uppercase text-xs tracking-[0.3em]">{item.cat}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20">
                                            <CheckCircle className="w-4 h-4 text-blue-400" />
                                        </div>
                                    </div>
                                    <h4 className="text-base font-black text-white uppercase tracking-wider mb-2">{item.title}</h4>
                                    <p className="text-xs text-white/30 font-bold leading-relaxed uppercase tracking-tight">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5. Signature & Terms Section */}
                <div className="grid grid-cols-1 md:grid-cols-[4.5fr_5.5fr] gap-12 items-stretch mb-20 border-t border-white/5 pt-12">
                    {/* Digital Signature */}
                    <div className="p-10 rounded-[3.5rem] bg-zinc-900/80 border border-white/10 backdrop-blur-xl flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <PenTool className="w-6 h-6 text-green-400" />
                                    <h3 className="font-black text-white uppercase tracking-[0.2em] text-base font-sansital-black">Digital Authorization</h3>
                                </div>
                                <div className="mt-4 flex flex-col gap-2">
                                    <label className="text-xs text-white/50 uppercase tracking-widest font-bold">Client Name for Project</label>
                                    <input
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg font-black focus:outline-none focus:border-green-500/50 transition-all font-sansital-black"
                                        placeholder="Enter client name..."
                                    />
                                </div>
                            </div>
                            <button onClick={clearSignature} className="text-xs font-black text-red-400 hover:text-red-300 uppercase tracking-widest underline decoration-dotted font-sansital-black">Reset Signature</button>
                        </div>
                        <div className="bg-white rounded-[3rem] overflow-hidden cursor-crosshair touch-none h-[360px] relative border-[12px] border-white/10 shadow-2xl">
                            <canvas
                                ref={canvasRef}
                                width={1600}
                                height={800}
                                className="w-full h-full"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                            />
                            {!signature && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <p className="text-black/5 font-black uppercase tracking-[0.6em] text-xl font-sansital-black">Client Authorized Signature</p>
                                </div>
                            )}
                        </div>
                        <p className="text-center text-xs text-white/20 mt-8 font-black uppercase tracking-[0.4em]">Encrypted Digital Validation Stamp: 2026.SECURE.AUDIT</p>
                    </div>

                    {/* Terms & Market Analysis */}
                    <div className="p-10 rounded-[3.5rem] bg-zinc-900/40 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
                        <div>
                            <h3 className="font-black text-white uppercase tracking-[0.2em] text-xl mb-10 font-sansital-black">Terms and Analysis</h3>
                            <ul className="text-lg text-white/60 space-y-8 mb-12">
                                <li className="flex items-start gap-6">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 shadow-lg shadow-blue-500/40" />
                                    <span className="font-bold">Estimate valid for 30 calender days from today's audit date.</span>
                                </li>
                                <li className="flex items-start gap-6">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 shadow-lg shadow-blue-500/40" />
                                    <span className="font-bold">Material specifications locked to <strong className="text-white">{selectedTier} index</strong> at verified 2026 rates.</span>
                                </li>
                                <li className="flex items-start gap-6">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 shadow-lg shadow-blue-500/40" />
                                    <span className="font-bold">Structural stability & material standards guaranteed as per local zoning laws.</span>
                                </li>
                            </ul>

                            {/* Market Analysis AI Insight (Mini) */}
                            <div className="p-10 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/20 mb-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Sparkles className="w-12 h-12 text-blue-400" />
                                </div>
                                <p className="text-base text-white/80 leading-relaxed font-bold">
                                    <span className="text-blue-400 font-black uppercase tracking-[0.2em] mr-3 font-sansital-black text-sm">AI Market Analysis:</span>
                                    As per <strong className="text-blue-400">2026 market rates</strong>, the total investment of <strong className="text-white">₹{totalCost.toLocaleString('en-IN')}</strong> is the best fit for your project estimation based on current Q1 2026 market demand.
                                </p>
                            </div>
                        </div>

                        <label className="flex items-center gap-6 cursor-pointer group p-6 rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                            <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${agreed ? 'bg-green-500 border-green-500 shadow-xl shadow-green-500/20' : 'border-white/30 group-hover:border-white/50'}`}>
                                {agreed && <CheckCircle className="w-5 h-5 text-black" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={agreed} onChange={() => setAgreed(!agreed)} />
                            <span className="text-xs text-white font-black select-none uppercase tracking-[0.2em] font-sansital-black">Confirm Structural Authorization</span>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center mt-12 mb-20 pb-20">
                    <button
                        disabled={!signature || !agreed}
                        onClick={handleGeneratePDF}
                        className={`px-16 py-6 rounded-[2rem] font-black text-xl uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-2xl ${(!signature || !agreed) ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5' : 'bg-green-400 text-black hover:bg-green-300 hover:scale-105 active:scale-95 shadow-green-400/20'}`}
                    >
                        <Save className="w-7 h-7" />
                        Finalize & Save Audit
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
