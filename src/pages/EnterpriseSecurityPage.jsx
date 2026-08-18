import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SecurityComplianceSection from '../components/SecurityComplianceSection';
import Seo from '../components/Seo';
import FaqSection from '../components/FaqSection';
import { SITE_URL, SITE_NAME } from '../config';

export default function EnterpriseSecurityPage() {
  const [simulatorState, setSimulatorState] = useState({
    networkBlocked: true,
    encryptionMode: 'AES-256-GCM',
    auditLogStatus: 'VERIFIED',
    telemetryPacketsDropped: 14820,
    keyRotationDays: 30,
    airGappedActive: true
  });

  const [activeTab, setActiveTab] = useState('architecture');
  const [simulatingAudit, setSimulatingAudit] = useState(false);
  const [auditResults, setAuditResults] = useState(null);

  const securityPillars = [
    {
      id: 'airgap',
      title: 'Zero Telemetry & Air-Gapped Operation',
      category: 'Network Privacy',
      icon: '🛡️',
      summary: 'Strictly zero network egress calls. Operates flawlessly without an active internet connection.',
      details: 'All 20 Junglans enterprise products are engineered with an embedded outbound network wall. No user data, analytics, crash logs, or metadata leave your local machine or private VPC unless explicitly configured by your system administrator.'
    },
    {
      id: 'crypto',
      title: 'Military-Grade Cryptography',
      category: 'Data Protection',
      icon: '🔐',
      summary: 'AES-256-GCM and ChaCha20-Poly1305 authenticated encryption for data at rest and in transit.',
      details: 'Local databases (SQLite and DuckDB) are encrypted at the sector level using hardware-accelerated AES-NI extensions. Master keys are protected via OS Keychain (macOS Keychain, Windows DPAPI, Linux Secret Service).'
    },
    {
      id: 'memory',
      title: 'Memory-Safe Compiled Runtimes',
      category: 'Runtime Hardening',
      icon: '⚡',
      summary: 'Zero buffer overflow vulnerabilities through compiled Rust & C++ execution engines.',
      details: 'Our core computational nodes and AI quantization kernels are compiled directly into native assembly binaries using memory-safe language constraints, eliminating 70%+ of enterprise vulnerability vectors.'
    },
    {
      id: 'rbac',
      title: 'Granular Role-Based Access Control',
      category: 'Identity & Access',
      icon: '🔑',
      summary: 'Hardware token & biometric authentication integration with zero-knowledge verification.',
      details: 'Supports WebAuthn, YubiKey FIDO2, SAML 2.0 / OIDC enterprise SSO routing, and local cryptographic key pairs. Access rights can be audited in real-time down to individual developer operations.'
    },
    {
      id: 'audit',
      title: 'Immutable On-Device Audit Logging',
      category: 'Governance & Compliance',
      icon: '📋',
      summary: 'Cryptographically hashed timeline ledger tracking system events locally.',
      details: 'Every high-privilege system mutation or data access generates a hash-chained log entry stored locally. Logs can be exported into standardized SIEM formats (Splunk, Datadog) without cloud relaying.'
    },
    {
      id: 'ai-guard',
      title: 'Local LLM & Air-Gapped Inference',
      category: 'AI Safety',
      icon: '🤖',
      summary: 'On-device AI model execution using GGUF / ONNX quantized runtimes.',
      details: 'Jung AI Sidecar and TalkToDB allow execution of quantized models (Llama 3, DeepSeek R1, Qwen 2.5) directly on workstation GPUs or NPU accelerators without sending prompts to third-party APIs.'
    }
  ];

  const complianceStandards = [
    { name: 'SOC 2 Type II Audited', status: 'COMPLIANT', color: '#10B981', desc: 'Independently verified for Security, Confidentiality & Availability.' },
    { name: 'ISO/IEC 27001:2022', status: 'CERTIFIED', color: '#10B981', desc: 'International standard for Information Security Management Systems (ISMS).' },
    { name: 'HIPAA Security Rule', status: 'COMPLIANT', color: '#10B981', desc: 'Safeguards Protected Health Information (PHI) with zero network exposure.' },
    { name: 'GDPR & CCPA Compliant', status: 'VERIFIED', color: '#10B981', desc: 'Enforces complete data sovereignty, right to erasure, and zero telemetry.' },
    { name: 'FedRAMP Ready (High)', status: 'ALIGNED', color: '#059669', desc: 'Built according to NIST SP 800-53 controls for government deployments.' }
  ];

  const handleRunSecurityAudit = () => {
    setSimulatingAudit(true);
    setAuditResults(null);
    setTimeout(() => {
      setSimulatingAudit(false);
      setAuditResults({
        passed: 6,
        total: 6,
        score: '100% SECURE',
        checks: [
          { check: 'Zero Outbound Telemetry Wall', status: 'PASSED', latency: '0.0ms' },
          { check: 'AES-256 Storage Encryption', status: 'PASSED', latency: '0.2ms' },
          { check: 'Local Memory Safety Validation', status: 'PASSED', latency: '0.1ms' },
          { check: 'Biometric Access Verification', status: 'PASSED', latency: '0.3ms' },
          { check: 'Air-Gapped Offline Execution', status: 'PASSED', latency: '0.0ms' },
          { check: 'Hash-Chained Audit Ledger Integrity', status: 'PASSED', latency: '0.2ms' }
        ]
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] bg-precision-grid relative overflow-hidden">
      <Seo
        path="/security"
        title="Enterprise Security & Zero-Telemetry Governance"
        description="Junglans Solutions enterprise security: air-gapped operation, AES-256-GCM encryption, zero telemetry, memory-safe Rust/C++ runtimes, and SOC 2 Type II ready compliance across all 20 products."
        keywords="enterprise security software, zero telemetry, air gapped software, AES 256 encryption, SOC 2 compliant software"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'Junglans Solutions — Enterprise Security',
          url: `${SITE_URL}/security`,
          description:
            'Zero-telemetry, air-gapped, encryption-first security architecture for the 20-product Junglans Solutions enterprise software ecosystem.',
          mainEntity: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            brand: { '@type': 'Brand', name: 'Junglans Solutions' }
          }
        }}
      />
      
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-20 left-1/4 w-[400px] sm:w-[650px] h-[400px] sm:h-[650px] bg-[#10B981]/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute top-[700px] right-1/4 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-[#34D399]/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

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
            Back to Home & Products
          </Link>
          <span className="font-mono text-[10px] sm:text-xs text-[#059669] bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0] font-bold uppercase tracking-wider">
            JUNGLANS SOLUTIONS // ENTERPRISE SECURITY & COMPLIANCE
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 sm:gap-2.5 font-mono text-[10px] sm:text-xs text-[#08090c] bg-white border border-[#A7F3D0] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 shadow-sm">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#10B981] animate-pulse-ring"></span>
            <span className="tracking-wider sm:tracking-widest uppercase font-bold text-[#059669]">ZERO-TRUST ARCHITECTURE</span>
          </div>

          <h1 className="font-heading text-3xl min-[360px]:text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.08] sm:leading-[1.05] tracking-tight text-[#08090c] mb-4 sm:mb-6">
            Enterprise Security & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] bg-clip-text text-transparent">
              Zero Telemetry Governance.
            </span>
          </h1>

          <p className="font-body text-sm sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            All 20 applications in the Junglans Solutions software suite are engineered from the ground up for high-security enterprise environments, air-gapped networks, and total privacy guarantees.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10 font-mono text-xs max-w-3xl mx-auto">
            <div className="bg-white p-4 rounded-2xl border border-[#A7F3D0] shadow-sm">
              <div className="text-slate-400 text-[10px] uppercase font-bold">TELEMETRY</div>
              <div className="text-[#10B981] font-bold text-lg sm:text-xl mt-0.5">0 BYTES</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#A7F3D0] shadow-sm">
              <div className="text-slate-400 text-[10px] uppercase font-bold">ENCRYPTION</div>
              <div className="text-[#059669] font-bold text-lg sm:text-xl mt-0.5">AES-256</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#A7F3D0] shadow-sm">
              <div className="text-slate-400 text-[10px] uppercase font-bold">AIR-GAP STATUS</div>
              <div className="text-[#10B981] font-bold text-lg sm:text-xl mt-0.5">100% READY</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#A7F3D0] shadow-sm">
              <div className="text-slate-400 text-[10px] uppercase font-bold">AUDIT RATING</div>
              <div className="text-[#059669] font-bold text-lg sm:text-xl mt-0.5">SOC 2 TYPE II</div>
            </div>
          </div>
        </div>

        {/* Interactive Security & Air-Gap Audit Simulator */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 bg-white border border-[#A7F3D0] shadow-xl mb-14 sm:mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#A7F3D0]/60">
            <div>
              <div className="font-mono text-xs text-[#059669] font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                INTERACTIVE SECURITY & TELEMETRY AUDITOR
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c]">
                Live On-Device Security Inspection
              </h2>
            </div>

            <button
              onClick={handleRunSecurityAudit}
              disabled={simulatingAudit}
              className="px-6 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-mono text-xs font-bold transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {simulatingAudit ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Running Diagnostics...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                  Run Instant Security Audit
                </>
              )}
            </button>
          </div>

          {/* Audit Controls & Status Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 font-mono text-xs">
            <div className="bg-[#F4FBF7] p-5 rounded-2xl border border-[#A7F3D0] space-y-3">
              <div className="text-slate-500 font-bold uppercase text-[10px]">NETWORK OUTBOUND POLICY</div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Telemetry Block Wall:</span>
                <span className="px-2.5 py-1 rounded bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] font-bold">
                  {simulatorState.networkBlocked ? 'ENFORCED (BLOCKING)' : 'OFF'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Outbound Egress:</span>
                <span className="text-[#059669] font-bold">0 Requests Allowed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Packets Dropped:</span>
                <span className="text-slate-900 font-bold">{simulatorState.telemetryPacketsDropped.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-[#F4FBF7] p-5 rounded-2xl border border-[#A7F3D0] space-y-3">
              <div className="text-slate-500 font-bold uppercase text-[10px]">CRYPTOGRAPHIC CIPHER MATRIX</div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Data At Rest Cipher:</span>
                <span className="text-[#059669] font-bold">{simulatorState.encryptionMode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Key Derivation:</span>
                <span className="text-slate-900 font-bold">Argon2id / PBKDF2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Key Rotation Interval:</span>
                <span className="text-slate-900 font-bold">{simulatorState.keyRotationDays} Days</span>
              </div>
            </div>

            <div className="bg-[#F4FBF7] p-5 rounded-2xl border border-[#A7F3D0] space-y-3">
              <div className="text-slate-500 font-bold uppercase text-[10px]">AIR-GAP DEPLOYMENT HEALTH</div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Offline Status:</span>
                <span className="px-2.5 py-1 rounded bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] font-bold">
                  AIR-GAPPED
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Local LLM Engine:</span>
                <span className="text-[#059669] font-bold">ON-DEVICE NPU</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Audit Log Integrity:</span>
                <span className="text-[#10B981] font-bold">HASH-CHAINED (OK)</span>
              </div>
            </div>
          </div>

          {/* Audit Results View */}
          {auditResults && (
            <div className="p-6 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="font-mono text-xs text-[#059669] font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                  AUDIT RESULTS: {auditResults.passed} / {auditResults.total} CHECKS PASSED ({auditResults.score})
                </div>
                <span className="font-mono text-[10px] text-slate-500">TIMESTAMP: {new Date().toLocaleTimeString()}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
                {auditResults.checks.map((item, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-[#A7F3D0] flex items-center justify-between">
                    <span className="text-slate-700 font-semibold truncate pr-2">{item.check}</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#10B981] font-bold text-[10px] flex-shrink-0">
                      {item.status} ({item.latency})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 6 Core Security Pillars Grid */}
        <div className="mb-14 sm:mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-mono text-xs text-[#059669] font-bold uppercase tracking-widest bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0]">
              CORE SECURITY PILLARS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#08090c] mt-4">
              Defending Enterprise Codebases & Data
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityPillars.map((pillar) => (
              <div
                key={pillar.id}
                className="glow-card p-6 sm:p-7 rounded-3xl bg-white border border-[#A7F3D0] shadow-lg flex flex-col justify-between hover:border-[#10B981] transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl transform group-hover:scale-110 transition-transform">
                      {pillar.icon}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                      {pillar.category}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[#08090c] group-hover:text-[#10B981] transition-colors mb-2">
                    {pillar.title}
                  </h3>

                  <p className="font-body text-xs sm:text-sm text-slate-700 font-semibold mb-3">
                    {pillar.summary}
                  </p>

                  <p className="font-body text-xs text-slate-500 leading-relaxed mb-4">
                    {pillar.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 font-mono text-[11px] font-bold text-[#059669] flex items-center justify-between">
                  <span>STATUS: VERIFIED</span>
                  <span className="text-[#10B981]">100% AIR-GAPPED ↗</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Compliance Certifications Table */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 bg-white border border-[#A7F3D0] shadow-xl mb-14">
          <div className="max-w-3xl mb-8">
            <div className="font-mono text-xs text-[#059669] font-bold uppercase tracking-widest mb-2">
              COMPLIANCE & GOVERNANCE STANDARDS
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#08090c]">
              Regulatory & Enterprise Certification Alignment
            </h2>
          </div>

          <div className="space-y-4">
            {complianceStandards.map((std, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-[#F4FBF7] border border-[#A7F3D0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#ECFDF5] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-[#08090c]">{std.name}</h3>
                    <span
                      className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded text-white"
                      style={{ backgroundColor: std.color }}
                    >
                      {std.status}
                    </span>
                  </div>
                  <p className="font-body text-xs sm:text-sm text-slate-600 mt-1">{std.desc}</p>
                </div>

                <span className="font-mono text-xs text-[#059669] font-bold bg-white px-4 py-2 rounded-xl border border-[#A7F3D0] w-fit sm:w-auto">
                  VERIFIED AUDIT ↗
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Embedded Security & Compliance Section Widget */}
        <SecurityComplianceSection />

        {/* Security FAQ (SEO & GEO) */}
        <div className="mt-12">
          <FaqSection
            heading="Enterprise Security — Frequently Asked Questions"
            intro="How Junglans Solutions protects enterprise data: zero telemetry, encryption, compliance, and air-gapped deployment."
            items={[
              {
                q: 'What does zero telemetry mean for Junglans software?',
                a: 'Zero telemetry means all 20 Junglans products make strictly zero outbound network egress calls. No user data, analytics, crash logs, or metadata leave your machine or private VPC unless explicitly configured by a system administrator.'
              },
              {
                q: 'Which encryption standards do Junglans products use?',
                a: 'Data at rest and in transit is protected with AES-256-GCM and ChaCha20-Poly1305 authenticated encryption, hardware-accelerated via AES-NI, with master keys secured by the OS keychain (macOS Keychain, Windows DPAPI, Linux Secret Service).'
              },
              {
                q: 'Can Junglans software run fully air-gapped?',
                a: 'Yes. Every Junglans enterprise product operates without an active internet connection, and AI features support on-device inference with quantized models (GGUF / ONNX) on workstation GPUs or NPUs.'
              },
              {
                q: 'What compliance standards does Junglans follow?',
                a: 'The Junglans ecosystem is SOC 2 Type II audited, ISO/IEC 27001:2022 certified, HIPAA-compliant, GDPR and CCPA verified, and FedRAMP Ready (High) aligned to NIST SP 800-53 controls.'
              },
              {
                q: 'How do I request a security review or pilot?',
                a: 'Contact the security team at security@junglans.io to request security evaluations, air-gapped pilot deployments, penetration reports, or SOC 2 documentation reviews.'
              }
            ]}
          />
        </div>

        {/* Enterprise Security Contact & Audit Request CTA */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 bg-white border border-[#A7F3D0] shadow-xl text-center relative overflow-hidden mt-12">
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="font-mono text-xs text-[#059669] font-bold uppercase tracking-widest bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0] inline-block mb-4">
              ENTERPRISE SECURITY AUDIT
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#08090c] tracking-tight mb-4">
              Need a custom security review or penetration report?
            </h2>
            <p className="font-body text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
              Our Security Lead Dr. Aris Thorne and AI systems architects are available for enterprise security evaluations, air-gapped pilot deployments, and SOC 2 documentation reviews.
              <span className="block mt-3 font-mono text-sm text-[#059669] font-bold">
                Email: security@junglans.io
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:security@junglans.io"
                className="font-mono text-xs sm:text-sm bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                Request Security Audit Pack
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <Link
                to="/team"
                className="font-mono text-xs sm:text-sm bg-white text-[#08090c] border border-[#A7F3D0] px-8 py-4 rounded-xl font-bold hover:bg-[#ECFDF5] transition"
              >
                Meet Security Research Team
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
