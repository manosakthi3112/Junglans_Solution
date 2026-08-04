import React, { useState } from 'react';

export default function EnterpriseCalculator() {
  const [workforceSize, setWorkforceSize] = useState(580);
  const [selectedSuite, setSelectedSuite] = useState('full-suite');

  // Calculation formulas in Indian Rupees (₹)
  const multiplier = selectedSuite === 'full-suite' ? 24.5 : 12.0;
  const hoursSavedPerYear = Math.round(workforceSize * multiplier * 12);
  
  // Format with Indian currency format (e.g. ₹1,27,89,000)
  const calculateRupees = (hoursSavedPerYear * 75).toLocaleString('en-IN');

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 md:p-12 bg-white border border-[#A7F3D0] shadow-xl my-10 sm:my-16">
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="font-mono text-xs text-[#059669] mb-3 font-bold uppercase tracking-widest">INTERACTIVE ENTERPRISE CALCULATOR</div>
        <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#08090c] tracking-tight">Calculate Enterprise Productivity Savings</h2>
        <p className="font-body text-xs sm:text-base text-slate-600 mt-2">
          See how deploying Junglans Solutions tools transforms enterprise productivity across 20 software applications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex justify-between font-mono text-xs font-bold text-slate-700 mb-2">
              <span>Workforce / Team Size:</span>
              <span className="text-[#059669]">{workforceSize} Team Members</span>
            </div>
            <input
              type="range"
              min="10"
              max="2000"
              step="10"
              value={workforceSize}
              onChange={(e) => setWorkforceSize(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
            />
          </div>

          <div>
            <div className="font-mono text-xs font-bold text-slate-700 mb-2">Select Software Bundle:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <button
                onClick={() => setSelectedSuite('full-suite')}
                className={`p-3 rounded-xl border text-center font-bold cursor-pointer transition ${
                  selectedSuite === 'full-suite'
                    ? 'bg-[#10B981] text-white border-transparent shadow-md'
                    : 'bg-[#F4FBF7] text-slate-700 border-[#A7F3D0]'
                }`}
              >
                All 20 Projects Suite
              </button>
              <button
                onClick={() => setSelectedSuite('flagship-suite')}
                className={`p-3 rounded-xl border text-center font-bold cursor-pointer transition ${
                  selectedSuite === 'flagship-suite'
                    ? 'bg-[#10B981] text-white border-transparent shadow-md'
                    : 'bg-[#F4FBF7] text-slate-700 border-[#A7F3D0]'
                }`}
              >
                Main 5 Flagships
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          <div className="p-5 sm:p-6 bg-[#ECFDF5] rounded-2xl border border-[#A7F3D0] text-center">
            <div className="text-[10px] text-[#059669] font-bold uppercase mb-1">ANNUAL HOURS SAVED</div>
            <div className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c]">{hoursSavedPerYear.toLocaleString('en-IN')} hrs</div>
          </div>
          <div className="p-5 sm:p-6 bg-[#ECFDF5] rounded-2xl border border-[#A7F3D0] text-center">
            <div className="text-[10px] text-[#059669] font-bold uppercase mb-1">ANNUAL VALUE GENERATED</div>
            <div className="font-heading text-2xl sm:text-3xl font-bold text-[#10B981] break-all sm:break-normal">₹{calculateRupees}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
