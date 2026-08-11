import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogsData } from '../data/blogsData';

// Custom Markdown Renderer Component
function MarkdownContent({ content }) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Helper to parse blocks
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
                className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50"
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

// Inline markdown formatting helper (bold, code, math formulas)
function renderFormattedInline(text) {
  if (!text) return '';
  return text
    // Replace **bold**
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#08090c]">$1</strong>')
    // Replace `inline code`
    .replace(/`(.*?)`/g, '<code class="font-mono text-xs bg-[#ECFDF5] text-[#059669] px-1.5 py-0.5 rounded border border-[#A7F3D0]">$1</code>')
    // Math latex display block $$ formula $$
    .replace(/\$\$(.*?)\$\$/g, '<div class="my-3 py-2 px-4 bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm rounded-xl border border-slate-800 text-center shadow-inner overflow-x-auto">$$ $1 $$</div>')
    // Math latex inline $ formula $
    .replace(/\$(.*?)\$/g, '<span class="font-mono text-xs px-1.5 py-0.5 bg-slate-900 text-emerald-300 rounded font-semibold">$1</span>');
}

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
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
        <div className="flex items-center gap-4 p-4 bg-white border border-[#A7F3D0] rounded-2xl shadow-sm mb-10">
          <img
            src={blog.author.avatar}
            alt={blog.author.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#10B981]"
          />
          <div>
            <div className="font-heading font-bold text-base text-[#08090c]">{blog.author.name}</div>
            <div className="font-mono text-xs text-[#059669] font-medium">{blog.author.role}</div>
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
