import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { SITE_URL } from '../config';

export default function EnterpriseAiPage() {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does Junglans deploy Enterprise AI within an air-gapped corporate network?",
      a: "We package quantized models (GGUF, AWQ, GPTQ) alongside containerized inference runtimes (vLLM, Ollama, ONNX Runtime) inside self-contained Docker/Podman environments. These containers require zero outbound internet connectivity, meaning sensitive intellectual property, patient records, or financial transactions never leave your secure internal perimeter."
    },
    {
      q: "How do we prevent AI models from hallucinatory or rogue tool execution?",
      a: "We enforce strict deterministic guardrails. By combining structured JSON schema output validation with state machines powered by our 'jung' multi-agent framework and cryptographic event logging in '@junglans/trail', all model actions are validated against explicit role-based access policies before execution."
    },
    {
      q: "Can Junglans Enterprise AI integrate with active directory, LDAP, and enterprise SSO?",
      a: "Yes. Our enterprise deployments integrate seamlessly with Okta, Azure Active Directory (Microsoft Entra ID), Keycloak, and standard SAML 2.0 / OAuth2 providers to guarantee fine-grained role-based access control (RBAC) across documents and model outputs."
    },
    {
      q: "What hardware or compute infrastructure is required to host private enterprise models?",
      a: "Modern 4-bit and 8-bit quantized Small Language Models (e.g., Llama 3 8B, Mistral 7B, Gemma 2 9B) can execute on single consumer GPUs (like RTX 4090 or Apple Silicon M2/M3/M4 Max) or modest enterprise servers (NVIDIA A10G/L4/A100). We right-size model architectures so you achieve low latency without millions in GPU overhead."
    },
    {
      q: "How is compliance and privacy addressed for HIPAA and GDPR?",
      a: "Because our software is architected with a local-first, zero-telemetry philosophy, data never leaves your chosen infrastructure. There are no third-party cloud data brokers, no outbound telemetry beacons, and all interactions are journaled locally into SQLite WAL logs for immediate auditor inspection."
    },
    {
      q: "What ongoing maintenance and support does Junglans Solutions provide?",
      a: "We offer dedicated Enterprise SLAs covering quarterly model upgrades, security patches, hardware optimization, performance tuning, and 24/7 incident response from our engineering center in Coimbatore, Tamil Nadu, India."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/enterprise-ai#service`,
        "name": "Enterprise AI Solutions & Private Infrastructure",
        "serviceType": "Enterprise Artificial Intelligence Architecture & Deployment",
        "description": "Sovereign enterprise AI solutions engineered for corporate security, on-premises execution, zero cloud telemetry, and autonomous multi-agent task automation.",
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
          "name": "Enterprise AI Portfolio",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Air-Gapped Private LLM Deployments"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Enterprise Multi-Agent Workflow Orchestration"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Private Document Vaults & Sovereign RAG"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Cryptographic Audit Trail Logging (@junglans/trail)"
              }
            }
          ]
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/enterprise-ai#breadcrumbs`,
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
            "name": "Enterprise AI",
            "item": `${SITE_URL}/enterprise-ai`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/enterprise-ai#faq`,
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
        title="Enterprise AI Solutions | Private LLMs & Multi-Agent Systems"
        description="Transform your enterprise with private, air-gapped AI solutions. We deliver sovereign on-premise LLMs, autonomous multi-agent pipelines, and zero-telemetry software for global corporations."
        path="/enterprise-ai"
        keywords="enterprise AI solutions, private LLM deployment, air-gapped AI, on-premise AI systems, enterprise multi-agent workflows, corporate AI architecture India, zero telemetry enterprise AI"
        jsonLd={jsonLd}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-[#F8FAFC] border-b border-[#A7F3D0]/50 py-3 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link to="/" className="hover:text-[#10B981] transition">Home</Link>
          <span>/</span>
          <span className="text-slate-400">Services</span>
          <span>/</span>
          <span className="text-[#059669] font-bold">Enterprise AI</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[#ECFDF5]/50 via-white to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-mono uppercase tracking-wider font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            MISSION-CRITICAL CORPORATE INTELLIGENCE
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-[#08090c] tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            Enterprise AI Solutions: <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#059669] via-[#10B981] to-[#047857] bg-clip-text text-transparent">
              Sovereign, Air-Gapped & Auditable
            </span>
          </h1>

          <p className="font-body text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Empower your organization with custom enterprise artificial intelligence engineered for air-gapped security, zero external telemetry, and absolute intellectual property containment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs">
            <Link
              to="/contact"
              className="w-full sm:w-auto bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-xl font-bold transition shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
            >
              <span>Request Enterprise Briefing</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <a
              href="/#enterprise"
              className="w-full sm:w-auto bg-[#F8FAFC] hover:bg-[#ECFDF5] text-slate-700 hover:text-[#059669] border border-[#A7F3D0] px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm"
            >
              <span>Explore Enterprise Architecture</span>
            </a>
          </div>

          {/* Key Enterprise Guarantees Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-14">
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-5 text-left shadow-sm">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#059669]">Air-Gapped</div>
              <div className="font-heading font-semibold text-xs text-slate-800 mt-1">Total Isolation</div>
              <div className="font-body text-[11px] text-slate-500 mt-0.5">Runs without public internet access</div>
            </div>
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-5 text-left shadow-sm">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#059669]">Zero Data Leak</div>
              <div className="font-heading font-semibold text-xs text-slate-800 mt-1">IP Protection</div>
              <div className="font-body text-[11px] text-slate-500 mt-0.5">No vendor retention or AI retraining</div>
            </div>
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-5 text-left shadow-sm">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#059669]">WAL Traced</div>
              <div className="font-heading font-semibold text-xs text-slate-800 mt-1">Cryptographic Audit</div>
              <div className="font-body text-[11px] text-slate-500 mt-0.5">Immutable local SQLite event trails</div>
            </div>
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-5 text-left shadow-sm">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#059669]">Fixed Cost</div>
              <div className="font-heading font-semibold text-xs text-slate-800 mt-1">Predictable Budget</div>
              <div className="font-body text-[11px] text-slate-500 mt-0.5">Zero surprise per-token cloud bills</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Pillars Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-white border-t border-[#A7F3D0]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="font-mono text-xs uppercase tracking-widest text-[#059669] font-bold mb-2">
              ENTERPRISE PILLARS
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#08090c]">
              Architected for High-Assurance Workloads
            </h2>
            <p className="font-body text-sm sm:text-base text-slate-600 mt-3">
              We design enterprise systems where security, compliance, speed, and privacy are first-class architectural constraints, not afterthoughts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-7 hover:shadow-md hover:border-[#10B981] transition group">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-5 group-hover:scale-105 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2 group-hover:text-[#059669] transition">
                Sovereign Model Infrastructure
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Self-hosted model deployments on private bare-metal clusters, AWS GovCloud, or on-premise workstations. Optimized with vLLM, flash-attention, and dynamic batching for peak multi-user throughput.
              </p>
              <div className="font-mono text-[11px] text-[#059669] font-semibold">Zero Cloud Vendor Lock-In</div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-7 hover:shadow-md hover:border-[#10B981] transition group">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-5 group-hover:scale-105 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2 group-hover:text-[#059669] transition">
                Multi-Agent Workflow Automation
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Deploy autonomous agent networks orchestrating complex internal workflows: contract analysis, financial reconciliations, DevOps incident triage, and automated code review with human-in-the-loop safeguards.
              </p>
              <div className="font-mono text-[11px] text-[#059669] font-semibold">Powered by PyPI: jung</div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-7 hover:shadow-md hover:border-[#10B981] transition group">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-5 group-hover:scale-105 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2 group-hover:text-[#059669] transition">
                Private Enterprise Document Vaults
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Secure retrieval-augmented generation (RAG) across millions of internal patents, clinical trials, internal wikis, and ERP records. Zero external API leaks with air-gapped vector stores.
              </p>
              <div className="font-mono text-[11px] text-[#059669] font-semibold">Hybrid Dense & Sparse Search</div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-7 hover:shadow-md hover:border-[#10B981] transition group">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-5 group-hover:scale-105 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2 group-hover:text-[#059669] transition">
                Compliance & Zero-Telemetry Architecture
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Designed to meet strict regulatory expectations (GDPR, HIPAA, and air-gapped standards). Software contains zero tracking scripts, no phone-home mechanisms, and zero hidden analytical beacons.
              </p>
              <div className="font-mono text-[11px] text-[#059669] font-semibold">Verifiable Open Source Codebase</div>
            </div>

            {/* Pillar 5 */}
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-7 hover:shadow-md hover:border-[#10B981] transition group">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-5 group-hover:scale-105 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2 group-hover:text-[#059669] transition">
                Immutable Local Event Auditing
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Every prompt, model generation, agent step, and authorization decision is persisted immediately to high-speed SQLite Write-Ahead Logs via <code className="bg-[#ECFDF5] text-[#059669] px-1 rounded font-mono">@junglans/trail</code>.
              </p>
              <div className="font-mono text-[11px] text-[#059669] font-semibold">npm: @junglans/trail-server</div>
            </div>

            {/* Pillar 6 */}
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-7 hover:shadow-md hover:border-[#10B981] transition group">
              <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-5 group-hover:scale-105 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2 group-hover:text-[#059669] transition">
                Continuous Fine-Tuning & Quantization
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                We fine-tune open-weights models (using LoRA, QLoRA, and DPO) directly on your enterprise vocabulary, terminology, and workflows, optimizing them for maximum accuracy and minimal inference latency.
              </p>
              <div className="font-mono text-[11px] text-[#059669] font-semibold">Custom Domain Adaptation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Deployment Blueprint (100% Light Theme) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-[#F8FAFC] border-t border-[#A7F3D0]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="font-mono text-xs uppercase tracking-widest text-[#059669] font-bold mb-2">
              SYSTEM ARCHITECTURE
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#08090c]">
              Enterprise Sovereign Pipeline
            </h2>
            <p className="font-body text-sm sm:text-base text-slate-600 mt-2">
              A breakdown of how enterprise requests traverse private infrastructure without touching external cloud services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#A7F3D0] rounded-2xl p-6 shadow-sm">
              <div className="font-mono text-xs text-[#059669] font-bold mb-2">STEP 01</div>
              <h4 className="font-heading font-bold text-base text-[#08090c] mb-2">Internal Client Request</h4>
              <p className="font-body text-xs text-slate-600 leading-relaxed">
                User interacts via native desktop app (React + @junglans/trail-react) or internal Web UI with zero public internet routing.
              </p>
            </div>

            <div className="bg-white border border-[#A7F3D0] rounded-2xl p-6 shadow-sm">
              <div className="font-mono text-xs text-[#059669] font-bold mb-2">STEP 02</div>
              <h4 className="font-heading font-bold text-base text-[#08090c] mb-2">Audit & State Ingestion</h4>
              <p className="font-body text-xs text-slate-600 leading-relaxed">
                @junglans/trail records request timestamp, user role, and parameters directly to local SQLite WAL with cryptographic integrity.
              </p>
            </div>

            <div className="bg-white border border-[#A7F3D0] rounded-2xl p-6 shadow-sm">
              <div className="font-mono text-xs text-[#059669] font-bold mb-2">STEP 03</div>
              <h4 className="font-heading font-bold text-base text-[#08090c] mb-2">Sovereign Model Inference</h4>
              <p className="font-body text-xs text-slate-600 leading-relaxed">
                Private on-premise GPU cluster executes quantized LLM or multi-agent swarm using Python 'jung' framework.
              </p>
            </div>

            <div className="bg-white border border-[#A7F3D0] rounded-2xl p-6 shadow-sm">
              <div className="font-mono text-xs text-[#059669] font-bold mb-2">STEP 04</div>
              <h4 className="font-heading font-bold text-base text-[#08090c] mb-2">Sanitized Output Delivery</h4>
              <p className="font-body text-xs text-slate-600 leading-relaxed">
                Output evaluated against enterprise guardrails, returned to client at &lt; 20ms latency with zero data leakage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise FAQ Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-white border-t border-[#A7F3D0]/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="font-mono text-xs uppercase tracking-widest text-[#059669] font-bold mb-2">
              ENTERPRISE QUESTIONS & COMPLIANCE
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#08090c]">
              Enterprise AI FAQ
            </h2>
            <p className="font-body text-sm sm:text-base text-slate-600 mt-2">
              Detailed answers for CTOs, CISOs, and enterprise IT decision-makers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl overflow-hidden transition"
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

      {/* Enterprise Bottom CTA Banner */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-12 bg-[#F8FAFC] border-t border-[#A7F3D0]/50">
        <div className="max-w-5xl mx-auto bg-white border-2 border-[#A7F3D0] rounded-3xl p-8 sm:p-12 text-center shadow-lg shadow-emerald-500/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-mono font-bold uppercase mb-4">
            ENTERPRISE DEPLOYMENT READY
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#08090c] mb-4">
            Secure Your Enterprise AI Architecture Today
          </h2>
          <p className="font-body text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Schedule a technical consultation with our engineering architects in Coimbatore, India. We analyze your corporate infrastructure and deliver a sovereign AI deployment roadmap.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs">
            <Link
              to="/contact"
              className="w-full sm:w-auto bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-xl font-bold transition shadow-md shadow-emerald-500/20 text-sm"
            >
              Contact Enterprise Architecture Team
            </Link>
            <Link
              to="/packages"
              className="w-full sm:w-auto bg-[#F8FAFC] hover:bg-[#ECFDF5] text-slate-800 border border-[#A7F3D0] px-8 py-4 rounded-xl font-bold transition text-sm"
            >
              Inspect Open Source Codebases ↗
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
