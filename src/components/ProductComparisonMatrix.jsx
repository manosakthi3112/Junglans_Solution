import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projectsData';

export default function ProductComparisonMatrix() {
  const [project1Id, setProject1Id] = useState('project-0');
  const [project2Id, setProject2Id] = useState('project-2');

  const project1 = projectsData.find((p) => p.id === project1Id) || projectsData[0];
  const project2 = projectsData.find((p) => p.id === project2Id) || projectsData[2];

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-10 bg-white border border-[#A7F3D0] shadow-xl my-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="font-mono text-xs text-[#059669] font-bold uppercase tracking-widest">INTERACTIVE COMPARISON ENGINE</div>
          <h3 className="font-heading text-3xl font-bold text-[#08090c] mt-1">Side-by-Side Product Comparison</h3>
        </div>
        <div className="font-mono text-xs text-slate-500 bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0] font-bold text-[#059669]">
          20 PROJECTS COMPARATOR
        </div>
      </div>

      {/* Select Pickers */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block font-mono text-xs font-bold text-slate-700 mb-2">Select First Product:</label>
          <select
            value={project1Id}
            onChange={(e) => setProject1Id(e.target.value)}
            className="w-full bg-[#F4FBF7] border border-[#A7F3D0] rounded-xl px-4 py-3 text-xs font-mono font-bold text-[#08090c] focus:outline-none focus:border-[#10B981]"
          >
            {projectsData.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.badge})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-mono text-xs font-bold text-slate-700 mb-2">Select Second Product:</label>
          <select
            value={project2Id}
            onChange={(e) => setProject2Id(e.target.value)}
            className="w-full bg-[#F4FBF7] border border-[#A7F3D0] rounded-xl px-4 py-3 text-xs font-mono font-bold text-[#08090c] focus:outline-none focus:border-[#10B981]"
          >
            {projectsData.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.badge})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Product 1 Card */}
        <div className="p-6 rounded-2xl bg-[#F4FBF7] border border-[#A7F3D0] space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: project1.color }}
              dangerouslySetInnerHTML={{ __html: project1.iconSvg }}
            />
            <div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                {project1.badge}
              </span>
              <div className="font-heading text-xl font-bold text-[#08090c] mt-1">{project1.name}</div>
            </div>
          </div>

          <p className="font-body text-xs text-slate-600">{project1.summary}</p>

          <div className="space-y-2 border-t border-[#E2E8F0] pt-4">
            <div className="text-slate-500 font-bold">KEY METRICS:</div>
            {project1.metrics.map((m, i) => (
              <div key={i} className="flex justify-between bg-white p-2 rounded-lg border border-slate-200">
                <span>{m.label}:</span>
                <span className="font-bold text-[#10B981]">{m.value}</span>
              </div>
            ))}
          </div>

          <Link
            to={`/project/${project1.id}`}
            className="block text-center bg-[#10B981] hover:bg-[#059669] text-white py-2.5 rounded-xl font-bold transition shadow-sm"
          >
            Open {project1.name} Page →
          </Link>
        </div>

        {/* Product 2 Card */}
        <div className="p-6 rounded-2xl bg-[#F4FBF7] border border-[#A7F3D0] space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: project2.color }}
              dangerouslySetInnerHTML={{ __html: project2.iconSvg }}
            />
            <div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                {project2.badge}
              </span>
              <div className="font-heading text-xl font-bold text-[#08090c] mt-1">{project2.name}</div>
            </div>
          </div>

          <p className="font-body text-xs text-slate-600">{project2.summary}</p>

          <div className="space-y-2 border-t border-[#E2E8F0] pt-4">
            <div className="text-slate-500 font-bold">KEY METRICS:</div>
            {project2.metrics.map((m, i) => (
              <div key={i} className="flex justify-between bg-white p-2 rounded-lg border border-slate-200">
                <span>{m.label}:</span>
                <span className="font-bold text-[#10B981]">{m.value}</span>
              </div>
            ))}
          </div>

          <Link
            to={`/project/${project2.id}`}
            className="block text-center bg-[#10B981] hover:bg-[#059669] text-white py-2.5 rounded-xl font-bold transition shadow-sm"
          >
            Open {project2.name} Page →
          </Link>
        </div>
      </div>
    </div>
  );
}
