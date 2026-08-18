import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isTeamPage = location.pathname === '/team';
  const isSecurityPage = location.pathname === '/security';
  const isBlogsPage = location.pathname.startsWith('/blog');

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#A7F3D0]/60 px-3 sm:px-6 md:px-12 py-2.5 sm:py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] p-1 sm:p-1.5 flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-105 transition-all duration-300 shadow-md shadow-emerald-500/20 overflow-hidden flex-shrink-0">
            <img
              src="/squirrel_logo.png"
              alt="Junglans Squirrel Logo"
              className="w-full h-full object-contain rounded-lg sm:rounded-xl"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg sm:text-2xl leading-none tracking-tight text-[#08090c] group-hover:text-[#10B981] transition-colors">
              Junglans
            </span>
            <span className="font-mono text-[7.5px] sm:text-[9.5px] text-[#059669] mt-0.5 sm:mt-1 tracking-wider sm:tracking-widest uppercase font-semibold">
              SOLUTIONS // PORTFOLIO
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-slate-600 font-medium">
          <button onClick={() => handleNavClick('ecosystem')} className="hover:text-[#10B981] transition cursor-pointer">Ecosystem</button>
          <button onClick={() => handleNavClick('showcase')} className="hover:text-[#10B981] transition cursor-pointer flex items-center gap-1.5">
            Showcase
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          </button>
          <Link
            to="/blogs"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`transition cursor-pointer font-bold ${
              isBlogsPage ? 'text-[#10B981] underline underline-offset-4' : 'hover:text-[#10B981] text-[#059669]'
            }`}
          >
            Blogs
          </Link>
          <Link
            to="/team"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`transition cursor-pointer font-bold ${
              isTeamPage ? 'text-[#10B981] underline underline-offset-4' : 'hover:text-[#10B981] text-[#059669]'
            }`}
          >
            Our Team
          </Link>
          <Link
            to="/security"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`transition cursor-pointer font-bold ${
              isSecurityPage ? 'text-[#10B981] underline underline-offset-4' : 'hover:text-[#10B981] text-[#059669]'
            }`}
          >
            Security
          </Link>
          <button onClick={() => handleNavClick('founder')} className="hover:text-[#10B981] transition cursor-pointer font-bold text-[#059669]">Founder</button>
          <button onClick={() => handleNavClick('capabilities')} className="hover:text-[#10B981] transition cursor-pointer">Capabilities</button>
          <button onClick={() => handleNavClick('enterprise')} className="hover:text-[#10B981] transition cursor-pointer">Enterprise</button>
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden lg:flex items-center">
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

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] hover:bg-[#10B981] hover:text-white transition cursor-pointer focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-4 pb-6 px-4 border-t border-[#A7F3D0]/60 bg-white/98 rounded-2xl shadow-xl space-y-3 animate-fade-in-up">
          <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider text-slate-700">
            <button
              onClick={() => handleNavClick('ecosystem')}
              className="text-left px-4 py-3 rounded-xl hover:bg-[#ECFDF5] hover:text-[#10B981] font-bold transition flex items-center justify-between"
            >
              <span>Ecosystem</span>
              <span className="text-[10px] text-[#059669]">5 Flagships</span>
            </button>

            <button
              onClick={() => handleNavClick('showcase')}
              className="text-left px-4 py-3 rounded-xl hover:bg-[#ECFDF5] hover:text-[#10B981] font-bold transition flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                Showcase
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              </span>
              <span className="text-[10px] text-[#059669]">Projects</span>
            </button>

            <Link
              to="/team"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-left px-4 py-3 rounded-xl font-bold transition flex items-center justify-between ${
                isTeamPage ? 'bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]' : 'hover:bg-[#ECFDF5] hover:text-[#10B981] text-[#059669]'
              }`}
            >
              <span>Our Team</span>
              <span className="text-[10px] bg-[#10B981] text-white px-2 py-0.5 rounded font-bold">NEXT PAGE</span>
            </Link>

            <Link
              to="/security"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-left px-4 py-3 rounded-xl font-bold transition flex items-center justify-between ${
                isSecurityPage ? 'bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]' : 'hover:bg-[#ECFDF5] hover:text-[#10B981] text-[#059669]'
              }`}
            >
              <span>Enterprise Security</span>
              <span className="text-[10px] bg-[#059669] text-white px-2 py-0.5 rounded font-bold">ZERO-TRUST</span>
            </Link>

            <button
              onClick={() => handleNavClick('founder')}
              className="text-left px-4 py-3 rounded-xl hover:bg-[#ECFDF5] hover:text-[#10B981] font-bold text-[#059669] transition flex items-center justify-between"
            >
              <span>Founder Spotlight</span>
              <span className="text-[10px] text-slate-400">Profile</span>
            </button>

            <button
              onClick={() => handleNavClick('capabilities')}
              className="text-left px-4 py-3 rounded-xl hover:bg-[#ECFDF5] hover:text-[#10B981] font-bold transition"
            >
              Capabilities
            </button>

            <button
              onClick={() => handleNavClick('enterprise')}
              className="text-left px-4 py-3 rounded-xl hover:bg-[#ECFDF5] hover:text-[#10B981] font-bold transition"
            >
              Enterprise Solutions
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleNavClick('enterprise')}
              className="w-full font-mono text-xs bg-[#10B981] hover:bg-[#059669] text-white px-5 py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md"
            >
              Contact Enterprise Sales
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
