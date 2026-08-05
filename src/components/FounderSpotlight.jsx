import React, { useState } from 'react';

export default function FounderSpotlight() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id="founder" className="glass-panel rounded-3xl p-5 sm:p-7 bg-white border border-[#A7F3D0] shadow-xl my-6 sm:my-10 relative overflow-hidden transition-all duration-300">
      
      {/* Background Subtle Mint Glow Radial */}
      <div className="absolute -top-24 -right-24 w-72 sm:w-80 h-72 sm:h-80 bg-[#10B981]/10 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Main Compact Identity & Highlight Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
        <div className="flex items-center gap-4">
          {/* Avatar Icon */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] text-white flex items-center justify-center font-heading text-xl sm:text-2xl font-bold shadow-md shadow-emerald-500/20 flex-shrink-0">
            MT
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#059669] font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping flex-shrink-0"></span>
              FOUNDER & LEAD ARCHITECT
            </div>
            <h2 className="font-heading text-xl sm:text-3xl font-bold text-[#08090c] tracking-tight">
              Manosakthi Thiyagarajan
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1 font-mono text-xs text-slate-600">
              <span>Co-Founder at <a href="https://ascendiaedu.online" target="_blank" rel="noreferrer" className="text-[#10B981] font-bold hover:underline">AscendiaEdu ↗</a></span>
              <span className="text-slate-300">•</span>
              <span className="bg-[#ECFDF5] text-[#059669] px-2.5 py-0.5 rounded-full border border-[#A7F3D0] font-bold text-[11px]">B.Tech AI & DS (GPA 8.8)</span>
            </div>
          </div>
        </div>

        {/* Quick Action Profile Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 font-mono text-xs">
          <a
            href="https://ascendiaedu.online"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold transition shadow-md shadow-emerald-500/15 flex items-center gap-1.5"
          >
            🎓 AscendiaEdu ↗
          </a>
          <a
            href="https://github.com/manot6114"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-[#F4FBF7] text-[#08090c] border border-slate-200 font-bold hover:bg-[#10B981] hover:text-white transition"
          >
            🐙 GitHub
          </a>
          <a
            href="mailto:manot6114@gmail.com"
            className="px-3.5 py-2.5 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-bold hover:bg-[#10B981] hover:text-white transition"
          >
            ✉ Email
          </a>
        </div>
      </div>

      {/* Main Highlight Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100 font-mono text-xs relative z-10">
        <div className="p-3 bg-[#ECFDF5]/80 rounded-xl border border-[#A7F3D0]">
          <div className="text-[10px] text-[#059669] font-bold uppercase">FOUNDER ROLE</div>
          <div className="font-bold text-[#08090c]">Junglans Solutions</div>
          <div className="text-[10px] text-slate-500">Local-First Software Architect</div>
        </div>

        <a
          href="https://ascendiaedu.online"
          target="_blank"
          rel="noreferrer"
          className="p-3 bg-[#ECFDF5]/80 rounded-xl border border-[#A7F3D0] hover:border-[#10B981] transition group"
        >
          <div className="text-[10px] text-[#059669] font-bold uppercase">EDTECH VENTURE</div>
          <div className="font-bold text-[#08090c] group-hover:text-[#10B981]">Co-Founder @ AscendiaEdu</div>
          <div className="text-[10px] text-[#10B981] font-bold">ascendiaedu.online ↗</div>
        </a>

        <div className="p-3 bg-[#ECFDF5]/80 rounded-xl border border-[#A7F3D0]">
          <div className="text-[10px] text-[#059669] font-bold uppercase">ACADEMIC BACKGROUND</div>
          <div className="font-bold text-[#08090c]">GPA 8.8 // B.Tech AI & DS</div>
          <div className="text-[10px] text-slate-500">P.A. College of Engg. & Tech</div>
        </div>
      </div>

      {/* Toggle Expand / See More Button */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs relative z-10">
        <span className="text-slate-500 text-[11px] font-semibold">
          {expanded ? 'Full Executive & Internship Breakdown' : 'Click below to read full research & background bio'}
        </span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 rounded-xl bg-[#ECFDF5] hover:bg-[#10B981] text-[#059669] hover:text-white border border-[#A7F3D0] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          {expanded ? (
            <>
              Show Less ↑
            </>
          ) : (
            <>
              See More / Full Bio ↓
            </>
          )}
        </button>
      </div>

      {/* Collapsible Expanded Bio & Industry Breakdown */}
      {expanded && (
        <div className="mt-6 pt-6 border-t border-[#A7F3D0] animate-fade-in-up space-y-6 relative z-10">
          
          {/* Executive Summary */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-white border border-[#A7F3D0]">
            <div className="font-mono text-xs text-[#059669] font-bold uppercase tracking-wider mb-2">
              EXECUTIVE & TECHNICAL SUMMARY
            </div>
            <p className="font-body text-sm text-slate-700 leading-relaxed mb-3">
              <strong className="text-[#08090c]">Manosakthi Thiyagarajan</strong> is the Founder and Lead AI Architect behind <strong className="text-[#059669]">Junglans Solutions</strong> and Co-Founder at <strong className="text-[#059669]">AscendiaEdu</strong>. With a B.Tech in AI & Data Science (GPA: 8.8), he has architected local-first software repositories spanning developer tooling, version control attribution, AI workspaces, encrypted communications, and natural language data infrastructure.
            </p>
            <p className="font-body text-xs text-slate-600 leading-relaxed">
              At AscendiaEdu, he drives AI-powered educational innovation while simultaneously leading product architecture across Junglans Solutions' technical suites.
            </p>
          </div>

          {/* Domain Experience & Industry Internships Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-4 bg-white rounded-2xl border border-[#A7F3D0]">
              <div className="font-bold text-[#08090c] text-sm">Robotics & AI</div>
              <div className="text-slate-500 text-[11px] mt-0.5">iHub School of Learning</div>
              <div className="text-[#059669] font-bold mt-2 text-[11px]">ROS & Embedded Vision</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#A7F3D0]">
              <div className="font-bold text-[#08090c] text-sm">Data Science</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Neha Solutions</div>
              <div className="text-[#059669] font-bold mt-2 text-[11px]">Pipelines & Forecasting</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#A7F3D0]">
              <div className="font-bold text-[#08090c] text-sm">Machine Learning</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Live Stream Tech</div>
              <div className="text-[#059669] font-bold mt-2 text-[11px]">CNN & LSTM Models</div>
            </div>
          </div>

          {/* Social Links Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 font-mono text-xs text-slate-500 border-t border-slate-100">
            <div className="flex gap-4">
              <a href="https://ascendiaedu.online" target="_blank" rel="noreferrer" className="text-[#059669] font-bold hover:underline">
                AscendiaEdu ↗
              </a>
              <a href="https://github.com/manot6114" target="_blank" rel="noreferrer" className="hover:text-[#10B981]">
                GitHub ↗
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#10B981]">
                LinkedIn ↗
              </a>
              <a href="mailto:manot6114@gmail.com" className="hover:text-[#10B981]">
                Email ↗
              </a>
            </div>
            <span className="text-[10px]">POLLACHI, TAMIL NADU</span>
          </div>

        </div>
      )}

    </div>
  );
}
