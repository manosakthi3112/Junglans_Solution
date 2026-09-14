import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { SITE_URL } from '../config';

export default function AiSoftwareDevelopmentPage() {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What makes Junglans Solutions different from typical AI development agencies?",
      a: "Most agencies build superficial API wrappers around third-party cloud APIs (such as OpenAI or Anthropic), introducing recurring token expenses, privacy leakage, and cloud latency. Junglans Solutions specializes in sovereign, private, and local-first AI software development. We build on-premises LLMs, autonomous multi-agent pipelines (via our open-source 'jung' package), and zero-telemetry software that runs securely inside your enterprise perimeter."
    },
    {
      q: "Can you deploy AI models that run completely offline without internet access?",
      a: "Yes. Our core engineering principle is local-first architecture. We deploy quantized Small Language Models (SLMs) and LLMs (using ONNX Runtime, llama.cpp, and vLLM) directly on enterprise workstations, edge servers, or private private-cloud nodes. Your sensitive IP, customer records, and internal codebase never leave your physical hardware."
    },
    {
      q: "Where is Junglans Solutions located, and do you serve international clients?",
      a: "Junglans Solutions is headquartered in Coimbatore, Tamil Nadu, India. While our engineering hub is in Coimbatore, we engineer software for clients and development teams worldwide, with 5 open-source software libraries on npm and PyPI used internationally."
    },
    {
      q: "How do you ensure auditability and compliance for autonomous AI agents?",
      a: "We integrate our flagship packages @junglans/trail and junglans-trail into every AI workflow. Every model prompt, tool execution, database query, and agent decision is cryptographically journaled to a high-speed local SQLite WAL (Write-Ahead Log), giving your enterprise a tamper-proof audit trail without external telemetry."
    },
    {
      q: "What is the timeline and engagement model for a custom AI software project?",
      a: "We provide end-to-end custom development starting from technical feasibility and data privacy architecture, through rapid prototyping (2 to 4 weeks), to hardened enterprise production deployment (6 to 12 weeks). We offer both dedicated milestone sprints and dedicated engineering pods."
    },
    {
      q: "How does Junglans integrate AI with existing legacy databases and ERP systems?",
      a: "Through our proprietary TalkToDB architecture and custom retrieval pipelines, we build read-only natural language interfaces that query legacy SQL, PostgreSQL, Oracle, or MongoDB databases. Schema metadata is mapped locally, enabling staff to ask complex business questions without risking SQL injection or schema exfiltration."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/ai-software-development#service`,
        "name": "Custom AI Software Development Services",
        "serviceType": "Artificial Intelligence & Machine Learning Software Engineering",
        "description": "Enterprise AI software development company in India specializing in sovereign LLMs, autonomous multi-agent systems, local-first architectures, and private retrieval-augmented generation (RAG).",
        "provider": {
          "@type": "Organization",
          "name": "Junglans Solutions",
          "url": SITE_URL,
          "logo": `${SITE_URL}/squirrel_logo-128.webp`,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Coimbatore",
            "addressRegion": "Tamil Nadu",
            "addressCountry": "IN"
          }
        },
        "areaServed": [
          { "@type": "Country", "name": "India" },
          { "@type": "Country", "name": "United States" },
          { "@type": "Country", "name": "United Kingdom" },
          { "@type": "Country", "name": "Germany" },
          { "@type": "Country", "name": "Singapore" }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "AI Software Development Offerings",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Private Enterprise LLM Deployment & Fine-Tuning"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Autonomous Multi-Agent Systems & Workflow Automation"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Local-First AI Desktop & Edge Applications"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Natural Language Database Interfaces (TalkToDB)"
              }
            }
          ]
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/ai-software-development#breadcrumbs`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${SITE_URL}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Services",
            "item": `${SITE_URL}/#capabilities`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "AI Software Development",
            "item": `${SITE_URL}/ai-software-development`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/ai-software-development#faq`,
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white text-[#08090c]">
      <Seo
        title="AI Software Development Company | Custom Enterprise AI Solutions"
        description="Premier AI software development company based in Coimbatore, India. We engineer custom enterprise AI software, sovereign private LLMs, multi-agent systems, and local-first zero-telemetry architectures."
        path="/ai-software-development"
        keywords="AI software development company, AI software development services, custom AI development India, enterprise AI solutions, private LLM deployment, local AI engineering Coimbatore, multi-agent AI development"
        jsonLd={jsonLd}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-[#F8FAFC] border-b border-[#A7F3D0]/50 py-3 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link to="/" className="hover:text-[#10B981] transition">Home</Link>
          <span>/</span>
          <span className="text-slate-400">Services</span>
          <span>/</span>
          <span className="text-[#059669] font-bold">AI Software Development</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[#ECFDF5]/50 via-white to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-mono uppercase tracking-wider font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            ENTERPRISE AI & SOVEREIGN MACHINE LEARNING
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-[#08090c] tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            AI Software Development <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#059669] via-[#10B981] to-[#047857] bg-clip-text text-transparent">
              Engineered for Sovereignty & Speed
            </span>
          </h1>

          <p className="font-body text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Junglans Solutions architects production-grade AI systems, autonomous multi-agent pipelines, and private on-premises language models. Based in Coimbatore, Tamil Nadu, we deliver zero-telemetry AI applications that keep your proprietary data strictly within your perimeter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs">
            <Link
              to="/contact"
              className="w-full sm:w-auto bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-xl font-bold transition shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
            >
              <span>Schedule Architecture Consultation</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <Link
              to="/packages"
              className="w-full sm:w-auto bg-[#F8FAFC] hover:bg-[#ECFDF5] text-slate-700 hover:text-[#059669] border border-[#A7F3D0] px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm"
            >
              <span>Explore Open Source Packages (5)</span>
              <span className="text-[10px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1.5 py-0.5 rounded font-mono">npm / PyPI</span>
            </Link>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-14">
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-5 text-left shadow-sm hover:border-[#10B981] transition">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#059669]">&lt; 1ms</div>
              <div className="font-heading font-semibold text-xs text-slate-800 mt-1">Local State Sync</div>
              <div className="font-body text-[11px] text-slate-500 mt-0.5">Zero network latency bottlenecks</div>
            </div>
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-5 text-left shadow-sm hover:border-[#10B981] transition">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#059669]">100%</div>
              <div className="font-heading font-semibold text-xs text-slate-800 mt-1">Data Sovereignty</div>
              <div className="font-body text-[11px] text-slate-500 mt-0.5">Air-gapped on-premise execution</div>
            </div>
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-5 text-left shadow-sm hover:border-[#10B981] transition">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#059669]">5 Published</div>
              <div className="font-heading font-semibold text-xs text-slate-800 mt-1">Developer Packages</div>
              <div className="font-body text-[11px] text-slate-500 mt-0.5">Active on npm and PyPI registries</div>
            </div>
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-5 text-left shadow-sm hover:border-[#10B981] transition">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#059669]">Coimbatore</div>
              <div className="font-heading font-semibold text-xs text-slate-800 mt-1">Engineering Hub</div>
              <div className="font-body text-[11px] text-slate-500 mt-0.5">Tamil Nadu, India & Worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Engineering Capabilities */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-white border-t border-[#A7F3D0]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="font-mono text-xs uppercase tracking-widest text-[#059669] font-bold mb-2">
              COMPREHENSIVE CAPABILITIES
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#08090c]">
              End-to-End AI Engineering Services
            </h2>
            <p className="font-body text-sm sm:text-base text-slate-600 mt-3">
              We replace brittle cloud APIs with deterministic, resilient systems tailored to enterprise workloads, compliance standards, and heavy computational throughput.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-7 hover:shadow-md hover:border-[#10B981] transition group">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-5 group-hover:scale-105 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"></path>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2 group-hover:text-[#059669] transition">
                Private Enterprise LLM Deployment
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Self-hosted Large and Small Language Models (Llama 3, Mistral, Gemma, Phi-3) deployed on your private VPC or on-premise hardware using vLLM and TensorRT-LLM with hardware quantization.
              </p>
              <div className="font-mono text-[11px] text-[#059669] font-semibold flex items-center gap-1.5">
                <span>Zero Third-Party Model Training</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-7 hover:shadow-md hover:border-[#10B981] transition group">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-5 group-hover:scale-105 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2 group-hover:text-[#059669] transition">
                Autonomous Multi-Agent Systems
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Coordinated AI worker swarms designed with our Python package <code className="bg-[#ECFDF5] text-[#059669] px-1 rounded font-mono">jung</code>. Automated task planning, state machines, tool calling, and deterministic self-healing pipelines.
              </p>
              <div className="font-mono text-[11px] text-[#059669] font-semibold flex items-center gap-1.5">
                <span>Orchestrated by PyPI: jung</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-7 hover:shadow-md hover:border-[#10B981] transition group">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-5 group-hover:scale-105 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2 group-hover:text-[#059669] transition">
                Natural Language DB Intelligence (TalkToDB)
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Enterprise database querying in plain English. Automated SQL synthesis, schema-aware validation, and read-only execution guardrails to prevent data corruption and injection attacks.
              </p>
              <div className="font-mono text-[11px] text-[#059669] font-semibold flex items-center gap-1.5">
                <span>SQL, PostgreSQL & MongoDB</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-7 hover:shadow-md hover:border-[#10B981] transition group">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-5 group-hover:scale-105 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 17l6-6-6-6"></path>
                  <line x1="12" y1="19" x2="20" y2="19"></line>
                </svg>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2 group-hover:text-[#059669] transition">
                Local-First Desktop & Edge AI Apps
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Native desktop applications powered by Tauri, Electron, and React, coupled with local inference engines. Work completely offline with zero latency, instant boot time, and local SQLite data stores.
              </p>
              <div className="font-mono text-[11px] text-[#059669] font-semibold flex items-center gap-1.5">
                <span>@junglans/trail WAL Integrated</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-7 hover:shadow-md hover:border-[#10B981] transition group">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-5 group-hover:scale-105 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2 group-hover:text-[#059669] transition">
                Private RAG & Hybrid Vector Search
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                High-recall document search over corporate PDF repositories, technical specs, and Slack/Teams records. Built with hybrid sparse-dense embeddings, re-ranking, and air-gapped vector stores.
              </p>
              <div className="font-mono text-[11px] text-[#059669] font-semibold flex items-center gap-1.5">
                <span>Chroma, Qdrant & LanceDB</span>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-7 hover:shadow-md hover:border-[#10B981] transition group">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-5 group-hover:scale-105 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-2.5 1.55v12.42a1.78 1.78 0 0 0 2.5 1.55L16.5 14.6a1.78 1.78 0 0 0 0-3.2z"></path>
                </svg>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2 group-hover:text-[#059669] transition">
                Developer Tooling & Coding Assistants
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Custom in-IDE coding companions (exemplified by our Jung AI Sidecar). Local AST parsing, automated test generation, and pull-request synthesis tuned specifically to your organization's codebase conventions.
              </p>
              <div className="font-mono text-[11px] text-[#059669] font-semibold flex items-center gap-1.5">
                <span>VS Code & JetBrains Extensions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architectural Comparison: Cloud AI Agency vs. Junglans Sovereign AI */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-[#F8FAFC] border-t border-[#A7F3D0]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="font-mono text-xs uppercase tracking-widest text-[#059669] font-bold mb-2">
              ARCHITECTURAL RIGOR
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#08090c]">
              Cloud AI Wrappers vs. Junglans Sovereign AI
            </h2>
            <p className="font-body text-sm sm:text-base text-slate-600 mt-2">
              Why leading enterprises choose local-first, self-hosted intelligence over commoditized third-party API dependencies.
            </p>
          </div>

          <div className="bg-white border border-[#A7F3D0] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#ECFDF5] border-b border-[#A7F3D0] text-[#08090c] font-mono text-[11px] uppercase tracking-wider">
                    <th className="p-4 sm:p-5">Architectural Dimension</th>
                    <th className="p-4 sm:p-5 text-rose-700 bg-rose-50/50">Standard Cloud AI Agencies</th>
                    <th className="p-4 sm:p-5 text-[#059669] bg-emerald-50">Junglans Solutions Architecture</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A7F3D0]/40 font-body">
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900">Data Privacy & Security</td>
                    <td className="p-4 sm:p-5 text-slate-600 bg-rose-50/20">Data sent to US-based cloud servers; subject to vendor retention policies</td>
                    <td className="p-4 sm:p-5 font-semibold text-[#059669] bg-emerald-50/30">100% On-Premise or Private VPC; zero egress telemetry</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900">Latency & Throughput</td>
                    <td className="p-4 sm:p-5 text-slate-600 bg-rose-50/20">500ms – 4000ms dependent on public internet, routing, & cloud throttling</td>
                    <td className="p-4 sm:p-5 font-semibold text-[#059669] bg-emerald-50/30">&lt; 15ms local cache; deterministic local GPU/CPU execution</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900">Operating Cost Predictability</td>
                    <td className="p-4 sm:p-5 text-slate-600 bg-rose-50/20">Exponential monthly per-token API charges; ballooning operational costs</td>
                    <td className="p-4 sm:p-5 font-semibold text-[#059669] bg-emerald-50/30">Zero API token bills; fixed infrastructure cost model</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900">Offline Resilience</td>
                    <td className="p-4 sm:p-5 text-slate-600 bg-rose-50/20">Total application blackout when internet drops or cloud API has outage</td>
                    <td className="p-4 sm:p-5 font-semibold text-[#059669] bg-emerald-50/30">Fully functional offline; background reconciliation via SQLite WAL</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900">Agent Observability</td>
                    <td className="p-4 sm:p-5 text-slate-600 bg-rose-50/20">Proprietary cloud dashboards requiring third-party telemetry agents</td>
                    <td className="p-4 sm:p-5 font-semibold text-[#059669] bg-emerald-50/30">Local-first audit trail via @junglans/trail and junglans-trail</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Technical Deliverables */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-white border-t border-[#A7F3D0]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="font-mono text-xs uppercase tracking-widest text-[#059669] font-bold mb-2">
              PROVEN DEPLOYMENTS
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#08090c]">
              Built with Our Open-Source Packages
            </h2>
            <p className="font-body text-sm sm:text-base text-slate-600 mt-2">
              Our enterprise client applications are powered directly by the open-source software libraries we maintain on npm and PyPI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded font-bold">
                    PyPI PACKAGE
                  </span>
                  <span className="font-mono text-xs text-slate-400">v0.1.0+</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-[#08090c] mb-2">jung</h3>
                <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Autonomous AI agent execution framework for Python. Handles multi-agent handoffs, dynamic schema generation, and deterministic workflow routing for mission-critical enterprise tasks.
                </p>
              </div>
              <div className="pt-4 border-t border-[#A7F3D0]/50 flex items-center justify-between">
                <Link to="/packages/jung" className="text-xs font-mono font-bold text-[#059669] hover:underline flex items-center gap-1">
                  <span>View Documentation</span>
                  <span>↗</span>
                </Link>
                <code className="text-[11px] font-mono bg-white border border-[#A7F3D0] px-2 py-0.5 rounded text-slate-700">pip install jung</code>
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded font-bold">
                    NPM PACKAGE
                  </span>
                  <span className="font-mono text-xs text-slate-400">v0.1.0+</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-[#08090c] mb-2">@junglans/trail</h3>
                <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Local-first event streaming, audit trail, and distributed state persistence library. Backed by SQLite WAL journal modes for sub-millisecond execution in AI client applications.
                </p>
              </div>
              <div className="pt-4 border-t border-[#A7F3D0]/50 flex items-center justify-between">
                <Link to="/packages/trail" className="text-xs font-mono font-bold text-[#059669] hover:underline flex items-center gap-1">
                  <span>View Documentation</span>
                  <span>↗</span>
                </Link>
                <code className="text-[11px] font-mono bg-white border border-[#A7F3D0] px-2 py-0.5 rounded text-slate-700">npm i @junglans/trail</code>
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded font-bold">
                    ENTERPRISE SOFTWARE
                  </span>
                  <span className="font-mono text-xs text-slate-400">Native Desktop</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-[#08090c] mb-2">TalkToDB</h3>
                <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Natural language SQL synthesis engine allowing non-technical managers and business analysts to query live databases securely with zero data transmission to third parties.
                </p>
              </div>
              <div className="pt-4 border-t border-[#A7F3D0]/50 flex items-center justify-between">
                <Link to="/project/project-5" className="text-xs font-mono font-bold text-[#059669] hover:underline flex items-center gap-1">
                  <span>View Project Details</span>
                  <span>↗</span>
                </Link>
                <span className="text-[11px] font-mono text-[#059669] font-bold">100% Read-Only Guardrails</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-[#F8FAFC] border-t border-[#A7F3D0]/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="font-mono text-xs uppercase tracking-widest text-[#059669] font-bold mb-2">
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#08090c]">
              Technical & Engagement FAQ
            </h2>
            <p className="font-body text-sm sm:text-base text-slate-600 mt-2">
              Clear answers on our development approach, data confidentiality, and deployment timelines.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#A7F3D0] rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-[#08090c] hover:text-[#059669] transition"
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.q}</span>
                  <span className={`w-6 h-6 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm font-body text-slate-600 leading-relaxed border-t border-[#A7F3D0]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-12 bg-white border-t border-[#A7F3D0]/50">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#ECFDF5] via-[#F8FAFC] to-[#ECFDF5] border-2 border-[#A7F3D0] rounded-3xl p-8 sm:p-12 text-center shadow-lg shadow-emerald-500/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#A7F3D0] text-[#059669] text-xs font-mono font-bold uppercase mb-4">
            INITIATE YOUR AI TRANSFORMATION
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#08090c] mb-4">
            Build Private, Sovereign AI Software with Junglans
          </h2>
          <p className="font-body text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Partner with our AI architects in Coimbatore, Tamil Nadu, to engineer robust, high-performance software systems that protect your intellectual property and eliminate third-party cloud lock-in.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs">
            <Link
              to="/contact"
              className="w-full sm:w-auto bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-xl font-bold transition shadow-md shadow-emerald-500/20 text-sm"
            >
              Contact Sales & Engineering Pod
            </Link>
            <Link
              to="/team"
              className="w-full sm:w-auto bg-white hover:bg-[#ECFDF5] text-slate-800 border border-[#A7F3D0] px-8 py-4 rounded-xl font-bold transition text-sm"
            >
              Meet Our AI Engineering Team ↗
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
