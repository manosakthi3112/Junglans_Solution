import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { blogsData } from '../data/blogsData';

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Machine Learning Foundations',
    'LLM Evaluation & Benchmarking',
    'Model Architectures',
    'LLM Engineering',
    'RAG & Knowledge Retrieval'
  ];

  // Filtered blogs logic
  const filteredBlogs = useMemo(() => {
    return blogsData.filter((blog) => {
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        blog.title.toLowerCase().includes(query) ||
        blog.subtitle.toLowerCase().includes(query) ||
        blog.summary.toLowerCase().includes(query) ||
        blog.tags.some(tag => tag.toLowerCase().includes(query)) ||
        blog.author.name.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const featuredBlog = blogsData.find(b => b.featured) || blogsData[0];

  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] bg-precision-grid relative overflow-hidden pb-24">
      {/* Dynamic Animated Ambient Glow Spheres */}
      <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-[#10B981]/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute top-[600px] right-1/4 w-[450px] h-[450px] bg-[#34D399]/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2.5s' }}></div>

      {/* Hero Header Section */}
      <section className="relative px-4 sm:px-6 md:px-12 pt-8 sm:pt-16 md:pt-20 pb-8 sm:pb-12 border-b border-[#A7F3D0]/60">
        <div className="max-w-7xl mx-auto">
          
          <div className="inline-flex items-center gap-2 sm:gap-3 font-mono text-[10px] sm:text-xs text-[#08090c] bg-white border border-[#A7F3D0] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 shadow-sm max-w-full">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#10B981] animate-pulse-ring flex-shrink-0"></span>
            <span className="tracking-wider sm:tracking-widest uppercase font-bold text-[#059669] truncate">
              JUNGLANS RESEARCH <span className="hidden sm:inline">// AI & ENGINEERING</span>
            </span>
            <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] font-bold font-mono text-[9px] sm:text-[10px] border border-[#A7F3D0] flex-shrink-0">
              {blogsData.length} ARTICLES
            </span>
          </div>

          <h1 className="font-heading text-3xl min-[360px]:text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.08] sm:leading-[0.95] tracking-tight sm:tracking-tighter mb-4 sm:mb-6 text-[#08090c]">
            Deep-Dive <br className="hidden min-[480px]:inline" />
            <span className="bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] bg-clip-text text-transparent">
              Engineering Insights & AI Research
            </span>
          </h1>

          <p className="font-body text-sm sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 max-w-3xl leading-relaxed">
            In-depth technical guides covering Classical Machine Learning metrics, Large Language Model evaluation, Transformer mechanics, parameter tuning, and production RAG architecture.
          </p>

          {/* Search Bar & Category Filters Container */}
          <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-[#A7F3D0] shadow-sm max-w-4xl">
            
            {/* Search Input */}
            <div className="relative mb-5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, tag, metric (e.g. 'LoRA', 'RAG', 'F1-Score', 'Perplexity')..."
                className="w-full pl-12 pr-10 py-3.5 bg-[#ECFDF5]/50 border border-[#A7F3D0] rounded-xl text-sm font-mono text-[#08090c] focus:outline-none focus:ring-2 focus:ring-[#10B981] transition shadow-inner"
              />
              <svg className="w-5 h-5 absolute left-4 top-4 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-3.5 font-mono text-xs text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-wider mr-2">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`font-mono text-xs px-3.5 py-1.5 rounded-lg border transition cursor-pointer font-semibold ${
                    selectedCategory === cat
                      ? 'bg-[#10B981] text-white border-[#10B981] shadow-md shadow-emerald-500/20'
                      : 'bg-white text-slate-600 border-[#A7F3D0]/80 hover:bg-[#ECFDF5] hover:border-[#10B981]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Featured Blog Highlight Banner (Only visible when no search query filter is active) */}
      {!searchQuery && selectedCategory === 'All' && (
        <section className="px-4 sm:px-6 md:px-12 pt-10 pb-6 max-w-7xl mx-auto">
          <div className="font-mono text-xs uppercase tracking-widest text-[#059669] font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
            Featured AI Research Article
          </div>
          <Link
            to={`/blog/${featuredBlog.slug}`}
            className="group relative bg-white border-2 border-[#A7F3D0] rounded-3xl p-6 sm:p-10 shadow-lg hover:shadow-2xl transition duration-300 flex flex-col lg:flex-row gap-8 items-stretch overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl group-hover:bg-[#10B981]/15 transition duration-500 pointer-events-none"></div>

            <div className="flex-1 flex flex-col justify-between z-10">
              <div>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono text-xs px-3 py-1 rounded-full font-bold">
                    {featuredBlog.category}
                  </span>
                  <span className="font-mono text-xs text-slate-400">{featuredBlog.readTime}</span>
                  <span className="font-mono text-xs text-slate-400">• {featuredBlog.publishDate}</span>
                </div>

                <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#08090c] group-hover:text-[#10B981] transition-colors leading-tight mb-4">
                  {featuredBlog.title}
                </h2>

                <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                  {featuredBlog.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl text-white font-heading font-bold text-sm flex items-center justify-center shadow-md flex-shrink-0"
                    style={{ backgroundColor: featuredBlog.author.color || '#10B981' }}
                  >
                    {featuredBlog.author.avatar || 'JS'}
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs sm:text-sm text-[#08090c]">{featuredBlog.author.name}</div>
                    <div className="font-mono text-[10px] sm:text-xs text-slate-500">{featuredBlog.author.role}</div>
                  </div>
                </div>

                <div className="font-mono text-xs bg-[#10B981] text-white px-5 py-2.5 rounded-xl font-bold group-hover:bg-[#059669] transition flex items-center gap-2 shadow-md">
                  Read Article
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transform group-hover:translate-x-1 transition">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Main Blogs Grid Section */}
      <section className="px-4 sm:px-6 md:px-12 pt-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#A7F3D0]/60">
          <h2 className="font-heading text-2xl font-bold text-[#08090c] flex items-center gap-3">
            All Articles
            <span className="font-mono text-xs bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full font-bold">
              {filteredBlogs.length}
            </span>
          </h2>
          {searchQuery && (
            <div className="font-mono text-xs text-slate-500">
              Showing results for "<span className="text-[#059669] font-bold">{searchQuery}</span>"
            </div>
          )}
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#A7F3D0] rounded-2xl p-12 text-center my-8">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#10B981] mx-auto flex items-center justify-center mb-4 text-2xl font-bold">
              🔍
            </div>
            <h3 className="font-heading text-xl font-bold text-[#08090c] mb-2">No matching articles found</h3>
            <p className="font-body text-slate-500 text-sm max-w-md mx-auto mb-6">
              We couldn't find any blogs matching "{searchQuery}". Try searching for keywords like "LoRA", "RAG", "Metrics", or reset filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="font-mono text-xs bg-[#10B981] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#059669] transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="bg-white border border-[#A7F3D0] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono text-[11px] bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2.5 py-1 rounded-md font-bold truncate">
                      {blog.category}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 flex-shrink-0">
                      {blog.readTime}
                    </span>
                  </div>

                  <Link to={`/blog/${blog.slug}`}>
                    <h3 className="font-heading text-xl font-bold text-[#08090c] group-hover:text-[#10B981] transition-colors leading-snug mb-3 line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>

                  <p className="font-body text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                    {blog.summary}
                  </p>
                </div>

                <div>
                  {/* Tag List */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="font-mono text-[10px] text-slate-500 bg-slate-50 hover:bg-[#ECFDF5] hover:text-[#059669] px-2 py-0.5 rounded border border-slate-200 cursor-pointer transition"
                      >
                        #{tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="font-mono text-[10px] text-slate-400 self-center">
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg text-white font-heading font-bold text-[10px] flex items-center justify-center shadow-xs flex-shrink-0"
                        style={{ backgroundColor: blog.author.color || '#10B981' }}
                      >
                        {blog.author.avatar || 'JS'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-heading font-bold text-xs text-[#08090c]">{blog.author.name}</span>
                        <span className="font-mono text-[9px] text-slate-400">{blog.publishDate}</span>
                      </div>
                    </div>

                    <Link
                      to={`/blog/${blog.slug}`}
                      className="font-mono text-xs text-[#059669] font-bold group-hover:text-[#10B981] flex items-center gap-1"
                    >
                      Read ↗
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
