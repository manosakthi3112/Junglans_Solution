import React, { useState } from 'react';

const CLI_SIMULATIONS = [
  {
    cmd: "jung init",
    title: "Initialize Store",
    package: "jung (PyPI)",
    description: "Sets up local .jung/ SQLite metadata store & Git post-commit hook.",
    output: [
      "$ jung init",
      "-> Initialized empty jung store in .jung/",
      "-> Database created: .jung/index.db (SQLite WAL mode)",
      "-> Content-addressed blob store created: .jung/objects/",
      "-> Git repository detected: installing post-commit hook...",
      "✔ SUCCESS: Bidirectional Git hook installed. Turns will automatically link to commits."
    ]
  },
  {
    cmd: "jung watch",
    title: "Daemon Watcher",
    package: "jung (PyPI)",
    description: "Streams IDE conversation logs and correlates file diffs to AI turns.",
    output: [
      "$ jung watch",
      "-> jung daemon started (PID 28412)",
      "-> Watching project directory: E:/workspace/enterprise-app",
      "-> Connected to IDE adapter: Gemini Antigravity [ACTIVE]",
      "-> Checkpoint established for resumable log streaming.",
      "-> Correlating file system mutations within 300ms window...",
      "✔ DAEMON RUNNING: Background ingestion active."
    ]
  },
  {
    cmd: "jung blame src/auth.py",
    title: "AI Blame & Attribution",
    package: "jung (PyPI)",
    description: "Shows human vs. AI author for every line of code.",
    output: [
      "$ jung blame src/auth.py --line 40-46",
      "Line  Type  Author       Date         Content",
      "40    A     Agent (AI)   2026-09-14   def verify_jwt_signature(token: str) -> dict:",
      "41    A     Agent (AI)   2026-09-14       try:",
      "42    A     Agent (AI)   2026-09-14           payload = jwt.decode(token, SECRET, algorithms=['HS256'])",
      "43    M     Human        2026-09-14           enforce_tenant_isolation(payload['tenant_id'])",
      "44    A     Agent (AI)   2026-09-14           return payload",
      "45    A     Agent (AI)   2026-09-14       except PyJWTError as e:",
      "46    M     Human        2026-09-14           logger.security_alert(f'Invalid JWT attempt: {e}')",
      "Attribution Summary: 71.4% AI Agent | 28.6% Human Reviewed"
    ]
  },
  {
    cmd: "jung cost --by model",
    title: "Token & Cost Audit",
    package: "jung (PyPI)",
    description: "Summarizes token expenditure and estimated USD by AI model.",
    output: [
      "$ jung cost --by model",
      "Model              Turns   Tokens In    Tokens Out   Cost (USD)",
      "gemini-2.5-pro     142     1,420,800    248,100      $1.84",
      "gemini-2.5-flash   380     3,120,400    620,000      $0.48",
      "claude-3-7-sonnet  45      480,200      92,400       $1.92",
      "----------------------------------------------------------------",
      "TOTAL              567     5,021,400    960,500      $4.24"
    ]
  },
  {
    cmd: "jung status",
    title: "Sidecar Status",
    package: "jung (PyPI)",
    description: "Checks daemon health, active branch, and store statistics.",
    output: [
      "$ jung status",
      "┌────────────────────────────────────────────────────────┐",
      "│              jung Daemon: RUNNING                      │",
      "└────────────────────────────────────────────────────────┘",
      "Store: E:/workspace/enterprise-app/.jung",
      "Current branch: main",
      "Last commit: cmt_7f8a912 — Add zero-trust session middleware",
      "Attributed Turns: 4 | File diffs linked: 3",
      "Store stats: 8 sessions | 94 turns | 18 changes | 4 commits | 1,420 KB"
    ]
  },
  {
    cmd: "jungtrail status",
    title: "Trail Analytics DB",
    package: "@junglans/trail (npm)",
    description: "Inspects local SQLite database health, WAL size, and event counts.",
    output: [
      "$ jungtrail status --db ./data/analytics.db",
      "-> Connecting to SQLite engine (WAL Mode)...",
      "✔ Database: ./data/analytics.db (Size: 8.4 MB)",
      "✔ WAL Journal: ./data/analytics.db-wal (Size: 320 KB)",
      "✔ Tables: events (48,219 rows), sessions (3,140 rows), heatmaps (182,490 points)",
      "✔ Retention Policy: 90 days rolling window",
      "✔ Ingestion Status: Healthy (0 errors in last 24h)"
    ]
  }
];

export default function PackageCliExplorer() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const active = CLI_SIMULATIONS[selectedIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(active.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-[#A7F3D0] bg-white p-4 sm:p-8 shadow-xl text-left font-mono my-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#A7F3D0]/60 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-xs text-[#059669] font-bold uppercase tracking-widest">
              Interactive CLI Terminal Simulator
            </span>
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#08090c]">
            Explore Open-Source CLI Tooling
          </h3>
        </div>
        <div className="flex items-center gap-2 bg-[#ECFDF5] px-3.5 py-1.5 rounded-xl border border-[#A7F3D0]">
          <span className="text-[11px] text-slate-500 font-sans">Target:</span>
          <span className="text-xs text-[#059669] font-bold">{active.package}</span>
        </div>
      </div>

      {/* Command Selector Buttons */}
      <div className="flex flex-wrap gap-2 my-5">
        {CLI_SIMULATIONS.map((sim, idx) => (
          <button
            key={sim.cmd}
            onClick={() => setSelectedIdx(idx)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              selectedIdx === idx
                ? 'bg-[#10B981] text-white border-[#10B981] shadow-md shadow-emerald-500/20 scale-[1.01]'
                : 'bg-[#F4FBF7] text-slate-700 border-[#A7F3D0] hover:bg-[#ECFDF5] hover:text-[#059669]'
            }`}
          >
            <span>{sim.cmd}</span>
            {selectedIdx === idx && <span className="text-[10px] opacity-90">●</span>}
          </button>
        ))}
      </div>

      <div className="text-xs text-slate-600 mb-3 font-sans flex items-center justify-between">
        <span>{active.description}</span>
        <button
          onClick={handleCopy}
          className="text-[#059669] hover:text-emerald-700 text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer"
        >
          {copied ? '✓ Copied' : 'Copy command'}
        </button>
      </div>

      {/* Light Terminal Display */}
      <div className="rounded-2xl border border-[#A7F3D0] bg-[#F8FAFC] p-4 sm:p-6 overflow-x-auto shadow-inner">
        <div className="flex items-center justify-between pb-3 border-b border-[#A7F3D0]/60 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-slate-500 text-[11px] ml-2 font-mono">bash — terminal</span>
          </div>
          <span className="text-[#059669] text-[10px] tracking-wider uppercase font-bold bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
            Local-First Execution
          </span>
        </div>

        <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
          {active.output.map((line, lIdx) => {
            const isCommand = line.startsWith('$');
            const isSuccess = line.includes('✔');
            const isAttribution = line.includes('Attribution Summary');
            const isTable = line.includes('Line  Type') || line.includes('Model   ');

            let textColor = 'text-slate-800';
            if (isCommand) textColor = 'text-[#059669] font-bold';
            else if (isSuccess) textColor = 'text-emerald-700 font-bold';
            else if (isAttribution) textColor = 'text-teal-700 font-bold';
            else if (isTable) textColor = 'text-slate-600 font-bold border-b border-slate-200 pb-1';

            return (
              <div key={lIdx} className={`${textColor} whitespace-pre font-mono`}>
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
