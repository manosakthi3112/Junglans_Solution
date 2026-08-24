import React from 'react';
import Seo from '../components/Seo';
import { SITE_URL } from '../config';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] bg-precision-grid">
      <Seo
        path="/terms"
        title="Terms of Service"
        description="Junglans Solutions terms of service: licensing, acceptable use, and enterprise agreements for 20 local-first products."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'Terms of Service — Junglans Solutions',
          url: `${SITE_URL}/terms`
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-16">
        <div className="font-mono text-xs text-[#059669] bg-white border border-[#A7F3D0] px-3.5 py-1.5 rounded-full w-fit mb-6 font-bold">LEGAL // TERMS_OF_SERVICE</div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="font-mono text-xs text-slate-500 mb-8">Last updated: August 24, 2026</p>
        <div className="glass-panel rounded-3xl p-6 sm:p-10 bg-white border border-[#A7F3D0] shadow-md space-y-8 font-body text-sm sm:text-base text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-bold text-[#08090c] mb-3">1. Agreement</h2>
            <p>By accessing <code className="bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">junglans.in</code> or any Junglans product you agree to these terms. Enterprise licensing is governed by a separate Enterprise Agreement / DPA signed with Junglans Solutions.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#08090c] mb-3">2. Licensing</h2>
            <p>All 20 products are proprietary local-first software. Enterprise licenses are per-organization, non-transferable, and include air-gapped deployment. No reverse engineering of cryptographic modules without written consent.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#08090c] mb-3">3. Acceptable Use</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Do not use products to violate applicable laws or to process unlawful content.</li>
              <li>Do not attempt to bypass licensing, telemetry blocks, or audit logs.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#08090c] mb-3">4. Disclaimer</h2>
            <p>Website and documentation are provided “as is” without warranty. Enterprise SLAs are defined in the Enterprise Agreement only.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#08090c] mb-3">5. Governing Law</h2>
            <p>These terms are governed by laws of India. Disputes subject to jurisdiction of courts in Chennai, Tamil Nadu.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#08090c] mb-3">6. Contact</h2>
            <p><a href="mailto:enterprise@junglans.io" className="text-[#10B981] font-bold">enterprise@junglans.io</a> • Junglans Solutions</p>
          </section>
        </div>
      </div>
    </div>
  );
}
