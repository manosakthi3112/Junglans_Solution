import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#A7F3D0]/60 px-6 md:px-12 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3.5 group">
          {/* Increased Light-Green Squirrel Logo Container */}
          <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] p-1.5 flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/20 overflow-hidden">
            <img
              src="/squirrel_logo.png"
              alt="Junglans Squirrel Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-2xl leading-none tracking-tight text-[#08090c] group-hover:text-[#10B981] transition-colors">
              Junglans
            </span>
            <span className="font-mono text-[9.5px] text-[#059669] mt-1 tracking-widest uppercase font-semibold">
              SOLUTIONS // 20 PORTFOLIO
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-slate-600 font-medium">
          <button onClick={() => handleNavClick('ecosystem')} className="hover:text-[#10B981] transition cursor-pointer">Ecosystem</button>
          <button onClick={() => handleNavClick('showcase')} className="hover:text-[#10B981] transition cursor-pointer flex items-center gap-1.5">
            Showcase
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          </button>
          <button onClick={() => handleNavClick('founder')} className="hover:text-[#10B981] transition cursor-pointer font-bold text-[#059669]">Founder</button>
          <button onClick={() => handleNavClick('capabilities')} className="hover:text-[#10B981] transition cursor-pointer">Capabilities</button>
          <button onClick={() => handleNavClick('enterprise')} className="hover:text-[#10B981] transition cursor-pointer">Enterprise</button>
        </div>

        <button 
          onClick={() => handleNavClick('enterprise')}
          className="font-mono text-xs bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 hover:-translate-y-0.5 cursor-pointer"
        >
          Contact Sales
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </nav>
  );
}
