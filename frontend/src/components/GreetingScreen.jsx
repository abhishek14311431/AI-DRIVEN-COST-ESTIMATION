import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5
    }
  }
};

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

export default function GreetingScreen({ userName = "Abhishek", onYes, onNo }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {

      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-black font-sans selection:bg-amber-500/30">

      {/* 1. Cinematic Background Layer */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2666&auto=format&fit=crop)',
            filter: 'brightness(0.4) saturate(1.2)'
          }}
        />
      </motion.div>

      {/* 2. Abstract Geometric Overlay (The "Tech" Feel) */}
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay pointer-events-none">
        <svg className="w-full h-full" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* 3. Vignette & Gradation */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 z-0" />

      {/* 4. Mouse Follower SpotLight (Subtle) */}
      <div
        className="absolute pointer-events-none z-10 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen transition-transform duration-100 ease-out"
        style={{ left: '50%', top: '50%', transform: `translate(calc(-50% + ${mousePosition.x * 2}px), calc(-50% + ${mousePosition.y * 2}px))` }}
      />


      {/* Main Content Interface */}
      <motion.div
        className="relative z-20 w-full max-w-7xl px-8 md:px-12 flex flex-col justify-center h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Top Bar / Brand */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-6 mb-24 group"
        >
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group-hover:border-amber-500/30 transition-all duration-500" />
            <svg className="w-10 h-10 relative z-10" viewBox="0 0 100 100">
              <path d="M25 20 v60 h20 M45 80 l15-60 15 60 M50 60 h20" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-sm uppercase tracking-[0.4em] leading-none mb-1 text-shadow">Architecture</span>
            <span className="text-amber-500/80 font-bold text-[9px] uppercase tracking-[0.3em]">Cost Intelligence System</span>
          </div>
        </motion.div>


        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-16">

          {/* Left Column: Typography Greeting */}
          <div className="flex-1 text-left">
            <motion.div variants={itemVariants} className="overflow-hidden mb-6">
              <h2 className="text-3xl md:text-4xl font-light text-white/50 tracking-tight">
                {(() => {
                  const hour = new Date().getHours();
                  if (hour < 12) return "Good Morning,";
                  if (hour < 18) return "Good Afternoon,";
                  return "Good Evening,";
                })()}
              </h2>
            </motion.div>

            <motion.div variants={itemVariants} className="relative mb-12">
              <h1
                className="text-[5.5rem] md:text-[8.5rem] font-black text-white leading-[0.8] tracking-tighter"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  textShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
                }}
              >
                {userName.toUpperCase()}
              </h1>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%', maxWidth: '400px' }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-[2px] bg-gradient-to-r from-amber-500 via-amber-500/50 to-transparent mt-8"
              />
            </motion.div>

            <motion.p variants={itemVariants} className="text-white/40 text-sm md:text-base max-w-sm leading-relaxed uppercase tracking-[0.2em] font-medium">
              Precision Audit Engine <br />
              <span className="text-white/80 font-black">Architecting Future Investments.</span>
            </motion.p>
          </div>


          {/* Right Column: Interaction Cards */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6 w-full md:w-[400px]">

            {/* Card 1: Start Project (Primary) */}
            <button
              onClick={onYes}
              className="group relative w-full h-48 bg-black/40 backdrop-blur-xl border border-white/20 hover:border-amber-500/80 rounded-none md:rounded-tr-[3rem] transition-all duration-500 overflow-hidden text-left p-8 shadow-2xl"
            >
              {/* Hover Fill Effect */}
              <div className="absolute inset-0 bg-amber-500/90 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />

              <div className="relative z-10 flex flex-col justify-between h-full group-hover:text-black">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-70 group-hover:opacity-100 mix-blend-hard-light text-white group-hover:text-black">01. Initialize</span>
                  <Zap className="w-6 h-6 text-amber-500 group-hover:text-black transition-colors" />
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-white group-hover:text-black mb-1 font-serif">New Project</h3>
                  <div className="flex items-center gap-2 text-sm text-white/70 group-hover:text-black/80">
                    <span>Launch Estimator</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </button>


            {/* Card 2: Archives (Secondary) */}
            <button
              onClick={onNo}
              className="group relative w-full h-32 bg-black/30 backdrop-blur-lg border border-white/20 hover:bg-white/10 transition-all duration-300 rounded-bl-[3rem] overflow-hidden text-left p-8 flex items-center justify-between shadow-xl"
            >
              <div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-2 block">02. Database</span>
                <h3 className="text-xl font-bold text-white group-hover:tracking-wide transition-all">View Archives</h3>
              </div>

              <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <ChevronRight className="w-5 h-5 text-white group-hover:text-black" />
              </div>
            </button>

          </motion.div>

        </div>


      </motion.div>
    </div>
  );
}
