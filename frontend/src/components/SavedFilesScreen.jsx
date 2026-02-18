import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FolderOpen, Clock, MoreVertical, Edit2, Trash2, Download, Eye, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

export default function SavedFilesScreen({ onBack, onViewProject }) {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [savedProjects, setSavedProjects] = useState([]);

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');

    setSavedProjects(projects.sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at)));
  }, []);

  const getGradient = (type) => {
    switch (type) {
      case 'dream-house': return 'from-yellow-400 to-orange-500';
      case 'rental-homes': return 'from-blue-400 to-indigo-500';
      case 'commercial': return 'from-emerald-400 to-teal-500';
      case 'villa': return 'from-violet-400 to-purple-600';
      case 'interior': return 'from-rose-400 to-pink-500';
      case 'exterior': return 'from-cyan-400 to-blue-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const [renamingId, setRenamingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    const updated = savedProjects.filter(p => p.id !== id);
    localStorage.setItem('savedProjects', JSON.stringify(updated));
    setSavedProjects(updated);
    setActiveMenu(null);
  };

  const handleRename = (id, e) => {
    if (e) e.stopPropagation();
    const project = savedProjects.find(p => p.id === id);
    setRenamingId(id);
    setNewName(project.client_name || project.project_type);
    setActiveMenu(null);
  };

  const saveRename = (e) => {
    if (e) e.stopPropagation();
    const updated = savedProjects.map(p => {
      if (p.id === renamingId) {
        return { ...p, client_name: newName };
      }
      return p;
    });
    localStorage.setItem('savedProjects', JSON.stringify(updated));
    setSavedProjects(updated);
    setRenamingId(null);
  };

  const handleDownload = async (project, e) => {
    if (e) e.stopPropagation();
    try {
      const response = await fetch(`${API_BASE_URL}/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = project.client_name ? `Cost_Audit_${project.client_name}.pdf` : `Cost_Audit_${project.project_id}.pdf`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error("Failed to generate PDF");
      }
    } catch (err) {
      console.error("PDF Download Error:", err);
      alert("Error: Could not generate PDF. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 fixed" />

      <div className="relative z-10 w-full max-w-[90%] mx-auto pb-10">
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

          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-100 to-cyan-200 text-center drop-shadow-2xl font-serif">
            Project Archives
          </h1>
          <div className="w-24 hidden md:block" />
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {savedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => onViewProject(project)}
              className="group cursor-pointer relative overflow-hidden rounded-[2rem] border transition-all duration-300 hover:-translate-y-2"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(30px)',
                borderColor: hoveredProject === project.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                boxShadow: hoveredProject === project.id ? '0 20px 40px -10px rgba(0,0,0,0.5)' : 'none'
              }}
            >
              {/* Gradient Accent */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getGradient(project.project_type)} opacity-50 group-hover:opacity-100 transition-opacity`} />

              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getGradient(project.project_type)} shadow-lg flex items-center justify-center p-2`}>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <path d="M25 20 v60 h20 M45 80 l15-60 15 60 M50 60 h20" fill="none" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60 font-black tracking-[0.2em] uppercase">
                    {project.plan || 'Classic'}
                  </div>
                </div>

                {renamingId === project.id ? (
                  <div className="mb-2 flex items-center gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename(e);
                        if (e.key === 'Escape') setRenamingId(null);
                      }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-white/30"
                    />
                    <button
                      onClick={saveRename}
                      className="p-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500 hover:text-white transition-all"
                      title="Save"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenamingId(null);
                      }}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all"
                      title="Cancel"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1 capitalize">{project.client_name || project.project_type?.replace('-', ' ')}</h3>
                )}
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {formatDate(project.saved_at)}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 transition-all group-hover:bg-white/10">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/30 uppercase font-black tracking-widest leading-none mb-1">Total Estimation</span>
                      <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        ₹{project.total_cost?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[8px] text-white/30 uppercase font-black tracking-widest block mb-1">Dimensions</span>
                      <span className="text-sm font-bold text-white/80">{project.plot_size}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[8px] text-white/30 uppercase font-black tracking-widest block mb-1">Floors</span>
                      <span className="text-sm font-bold text-white/80">{project.floors}</span>
                    </div>
                  </div>
                </div>

                {/* Action Overlay */}
                <AnimatePresence>
                  {hoveredProject === project.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        {/* View Button */}
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 1)', color: 'black' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); onViewProject(project); }}
                          className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white transition-all shadow-xl"
                        >
                          <Eye className="w-6 h-6" />
                        </motion.button>

                        {/* Download Button */}
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 1)', color: 'white' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDownload(project, e)}
                          className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 transition-all shadow-xl"
                        >
                          <Download className="w-6 h-6" />
                        </motion.button>

                        {/* More/Options Button */}
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === project.id ? null : project.id); }}
                            className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white transition-all shadow-xl"
                          >
                            <MoreVertical className="w-6 h-6" />
                          </motion.button>

                          {/* Options Menu */}
                          <AnimatePresence>
                            {activeMenu === project.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute bottom-full right-0 mb-4 w-48 rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl z-50 overflow-hidden"
                              >
                                <button
                                  onClick={(e) => handleRename(project.id, e)}
                                  className="w-full flex items-center gap-3 px-6 py-4 text-sm text-white/70 hover:bg-white/5 transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" /> Rename
                                </button>
                                <button
                                  onClick={(e) => handleDelete(project.id, e)}
                                  className="w-full flex items-center gap-3 px-6 py-4 text-sm text-red-400 hover:bg-white/5 transition-colors border-t border-white/5"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}

          {/* New Project Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onBack}
            className="group cursor-pointer rounded-[2rem] border border-white/10 border-dashed bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center min-h-[300px] gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-4xl text-white/20 font-light">+</span>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/80 transition-colors">Start New Project</p>
          </motion.div>
        </motion.div>

        {savedProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FolderOpen className="w-24 h-24 text-white/10 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No Saved Projects</h3>
            <p className="text-white/40">Start a new project to see it here!</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
