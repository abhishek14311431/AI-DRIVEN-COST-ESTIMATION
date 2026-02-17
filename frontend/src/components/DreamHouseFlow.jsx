import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function DreamHouseFlow({
    onBack,
    onAdditionalQuestions,
    selectedPlotSize,
    setSelectedPlotSize,
    selectedDimension,
    setSelectedDimension,
    customLength,
    setCustomLength,
    customWidth,
    setCustomWidth,
    showDimensions,
    setShowDimensions
}) {
    const [step, setStep] = useState('plot-selection');
    const [showPlotOptions, setShowPlotOptions] = useState(false);
    const [showCustomInputs, setShowCustomInputs] = useState(false);
    const [typingMessage, setTypingMessage] = useState('');


    const plotSizes = [
        { id: 'full-site', name: 'Full Site', description: '30x40 or 30x50 standard plot' },
        { id: 'double-site', name: 'Double Site', description: '60x40 or larger plots' }
    ];

    const fullSiteDimensions = [
        { id: '30x40', name: '30 x 40', area: '1200 sq ft' },
        { id: '30x50', name: '30 x 50', area: '1500 sq ft' },
        { id: '40x60', name: '40 x 60', area: '2400 sq ft' },
        { id: 'custom', name: 'Custom Size', area: 'Enter your own' }
    ];

    const doubleSiteDimensions = [
        { id: '60x40', name: '60 x 40', area: '2400 sq ft' },
        { id: '60x50', name: '60 x 50', area: '3000 sq ft' },
        { id: '80x60', name: '80 x 60', area: '4800 sq ft' },
        { id: 'custom', name: 'Custom Size', area: 'Enter your own' }
    ];

    useEffect(() => {


        if (selectedPlotSize) {
            setStep('dimension-selection');
            setShowPlotOptions(true);
            setShowDimensions(true);
        } else {

            const message = "Great! Let's try to estimate it. Give me required information.";
            let currentIndex = 0;
            setTypingMessage('');

            const typingInterval = setInterval(() => {
                if (currentIndex < message.length) {
                    setTypingMessage(prev => prev + message[currentIndex]);
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    setTimeout(() => {
                        setShowPlotOptions(true);
                    }, 500);
                }
            }, 30);
            return () => clearInterval(typingInterval);
        }
    }, []);



    const handlePlotSizeClick = (plotId) => {
        setSelectedPlotSize(plotId);
        setStep('dimension-selection');
        setTimeout(() => {
            setShowDimensions(true);
        }, 300);
    };

    const handleDimensionClick = (dimensionId) => {
        setSelectedDimension(dimensionId);
        if (dimensionId === 'custom') {
            setShowCustomInputs(true);
        } else {
            setShowCustomInputs(false);
            onAdditionalQuestions({
                projectType: 'dream-house',
                plotSize: selectedPlotSize,
                dimensions: dimensionId
            });
        }
    };

    const handleCustomDimensionConfirm = () => {
        if (customLength && customWidth) {
            const customDim = `${customLength}x${customWidth}`;
            setSelectedDimension(customDim);
            onAdditionalQuestions({
                projectType: 'dream-house',
                plotSize: selectedPlotSize,
                dimensions: customDim
            });
        }
    };

    const handleBack = () => {
        if (step === 'dimension-selection') {
            setStep('plot-selection');
            setShowDimensions(false);
            setSelectedDimension(null);
            setSelectedPlotSize(null);
            setShowCustomInputs(false);
        } else {
            onBack(); // Go back to project selection
        }
    };

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-12"
            >
                <motion.button
                    onClick={handleBack}
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl text-white font-semibold transition-all"
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                        fontFamily: "'Montserrat', sans-serif",
                    }}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </motion.button>

                <div className="flex flex-col items-center">
                    <motion.h1
                        className="text-6xl md:text-8xl font-bold text-white text-center"
                        style={{
                            fontFamily: "'Montserrat', sans-serif",
                            textShadow: '0 0 30px rgba(255, 215, 0, 0.3), 0 4px 20px rgba(0, 0, 0, 0.8)',
                        }}
                    >
                        Dream House
                    </motion.h1>
                </div>

                <div className="w-32"></div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="p-10 md:p-16 rounded-[4rem] overflow-hidden"
                    style={{
                        background: 'rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 0 60px rgba(255, 255, 255, 0.1)',
                    }}
                >

                    {/* Selected Plot Size Display */}
                    {!showPlotOptions && step !== 'plot-selection' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center mb-8 p-6 rounded-2xl"
                            style={{
                                background: 'rgba(255, 215, 0, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255, 215, 0, 0.3)',
                            }}
                        >
                            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                Your Selection
                            </h3>
                            <p className="text-white/90 text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                Plot Size: {plotSizes.find(p => p.id === selectedPlotSize)?.name}
                            </p>
                        </motion.div>
                    )}

                    {/* Plot Size Selection */}
                    {showPlotOptions && step === 'plot-selection' && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h2
                                className="text-6xl font-bold text-white text-center mb-12"
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                                Select Plot Size
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                {plotSizes.map((plot, index) => (
                                    <motion.div
                                        key={plot.id}
                                        initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + index * 0.2 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        onClick={() => handlePlotSizeClick(plot.id)}
                                        className={`cursor-pointer p-8 rounded-2xl transition-all ${selectedPlotSize === plot.id ? 'ring-4 ring-yellow-400' : ''}`}
                                        style={{
                                            background: 'rgba(0, 0, 0, 1)',
                                            backdropFilter: 'blur(15px)',
                                            border: '2px solid rgba(255, 255, 255, 0.3)',
                                        }}
                                    >
                                        <h3 className="text-5xl font-bold text-white mb-4">{plot.name}</h3>
                                        <p className="text-white/80 text-2xl">{plot.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Dimensions Selection */}
                    <AnimatePresence>
                        {showDimensions && step === 'dimension-selection' && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h2 className="text-6xl font-bold text-white text-center mb-12">Select Dimensions</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                                    {(selectedPlotSize === 'full-site' ? fullSiteDimensions : doubleSiteDimensions).map((dimension, index) => (
                                        <motion.div
                                            key={dimension.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.1 }}
                                            onClick={() => handleDimensionClick(dimension.id)}
                                            className="cursor-pointer p-6 rounded-xl text-center"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.12)',
                                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                            }}
                                        >
                                            <h4 className="text-4xl font-bold text-white mb-2">{dimension.name}</h4>
                                            <p className="text-white/70 text-xl">{dimension.area}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Custom Input */}
                                {showCustomInputs && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-8 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 text-center"
                                    >
                                        <h3 className="text-xl font-bold text-white text-center mb-4">Enter Custom Dimensions</h3>
                                        <div className="flex gap-4 justify-center items-center">
                                            <input
                                                type="number"
                                                value={customLength}
                                                onChange={(e) => setCustomLength(e.target.value)}
                                                className="w-20 px-3 py-2 rounded-lg text-center"
                                                placeholder="L"
                                            />
                                            <span className="text-white">x</span>
                                            <input
                                                type="number"
                                                value={customWidth}
                                                onChange={(e) => setCustomWidth(e.target.value)}
                                                className="w-20 px-3 py-2 rounded-lg text-center"
                                                placeholder="W"
                                            />
                                            <button
                                                onClick={handleCustomDimensionConfirm}
                                                className="px-6 py-2 rounded-lg text-white bg-yellow-500/80"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>

            </div>
        </div>
    );
}
