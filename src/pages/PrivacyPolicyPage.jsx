import React from 'react';
import Seo from '../components/Seo';
import { SITE_URL } from '../config';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] bg-precision-grid">
      <Seo
        path="/privacy"
        title="Privacy Policy — Zero Telemetry Guarantee"
        description="Junglans Solutions privacy policy: zero telemetry, no tracking, local-first data. We do not collect personal data beyond enterprise inquiries."
        keywords="junglans privacy policy, zero telemetry, GDPR privacy"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'Privacy Policy — Junglans Solutions',
          url: `${SITE_URL}/privacy`,
          description: 'Zero telemetry privacy policy for Junglans Solutions.'
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-16">
        <div className="font-mono text-xs text-[#059669] bg-white border border-[#A7F3D0] px-3.5 py-1.5 rounded-full w-fit mb-6 font-bold">LEGAL // PRIVACY_POLICY</div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="font-mono text-xs text-slate-500 mb-8">Last updated: August 24, 2026 • Junglans Solutions, India</p>

        <div className="glass-panel rounded-3xl p-6 sm:p-10 bg-white border border-[#A7F3D0] shadow-md space-y-8 font-body text-sm sm:text-base text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-bold text-[#08090c] mb-3">1. Zero Telemetry Principle</h2>
            <p>Junglans Solutions builds local-first software. Our products operate <strong>100% on-device by default</strong> with zero mandatory network calls, no analytics, no crash reporting, and no silent data collection. Your code, data, and prompts never leave your machine unless you explicitly configure sync.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#08090c] mb-3">2. What We Collect</h2>
            <p>Website <code className="bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">junglans.in</code> itself collects:</p>
            <ul className="list-disc ml-5 space-y-1 mt-2">
              <li>Enterprise inquiry emails via <code className="bg-[#ECFDF5] px-1 py-0.5 rounded">mailto:enterprise@junglans.io</code> — stored only in our email inbox.</li>
              <li>Aggregated, anonymized analytics via Google Analytics 4 (GA4) if you consent — no personal data, IP anonymization enabled.</li>
              <li>No cookies for tracking, no fingerprinting, no third-party ad trackers.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#08090c] mb-3">3. What We Do NOT Collect</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>No codebase content, file names, or telemetry from products.</li>
              <li>No keystrokes, no session replay, no heatmaps.</li>
              <li>No sale of data to third parties — ever.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#08090c] mb-3">4. Data Retention & Your Rights (GDPR / CCPA)</h2>
            <p>You have right to access, rectify, erase, and export data we hold (only inquiry emails). Request via <a href="mailto:enterprise@junglans.io" className="text-[#059669] font-bold hover:underline">enterprise@junglans.io</a>. We respond within 30 days. Data retained only as long as needed for enterprise communication or legal compliance.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#08090c] mb-3">5. Security</h2>
            <p>Products use AES-256-GCM authenticated encryption at rest, ChaCha20-Poly1305 in transit, OS keychain for master keys, and memory-safe Rust/C++ runtimes. Website is served over HTTPS via Vercel with HSTS.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#08090c] mb-3">6. Contact</h2>
            <p>Privacy questions: <a href="mailto:enterprise@junglans.io" className="text-[#10B981] font-bold">enterprise@junglans.io</a> • India. For security reviews: <a href="mailto:security@junglans.io" className="text-[#10B981] font-bold">security@junglans.io</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
