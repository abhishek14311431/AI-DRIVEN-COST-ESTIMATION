import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Home, Building, Building2, Sparkles, CheckCircle, TrendingUp, Star } from 'lucide-react';
import { useState } from 'react';

export default function FloorPlanScreen({ onBack, selectedData, onNext }) {
  const [selectedFloors, setSelectedFloors] = useState(() => {
    const f = selectedData?.floors;
    if (!f) return null;
    if (typeof f === 'number') return 'custom';
    if (!['g+1', 'g+2', 'g+3', 'duplex', 'triplex', 'custom'].includes(String(f).toLowerCase())) return 'custom';
    return String(f).toLowerCase();
  });
  const [customFloors, setCustomFloors] = useState(() => {
    const f = selectedData?.floors;
    if (!f) return '';
    if (typeof f === 'number') return String(f);
    if (!['g+1', 'g+2', 'g+3', 'duplex', 'triplex', 'custom'].includes(String(f).toLowerCase())) return String(f);
    return '';
  });
  const [selectedPlan, setSelectedPlan] = useState(selectedData?.plan || null);
  const [showUpgradeOptions, setShowUpgradeOptions] = useState(false);

  const getFloorOptions = () => {
    if (selectedData?.projectType === 'rental-homes') {
      return [
        { id: 'g+1', name: 'G+1', description: 'Ground + 1 Floor (Rental)' },
        { id: 'g+2', name: 'G+2', description: 'Ground + 2 Floors (Rental)' },
        { id: 'g+3', name: 'G+3', description: 'Ground + 3 Floors (Rental)' },
        { id: 'custom', name: 'Custom', description: 'Enter custom floors' }
      ];
    }
    return [
      { id: 'duplex', name: 'G+1 as Duplex', description: 'Duplex Style' },
      { id: 'triplex', name: 'G+2 as Triplex', description: 'Triplex Style' },
      { id: 'custom', name: 'Custom', description: 'Enter custom floors' }
    ];
  };

  const floorOptions = getFloorOptions();

  const planOptions = [
    {
      id: 'base',
      name: 'Base',
      description: 'Entry Level Construction',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400&auto=format&fit=crop',
      icon: Home,
      materials: {
        flooring: 'Vitrified tiles (standard quality)',
        walls: 'Standard interior emulsion, Standard exterior paint',
        ceiling: 'Basic Ceiling'
      }
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Improved Durability & Finish',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop',
      icon: Building,
      materials: {
        flooring: 'Granite flooring (living areas), Better bathroom tiles',
        walls: 'Premium emulsion paint, Better exterior weather coat',
        ceiling: 'POP Ceiling'
      }
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'High-End Finish',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop',
      icon: Sparkles,
      materials: {
        flooring: 'Marble flooring, Designer bathroom tiles',
        walls: 'Texture wall finishes, Premium exterior coating',
        ceiling: 'False ceiling with cove lighting'
      }
    },
    {
      id: 'luxury',
      name: 'Luxury',
      description: 'High-End Architectural Finish',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=400&auto=format&fit=crop',
      icon: Building2,
      materials: {
        flooring: 'Italian marble, Premium natural stone',
        walls: 'Designer wall textures, Imported paints',
        ceiling: 'Detailed false ceiling'
      }
    }
  ];

  const handleFloorSelect = (floorId) => {
    setSelectedFloors(floorId);
    if (floorId !== 'custom') {
      setCustomFloors('');
    }
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleNext = () => {
    const floorData = selectedFloors === 'custom' ? customFloors : selectedFloors;
    onNext({ ...selectedData, floors: floorData, plan: selectedPlan });
  };

  const canProceed = selectedFloors && selectedPlan && (selectedFloors !== 'custom' || customFloors);

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden p-6"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Construction Site Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1503387837-b154d5074bd2?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/65 to-black/75" />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 50%, rgba(255, 165, 0, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 70%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <motion.button
            onClick={onBack}
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
            Go Back
          </motion.button>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white text-center"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              textShadow: '0 0 30px rgba(255, 215, 0, 0.3), 0 4px 20px rgba(0, 0, 0, 0.8)',
            }}
          >
            Floor & Plan Selection
          </motion.h1>

          <div className="w-32"></div> {/* Spacer */}
        </motion.div>

        {/* Glassmorphic Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="p-12 rounded-[3rem] overflow-hidden"
          style={{
            background: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 0 60px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Selected Details Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h3
              className="text-3xl font-bold text-white text-center mb-8"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                textShadow: '0 2px 15px rgba(0, 0, 0, 0.8)',
              }}
            >
              Your Selections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="p-6 rounded-2xl text-center"
                style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                }}
              >
                <h4 className="text-xl font-bold text-white mb-2">Project</h4>
                <p className="text-white/90 text-lg">{selectedData?.projectType === 'dream-house' ? 'Dream House' : selectedData?.projectType}</p>
              </motion.div>
              <motion.div
                className="p-6 rounded-2xl text-center"
                style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                }}
              >
                <h4 className="text-xl font-bold text-white mb-2">Plot Size</h4>
                <p className="text-white/90 text-lg">{selectedData?.plotSize === 'half-site' ? 'Half Site' : selectedData?.plotSize === 'full-site' ? 'Full Site' : 'Double Site'}</p>
              </motion.div>
              <motion.div
                className="p-6 rounded-2xl text-center"
                style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                }}
              >
                <h4 className="text-xl font-bold text-white mb-2">Dimensions</h4>
                <p className="text-white/90 text-lg">{selectedData?.dimensions}</p>
              </motion.div>
            </div>
            <div className="mt-6 p-6 rounded-2xl text-center"
              style={{
                background: 'rgba(255, 215, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 215, 0, 0.3)',
              }}
            >
              <h4 className="text-2xl font-bold text-white mb-2">Additional Details</h4>
              <div className="flex flex-wrap justify-center gap-6 text-white/90 text-lg">
                {selectedData?.answers?.['family-size'] && (
                  <span>Family Size: <strong>{selectedData.answers['family-size']}</strong></span>
                )}
                {selectedData?.answers?.['children'] && selectedData.answers['children'] !== '0' && (
                  <span>Children: <strong>{selectedData.answers['children']}</strong></span>
                )}
                {selectedData?.answers?.['bedrooms'] && (
                  <span>Bedrooms: <strong>{selectedData.answers['bedrooms']}</strong></span>
                )}
                {selectedData?.answers?.['grandparents'] && selectedData.answers['grandparents'] !== 'No' && (
                  <span>Grandparents: <strong>{selectedData.answers['grandparents']}</strong></span>
                )}
                {selectedData?.answers?.['lift'] && selectedData.answers['lift'] !== 'No' && (
                  <span>Lift: <strong>{selectedData.answers['lift']}</strong></span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Floor Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h3
              className="text-3xl font-bold text-white text-center mb-8"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                textShadow: '0 2px 15px rgba(0, 0, 0, 0.8)',
              }}
            >
              How many floors do you require?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              {floorOptions.map((floor, index) => (
                <motion.div
                  key={floor.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFloorSelect(floor.id)}
                  className={`cursor-pointer p-6 rounded-xl text-center ${selectedFloors === floor.id ? 'ring-4 ring-yellow-400' : ''}`}
                  style={{
                    background: selectedFloors === floor.id
                      ? 'rgba(255, 215, 0, 0.2)'
                      : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(15px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: selectedFloors === floor.id
                      ? '0 0 30px rgba(255, 215, 0, 0.4)'
                      : '0 8px 24px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <h4 className="text-xl font-bold text-white mb-2">{floor.name}</h4>
                  <p className="text-white/80 text-lg">{floor.description}</p>
                </motion.div>
              ))}
            </div>
            {selectedFloors === 'custom' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <input
                  type="number"
                  placeholder="Enter number of floors"
                  value={customFloors}
                  onChange={(e) => setCustomFloors(e.target.value)}
                  className="px-6 py-3 rounded-xl text-white text-center font-semibold"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(15px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    minWidth: '200px',
                  }}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Plan Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
          >
            <h3
              className="text-3xl font-bold text-white text-center mb-8"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                textShadow: '0 2px 15px rgba(0, 0, 0, 0.8)',
              }}
            >
              What's your plan?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {planOptions.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`cursor-pointer p-6 rounded-xl text-center ${selectedPlan === plan.id ? 'ring-4 ring-yellow-400' : ''}`}
                  style={{
                    background: selectedPlan === plan.id
                      ? 'rgba(255, 215, 0, 0.2)'
                      : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(15px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: selectedPlan === plan.id
                      ? '0 0 30px rgba(255, 215, 0, 0.4)'
                      : '0 8px 24px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <div className="mb-4">
                    <img src={plan.image} alt={plan.name} className="w-full h-32 object-cover rounded-lg" />
                  </div>
                  <plan.icon className="w-8 h-8 text-white mx-auto mb-2" />
                  <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                  <p className="text-white/80 text-lg">{plan.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>



          {/* Next Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-12 py-4 rounded-xl text-white font-semibold text-xl ${canProceed ? '' : 'opacity-50 cursor-not-allowed'}`}
              style={{
                background: canProceed
                  ? 'rgba(255, 215, 0, 0.8)'
                  : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: canProceed
                  ? '0 0 30px rgba(255, 215, 0, 0.4)'
                  : '0 8px 24px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Next
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
