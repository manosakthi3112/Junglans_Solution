import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import OurTeamPage from './pages/OurTeamPage';
import EnterpriseSecurityPage from './pages/EnterpriseSecurityPage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/team" element={<OurTeamPage />} />
          <Route path="/security" element={<EnterpriseSecurityPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
