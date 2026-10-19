import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogsData } from '../data/blogsData';
import Seo from '../components/Seo';
import { SITE_URL } from '../config';

// LaTeX Math Converter to human-readable mathematical symbols
function convertLatexToReadableMath(latexStr) {
  if (!latexStr) return '';
  let str = latexStr.trim();

  // 1. Text command \text{something} -> something
  str = str.replace(/\\text\{([^}]+)\}/g, '$1');

  // 2. Fractions \frac{num}{den} -> (num) / (den)
  // Repeat to handle potential nested fractions
  for (let i = 0; i < 3; i++) {
    str = str.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)');
  }

  // 3. Summations, Products, Integrals
  str = str.replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '∑ ($1 to $2)');
  str = str.replace(/\\sum_\{([^}]+)\}/g, '∑ ($1)');
  str = str.replace(/\\sum/g, '∑');

  str = str.replace(/\\prod_\{([^}]+)\}\^\{([^}]+)\}/g, '∏ ($1 to $2)');
  str = str.replace(/\\prod_\{([^}]+)\}/g, '∏ ($1)');
  str = str.replace(/\\prod/g, '∏');

  // 4. Functions & Exponential
  str = str.replace(/\\exp\\left\((.*?)\\right\)/g, 'exp($1)');
  str = str.replace(/\\exp/g, 'exp');
  str = str.replace(/\\log_2/g, 'log₂');
  str = str.replace(/\\log/g, 'log');
  str = str.replace(/\\softmax/g, 'softmax');
  str = str.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
  str = str.replace(/\\sqrt/g, '√');

  // 5. Relations and Symbols
  str = str.replace(/\\in/g, '∈');
  str = str.replace(/\\notin/g, '∉');
  str = str.replace(/\\approx/g, '≈');
  str = str.replace(/\\propto/g, '∝');
  str = str.replace(/\\times/g, '×');
  str = str.replace(/\\cdot/g, '·');
  str = str.replace(/\\le/g, '≤');
  str = str.replace(/\\ge/g, '≥');
  str = str.replace(/\\ll/g, '≪');
  str = str.replace(/\\gg/g, '≫');
  str = str.replace(/\\neq/g, '≠');
  str = str.replace(/\\infty/g, '∞');
  str = str.replace(/\\rightarrow/g, '→');
  str = str.replace(/\\longrightarrow/g, '⟶');
  str = str.replace(/\\dots/g, '...');
  str = str.replace(/\\cap/g, '∩');
  str = str.replace(/\\cup/g, '∪');

  // 6. Greek letters
  str = str.replace(/\\alpha/g, 'α');
  str = str.replace(/\\beta/g, 'β');
  str = str.replace(/\\gamma/g, 'γ');
  str = str.replace(/\\delta/g, 'δ');
  str = str.replace(/\\epsilon/g, 'ε');
  str = str.replace(/\\theta/g, 'θ');
  str = str.replace(/\\sigma/g, 'σ');
  str = str.replace(/\\pi/g, 'π');
  str = str.replace(/\\lambda/g, 'λ');
  str = str.replace(/\\mu/g, 'μ');
  str = str.replace(/\\rho/g, 'ρ');
  str = str.replace(/\\tau/g, 'τ');
  str = str.replace(/\\phi/g, 'ϕ');
  str = str.replace(/\\omega/g, 'ω');
  str = str.replace(/\\Theta/g, 'Θ');
  str = str.replace(/\\Sigma/g, 'Σ');
  str = str.replace(/\\mathbb\{E\}/g, 'E');

  // 7. Accents & Special Notation
  str = str.replace(/\\hat\{y\}/g, 'ŷ');
  str = str.replace(/\\bar\{y\}/g, 'ȳ');
  str = str.replace(/\\Delta W/g, 'ΔW');

  // 8. Convert subscripts and superscripts
  const subMap = {
    '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',
    'i':'ᵢ','j':'ⱼ','k':'ₖ','m':'ₘ','n':'ₙ','p':'ₚ','r':'ᵣ','s':'ₛ','t':'ₜ','x':'ₓ','y':'ᵧ'
  };
  const superMap = {
    '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',
    'n':'ⁿ','T':'ᵀ'
  };

  str = str.replace(/_([0-9a-z])/g, (m, p1) => subMap[p1] || `_${p1}`);
  str = str.replace(/\^([0-9a-zA-Z])/g, (m, p1) => superMap[p1] || `^${p1}`);

  // Cleanup stray brackets or backslashes
  str = str.replace(/\\/g, '');
  str = str.replace(/[\{\}]/g, '');
  str = str.replace(/\s+/g, ' ').trim();

  return str;
}

