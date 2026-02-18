import { motion } from 'framer-motion';
import { Loader2, Shield, Cpu, Zap } from 'lucide-react';
import { useEffect } from 'react';

export default function AnalysisLoadingScreen({ tier, onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 1000); // Reduced from 4000ms
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* High-End Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />

            <div className="z-10 text-center max-w-2xl px-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-12 relative inline-flex"
                >
                    <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full animate-pulse" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="relative"
                    >
                        <Loader2 className="w-24 h-24 text-blue-400 stroke-[1px]" />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-5xl font-black text-white uppercase tracking-[0.3em] mb-4 font-sansital-black">
                        ANALYSISING<span className="text-blue-400">...</span>
                    </h1>
                    <p className="text-blue-400/60 font-black uppercase tracking-[0.5em] text-sm mb-12">
                        Optimizing {tier} Specifications
                    </p>
                </motion.div>

                <div className="grid grid-cols-3 gap-8">
                    {[
                        { icon: Cpu, label: 'Compute Engine' },
                        { icon: Shield, label: 'Market Index' },
                        { icon: Zap, label: 'Dynamic Pricing' }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + (idx * 0.2) }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                <item.icon className="w-5 h-5 text-white/50" />
                            </div>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{item.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, ease: "easeInOut" }} // Reduced from 4s
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                />
            </div>
        </div>
    );
}
