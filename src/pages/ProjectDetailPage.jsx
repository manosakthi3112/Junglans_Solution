import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectsData } from '../data/projectsData';
import Seo from '../components/Seo';
import FaqSection from '../components/FaqSection';
import { SITE_URL, SITE_NAME } from '../config';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [selectedHighlightIndex, setSelectedHighlightIndex] = useState(null);
  const [teamSize, setTeamSize] = useState(25);
  const [simulatorStep, setSimulatorStep] = useState(1);
  const [interactiveAlert, setInteractiveAlert] = useState('');

  const project = projectsData.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveFeatureIndex(0);
    setSelectedHighlightIndex(null);
    setSimulatorStep(1);
    setInteractiveAlert('');
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center text-[#08090c]">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Project Not Found</h2>
        <p className="font-body text-slate-600 mb-8">The project page you requested does not exist in our portfolio catalog.</p>
        <Link to="/" className="font-mono text-xs bg-[#10B981] text-white px-6 py-3 rounded-xl font-bold">
          Return to Portfolio
        </Link>
      </div>
    );
  }

  // Calculated enterprise ROI estimates in Indian Rupees (₹)
  const hoursSavedPerMonth = Math.round(teamSize * 18.5);
  const estimatedCostSavings = (hoursSavedPerMonth * 650).toLocaleString('en-IN');

  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] bg-precision-grid py-8 sm:py-12 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      <Seo
        title={`${project.name} — ${project.tagline}`}
        description={`${project.summary} ${project.name} by ${SITE_NAME}: ${project.promotions.valueProposition}`.slice(0, 158)}
        path={`/project/${project.id}`}
        type="softwareApplication"
        keywords={project.seoKeywords}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: project.name,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Windows, macOS, Linux, Android, iOS, Web',
            description: project.summary,
            url: `${SITE_URL}/project/${project.id}`,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Enterprise licensing — contact sales' },
            publisher: { '@type': 'Organization', name: 'Junglans Solutions', url: SITE_URL },
            featureList: project.features.map((f) => f.title),
            keywords: project.seoKeywords
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${SITE_URL}/#showcase` },
              { '@type': 'ListItem', position: 3, name: project.name, item: `${SITE_URL}/project/${project.id}` }
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: project.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
          }
        ]}
      />
      
      {/* Dynamic Brand Ambient Halo */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[350px] sm:w-[800px] h-[300px] sm:h-[500px] rounded-full blur-[150px] pointer-events-none opacity-20"
        style={{ backgroundColor: project.color }}
      ></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-[#A7F3D0]/60">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-600">
            <Link to="/" className="hover:text-[#10B981] transition font-bold">Home</Link>
            <span className="text-[#A7F3D0]">/</span>
            <Link to="/#showcase" className="hover:text-[#10B981] transition font-bold">Portfolio</Link>
            <span className="text-[#A7F3D0]">/</span>
            <span className="text-[#059669] font-bold truncate max-w-[180px] sm:max-w-none">{project.name}</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="font-mono text-xs text-slate-600 hover:text-[#10B981] transition flex items-center gap-2 font-bold cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to All 20 Projects
          </button>
          
          <span className="font-mono text-[10px] text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0] font-bold uppercase tracking-wider">
            Dedicated Product Showcase Page
          </span>
        </nav>

        {/* Hero Section of Dedicated Product Page */}
        <div className="glass-panel rounded-3xl p-5 sm:p-8 md:p-12 mb-6 sm:mb-12 bg-white border border-[#A7F3D0] shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 animate-float"
                style={{ backgroundColor: project.color }}
                dangerouslySetInnerHTML={{ __html: project.iconSvg }}
              />

              <div className="min-w-0">
                <span className="font-mono text-[9px] sm:text-xs font-bold uppercase tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] inline-block mb-1">
                  {project.badge}
                </span>
                <h1 className="font-heading text-2xl min-[360px]:text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-[#08090c] truncate">
                  {project.name}
                </h1>
              </div>
            </div>

            <p className="font-heading text-base sm:text-xl md:text-2xl text-[#059669] font-medium mb-3 sm:mb-4 leading-snug">
              {project.tagline}
            </p>

            <p className="font-body text-xs sm:text-base md:text-lg text-slate-700 max-w-3xl leading-relaxed mb-6 sm:mb-8">
              {project.summary}
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 pt-4 border-t border-[#E2E8F0]">
              <a
                href="#highlights"
                className="font-mono text-xs bg-[#10B981] hover:bg-[#059669] text-white px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 text-center"
              >
                Explore Feature Cards
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <a
                href="mailto:enterprise@junglans.io"
                className="font-mono text-xs bg-white text-[#08090c] border border-[#A7F3D0] px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-bold hover:bg-[#ECFDF5] transition text-center"
              >
                Request Enterprise Pilot
              </a>
            </div>
          </div>
        </div>

        {/* What Is This Product? (SEO & GEO) */}
        <section className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 mb-10 sm:mb-12 bg-white border border-[#A7F3D0] shadow-md">
          <div className="font-mono text-xs text-[#059669] mb-2 font-bold uppercase tracking-widest">PRODUCT OVERVIEW</div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] mb-4">
            What is {project.name}?
          </h2>
          <p className="font-body text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl mb-4">
            {project.name} is {project.summary.charAt(0).toLowerCase() + project.summary.slice(1)} Designed by {SITE_NAME},
            it {project.promotions.valueProposition.charAt(0).toLowerCase() + project.promotions.valueProposition.slice(1)}
          </p>
          <p className="font-body text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl mb-6">
            {project.name} is built for enterprises that need {project.seoKeywords.split(',')[0]} — with a
            local-first architecture, zero cloud telemetry, and compliance-ready security baked into every workflow.
          </p>
          <div className="flex flex-wrap gap-2 font-mono text-[10px] sm:text-xs">
            {project.seoKeywords.split(',').slice(0, 4).map((kw) => (
              <span key={kw} className="bg-[#ECFDF5] text-[#059669] px-3 py-1.5 rounded-full border border-[#A7F3D0] font-bold">
                {kw.trim()}
              </span>
            ))}
          </div>
          <p className="font-mono text-xs text-slate-500 mt-6 pt-4 border-t border-[#A7F3D0]">
            Enterprise licensing available — request a pilot at enterprise@junglans.io
          </p>
        </section>

        {/* Enterprise Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
          {project.metrics.map((m, idx) => (
            <div key={idx} className="glass-panel p-4 sm:p-5 rounded-2xl bg-white border border-[#A7F3D0] text-center shadow-sm">
              <div className="font-mono text-[9px] sm:text-[10px] text-[#059669] tracking-wider uppercase font-bold mb-1 truncate">{m.label}</div>
              <div className="font-heading text-xl sm:text-2xl font-bold text-[#08090c] truncate">{m.value}</div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE SQUARE FEATURE HIGHLIGHT CARDS GRID */}
        <div id="highlights" className="mb-10 sm:mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="font-mono text-xs text-[#059669] font-bold uppercase tracking-widest">CAPABILITY HIGHLIGHTS</div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] mt-1">Interactive Feature Highlights</h2>
            </div>
            <div className="font-mono text-xs text-slate-500 bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0] font-bold text-[#059669] w-fit">
              CLICK CARDS TO SIMULATE FEATURE
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {project.highlights.map((highlight, idx) => {
              const isSelected = selectedHighlightIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedHighlightIndex(isSelected ? null : idx)}
                  className={`glow-card p-5 sm:p-6 rounded-3xl bg-white border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[200px] sm:min-h-[220px] ${
                    isSelected
                      ? 'border-[#10B981] ring-2 ring-[#10B981]/30 shadow-xl scale-[1.02]'
                      : 'border-[#A7F3D0] hover:border-[#10B981] shadow-md'
                  }`}
                >
                  <div className="shimmer-line"></div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono text-xs sm:text-sm font-bold flex items-center justify-center">
                        0{idx + 1}
                      </span>
                      <span className={`font-mono text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full uppercase transition-colors ${isSelected ? 'bg-[#10B981] text-white' : 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'}`}>
                        {isSelected ? 'ACTIVE FEATURE' : 'FEATURE CARD'}
                      </span>
                    </div>

                    <h3 className="font-heading text-base sm:text-lg font-bold text-[#08090c] mb-2">
                      {highlight}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs font-bold text-[#059669]">
                    <span>{isSelected ? '✓ ACTIVE DEMO' : 'CLICK TO TEST'}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transform transition-transform ${isSelected ? 'rotate-90' : ''}`}>
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Feature Demo Sandbox Drawer */}
          {selectedHighlightIndex !== null && (
            <div className="mt-6 p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#10B981] shadow-xl animate-fade-in-up">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <div className="font-mono text-xs font-bold text-[#059669] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping flex-shrink-0"></span>
                  <span className="truncate max-w-[240px] sm:max-w-none">INTERACTIVE FEATURE SIMULATION: {project.highlights[selectedHighlightIndex]}</span>
                </div>
                <button
                  onClick={() => setSelectedHighlightIndex(null)}
                  className="font-mono text-xs text-slate-400 hover:text-[#08090c] font-bold"
                >
                  ✕ Close Simulator
                </button>
              </div>

              <div className="p-4 bg-[#F4FBF7] rounded-2xl border border-[#A7F3D0] font-mono text-xs text-slate-700 space-y-2">
                <div className="font-bold text-[#059669]">// FEATURE EXECUTING ON LOCAL DEVICE...</div>
                <div>Status: Module 0{selectedHighlightIndex + 1} initialized in 0.35ms.</div>
                <div>Telemetry: 0 bytes uploaded to external cloud. Zero-Trust verified.</div>
                <div className="text-[#10B981] font-bold">✔ RESULT: Feature output verified with 100% precision.</div>
              </div>
            </div>
          )}
        </div>

        {/* WHY CHOOSE THIS PRODUCT? CARDS GRID */}
        <div className="mb-10 sm:mb-14">
          <div className="font-mono text-xs text-[#059669] mb-2 font-bold uppercase tracking-widest">PRODUCT ADVANTAGE</div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] mb-6">Why Choose {project.name}?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="glass-panel p-6 rounded-3xl bg-white border border-[#A7F3D0] shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono text-lg font-bold flex items-center justify-center mb-4">
                  01
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#08090c] mb-2">100% On-Device Performance</h3>
                <p className="font-body text-xs text-slate-600 leading-relaxed">
                  Native compilation guarantees zero latency bottlenecks and instant execution speed across all enterprise workflows.
                </p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl bg-white border border-[#A7F3D0] shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono text-lg font-bold flex items-center justify-center mb-4">
                  02
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#08090c] mb-2">Zero Cloud Telemetry</h3>
                <p className="font-body text-xs text-slate-600 leading-relaxed">
                  Your intellectual property stays strictly on local machines with end-to-end encryption and air-gapped readiness.
                </p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl bg-white border border-[#A7F3D0] shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono text-lg font-bold flex items-center justify-center mb-4">
                  03
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#08090c] mb-2">5X Productivity Acceleration</h3>
                <p className="font-body text-xs text-slate-600 leading-relaxed">
                  Automated workflows, AI assistance, and seamless pipeline integrations reduce operational friction by over 80%.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works + Use Cases (SEO & GEO) */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
          <section className="glass-panel rounded-3xl p-6 sm:p-8 bg-white border border-[#A7F3D0] shadow-md">
            <div className="font-mono text-xs text-[#059669] mb-2 font-bold uppercase tracking-widest">HOW IT WORKS</div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] mb-6">How {project.name} works</h2>
            <div className="space-y-4">
              {project.howItWorks.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#08090c] mb-1">{step.step}</h3>
                    <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-3xl p-6 sm:p-8 bg-white border border-[#A7F3D0] shadow-md">
            <div className="font-mono text-xs text-[#059669] mb-2 font-bold uppercase tracking-widest">USE CASES</div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] mb-6">Who uses {project.name}</h2>
            <div className="space-y-4">
              {project.useCases.map((useCase, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F4FBF7] border border-[#A7F3D0]">
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#08090c] mb-1">{useCase.title}</h3>
                  <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">{useCase.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Interactive Feature Simulator Widget */}
        <section id="simulator" className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 mb-10 sm:mb-12 bg-white border border-[#A7F3D0] shadow-xl relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2E8F0]">
            <div>
              <div className="font-mono text-xs text-[#059669] font-bold uppercase tracking-widest">LIVE PRODUCT DEMO SIMULATOR</div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#08090c] mt-1">Interactive Feature Execution Engine</h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#059669] bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0] w-fit">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
              <span className="font-bold">SIMULATOR ACTIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 font-mono text-xs">
              <div className="p-4 bg-[#F4FBF7] rounded-2xl border border-[#A7F3D0] space-y-3">
                <div className="text-slate-600 font-bold uppercase flex justify-between">
                  <span>Current Step: Module {simulatorStep} of 3</span>
                  <span className="text-[#059669]">STATUS: READY</span>
                </div>
                
                {simulatorStep === 1 && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700">
                    Step 1: Input requirement & feature scope for {project.name}.
                  </div>
                )}
                {simulatorStep === 2 && (
                  <div className="p-3 bg-white rounded-xl border border-[#10B981] text-[#059669] font-semibold">
                    Step 2: Processing automated feature rules & local analysis...
                  </div>
                )}
                {simulatorStep === 3 && (
                  <div className="p-3 bg-white rounded-xl border border-[#10B981] text-[#059669] font-semibold">
                    Step 3: Verification complete! Enterprise report generated with zero telemetry.
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const nextStep = simulatorStep >= 3 ? 1 : simulatorStep + 1;
                      setSimulatorStep(nextStep);
                      setInteractiveAlert(`Simulated Step ${nextStep} executed successfully.`);
                    }}
                    className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold cursor-pointer transition shadow-sm"
                  >
                    Execute Step {simulatorStep >= 3 ? '1 (Restart)' : simulatorStep + 1} ▶
                  </button>
                </div>
              </div>

              {interactiveAlert && (
                <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-[#059669] text-xs font-mono font-bold">
                  {interactiveAlert}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 p-5 sm:p-6 bg-[#F4FBF7] rounded-2xl border border-[#A7F3D0]">
              <div className="font-mono text-xs text-[#059669] font-bold mb-3 uppercase">PROJECT CAPABILITY SNAPSHOT</div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-700">
                  <span>Productivity Factor:</span>
                  <span className="text-[#059669] font-bold">5X Acceleration</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Privacy Guarantee:</span>
                  <span className="text-[#059669] font-bold">100% On-Device</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Compliance Audit:</span>
                  <span className="text-[#059669] font-bold">Verified Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Enterprise ROI & Impact Estimator (Indian Rupee ₹) */}
        <section className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 mb-10 sm:mb-12 bg-white border border-[#A7F3D0] shadow-xl">
          <div className="font-mono text-xs text-[#059669] mb-2 font-bold uppercase tracking-widest">ENTERPRISE ROI & VALUE CALCULATOR</div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] mb-6">Estimate Business Impact for Your Organization</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex justify-between font-mono text-xs text-slate-700 mb-2">
                  <span>Select Organization / Team Size:</span>
                  <span className="text-[#059669] font-bold">{teamSize} Members</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                />
              </div>
              <p className="font-body text-xs text-slate-600 leading-relaxed">
                Adjust slider to calculate estimated developer hours saved and financial savings when deploying {project.name} across your workforce.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 sm:p-5 bg-[#ECFDF5] rounded-2xl border border-[#A7F3D0] text-center">
                <div className="font-mono text-[9px] sm:text-[10px] text-[#059669] font-bold uppercase mb-1">ESTIMATED HOURS SAVED / MO</div>
                <div className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c]">{hoursSavedPerMonth.toLocaleString('en-IN')} hrs</div>
              </div>
              <div className="p-4 sm:p-5 bg-[#ECFDF5] rounded-2xl border border-[#A7F3D0] text-center">
                <div className="font-mono text-[9px] sm:text-[10px] text-[#059669] font-bold uppercase mb-1">ESTIMATED VALUE CREATED / YR</div>
                <div className="font-heading text-2xl sm:text-3xl font-bold text-[#10B981] break-all sm:break-normal">₹{estimatedCostSavings}</div>
              </div>
            </div>
          </div>
        </section>

        {/* PROMOTIONAL VALUE PROPOSITION */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 mb-10 sm:mb-12 bg-white text-[#08090c] border-2 border-[#10B981]/40 shadow-xl relative overflow-hidden">
          <div className="font-mono text-xs text-[#059669] mb-3 font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping flex-shrink-0"></span>
            ENTERPRISE SOLUTION HIGHLIGHT
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] mb-4">{project.promotions.heroHeadline}</h2>
          <p className="font-body text-[#1F2937] leading-relaxed mb-6 max-w-4xl text-sm sm:text-base font-medium">
            {project.promotions.valueProposition}
          </p>

          <div className="space-y-3 font-mono text-xs text-slate-800 border-t border-[#E2E8F0] pt-6">
            {project.promotions.keyBenefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2.5 bg-[#F4FBF7] rounded-xl border border-[#A7F3D0]">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">✓</span>
                <span className="font-bold text-[#08090c]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Feature Explorer Tabs */}
        <div className="mb-10 sm:mb-12">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6 sm:mb-8 pb-3 border-b border-[#A7F3D0]/60">
            <div>
              <div className="font-mono text-xs text-[#059669] mb-1 font-bold uppercase tracking-wider">FEATURE EXPLORER</div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c]">Interactive Feature Breakdown</h2>
            </div>
            <span className="font-mono text-xs text-slate-600 font-bold">{project.features.length} MODULES</span>
          </div>

          {/* Module Selector Pills */}
          <div className="flex overflow-x-auto pb-2 sm:pb-0 max-w-full no-scrollbar sm:flex-wrap gap-2 mb-6 font-mono text-xs">
            {project.features.map((feat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFeatureIndex(idx)}
                className={`px-4 py-2 rounded-xl border transition cursor-pointer font-bold whitespace-nowrap ${
                  activeFeatureIndex === idx
                    ? 'bg-[#10B981] text-white border-transparent shadow-md'
                    : 'bg-white text-slate-600 border-[#A7F3D0] hover:bg-[#ECFDF5]'
                }`}
              >
                Module 0{idx + 1}
              </button>
            ))}
          </div>

          {/* Active Feature Display Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white border border-[#A7F3D0] shadow-xl">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono text-sm sm:text-base font-bold flex items-center justify-center flex-shrink-0">
                0{activeFeatureIndex + 1}
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#08090c]">
                {project.features[activeFeatureIndex].title}
              </h3>
            </div>
            <p className="font-body text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl">
              {project.features[activeFeatureIndex].desc}
            </p>
          </div>
        </div>

        {/* FAQ Section (SEO & GEO) */}
        <FaqSection
          heading={`${project.name} — Frequently Asked Questions`}
          intro={`Common questions about ${project.name}, its capabilities, security, and how it fits into the Junglans enterprise ecosystem.`}
          items={project.faq}
        />

        {/* Comparison Paragraph (SEO & GEO) */}
        <section className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 mb-10 sm:mb-12 bg-white border border-[#A7F3D0] shadow-md">
          <div className="font-mono text-xs text-[#059669] mb-2 font-bold uppercase tracking-widest">HOW WE COMPARE</div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] mb-4">
            {project.name} vs traditional enterprise software
          </h2>
          <div className="font-body text-sm sm:text-base text-slate-600 leading-relaxed space-y-4 max-w-4xl">
            <p>
              Unlike typical SaaS products that depend on cloud servers and constant connectivity, {project.name} runs
              on-device with a local-first architecture. There is no mandatory telemetry, no silent data collection, and
              no vendor lock-in on your most sensitive information.
            </p>
            <p>
              {project.name} is part of the 20-product Junglans ecosystem, which means it shares the same engineering
              standards across the portfolio: compiled Rust and C++ binaries, AES-256-GCM encryption, memory-safe
              execution, and SOC 2 Type II ready compliance. Teams that need air-gapped, zero-trust deployments get the
              same capabilities they would expect from a cloud suite — without the cloud.
            </p>
          </div>
        </section>

        {/* Bottom Call to Action */}
        <div className="text-center py-8 sm:py-12 border-t border-[#A7F3D0]/60">
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] mb-4">
            Ready to integrate {project.name}?
          </h3>
          <p className="font-body text-sm sm:text-base text-slate-600 mb-8 max-w-md mx-auto">
            Contact our engineering solutions team for custom deployment, enterprise pilots, and licensing details.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <a
              href="mailto:enterprise@junglans.io"
              className="font-mono text-xs bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-xl font-bold transition shadow-lg shadow-emerald-500/20 text-center"
            >
              Get Started with {project.name}
            </a>
            <Link
              to="/"
              className="font-mono text-xs bg-white border border-[#A7F3D0] text-[#08090c] px-6 py-4 rounded-xl font-bold hover:bg-[#ECFDF5] transition text-center"
            >
              Back to Full Portfolio (20 Projects)
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
