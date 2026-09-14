import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { packagesData, allCapabilitiesList } from '../data/packagesData';
import PackageCodeSnippet from '../components/PackageCodeSnippet';
import PackageCliExplorer from '../components/PackageCliExplorer';
import Seo from '../components/Seo';
import { SITE_URL, SITE_NAME } from '../config';

export default function PackageDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Normalize slug to handle both "trail" and "@junglans/trail" or encoded "%40junglans%2Ftrail"
  const normalizedSlug = (slug || '')
    .replace(/^@junglans\//, '')
    .replace(/^%40junglans%2F/, '');

  const pkg = packagesData.find(
    (p) =>
      p.slug === normalizedSlug ||
      p.id === normalizedSlug ||
      p.npmPackageName === slug ||
      p.pypiPackageName === slug
  );

  const [activeSection, setActiveSection] = useState('overview');
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [faqOpenIdx, setFaqOpenIdx] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!pkg) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center text-[#08090c]">
        <Seo
          path={`/packages/${slug}`}
          title="Package Not Found — 404"
          description="The requested developer package does not exist. Explore our 5 open-source libraries across npm and PyPI."
          noIndex={true}
        />
        <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Package Not Found</h2>
        <p className="font-body text-slate-600 mb-8 max-w-md">
          The package documentation you requested is not available in our registry catalog.
        </p>
        <Link
          to="/packages"
          className="font-mono text-xs bg-[#10B981] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#059669] transition"
        >
          Return to Packages Hub
        </Link>
      </div>
    );
  }

  const isNpm = pkg.registry === 'npm';
  const installTabs = Object.entries(pkg.installCommands).map(([mgr, cmd]) => ({
    label: mgr,
    title: mgr.toUpperCase(),
    command: cmd,
    language: 'bash'
  }));

  const relatedPackages = packagesData.filter((p) => p.id !== pkg.id);

  const handleCopyInstallCmd = () => {
    const cmd = isNpm ? pkg.installCommands.npm : pkg.installCommands.pip;
    navigator.clipboard.writeText(cmd);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] bg-precision-grid py-8 sm:py-12 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      <Seo
        title={`${pkg.name} — Documentation & Installation Guide`}
        description={`${pkg.tagline}. ${pkg.summary}`.slice(0, 158)}
        path={`/packages/${pkg.slug}`}
        type="softwareApplication"
        keywords={`${pkg.name}, ${pkg.slug}, ${pkg.category}, ${pkg.registry} package, local-first analytics, ${pkg.ecosystem}`}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: pkg.name,
            codeRepository: pkg.repoUrl,
            programmingLanguage: pkg.ecosystem === 'javascript' ? 'JavaScript' : 'Python',
            runtimePlatform: pkg.runtime,
            description: pkg.summary,
            version: pkg.version,
            license: 'https://opensource.org/licenses/MIT',
            author: {
              '@type': 'Organization',
              name: 'Junglans Solutions',
              url: SITE_URL
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Packages Hub', item: `${SITE_URL}/packages` },
              { '@type': 'ListItem', position: 3, name: pkg.name, item: `${SITE_URL}/packages/${pkg.slug}` }
            ]
          }
        ]}
      />

      {/* Decorative Halo */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[350px] sm:w-[800px] h-[300px] sm:h-[450px] rounded-full blur-[160px] pointer-events-none opacity-20 bg-[#10B981]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-[#A7F3D0]/60">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-600">
            <Link to="/" className="hover:text-[#10B981] transition font-bold">Home</Link>
            <span className="text-[#A7F3D0]">/</span>
            <Link to="/packages" className="hover:text-[#10B981] transition font-bold">Packages</Link>
            <span className="text-[#A7F3D0]">/</span>
            <span className="text-[#059669] font-bold">{pkg.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/packages"
              className="font-mono text-xs text-slate-600 hover:text-[#10B981] transition flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Packages Hub</span>
            </Link>
          </div>
        </nav>

        {/* Package Header Hero Card */}
        <div className="rounded-3xl bg-white border border-[#A7F3D0] p-6 sm:p-10 shadow-xl mb-10 text-left relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span
                  className={`font-mono text-xs font-black uppercase px-2.5 py-1 rounded-lg border ${
                    isNpm
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {pkg.registry.toUpperCase()}
                </span>
                <span className="font-mono text-xs bg-[#ECFDF5] text-[#059669] px-2.5 py-1 rounded-lg border border-[#A7F3D0] font-bold">
                  v{pkg.version}
                </span>
                <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                  {pkg.runtime}
                </span>
                <span className="font-mono text-xs bg-emerald-50 text-[#059669] px-2.5 py-1 rounded-lg border border-[#A7F3D0]">
                  MIT License
                </span>
              </div>

              <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#08090c] tracking-tight mb-3">
                {pkg.name}
              </h1>

              <p className="font-body text-sm sm:text-base text-[#059669] font-bold mb-3">
                {pkg.tagline}
              </p>

              <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                {pkg.summary}
              </p>

              {/* Quick Action Links */}
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <a
                  href={pkg.registryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <span>View on {isNpm ? 'npm Registry' : 'PyPI Registry'}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>

                <a
                  href={pkg.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#ECFDF5] hover:bg-[#A7F3D0]/40 text-[#059669] border border-[#A7F3D0] px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5"
                >
                  <span>GitHub Repository</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Side Stats Panel */}
            <div className="lg:w-80 flex-shrink-0 grid grid-cols-2 gap-3 font-mono">
              {pkg.stats.map((st, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#F4FBF7] border border-[#A7F3D0]">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">{st.label}</div>
                  <div className="font-heading text-lg font-black text-[#059669]">{st.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Documentation Content Grid (TOC Sidebar + Main Body) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-left">
          
          {/* Table of Contents Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white border border-[#A7F3D0] p-4 shadow-sm space-y-1 font-mono text-xs">
              <div className="text-[10px] text-[#059669] font-bold uppercase tracking-wider px-3 py-2 border-b border-[#A7F3D0]/50 mb-2">
                On This Page
              </div>
              <a
                href="#installation"
                className="block px-3 py-2 rounded-lg text-slate-600 hover:text-[#10B981] hover:bg-[#ECFDF5] font-semibold transition"
              >
                1. Installation
              </a>
              <a
                href="#quickstart"
                className="block px-3 py-2 rounded-lg text-slate-600 hover:text-[#10B981] hover:bg-[#ECFDF5] font-semibold transition"
              >
                2. Quickstart & Usage
              </a>
              {pkg.capabilitiesCategories && (
                <a
                  href="#capabilities"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-[#10B981] hover:bg-[#ECFDF5] font-semibold transition"
                >
                  3. 104 Capabilities
                </a>
              )}
              {pkg.cliCommandsList && (
                <a
                  href="#cli-reference"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-[#10B981] hover:bg-[#ECFDF5] font-semibold transition"
                >
                  3. CLI Reference (24+ Commands)
                </a>
              )}
              {pkg.apiReference && (
                <a
                  href="#api-reference"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-[#10B981] hover:bg-[#ECFDF5] font-semibold transition"
                >
                  3. REST API Endpoints
                </a>
              )}
              {pkg.componentsList && (
                <a
                  href="#components"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-[#10B981] hover:bg-[#ECFDF5] font-semibold transition"
                >
                  3. Components & Hooks
                </a>
              )}
              {pkg.options && (
                <a
                  href="#options"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-[#10B981] hover:bg-[#ECFDF5] font-semibold transition"
                >
                  4. Configuration Options
                </a>
              )}
              <a
                href="#faq"
                className="block px-3 py-2 rounded-lg text-slate-600 hover:text-[#10B981] hover:bg-[#ECFDF5] font-semibold transition"
              >
                FAQ & Security
              </a>
              <a
                href="#related"
                className="block px-3 py-2 rounded-lg text-slate-600 hover:text-[#10B981] hover:bg-[#ECFDF5] font-semibold transition"
              >
                Related Packages
              </a>
            </div>
          </div>

          {/* Main Documentation Body */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Section 1: Installation */}
            <section id="installation" className="rounded-3xl bg-white border border-[#A7F3D0] p-6 sm:p-8 shadow-sm">
              <h2 className="font-heading font-black text-2xl text-[#08090c] mb-2 flex items-center gap-2">
                <span className="text-[#10B981]">1.</span> Installation
              </h2>
              <p className="font-body text-xs sm:text-sm text-slate-600 mb-4">
                Install {pkg.name} using your favorite package manager. All dependencies are minimal and zero-leakage.
              </p>

              <PackageCodeSnippet
                title="Install Command"
                tabs={installTabs}
              />
            </section>

            {/* Section 2: Quickstart */}
            <section id="quickstart" className="rounded-3xl bg-white border border-[#A7F3D0] p-6 sm:p-8 shadow-sm">
              <h2 className="font-heading font-black text-2xl text-[#08090c] mb-2 flex items-center gap-2">
                <span className="text-[#10B981]">2.</span> Quickstart & Implementation
              </h2>
              <p className="font-body text-xs sm:text-sm text-slate-600 mb-4">
                Get up and running in less than 30 seconds. Copy and paste the code snippets below directly into your codebase.
              </p>

              {pkg.quickstarts && (
                <PackageCodeSnippet
                  title="Code Examples"
                  tabs={pkg.quickstarts.map((qs) => ({
                    label: qs.title,
                    title: qs.title,
                    code: qs.code,
                    language: qs.language,
                    filename: qs.filename
                  }))}
                />
              )}
            </section>

            {/* Section 3A: CLI Reference (if jung) */}
            {pkg.cliCommandsList && (
              <section id="cli-reference" className="rounded-3xl bg-white border border-[#A7F3D0] p-6 sm:p-8 shadow-sm">
                <h2 className="font-heading font-black text-2xl text-[#08090c] mb-2 flex items-center gap-2">
                  <span className="text-[#10B981]">3.</span> Command-Line Reference
                </h2>
                <p className="font-body text-xs sm:text-sm text-slate-600 mb-6">
                  jung provides 24+ commands for tracking AI turns, Git diffs, token consumption, and code attribution.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  {pkg.cliCommandsList.map((cli, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#F4FBF7] border border-[#A7F3D0]/80 hover:border-[#10B981] transition"
                    >
                      <div className="font-bold text-[#059669] text-sm mb-1">
                        $ {cli.command}
                      </div>
                      <p className="font-body text-xs text-slate-600 leading-relaxed">
                        {cli.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <PackageCliExplorer />
                </div>
              </section>
            )}

            {/* Section 3B: REST API Reference (if trail-server or junglans-trail) */}
            {(pkg.apiReference || pkg.apiEndpoints) && (
              <section id="api-reference" className="rounded-3xl bg-white border border-[#A7F3D0] p-6 sm:p-8 shadow-sm">
                <h2 className="font-heading font-black text-2xl text-[#08090c] mb-2 flex items-center gap-2">
                  <span className="text-[#10B981]">3.</span> REST Ingestion & Analytics Endpoints
                </h2>
                <p className="font-body text-xs sm:text-sm text-slate-600 mb-6">
                  All endpoints are mounted automatically onto your host server under <code>/api/jungtrail</code>.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#A7F3D0] text-[#059669]">
                        <th className="pb-3 font-bold">Method</th>
                        <th className="pb-3 font-bold">Endpoint</th>
                        <th className="pb-3 font-bold">Authorization</th>
                        <th className="pb-3 font-bold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#A7F3D0]/40 font-body text-xs">
                      {(pkg.apiReference || pkg.apiEndpoints).map((ep, idx) => (
                        <tr key={idx} className="hover:bg-[#F4FBF7]">
                          <td className="py-3 font-mono font-bold text-slate-900">{ep.method}</td>
                          <td className="py-3 font-mono text-[#059669] font-bold">{ep.endpoint || ep.path}</td>
                          <td className="py-3 font-mono text-slate-500 text-[11px]">{ep.auth || 'Admin / Write Key'}</td>
                          <td className="py-3 text-slate-600">{ep.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Section 3C: React Components List (if trail-react) */}
            {pkg.componentsList && (
              <section id="components" className="rounded-3xl bg-white border border-[#A7F3D0] p-6 sm:p-8 shadow-sm">
                <h2 className="font-heading font-black text-2xl text-[#08090c] mb-2 flex items-center gap-2">
                  <span className="text-[#10B981]">3.</span> Components & Hooks
                </h2>
                <p className="font-body text-xs sm:text-sm text-slate-600 mb-6">
                  Exported components and hooks available from <code>@junglans/trail-react</code>.
                </p>

                <div className="space-y-4">
                  {pkg.componentsList.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#F4FBF7] border border-[#A7F3D0]/80"
                    >
                      <h4 className="font-mono font-bold text-sm text-[#059669] mb-1">
                        {comp.name}
                      </h4>
                      <p className="font-body text-xs text-slate-600 leading-relaxed">
                        {comp.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 3D: 104 Capabilities (if unified trail) */}
            {pkg.capabilitiesCategories && (
              <section id="capabilities" className="rounded-3xl bg-white border border-[#A7F3D0] p-6 sm:p-8 shadow-sm">
                <h2 className="font-heading font-black text-2xl text-[#08090c] mb-2 flex items-center gap-2">
                  <span className="text-[#10B981]">3.</span> 104 Built-in Capabilities
                </h2>
                <p className="font-body text-xs sm:text-sm text-slate-600 mb-6">
                  {pkg.name} incorporates 10 modular feature categories directly into your app.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pkg.capabilitiesCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#F4FBF7] border border-[#A7F3D0]/70"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-heading font-bold text-sm text-[#08090c]">
                          {cat.title}
                        </h4>
                        <span className="font-mono text-[10px] bg-white text-[#10B981] font-bold px-2 py-0.5 rounded-md border border-[#A7F3D0]">
                          {cat.count} features
                        </span>
                      </div>
                      <p className="font-body text-[11px] text-slate-600 leading-relaxed">
                        {cat.items.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 4: Configuration Options */}
            {pkg.options && (
              <section id="options" className="rounded-3xl bg-white border border-[#A7F3D0] p-6 sm:p-8 shadow-sm">
                <h2 className="font-heading font-black text-2xl text-[#08090c] mb-2 flex items-center gap-2">
                  <span className="text-[#10B981]">4.</span> Configuration Options
                </h2>
                <p className="font-body text-xs sm:text-sm text-slate-600 mb-6">
                  Configurable parameters passed into the initialization middleware or factory functions.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#A7F3D0] text-[#059669]">
                        <th className="pb-3 font-bold">Option</th>
                        <th className="pb-3 font-bold">Type</th>
                        <th className="pb-3 font-bold">Default</th>
                        <th className="pb-3 font-bold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#A7F3D0]/40 font-body text-xs">
                      {pkg.options.map((opt, idx) => (
                        <tr key={idx} className="hover:bg-[#F4FBF7]">
                          <td className="py-3 font-mono font-bold text-[#059669]">{opt.name}</td>
                          <td className="py-3 font-mono text-slate-500 text-[11px]">{opt.type}</td>
                          <td className="py-3 font-mono text-slate-700 text-[11px]">{opt.default}</td>
                          <td className="py-3 text-slate-600">{opt.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Section: FAQ */}
            <section id="faq" className="rounded-3xl bg-white border border-[#A7F3D0] p-6 sm:p-8 shadow-sm">
              <h2 className="font-heading font-black text-2xl text-[#08090c] mb-4">
                Frequently Asked Questions
              </h2>

              <div className="space-y-3">
                {pkg.faq.map((item, idx) => {
                  const isOpen = faqOpenIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#A7F3D0]/70 overflow-hidden bg-[#F4FBF7]"
                    >
                      <button
                        onClick={() => setFaqOpenIdx(isOpen ? null : idx)}
                        className="w-full px-4 py-3.5 text-left font-heading font-bold text-sm text-[#08090c] hover:text-[#10B981] transition flex items-center justify-between cursor-pointer"
                      >
                        <span>{item.q}</span>
                        <span className="text-[#059669] text-base">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 font-body text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-[#A7F3D0]/50 bg-white">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section: Related Packages */}
            <section id="related" className="rounded-3xl bg-white border border-[#A7F3D0] p-6 sm:p-8 shadow-sm">
              <h2 className="font-heading font-black text-2xl text-[#08090c] mb-4">
                Related Packages in Ecosystem
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPackages.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/packages/${rel.slug}`}
                    className="p-4 rounded-2xl bg-[#F4FBF7] border border-[#A7F3D0]/80 hover:border-[#10B981] hover:shadow-md transition block group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-bold text-sm text-[#08090c] group-hover:text-[#10B981] transition">
                        {rel.name}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 uppercase">
                        {rel.registry}
                      </span>
                    </div>
                    <p className="font-body text-xs text-slate-600 line-clamp-2">
                      {rel.tagline}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}
