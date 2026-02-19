import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Sparkles, Calculator, Award, Loader2 } from 'lucide-react';

export default function SelectedTierDetail({ onBack, tier, estimateData, baseEstimateData, selectedData, onProceed }) {
    const [processing, setProcessing] = useState(false);

    // Initialize excludedFeatures based on the provided estimateData
    const [excludedFeatures, setExcludedFeatures] = useState(() => {
        const activeIds = new Set(estimateData?.breakdown?.active_upgrade_features?.map(f => f.id) || []);

        // If we have active features (meaning we're returning from a previous finalization),
        // we figure out which ones from this tier were excluded.
        if (activeIds.size > 0) {
            const currentTierFeatures = tierFeatures[tier] || [];
            const excluded = new Set();
            currentTierFeatures.forEach(f => {
                if (!activeIds.has(f.id)) {
                    excluded.add(f.id);
                }
            });
            return excluded;
        }
        return new Set();
    });

    const [saved, setSaved] = useState(false);

    const baseTotal = Number(baseEstimateData?.breakdown?.total_cost || 0);
    const upgradedTotalFromBackend = Number(estimateData?.breakdown?.total_cost || 0);

    // The "honest" upgrade cost is the delta between the two backend estimates
    const initialUpgradeCost = upgradedTotalFromBackend - baseTotal;

    const tierFeatures = {
        "Classic": [
            { id: 'c1', category: "Flooring", item: "Premium Granite Flooring", detail: "Exotic natural granite with premium mirror polish for stairs and living areas.", weight: 0.40 },
            { id: 'c2', category: "Designer", item: "Custom Finishes", detail: "Designer wall putty and premium emulsion paint with custom textures.", weight: 0.075 },
            { id: 'c3', category: "Joinery", item: "Teak Wood Main Frame", detail: "Seasoned teak wood frame (5'x3') for enhanced entrance aesthetics.", weight: 0.075 },
            { id: 'c4', category: "Electrical", item: "Modular Upgrades", detail: "Legrand/Schneider modular switches with FRLS concealed wiring.", weight: 0.075 },
            { id: 'c5', category: "Features", item: "Premium Sanitaryware", detail: "Jaquar/Cera contemporary collection for all bathrooms.", weight: 0.075 },
            { id: 'c6', category: "Kitchen", item: "Granite Platform", detail: "Black galaxy granite counter with stainless steel sink.", weight: 0.075 },
            { id: 'c7', category: "Windows", item: "UPVC Windows", detail: "High-quality UPVC windows with mosquito mesh & safety grills.", weight: 0.075 },
            { id: 'c8', category: "Plumbing", item: "CPVC/UPVC Piping", detail: "Astral/Ashirvad concealed piping for long-lasting durability.", weight: 0.075 },
            { id: 'c9', category: "Painting", item: "Premium Emulsion", detail: "High-sheen washable emulsion for all internal walls.", weight: 0.075 } // Corrected weight to sum to 1.0
            // Correction: 0.4 + 0.075*8 = 1.0. Perfect.
        ],
        "Premium": [
            { id: 'p1', category: "Flooring", item: "Italian Marble & Granite Stairs", detail: "High-grade Italian marble for living/dining areas and premium galaxy granite for staircase with molded edges.", weight: 0.40 },
            { id: 'p2', category: "Automation", item: "Smart Security System", detail: "Video door phone with 7-inch display and smart digital locks from Godrej/Yale.", weight: 0.05 },
            { id: 'p3', category: "Joinery", item: "Full Teak Wood Main Door", detail: "Hand-carved solid Teak wood main door with antique brass hardware and PU polish.", weight: 0.05 },
            { id: 'p4', category: "Walls", item: "Royale Texture Finishes", detail: "Asian Paints Royale Play designer textures for highlight walls in Living & Master Bedroom.", weight: 0.05 },
            { id: 'p5', category: "Sanitary", item: "Kohler Premium Series", detail: "Single-lever divertors, wall-hung closets with soft-close seat covers, and rain showers.", weight: 0.05 },
            { id: 'p6', category: "Kitchen", item: "Acrylic Modular Framework", detail: "Water-proof BWP ply carcass with high-gloss acrylic shutters and Hettich hardware.", weight: 0.05 },
            { id: 'p7', category: "Electrical", item: "Schneider Livia/Zencelo", detail: "Slim-line modular switches with fire-retardant wiring and MCB distribution boards.", weight: 0.05 },
            { id: 'p8', category: "Windows", item: "Premium UPVC Profiles", detail: "Lead-free UPVC windows with toughened glass and multi-point locking mechanisms.", weight: 0.05 },
            { id: 'p9', category: "Plumbing", item: "FlowGuard CPVC", detail: "Ashirvad/Astral FlowGuard plus piping ensuring 50+ years of leak-proof performance.", weight: 0.05 },
            { id: 'p10', category: "Ceiling", item: "Gypsum False Ceiling", detail: "Saint-Gobain Gypsum false ceiling with cove lighting provisions in Living & Dining.", weight: 0.05 },
            { id: 'p11', category: "Railing", item: "SS 304 Glass Railing", detail: "Stainless Steel 304 grade railing with 10mm toughened glass for balconies and stairs.", weight: 0.05 },
            { id: 'p12', category: "Bathroom", item: "Glass Shower Partitions", detail: "Toughened glass partitions in Master Toilet for wet and dry area separation.", weight: 0.05 },
            { id: 'p13', category: "Exterior", item: "Texture Paint & Cladding", detail: "Weather-proof texture paint combination with natural stone cladding highlights.", weight: 0.05 }
            // 0.4 + 0.05 * 12 = 1.0. Perfect.
        ],
        "Luxury": [
            { id: 'l1', category: "Flooring", item: "Italian Statuario Marble", detail: "Premium imported Statuario or Dyna marble with 7-layer diamond polish for seamless luxury.", weight: 0.40 },
            { id: 'l2', category: "Automation", item: "Full Home Ecosystem", detail: "Voice-controlled automation for lighting, curtains, ACs, and media via iPad/Phone control.", weight: 0.0375 },
            { id: 'l3', category: "Walls", item: "PU Finish & Paneling", detail: "High-gloss PU finish for internal walls, charcoal louvers, and veneer paneling in lobbies.", weight: 0.0375 },
            { id: 'l4', category: "Kitchen", item: "German Gourmet Suite", detail: "Fully integrated modular kitchen with Bosch built-in appliances and Hafele fittings.", weight: 0.0375 },
            { id: 'l5', category: "Sanitary", item: "Automated Wellness", detail: "Toto/Duravit automated heat-seated toilets, thermostatic showers, and jacuzzi provisions.", weight: 0.0375 },
            { id: 'l6', category: "Joinery", item: "8ft Grand Teak Entrance", detail: "8-foot tall majestic teak entrance door with biometric access and designer side panels.", weight: 0.0375 },
            { id: 'l7', category: "Windows", item: "Schuco Aluminium Systems", detail: "Slim-profile thermal break aluminium windows with double-glazed noise insulation.", weight: 0.0375 },
            { id: 'l8', category: "HVAC", item: "VRV/VRF AC Provisioning", detail: "Centralized copper piping and ducting provision for VRV air conditioning systems.", weight: 0.0375 },
            { id: 'l9', category: "Electrical", item: "Touch Automation Switches", detail: "Glass panel touch switches with scene control and dimming capabilities.", weight: 0.0375 },
            { id: 'l10', category: "Plumbing", item: "Grohe Thermostatic", detail: "Pressure pump compatible Grohe/Hansgrohe thermostatic mixers and high-flow showers.", weight: 0.0375 },
            { id: 'l11', category: "Ceiling", item: "Designer Veneer Ceiling", detail: "Intricate POP designs combined with wooden veneer rafters and profile LED lighting.", weight: 0.0375 },
            { id: 'l12', category: "Lighting", item: "Magnetic Track Lights", detail: "Architectural magnetic track lighting systems and COB spot lights throughout.", weight: 0.0375 },
            { id: 'l13', category: "Security", item: "Biometric & Perimeter", detail: "Face-recognition entry, AI Human detection CCTV, and laser perimeter fencing.", weight: 0.0375 },
            { id: 'l14', category: "Landscape", item: "Vertical Gardens & Deck", detail: "Automated irrigation system for vertical gardens and WPC deck flooring for terraces.", weight: 0.0375 },
            { id: 'l15', category: "Fabrication", item: "CNC Laser Cut Gates", detail: "Automated heavy-duty main gates with designer CNC laser cut patterns and multiple motors.", weight: 0.0375 },
            { id: 'l16', category: "Exterior", item: "HPL & Stone Facade", detail: "High-Pressure Laminate (HPL) sheets combined with dry-clad natural stone facade.", weight: 0.0375 },
            { id: 'l17', category: "Water", item: "Pressure & Softener", detail: "Centralized pressure pump system and water softener plant for the entire home.", weight: 0.0375 }
            // 0.4 + 0.0375 * 16 = 0.4 + 0.6 = 1.0. Perfect.
        ],
        "Luxury Plus": [
            { id: 'lp1', category: "Flooring", item: "Imported Botticino Marble", detail: "Ultra-premium Italian Botticino marble with precision book-matching and mirror finish.", weight: 0.40 },
            { id: 'lp2', category: "Automation", item: "Full IoT Smart Ecosystem", detail: "Unified home control via secure local server, voice integration, and customized lighting scenes.", weight: 0.05 },
            { id: 'lp3', category: "Cinema", item: "Private Home Cinema", detail: "Acoustically treated cinema room with 4K laser projection and Dolby Atmos 9.2 surround sound.", weight: 0.05 },
            { id: 'lp4', category: "Kitchen", item: "Gourmet Kitchen Suite", detail: "Professional-grade built-in appliances from Miele/Gaggenau with stone island counter.", weight: 0.05 },
            { id: 'lp5', category: "Wellness", item: "Spa-Grade Wellness Hub", detail: "Integrated sauna, steam room, and hydro-therapy rain showers from Axor.", weight: 0.05 },
            { id: 'lp6', category: "Security", item: "Biometric & Surveillance Hub", detail: "Advanced AI-powered human detection CCTV and 24/7 security monitoring center.", weight: 0.05 },
            { id: 'lp7', category: "Energy", item: "Solar Hybrid System", detail: "10KW grid-interactive solar system with lithium battery storage for zero-bill performance.", weight: 0.05 },
            { id: 'lp8', category: "Elevator", item: "Panoramic Glass Elevator", detail: "Custom designer glass elevator with seamless movement and panoramic views.", weight: 0.05 },
            { id: 'lp9', category: "Workspace", item: "Soundproof Study", detail: "Executive work suite with leather wall panels and double-glazed noise isolation.", weight: 0.05 },
            { id: 'lp10', category: "HVAC", item: "Multi-Zone Climate Control", detail: "Daikin VRV systems with individual temperature zoning for every room.", weight: 0.05 },
            { id: 'lp11', category: "Entrance", item: "Solid Rosewood Carvings", detail: "8ft majestic rosewood main entrance with intricate hand-carved heritage patterns.", weight: 0.05 },
            { id: 'lp12', category: "Comfort", item: "Underfloor Heating/Cooling", detail: "Radiant floor heating and cooling system for perfect thermal comfort in all seasons.", weight: 0.05 },
            { id: 'lp13', category: "Lifestyle", item: "Professional Gym & Yoga", detail: "In-house fitness suite with premium equipment and shock-absorbing oak wood flooring.", weight: 0.05 }
            // 0.4 + 0.05 * 12 = 1.0. Perfect.
        ]
    };

    const currentFeatures = tierFeatures[tier] || [];

    // Calculate dynamic costs based on weights
    const currentUpgradeCost = currentFeatures.reduce((acc, feat) => {
        if (excludedFeatures.has(feat.id)) return acc;
        return acc + (initialUpgradeCost * feat.weight);
    }, 0);

    const finalTotal = baseTotal + currentUpgradeCost;

    const toggleFeature = (id) => {
        const newExcluded = new Set(excludedFeatures);
        if (newExcluded.has(id)) {
            newExcluded.delete(id);
        } else {
            newExcluded.add(id);
        }
        setExcludedFeatures(newExcluded);
        setSaved(false);
    };

    const handleSave = () => {
        setProcessing(true);
        setTimeout(() => {
            setSaved(true);
            setProcessing(false);
        }, 600);
    };

    const handleFinalize = () => {
        setProcessing(true);
        setTimeout(() => {
            const activeFeatures = currentFeatures.filter(f => !excludedFeatures.has(f.id));

            // Include updated costs and features in the proceed callback
            onProceed?.({
                ...estimateData,
                breakdown: {
                    ...estimateData.breakdown,
                    upgrades_cost: currentUpgradeCost,
                    total_cost: baseTotal + currentUpgradeCost,
                    active_upgrade_features: activeFeatures
                }
            });
            setProcessing(false);
        }, 800);
    };

    return (
        <motion.div className="min-h-screen bg-black text-white p-6 relative overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 fixed" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-black to-blue-800/30 fixed" />

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
                        <p className="text-white/40 tracking-[0.4em] uppercase text-[10px] font-bold mt-2 font-sansital-black">Interactive Feature Customization & Cost Audit</p>
                    </div>
                    <div className="w-32 hidden md:block" />
                </div>

                {/* Financial Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl group transition-all">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Base Project Cost</p>
                        <p className="text-4xl font-bold">₹{baseTotal.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-10 rounded-[2.5rem] bg-blue-500/10 border border-blue-500/20 backdrop-blur-3xl group hover:border-blue-400 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-20 h-20 text-blue-400" />
                        </div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Upgrade Adjustment</p>
                        <p className="text-4xl font-bold text-blue-300">
                            {excludedFeatures.size > 0 ? (
                                <>
                                    <span className="text-sm line-through opacity-40 mr-2 text-white/50">₹{initialUpgradeCost.toLocaleString('en-IN')}</span>
                                    <span>+ ₹{Math.round(currentUpgradeCost).toLocaleString('en-IN')}</span>
                                </>
                            ) : (
                                `+ ₹${initialUpgradeCost.toLocaleString('en-IN')}`
                            )}
                        </p>
                        {excludedFeatures.size > 0 && (
                            <p className="text-[10px] text-green-400 font-bold uppercase mt-2">₹{(initialUpgradeCost - currentUpgradeCost).toLocaleString('en-IN')} DEDUCTED</p>
                        )}
                    </div>
                    <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-cyan-600 shadow-2xl shadow-blue-500/20">
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Final Customized Investment</p>
                        <p className="text-6xl font-black tracking-tight">₹{Math.round(finalTotal).toLocaleString('en-IN')}</p>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="flex flex-col gap-10">
                    <div className="p-8 rounded-[3rem] bg-zinc-900/40 border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <Award className="w-8 h-8 text-cyan-400" />
                                <h3 className="text-2xl font-black tracking-tighter uppercase">Customize Deliverables ({currentFeatures.length - excludedFeatures.size} Active)</h3>
                            </div>
                            <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Tap items to add or remove from bundle</p>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
                            {currentFeatures.map((feat, i) => {
                                const isExcluded = excludedFeatures.has(feat.id);
                                return (
                                    <motion.div
                                        key={feat.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toggleFeature(feat.id)}
                                        className={`flex flex-col gap-3 p-6 rounded-2xl border transition-all relative overflow-hidden cursor-pointer ${isExcluded
                                            ? 'bg-red-500/5 border-red-500/20 grayscale opacity-40'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/30'
                                            }`}
                                    >
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-3xl -mr-4 -mt-4" />
                                        <div className="flex items-center justify-between relative z-10">
                                            <p className={`text-sm font-black uppercase tracking-wide ${isExcluded ? 'text-red-400' : 'text-blue-400'}`}>
                                                {feat.category} • ₹{Math.round(initialUpgradeCost * feat.weight).toLocaleString('en-IN')}
                                            </p>
                                            {isExcluded ? (
                                                <div className="w-5 h-5 rounded-full border border-red-500/50 flex items-center justify-center">
                                                    <div className="w-2.5 h-0.5 bg-red-500" />
                                                </div>
                                            ) : (
                                                <CheckCircle className="w-5 h-5 text-blue-400" />
                                            )}
                                        </div>
                                        <div className="relative z-10">
                                            <h4 className={`text-lg font-bold mb-2 leading-tight ${isExcluded ? 'text-white/40 line-through' : 'text-white'}`}>{feat.item}</h4>
                                            <p className="text-white/40 text-xs leading-relaxed font-medium">{feat.detail}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-gradient-to-r from-zinc-900/80 to-zinc-900/40 border border-white/10 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <Sparkles className="w-8 h-8 text-blue-400" />
                            <h3 className="text-2xl font-black tracking-tighter uppercase">AI Dynamic Justification</h3>
                        </div>
                        <div className="space-y-6 text-white/90 leading-relaxed text-xl font-light tracking-wide relative z-10">
                            <p>
                                This <span className="text-blue-400 font-bold">{tier} Audit</span> has been dynamically recalculated.
                                {excludedFeatures.size > 0 ? (
                                    <>
                                        By removing <span className="text-red-400 font-bold">{excludedFeatures.size} specific items</span>, we have optimized your budget to focus on core essentials.
                                        Your total turnkey investment has been reduced by <span className="text-green-400 font-bold">₹{(initialUpgradeCost - currentUpgradeCost).toLocaleString('en-IN')}</span>.
                                    </>
                                ) : (
                                    <>
                                        You are currently viewing the <span className="text-white font-bold">full logical bundle</span> for this tier, ensuring absolute architectural harmony and maximum ROI for your project.
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final Actions */}
                <div className="mt-16 pt-12 border-t border-white/10 flex flex-col md:flex-row gap-6 justify-center items-center">
                    <button
                        onClick={handleSave}
                        disabled={processing || saved}
                        className={`px-10 py-5 rounded-2xl border font-black text-lg transition-all flex items-center gap-3 ${saved
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/60'
                            }`}
                    >
                        {saved ? <><CheckCircle className="w-5 h-5" /> Saved Selection</> : 'Save Project Upgrade'}
                    </button>

                    <button
                        onClick={handleFinalize}
                        disabled={processing}
                        className={`px-12 py-6 rounded-[2rem] text-black font-black text-2xl flex items-center justify-center gap-4 transition-all ${processing
                            ? 'bg-blue-400/50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-400 to-cyan-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 group'
                            }`}
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Finalizing Audit...
                            </>
                        ) : (
                            <>
                                <Calculator className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                                Finalize & Sign Audit
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
