import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative border-t border-[#A7F3D0]/60 mt-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-16 h-16 bg-[#ECFDF5] border-2 border-[#A7F3D0] rounded-2xl p-1.5 flex items-center justify-center shadow-lg shadow-emerald-500/15 overflow-hidden">
              <img
                src="/squirrel_logo.png"
                alt="Junglans Squirrel Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <span className="font-heading font-bold text-2xl text-[#08090c]">Junglans Solutions</span>
          </div>
          <p className="font-body text-sm text-slate-600 max-w-sm leading-relaxed mb-6">
            Architecting the future of local-first, high-performance enterprise software solutions. 20 specialized tools designed for zero telemetry, military-grade privacy, and sub-millisecond execution.
          </p>
          <div className="flex items-center gap-3 font-mono text-xs text-[#059669]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="font-bold">20 ACTIVE ENTERPRISE PRODUCTS DEPLOYED</span>
          </div>
        </div>

        <div>
          <div className="font-mono text-xs text-[#059669] uppercase tracking-widest mb-4 font-bold">Flagship Products</div>
          <ul className="space-y-2.5 text-sm font-medium">
            <li><Link to="/project/project-0" className="text-slate-600 hover:text-[#10B981] transition">Junglans Project Manager</Link></li>
            <li><Link to="/project/project-1" className="text-slate-600 hover:text-[#10B981] transition">Jung AI Sidecar</Link></li>
            <li><Link to="/project/project-2" className="text-slate-600 hover:text-[#10B981] transition">Junglans IDE</Link></li>
            <li><Link to="/project/project-3" className="text-slate-600 hover:text-[#10B981] transition">JunglansChat</Link></li>
            <li><Link to="/project/project-5" className="text-slate-600 hover:text-[#10B981] transition">TalkToDB</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-xs text-[#059669] uppercase tracking-widest mb-4 font-bold">Company & Legal</div>
          <ul className="space-y-2.5 text-sm font-medium">
            <li><a href="#about" className="text-slate-600 hover:text-[#10B981] transition">About Us</a></li>
            <li><a href="#security" className="text-slate-600 hover:text-[#10B981] transition">Enterprise Security</a></li>
            <li><a href="#careers" className="text-slate-600 hover:text-[#10B981] transition">Careers & Engineering</a></li>
            <li><a href="#contact" className="text-slate-600 hover:text-[#10B981] transition">Contact Sales</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#A7F3D0]/40 py-8 text-center font-mono text-xs text-slate-500 bg-[#ECFDF5]/50">
        © 2026 JUNGLANS_SOLUTIONS // ALL_RIGHTS_RESERVED // 20_PRODUCT_PORTFOLIO
      </div>
    </footer>
  );
}
