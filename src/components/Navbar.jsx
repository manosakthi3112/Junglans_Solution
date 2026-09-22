import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'services' | 'products' | 'community' | null
  
  const timeoutRef = useRef(null);
  const navRef = useRef(null);

  const handleMouseEnter = (name) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  const handleDropdownClick = (e, name) => {
    e.preventDefault();
    e.stopPropagation();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
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
  const isBlogsPage = location.pathname.startsWith('/blog');
  const isPackagesPage = location.pathname.startsWith('/packages');
  const isServicesPage = ['/ai-software-development', '/enterprise-ai', '/local-first-software'].includes(location.pathname);

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#A7F3D0]/60 px-3 sm:px-6 md:px-12 py-2.5 sm:py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] p-1 sm:p-1.5 flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-105 transition-all duration-300 shadow-md shadow-emerald-500/20 overflow-hidden flex-shrink-0">
            <img
              src="/squirrel_logo-128.webp"
              alt="Junglans — Tamil Nadu Tech Community & Software Ecosystem"
              width="56"
              height="56"
              loading="eager"
              decoding="async"
              className="w-full h-full object-contain rounded-lg sm:rounded-xl"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg sm:text-2xl leading-none tracking-tight text-[#08090c] group-hover:text-[#10B981] transition-colors">
              Junglans Solutions
            </span>
            <span className="font-mono text-[8px] sm:text-[9.5px] text-[#059669] mt-0.5 sm:mt-1 tracking-widest uppercase font-semibold">
              SOLUTIONS // TECH COMMUNITY
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7 font-mono text-xs uppercase tracking-wider text-slate-600 font-medium">
          
          {/* 1. Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={(e) => handleDropdownClick(e, 'services')}
              aria-expanded={openDropdown === 'services'}
              className={`flex items-center gap-1.5 hover:text-[#10B981] transition cursor-pointer font-bold ${
                isServicesPage ? 'text-[#10B981] underline underline-offset-4' : 'text-[#059669]'
              }`}
            >
              <span>Services</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform duration-200 ${openDropdown === 'services' ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {openDropdown === 'services' && (
              <div
                className="absolute top-full left-0 pt-2 z-50 animate-fade-in-up before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-72 bg-white border-2 border-[#A7F3D0] rounded-2xl shadow-xl p-2">
                  <Link
                    to="/ai-software-development"
                    onClick={() => { setOpenDropdown(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-2.5 rounded-xl hover:bg-[#ECFDF5] transition block group/item"
                  >
                    <div className="font-heading font-bold text-xs text-[#08090c] group-hover/item:text-[#059669] flex items-center justify-between">
                      <span>AI Software Development</span>
                      <span className="text-[9px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1 rounded font-mono">INDIA</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5 normal-case">Custom private LLMs & agents</div>
                  </Link>

                  <Link
                    to="/enterprise-ai"
                    onClick={() => { setOpenDropdown(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-2.5 rounded-xl hover:bg-[#ECFDF5] transition block group/item mt-1"
                  >
                    <div className="font-heading font-bold text-xs text-[#08090c] group-hover/item:text-[#059669] flex items-center justify-between">
                      <span>Enterprise AI Solutions</span>
                      <span className="text-[9px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1 rounded font-mono">AIR-GAPPED</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5 normal-case">Sovereign multi-agent swarms</div>
                  </Link>

                  <Link
                    to="/local-first-software"
                    onClick={() => { setOpenDropdown(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-2.5 rounded-xl hover:bg-[#ECFDF5] transition block group/item mt-1"
                  >
                    <div className="font-heading font-bold text-xs text-[#08090c] group-hover/item:text-[#059669] flex items-center justify-between">
                      <span>Local-First Software</span>
                      <span className="text-[9px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1 rounded font-mono">OFFLINE</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5 normal-case">Zero telemetry offline-first apps</div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 2. Products Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('products')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={(e) => handleDropdownClick(e, 'products')}
              aria-expanded={openDropdown === 'products'}
              className="flex items-center gap-1.5 hover:text-[#10B981] transition cursor-pointer font-bold text-slate-700"
            >
              <span>Products</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform duration-200 ${openDropdown === 'products' ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {openDropdown === 'products' && (
              <div
                className="absolute top-full left-0 pt-2 z-50 animate-fade-in-up before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                onMouseEnter={() => handleMouseEnter('products')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-64 bg-white border-2 border-[#A7F3D0] rounded-2xl shadow-xl p-2">
                  <a
                    href="/#ecosystem"
                    onClick={(e) => { e.preventDefault(); setOpenDropdown(null); handleNavClick('ecosystem'); }}
                    className="p-2.5 rounded-xl hover:bg-[#ECFDF5] transition block group/item"
                  >
                    <div className="font-heading font-bold text-xs text-[#08090c] group-hover/item:text-[#059669] flex items-center justify-between">
                      <span>Ecosystem Stage</span>
                      <span className="text-[9px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1 rounded font-mono">5 CORE</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5 normal-case">Flagship developer applications</div>
                  </a>

                  <a
                    href="/#showcase"
                    onClick={(e) => { e.preventDefault(); setOpenDropdown(null); handleNavClick('showcase'); }}
                    className="p-2.5 rounded-xl hover:bg-[#ECFDF5] transition block group/item mt-1"
                  >
                    <div className="font-heading font-bold text-xs text-[#08090c] group-hover/item:text-[#059669] flex items-center justify-between">
                      <span>Project Showcase</span>
                      <span className="text-[9px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1 rounded font-mono">20 APPS</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5 normal-case">Full open-source project portfolio</div>
                  </a>

                  <a
                    href="/#capabilities"
                    onClick={(e) => { e.preventDefault(); setOpenDropdown(null); handleNavClick('capabilities'); }}
                    className="p-2.5 rounded-xl hover:bg-[#ECFDF5] transition block group/item mt-1"
                  >
                    <div className="font-heading font-bold text-xs text-[#08090c] group-hover/item:text-[#059669]">
                      Capabilities Matrix
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5 normal-case">Technical feature benchmarks</div>
                  </a>

                  <a
                    href="/#enterprise"
                    onClick={(e) => { e.preventDefault(); setOpenDropdown(null); handleNavClick('enterprise'); }}
                    className="p-2.5 rounded-xl hover:bg-[#ECFDF5] transition block group/item mt-1"
                  >
                    <div className="font-heading font-bold text-xs text-[#08090c] group-hover/item:text-[#059669]">
                      Enterprise ROI Calculator
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5 normal-case">Calculate local-first cloud savings</div>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 3. Packages & Docs (Direct Link) */}
          <Link
            to="/packages"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`transition cursor-pointer font-bold flex items-center gap-1.5 ${
              isPackagesPage ? 'text-[#10B981] underline underline-offset-4' : 'hover:text-[#10B981] text-slate-700'
            }`}
          >
            <span>Packages</span>
            <span className="text-[9px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1.5 py-0.5 rounded font-bold">DOCS</span>
          </Link>

          {/* 4. Blogs (Direct Link) */}
          <Link
            to="/blogs"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`transition cursor-pointer font-bold flex items-center gap-1.5 ${
              isBlogsPage ? 'text-[#10B981] underline underline-offset-4' : 'hover:text-[#10B981] text-slate-700'
            }`}
          >
            <span>Blogs</span>
            <span className="text-[9px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1.5 py-0.5 rounded font-bold">25</span>
          </Link>

          {/* 5. Community Dropdown (Updated from Company) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('community')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={(e) => handleDropdownClick(e, 'community')}
              aria-expanded={openDropdown === 'community'}
              className={`flex items-center gap-1.5 hover:text-[#10B981] transition cursor-pointer font-bold ${
                isTeamPage ? 'text-[#10B981] underline underline-offset-4' : 'text-slate-700'
              }`}
            >
              <span>Community</span>
              <span className="text-[9px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1 py-0.2 rounded font-bold">TN</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform duration-200 ${openDropdown === 'community' ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {openDropdown === 'community' && (
              <div
                className="absolute top-full right-0 pt-2 z-50 animate-fade-in-up before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
                onMouseEnter={() => handleMouseEnter('community')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-72 bg-white border-2 border-[#A7F3D0] rounded-2xl shadow-xl p-2">
                  <a
                    href="/#share-project"
                    onClick={(e) => { e.preventDefault(); setOpenDropdown(null); handleNavClick('share-project'); }}
                    className="p-2.5 rounded-xl hover:bg-[#ECFDF5] transition block group/item"
                  >
                    <div className="font-heading font-bold text-xs text-[#08090c] group-hover/item:text-[#059669] flex items-center justify-between">
                      <span>Share Your Project &amp; Ideas</span>
                      <span className="text-[9px] bg-[#10B981] text-white px-1.5 py-0.5 rounded font-mono font-bold">SUBMIT</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5 normal-case">Be part of Junglans & showcase your work</div>
                  </a>

                  <a
                    href="/#community"
                    onClick={(e) => { e.preventDefault(); setOpenDropdown(null); handleNavClick('community'); }}
                    className="p-2.5 rounded-xl hover:bg-[#ECFDF5] transition block group/item mt-1"
                  >
                    <div className="font-heading font-bold text-xs text-[#08090c] group-hover/item:text-[#059669] flex items-center justify-between">
                      <span>Tamil Nadu Tech Community</span>
                      <span className="text-[9px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1 rounded font-mono">TN TECH</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5 normal-case">Not a company — knowledge & product sharing</div>
                  </a>

                  <Link
                    to="/team"
                    onClick={() => { setOpenDropdown(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-2.5 rounded-xl hover:bg-[#ECFDF5] transition block group/item mt-1"
                  >
                    <div className="font-heading font-bold text-xs text-[#08090c] group-hover/item:text-[#059669] flex items-center justify-between">
                      <span>Our Builders & Team</span>
                      <span className="text-[9px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1 rounded font-mono">PEOPLE</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5 normal-case">Engineers, students & contributors</div>
                  </Link>

                  <a
                    href="/#founder"
                    onClick={(e) => { e.preventDefault(); setOpenDropdown(null); handleNavClick('founder'); }}
                    className="p-2.5 rounded-xl hover:bg-[#ECFDF5] transition block group/item mt-1"
                  >
                    <div className="font-heading font-bold text-xs text-[#08090c] group-hover/item:text-[#059669] flex items-center justify-between">
                      <span>Founder Spotlight</span>
                      <span className="text-[9px] text-[#059669]">LEAD</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5 normal-case">Architect background</div>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden lg:flex items-center">
          <a
            href="/#share-project"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('share-project');
            }}
            className="font-mono text-xs bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Share Project / Join</span>
            <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">TN</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
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
            {/* 1. Services Section */}
            <div className="border-b border-[#A7F3D0]/40 pb-2 mb-1">
              <div className="text-[10px] text-[#059669] font-bold px-4 pt-1 pb-1 tracking-wider uppercase">
                1. Core Services & Architecture
              </div>
              <Link
                to="/ai-software-development"
                onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-left px-4 py-2 rounded-xl hover:bg-[#ECFDF5] hover:text-[#10B981] font-bold transition flex items-center justify-between"
              >
                <span>AI Software Development</span>
                <span className="text-[9px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1.5 py-0.5 rounded font-mono">INDIA</span>
              </Link>
              <Link
                to="/enterprise-ai"
                onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-left px-4 py-2 rounded-xl hover:bg-[#ECFDF5] hover:text-[#10B981] font-bold transition flex items-center justify-between"
              >
                <span>Enterprise AI Solutions</span>
                <span className="text-[9px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1.5 py-0.5 rounded font-mono">AIR-GAPPED</span>
              </Link>
              <Link
                to="/local-first-software"
                onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-left px-4 py-2 rounded-xl hover:bg-[#ECFDF5] hover:text-[#10B981] font-bold transition flex items-center justify-between"
              >
                <span>Local-First Software</span>
                <span className="text-[9px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1.5 py-0.5 rounded font-mono">OFFLINE</span>
              </Link>
            </div>

            {/* 2. Products Section */}
            <div className="border-b border-[#A7F3D0]/40 pb-2 mb-1">
              <div className="text-[10px] text-[#059669] font-bold px-4 pt-1 pb-1 tracking-wider uppercase">
                2. Products & Ecosystem
              </div>
              <a
                href="/#ecosystem"
                onClick={(e) => { e.preventDefault(); handleNavClick('ecosystem'); }}
                className="text-left px-4 py-2 rounded-xl hover:bg-[#ECFDF5] hover:text-[#10B981] font-bold transition flex items-center justify-between"
              >
                <span>Ecosystem Stage</span>
                <span className="text-[9px] text-[#059669]">5 CORE</span>
              </a>
              <a
                href="/#showcase"
                onClick={(e) => { e.preventDefault(); handleNavClick('showcase'); }}
                className="text-left px-4 py-2 rounded-xl hover:bg-[#ECFDF5] hover:text-[#10B981] font-bold transition flex items-center justify-between"
              >
                <span>Project Showcase</span>
                <span className="text-[9px] text-[#059669]">20 APPS</span>
              </a>
              <a
                href="/#capabilities"
                onClick={(e) => { e.preventDefault(); handleNavClick('capabilities'); }}
                className="text-left px-4 py-2 rounded-xl hover:bg-[#ECFDF5] hover:text-[#10B981] font-bold transition flex items-center justify-between"
              >
                <span>Capabilities Matrix</span>
              </a>
            </div>

            {/* 3. Packages & Docs */}
            <Link
              to="/packages"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-left px-4 py-2.5 rounded-xl font-bold transition flex items-center justify-between ${
                isPackagesPage ? 'bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]' : 'hover:bg-[#ECFDF5] hover:text-[#10B981] text-slate-800'
              }`}
            >
              <span>Packages & Documentation</span>
              <span className="text-[10px] bg-[#10B981] text-white px-2 py-0.5 rounded font-bold">5 LIBS</span>
            </Link>

            {/* 4. Engineering Blogs */}
            <Link
              to="/blogs"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`text-left px-4 py-2.5 rounded-xl font-bold transition flex items-center justify-between ${
                isBlogsPage ? 'bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]' : 'hover:bg-[#ECFDF5] hover:text-[#10B981] text-slate-800'
              }`}
            >
              <span>Engineering & AI Blogs</span>
              <span className="text-[10px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded font-bold">25 ARTICLES</span>
            </Link>

            {/* 5. Community & Builders (Updated from Company) */}
            <div className="border-t border-[#A7F3D0]/40 pt-2">
              <div className="text-[10px] text-[#059669] font-bold px-4 pt-1 pb-1 tracking-wider uppercase">
                5. Tamil Nadu Tech Community
              </div>
              <a
                href="/#share-project"
                onClick={(e) => { e.preventDefault(); handleNavClick('share-project'); }}
                className="text-left px-4 py-2.5 rounded-xl bg-[#ECFDF5] text-[#059669] font-bold transition flex items-center justify-between border border-[#A7F3D0]"
              >
                <span>Share Your Project / Ideas</span>
                <span className="text-[9px] bg-[#10B981] text-white px-1.5 py-0.5 rounded font-bold">OPEN</span>
              </a>
              <a
                href="/#community"
                onClick={(e) => { e.preventDefault(); handleNavClick('community'); }}
                className="text-left px-4 py-2 rounded-xl hover:bg-[#ECFDF5] hover:text-[#10B981] font-bold text-slate-700 transition flex items-center justify-between mt-1"
              >
                <span>About the Community</span>
                <span className="text-[9px] text-[#059669]">TN TECH</span>
              </a>
              <Link
                to="/team"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-left px-4 py-2 rounded-xl font-bold transition flex items-center justify-between mt-1 ${
                  isTeamPage ? 'bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]' : 'hover:bg-[#ECFDF5] hover:text-[#10B981] text-slate-800'
                }`}
              >
                <span>Our Builders & Team</span>
                <span className="text-[9px] bg-[#10B981] text-white px-2 py-0.5 rounded font-bold">PROFILES</span>
              </Link>
              <a
                href="/#founder"
                onClick={(e) => { e.preventDefault(); handleNavClick('founder'); }}
                className="text-left px-4 py-2 rounded-xl hover:bg-[#ECFDF5] hover:text-[#10B981] font-bold text-slate-700 transition flex items-center justify-between mt-1"
              >
                <span>Founder Spotlight</span>
                <span className="text-[9px] text-slate-400">LEAD</span>
              </a>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="/#share-project"
              onClick={(e) => { e.preventDefault(); handleNavClick('share-project'); }}
              className="w-full font-mono text-xs bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-5 py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md"
            >
              <span>Share Project &amp; Join Community</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
