import React, { useState } from 'react';

export default function InteractiveTerminal() {
  const [activeCommand, setActiveCommand] = useState('scan');
  const [terminalOutput, setTerminalOutput] = useState([
    'JUNGLANS_CLI v4.2.0 // ENTERPRISE INFRASTRUCTURE TOOL',
    'Type or click a command below to simulate enterprise tools:',
    '-------------------------------------------------------'
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const runCommand = (cmdKey) => {
    setActiveCommand(cmdKey);
    setIsRunning(true);
    
    let newLogs = [];
    if (cmdKey === 'scan') {
      newLogs = [
        '$ junglans scan --all-projects',
        '-> Initializing local repository scanner...',
        '-> Scanned 20 project repositories (120 feature modules verified).',
        '-> Duplicate Code Detected: 0% (Fully Refactored)',
        '-> Health Index: 99.8% | Telemetry Risk: 0.00%',
        '✔ COMPLETE: All 20 projects verified in 0.42 seconds.'
      ];
    } else if (cmdKey === 'sidecar') {
      newLogs = [
        '$ junglans sidecar --audit-lineage',
        '-> Connecting to local version control sidecar...',
        '-> 1,420 AI prompts matched to resulting commit diffs.',
        '-> Human vs AI Attribution Ratio: 42% Human / 58% AI Assisted.',
        '-> Total Token Expenditure Logged: ₹350',
        '✔ ATTRIBUTION AUDIT PASSED: 100% commit traceability.'
      ];
    } else if (cmdKey === 'ide') {
      newLogs = [
        '$ junglans ide --orchestrate-agents',
        '-> Launching 4-stage multi-agent developer pipeline...',
        '-> Stage 1 [Understanding]: Scope verified.',
        '-> Stage 2 [Decomposer]: Feature split into 3 atomic modules.',
        '-> Stage 3 [Optimizer]: Execution path performance optimized.',
        '-> Stage 4 [Coder]: Code patch generated & waiting for human review.',
        '✔ ORCHESTRATION COMPLETE: Feature ready for 1-click apply.'
      ];
    } else if (cmdKey === 'talktodb') {
      newLogs = [
        '$ junglans talktodb --execute "Show Q3 enterprise revenue"',
        '-> Parsing natural language voice/text query...',
        '-> SQL Guardrail Check: READ-ONLY [PASSED]',
        '-> Executed query against target database in 0.38ms.',
        '-> Generated 3 visual chart representations (Bar, Line, Pie).',
        '✔ QUERY COMPLETE: Q3 Revenue ₹4.82 Crores (Up +14.2% YoY).'
      ];
    } else if (cmdKey === 'security') {
      newLogs = [
        '$ junglans security --verify-compliance',
        '-> Auditing data encryption & network boundaries...',
        '-> Zero External Server Connections Detected [PASSED]',
        '-> End-to-End Encryption Key Rotation: ACTIVE',
        '-> Biometric Vault Status: HARDENED',
        '✔ COMPLIANCE VERIFIED: SOC2 Type II & Zero-Trust Compliant.'
      ];
    }

    setTimeout(() => {
      setTerminalOutput(newLogs);
      setIsRunning(false);
    }, 300);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 bg-white border border-[#A7F3D0] shadow-xl my-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="font-mono text-xs text-[#059669] font-bold uppercase tracking-widest">INTERACTIVE DEMO WIDGET</div>
          <h3 className="font-heading text-2xl font-bold text-[#08090c] mt-1">Live Enterprise CLI Terminal Simulator</h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-[#059669] bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
          <span className="font-bold">INTERACTIVE TERMINAL</span>
        </div>
      </div>

      {/* Preset Command Buttons */}
      <div className="flex flex-wrap gap-2 mb-4 font-mono text-xs">
        {[
          { key: 'scan', label: '▶ junglans scan' },
          { key: 'sidecar', label: '▶ junglans sidecar' },
          { key: 'ide', label: '▶ junglans ide' },
          { key: 'talktodb', label: '▶ junglans talktodb' },
          { key: 'security', label: '▶ junglans security' },
        ].map((cmd) => (
          <button
            key={cmd.key}
            onClick={() => runCommand(cmd.key)}
            className={`px-3.5 py-2 rounded-xl font-bold border transition cursor-pointer ${
              activeCommand === cmd.key
                ? 'bg-[#10B981] text-white border-transparent shadow-md'
                : 'bg-[#F4FBF7] text-slate-700 border-[#A7F3D0] hover:bg-[#ECFDF5]'
            }`}
          >
            {cmd.label}
          </button>
        ))}
      </div>

      {/* Terminal Screen Container */}
      <div className="bg-[#08090c] text-emerald-400 rounded-2xl p-6 font-mono text-xs shadow-2xl relative border border-slate-800 min-h-[220px]">
        {/* Terminal Header Dots */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 text-[11px] text-slate-400 font-bold">bash - junglans-cli</span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">OFFLINE MODE</span>
        </div>

        {/* Console Logs */}
        <div className="space-y-1.5">
          {isRunning ? (
            <div className="text-amber-400 animate-pulse">Executing command across 20 projects...</div>
          ) : (
            terminalOutput.map((line, idx) => (
              <div
                key={idx}
                className={
                  line.startsWith('✔')
                    ? 'text-emerald-400 font-bold'
                    : line.startsWith('$')
                    ? 'text-white font-bold'
                    : 'text-slate-300'
                }
              >
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