// Inline markdown & LaTeX renderer
function renderFormattedInline(text) {
  if (!text) return '';

  // 1. Process math display block $$ formula $$
  let processed = text.replace(/\$\$(.*?)\$\$/g, (match, formula) => {
    const cleanMath = convertLatexToReadableMath(formula);
    return `<div class="my-4 p-4 rounded-xl bg-[#F8FAFC] text-slate-800 font-mono text-sm sm:text-base border-2 border-[#A7F3D0] shadow-sm flex flex-col items-center justify-center gap-1 overflow-x-auto text-center">
      <span class="text-[10px] uppercase font-bold tracking-widest text-[#059669] font-mono">MATHEMATICAL FORMULA</span>
      <span class="font-bold tracking-wide text-[#08090c] text-base sm:text-lg">${cleanMath}</span>
    </div>`;
  });

  // 2. Process inline math $ formula $
  processed = processed.replace(/\$(.*?)\$/g, (match, formula) => {
    const cleanMath = convertLatexToReadableMath(formula);
    return `<span class="font-mono text-xs sm:text-sm px-2 py-0.5 bg-[#ECFDF5] text-[#047857] rounded-md border border-[#A7F3D0] font-bold shadow-xs mx-0.5 inline-block">${cleanMath}</span>`;
  });

  // 3. Process **bold**
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#08090c]">$1</strong>');

  // 4. Process `inline code`
  processed = processed.replace(/`(.*?)`/g, '<code class="font-mono text-xs bg-[#ECFDF5] text-[#059669] px-1.5 py-0.5 rounded border border-[#A7F3D0]">$1</code>');

  return processed;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

// Custom Markdown Renderer Component
function MarkdownContent({ content }) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const lines = content.trim().split('\n');
  const elements = [];
  let currentCodeBlock = null;
  let codeBlockLang = '';
  let inTable = false;
  let tableHeader = [];
  let tableRows = [];
  let codeBlockIndexCounter = 0;

  lines.forEach((line, idx) => {
    // Code block handling
    if (line.trim().startsWith('```')) {
      if (currentCodeBlock !== null) {
        // End code block
        const codeText = currentCodeBlock.join('\n');
        const codeIdx = codeBlockIndexCounter++;
        const lang = codeBlockLang || 'text';
        elements.push(
          <div key={`code-${idx}`} className="my-6 rounded-2xl bg-[#0d1117] text-slate-100 border border-slate-800 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800 font-mono text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="text-emerald-400 font-bold uppercase">{lang}</span>
              </span>
              <button
                onClick={() => copyToClipboard(codeText, codeIdx)}
                className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50 font-mono text-xs"
              >
                {copiedCodeIndex === codeIdx ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" />
                    </svg>
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-emerald-300/90">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        currentCodeBlock = null;
        codeBlockLang = '';
      } else {
        // Start code block
        currentCodeBlock = [];
        codeBlockLang = line.trim().replace('```', '');
      }
      return;
    }

    if (currentCodeBlock !== null) {
      currentCodeBlock.push(line);
      return;
    }

    // Table handling
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHeader = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());
      } else if (line.includes('---')) {
        // Separator line - ignore
      } else {
        const row = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());
        if (row.length > 0) tableRows.push(row);
      }
      return;
    } else if (inTable) {
      // Flush table
      elements.push(
        <div key={`table-${idx}`} className="my-6 overflow-x-auto border border-[#A7F3D0] rounded-xl bg-white shadow-sm">
          <table className="w-full text-left font-body text-xs sm:text-sm">
            <thead className="bg-[#ECFDF5] border-b border-[#A7F3D0] font-mono font-bold text-[#059669]">
              <tr>
                {tableHeader.map((h, i) => (
                  <th key={i} className="px-4 py-3 border-r border-[#A7F3D0] last:border-0" dangerouslySetInnerHTML={{ __html: renderFormattedInline(h) }} />
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableRows.map((r, ri) => (
                <tr key={ri} className="hover:bg-slate-50/50">
                  {r.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 border-r border-slate-100 last:border-0 text-slate-700" dangerouslySetInnerHTML={{ __html: renderFormattedInline(cell) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableHeader = [];
      tableRows = [];
    }

    // Headings
    if (line.startsWith('# ')) {
      const text = line.replace('# ', '');
      const id = slugify(text);
      elements.push(
        <h2 id={id} key={`h1-${idx}`} className="font-heading text-3xl sm:text-4xl font-bold text-[#08090c] mt-10 mb-5 scroll-mt-24 pb-2 border-b border-[#A7F3D0]">
          {text}
        </h2>
      );
      return;
    }

    if (line.startsWith('## ')) {
      const text = line.replace('## ', '');
      const id = slugify(text);
      elements.push(
        <h3 id={id} key={`h2-${idx}`} className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] mt-8 mb-4 scroll-mt-24 flex items-center gap-2">
          <span className="text-[#10B981] font-mono text-xl">#</span>
          {text}
        </h3>
      );
      return;
    }

    if (line.startsWith('### ')) {
      const text = line.replace('### ', '');
      const id = slugify(text);
      elements.push(
        <h4 id={id} key={`h3-${idx}`} className="font-heading text-xl sm:text-2xl font-bold text-[#08090c] mt-6 mb-3 scroll-mt-24">
          {text}
        </h4>
      );
      return;
    }

    // Blockquote & Alert Boxes
    if (line.startsWith('> ')) {
      const quoteText = line.replace('> ', '');
      elements.push(
        <blockquote key={`bq-${idx}`} className="my-5 p-4 rounded-xl bg-[#ECFDF5] border-l-4 border-[#10B981] text-slate-700 font-body text-sm leading-relaxed shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: renderFormattedInline(quoteText) }} />
        </blockquote>
      );
      return;
    }

    // Horizontal Rule
    if (line.trim() === '---') {
      elements.push(<hr key={`hr-${idx}`} className="my-8 border-[#A7F3D0]/80" />);
      return;
    }

    // Unordered List Items
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      const itemText = line.trim().replace(/^[\*\-]\s+/, '');
      elements.push(
        <li key={`li-${idx}`} className="ml-5 list-disc text-slate-700 font-body text-sm sm:text-base my-1.5 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: renderFormattedInline(itemText) }} />
        </li>
      );
      return;
    }

    // Ordered List Items
    if (/^\d+\.\s+/.test(line.trim())) {
      const itemText = line.trim().replace(/^\d+\.\s+/, '');
      elements.push(
        <li key={`oli-${idx}`} className="ml-5 list-decimal text-slate-700 font-body text-sm sm:text-base my-1.5 leading-relaxed font-semibold">
          <span className="font-normal" dangerouslySetInnerHTML={{ __html: renderFormattedInline(itemText) }} />
        </li>
      );
      return;
    }

    // Empty lines
    if (line.trim() === '') return;

    // Standard Paragraphs
    elements.push(
      <p key={`p-${idx}`} className="font-body text-slate-700 text-sm sm:text-base my-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderFormattedInline(line) }} />
    );
  });

  return <div className="markdown-content">{elements}</div>;
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const blog = blogsData.find((b) => b.slug === slug || b.id === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    const el = document.getElementById('article-content');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#F4FBF7] flex items-center justify-center p-6 text-center">
        <Seo
          path={`/blog/${slug}`}
          title="Article Not Found — 404"
          description="The blog article you requested could not be located. Explore Junglans Research engineering guides."
          noIndex={true}
        />
        <div className="max-w-md bg-white border border-[#A7F3D0] rounded-2xl p-8 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto mb-4 border border-[#A7F3D0]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#08090c] mb-3">Article Not Found</h1>
          <p className="font-body text-slate-600 text-sm mb-6">
            The blog article you requested could not be located. It may have been moved or renamed.
          </p>
          <Link
            to="/blogs"
            className="font-mono text-xs bg-[#10B981] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#059669] transition inline-block shadow-md"
          >
            ← Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  // Related articles with safe comparison
  const relatedArticles = blogsData
    .filter((b) => b.id !== blog.id && (b.category === blog.category || b.author?.name === blog.author?.name))
    .slice(0, 3);

  // Key topics covered — first three ## headings (GEO extraction source)
  const keyTopics = [];
  const contentLines = blog.content.split('\n');
  contentLines.forEach((line) => {
    if (line.startsWith('## ') && keyTopics.length < 3) {
      keyTopics.push(line.replace('## ', '').replace(/^\d+\.\s*/, '').trim());
    }
  });

  // Parse Headings for Table of Contents
  const headings = [];
  const lines = blog.content.split('\n');
  lines.forEach((line) => {
    if (line.startsWith('# ')) {
      if (headings.length === 0) return;
      const title = line.replace('# ', '');
      headings.push({ title, level: 2, id: slugify(title) });
    } else if (line.startsWith('## ')) {
      const title = line.replace('## ', '');
      headings.push({ title, level: 3, id: slugify(title) });
    } else if (line.startsWith('### ')) {
      const title = line.replace('### ', '');
      headings.push({ title, level: 4, id: slugify(title) });
    }
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getIsoDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] bg-precision-grid relative overflow-hidden pb-24">
      {/* Real-Time Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#10B981] via-[#059669] to-[#34D399] transition-all duration-150 ease-out shadow-sm shadow-[#10B981]/50"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <Seo
        title={blog.title}
        description={blog.subtitle}
        path={`/blog/${blog.slug}`}
        type="article"
        keywords={(blog.tags || []).slice(0, 5).join(', ')}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: blog.title,
          description: blog.subtitle,
          url: `${SITE_URL}/blog/${blog.slug}`,
          datePublished: getIsoDate(blog.publishDate),
          dateModified: getIsoDate(blog.publishDate),
          inLanguage: 'en',
          keywords: (blog.tags || []).join(', '),
          author: {
            '@type': 'Person',
            name: blog.author?.name || 'Junglans Team',
            jobTitle: blog.author?.role || 'Engineer',
            affiliation: { '@type': 'Organization', name: 'Junglans Solutions', url: SITE_URL }
          },
          publisher: {
            '@type': 'Organization',
            name: 'Junglans Solutions',
            url: SITE_URL
          },
          mainEntityOfPage: `${SITE_URL}/blog/${blog.slug}`
        }}
      />

      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-[700px] h-[700px] bg-[#10B981]/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-96 right-10 w-[500px] h-[500px] bg-[#34D399]/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Article Hero Section */}
      <section className="px-4 sm:px-6 md:px-12 pt-5 sm:pt-7 pb-8 max-w-7xl mx-auto">
        
        {/* Subtle Top Breadcrumbs & Actions Row (Non-Sticky, Natural Flow) */}
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
          <Link
            to="/blogs"
            className="font-mono text-xs text-[#059669] font-bold hover:text-[#10B981] transition inline-flex items-center gap-2 group bg-white/90 hover:bg-[#ECFDF5] border border-[#A7F3D0] px-3.5 py-1.5 rounded-xl shadow-2xs"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>All Articles</span>
            <span className="text-[10px] bg-[#ECFDF5] text-[#059669] px-1.5 py-0.5 rounded-md font-mono border border-[#A7F3D0]/70 ml-0.5">
              {blogsData.length}
            </span>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="font-mono text-xs text-slate-500 hidden sm:inline-flex items-center gap-1.5 bg-white/90 border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-2xs">
              <svg className="w-3.5 h-3.5 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                <polyline points="12 6 12 12 16 14" strokeWidth="2"></polyline>
              </svg>
              <span>{blog.readTime}</span>
            </span>

            <button
              onClick={handleShare}
              className="font-mono text-xs bg-white text-slate-700 hover:text-[#059669] border border-[#A7F3D0] hover:border-[#10B981] px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-2xs hover:bg-[#ECFDF5]"
            >
              {copiedLink ? (
                <>
                  <svg className="w-3.5 h-3.5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#10B981] font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-5.368 3 3 0 000 5.368zm0 7.158a3 3 0 100-5.368 3 3 0 000 5.368z" />
                  </svg>
                  <span>Share Article</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grand Hero Showcase Card */}
        <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-white/95 via-white/95 to-[#F0FDF4]/90 backdrop-blur-2xl border-2 border-[#A7F3D0] shadow-[0_20px_50px_-15px_rgba(16,185,129,0.12)] p-6 sm:p-10 md:p-12 transition-all">
          
          {/* Subtle Top Glowing Laser */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent"></div>
          
          {/* Ambient Inner Glow Orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#10B981]/12 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#34D399]/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Meta & Badges Strip */}
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-3 mb-5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{blog.category}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                <svg className="w-3.5 h-3.5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>PEER-REVIEWED SPEC</span>
              </span>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium text-slate-500 bg-slate-50 border border-slate-200/80">
                <span>SPEC-{(blog.id || '').toUpperCase()}</span>
              </span>
            </div>

            <div className="inline-flex items-center gap-3 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                  <polyline points="12 6 12 12 16 14" strokeWidth="2"></polyline>
                </svg>
                <span>{blog.readTime}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"></line>
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"></line>
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"></line>
                </svg>
                <span>Published {blog.publishDate}</span>
              </span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="relative z-10 font-heading text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-[#08090c] leading-[1.12] tracking-tight mb-6 mt-3">
            {blog.title}
          </h1>

          {/* Executive Abstract & Architectural Scope Callout */}
          <div className="relative z-10 overflow-hidden rounded-2xl bg-gradient-to-r from-[#ECFDF5] via-white to-[#F0FDF4]/70 border border-[#A7F3D0] p-5 sm:p-6 mb-6 shadow-xs">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#10B981] via-[#059669] to-[#34D399]"></div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[11px] font-bold text-[#059669] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              <span>Executive Abstract & Architectural Scope</span>
            </div>
            <p className="font-body text-slate-700 text-base sm:text-lg leading-relaxed pl-1">
              {blog.subtitle}
            </p>
          </div>

          {/* Tags Chips */}
          <div className="relative z-10 flex items-center gap-2 flex-wrap mb-8">
            <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-wider mr-1">Core Domains:</span>
            {(blog.tags || []).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center font-mono text-xs bg-white text-slate-700 hover:text-[#059669] hover:bg-[#ECFDF5] border border-slate-200/90 hover:border-[#A7F3D0] px-3 py-1 rounded-lg font-medium transition-all shadow-2xs"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Subtle Tech Separator */}
          <div className="relative z-10 w-full h-px bg-gradient-to-r from-transparent via-[#A7F3D0] to-transparent mb-6"></div>

          {/* Author & Editorial Trust Strip */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
            {/* Author Profile */}
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div
                  className="w-14 h-14 rounded-2xl text-white font-heading font-bold text-lg flex items-center justify-center shadow-md ring-4 ring-[#ECFDF5]"
                  style={{ backgroundColor: blog.author?.color || '#10B981' }}
                >
                  {blog.author?.avatar || 'JS'}
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white shadow-xs"
                  title="Verified Junglans Researcher"
                >
                  ✓
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#08090c]">
                    {blog.author?.name || 'Junglans Team'}
                  </h3>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded-full font-bold">
                    RESEARCH AUTHOR
                  </span>
                </div>
                <p className="font-mono text-xs text-[#059669] font-medium mt-0.5">
                  {blog.author?.role || 'Lead AI Architect'}
                </p>
                <p className="font-body text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <span>Junglans Solutions</span>
                  <span>•</span>
                  <span>AI & Automation Engineering Group</span>
                </p>
              </div>
            </div>

            {/* Quick Actions Deck */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <button
                onClick={handleShare}
                className="font-mono text-xs bg-white text-slate-800 border-2 border-[#A7F3D0] hover:border-[#10B981] px-4 py-2.5 rounded-xl font-bold hover:bg-[#ECFDF5] hover:text-[#059669] transition cursor-pointer flex items-center gap-2 shadow-sm"
              >
                {copiedLink ? (
                  <>
                    <svg className="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[#10B981]">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-5.368 3 3 0 000 5.368zm0 7.158a3 3 0 100-5.368 3 3 0 000 5.368z" />
                    </svg>
                    <span>Share Spec</span>
                  </>
                )}
              </button>

              <button
                onClick={scrollToContent}
                className="font-mono text-xs bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-5 py-2.5 rounded-xl font-bold hover:from-[#059669] hover:to-[#047857] transition shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2 group"
              >
                <span>Read Technical Guide</span>
                <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Content Layout Grid (Table of Contents + Article Body) */}
      <div id="article-content" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 scroll-mt-24">
        
        {/* Sidebar Table of Contents (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-28 bg-white/90 backdrop-blur-md border border-[#A7F3D0] rounded-2xl p-5 shadow-sm">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#059669] font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              Table of Contents
            </h4>
            <nav className="space-y-2 font-body text-xs">
              {headings.map((h, index) => (
                <a
                  key={index}
                  href={`#${h.id}`}
                  className={`block py-1 hover:text-[#10B981] transition leading-snug ${
                    h.level >= 3 ? 'pl-4 text-slate-500' : 'font-semibold text-slate-700'
                  }`}
                >
                  {h.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Article Body */}
        <main className="lg:col-span-9 bg-white border border-[#A7F3D0] rounded-3xl p-6 sm:p-12 shadow-sm">
          
          {/* Summary Box */}
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] border border-[#A7F3D0]">
            <h3 className="font-mono text-xs uppercase font-bold text-[#059669] tracking-wider mb-2 flex items-center gap-2">
              Executive Summary
            </h3>
            <p className="font-body text-slate-700 text-sm leading-relaxed">
              {blog.summary}
            </p>
          </div>

          {/* Key Takeaways (GEO extraction block) */}
          {keyTopics.length > 0 && (
            <div className="mb-8 p-6 rounded-2xl bg-white border-2 border-[#10B981]/40 shadow-sm">
              <h3 className="font-mono text-xs uppercase font-bold text-[#059669] tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse flex-shrink-0"></span>
                Key Takeaways
              </h3>
              <ul className="space-y-2.5 font-body text-sm text-slate-700">
                {keyTopics.map((topic, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✓</span>
                    <span>{topic} — covered in depth with practical examples, formulas, and code.</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Render Markdown Content */}
          <MarkdownContent content={blog.content} />

          {/* Tags */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-wider mr-2">Tags:</span>
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-3 py-1 rounded-md font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>

        </main>

      </div>

      {/* Author Bio + References (SEO & GEO) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="glass-panel rounded-3xl p-6 sm:p-8 bg-white border border-[#A7F3D0] shadow-md">
          <div className="font-mono text-xs text-[#059669] mb-4 font-bold uppercase tracking-widest">ABOUT THE AUTHOR</div>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-2xl text-white font-heading font-bold text-lg flex items-center justify-center shadow-md flex-shrink-0"
              style={{ backgroundColor: blog.author?.color || '#10B981' }}
            >
              {blog.author?.avatar || 'JS'}
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg text-[#08090c]">{blog.author?.name || 'Junglans Team'}</h4>
              <p className="font-mono text-xs text-[#059669] font-medium">{blog.author?.role || 'Engineer'}</p>
            </div>
          </div>
          <p className="font-body text-sm text-slate-600 leading-relaxed mb-4">
            {blog.author?.name || 'Junglans Team'} is part of the Junglans Solutions engineering team, specializing in {blog.category?.toLowerCase() || 'engineering'}.
            Junglans builds a 20-product ecosystem of local-first enterprise software — AI developer tools, encrypted
            communication, and data infrastructure with zero cloud telemetry.
          </p>
          <Link
            to="/team"
            className="font-mono text-xs text-[#10B981] font-bold hover:underline inline-flex items-center gap-1"
          >
            Meet the full Junglans engineering team ↗
          </Link>
        </section>

        <section className="glass-panel rounded-3xl p-6 sm:p-8 bg-white border border-[#A7F3D0] shadow-md">
          <div className="font-mono text-xs text-[#059669] mb-4 font-bold uppercase tracking-widest">RELATED RESOURCES & REFERENCES</div>
          <div className="space-y-3 font-body text-sm text-slate-600">
            <p className="leading-relaxed">
              This article is part of the Junglans Research knowledge base, produced alongside the engineering teams that
              build our production AI tools. Explore related product documentation and research:
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link to="/project/project-18" className="font-bold text-[#059669] hover:text-[#10B981] transition">
                  Junglans ML Visualizer ↗
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">Interactive 22-algorithm machine learning sandbox — see the concepts in action.</p>
              </li>
              <li>
                <Link to="/project/project-12" className="font-bold text-[#059669] hover:text-[#10B981] transition">
                  JunglasNCode ↗
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">Line-by-line code execution and call stack visualizer for algorithm practice.</p>
              </li>
              <li>
                <Link to="/blogs" className="font-bold text-[#059669] hover:text-[#10B981] transition">
                  All Junglans Research Articles ↗
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">More engineering and AI deep-dives from the Junglans team.</p>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* Related Articles Footer Section */}
      {relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mt-16 pt-12 border-t border-[#A7F3D0]/60">
          <h3 className="font-heading text-2xl font-bold text-[#08090c] mb-6 flex items-center gap-2">
            Related Research & Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                to={`/blog/${rel.slug}`}
                className="bg-white border border-[#A7F3D0] rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  <span className="font-mono text-[10px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded font-bold">
                    {rel.category}
                  </span>
                  <h4 className="font-heading font-bold text-base text-[#08090c] group-hover:text-[#10B981] transition-colors mt-3 mb-2 line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="font-body text-slate-500 text-xs line-clamp-2 mb-4">
                    {rel.summary}
                  </p>
                </div>
                <div className="font-mono text-xs text-[#059669] font-bold group-hover:text-[#10B981] flex items-center gap-1">
                  Read Article ↗
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
