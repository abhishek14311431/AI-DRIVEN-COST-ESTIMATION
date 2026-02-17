import { motion } from 'framer-motion';
import { ArrowLeft, Home, Building, Building2, Sparkles, PaintBucket, Sofa, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProjectScreen({
  onBack,
  onAdditionalQuestions,
  selectedProject,
  setSelectedProject,
  selectedPlotSize,
  setSelectedPlotSize,
  selectedDimension,
  setSelectedDimension,
  currentStep,
  setCurrentStep,
  customLength,
  setCustomLength,
  customWidth,
  setCustomWidth,
  showDimensions,
  setShowDimensions
}) {
  const [showPlotOptions, setShowPlotOptions] = useState(false);
  const [showCustomInputs, setShowCustomInputs] = useState(false);


  const projectBackground = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop';
  const dreamHouseBackground = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop';
  const rentalBackground = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop';

  const getBackground = () => {
    if (selectedProject === 'dream-house') return dreamHouseBackground;
    if (selectedProject === 'rental-homes') return rentalBackground;
    return projectBackground;
  };

  const projectTypes = [
    {
      id: 'dream-house',
      name: 'Dream House',
      icon: Sparkles,
      description: 'Luxury custom-designed residence',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop',
      gradient: 'from-amber-400 to-amber-600',
      border: 'border-amber-400'
    },
    {
      id: 'rental-homes',
      name: 'Rental Homes',
      icon: Building,
      description: 'Multi-unit investment properties',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
      gradient: 'from-blue-400 to-blue-600',
      border: 'border-blue-400'
    },
    {
      id: 'commercial',
      name: 'Commercial',
      icon: Building2,
      description: 'Office spaces and retail buildings',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      gradient: 'from-orange-400 to-orange-600',
      border: 'border-orange-400'
    },
    {
      id: 'villa',
      name: 'Villa',
      icon: Home,
      description: 'Premium standalone luxury residence',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
      gradient: 'from-emerald-400 to-emerald-600',
      border: 'border-emerald-400'
    },
    {
      id: 'interior',
      name: 'Interior',
      icon: Sofa,
      description: 'Interior design and furnishing',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
      gradient: 'from-rose-400 to-rose-600',
      border: 'border-rose-400'
    },
    {
      id: 'exterior',
      name: 'Exterior',
      icon: PaintBucket,
      description: 'Facade and outdoor improvements',
      image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=800&auto=format&fit=crop',
      gradient: 'from-cyan-400 to-cyan-600',
      border: 'border-cyan-400'
    }
  ];

  const plotSizes = [
    { id: 'half-site', name: 'Half Site', description: 'Small Plot (15x30 / 15x40)' },
    { id: 'full-site', name: 'Full Site', description: 'Standard Plot (30x40 / 30x50)' },
    { id: 'double-site', name: 'Double Site', description: 'Large Plot (60x40+)' }
  ];

  const fullSiteDimensions = [
    { id: '30x40', name: '30 x 40', area: '1200 sq ft' },
    { id: '30x50', name: '30 x 50', area: '1500 sq ft' },
    { id: '40x60', name: '40 x 60', area: '2400 sq ft' },
    { id: 'custom', name: 'Custom', area: 'Enter Size' }
  ];

  const halfSiteDimensions = [
    { id: '15x30', name: '15 x 30', area: '450 sq ft' },
    { id: '15x40', name: '15 x 40', area: '600 sq ft' },
    { id: '20x30', name: '20 x 30', area: '600 sq ft' },
    { id: 'custom', name: 'Custom', area: 'Enter Size' }
  ];

  const doubleSiteDimensions = [
    { id: '60x40', name: '60 x 40', area: '2400 sq ft' },
    { id: '60x50', name: '60 x 50', area: '3000 sq ft' },
    { id: '80x60', name: '80 x 60', area: '4800 sq ft' },
    { id: 'custom', name: 'Custom', area: 'Enter Size' }
  ];


  useEffect(() => {
    if (currentStep === 'plot-selection') {
      setShowPlotOptions(true);
      setShowDimensions(false);
      setShowCustomInputs(false);
    } else if (currentStep === 'dimension-selection') {
      setShowPlotOptions(true);
      setShowDimensions(true);
      setShowCustomInputs(selectedDimension === 'custom');
    } else {

      setShowPlotOptions(false);
      setShowDimensions(false);
      setShowCustomInputs(false);
    }
  }, [currentStep, selectedDimension, setShowDimensions]);

  const handleProjectClick = (projectId) => {
    setSelectedProject(projectId);
    setCurrentStep('plot-selection');
    setSelectedPlotSize(null); // Reset plot size on new project
  };

  const handlePlotSizeClick = (plotId) => {
    setSelectedPlotSize(plotId);
    setCurrentStep('dimension-selection');

  };

  const handleDimensionClick = (dimensionId) => {
    setSelectedDimension(dimensionId);
    if (dimensionId === 'custom') {
      setShowCustomInputs(true);
    } else {
      setShowCustomInputs(false);
      const data = {
        projectType: selectedProject,
        plotSize: selectedPlotSize,
        dimensions: dimensionId
      };
      onAdditionalQuestions(data);
    }
  };

  const handleCustomSubmit = () => {
    if (customLength && customWidth) {
      const dim = `${customLength}x${customWidth}`;
      const data = {
        projectType: selectedProject,
        plotSize: selectedPlotSize,
        dimensions: dim
      };
      onAdditionalQuestions(data);
    }
  };

  const handleBack = () => {
    if (currentStep === 'dimension-selection') {
      setCurrentStep('plot-selection');
      setSelectedDimension(null);
      setSelectedPlotSize(null);
      setShowCustomInputs(false);
    } else if (currentStep === 'plot-selection') {
      setCurrentStep('project-selection');
      setSelectedProject(null);
      setSelectedPlotSize(null);
    } else {
      onBack();
    }
  };

  const getFilteredPlotSizes = () => {
    if (selectedProject === 'dream-house') {
      return plotSizes.filter(p => p.id !== 'half-site');
    }
    return plotSizes;
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
          backgroundImage: `url('${getBackground()}')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 fixed" />

      <div className="relative z-10 w-full max-w-7xl mx-auto pb-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 pt-4"
        >
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-white/80 font-medium hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-md mb-4 md:mb-0"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </motion.button>

          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-center drop-shadow-2xl font-serif">
            {selectedProject ? (selectedProject === 'dream-house' ? 'Dream House Project' : 'Rental Project') : 'Start Your Project'}
          </h1>
          <div className="w-24 hidden md:block" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8 md:p-14 rounded-[3rem] relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Project Type Grid */}
          {!selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projectTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProjectClick(type.id)}
                  className={`group cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-black/20 hover:border-${type.border.split('-')[1]}/50 transition-all duration-300 relative`}
                >
                  {/* Image */}
                  <div className="h-48 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 transition-opacity duration-300`} />
                    <img src={type.image} alt={type.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />

                    <div className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white">
                      <type.icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-8 relative">
                    <h3 className={`text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${type.gradient}`}>{type.name}</h3>
                    <p className="text-white/70 text-lg leading-relaxed">{type.description}</p>

                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${type.gradient} w-0 group-hover:w-full transition-all duration-500`} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Flow Content */}
          {selectedProject && (
            <div className="space-y-8">
              {/* Selection Snapshot - Only visible if we have selected something */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-1 bg-black/20 rounded-2xl border border-white/5">
                <div className="p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Project</p>
                  <p className="text-lg font-bold text-white tracking-wide">{selectedProject === 'dream-house' ? 'Dream House' : 'Rental'}</p>
                </div>
                {selectedPlotSize && (
                  <div className="p-4 rounded-xl hover:bg-white/5 transition-colors">
                    <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Plot Size</p>
                    <p className="text-lg font-bold text-white tracking-wide">{plotSizes.find(p => p.id === selectedPlotSize)?.name}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Plot Selection Column */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`space-y-6 ${!showPlotOptions ? 'opacity-50 pointer-events-none blur-sm' : ''}`}
                >
                  <h2 className="text-4xl font-bold text-white flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-lg">1</div>
                    Select Plot Size
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    {getFilteredPlotSizes().map((plot) => (
                      <motion.div
                        key={plot.id}
                        onClick={() => handlePlotSizeClick(plot.id)}
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-2xl cursor-pointer border transition-all ${selectedPlotSize === plot.id ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-3xl font-bold text-white mb-1">{plot.name}</h3>
                            <p className="text-white/60 text-lg">{plot.description}</p>
                          </div>
                          {selectedPlotSize === plot.id && <CheckCircle className="w-6 h-6 text-blue-400" />}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Dimension Selection Column */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`space-y-6 ${!showDimensions ? 'opacity-30 pointer-events-none' : ''}`}
                >
                  <h2 className="text-4xl font-bold text-white flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-lg">2</div>
                    Select Dimensions
                  </h2>

                  {showDimensions && (
                    <div className="grid grid-cols-2 gap-4">
                      {(() => {
                        if (selectedPlotSize === 'full-site') return fullSiteDimensions;
                        if (selectedPlotSize === 'half-site') return halfSiteDimensions;
                        return doubleSiteDimensions;
                      })().map((dim) => (
                        <motion.div
                          key={dim.id}
                          onClick={() => handleDimensionClick(dim.id)}
                          whileHover={{ scale: 1.05 }}
                          className={`p-4 rounded-xl cursor-pointer border transition-all text-center ${selectedDimension === dim.id ? 'bg-white/20 border-white/40' : 'bg-black/20 border-white/5 hover:bg-white/10'}`}
                        >
                          <h4 className="text-2xl font-bold text-white mb-1">{dim.name}</h4>
                          <p className="text-white/60 text-lg">{dim.area}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {showCustomInputs && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-6 rounded-2xl bg-white/5 border border-white/10 mt-4 overflow-hidden"
                    >
                      <h4 className="text-white font-bold mb-4">Enter Custom Dimensions (ft)</h4>
                      <div className="flex gap-4 items-center">
                        <input
                          type="number"
                          placeholder="L"
                          value={customLength}
                          onChange={(e) => setCustomLength(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-center focus:border-white/30 outline-none transition-colors"
                        />
                        <span className="text-white/50">x</span>
                        <input
                          type="number"
                          placeholder="W"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-center focus:border-white/30 outline-none transition-colors"
                        />
                      </div>
                      <button
                        onClick={handleCustomSubmit}
                        disabled={!customLength || !customWidth}
                        className={`w-full mt-4 py-3 font-bold rounded-lg transition-all ${customLength && customWidth ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                      >
                        Proceed
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
