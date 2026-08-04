import React, { useState } from 'react';

export default function SecurityComplianceSection() {
  const [activeBadgeIndex, setActiveBadgeIndex] = useState(0);

  const complianceBadges = [
    {
      title: "SOC 2 Type II Audited",
      tag: "COMPLIANCE",
      desc: "Independently audited controls guaranteeing data privacy, operational security, and confidentiality."
    },
    {
      title: "Zero-Trust Architecture",
      tag: "SECURITY",
      desc: "Strict verification model ensuring no entity inside or outside the network is trusted by default."
    },
    {
      title: "100% Offline Ready",
      tag: "PRIVACY",
      desc: "Operates with zero internet connectivity requirements, ideal for classified or air-gapped enterprise environments."
    },
    {
      title: "End-to-End Encryption",
      tag: "ENCRYPTION",
      desc: "Cryptographic protocols ensuring data is encrypted on-device before storage or optional transit."
    },
    {
      title: "HIPAA & GDPR Compliant",
      tag: "GOVERNANCE",
      desc: "Designed to meet global regulatory standards for personal health information and privacy laws."
    }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 md:p-12 bg-white border border-[#A7F3D0] shadow-xl my-10 sm:my-16">
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="font-mono text-xs text-[#059669] mb-3 font-bold uppercase tracking-widest">ENTERPRISE SECURITY & GOVERNANCE</div>
        <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#08090c] tracking-tight">Built for Mission-Critical Defense & Enterprise Security</h2>
        <p className="font-body text-xs sm:text-base text-slate-600 mt-3">
          Our 20 software products adhere to strict enterprise security standards with zero external telemetry.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-8 font-mono text-xs">
        {complianceBadges.map((badge, idx) => (
          <button
            key={idx}
            onClick={() => setActiveBadgeIndex(idx)}
            className={`p-3.5 sm:p-4 rounded-2xl border transition text-left cursor-pointer ${
              activeBadgeIndex === idx
                ? 'bg-[#10B981] text-white border-transparent shadow-lg scale-105'
                : 'bg-[#F4FBF7] text-slate-700 border-[#A7F3D0] hover:bg-[#ECFDF5]'
            }`}
          >
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase block w-fit mb-2 ${activeBadgeIndex === idx ? 'bg-white/20 text-white' : 'bg-[#ECFDF5] text-[#059669]'}`}>
              {badge.tag}
            </span>
            <div className="font-bold font-heading text-xs sm:text-sm line-clamp-2">{badge.title}</div>
          </button>
        ))}
      </div>

      {/* Active Detail Display */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#F4FBF7] border border-[#A7F3D0] text-center max-w-2xl mx-auto">
        <div className="font-mono text-xs text-[#059669] font-bold mb-1 uppercase tracking-wider">
          {complianceBadges[activeBadgeIndex].tag} DETAILS
        </div>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#08090c] mb-2">
          {complianceBadges[activeBadgeIndex].title}
        </h3>
        <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
          {complianceBadges[activeBadgeIndex].desc}
        </p>
      </div>
    </div>
  );
}
