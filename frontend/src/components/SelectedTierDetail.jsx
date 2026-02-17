import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Sparkles, Calculator, Award, Loader2 } from 'lucide-react';

export default function SelectedTierDetail({ onBack, tier, estimateData, selectedData, onProceed }) {
    const [processing, setProcessing] = useState(false);


    const baseTotal = Number(estimateData?.breakdown?.total_cost || 0);
    const suggestion = estimateData?.upgrade_suggestions?.find(s => s.tier === tier);


    const upgradeCost = suggestion?.upgrade_cost || 0;
    const finalTotal = baseTotal + upgradeCost;

    const handleFinalize = () => {
        setProcessing(true);
        setTimeout(() => {
            onProceed?.(estimateData);
            setProcessing(false);
        }, 3500); // 3.5 second delay
    };

    const tierFeatures = {
        "Classic": [
            { category: "Flooring", item: "Premium Granite Flooring", detail: "Exotic natural granite with premium mirror polish for stairs and living areas." },
            { category: "Designer", item: "Custom Finishes", detail: "Designer wall putty and premium emulsion paint with custom textures." },
            { category: "Joinery", item: "Teak Wood Main Frame", detail: "Seasoned teak wood frame (5'x3') for enhanced entrance aesthetics." },
            { category: "Electrical", item: "Modular Upgrades", detail: "Legrand/Schneider modular switches with FRLS concealed wiring." },
            { category: "Features", item: "Premium Sanitaryware", detail: "Jaquar/Cera contemporary collection for all bathrooms." },
            { category: "Kitchen", item: "Granite Platform", detail: "Black galaxy granite counter with stainless steel sink." },
            { category: "Windows", item: "UPVC Windows", detail: "High-quality UPVC windows with mosquito mesh & safety grills." },
            { category: "Plumbing", item: "CPVC/UPVC Piping", detail: "Astral/Ashirvad concealed piping for long-lasting durability." },
            { category: "Painting", item: "Premium Emulsion", detail: "High-sheen washable emulsion for all internal walls." }
        ],
        "Premium": [
            { category: "Flooring", item: "Italian Marble & Granite Stairs", detail: "High-grade Italian marble for living/dining areas and premium galaxy granite for staircase with molded edges." },
            { category: "Automation", item: "Smart Security System", detail: "Video door phone with 7-inch display and smart digital locks from Godrej/Yale." },
            { category: "Joinery", item: "Full Teak Wood Main Door", detail: "Hand-carved solid Teak wood main door with antique brass hardware and PU polish." },
            { category: "Walls", item: "Royale Texture Finishes", detail: "Asian Paints Royale Play designer textures for highlight walls in Living & Master Bedroom." },
            { category: "Sanitary", item: "Kohler Premium Series", detail: "Single-lever divertors, wall-hung closets with soft-close seat covers, and rain showers." },
            { category: "Kitchen", item: "Acrylic Modular Framework", detail: "Water-proof BWP ply carcass with high-gloss acrylic shutters and Hettich hardware." },
            { category: "Electrical", item: "Schneider Livia/Zencelo", detail: "Slim-line modular switches with fire-retardant wiring and MCB distribution boards." },
            { category: "Windows", item: "Premium UPVC Profiles", detail: "Lead-free UPVC windows with toughened glass and multi-point locking mechanisms." },
            { category: "Plumbing", item: "FlowGuard CPVC", detail: "Ashirvad/Astral FlowGuard plus piping ensuring 50+ years of leak-proof performance." },
            { category: "Ceiling", item: "Gypsum False Ceiling", detail: "Saint-Gobain Gypsum false ceiling with cove lighting provisions in Living & Dining." },
            { category: "Railing", item: "SS 304 Glass Railing", detail: "Stainless Steel 304 grade railing with 10mm toughened glass for balconies and stairs." },
            { category: "Bathroom", item: "Glass Shower Partitions", detail: "Toughened glass partitions in Master Toilet for wet and dry area separation." },
            { category: "Exterior", item: "Texture Paint & Cladding", detail: "Weather-proof texture paint combination with natural stone cladding highlights." }
        ],
        "Luxury": [
            { category: "Flooring", item: "Italian Statuario Marble", detail: "Premium imported Statuario or Dyna marble with 7-layer diamond polish for seamless luxury." },
            { category: "Automation", item: "Full Home Ecosystem", detail: "Voice-controlled automation for lighting, curtains, ACs, and media via iPad/Phone control." },
            { category: "Walls", item: "PU Finish & Paneling", detail: "High-gloss PU finish for internal walls, charcoal louvers, and veneer paneling in lobbies." },
            { category: "Kitchen", item: "German Gourmet Suite", detail: "Fully integrated modular kitchen with Bosch built-in appliances and Hafele fittings." },
            { category: "Sanitary", item: "Automated Wellness", detail: "Toto/Duravit automated heat-seated toilets, thermostatic showers, and jacuzzi provisions." },
            { category: "Joinery", item: "8ft Grand Teak Entrance", detail: "8-foot tall majestic teak entrance door with biometric access and designer side panels." },
            { category: "Windows", item: "Schuco Aluminium Systems", detail: "Slim-profile thermal break aluminium windows with double-glazed noise insulation." },
            { category: "HVAC", item: "VRV/VRF AC Provisioning", detail: "Centralized copper piping and ducting provision for VRV air conditioning systems." },
            { category: "Electrical", item: "Touch Automation Switches", detail: "Glass panel touch switches with scene control and dimming capabilities." },
            { category: "Plumbing", item: "Grohe Thermostatic", detail: "Pressure pump compatible Grohe/Hansgrohe thermostatic mixers and high-flow showers." },
            { category: "Ceiling", item: "Designer Veneer Ceiling", detail: "Intricate POP designs combined with wooden veneer rafters and profile LED lighting." },
            { category: "Lighting", item: "Magnetic Track Lights", detail: "Architectural magnetic track lighting systems and COB spot lights throughout." },
            { category: "Security", item: "Biometric & Perimeter", detail: "Face-recognition entry, AI Human detection CCTV, and laser perimeter fencing." },
            { category: "Landscape", item: "Vertical Gardens & Deck", detail: "Automated irrigation system for vertical gardens and WPC deck flooring for terraces." },
            { category: "Fabrication", item: "CNC Laser Cut Gates", detail: "Automated heavy-duty main gates with designer CNC laser cut patterns and multiple motors." },
            { category: "Exterior", item: "HPL & Stone Facade", detail: "High-Pressure Laminate (HPL) sheets combined with dry-clad natural stone facade." },
            { category: "Water", item: "Pressure & Softener", detail: "Centralized pressure pump system and water softener plant for the entire home." }
        ]
    };

    const currentFeatures = tierFeatures[tier] || [];

    return (
        <motion.div className="min-h-screen bg-black text-white p-6 relative overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 fixed" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-black to-blue-800/20 fixed" />

            <div className="relative z-10 max-w-[95%] mx-auto py-8 lg:px-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                    <button onClick={onBack} className="flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all text-white/70 backdrop-blur-md">
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-black text-white font-serif tracking-tight">
                            {tier} Level <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Upgrade</span>
                        </h1>
                        <p className="text-white/40 tracking-[0.4em] uppercase text-[10px] font-bold mt-2 font-sansital-black">Architectural Enhancement & Cost Audit</p>
                    </div>
                    <div className="w-32 hidden md:block" />
                </div>

                {/* Financial Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl group hover:border-blue-500/30 transition-all">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Standard Cost</p>
                        <p className="text-4xl font-bold">₹{baseTotal.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-10 rounded-[2.5rem] bg-blue-500/10 border border-blue-500/20 backdrop-blur-3xl group hover:border-blue-400 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-20 h-20 text-blue-400" />
                        </div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Upgrade Difference</p>
                        <p className="text-4xl font-bold text-blue-300">+ ₹{upgradeCost.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-cyan-600 shadow-2xl shadow-blue-500/20">
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Total Optimized Project Value</p>
                        <p className="text-6xl font-black tracking-tight">₹{finalTotal.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                {/* Content Sections - Unified Layout for ALL Tiers */}
                <div className="flex flex-col gap-10">
                    {/* 1. Project Deliverables (Responsive Grid) */}
                    <div className="p-8 rounded-[3rem] bg-zinc-900/40 border border-white/10">
                        <div className="flex items-center gap-4 mb-8">
                            <Award className="w-8 h-8 text-cyan-400" />
                            <h3 className="text-2xl font-black tracking-tighter uppercase">Project Deliverables ({currentFeatures.length} Items)</h3>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-3 ${currentFeatures.length > 9 ? 'lg:grid-cols-4' : ''} gap-6`}>
                            {currentFeatures.map((feat, i) => (
                                <div key={i} className="flex flex-col gap-3 p-6 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-3xl -mr-4 -mt-4 transition-transform group-hover:scale-150" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{feat.category}</p>
                                        <CheckCircle className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-lg font-bold text-white mb-2 leading-tight">{feat.item}</h4>
                                        <p className="text-white/50 text-xs leading-relaxed font-medium">{feat.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Explainable AI Strategic Justification (Full Width Below) */}
                    <div className="p-10 rounded-[3rem] bg-gradient-to-r from-zinc-900/80 to-zinc-900/40 border border-white/10 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <Sparkles className="w-8 h-8 text-blue-400" />
                            <h3 className="text-2xl font-black tracking-tighter uppercase">AI Strategic Analysis: Why {tier}?</h3>
                        </div>
                        <div className="space-y-6 text-white/90 leading-relaxed text-xl font-light tracking-wide relative z-10">
                            {tier === "Classic" && (
                                <>
                                    <p>Choosing the <span className="text-blue-400 font-bold">Classic Tier</span> is the smartest entry-point for durability. Unlike basic construction, this tier replaces standard ceramics with <span className="text-white font-bold">Premium Granite</span> and ensures all concealed fittings (electrical & plumbing) are from top-tier brands like Astral and Legrand.</p>
                                    <p className="mt-4 text-white/50 text-base">
                                        <strong className="text-blue-300">Analysis:</strong> You are securing the "bones" of your house. By investing in better core materials now (Piping, Wiring, Windows), you avoid 15+ years of maintenance headaches. A Dream House is built with no compromise—start with a solid foundation.
                                    </p>
                                </>
                            )}
                            {tier === "Premium" && (
                                <>
                                    <p>The <span className="text-blue-400 font-bold">Premium Tier</span> elevates your home from "built" to "crafted". This upgrade unlocks the luxury of <span className="text-white font-bold">Italian Marble flooring</span> and comprehensive smart home security. It bridges the gap between functionality and high-end aesthetics.</p>
                                    <p className="mt-4 text-white/50 text-base">
                                        <strong className="text-blue-300">Analysis:</strong> This is the "Sweet Spot" for value. You get the visual impact of a luxury home (Teak Doors, False Ceilings, Granite Stairs) at a mid-range price point. Build with no compromise—this tier ensures your home feels premium for decades.
                                    </p>
                                </>
                            )}
                            {tier === "Luxury" && (
                                <>
                                    <p>The <span className="text-blue-400 font-bold">Luxury Tier</span> is for those who refuse to settle. It transforms a structure into a legacy. With <span className="text-white font-bold">Statuario Marble</span>, full home automation, and German kitchen systems, every inch of your home exudes opulence and state-of-the-art technology.</p>
                                    <p className="mt-4 text-white/50 text-base">
                                        <strong className="text-blue-300">Analysis:</strong> This is an investment in lifestyle and future-proofing. Features like VRV ACs, Biometric Security, and Automated Wellness systems put your home in the top 1% of the market. A Dream House is built with no compromise—experience the pinnacle of modern living.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Final Actions */}
                <div className="mt-16 pt-12 border-t border-white/10 flex flex-col md:flex-row gap-6 justify-center">
                    <button
                        onClick={handleFinalize}
                        disabled={processing}
                        className={`px-12 py-6 rounded-[2rem] text-black font-black text-xl flex items-center justify-center gap-4 transition-all ${processing
                            ? 'bg-blue-400/50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-400 to-cyan-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 group'
                            }`}
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Analyzing Project Fit...
                            </>
                        ) : (
                            <>
                                <Calculator className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                Finalize {tier}
                            </>
                        )}
                    </button>

                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </motion.div>
    );
}


function TrendingUp({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6" />
        </svg>
    );
}
