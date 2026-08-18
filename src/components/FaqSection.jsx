import React from 'react';

export default function FaqSection({ items, heading = 'Frequently Asked Questions', intro }) {
  return (
    <section className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 mb-10 sm:mb-14 bg-white border border-[#A7F3D0] shadow-md">
      <div className="font-mono text-xs text-[#059669] mb-2 font-bold uppercase tracking-widest">FAQ // KNOWLEDGE BASE</div>
      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] mb-4">{heading}</h2>
      {intro && <p className="font-body text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed mb-6">{intro}</p>}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <details
            key={idx}
            className="group bg-[#F4FBF7] border border-[#A7F3D0] rounded-2xl overflow-hidden"
            open={idx === 0}
          >
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-4 sm:px-6 py-4 font-heading font-bold text-sm sm:text-base text-[#08090c] hover:text-[#059669] transition">
              <span>{item.q}</span>
              <span className="text-[#10B981] font-mono text-lg transition-transform group-open:rotate-45 flex-shrink-0">+</span>
            </summary>
            <p className="px-4 sm:px-6 pb-5 font-body text-sm text-slate-600 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}