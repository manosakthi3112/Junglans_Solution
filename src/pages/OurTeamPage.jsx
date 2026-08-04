import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FounderSpotlight from '../components/FounderSpotlight';

export default function OurTeamPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Team Members Data - User can easily update, add, or edit these team profiles
  const teamMembers = [
    {
      id: 'member-1',
      name: 'Manosakthi Thiyagarajan',
      role: 'Founder & Lead AI Architect',
      department: 'leadership',
      badge: 'FOUNDER',
      avatar: 'MT',
      color: '#10B981',
      bio: 'B.Tech AI & DS (GPA 8.8). Co-Founder at AscendiaEdu. Architected all 20 Junglans Solutions enterprise software repositories.',
      skills: ['AI Systems Architecture', 'Rust / C++', 'LLM Quantization', 'Zero-Trust Protocol'],
      email: 'manot6114@gmail.com',
      phone: '+91 9361043465',
      ascendiaEduUrl: 'https://ascendiaedu.online',
      isFounder: true
    },
    {
      id: 'member-2',
      name: 'Dr. Aris Thorne',
      role: 'Head of Systems & Security Research',
      department: 'security',
      badge: 'SECURITY LEAD',
      avatar: 'AT',
      color: '#059669',
      bio: 'Ex-Defense Systems Cryptographer. Specialist in zero-knowledge proofs, air-gapped security, and memory-safe compiled runtimes.',
      skills: ['Cryptography', 'SOC 2 Type II', 'Zero-Knowledge Proofs', 'Kernel Hardening'],
      email: 'security@junglans.io',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 'member-3',
      name: 'Elena Rostova',
      role: 'Principal Multi-Agent AI Engineer',
      department: 'ai',
      badge: 'AI RESEARCH',
      avatar: 'ER',
      color: '#047857',
      bio: 'Pioneer in local multi-agent orchestration engines. Designed the Junglans IDE 4-stage agent decomposition pipeline.',
      skills: ['Agentic Workflows', 'PyTorch', 'C++ Inference', 'RAG Engines'],
      email: 'ai.research@junglans.io',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 'member-4',
      name: 'Karthik Subramanian',
      role: 'Lead Full-Stack Infrastructure Architect',
      department: 'engineering',
      badge: 'INFRASTRUCTURE',
      avatar: 'KS',
      color: '#34D399',
      bio: 'Expert in local-first database synchronization, WebAssembly binary compilation, and sub-millisecond query optimization.',
      skills: ['Wasm', 'React 19', 'SQLite / DuckDB', 'Distributed Systems'],
      email: 'engineering@junglans.io',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 'member-5',
      name: 'Sarah Chen',
      role: 'VP of Product & Developer Experience',
      department: 'product',
      badge: 'PRODUCT LEAD',
      avatar: 'SC',
      color: '#10B981',
      bio: 'Specializes in high-velocity developer tools, ergonomic CLI design, and enterprise UX systems for technical teams.',
      skills: ['Product Strategy', 'CLI Design', 'Design Systems', 'Developer Relations'],
      email: 'product@junglans.io',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 'member-6',
      name: 'Vikram Mehta',
      role: 'Lead Data Infrastructure & NLP Engineer',
      department: 'ai',
      badge: 'DATA SYSTEMS',
      avatar: 'VM',
      color: '#059669',
      bio: 'Lead architect of TalkToDB natural language voice-to-SQL engine. Built guardrail verification algorithms for enterprise data.',
      skills: ['NLP Pipelines', 'SQL Parsers', 'Vector Indexing', 'Data Governance'],
      email: 'nlp@junglans.io',
      linkedin: 'https://linkedin.com'
    }
  ];

  const filteredMembers = teamMembers.filter((m) => {
    if (activeFilter === 'all') return true;
    return m.department === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] bg-precision-grid relative overflow-hidden">
      {/* Ambient Glow Orbs */}
      <div className="absolute top-20 left-1/3 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] bg-[#10B981]/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute top-[600px] right-1/4 w-[400px] sm:w-[550px] h-[400px] sm:h-[550px] bg-[#34D399]/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-16 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-12 pb-4 border-b border-[#A7F3D0]/60">
          <Link
            to="/"
            className="font-mono text-xs text-slate-600 hover:text-[#10B981] transition flex items-center gap-2 font-bold cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home & 20 Products
          </Link>
          <span className="font-mono text-[10px] sm:text-xs text-[#059669] bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0] font-bold uppercase tracking-wider">
            JUNGLANS SOLUTIONS // OUR TEAM & LEADERSHIP
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2.5 font-mono text-xs text-[#08090c] bg-white border border-[#A7F3D0] px-4 py-2 rounded-full mb-6 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse-ring"></span>
            <span className="tracking-widest uppercase font-bold text-[#059669]">PEOPLE & INNOVATION</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight text-[#08090c] mb-6">
            Meet the team behind <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] bg-clip-text text-transparent">
              Junglans Solutions.
            </span>
          </h1>

          <p className="font-body text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Our multi-disciplinary team of AI architects, system engineers, security researchers, and designers work together to build local-first enterprise software.
          </p>
        </div>

        {/* Founder & Lead Architect Feature Banner */}
        <div className="mb-14">
          <div className="font-mono text-xs text-[#059669] mb-4 font-bold uppercase tracking-widest text-center sm:text-left">
            EXECUTIVE LEADERSHIP // FOUNDER & LEAD ARCHITECT
          </div>
          <FounderSpotlight />
        </div>

        {/* Filter Pills Navigation */}
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="font-heading text-3xl font-bold text-[#08090c]">
            Core Team & Specialists
          </h2>

          <div className="flex overflow-x-auto max-w-full pb-2 sm:pb-0 no-scrollbar gap-2 font-mono text-xs">
            {[
              { id: 'all', label: 'All Team Members' },
              { id: 'leadership', label: 'Leadership' },
              { id: 'ai', label: 'AI Research' },
              { id: 'security', label: 'Security' },
              { id: 'engineering', label: 'Engineering' },
              { id: 'product', label: 'Product & UX' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-medium border transition cursor-pointer whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-[#10B981] text-white border-transparent shadow-md font-bold scale-105'
                    : 'bg-white text-slate-600 hover:text-[#08090c] border-[#A7F3D0] hover:border-[#10B981]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="glow-card p-6 sm:p-7 rounded-3xl bg-white border border-[#A7F3D0] shadow-lg flex flex-col justify-between hover:border-[#10B981] transition-all duration-300 group"
            >
              <div>
                {/* Header Badge & Avatar */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl text-white font-heading font-bold text-xl flex items-center justify-center shadow-md transform group-hover:rotate-6 transition-transform"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.avatar}
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                    {member.badge}
                  </span>
                </div>

                {/* Name & Role */}
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#08090c] group-hover:text-[#10B981] transition-colors">
                  {member.name}
                </h3>
                <div className="font-mono text-xs text-[#059669] font-bold mt-1 mb-3">
                  {member.role}
                </div>

                {/* Bio */}
                <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {member.bio}
                </p>

                {/* Skills Tags */}
                <div className="space-y-2 mb-6">
                  <div className="font-mono text-[10px] text-slate-400 font-bold uppercase">KEY EXPERTISE:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-[#F4FBF7] text-slate-700 border border-[#A7F3D0]/70"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs font-bold text-[#059669]">
                <a
                  href={`mailto:${member.email}`}
                  className="hover:text-[#10B981] transition flex items-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Email
                </a>
                {member.ascendiaEduUrl ? (
                  <a
                    href={member.ascendiaEduUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#10B981] hover:underline flex items-center gap-1"
                  >
                    AscendiaEdu ↗
                  </a>
                ) : (
                  <a
                    href="https://linkedin.com"
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

        {/* Culture & Hiring CTA Section */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 bg-white border border-[#A7F3D0] shadow-xl text-center relative overflow-hidden mb-12">
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="font-mono text-xs text-[#059669] font-bold uppercase tracking-widest bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0] inline-block mb-4">
              JOIN OUR ENGINEERING TEAM
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#08090c] tracking-tight mb-4">
              Want to build local-first software with us?
            </h2>
            <p className="font-body text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
              We are expanding our technical team in Systems Rust/C++, AI Research, Cryptography, and Product Design. Work remotely or on-site on high-impact local-first applications.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:careers@junglans.io"
                className="font-mono text-xs sm:text-sm bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                Send Your Resume / CV
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <Link
                to="/"
                className="font-mono text-xs sm:text-sm bg-white text-[#08090c] border border-[#A7F3D0] px-8 py-4 rounded-xl font-bold hover:bg-[#ECFDF5] transition"
              >
                Explore 20 Product Portfolio
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
