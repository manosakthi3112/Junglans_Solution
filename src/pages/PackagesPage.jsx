import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { packagesData } from '../data/packagesData';
import PackageCodeSnippet from '../components/PackageCodeSnippet';
import PackageCliExplorer from '../components/PackageCliExplorer';
import CapabilitiesMatrix from '../components/CapabilitiesMatrix';
import Seo from '../components/Seo';
import { SITE_URL, SITE_NAME } from '../config';

export default function PackagesPage() {
  const [ecosystemFilter, setEcosystemFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPkgId, setCopiedPkgId] = useState(null);

  const filteredPackages = packagesData.filter((pkg) => {
    const matchesEcosystem = ecosystemFilter === 'all' || pkg.ecosystem === ecosystemFilter;
    const matchesSearch =
      searchQuery === '' ||
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesEcosystem && matchesSearch;
  });

  const handleCopyInstall = (pkg) => {
    const cmd =
      pkg.registry === 'npm'
        ? pkg.installCommands.npm
        : pkg.installCommands.pip;
    navigator.clipboard.writeText(cmd);
    setCopiedPkgId(pkg.id);
    setTimeout(() => setCopiedPkgId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] bg-precision-grid py-8 sm:py-14 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      <Seo
        title="Open-Source Packages & Documentation — npm & PyPI Developer Hub"
        description="Official documentation and developer packages by Junglans Solutions. Unified local-first analytics, on-page heatmaps, and AI version control sidecar across npm and PyPI."
        path="/packages"
        type="website"
        keywords="junglans packages, @junglans/trail, @junglans/trail-server, @junglans/trail-react, jung pypi, junglans-trail, local-first analytics npm, on-page heatmap react, git ai sidecar python"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Junglans Solutions Developer Packages',
            description: 'Official open-source libraries published across npm and PyPI by Junglans.',
            url: `${SITE_URL}/packages`,
            numberOfItems: packagesData.length,
            itemListElement: packagesData.map((pkg, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: pkg.name,
              description: pkg.tagline,
              url: `${SITE_URL}/packages/${pkg.slug}`
            }))
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Packages & Docs', item: `${SITE_URL}/packages` }
            ]
          }
        ]}
      />

      {/* Ambient Decorative Halo */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[350px] sm:w-[900px] h-[300px] sm:h-[500px] rounded-full blur-[160px] pointer-events-none opacity-20 bg-[#10B981]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-[#A7F3D0]/60">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
            <Link to="/" className="hover:text-[#10B981] transition font-bold">Home</Link>
            <span className="text-[#A7F3D0]">/</span>
            <span className="text-[#059669] font-bold">Packages & Documentation Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] font-mono text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              5 Active Packages
            </span>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 bg-[#ECFDF5] border border-[#A7F3D0] px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <span className="font-mono text-xs font-bold text-[#059669] uppercase tracking-wider">
              OFFICIAL DEVELOPER ECOSYSTEM // NPM & PYPI
            </span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-[#08090c] tracking-tight leading-tight sm:leading-none mb-6">
            Developer Packages & Documentation
          </h1>
          <p className="font-body text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            High-performance, local-first open-source tooling built for zero cloud telemetry, military-grade data privacy, and sub-millisecond execution. Explore our official packages published across <span className="font-semibold text-slate-800">npm</span> and <span className="font-semibold text-slate-800">PyPI</span>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto font-mono text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-[#A7F3D0] shadow-sm">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">npm Packages</div>
              <div className="font-heading text-xl font-bold text-[#059669]">3 Libraries</div>
              <div className="text-[10px] text-slate-400 mt-0.5">trail, trail-server, trail-react</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#A7F3D0] shadow-sm">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">PyPI Packages</div>
              <div className="font-heading text-xl font-bold text-[#059669]">2 Libraries</div>
              <div className="text-[10px] text-slate-400 mt-0.5">jung, junglans-trail</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#A7F3D0] shadow-sm">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Capabilities</div>
              <div className="font-heading text-xl font-bold text-[#10B981]">104 Built-in</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Heatmaps, funnels, telemetry</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#A7F3D0] shadow-sm">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">License</div>
              <div className="font-heading text-xl font-bold text-[#059669]">MIT Open Source</div>
              <div className="text-[10px] text-slate-400 mt-0.5">100% Free & Local-First</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#A7F3D0]/70 shadow-sm">
          {/* Ecosystem tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setEcosystemFilter('all')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                ecosystemFilter === 'all'
                  ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/20'
                  : 'bg-[#ECFDF5] text-[#059669] hover:bg-[#A7F3D0]/40 border border-[#A7F3D0]/60'
              }`}
            >
              All Packages ({packagesData.length})
            </button>
            <button
              onClick={() => setEcosystemFilter('javascript')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                ecosystemFilter === 'javascript'
                  ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/20'
                  : 'bg-[#ECFDF5] text-[#059669] hover:bg-[#A7F3D0]/40 border border-[#A7F3D0]/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              npm / Node / React (3)
            </button>
            <button
              onClick={() => setEcosystemFilter('python')}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                ecosystemFilter === 'python'
                  ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/20'
                  : 'bg-[#ECFDF5] text-[#059669] hover:bg-[#A7F3D0]/40 border border-[#A7F3D0]/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
              PyPI / Python (2)
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Filter packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4FBF7] border border-[#A7F3D0] text-slate-800 text-xs rounded-xl py-2 pl-8 pr-3 focus:outline-none focus:border-[#10B981] font-mono shadow-inner"
            />
            <svg
              className="absolute left-2.5 top-2.5 text-slate-400"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {filteredPackages.map((pkg) => {
            const isNpm = pkg.registry === 'npm';
            const primaryInstallCmd = isNpm ? pkg.installCommands.npm : pkg.installCommands.pip;
            const isCopied = copiedPkgId === pkg.id;

            return (
              <div
                key={pkg.id}
                className="rounded-3xl border border-[#A7F3D0] bg-white p-6 sm:p-8 shadow-lg hover:shadow-2xl hover:border-[#10B981] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Corner Accent Pill */}
                <div className="absolute top-0 right-0 bg-[#ECFDF5] border-b border-l border-[#A7F3D0] px-3.5 py-1.5 rounded-bl-2xl font-mono text-[10px] font-bold text-[#059669] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                  <span>{pkg.badge}</span>
                </div>

                <div>
                  {/* Registry & Runtime Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        isNpm
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {pkg.registry.toUpperCase()}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 font-semibold">
                      v{pkg.version}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {pkg.runtime}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#08090c] group-hover:text-[#10B981] transition-colors mb-2">
                    <Link to={`/packages/${pkg.slug}`} className="hover:underline">
                      {pkg.name}
                    </Link>
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-[#059669] font-semibold mb-3">
                    {pkg.tagline}
                  </p>
                  <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                    {pkg.summary}
                  </p>

                  {/* Highlights Pill List */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {pkg.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="font-mono text-[11px] bg-[#F4FBF7] border border-[#A7F3D0]/80 text-slate-700 px-2.5 py-1 rounded-lg"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>

                  {/* Quick Copy Terminal Box - 100% Light Theme */}
                  <div className="rounded-xl border border-[#A7F3D0] bg-[#F8FAFC] p-3 text-left font-mono text-xs flex items-center justify-between gap-2 shadow-inner mb-6">
                    <div className="text-slate-800 overflow-x-auto whitespace-nowrap font-medium">
                      <span className="text-[#059669] font-bold">$ </span>
                      <span>{primaryInstallCmd}</span>
                    </div>
                    <button
                      onClick={() => handleCopyInstall(pkg)}
                      className="flex-shrink-0 text-[11px] bg-white hover:bg-[#ECFDF5] text-[#059669] hover:text-emerald-700 px-2.5 py-1 rounded-md transition font-mono cursor-pointer border border-[#A7F3D0] font-bold shadow-xs"
                      title="Copy install command"
                    >
                      {isCopied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[#A7F3D0]/60 gap-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={pkg.registryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-slate-600 hover:text-[#10B981] transition flex items-center gap-1 font-semibold"
                    >
                      <span>View on {isNpm ? 'npm' : 'PyPI'}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </a>
                  </div>

                  <Link
                    to={`/packages/${pkg.slug}`}
                    className="font-mono text-xs bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 group-hover:scale-105"
                  >
                    <span>Read Documentation</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 30-Second Unified Quickstart Section */}
        <div className="my-16 p-6 sm:p-10 rounded-3xl bg-white border border-[#A7F3D0] shadow-xl text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#A7F3D0]/60 gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span className="font-mono text-xs text-[#059669] font-bold uppercase tracking-wider">
                  Zero SaaS Dependencies // 3-Line Integration
                </span>
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#08090c]">
                Quickstart in 30 Seconds
              </h2>
              <p className="font-body text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Mount analytics in Express, Next.js, FastAPI, or connect React components. Telemetry is saved in your local SQLite store instantly.
              </p>
            </div>
          </div>

          <PackageCodeSnippet
            tabs={[
              {
                title: "Express.js (Node)",
                label: "Express.js",
                language: "javascript",
                filename: "server.js",
                code: `import express from 'express';
import { jungtrailMiddleware } from '@junglans/trail-server';

const app = express();
app.use(express.json());

// Mounts all 104 analytics, heatmap, e-commerce, and auth endpoints under /api/jungtrail
app.use('/api/jungtrail', jungtrailMiddleware({
  dbName: 'analytics.db',
  dbPath: './data/analytics.db',
  adminKey: process.env.ADMIN_KEY || 'demo-admin-key'
}));

app.listen(8000, () => console.log('Trail active on port 8000'));`
              },
              {
                title: "Next.js App Router",
                label: "Next.js",
                language: "typescript",
                filename: "app/api/jungtrail/[...jungtrail]/route.ts",
                code: `import { createJungtrailRoute } from '@junglans/trail-server';

const handler = createJungtrailRoute({
  dbName: 'analytics.db',
  dbPath: './data/analytics.db',
  adminKey: process.env.ADMIN_KEY,
});

export { handler as GET, handler as POST, handler as DELETE };`
              },
              {
                title: "FastAPI (Python)",
                label: "FastAPI",
                language: "python",
                filename: "main.py",
                code: `from fastapi import FastAPI
from junglans_trail import jungtrail_fastapi_middleware

app = FastAPI()

# Mounts all analytics and visual heatmap endpoints onto /api/jungtrail
jungtrail_fastapi_middleware(
    app,
    db_name="analytics.db",
    db_path="data/analytics.db",
    admin_key="your-admin-secret"
)

@app.get("/")
def index():
    return {"status": "ok", "telemetry": "local-first"}`
              },
              {
                title: "React Provider & Widget",
                label: "React SDK",
                language: "tsx",
                filename: "App.tsx",
                code: `import React from 'react';
import { TrailProvider, TrailWidget, useAnalytics } from '@junglans/trail-react';

export default function App() {
  return (
    <TrailProvider endpoint="/api/jungtrail">
      <MainApplication />
      {/* Floating admin analytics drawer + live on-page radial heatmap */}
      <TrailWidget adminKey="demo-admin-key" />
    </TrailProvider>
  );
}`
              },
              {
                title: "jung Sidecar CLI",
                label: "jung (PyPI)",
                language: "bash",
                filename: "terminal",
                code: `# 1. Install sidecar CLI
pip install jung

# 2. Initialize in repository (creates .jung/ and Git post-commit hook)
jung init

# 3. Start watching IDE sessions (Antigravity, Cursor, Claude Code)
jung watch

# 4. Check AI attribution & token spend
jung blame src/auth.py
jung cost --by model`
              }
            ]}
          />
        </div>

        {/* Interactive CLI Terminal Simulator */}
        <PackageCliExplorer />

        {/* 104 Capabilities Taxonomy Matrix */}
        <CapabilitiesMatrix />

        {/* Architecture Comparison: Local-First vs. Cloud SaaS */}
        <div className="my-16 rounded-3xl bg-white border border-[#A7F3D0] p-6 sm:p-10 shadow-xl text-left">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="font-mono text-xs font-bold text-[#059669] uppercase tracking-wider mb-2">
              ARCHITECTURAL FOUNDATION // PRIVACY FIRST
            </div>
            <h3 className="font-heading font-black text-2xl sm:text-4xl text-[#08090c]">
              Why Local-First Analytics Outperforms Cloud SaaS
            </h3>
            <p className="font-body text-xs sm:text-sm text-slate-600 mt-2">
              Traditional analytics platforms charge per event and route sensitive user interactions across foreign cloud servers. Junglans keeps every byte securely in your local environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Cloud SaaS Box */}
            <div className="p-6 rounded-2xl bg-red-50/50 border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <h4 className="font-heading font-bold text-lg text-red-900">
                  Traditional Cloud Analytics (Mixpanel, GA4, Hotjar)
                </h4>
              </div>
              <ul className="space-y-2.5 font-body text-xs sm:text-sm text-red-800">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Heavy recurring SaaS bills</strong> based on monthly tracked users (MTUs) and event volumes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Third-party cloud data leakage:</strong> sensitive customer behavioral paths leave your infrastructure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Client script bloat:</strong> heavy external trackers impact Core Web Vitals and Lighthouse scores.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Ad-blocker suppression:</strong> up to 40% of visitor telemetry is blocked before reaching servers.</span>
                </li>
              </ul>
            </div>

            {/* Junglans Local-First Solution */}
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-[#A7F3D0]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <h4 className="font-heading font-bold text-lg text-emerald-950">
                  Junglans Local-First Ecosystem (@junglans/trail & jung)
                </h4>
              </div>
              <ul className="space-y-2.5 font-body text-xs sm:text-sm text-emerald-900">
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] font-bold">✓</span>
                  <span><strong>Zero tracking fees ($0/mo):</strong> stores all data in your own SQLite database using high-throughput WAL mode.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] font-bold">✓</span>
                  <span><strong>Absolute data sovereignty:</strong> complies with GDPR, HIPAA, and DPDP laws natively because data never leaves your server.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] font-bold">✓</span>
                  <span><strong>First-party same-origin traffic:</strong> routes to <code>/api/jungtrail</code>, bypassing browser ad-blockers naturally.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] font-bold">✓</span>
                  <span><strong>Sub-millisecond execution:</strong> SQLite WAL handles thousands of events per second with zero network latency overhead.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Global CTA Box */}
        <div className="text-center bg-gradient-to-r from-[#10B981] to-[#059669] text-white p-8 sm:p-12 rounded-3xl shadow-xl">
          <h3 className="font-heading font-black text-2xl sm:text-4xl mb-4">
            Ready to deploy local-first telemetry or AI attribution?
          </h3>
          <p className="font-body text-xs sm:text-base text-emerald-100 max-w-2xl mx-auto mb-8">
            Install any of our 5 packages right now or read their dedicated documentation pages.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
            <Link
              to="/packages/trail"
              className="bg-white text-[#059669] hover:bg-emerald-50 px-6 py-3 rounded-xl font-bold transition shadow-md"
            >
              Explore @junglans/trail Docs ↗
            </Link>
            <Link
              to="/packages/jung"
              className="bg-[#047857] hover:bg-[#065f46] text-white border border-emerald-300/40 px-6 py-3 rounded-xl font-bold transition shadow-md"
            >
              Explore jung PyPI Docs ↗
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
