import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative border-t border-[#A7F3D0]/60 mt-16 sm:mt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#ECFDF5] border-2 border-[#A7F3D0] rounded-2xl p-1.5 flex items-center justify-center shadow-lg shadow-emerald-500/15 overflow-hidden flex-shrink-0">
              <img
                src="/squirrel_logo.png"
                alt="Junglans Squirrel Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <span className="font-heading font-bold text-xl sm:text-2xl text-[#08090c]">Junglans Solutions</span>
          </div>
          <p className="font-body text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed mb-6">
            Architecting the future of local-first, high-performance enterprise software solutions. 20 specialized tools designed for zero telemetry, military-grade privacy, and sub-millisecond execution.
          </p>
          <div className="flex items-center gap-3 font-mono text-[11px] sm:text-xs text-[#059669]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="font-bold">20 ACTIVE ENTERPRISE PRODUCTS DEPLOYED</span>
          </div>
        </div>

        <div>
          <div className="font-mono text-xs text-[#059669] uppercase tracking-widest mb-4 font-bold">Flagship Products</div>
          <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
            <li><Link to="/project/project-0" className="text-slate-600 hover:text-[#10B981] transition">Junglans Project Manager</Link></li>
            <li><Link to="/project/project-1" className="text-slate-600 hover:text-[#10B981] transition">Jung AI Sidecar</Link></li>
            <li><Link to="/project/project-2" className="text-slate-600 hover:text-[#10B981] transition">Junglans IDE</Link></li>
            <li><Link to="/project/project-3" className="text-slate-600 hover:text-[#10B981] transition">JunglansChat</Link></li>
            <li><Link to="/project/project-5" className="text-slate-600 hover:text-[#10B981] transition">TalkToDB</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-xs text-[#059669] uppercase tracking-widest mb-4 font-bold">Company & Navigation</div>
          <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
            <li><Link to="/team" className="text-[#10B981] font-bold hover:underline">Our Team Page ↗</Link></li>
            <li><Link to="/" className="text-slate-600 hover:text-[#10B981] transition">Home Portfolio</Link></li>
            <li><a href="#security" className="text-slate-600 hover:text-[#10B981] transition">Enterprise Security</a></li>
            <li><a href="#founder" className="text-slate-600 hover:text-[#10B981] transition">Founder Spotlight</a></li>
            <li><a href="#enterprise" className="text-slate-600 hover:text-[#10B981] transition">Contact Sales</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#A7F3D0]/40 py-6 sm:py-8 text-center font-mono text-[10px] sm:text-xs text-slate-500 bg-[#ECFDF5]/50 px-4">
        © 2026 JUNGLANS_SOLUTIONS // ALL_RIGHTS_RESERVED // 20_PRODUCT_PORTFOLIO
      </div>
    </footer>
  );
}
