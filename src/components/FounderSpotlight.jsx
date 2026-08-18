import React, { useState } from 'react';

export default function FounderSpotlight() {
  const [expanded, setExpanded] = useState(false);

  const founders = [
    {
      id: 'manosakthi',
      name: 'Manosakthi Thiyagarajan',
      role: 'Founder & Lead AI Architect',
      badge: 'FOUNDER',
      avatar: 'MT',
      color: '#10B981',
      domain: 'AI Systems & Zero-Trust Architecture',
      summary: 'Architect of local-first enterprise software suites, zero-trust security protocols, and LLM quantization engines.',
      bioDetail: 'B.Tech in Artificial Intelligence & Data Science from P.A. College of Engineering and Technology. Co-Founder at AscendiaEdu. Has architected local-first software repositories spanning developer tooling, version control attribution, AI workspaces, encrypted communications, and natural language data infrastructure.',
      skills: ['AI Systems Architecture', 'Rust / C++', 'LLM Quantization', 'Zero-Trust Protocol'],
      email: 'manot6114@gmail.com',
      ascendiaEduUrl: 'https://ascendiaedu.online',
      githubUrl: 'https://github.com/manot6114',
      linkedinUrl: 'https://linkedin.com'
    },
    {
      id: 'srikanish',
      name: 'Sri Kanish P',
      role: 'Co-Founder & ROS Developer',
      badge: 'CO-FOUNDER',
      avatar: 'SK',
      color: '#059669',
      domain: 'Robotic Nodes & Hardware Automation',
      summary: 'Specialist in robotic software nodes (ROS1/ROS2), hardware automation, and intelligent sensor control systems.',
      bioDetail: 'B.Tech in Artificial Intelligence & Data Science with Diploma in ROS from iHub School of Learning. Experienced in developing robotic software nodes, sensor data integration for real-time responsiveness, robotic arm control, and hardware-software simulation.',
      skills: ['ROS1 / ROS2', 'Robotics & Automation', 'Python / C++', 'Sensor Integration', 'Hardware Automation'],
      email: 'kanishpatrick@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/srikanish-parthiban-56a783368/'
    }
  ];

  return (
    <div id="founder" className="glass-panel rounded-3xl p-5 sm:p-7 bg-white border border-[#A7F3D0] shadow-xl my-6 sm:my-10 relative overflow-hidden transition-all duration-300">
      
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 bg-[#10B981]/10 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 relative z-10">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#059669] font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping flex-shrink-0"></span>
            EXECUTIVE LEADERSHIP SPOTLIGHT
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] tracking-tight mt-1">
            Founders & Executive Leadership
          </h2>
        </div>
        <span className="font-mono text-xs text-[#059669] bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0] font-bold w-fit">
          JUNGLANS SOLUTIONS
        </span>
      </div>

      {/* Founder Cards Grid (2 Columns: Manosakthi & Sri Kanish) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        {founders.map((founder) => (
          <div
            key={founder.id}
            className="p-6 rounded-2xl bg-white border border-[#A7F3D0] shadow-md hover:border-[#10B981] transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Header Badge & Initial Avatar */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-2xl text-white font-heading font-bold text-xl flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: founder.color }}
                >
                  {founder.avatar}
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  {founder.badge}
                </span>
              </div>

              {/* Founder Name & Role */}
              <h3 className="font-heading text-xl font-bold text-[#08090c] group-hover:text-[#10B981] transition-colors">
                {founder.name}
              </h3>
              <div className="font-mono text-xs text-[#059669] font-bold mt-1 mb-3">
                {founder.role}
              </div>

              {/* Summary */}
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {founder.summary}
              </p>

              {/* Inline Detailed Bio when expanded */}
              {expanded && (
                <div className="mt-4 pt-4 border-t border-[#A7F3D0]/60 animate-fade-in-up font-body text-xs text-slate-700 leading-relaxed space-y-3">
                  <p className="bg-[#ECFDF5]/70 p-3.5 rounded-xl border border-[#A7F3D0]">
                    {founder.bioDetail}
                  </p>
                  <div>
                    <div className="font-mono text-[10px] text-slate-400 font-bold uppercase mb-1.5">KEY SPECIALIZATIONS:</div>
                    <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                      {founder.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="px-2.5 py-1 bg-white border border-[#A7F3D0] text-[#059669] rounded-lg font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Highlight Domain Pill */}
              <div className="mt-3 mb-4">
                <span className="font-mono text-[11px] bg-[#F4FBF7] text-[#059669] px-3 py-1.5 rounded-lg border border-[#A7F3D0] font-bold inline-block">
                  ⚡ {founder.domain}
                </span>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs font-bold text-[#059669]">
              <a
                href={`mailto:${founder.email}`}
                className="hover:text-[#10B981] transition flex items-center gap-1.5"
              >
                ✉ Email
              </a>

              {founder.ascendiaEduUrl ? (
                <a
                  href={founder.ascendiaEduUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#10B981] hover:underline"
                >
                  AscendiaEdu ↗
                </a>
              ) : (
                <a
                  href={founder.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-[#10B981] transition"
                >
                  LinkedIn ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Expand Toggle Button */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs relative z-10">
        <span className="text-slate-500 text-[11px] font-semibold">
          {expanded ? 'Full Background & Research Specifications' : 'Click to view complete academic & research details'}
        </span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2.5 rounded-xl bg-[#ECFDF5] hover:bg-[#10B981] text-[#059669] hover:text-white border border-[#A7F3D0] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          {expanded ? 'Show Less ↑' : 'See Detailed Research Bio ↓'}
        </button>
      </div>

    </div>
  );
}
