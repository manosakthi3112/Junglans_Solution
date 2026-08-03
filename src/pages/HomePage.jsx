import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { projectsData } from '../data/projectsData';
import InteractiveTerminal from '../components/InteractiveTerminal';
import ProductComparisonMatrix from '../components/ProductComparisonMatrix';
import SecurityComplianceSection from '../components/SecurityComplianceSection';
import EnterpriseCalculator from '../components/EnterpriseCalculator';
import FounderSpotlight from '../components/FounderSpotlight';

export default function HomePage() {
  const location = useLocation();
  const [selectedProductTab, setSelectedProductTab] = useState('project-0');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Stage simulation state
  const [stageScanActive, setStageScanActive] = useState(false);
  const [diffMode, setDiffMode] = useState('human-ai');
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Lead Architect', text: 'Deployment strategy approved for v2.4 release.', time: '10:42 AM' }
  ]);
  const [sqlQueryExecuted, setSqlQueryExecuted] = useState(false);

  // Filter 5 main products for Ecosystem Stage
  const mainProducts = projectsData.filter(p => p.isMainProduct);
  const currentStageProduct = projectsData.find(p => p.id === selectedProductTab) || mainProducts[0];

  // Filter all 20 projects for Showcase Grid
  const filteredProjects = projectsData.filter((project) => {
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] bg-precision-grid relative">
      
      {/* Dynamic Animated Ambient Glow Spheres */}
      <div className="absolute top-20 left-1/4 w-[650px] h-[650px] bg-[#10B981]/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute top-96 right-1/4 w-[550px] h-[550px] bg-[#34D399]/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-20 pb-24 border-b border-[#A7F3D0]/60 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10 animate-fade-in-up">
          
          <div className="inline-flex items-center gap-3 font-mono text-xs text-[#08090c] bg-white border border-[#A7F3D0] px-4 py-2 rounded-full mb-8 shadow-sm hover:scale-105 transition-transform duration-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse-ring"></span>
            <span className="tracking-widest uppercase font-bold text-[#059669]">JUNGLANS SOLUTIONS // ENTERPRISE SOFTWARE CONSORTIUM</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] font-bold font-mono text-[10px] border border-[#A7F3D0]">
              20 PROJECTS
            </span>
          </div>
          
          <h1 className="font-heading text-6xl md:text-8xl font-bold leading-[0.92] tracking-tighter mb-8 text-[#08090c]">
            Architecting the <br />
            <span className="bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] bg-clip-text text-transparent">
              future of software.
            </span>
          </h1>

          <p className="font-body text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
            Junglans Solutions develops 20 specialized tools and applications for global engineering organizations. High-performance compiled binaries, zero cloud telemetry, and total privacy guarantees.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#ecosystem"
              className="font-mono text-sm bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-xl font-bold transition inline-flex items-center gap-3 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-1 duration-300"
            >
              Explore Main 5 Flagships
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-bounce-subtle">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>

            <a
              href="#showcase"
              className="font-mono text-sm bg-white text-[#08090c] border border-[#A7F3D0] px-8 py-4 rounded-xl font-bold hover:bg-[#ECFDF5] transition inline-flex items-center gap-3 shadow-sm hover:-translate-y-1 duration-300"
            >
              All 20 Projects Catalog
            </a>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="py-5 border-b border-[#A7F3D0]/60 bg-white mb-16 overflow-hidden shadow-sm">
        <div className="marquee">
          <div className="marquee-content font-heading text-2xl font-bold text-[#059669]/30 tracking-wider">
            <span>JUNGLANS SOLUTIONS</span> <span>/</span>
            <span>20 ENTERPRISE PRODUCTS</span> <span>/</span>
            <span>LOCAL-FIRST ARCHITECTURE</span> <span>/</span>
            <span>ZERO-TRUST SECURITY</span> <span>/</span>
          </div>
          <div className="marquee-content font-heading text-2xl font-bold text-[#059669]/30 tracking-wider" aria-hidden="true">
            <span>JUNGLANS SOLUTIONS</span> <span>/</span>
            <span>20 ENTERPRISE PRODUCTS</span> <span>/</span>
            <span>LOCAL-FIRST ARCHITECTURE</span> <span>/</span>
            <span>ZERO-TRUST SECURITY</span> <span>/</span>
          </div>
        </div>
      </div>

      {/* Section 1: Main 5 Products Ecosystem Stage */}
      <section id="ecosystem" className="relative max-w-7xl mx-auto px-6 md:px-12 py-12 mb-20">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="font-mono text-xs text-[#059669] mb-4 font-bold tracking-widest uppercase">SEC_01 // THE_MAIN_ECOSYSTEM</div>
            <h2 className="font-heading text-5xl md:text-6xl font-bold tracking-tighter text-[#08090c]">
              A product for every <br />layer of the stack.
            </h2>
          </div>
          <p className="font-body text-lg text-slate-600 max-w-md">
            Interact with our 5 flagship products below. Click tabs to switch live capability simulators.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Tabs (The 5 Main Products) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {mainProducts.map((product) => {
              const isActive = selectedProductTab === product.id;
              return (
                <button
                  key={product.id}
                  onClick={() => setSelectedProductTab(product.id)}
                  className={`text-left p-5 rounded-2xl flex items-center gap-4 transition-all duration-300 border cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#10B981] shadow-lg translate-x-2 ring-2 ring-[#10B981]/20 scale-[1.02]'
                      : 'bg-white/60 border-transparent hover:bg-white hover:translate-x-1'
                  }`}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-transform duration-300 flex-shrink-0 shadow-md group-hover:rotate-6"
                    style={{ backgroundColor: product.color }}
                    dangerouslySetInnerHTML={{ __html: product.iconSvg }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`font-heading text-lg font-bold transition-colors ${isActive ? 'text-[#08090c]' : 'text-slate-600'}`}>
                      {product.name}
                    </div>
                    <div className="font-mono text-[10px] text-[#059669] tracking-wider uppercase font-semibold">
                      {product.ecosystemTag}
                    </div>
                  </div>
                  {isActive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse-ring"></span>
                  )}
                </button>
              );
            })}

            {/* Dynamic Product Description Card */}
            <div className="mt-4 p-6 glass-panel rounded-2xl border border-[#A7F3D0] bg-white animate-fade-in-up">
              <div className="font-mono text-xs text-[#059669] mb-2 font-bold uppercase tracking-wider">FLAGSHIP BRIEF</div>
              <p className="font-body text-sm text-slate-600 leading-relaxed mb-4">
                {currentStageProduct.summary}
              </p>
              <Link
                to={`/project/${currentStageProduct.id}`}
                className="font-mono text-xs text-[#08090c] font-bold hover:text-[#10B981] transition flex items-center gap-2 group"
              >
                Open Dedicated Product Page
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1.5 transition-transform">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Stage Screen Display */}
          <div className="lg:col-span-8">
            <div
              className="bg-white border border-[#A7F3D0] rounded-3xl p-6 md:p-8 h-[560px] shadow-xl flex flex-col justify-between transition-all duration-500 relative overflow-hidden animate-fade-in-up"
              style={{ boxShadow: `0 20px 45px -10px rgba(16, 185, 129, 0.18)` }}
            >
              {/* Header Bar */}
              <div className="flex justify-between items-center pb-4 border-b border-[#E2E8F0] sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
                  <span className="font-mono text-xs text-slate-500 ml-2 font-semibold uppercase">
                    {currentStageProduct.name} // INTERACTIVE_SIMULATOR
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-mono rounded font-bold">
                    {currentStageProduct.badge}
                  </span>
                  <span className="px-2.5 py-1 bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] text-[10px] font-mono rounded font-bold animate-pulse">
                    LIVE SIMULATOR
                  </span>
                </div>
              </div>

              {/* Dynamic Interactive Preview Mockup Content */}
              <div className="flex-1 py-6 overflow-y-auto font-mono text-sm">
                {currentStageProduct.id === 'project-0' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#F4FBF7] border border-[#A7F3D0] rounded-2xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-slate-600 font-bold">WORKSPACE SCANNER CONTROL</span>
                        <button
                          onClick={() => setStageScanActive(!stageScanActive)}
                          className="px-3.5 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs rounded-lg transition cursor-pointer font-bold shadow-md hover:scale-105 active:scale-95"
                        >
                          {stageScanActive ? 'Stop Scanner' : '▶ Trigger Deep Scan'}
                        </button>
                      </div>
                      <div className="space-y-2 text-slate-700 text-xs">
                        <div className="flex justify-between p-2.5 bg-white rounded-xl border border-[#E2E8F0]">
                          <span>📁 /src/core/services</span>
                          <span className={stageScanActive ? "text-[#10B981] font-bold animate-pulse" : "text-[#10B981] font-bold"}>
                            {stageScanActive ? 'SCANNING 4,832 LOC...' : '4,832 LOC VERIFIED'}
                          </span>
                        </div>
                        <div className="flex justify-between p-2.5 bg-white rounded-xl border border-[#E2E8F0]">
                          <span>📄 HealthCheck.ts</span>
                          <span className="text-[#10B981] font-bold">100% HEALTH SCORE</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl hover:scale-105 transition-transform">
                        <div className="text-[10px] text-[#059669] font-bold">SCAN SPEED</div>
                        <div className="text-xl font-bold text-[#08090c] mt-1">100K+ LOC/s</div>
                      </div>
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl hover:scale-105 transition-transform">
                        <div className="text-[10px] text-[#059669] font-bold">TELEMETRY</div>
                        <div className="text-xl font-bold text-[#08090c] mt-1">ZERO</div>
                      </div>
                      <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl hover:scale-105 transition-transform">
                        <div className="text-[10px] text-teal-700 font-bold">SECURITY</div>
                        <div className="text-xl font-bold text-[#08090c] mt-1">LOCAL</div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStageProduct.id === 'project-1' && (
                  <div className="space-y-4">
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => setDiffMode('human-ai')}
                        className={`px-3.5 py-1.5 text-xs rounded-xl font-bold cursor-pointer transition ${diffMode === 'human-ai' ? 'bg-[#10B981] text-white shadow-md' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'}`}
                      >
                        Human vs AI Attribution
                      </button>
                      <button
                        onClick={() => setDiffMode('cost')}
                        className={`px-3.5 py-1.5 text-xs rounded-xl font-bold cursor-pointer transition ${diffMode === 'cost' ? 'bg-[#10B981] text-white shadow-md' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'}`}
                      >
                        Token Cost Audit
                      </button>
                    </div>
                    <div className="p-4 bg-[#F4FBF7] border border-[#A7F3D0] text-slate-800 rounded-2xl space-y-2 text-xs font-mono animate-fade-in-up">
                      <div className="text-[#059669] font-bold">// GIT COMMIT ATTRIBUTION LOG</div>
                      <div>commit 9f8a2b1 (HEAD -&gt; main)</div>
                      <div className="text-slate-500">Author: Lead Dev &lt;dev@enterprise.io&gt;</div>
                      {diffMode === 'human-ai' ? (
                        <>
                          <div className="text-blue-600 font-semibold">AI Prompt Linked: "Refactor auth middleware for rate limits"</div>
                          <div className="text-[#10B981] font-bold">+ 48 lines AI generated, - 12 lines refactored</div>
                        </>
                      ) : (
                        <>
                          <div className="text-amber-600 font-semibold">Token Cost: 1,420 tokens (₹350)</div>
                          <div className="text-purple-600 font-semibold">Model Route: Local Quantized Execution</div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {currentStageProduct.id === 'project-2' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#F4FBF7] border border-[#A7F3D0] rounded-2xl">
                      <div className="text-xs text-slate-500 mb-3 font-bold">MULTI-AGENT COLLABORATION PIPELINE</div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {[
                          { name: 'Agent 1: Understanding', role: 'Parsed requirement scope', color: 'text-purple-700' },
                          { name: 'Agent 2: Decomposer', role: 'Split task into 3 sub-tasks', color: 'text-blue-700' },
                          { name: 'Agent 3: Optimizer', role: 'Audited performance path', color: 'text-amber-700' },
                          { name: 'Agent 4: Coder', role: 'Generated verified patch', color: 'text-[#059669]' }
                        ].map((ag, i) => (
                          <div
                            key={i}
                            onClick={() => setActiveAgentIndex(i)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 ${activeAgentIndex === i ? 'bg-white border-[#10B981] shadow-md ring-2 ring-[#10B981]/20 scale-105' : 'bg-white/60 border-slate-200 hover:bg-white'}`}
                          >
                            <div className={`font-bold ${ag.color}`}>{ag.name}</div>
                            <div className="text-slate-500 text-[11px] mt-1">{ag.role}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStageProduct.id === 'project-3' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#F4FBF7] border border-[#A7F3D0] rounded-2xl space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <span className="text-xs font-bold text-[#08090c]"># enterprise-security-channel</span>
                        <span className="text-[10px] text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0] font-bold">E2EE ACTIVE</span>
                      </div>
                      <div className="space-y-2 text-xs max-h-36 overflow-y-auto">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-200 animate-fade-in-up">
                            <div className="font-bold text-slate-800 flex justify-between">
                              <span>{msg.sender}</span>
                              <span className="text-[10px] text-slate-400">{msg.time}</span>
                            </div>
                            <div className="text-slate-600 mt-1">{msg.text}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Type encrypted message test..."
                          className="flex-1 bg-white border border-[#A7F3D0] rounded-xl px-3 py-1.5 text-xs text-[#08090c] focus:outline-none focus:border-[#10B981]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value) {
                              setChatMessages([...chatMessages, { sender: 'You (Encrypted)', text: e.target.value, time: 'Now' }]);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStageProduct.id === 'project-5' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#F4FBF7] border border-[#A7F3D0] text-slate-800 rounded-2xl font-mono text-xs space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#059669] font-bold">// VOICE/TEXT QUERY ASSISTANT</span>
                        <button
                          onClick={() => setSqlQueryExecuted(true)}
                          className="px-3.5 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-xs transition cursor-pointer font-bold shadow-md hover:scale-105"
                        >
                          Execute Test Query
                        </button>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        "Show total enterprise spend per quarter"
                      </div>
                      {sqlQueryExecuted && (
                        <div className="p-3 bg-white rounded-xl border border-[#10B981] text-[#059669] text-[11px] space-y-1 animate-fade-in-up">
                          <div className="font-bold">✓ EXECUTED IN 0.4ms [READ-ONLY GUARDRAIL ENFORCED]</div>
                          <div className="text-slate-700">Q1: ₹1.2 Crores | Q2: ₹1.4 Crores | Q3: ₹1.8 Crores | Q4: ₹2.1 Crores</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Stage Footer CTA */}
              <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 bg-white z-10">
                <div>
                  <div className="font-heading font-bold text-lg text-[#08090c]">
                    {currentStageProduct.name}
                  </div>
                  <div className="font-body text-xs text-slate-500">
                    {currentStageProduct.tagline}
                  </div>
                </div>
                <Link
                  to={`/project/${currentStageProduct.id}`}
                  className="font-mono text-xs bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-md w-full sm:w-auto justify-center hover:scale-105"
                >
                  Open Dedicated Page
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Terminal CLI Simulator */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <InteractiveTerminal />
      </div>

      {/* Section 2: Full Portfolio Showcase Grid (All 20 Projects) */}
      <section id="showcase" className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 mb-20 border-t border-[#A7F3D0]/60">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs text-[#059669] mb-4 font-bold uppercase tracking-widest">
              SEC_02 // COMPLETE_PORTFOLIO_SHOWCASE (20 PROJECTS)
            </div>
            <h2 className="font-heading text-5xl md:text-6xl font-bold tracking-tighter text-[#08090c]">
              Explore all 20 enterprise <br />
              <span className="bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] bg-clip-text text-transparent">
                software applications.
              </span>
            </h2>
          </div>
          <p className="font-body text-lg text-slate-600 max-w-md">
            Click any project card below to navigate directly to its dedicated page featuring custom features and enterprise solutions.
          </p>
        </div>

        {/* Live Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
          
          {/* Category Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {[
              { id: 'all', label: `All (20)` },
              { id: 'ai-tools', label: `AI & Intelligence (${projectsData.filter(p=>p.category==='ai-tools').length})` },
              { id: 'dev-tools', label: `Developer Tools (${projectsData.filter(p=>p.category==='dev-tools').length})` },
              { id: 'finance', label: `Finance & Sales (${projectsData.filter(p=>p.category==='finance').length})` },
              { id: 'productivity', label: `Productivity & Games (${projectsData.filter(p=>p.category==='productivity').length})` },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl font-medium border transition cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-[#10B981] text-white border-transparent shadow-md shadow-emerald-500/20 font-bold scale-105'
                    : 'bg-white text-slate-600 hover:text-[#08090c] border-[#A7F3D0] hover:border-[#10B981]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Interactive Search Box */}
          <div className="relative min-w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 20 projects..."
              className="w-full bg-white border border-[#A7F3D0] rounded-xl px-4 py-2.5 pl-10 text-xs font-mono text-[#08090c] placeholder-slate-400 focus:outline-none focus:border-[#10B981] transition shadow-sm"
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-3 text-slate-400">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-[#08090c] font-mono"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 20 Dynamic Interactive 3D Glassmorphism Cards */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-3xl border border-[#A7F3D0] bg-white">
            <p className="font-mono text-sm text-slate-600 mb-4">No projects found matching "{searchQuery}"</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterCategory('all'); }}
              className="font-mono text-xs bg-[#10B981] text-white px-5 py-2.5 rounded-xl font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="glow-card group p-6 flex flex-col justify-between relative cursor-pointer hover:border-[#10B981] transition-all duration-300"
                style={{
                  '--card-accent': project.color,
                  '--card-accent-border': `rgba(16, 185, 129, 0.4)`,
                  '--card-glow-rgba': `rgba(16, 185, 129, 0.15)`,
                }}
              >
                {/* Shimmer Light Bar */}
                <div className="shimmer-line"></div>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                      style={{ backgroundColor: project.color }}
                      dangerouslySetInnerHTML={{ __html: project.iconSvg }}
                    />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                      {project.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[#08090c] mb-2 group-hover:text-[#10B981] transition-colors">
                    {project.name}
                  </h3>

                  <p className="font-body text-xs text-slate-600 leading-relaxed mb-5 line-clamp-2">
                    {project.summary}
                  </p>

                  <div className="space-y-2 mb-6">
                    {project.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 font-mono text-[11px] text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0 group-hover:scale-150 transition-transform"></span>
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-[#08090c] group-hover:text-[#10B981] transition-colors">
                  <span>OPEN DEDICATED PAGE</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transform group-hover:translate-x-2 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Side-by-Side Product Comparison Matrix */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <ProductComparisonMatrix />
      </div>

      {/* Section 3: Capabilities Bento Grid */}
      <section id="capabilities" className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-[#A7F3D0]/60">
        <div className="mb-16 text-center">
          <div className="font-mono text-xs text-[#059669] mb-4 font-bold uppercase tracking-widest">SEC_03 // CAPABILITIES</div>
          <h2 className="font-heading text-5xl font-bold tracking-tighter text-[#08090c]">Engineered for enterprise scale.</h2>
          <p className="font-body text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
            A unified 20-product ecosystem built on core principles of privacy, performance, and total control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[250px]">
          <div className="glass-panel rounded-3xl p-8 md:col-span-2 md:row-span-2 flex flex-col justify-between bg-white border border-[#A7F3D0] hover:scale-[1.01] transition-transform">
            <div>
              <div className="font-mono text-xs text-[#059669] mb-4 font-bold">01 // LOCAL-FIRST ARCHITECTURE</div>
              <h3 className="font-heading text-3xl font-bold mb-4 text-[#08090c]">Your data stays strictly under your control.</h3>
              <p className="font-body text-slate-600 max-w-lg leading-relaxed">
                Every product in the 20-application Junglans portfolio operates on-device by default. Cloud sync is optional, end-to-end encrypted, and zero-telemetry guaranteed.
              </p>
            </div>
            <div className="font-mono text-xs text-slate-600 grid grid-cols-3 gap-4 mt-8">
              <div className="bg-[#ECFDF5] p-4 rounded-2xl border border-[#A7F3D0] hover:scale-105 transition-transform">
                <div className="text-slate-500 mb-1 text-[10px]">STORAGE</div>
                <div className="text-[#059669] font-bold text-sm">ON-DEVICE</div>
              </div>
              <div className="bg-[#ECFDF5] p-4 rounded-2xl border border-[#A7F3D0] hover:scale-105 transition-transform">
                <div className="text-slate-500 mb-1 text-[10px]">PORTFOLIO</div>
                <div className="text-[#059669] font-bold text-sm">20 APPS</div>
              </div>
              <div className="bg-[#ECFDF5] p-4 rounded-2xl border border-[#A7F3D0] hover:scale-105 transition-transform">
                <div className="text-slate-500 mb-1 text-[10px]">TELEMETRY</div>
                <div className="text-[#059669] font-bold text-sm">ZERO</div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between bg-white border border-[#A7F3D0] hover:scale-105 transition-transform">
            <div>
              <div className="font-mono text-xs text-[#10B981] mb-4 font-bold">02 // PERFORMANCE</div>
              <h3 className="font-heading text-xl font-bold mb-2 text-[#08090c]">Sub-millisecond query execution.</h3>
              <p className="font-body text-sm text-slate-600">Native compilation and optimized algorithms ensure instant responsiveness.</p>
            </div>
            <div className="text-4xl font-bold text-[#10B981] font-mono">0.4ms</div>
          </div>

          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between bg-white border border-[#A7F3D0] hover:scale-105 transition-transform">
            <div>
              <div className="font-mono text-xs text-[#059669] mb-4 font-bold">03 // AI INTEGRATION</div>
              <h3 className="font-heading text-xl font-bold mb-2 text-[#08090c]">Flexible model options.</h3>
              <p className="font-body text-sm text-slate-600">Local model execution or secure enterprise cloud routing.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] font-mono bg-[#ECFDF5] text-[#059669] px-3 py-1 rounded-full border border-[#A7F3D0] font-bold">LOCAL</span>
              <span className="text-[10px] font-mono bg-white text-slate-600 px-3 py-1 rounded-full border border-slate-200 font-bold">CLOUD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance Credentials Matrix */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SecurityComplianceSection />
      </div>

      {/* Interactive Enterprise ROI & Cost Calculator (Indian Rupee ₹) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <EnterpriseCalculator />
      </div>

      {/* FOUNDER & LEAD ARCHITECT SPOTLIGHT (Positioned Right Above SEC_04 Enterprise Deployment) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FounderSpotlight />
      </div>

      {/* Enterprise Deployment CTA (SEC_04) */}
      <section id="enterprise" className="relative max-w-5xl mx-auto px-6 md:px-12 py-24 text-center">
        <div className="glass-panel rounded-3xl p-12 md:p-16 border border-[#A7F3D0] shadow-xl bg-white hover:border-[#10B981] transition-all duration-300">
          <div className="font-mono text-xs text-[#059669] mb-6 font-bold uppercase tracking-widest">SEC_04 // ENTERPRISE_DEPLOYMENT</div>
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-8 tracking-tighter text-[#08090c]">
            Deploy Junglans Solutions <br />
            <span className="bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] bg-clip-text text-transparent">
              for your organization.
            </span>
          </h2>
          <p className="font-body text-lg text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">
            Enterprise licensing for all 20 software products, team onboarding, and custom feature integrations available.
          </p>

          <a
            href="mailto:enterprise@junglans.io"
            className="font-mono text-base bg-[#10B981] hover:bg-[#059669] text-white px-10 py-5 rounded-2xl font-bold transition inline-flex items-center gap-3 shadow-lg shadow-emerald-500/20 hover:-translate-y-1 hover:scale-105 duration-300"
          >
            Contact Enterprise Sales
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </section>

    </div>
  );
}
