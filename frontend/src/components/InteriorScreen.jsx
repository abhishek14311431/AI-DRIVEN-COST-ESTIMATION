import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Home, Armchair, Sofa, Sparkles, Box, Layout } from 'lucide-react';
import { useState } from 'react';

export default function InteriorScreen({ onBack, selectedData, onProceed }) {
    const [selectedInterior, setSelectedInterior] = useState(selectedData?.interior || null);

    const interiorOptions = [
        {
            id: 'base',
            name: 'Base',
            description: 'Essential Furnishing',
            icon: Layout,
            color: 'from-orange-400 to-orange-600',
            features: [
                'Basic Wardrobes in Bedrooms',
                'Standard Modular Kitchen',
                'Basic TV Unit',
                'Essential Lighting',
                'Shoe Rack',
                'Utility Shelves'
            ]
        },
        {
            id: 'semi-furnished',
            name: 'Semi Furnished',
            description: 'Partial Comfort & Style',
            icon: Armchair,
            color: 'from-blue-400 to-blue-600',
            features: [
                'Premium Wardrobes with Lofts',
                'Premium Modular Kitchen',
                'TV Unit & Shoe Rack',
                'False Ceiling in Living Area',
                'Decorative Lighting',
                'Crockery Unit',
                'Study Table'
            ]
        },
        {
            id: 'fully-furnished',
            name: 'Fully Furnished',
            description: 'Luxury & Complete Comfort',
            icon: Sofa,
            color: 'from-purple-400 to-purple-600',
            features: [
                'Designer Wardrobes & Storage',
                'High-End Modular Kitchen',
                'Complete Living & Dining Furniture',
                'Full False Ceiling with Cove Lighting',
                'Curtains, Blinds & Soft Furnishings',
                'Wall Paneling & Decor',
                'Home Office Setup',
                'Smart Mirrors'
            ],
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


    interiorOptions[0].ai_breakdown = [
        "Functional 2-door wardrobes in master bedroom",
        "L-shaped modular kitchen with granite top",
        "Standard TV wall unit in living room",
        "Essential LED tubelights and fans in all rooms",
        "Basic Shoe Rack near Entrance",
        "Utility Area storage shelving"
    ];

    interiorOptions[1].ai_breakdown = [
        "Floor-to-ceiling wardrobes with loft storage",
        "Acrylic finish modular kitchen ",
        "Designer TV unit and foyer shoe rack",
        "Ambient false ceiling design for hall",
        "Chandelier and mood lighting provisions",
        "Crockery Unit in Dining Area",
        "Study Table setup in Kids Room"
    ];

    const handleProceed = () => {
        if (selectedInterior) {
            onProceed({ ...selectedData, interior: selectedInterior });
        }
    };

    return (
        <motion.div
            className="min-h-screen relative overflow-hidden p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div
                className="absolute inset-0 bg-cover bg-center fixed"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop')`,
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 fixed" />

            <div className="relative z-10 w-full max-w-[77%] mx-auto pb-10">
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

                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-100 to-purple-200 text-center drop-shadow-2xl font-serif">
                        Interior Design
                    </h1>
                    <div className="w-24 hidden md:block" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 md:p-10 rounded-[2.5rem] relative overflow-hidden"
                    style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    {/* Snapshot Summary */}
                    <div className="mb-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-1 bg-black/20 rounded-2xl border border-white/5">
                            <div className="p-4 rounded-xl hover:bg-white/5 transition-colors">
                                <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Project Details</p>
                                <p className="text-lg font-bold text-white tracking-wide">{selectedData?.projectType === 'dream-house' ? 'Dream House' : 'Rental'} <span className="text-white/40 text-sm">|</span> {selectedData?.plotSize?.replace('-', ' ')}</p>
                            </div>
                            <div className="p-4 rounded-xl hover:bg-white/5 transition-colors">
                                <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Structure</p>
                                <p className="text-lg font-bold text-white tracking-wide capitalize">{selectedData?.floors} <span className="text-white/40">|</span> {selectedData?.plan}</p>
                            </div>
                            <div className="p-4 rounded-xl hover:bg-white/5 transition-colors">
                                <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Upgrades</p>
                                <p className="text-lg font-bold text-white tracking-wide">{
                                    Object.entries(selectedData?.upgrades || {}).filter(([category, value]) => {
                                        const planDefaults = {
                                            base: { flooring: 'ceramic', walls: 'basic', electrical: 'basic', plumbing: 'basic', security: 'basic' },
                                            classic: { flooring: 'granite', walls: 'emulsion', electrical: 'branded', plumbing: 'branded', security: 'basic' },
                                            premium: { flooring: 'marble', walls: 'texture', electrical: 'branded', plumbing: 'branded', security: 'advanced' },
                                            luxury: { flooring: 'italian-marble', walls: 'texture', electrical: 'smart', plumbing: 'luxury', security: 'premium' }
                                        };
                                        const plan = selectedData?.plan?.toLowerCase() || 'base';
                                        const defaults = planDefaults[plan] || planDefaults.base;
                                        return value && value !== defaults[category];
                                    }).length
                                } Added</p>
                            </div>
                            <div className="p-4 rounded-xl hover:bg-white/5 transition-colors">
                                <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Interior</p>
                                <p className={`text-lg font-bold tracking-wide ${selectedInterior && selectedInterior !== 'none' ? 'text-purple-400' : 'text-white/30'}`}>
                                    {selectedInterior === 'none' ? 'None' : (selectedInterior ? interiorOptions.find(i => i.id === selectedInterior)?.name : 'None Selected')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* None Option */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setSelectedInterior('none')}
                            className={`cursor-pointer rounded-[2rem] overflow-hidden relative group transition-all duration-300 ${selectedInterior === 'none' ? `ring-2 ring-white/40 transform scale-[1.02]` : 'hover:scale-[1.01] border border-white/5'}`}
                            style={{
                                background: selectedInterior === 'none'
                                    ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.6))'
                                    : 'rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            <div className="p-8 h-full flex flex-col relative z-10">
                                <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-colors ${selectedInterior === 'none' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50'}`}>
                                    <Box className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">No Interior</h3>
                                <p className="text-white/60 mb-8 text-lg h-14">Building structure only, no interior work</p>
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-start gap-3 text-white/40 italic">
                                        <span>User-managed interior execution</span>
                                    </div>
                                </div>
                                <div className={`mt-8 w-full py-3 rounded-xl font-bold text-center transition-all ${selectedInterior === 'none' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40 group-hover:bg-white/10'}`}>
                                    {selectedInterior === 'none' ? 'Selected' : 'Select'}
                                </div>
                            </div>
                        </motion.div>

                        {interiorOptions.map((option, index) => (
                            <motion.div
                                key={option.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (index + 1) * 0.1 }}
                                onClick={() => setSelectedInterior(option.id)}
                                className={`cursor-pointer rounded-[2rem] overflow-hidden relative group transition-all duration-300 ${selectedInterior === option.id ? `ring-2 ring-purple-400 transform scale-[1.02]` : 'hover:scale-[1.01] border border-white/5'}`}
                                style={{
                                    background: selectedInterior === option.id
                                        ? 'linear-gradient(145deg, rgba(147, 51, 234, 0.15), rgba(0, 0, 0, 0.6))'
                                        : 'rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                <div className="p-8 h-full flex flex-col relative z-10">
                                    <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-colors ${selectedInterior === option.id ? 'bg-gradient-to-br ' + option.color : 'bg-white/5 text-white/50'}`}>
                                        <option.icon className={`w-8 h-8 ${selectedInterior === option.id ? 'text-white' : ''}`} />
                                    </div>

                                    <h3 className="text-3xl font-bold text-white mb-2">{option.name}</h3>
                                    <p className="text-white/60 mb-8 text-lg h-14">{option.description}</p>

                                    <div className="space-y-4 flex-1">
                                        {option.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3 group/item">
                                                <CheckCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 transition-colors ${selectedInterior === option.id ? 'text-purple-400' : 'text-white/20 group-hover/item:text-white/40'}`} />
                                                <span className="text-white/80 text-lg leading-snug">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={`mt-8 w-full py-3 rounded-xl font-bold text-center transition-all ${selectedInterior === option.id
                                        ? 'bg-gradient-to-r ' + option.color + ' text-white shadow-lg shadow-purple-500/20'
                                        : 'bg-white/5 text-white/40 group-hover:bg-white/10'
                                        }`}>
                                        {selectedInterior === option.id ? 'Selected' : 'Select Package'}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* AI Insight & Explainable Breakdown */}
                    <AnimatePresence mode="wait">
                        {selectedInterior && selectedInterior !== 'none' && (
                            <motion.div
                                key={selectedInterior}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="mt-12"
                            >
                                <div className="p-8 rounded-[2rem] bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-l-4 border-purple-500 backdrop-blur-md relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Sparkles className="w-64 h-64 text-purple-300" />
                                    </div>

                                    <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                                        <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                                        <span>AI Package Analysis: <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white">{interiorOptions.find(i => i.id === selectedInterior)?.name}</span></span>
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                        <div>
                                            <p className="text-purple-200 text-xl font-bold mb-4 uppercase tracking-wider">What you get:</p>
                                            <ul className="space-y-4">
                                                {interiorOptions.find(i => i.id === selectedInterior)?.ai_breakdown?.map((item, idx) => (
                                                    <motion.li
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="flex items-start gap-4"
                                                    >
                                                        <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                                                        <span className="text-2xl text-white font-medium leading-relaxed">{item}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex flex-col justify-center bg-black/20 p-6 rounded-2xl border border-white/5">
                                            <p className="text-purple-200 text-lg font-bold mb-2 uppercase tracking-wider">Plan Compatibility</p>
                                            <p className="text-white/80 text-xl leading-relaxed italic">
                                                "Based on your <span className="text-white font-bold">{selectedData?.plotSize?.replace('-', ' ')}</span> plot,
                                                this package maximizes utilize space efficiency.
                                                {selectedInterior === 'fully-furnished'
                                                    ? " It transforms your home into a move-in ready luxury suite matching high-end standards."
                                                    : selectedInterior === 'semi-furnished'
                                                        ? " It strikes the perfect balance between style and customization potential."
                                                        : " It provides all essential framework, allowing you to upgrade specific elements later at your own pace."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Old static insight box removed/replaced by dynamic one above */}

                    <div className="mt-12 flex justify-end">
                        <motion.button
                            whileHover={selectedInterior ? { scale: 1.05, boxShadow: '0 0 30px rgba(147, 51, 234, 0.3)' } : {}}
                            whileTap={selectedInterior ? { scale: 0.95 } : {}}
                            onClick={handleProceed}
                            disabled={!selectedInterior}
                            className={`px-12 py-5 rounded-2xl text-white font-bold text-lg tracking-wide shadow-2xl flex items-center gap-3 transition-all ${selectedInterior ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                        >
                            Review Project Details
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                        </motion.button>
                    </div>
                </motion.div>
            </div >
        </motion.div >
    );
}
