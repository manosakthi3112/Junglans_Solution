import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { SITE_URL } from '../config';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#F4FBF7] bg-precision-grid">
      <Seo
        path="/404"
        title="Page Not Found — 404"
        description="The page you requested does not exist. Explore Junglans Solutions 20 products, blogs, and team."
      />
      <div className="glass-panel rounded-3xl p-8 sm:p-12 bg-white border border-[#A7F3D0] shadow-xl max-w-lg w-full">
        <div className="font-mono text-xs text-[#059669] font-bold mb-3">ERROR // 404_NOT_FOUND</div>
        <h1 className="font-heading text-5xl font-bold tracking-tight mb-3">404</h1>
        <h2 className="font-heading text-xl font-bold mb-3">Page not found</h2>
        <p className="font-body text-sm text-slate-600 mb-8">The page you requested does not exist in our portfolio catalog. Check the URL or return to the homepage.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center font-mono text-xs font-bold">
          <Link to="/" className="bg-[#10B981] text-white px-6 py-3 rounded-xl hover:bg-[#059669] transition">Return to Home</Link>
          <Link to="/contact" className="bg-white border border-[#A7F3D0] px-6 py-3 rounded-xl hover:bg-[#ECFDF5] transition">Contact Sales</Link>
        </div>
        <div className="mt-6 font-mono text-[11px] text-slate-400">If you followed a link, email <a href="mailto:enterprise@junglans.io" className="text-[#10B981] underline">enterprise@junglans.io</a></div>
      </div>
    </div>
  );
}
