import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogsData } from '../data/blogsData';

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
    return `<div class="my-4 p-4 rounded-xl bg-[#08090c] text-emerald-300 font-mono text-sm sm:text-base border-2 border-[#10B981] shadow-lg flex flex-col items-center justify-center gap-1 overflow-x-auto text-center">
      <span class="text-[10px] uppercase font-bold tracking-widest text-[#10B981]/80 font-mono">MATHEMATICAL FORMULA</span>
      <span class="font-bold tracking-wide text-white text-base sm:text-lg">${cleanMath}</span>
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
        <h1 id={id} key={`h1-${idx}`} className="font-heading text-3xl sm:text-4xl font-bold text-[#08090c] mt-10 mb-5 scroll-mt-24 pb-2 border-b border-[#A7F3D0]">
          {text}
        </h1>
      );
      return;
    }

    if (line.startsWith('## ')) {
      const text = line.replace('## ', '');
      const id = slugify(text);
      elements.push(
        <h2 id={id} key={`h2-${idx}`} className="font-heading text-2xl sm:text-3xl font-bold text-[#08090c] mt-8 mb-4 scroll-mt-24 flex items-center gap-2">
          <span className="text-[#10B981] font-mono text-xl">#</span>
          {text}
        </h2>
      );
      return;
    }

    if (line.startsWith('### ')) {
      const text = line.replace('### ', '');
      const id = slugify(text);
      elements.push(
        <h3 id={id} key={`h3-${idx}`} className="font-heading text-xl sm:text-2xl font-bold text-[#08090c] mt-6 mb-3 scroll-mt-24">
          {text}
        </h3>
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

  const blog = blogsData.find((b) => b.slug === slug || b.id === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#F4FBF7] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white border border-[#A7F3D0] rounded-2xl p-8 shadow-xl">
          <div className="text-4xl mb-4">📚</div>
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

  // Related articles
  const relatedArticles = blogsData
    .filter((b) => b.id !== blog.id && (b.category === blog.category || b.author.name === blog.author.name))
    .slice(0, 3);

  // Parse Headings for Table of Contents
  const headings = [];
  const lines = blog.content.split('\n');
  lines.forEach((line) => {
    if (line.startsWith('## ')) {
      const title = line.replace('## ', '');
      headings.push({ title, level: 2, id: slugify(title) });
    } else if (line.startsWith('### ')) {
      const title = line.replace('### ', '');
      headings.push({ title, level: 3, id: slugify(title) });
    }
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] bg-precision-grid relative overflow-hidden pb-24">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-[#10B981]/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Top Header / Breadcrumb Bar */}
      <section className="px-4 sm:px-6 md:px-12 pt-8 pb-6 border-b border-[#A7F3D0]/60 bg-white/70 backdrop-blur-md sticky top-[65px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/blogs')}
            className="font-mono text-xs text-[#059669] font-bold hover:text-[#10B981] transition flex items-center gap-2 cursor-pointer bg-[#ECFDF5] border border-[#A7F3D0] px-3.5 py-1.5 rounded-lg"
          >
            ← All Articles
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="font-mono text-xs bg-white text-slate-700 border border-[#A7F3D0] px-3 py-1.5 rounded-lg font-semibold hover:bg-[#ECFDF5] hover:text-[#059669] transition cursor-pointer flex items-center gap-1.5"
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
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-5.368 3 3 0 000 5.368zm0 7.158a3 3 0 100-5.368 3 3 0 000 5.368z" />
                  </svg>
                  <span>Share Article</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Main Article Hero */}
      <section className="px-4 sm:px-6 md:px-12 pt-10 pb-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="font-mono text-xs bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-3 py-1 rounded-full font-bold">
            {blog.category}
          </span>
          <span className="font-mono text-xs text-slate-400">{blog.readTime}</span>
          <span className="font-mono text-xs text-slate-400">• Published {blog.publishDate}</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-[#08090c] leading-[1.05] tracking-tight mb-6">
          {blog.title}
        </h1>

        <p className="font-body text-slate-600 text-base sm:text-xl leading-relaxed mb-8 border-l-4 border-[#10B981] pl-4">
          {blog.subtitle}
        </p>

        {/* Author Info Bar */}
        <div className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 bg-white border border-[#A7F3D0] rounded-2xl shadow-sm mb-8 sm:mb-10 max-w-xl">
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl text-white font-heading font-bold text-base sm:text-lg flex items-center justify-center shadow-md flex-shrink-0"
            style={{ backgroundColor: blog.author.color || '#10B981' }}
          >
            {blog.author.avatar || 'JS'}
          </div>
          <div className="min-w-0">
            <div className="font-heading font-bold text-sm sm:text-base text-[#08090c] truncate">{blog.author.name}</div>
            <div className="font-mono text-xs text-[#059669] font-medium truncate">{blog.author.role}</div>
          </div>
        </div>
      </section>

      {/* Content Layout Grid (Table of Contents + Article Body) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
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
                    h.level === 3 ? 'pl-4 text-slate-500' : 'font-semibold text-slate-700'
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
              ⚡ Executive Summary
            </h3>
            <p className="font-body text-slate-700 text-sm leading-relaxed">
              {blog.summary}
            </p>
          </div>

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
