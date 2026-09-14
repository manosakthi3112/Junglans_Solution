import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { SITE_URL } from '../config';

export default function LocalFirstSoftwarePage() {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What does 'Local-First Software' actually mean in practice?",
      a: "Local-first software stores all primary application state directly on the user's local disk (e.g., using high-speed SQLite databases with Write-Ahead Logging) rather than treating a remote cloud database as the sole source of truth. Operations read and write instantaneously to local storage with zero network latency, and synchronize opportunistically in the background when connectivity is available."
    },
    {
      q: "How does Junglans resolve data sync conflicts across multiple devices?",
      a: "We utilize state-based Conflict-Free Replicated Data Types (CRDTs) alongside deterministic vector clocks and monotonic event sequence numbering in our open-source library @junglans/trail. When two offline devices edit state simultaneously, mathematically proven merge functions converge state automatically without data loss."
    },
    {
      q: "Why is local-first architecture superior for enterprise privacy and compliance?",
      a: "In traditional cloud SaaS architectures, every keystroke, query, and customer interaction is shipped over the public internet to third-party multitenant databases. Local-first software keeps 100% of data on your physical workstation or internal intranet, eliminating attack surfaces, third-party data broker leaks, and compliance exposure under GDPR and HIPAA."
    },
    {
      q: "What developer packages does Junglans provide for local-first software?",
      a: "We publish a complete open-source suite: @junglans/trail (core local SQLite WAL persistence and state engine), @junglans/trail-server (lightweight sync and socket coordinator), @junglans/trail-react (declarative React hooks for sub-millisecond UI rendering), and junglans-trail (Python bridge for offline AI pipelines)."
    },
    {
      q: "Can local-first software scale to thousands of users across an enterprise?",
      a: "Yes. By offloading primary database reads and writes to edge client machines, centralized servers no longer suffer from database lock contention or massive I/O bottlenecks. Servers only handle binary delta distribution, reducing server infrastructure costs by up to 90% while providing instant end-user performance."
    },
    {
      q: "Can local-first apps run as native desktop applications on Windows, macOS, and Linux?",
      a: "Yes. We engineer cross-platform desktop applications using lightweight native runtimes (like Tauri and Rust) combined with React and SQLite, producing native binaries under 15MB that boot in milliseconds and use less than 50MB of RAM."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/local-first-software#service`,
        "name": "Local-First Software Engineering Services",
        "serviceType": "Local-First & Offline-First Software Architecture",
        "description": "Pioneering local-first software development company in India. We engineer zero-telemetry, offline-capable applications powered by SQLite WAL, CRDT synchronization, and the @junglans/trail ecosystem.",
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
          "name": "Local-First Software Engineering Portfolio",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Local-First Desktop & Mobile App Architecture"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Zero-Telemetry & Air-Gapped Enterprise Software"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "CRDT & SQLite WAL State Synchronization Systems"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "@junglans/trail Ecosystem Integration & Support"
              }
            }
          ]
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/local-first-software#breadcrumbs`,
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
            "name": "Local-First Software",
            "item": `${SITE_URL}/local-first-software`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/local-first-software#faq`,
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
        title="Local-First Software Architecture | Offline-First & Zero-Telemetry Apps"
        description="Pioneering local-first software development company. We build high-performance offline-first applications with zero telemetry, sub-millisecond SQLite WAL sync, and CRDTs."
        path="/local-first-software"
        keywords="local-first software development, offline-first software architecture, zero telemetry software, CRDT synchronization, SQLite WAL applications, @junglans/trail, desktop app development Coimbatore India"
        jsonLd={jsonLd}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-[#F8FAFC] border-b border-[#A7F3D0]/50 py-3 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link to="/" className="hover:text-[#10B981] transition">Home</Link>
          <span>/</span>
          <span className="text-slate-400">Services</span>
          <span>/</span>
          <span className="text-[#059669] font-bold">Local-First Software</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[#ECFDF5]/50 via-white to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-mono uppercase tracking-wider font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            THE FUTURE OF USER AGENCY & SPEED
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-[#08090c] tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            Local-First Software: <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#059669] via-[#10B981] to-[#047857] bg-clip-text text-transparent">
              Zero Latency, True Privacy & Offline Resilience
            </span>
          </h1>

          <p className="font-body text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Say goodbye to loading spinners, cloud outages, and corporate data harvesting. Junglans Solutions pioneers local-first software architecture where user data stays on client hardware, operations execute in microseconds, and sync happens seamlessly across devices.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs">
            <Link
              to="/contact"
              className="w-full sm:w-auto bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-xl font-bold transition shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
            >
              <span>Build a Local-First Product</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <Link
              to="/packages/trail"
              className="w-full sm:w-auto bg-[#F8FAFC] hover:bg-[#ECFDF5] text-slate-700 hover:text-[#059669] border border-[#A7F3D0] px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm"
            >
              <span>Inspect @junglans/trail Library</span>
              <span className="text-[10px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1.5 py-0.5 rounded font-mono">NPM</span>
            </Link>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-14">
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-5 text-left shadow-sm">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#059669]">0ms</div>
              <div className="font-heading font-semibold text-xs text-slate-800 mt-1">Spinner Latency</div>
              <div className="font-body text-[11px] text-slate-500 mt-0.5">Reads and writes hit local disk instantly</div>
            </div>
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-5 text-left shadow-sm">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#059669]">100%</div>
              <div className="font-heading font-semibold text-xs text-slate-800 mt-1">Offline Capable</div>
              <div className="font-body text-[11px] text-slate-500 mt-0.5">Full app functionality on airplanes & tunnels</div>
            </div>
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-5 text-left shadow-sm">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#059669]">WAL Journal</div>
              <div className="font-heading font-semibold text-xs text-slate-800 mt-1">SQLite Reliability</div>
              <div className="font-body text-[11px] text-slate-500 mt-0.5">High-speed ACID transaction integrity</div>
            </div>
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-5 text-left shadow-sm">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#059669]">Zero</div>
              <div className="font-heading font-semibold text-xs text-slate-800 mt-1">Telemetry Leaks</div>
              <div className="font-body text-[11px] text-slate-500 mt-0.5">No tracking scripts or third-party brokers</div>
            </div>
          </div>
        </div>
      </section>

      {/* The 7 Local-First Principles */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-white border-t border-[#A7F3D0]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="font-mono text-xs uppercase tracking-widest text-[#059669] font-bold mb-2">
              FOUNDATIONAL MANIFESTO
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#08090c]">
              The 7 Pillars of Local-First Software
            </h2>
            <p className="font-body text-sm sm:text-base text-slate-600 mt-3">
              We engineer our systems according to the formal principles formulated by Martin Kleppmann and Ink & Switch, elevated for mission-critical enterprise environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-mono text-xs text-[#059669] font-bold mb-2">PRINCIPLE 01</div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2">No Spinners & Instant Response</h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
                All data reads and writes occur directly on local memory and fast NVMe disks. Users never wait for a round-trip network response to view or modify their data.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-mono text-xs text-[#059669] font-bold mb-2">PRINCIPLE 02</div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2">Multi-Device Synchronization</h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your data effortlessly replicates between your desktop, tablet, and phone. State converges seamlessly whenever devices discover each other over local LAN or internet.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-mono text-xs text-[#059669] font-bold mb-2">PRINCIPLE 03</div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2">Network is Optional</h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
                Offline is the default operating model, not a fragile second-class error fallback. Work seamlessly on airplanes, remote field stations, or secured bunkers.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-mono text-xs text-[#059669] font-bold mb-2">PRINCIPLE 04</div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2">Conflict-Free Collaboration</h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
                Powered by state-based CRDTs (Conflict-Free Replicated Data Types), concurrent edits merge deterministically without modal lock-ups or lossy overwrites.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-mono text-xs text-[#059669] font-bold mb-2">PRINCIPLE 05</div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2">Data Longevity & Ownership</h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your data is stored in standard, accessible formats (SQLite files, JSON, or plain text). If our servers disappear tomorrow, your software and data remain 100% usable forever.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#A7F3D0] rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-mono text-xs text-[#059669] font-bold mb-2">PRINCIPLE 06</div>
              <h3 className="font-heading font-bold text-lg text-[#08090c] mb-2">Zero-Telemetry Privacy</h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
                End-to-end encryption by default. Synchronization servers only route opaque encrypted binary deltas and possess zero cryptographic ability to read your content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The @junglans/trail Stack Architecture (100% Light Themed) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-[#F8FAFC] border-t border-[#A7F3D0]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="font-mono text-xs uppercase tracking-widest text-[#059669] font-bold mb-2">
              THE JUNGLANS OPEN-SOURCE STACK
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#08090c]">
              Built on @junglans/trail Ecosystem
            </h2>
            <p className="font-body text-sm sm:text-base text-slate-600 mt-3">
              We developed, tested, and published our own open-source suite of local-first libraries to solve state persistence, peer replication, and React synchronization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-[#A7F3D0] rounded-2xl p-6 shadow-sm hover:border-[#10B981] transition">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] bg-[#ECFDF5] text-[#059669] px-2 py-0.5 rounded font-bold">CORE ENGINE</span>
                <span className="font-mono text-xs text-slate-400">npm package</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#08090c] mb-2">@junglans/trail</h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                High-throughput local event streaming and WAL logger. Writes events to an append-only log with microsecond timestamping and vector clock metadata.
              </p>
              <Link to="/packages/trail" className="font-mono text-xs font-bold text-[#059669] hover:underline flex items-center gap-1">
                <span>npm install @junglans/trail</span>
                <span>↗</span>
              </Link>
            </div>

            <div className="bg-white border border-[#A7F3D0] rounded-2xl p-6 shadow-sm hover:border-[#10B981] transition">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] bg-[#ECFDF5] text-[#059669] px-2 py-0.5 rounded font-bold">SYNC GATEWAY</span>
                <span className="font-mono text-xs text-slate-400">npm package</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#08090c] mb-2">@junglans/trail-server</h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Ultra-lightweight WebSocket and socket sync coordinator. Relays encrypted delta changes between clients without maintaining application state or reading payloads.
              </p>
              <Link to="/packages/trail-server" className="font-mono text-xs font-bold text-[#059669] hover:underline flex items-center gap-1">
                <span>npm install @junglans/trail-server</span>
                <span>↗</span>
              </Link>
            </div>

            <div className="bg-white border border-[#A7F3D0] rounded-2xl p-6 shadow-sm hover:border-[#10B981] transition">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] bg-[#ECFDF5] text-[#059669] px-2 py-0.5 rounded font-bold">REACT HOOKS</span>
                <span className="font-mono text-xs text-slate-400">npm package</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#08090c] mb-2">@junglans/trail-react</h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Declarative React bindings. Offers <code className="bg-[#ECFDF5] text-[#059669] px-1 rounded font-mono">useTrailState</code> and reactive query subscriptions for instantaneous 60fps UI updates.
              </p>
              <Link to="/packages/trail-react" className="font-mono text-xs font-bold text-[#059669] hover:underline flex items-center gap-1">
                <span>npm install @junglans/trail-react</span>
                <span>↗</span>
              </Link>
            </div>
          </div>

          {/* Light Theme Code Architecture Card (Zero Black) */}
          <div className="bg-[#F8FAFC] border-2 border-[#A7F3D0] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#A7F3D0]/50 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="w-3 h-3 rounded-full bg-teal-400"></span>
                <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                <span className="font-mono text-xs text-slate-600 font-bold ml-2">architecture-example.ts</span>
              </div>
              <span className="font-mono text-xs text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded font-bold">
                100% LOCAL-FIRST
              </span>
            </div>
            <pre className="font-mono text-xs sm:text-sm text-slate-800 overflow-x-auto leading-relaxed">
{`import { createTrailStore } from '@junglans/trail';
import { useTrailQuery } from '@junglans/trail-react';

// 1. Initialize local SQLite WAL storage on client device
const store = createTrailStore({
  storage: 'sqlite-wal',
  databasePath: './enterprise-app.db',
  encryption: 'AES-256-GCM',
  sync: {
    peerDiscovery: 'local-lan',
    serverRelay: 'wss://internal.mesh.corp/trail'
  }
});

// 2. Instant local write: Zero network latency wait time (< 0.5ms)
await store.append('project.task.created', {
  id: 'task-108',
  title: 'Audit HIPAA Compliance Logs',
  status: 'in_progress',
  author: 'SecOps Lead'
});`}
            </pre>
          </div>
        </div>
      </section>

      {/* Local-First FAQ Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-white border-t border-[#A7F3D0]/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="font-mono text-xs uppercase tracking-widest text-[#059669] font-bold mb-2">
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#08090c]">
              Local-First Architecture FAQ
            </h2>
            <p className="font-body text-sm sm:text-base text-slate-600 mt-2">
              Answers to common architecture, performance, and synchronization questions.
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

      {/* Local-First Bottom CTA Banner */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-12 bg-[#F8FAFC] border-t border-[#A7F3D0]/50">
        <div className="max-w-5xl mx-auto bg-white border-2 border-[#A7F3D0] rounded-3xl p-8 sm:p-12 text-center shadow-lg shadow-emerald-500/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-mono font-bold uppercase mb-4">
            UPGRADE FROM BRITTLE CLOUD SAAS
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#08090c] mb-4">
            Build Your Next Product with Local-First Engineering
          </h2>
          <p className="font-body text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Eliminate server downtime, reduce cloud infrastructure overhead by 90%, and give your users instant, delightful software that works unconditionally offline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs">
            <Link
              to="/contact"
              className="w-full sm:w-auto bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-xl font-bold transition shadow-md shadow-emerald-500/20 text-sm"
            >
              Contact Local-First Architects
            </Link>
            <Link
              to="/packages"
              className="w-full sm:w-auto bg-[#F8FAFC] hover:bg-[#ECFDF5] text-slate-800 border border-[#A7F3D0] px-8 py-4 rounded-xl font-bold transition text-sm"
            >
              Explore Developer Packages Hub ↗
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
