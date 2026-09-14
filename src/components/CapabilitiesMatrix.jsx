import React, { useState } from 'react';
import { allCapabilitiesList } from '../data/packagesData';

export default function CapabilitiesMatrix() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalCapabilities = allCapabilitiesList.reduce((acc, cat) => acc + cat.count, 0);

  // Filter categories and items
  const filteredCategories = allCapabilitiesList
    .map((cat) => {
      const matchesCategory = activeCategory === 'all' || cat.category === activeCategory;
      if (!matchesCategory) return null;

      const filteredItems = cat.items.filter((item) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
      });

      if (filteredItems.length === 0) return null;

      return {
        ...cat,
        items: filteredItems
      };
    })
    .filter(Boolean);

  return (
    <div className="rounded-3xl border border-[#A7F3D0]/70 bg-white/90 backdrop-blur-xl p-4 sm:p-8 shadow-xl text-left my-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#A7F3D0]/50 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping"></span>
            <span className="font-mono text-xs text-[#059669] font-bold uppercase tracking-wider">
              104 Built-in Capabilities
            </span>
          </div>
          <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#08090c]">
            Junglans Trail Capabilities Taxonomy
          </h3>
          <p className="font-body text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            A comprehensive, modular suite of analytics, heatmap, telemetry, and diagnostic features running directly in your SQLite engine with zero third-party cloud dependence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] px-4 py-2 rounded-2xl text-center shadow-sm">
            <div className="font-heading font-black text-2xl text-[#059669]">{totalCapabilities}</div>
            <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Features</div>
          </div>
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] px-4 py-2 rounded-2xl text-center shadow-sm">
            <div className="font-heading font-black text-2xl text-[#10B981]">10</div>
            <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Categories</div>
          </div>
        </div>
      </div>

      {/* Controls: Search & Category Filter */}
      <div className="my-6 space-y-4">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search across all 104 capabilities (e.g. 'rage clicks', 'heatmap', 'LCP', 'GDPR', 'revenue')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4FBF7] border border-[#A7F3D0] text-slate-800 text-xs sm:text-sm rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 font-body placeholder:text-slate-400 shadow-inner"
          />
          <svg
            className="absolute left-3.5 top-3.5 text-slate-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600 font-mono"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'all'
                ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/20'
                : 'bg-[#ECFDF5] text-[#059669] hover:bg-[#A7F3D0]/50 border border-[#A7F3D0]/60'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] opacity-80">({totalCapabilities})</span>
          </button>

          {allCapabilitiesList.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat.category
                  ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/20'
                  : 'bg-[#ECFDF5] text-[#059669] hover:bg-[#A7F3D0]/50 border border-[#A7F3D0]/60'
              }`}
            >
              <span>{cat.category}</span>
              <span className="text-[10px] opacity-80 font-normal">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Capabilities List */}
      <div className="space-y-6">
        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center bg-[#F4FBF7] rounded-2xl border border-dashed border-[#A7F3D0]">
            <p className="text-slate-500 text-sm font-mono">
              No capabilities found matching "{searchQuery}". Try searching for another term.
            </p>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat.category}
              className="p-5 sm:p-6 rounded-2xl bg-[#F4FBF7] border border-[#A7F3D0]/70 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#A7F3D0]/50 gap-2">
                <div>
                  <h4 className="font-heading font-bold text-lg text-[#08090c] flex items-center gap-2">
                    <span>{cat.category}</span>
                    <span className="font-mono text-xs text-[#10B981] bg-white px-2 py-0.5 rounded-md border border-[#A7F3D0] font-semibold">
                      {cat.count} features
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-body">{cat.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-[#A7F3D0]/60 hover:border-[#10B981] hover:shadow-md transition-all group"
                  >
                    <div className="font-heading font-bold text-xs text-[#08090c] group-hover:text-[#10B981] transition flex items-center justify-between mb-1">
                      <span>{item.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-body">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
