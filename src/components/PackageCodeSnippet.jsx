import React, { useState } from 'react';

export default function PackageCodeSnippet({ tabs, defaultTab = 0, title }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [copied, setCopied] = useState(false);

  const currentTab = tabs[activeTab] || tabs[0];

  const handleCopy = () => {
    if (!currentTab) return;
    const textToCopy = currentTab.code || currentTab.command || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-[#A7F3D0] bg-white shadow-md overflow-hidden text-left font-mono my-4 transition-all">
      {/* Light Header bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#ECFDF5] border-b border-[#A7F3D0]/70 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          </div>
          {title && (
            <span className="text-xs text-[#059669] font-bold font-heading mr-2 uppercase tracking-wide">
              {title}
            </span>
          )}
          {tabs.length > 1 && (
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#A7F3D0]/70 shadow-xs">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.label || tab.title || idx}
                  onClick={() => setActiveTab(idx)}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-all font-semibold cursor-pointer ${
                    activeTab === idx
                      ? 'bg-[#10B981] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#059669] hover:bg-[#ECFDF5]'
                  }`}
                >
                  {tab.label || tab.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-[#059669] hover:text-emerald-700 bg-white hover:bg-[#F4FBF7] px-3 py-1 rounded-lg border border-[#A7F3D0] shadow-xs transition cursor-pointer"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span className="text-[#059669] font-sans text-[11px] font-bold">Copied!</span>
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span className="font-sans text-[11px] font-semibold">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Light Code body */}
      <div className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] leading-relaxed text-[#08090c] bg-[#F8FAFC]">
        <pre className="m-0 font-mono whitespace-pre font-medium text-slate-800">
          <code>{currentTab.code || currentTab.command}</code>
        </pre>
      </div>

      {currentTab.filename && (
        <div className="px-4 py-1.5 bg-[#ECFDF5]/60 border-t border-[#A7F3D0]/60 text-[10px] text-slate-600 font-mono flex items-center justify-between">
          <span>File: <strong className="text-slate-800">{currentTab.filename}</strong></span>
          <span className="text-[#059669] font-bold uppercase">{currentTab.language || 'code'}</span>
        </div>
      )}
    </div>
  );
}
