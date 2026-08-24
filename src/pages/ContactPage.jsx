import React, { useState } from 'react';
import Seo from '../components/Seo';
import { SITE_URL, CONTACT_EMAIL } from '../config';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', teamSize: '10-50', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Enterprise Inquiry from ${form.name} - ${form.company}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nTeam Size: ${form.teamSize}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] bg-precision-grid relative overflow-hidden">
      <Seo
        path="/contact"
        title="Contact Sales — Enterprise Pilot & Security Review"
        description="Contact Junglans Solutions for enterprise licensing, pilots, and security reviews. 20 products, local-first, zero telemetry. Email enterprise@junglans.io or use the contact form."
        keywords="contact junglans, enterprise pilot, junglans sales, junglans contact"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Junglans Solutions',
            url: `${SITE_URL}/contact`,
            description: 'Contact Junglans Solutions for enterprise licensing and pilots.',
            mainEntity: {
              '@type': 'Organization',
              name: 'Junglans Solutions',
              url: SITE_URL,
              email: CONTACT_EMAIL,
              address: { '@type': 'PostalAddress', addressCountry: 'IN' }
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE_URL}/contact` }
            ]
          }
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-16">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-[#059669] bg-white border border-[#A7F3D0] px-3.5 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span> CONTACT // ENTERPRISE_SALES
        </div>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight mb-4">Contact Sales & <span className="bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent">Request a Pilot.</span></h1>
        <p className="font-body text-slate-600 text-lg max-w-2xl mb-10">20 products, air-gapped ready, zero telemetry. Fill the form — it opens your email client and sends directly to <span className="font-mono font-bold text-[#059669]">{CONTACT_EMAIL}</span>. No data stored on our servers.</p>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 bg-white border border-[#A7F3D0] shadow-xl">
            <h2 className="font-heading text-2xl font-bold mb-6">Enterprise Inquiry Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4 font-body text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs font-bold text-slate-600">YOUR NAME *</label>
                  <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full bg-[#F4FBF7] border border-[#A7F3D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#10B981]" placeholder="Aarav Sharma" />
                </div>
                <div>
                  <label className="font-mono text-xs font-bold text-slate-600">WORK EMAIL *</label>
                  <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="mt-1 w-full bg-[#F4FBF7] border border-[#A7F3D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#10B981]" placeholder="aarav@company.in" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs font-bold text-slate-600">COMPANY</label>
                  <input value={form.company} onChange={e=>setForm({...form,company:e.target.value})} className="mt-1 w-full bg-[#F4FBF7] border border-[#A7F3D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#10B981]" placeholder="Acme Pvt Ltd" />
                </div>
                <div>
                  <label className="font-mono text-xs font-bold text-slate-600">TEAM SIZE</label>
                  <select value={form.teamSize} onChange={e=>setForm({...form,teamSize:e.target.value})} className="mt-1 w-full bg-[#F4FBF7] border border-[#A7F3D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#10B981]">
                    <option>1-10</option><option>10-50</option><option>50-200</option><option>200-500</option><option>500+</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-mono text-xs font-bold text-slate-600">MESSAGE *</label>
                <textarea required rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="mt-1 w-full bg-[#F4FBF7] border border-[#A7F3D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#10B981]" placeholder="We want to pilot Junglans Project Manager + TalkToDB for 50 engineers..." />
              </div>
              <button type="submit" className="w-full font-mono text-sm bg-[#10B981] hover:bg-[#059669] text-white py-4 rounded-xl font-bold shadow-md transition">Send via Email → {CONTACT_EMAIL}</button>
              {submitted && <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-[#059669] font-mono text-xs font-bold">✓ Email client opened. If it didn't, email directly to {CONTACT_EMAIL}</div>}
              <p className="font-mono text-[11px] text-slate-400 text-center">Zero telemetry form — no data stored server-side. Direct mailto only.</p>
            </form>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-3xl p-6 bg-white border border-[#A7F3D0] shadow-md">
              <div className="font-mono text-xs text-[#059669] font-bold mb-3">DIRECT CONTACT</div>
              <div className="space-y-3 font-body text-sm">
                <div className="p-3 bg-[#F4FBF7] border border-[#A7F3D0] rounded-xl"><div className="font-mono text-[10px] text-slate-500">ENTERPRISE SALES</div><a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-[#059669] hover:text-[#10B981]">{CONTACT_EMAIL}</a></div>
                <div className="p-3 bg-[#F4FBF7] border border-[#A7F3D0] rounded-xl"><div className="font-mono text-[10px] text-slate-500">SECURITY REVIEWS</div><a href="mailto:security@junglans.io" className="font-bold text-[#059669] hover:text-[#10B981]">security@junglans.io</a></div>
                <div className="p-3 bg-[#F4FBF7] border border-[#A7F3D0] rounded-xl"><div className="font-mono text-[10px] text-slate-500">FOUNDERS</div><div className="text-xs text-slate-700">manot6114@gmail.com<br/>kanishpatrick@gmail.com</div></div>
              </div>
            </div>
            <div className="glass-panel rounded-3xl p-6 bg-white border border-[#A7F3D0] shadow-md">
              <div className="font-mono text-xs text-[#059669] font-bold mb-3">WHAT HAPPENS NEXT</div>
              <ol className="space-y-2 font-body text-xs text-slate-600 list-decimal ml-5">
                <li>We reply within 1 business day with pilot scope & NDA.</li>
                <li>Air-gapped installer + docs shared (no cloud required).</li>
                <li>7-14 day pilot with your team, weekly check-ins.</li>
                <li>Enterprise license + SOC 2 pack on success.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
