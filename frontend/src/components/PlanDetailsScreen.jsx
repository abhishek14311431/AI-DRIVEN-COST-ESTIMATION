import { motion } from 'framer-motion';
import { ArrowLeft, Home, Building, Building2, Sparkles, CheckCircle, Star, BadgeCheck } from 'lucide-react';
import { useState } from 'react';

export default function PlanDetailsScreen({ onBack, selectedData, onProceed }) {
  const [selectedTier] = useState(selectedData?.plan || null);


  const tierDetails = {
    base: {
      name: 'Base',
      icon: Home,
      description: 'Entry Level Construction',
      color: 'from-gray-400 to-gray-600',
      accentColor: 'text-gray-400',
      materials: {
        flooring: 'Vitrified tiles (standard quality)',
        stairs: 'Granite stairs (standard polish)',
        walls: 'Standard interior emulsion, Standard exterior paint',
        ceiling: 'Basic Ceiling',
        fixtures: 'Standard CP fittings, Basic sanitary ware',
        electrical: 'Standard wiring, Basic switches & sockets',
        plumbing: 'Standard plumbing',
        elevation: 'Simple plaster finish, Basic front design',
        utilities: 'Water sump, Septic tank'
      },
      features: [
        'Standard RCC structure',
        'Standard reinforcement',
        'Normal slab thickness',
        'Flush doors',
        'Standard aluminum windows'
      ],
      upgrades: ['classic', 'premium', 'luxury']
    },
    classic: {
      name: 'Classic',
      icon: Building,
      description: 'Improved Durability & Finish',
      color: 'from-green-400 to-green-600',
      accentColor: 'text-green-400',
      materials: {
        flooring: 'Granite flooring (living areas)',
        walls: 'Premium emulsion paint',
        ceiling: 'POP Ceiling',
        fixtures: 'Branded fittings (Jaguar / equivalent)',
        electrical: 'Branded switches (Anchor / Legrand type)',
        plumbing: 'Quality Plumbing',
        elevation: 'Mild architectural detailing',
        utilities: 'Generator Backup Points'
      },
      features: [
        'RCC Structure with Better Quality',
        'Advanced Waterproofing',
        'Semi-solid wood doors',
        'Better aluminum / UPVC windows'
      ],
      upgrades: ['premium', 'luxury']
    },
    premium: {
      name: 'Premium',
      icon: Sparkles,
      description: 'High-End Finish',
      color: 'from-purple-400 to-purple-600',
      accentColor: 'text-purple-400',
      materials: {
        flooring: 'Marble flooring, Designer tiles',
        walls: 'Texture wall finishes, Premium exterior',
        ceiling: 'False ceiling with cove lighting',
        fixtures: 'Premium branded fittings, Glass partitions',
        electrical: 'Modular switches, Decorative lighting',
        plumbing: 'Premium Plumbing',
        elevation: 'Stone cladding, Glass railing',
        utilities: 'Solar Panel & Security Points'
      },
      features: [
        'Premium RCC Structure',
        'Complete Waterproofing System',
        'Teak finish doors',
        'Premium UPVC / sliding systems'
      ],
      upgrades: ['luxury']
    },
    luxury: {
      name: 'Luxury',
      icon: Building2,
      description: 'High-End Architectural Finish',
      color: 'from-yellow-400 to-yellow-600',
      accentColor: 'text-yellow-400',
      materials: {
        flooring: 'Italian marble, Premium stone',
        walls: 'Designer wall textures, Imported paints',
        ceiling: 'Detailed false ceiling',
        fixtures: 'Imported sanitary fittings',
        electrical: 'Smart lighting, Automation-ready',
        plumbing: 'Premium Plumbing',
        elevation: 'Architectural elevation, Designer lighting',
        interior: 'Detailed false ceiling, Premium railing'
      },
      features: [
        'Solid teak doors & Designer handles',
        'Premium sliding glass systems',
        'Designer Modular Kitchen',
        'Smart Home Automation Ready'
      ],
      upgrades: []
    }
  };

  const handleProceed = () => {
    if (selectedTier) {
      onProceed({ ...selectedData, plan: selectedTier, upgrades: selectedData?.upgrades || {} });
    }
  };

  const currentTier = tierDetails[selectedTier] || tierDetails.base;

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
          backgroundImage: `url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 fixed" />

      <div className="relative z-10 w-full max-w-7xl mx-auto pb-10 px-4 sm:px-6 lg:px-8">
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

          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-center drop-shadow-2xl font-serif">
            Review Your Plan
          </h1>
          <div className="w-24 hidden md:block" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-10 md:p-16 rounded-[4rem] relative overflow-hidden"
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
              <div className="p-6 rounded-xl hover:bg-white/5 transition-colors">
                <p className="text-sm text-white/50 uppercase tracking-widest font-bold mb-2">Project</p>
                <p className="text-2xl font-bold text-white tracking-wide">{selectedData?.projectType === 'dream-house' ? 'Dream House' : 'Rental'}</p>
              </div>
              <div className="p-6 rounded-xl hover:bg-white/5 transition-colors">
                <p className="text-sm text-white/50 uppercase tracking-widest font-bold mb-2">Plot & Dim</p>
                <p className="text-2xl font-bold text-white tracking-wide uppercase">{selectedData?.plotSize?.replace('-', ' ')} | {selectedData?.dimensions}</p>
              </div>
              <div className="p-6 rounded-xl hover:bg-white/5 transition-colors">
                <p className="text-sm text-white/50 uppercase tracking-widest font-bold mb-2">Floors</p>
                <p className="text-2xl font-bold text-white tracking-wide capitalize">{selectedData?.floors === 'custom' ? 'Custom' : selectedData?.floors?.replace ? selectedData.floors.replace('-', ' ') : selectedData.floors}</p>
              </div>
              <div className="p-6 rounded-xl hover:bg-white/5 transition-colors">
                <p className="text-sm text-white/50 uppercase tracking-widest font-bold mb-2">Plan</p>
                <div className="flex items-center gap-2">
                  <currentTier.icon className={`w-6 h-6 ${currentTier.accentColor}`} />
                  <p className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${currentTier.color}`}>{currentTier.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Details Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Column: Materials */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-3xl bg-black/20 border border-white/5"
            >
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Star className={`w-8 h-8 ${currentTier.accentColor}`} />
                Materials & Finishes
              </h3>
              <p className="text-white/80 text-xl mb-8">{currentTier.description}</p>
              <div className="space-y-4">
                {Object.entries(currentTier.materials).map(([key, value], index) => (
                  <div key={key} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className={`mt-2 w-2 h-2 rounded-full bg-gradient-to-r ${currentTier.color} flex-shrink-0 group-hover:scale-150 transition-transform`} />
                    <div>
                      <span className="text-white/60 text-sm uppercase tracking-wider font-bold block mb-1">{key}</span>
                      <p className="text-white text-lg leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Features & Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-8"
            >
              <div className="p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 h-full">
                <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                  <BadgeCheck className={`w-8 h-8 ${currentTier.accentColor}`} />
                  Key Features
                </h3>
                <p className="text-white/80 text-xl mb-8">Highlights of this plan's construction and design.</p>
                <div className="grid grid-cols-1 gap-3">
                  {currentTier.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-center gap-4 p-5 rounded-xl border border-white/5 bg-black/20`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <CheckCircle className={`w-6 h-6 ${currentTier.accentColor} flex-shrink-0`} />
                      <span className="text-white/90 font-medium text-lg">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                <p className="text-center text-white/50 text-sm">
                  This plan includes all standard safety features, electrical grounding, and conforms to basic structural codes.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Proceed Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProceed}
              disabled={!selectedTier}
              className={`px-16 py-5 rounded-2xl text-black font-bold text-lg tracking-wide shadow-2xl transition-all duration-300 flex items-center gap-3 ${selectedTier ? `bg-gradient-to-r ${currentTier.color.replace('text', 'from').replace('400', '200').replace('600', '400')}` : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
            >
              {selectedTier ? 'Customize Upgrades' : 'Select a Plan'}
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
