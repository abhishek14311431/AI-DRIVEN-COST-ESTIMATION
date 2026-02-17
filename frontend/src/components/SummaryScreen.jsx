import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function SummaryScreen({ onBack, selectedData, onProceed }) {
    // detailed summary screen logic
    const [compoundWall, setCompoundWall] = useState(selectedData?.additionalRequirements?.compoundWall || selectedData?.compoundWall || false);
    const [rainWater, setRainWater] = useState(selectedData?.additionalRequirements?.rainWater || selectedData?.rainWater || false);
    const additionalNotes = selectedData?.additionalRequirements?.notes || '';

    const formatValue = (str) => {
        if (str === null || str === undefined) return '';
        const s = String(str);
        return s
            .replace(/-/g, ' ')
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters if generic
            .replace(/^./, (char) => char.toUpperCase());

    };

    const interiorOptions = [
        {
            id: 'base',
            name: 'Base',
            ai_breakdown: [
                "Functional 2-door wardrobes in master bedroom",
                "L-shaped modular kitchen with granite top",
                "Standard TV wall unit in living room",
                "Essential LED tubelights and fans in all rooms",
                "Basic Shoe Rack near Entrance",
                "Utility Area storage shelving"
            ]
        },
        {
            id: 'semi-furnished',
            name: 'Semi Furnished',
            ai_breakdown: [
                "Floor-to-ceiling wardrobes with loft storage",
                "Acrylic finish modular kitchen ",
                "Designer TV unit and foyer shoe rack",
                "Ambient false ceiling design for hall",
                "Chandelier and mood lighting provisions",
                "Crockery Unit in Dining Area",
                "Study Table setup in Kids Room"
            ]
        },
        {
            id: 'fully-furnished',
            name: 'Fully Furnished',
            ai_breakdown: [
                "Complete custom-designed wardrobes for all bedrooms",
                "Italian/German modular kitchen with built-in hob",
                "Premium L-shaped sofa, 6-seater dining set, and coffee table",
                "Smart lighting automation ready false ceilings",
                "Acoustic wall paneling and luxury drapes",
                "Dedicated Home Office Setup with Ergonomic Furniture",
                "Smart Mirror & Vanity Units in Bathrooms"
            ]
        }
    ];

    const currentInterior = interiorOptions.find(opt => opt.id === selectedData?.interior);

    const handleProceed = () => {
        onProceed({
            ...selectedData,
            additionalRequirements: {
                compoundWall,
                rainWater,
                notes: additionalNotes
            }
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="min-h-screen relative overflow-hidden p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center fixed"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop')`,
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 fixed" />

            <div className="relative z-10 w-full max-w-[77%] mx-auto pb-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 pt-4"
                >
                    <motion.button
                        onClick={onBack}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-white/80 font-medium hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-md mb-4 md:mb-0"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </motion.button>

                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-gray-200 text-center drop-shadow-2xl font-serif">
                        Project Specification
                    </h1>
                    <div className="w-24 hidden md:block" />
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-12"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Primary Details */}
                        <div className="space-y-8">
                            <motion.div variants={itemVariants} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                                <h3 className="text-sm font-black text-yellow-400 uppercase tracking-[0.3em] mb-8 opacity-60 flex items-center gap-2">
                                    Project Fundamentals
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: 'Project Name', value: formatValue(selectedData?.projectType) },
                                        { label: 'Plot Size', value: formatValue(selectedData?.plotSize) },
                                        { label: 'Total Floors', value: formatValue(selectedData?.floors) },
                                        { label: 'Area Details', value: `${selectedData?.dimensions || selectedData?.plotSize || ''} FT` }
                                    ].map((item, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                            <span className="text-[10px] text-white/30 uppercase tracking-widest font-black leading-none">{item.label}</span>
                                            <span className="text-xl font-bold text-white truncate">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                                <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.3em] mb-8 opacity-60 flex items-center gap-2">
                                    Execution Specs
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-black leading-none">Build Quality</span>
                                        <span className="text-xl font-bold text-white uppercase">{formatValue(selectedData?.plan)}</span>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-black leading-none">Interior Package</span>
                                        <span className="text-xl font-bold text-purple-400 uppercase">{formatValue(selectedData?.interior) || 'None'}</span>
                                    </div>
                                </div>
                            </motion.div>

                            {currentInterior && (
                                <motion.div variants={itemVariants} className="p-8 rounded-[2.5rem] bg-purple-500/5 border border-purple-500/20 backdrop-blur-xl">
                                    <h3 className="text-sm font-black text-purple-400 uppercase tracking-[0.3em] mb-6 opacity-60 flex items-center gap-2">
                                        Interior Specification
                                    </h3>
                                    <div className="space-y-3">
                                        {currentInterior.ai_breakdown.map((item, idx) => (
                                            <div key={idx} className="flex gap-3 text-white/90 text-lg border-b border-white/5 pb-2">
                                                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Right: Detailed Configuration */}
                        <div className="space-y-8">
                            {selectedData?.answers && Object.keys(selectedData.answers).length > 0 && (
                                <motion.div variants={itemVariants} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                                    <h3 className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em] mb-8 opacity-60 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Configuration Review
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(selectedData.answers).map(([key, value]) => (
                                            <div key={key} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                                <span className="text-[10px] text-white/30 uppercase tracking-widest font-black leading-none">{formatValue(key)}</span>
                                                <span className="text-xl font-bold text-white">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <motion.div variants={itemVariants} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                                {(() => {
                                    const planDefaults = {
                                        base: { flooring: 'ceramic', walls: 'basic', electrical: 'basic', plumbing: 'basic', security: 'basic' },
                                        classic: { flooring: 'granite', walls: 'emulsion', electrical: 'branded', plumbing: 'branded', security: 'basic' },
                                        premium: { flooring: 'marble', walls: 'texture', electrical: 'branded', plumbing: 'branded', security: 'advanced' },
                                        luxury: { flooring: 'italian-marble', walls: 'texture', electrical: 'smart', plumbing: 'luxury', security: 'premium' }
                                    };
                                    const plan = selectedData?.plan?.toLowerCase() || 'base';
                                    const defaults = planDefaults[plan] || planDefaults.base;
                                    const activeUpgrades = Object.entries(selectedData?.upgrades || {}).filter(([category, value]) => {
                                        return value && value !== defaults[category];
                                    });

                                    return activeUpgrades.length > 0 ? (
                                        <>
                                            <h3 className="text-sm font-black text-orange-400 uppercase tracking-[0.3em] mb-8 opacity-60 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                Premium Upgrades ({activeUpgrades.length})
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {activeUpgrades.map(([category, value]) => (
                                                    <div key={category} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-black leading-none">{formatValue(category)}</span>
                                                        <span className="text-lg font-bold text-white uppercase">{formatValue(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : null;
                                })()}
                            </motion.div>

                            <motion.div variants={itemVariants} className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 backdrop-blur-xl">
                                <div className="mb-8">
                                    <span className="text-sm text-indigo-300 font-bold uppercase tracking-widest block mb-6">Additional Specifications</span>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Compound Wall Toggle */}
                                        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white/5 border border-white/10">
                                            <span className="text-xs text-white/60 font-bold uppercase tracking-wider">Compound Wall Option</span>
                                            <div className="flex gap-2 p-1 rounded-xl bg-black/40 border border-white/10">
                                                <button
                                                    onClick={() => setCompoundWall(true)}
                                                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 ${compoundWall
                                                            ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-105'
                                                            : 'bg-transparent text-white/30 hover:text-white/50 hover:bg-white/5'
                                                        }`}
                                                >
                                                    YES
                                                </button>
                                                <button
                                                    onClick={() => setCompoundWall(false)}
                                                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 ${!compoundWall
                                                            ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-600/50 scale-105'
                                                            : 'bg-transparent text-white/30 hover:text-white/50 hover:bg-white/5'
                                                        }`}
                                                >
                                                    NO
                                                </button>
                                            </div>
                                        </div>

                                        {/* Rain Water Harvesting Toggle */}
                                        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white/5 border border-white/10">
                                            <span className="text-xs text-white/60 font-bold uppercase tracking-wider">Rain Harvesting Option</span>
                                            <div className="flex gap-2 p-1 rounded-xl bg-black/40 border border-white/10">
                                                <button
                                                    onClick={() => setRainWater(true)}
                                                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 ${rainWater
                                                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50 scale-105'
                                                            : 'bg-transparent text-white/30 hover:text-white/50 hover:bg-white/5'
                                                        }`}
                                                >
                                                    YES
                                                </button>
                                                <button
                                                    onClick={() => setRainWater(false)}
                                                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 ${!rainWater
                                                            ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-600/50 scale-105'
                                                            : 'bg-transparent text-white/30 hover:text-white/50 hover:bg-white/5'
                                                        }`}
                                                >
                                                    NO
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {additionalNotes && (
                                    <div className="pt-6 border-t border-white/10">
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-black block mb-3">Special Instructions</span>
                                        <p className="text-lg text-white/60 leading-relaxed italic">
                                            "{additionalNotes}"
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Generate Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 flex justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(250, 204, 21, 0.3)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleProceed}
                        className="px-16 py-6 rounded-2xl text-black font-bold text-xl tracking-wide shadow-2xl flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500"
                    >
                        Generate Final Estimate
                        <CheckCircle className="w-6 h-6" />
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
}
