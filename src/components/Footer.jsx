import React from 'react';
import { Link } from 'react-router-dom';
import { blogsData } from '../data/blogsData';

export default function Footer() {
  return (
    <footer className="relative border-t border-[#A7F3D0]/60 mt-16 sm:mt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#ECFDF5] border-2 border-[#A7F3D0] rounded-2xl p-1.5 flex items-center justify-center shadow-lg shadow-emerald-500/15 overflow-hidden flex-shrink-0">
              <img
                src="/squirrel_logo-128.webp"
                alt="Junglans Squirrel Logo — Enterprise Software Ecosystem"
                width="64"
                height="64"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <span className="font-heading font-bold text-xl sm:text-2xl text-[#08090c]">Junglans Solutions</span>
          </div>
          <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
            Pioneering local-first software architecture, sovereign private LLMs, and zero-telemetry enterprise systems.
          </p>
          <div className="font-mono text-[11px] text-slate-600 space-y-1 mb-4">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#059669]">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Coimbatore, Tamil Nadu, India</span>
            </div>
            <div className="text-[10px] text-slate-500">Serving global enterprises & dev teams</div>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] sm:text-xs text-[#059669]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="font-bold">5 LIBRARIES ON NPM & PYPI</span>
          </div>
        </div>

        <div>
          <div className="font-mono text-xs text-[#059669] uppercase tracking-widest mb-4 font-bold flex items-center gap-1.5">
            <span>Core Services</span>
            <span className="text-[9px] bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] px-1 rounded">PILLARS</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm font-medium">
            <li><Link to="/ai-software-development" className="text-slate-600 hover:text-[#10B981] transition flex items-center justify-between"><span>AI Software Development</span><span className="text-[10px] font-mono text-[#059669]">IN</span></Link></li>
            <li><Link to="/enterprise-ai" className="text-slate-600 hover:text-[#10B981] transition flex items-center justify-between"><span>Enterprise AI Solutions</span><span className="text-[10px] font-mono text-[#059669]">LLM</span></Link></li>
            <li><Link to="/local-first-software" className="text-slate-600 hover:text-[#10B981] transition flex items-center justify-between"><span>Local-First Software</span><span className="text-[10px] font-mono text-[#059669]">WAL</span></Link></li>
            <li className="pt-2"><Link to="/contact" className="text-[#10B981] font-bold hover:underline">Architecture Consultation ↗</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-xs text-[#059669] uppercase tracking-widest mb-4 font-bold flex items-center gap-1.5">
            <span>Developer Packages</span>
            <span className="text-[9px] bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] px-1 rounded">NPM & PYPI</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm font-medium">
            <li><Link to="/packages/trail" className="text-slate-600 hover:text-[#10B981] transition flex items-center justify-between"><span>@junglans/trail</span><span className="text-[10px] font-mono text-slate-400">npm</span></Link></li>
            <li><Link to="/packages/trail-server" className="text-slate-600 hover:text-[#10B981] transition flex items-center justify-between"><span>@junglans/trail-server</span><span className="text-[10px] font-mono text-slate-400">npm</span></Link></li>
            <li><Link to="/packages/trail-react" className="text-slate-600 hover:text-[#10B981] transition flex items-center justify-between"><span>@junglans/trail-react</span><span className="text-[10px] font-mono text-slate-400">npm</span></Link></li>
            <li><Link to="/packages/jung" className="text-slate-600 hover:text-[#10B981] transition flex items-center justify-between"><span>jung</span><span className="text-[10px] font-mono text-slate-400">PyPI</span></Link></li>
            <li><Link to="/packages/junglans-trail" className="text-slate-600 hover:text-[#10B981] transition flex items-center justify-between"><span>junglans-trail</span><span className="text-[10px] font-mono text-slate-400">PyPI</span></Link></li>
            <li className="pt-1"><Link to="/packages" className="text-[#10B981] font-bold hover:underline">Documentation Hub ↗</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-xs text-[#059669] uppercase tracking-widest mb-4 font-bold">Flagship Products</div>
          <ul className="space-y-2 text-xs sm:text-sm font-medium">
            <li><Link to="/project/project-0" className="text-slate-600 hover:text-[#10B981] transition">Junglans Project Manager</Link></li>
            <li><Link to="/project/project-1" className="text-slate-600 hover:text-[#10B981] transition">Jung AI Sidecar</Link></li>
            <li><Link to="/project/project-2" className="text-slate-600 hover:text-[#10B981] transition">Junglans IDE</Link></li>
            <li><Link to="/project/project-3" className="text-slate-600 hover:text-[#10B981] transition">JunglansChat</Link></li>
            <li><Link to="/project/project-5" className="text-slate-600 hover:text-[#10B981] transition">TalkToDB</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-xs text-[#059669] uppercase tracking-widest mb-4 font-bold">Company & Info</div>
          <ul className="space-y-2 text-xs sm:text-sm font-medium">
            <li><Link to="/packages" className="text-[#10B981] font-bold hover:underline">Packages & Docs ↗</Link></li>
            <li><Link to="/blogs" className="text-[#10B981] font-bold hover:underline">Engineering Blogs ({blogsData.length || 15}) ↗</Link></li>
            <li><Link to="/team" className="text-slate-600 hover:text-[#10B981] transition font-bold">Our Team Page ↗</Link></li>
            <li><Link to="/contact" className="text-slate-600 hover:text-[#10B981] transition font-bold">Contact Sales ↗</Link></li>
            <li><Link to="/privacy" className="text-slate-600 hover:text-[#10B981] transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-slate-600 hover:text-[#10B981] transition">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#A7F3D0]/40 py-6 sm:py-8 text-center font-mono text-[10px] sm:text-xs text-slate-500 bg-[#ECFDF5]/50 px-4">
        © 2026 JUNGLANS_SOLUTIONS // ALL_RIGHTS_RESERVED // COIMBATORE, TAMIL NADU, INDIA
      </div>
    </footer>
  );
}
