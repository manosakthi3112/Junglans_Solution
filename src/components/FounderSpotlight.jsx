import React from 'react';

export default function FounderSpotlight() {
  return (
    <div id="founder" className="glass-panel rounded-[2.5rem] p-8 md:p-14 bg-white border border-[#A7F3D0] shadow-2xl my-20 relative overflow-hidden">
      
      {/* Background Subtle Mint Glow Radial */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#34D399]/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Top Header & Identity Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 pb-8 border-b border-[#E2E8F0] relative z-10">
        <div className="flex items-center gap-5">
          {/* Avatar Icon / Initial Badge */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] text-white flex items-center justify-center font-heading text-3xl font-bold shadow-xl shadow-emerald-500/20 flex-shrink-0">
            MT
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#059669] font-bold uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
              FOUNDER & LEAD ARCHITECT
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#08090c] tracking-tight">
              Manosakthi Thiyagarajan
            </h2>
            <p className="font-body text-base text-slate-600 mt-1 font-medium flex flex-wrap items-center gap-2">
              <span>Founder, <strong className="text-[#08090c]">Junglans Solutions</strong></span>
              <span className="text-slate-300">•</span>
              <span>Co-Founder, <a href="https://ascendiaedu.online" target="_blank" rel="noreferrer" className="text-[#10B981] font-bold hover:underline">AscendiaEdu</a></span>
            </p>
          </div>
        </div>

        {/* Quick Action Profile Buttons */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <a
            href="https://ascendiaedu.online"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-bold transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            🎓 Co-Founder @ ascendiaedu.online
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
          <a
            href="mailto:manot6114@gmail.com"
            className="px-4 py-3 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-bold hover:bg-[#10B981] hover:text-white transition"
          >
            ✉ Email
          </a>
          <a
            href="tel:+919361043465"
            className="px-4 py-3 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-bold hover:bg-[#10B981] hover:text-white transition"
          >
            📞 Contact
          </a>
        </div>
      </div>

      {/* STUNNING MNC EXECUTIVE SUMMARY HERO SHOWCASE */}
      <div className="relative z-10 mb-12">
        <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#ECFDF5]/80 via-white to-[#ECFDF5]/60 border-2 border-[#10B981]/30 shadow-xl relative overflow-hidden">
          
          {/* Quote Banner Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#10B981]/15 text-[#059669] flex items-center justify-center font-serif text-2xl font-bold">
              “
            </div>
            <div>
              <div className="font-mono text-[10px] text-[#059669] font-bold uppercase tracking-wider">EXECUTIVE PROMOTIONAL SUMMARY</div>
              <h3 className="font-heading text-xl font-bold text-[#08090c]">Pioneering Enterprise AI & Educational Architecture</h3>
            </div>
          </div>

          {/* Structured Paragraph Content */}
          <div className="space-y-4 font-body text-slate-700 text-base md:text-lg leading-relaxed mb-8">
            <p>
              <strong className="text-[#08090c] font-bold">Manosakthi Thiyagarajan</strong> is the Founder and Lead AI Architect behind <strong className="text-[#059669]">Junglans Solutions</strong> and Co-Founder at <strong className="text-[#059669]">AscendiaEdu</strong> (<a href="https://ascendiaedu.online" target="_blank" rel="noreferrer" className="text-[#10B981] font-bold hover:underline">ascendiaedu.online</a>). Holding a B.Tech in Artificial Intelligence & Data Science (GPA: 8.8) from P.A. College of Engineering and Technology, Pollachi, he has single-handedly architected and published <strong>20 enterprise software repositories</strong> across developer tooling, version control attribution, AI workspaces, encrypted communications, and natural language data infrastructure.
            </p>
            <p className="text-slate-600">
              As Co-Founder at AscendiaEdu, Manosakthi drives AI-powered educational innovation while simultaneously leading product architecture across Junglans Solutions' 20 software suites. His experience spans Robotics & AI (iHub School of Learning), Data Science (Neha Solutions), and Machine Learning (Live Stream Technologies).
            </p>
          </div>

          {/* 3 Executive Metric Pill Tickers */}
          <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-[#A7F3D0]/60 font-mono text-xs">
            <div className="p-4 bg-white rounded-2xl border border-[#A7F3D0] shadow-sm">
              <div className="text-[10px] text-[#059669] font-bold uppercase mb-1">ACADEMIC EXCELLENCE</div>
              <div className="font-bold text-[#08090c] text-sm">GPA 8.8 // B.Tech AI & DS</div>
              <div className="text-[10px] text-slate-500 mt-0.5">P.A. College of Engg. & Tech, Pollachi</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#A7F3D0] shadow-sm">
              <div className="text-[10px] text-[#059669] font-bold uppercase mb-1">VENTURE PORTFOLIO</div>
              <div className="font-bold text-[#08090c] text-sm">20 Enterprise Repos</div>
              <div className="text-[10px] text-[#10B981] font-bold mt-0.5">100% Local-First Architecture</div>
            </div>

            <a
              href="https://ascendiaedu.online"
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-white rounded-2xl border border-[#A7F3D0] shadow-sm hover:border-[#10B981] transition group"
            >
              <div className="text-[10px] text-[#059669] font-bold uppercase mb-1">EDTECH INNOVATION</div>
              <div className="font-bold text-[#08090c] text-sm group-hover:text-[#10B981]">Co-Founder @ AscendiaEdu</div>
              <div className="text-[10px] text-[#10B981] font-bold mt-0.5">ascendiaedu.online ↗</div>
            </a>
          </div>

        </div>
      </div>

      {/* Domain Experience & Industry Internships Breakdown */}
      <div className="grid lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Domain Experience Badges */}
        <div className="lg:col-span-7 p-6 bg-[#F4FBF7] rounded-3xl border border-[#A7F3D0]">
          <div className="font-mono text-xs text-[#059669] font-bold uppercase tracking-wider mb-4">
            INDUSTRY EXPERIENCE & DOMAIN MASTERY
          </div>
          <div className="grid sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <div className="font-bold text-[#08090c] text-sm">Robotics & AI</div>
              <div className="text-[11px] text-slate-500 mt-1">iHub School of Learning</div>
              <div className="text-[10px] text-[#059669] mt-2 font-bold">ROS & Deep Vision</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <div className="font-bold text-[#08090c] text-sm">Data Science</div>
              <div className="text-[11px] text-slate-500 mt-1">Neha Solutions</div>
              <div className="text-[10px] text-[#059669] mt-2 font-bold">Pipelines & Analytics</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <div className="font-bold text-[#08090c] text-sm">Machine Learning</div>
              <div className="text-[11px] text-slate-500 mt-1">Live Stream Tech</div>
              <div className="text-[10px] text-[#059669] mt-2 font-bold">CNN & LSTM Models</div>
            </div>
          </div>
        </div>

        {/* Official Links Bar */}
        <div className="lg:col-span-5 p-6 bg-white rounded-3xl border border-[#A7F3D0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs text-[#059669] font-bold uppercase tracking-wider mb-4">
              FOUNDER PROFILES & PORTFOLIO
            </div>
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs font-bold">
              <a
                href="https://ascendiaedu.online"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] text-[#059669] hover:bg-[#10B981] hover:text-white transition text-center"
              >
                🌐 ascendiaedu.online
              </a>
              <a
                href="https://github.com/manot6114"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#F4FBF7] rounded-xl border border-slate-200 text-[#08090c] hover:bg-[#10B981] hover:text-white transition text-center"
              >
                🐙 GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#F4FBF7] rounded-xl border border-slate-200 text-[#08090c] hover:bg-[#10B981] hover:text-white transition text-center"
              >
                💼 LinkedIn
              </a>
              <a
                href="https://leetcode.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#F4FBF7] rounded-xl border border-slate-200 text-[#08090c] hover:bg-[#10B981] hover:text-white transition text-center"
              >
                ⚡ LeetCode
              </a>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between font-mono text-[11px] text-slate-500">
            <span>LOCATION: POLLACHI, TAMIL NADU</span>
            <span className="text-[#10B981] font-bold">20 ACTIVE REPOS</span>
          </div>
        </div>

      </div>

    </div>
  );
}
