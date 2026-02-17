import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, CheckCircle, Shield, Zap, Droplets, Grid, BadgeCheck } from 'lucide-react';
import { useState } from 'react';

export default function UpgradeScreen({ onBack, selectedData, onProceed }) {

  const planDefaults = {
    base: { flooring: 'ceramic', walls: 'basic', electrical: 'basic', plumbing: 'basic', security: 'basic' },
    classic: { flooring: 'granite', walls: 'emulsion', electrical: 'branded', plumbing: 'branded', security: 'basic' },
    premium: { flooring: 'marble', walls: 'texture', electrical: 'branded', plumbing: 'branded', security: 'advanced' },
    luxury: { flooring: 'italian-marble', walls: 'texture', electrical: 'smart', plumbing: 'luxury', security: 'premium' }
  };

  const getDefaultsForPlan = (plan) => planDefaults[plan?.toLowerCase() || 'base'] || planDefaults.base;

  const [selectedUpgrades, setSelectedUpgrades] = useState(() => {
    const defaults = getDefaultsForPlan(selectedData?.plan);
    return { ...defaults, ...(selectedData?.upgrades || {}) };
  });

  const [activeCategory, setActiveCategory] = useState(null);

  const tierDetails = {
    base: { name: 'Base', color: 'text-gray-400', border: 'border-gray-400' },
    classic: { name: 'Classic', color: 'text-green-400', border: 'border-green-400' },
    premium: { name: 'Premium', color: 'text-purple-400', border: 'border-purple-400' },
    luxury: { name: 'Luxury', color: 'text-yellow-400', border: 'border-yellow-400' }
  };

  const upgradeOptions = {
    flooring: {
      title: 'Flooring',
      icon: Grid,
      description: 'Upgrade your walk experience',
      options: [
        { id: 'ceramic', name: 'Ceramic Tiles', price: 0, description: 'Standard durable ceramic tiles' },
        { id: 'granite', name: 'Granite Flooring', price: 120, description: 'Polished natural granite' },
        { id: 'marble', name: 'Marble Flooring', price: 250, description: 'Premium Indian marble' },
        { id: 'italian-marble', name: 'Italian Marble', price: 450, description: 'Imported luxury Italian marble' }
      ]
    },
    walls: {
      title: 'Wall Finishes',
      icon: Star,
      description: 'Define your room ambience',
      options: [
        { id: 'basic', name: 'Basic Paint', price: 0, description: 'Standard distemper paint' },
        { id: 'emulsion', name: 'Emulsion Paint', price: 40, description: 'Smooth finish washable paint' },
        { id: 'texture', name: 'Texture & Royal', price: 85, description: 'Designer texture walls' }
      ]
    },
    electrical: {
      title: 'Electrical',
      icon: Zap,
      description: 'Power your home smartly',
      options: [
        { id: 'basic', name: 'Standard', price: 0, description: 'ISI marked wires & switches' },
        { id: 'branded', name: 'Premium Branded', price: 65, description: 'Legrand/Goldmedal modular' },
        { id: 'smart', name: 'Home Automation', price: 180, description: 'IoT enabled smart switches' }
      ]
    },
    plumbing: {
      title: 'Plumbing',
      icon: Droplets,
      description: 'Flow and fixture quality',
      options: [
        { id: 'basic', name: 'Standard', price: 0, description: 'Basic chrome plated fittings' },
        { id: 'branded', name: 'Premium Brand', price: 90, description: 'Jaquar/Kohler class fittings' },
        { id: 'luxury', name: 'Luxury Suite', price: 220, description: 'Imported designer sanitaryware' }
      ]
    },
    security: {
      title: 'Security',
      icon: Shield,
      description: 'Safety for your peace of mind',
      options: [
        { id: 'basic', name: 'Basic Locks', price: 0, description: 'Standard door locks' },
        { id: 'advanced', name: 'Digital Security', price: 110, description: 'Video door phone & digital locks' },
        { id: 'premium', name: 'Smart Security', price: 250, description: 'Full CCTV & Biometric access' }
      ]
    }
  };

  const currentDefaults = getDefaultsForPlan(selectedData?.plan);



  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const isIncludedOrLower = (category, optionId) => {

    return false;
  };

  const handleUpgradeSelect = (category, optionId) => {
    setSelectedUpgrades(prev => {

      if (prev[category] === optionId) {
        const newUpgrades = { ...prev };
        newUpgrades[category] = currentDefaults[category] === optionId ? null : currentDefaults[category];
        return newUpgrades;
      }
      return { ...prev, [category]: optionId };
    });
  };

  const handleProceed = () => {
    onProceed({ ...selectedData, upgrades: selectedUpgrades });
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
          backgroundImage: `url('https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 fixed" />

      <div className="relative z-10 w-full max-w-[90%] mx-auto pb-10">
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

          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-center drop-shadow-2xl font-serif">
            Review Your Plan
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
                <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Project</p>
                <p className="text-lg font-bold text-white tracking-wide">{
                  Object.entries(selectedUpgrades).filter(([category, value]) => {
                    return value && value !== currentDefaults[category];
                  }).length
                } Selected</p>
              </div>
            </div>
          </div>

          {/* Upgrades Grid */}
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(upgradeOptions).map(([category, details], index) => {
              const selectedId = selectedUpgrades[category] || currentDefaults[category];
              const selectedOptionName = details.options.find(o => o.id === selectedId)?.name;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${activeCategory === category ? 'bg-white/10 border-white/20' : 'bg-black/20 border-white/5'}`}
                >
                  <div
                    className="p-6 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-xl relative ${currentDefaults[category] !== 'basic' && currentDefaults[category] !== 'ceramic' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/50'}`}>
                        <details.icon className="w-8 h-8" />
                        {/* Show dot if upgraded from plan default */}
                        {selectedId !== currentDefaults[category] && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-400 border border-black" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{details.title}</h3>
                        <p className="text-white/50 text-sm hidden md:block">{details.description}</p>
                        <p className="text-yellow-400 text-sm md:hidden mt-1">{selectedOptionName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Current Selection</p>
                        <p className={`font-bold ${selectedId !== currentDefaults[category] ? 'text-yellow-400' : 'text-white'}`}>{selectedOptionName}</p>
                      </div>
                      <motion.div
                        animate={{ rotate: activeCategory === category ? 180 : 0 }}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeCategory === category && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-black/20"
                      >
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {details.options.map((option) => {
                            const status = isIncludedOrLower(category, option.id);
                            const isSelected = selectedUpgrades[category] === option.id;
                            const isDisabled = status === 'lower';
                            const isIncluded = status === 'included';

                            return (
                              <div
                                key={option.id}
                                onClick={() => !isDisabled && !isIncluded && handleUpgradeSelect(category, option.id)}
                                className={`
                                    relative p-4 rounded-xl border transition-all duration-200 
                                    ${isDisabled ? 'opacity-40 cursor-not-allowed bg-black/40 border-white/5' :
                                    isIncluded ? 'cursor-default bg-white/5 border-white/10' :
                                      isSelected ? 'cursor-pointer bg-yellow-500/20 border-yellow-500/50' :
                                        'cursor-pointer bg-white/5 border-white/5 hover:bg-white/10'}
                                `}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className={`text-xl font-bold ${isSelected || isIncluded ? 'text-white' : 'text-white/80'}`}>{option.name}</h4>
                                  {isSelected && !isIncluded && <CheckCircle className="w-6 h-6 text-yellow-500" />}
                                  {isIncluded && <BadgeCheck className="w-6 h-6 text-white/60" />}
                                </div>
                                <p className="text-white/60 text-base mb-4 h-12">{option.description}</p>
                                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                  <span className={`font-mono text-base font-bold ${isIncluded ? 'text-green-400' : isSelected ? 'text-yellow-400' : 'text-zinc-500'}`}>
                                    {isIncluded ? 'Included' : isDisabled ? 'Not Available' : isSelected ? 'Selected' : 'Select'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProceed}
              className="px-12 py-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-lg tracking-wide shadow-2xl flex items-center gap-3"
            >
              Proceed to Checkout
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

