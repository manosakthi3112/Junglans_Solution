import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FounderSpotlight from '../components/FounderSpotlight';

export default function OurTeamPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Team Members Data - User can easily update, add, or edit these team profiles
  const teamMembers = [
    {
      id: 'member-1',
      name: 'Manosakthi Thiyagarajan',
      role: 'Founder & Lead AI Architect',
      department: 'leadership',
      badge: 'FOUNDER',
      avatar: 'MT',
      color: '#10B981',
      bio: 'B.Tech in Artificial Intelligence & Data Science. Co-Founder at AscendiaEdu. Architected local-first enterprise software repositories for Junglans Solutions.',
      skills: ['AI Systems Architecture', 'Rust / C++', 'LLM Quantization', 'Zero-Trust Protocol'],
      email: 'manot6114@gmail.com',
      ascendiaEduUrl: 'https://ascendiaedu.online',
      isFounder: true
    },
    {
      id: 'member-2',
      name: 'Sri Kanish P',
      role: 'Co-Founder & ROS Developer',
      department: 'leadership',
      badge: 'CO-FOUNDER',
      avatar: 'SK',
      color: '#059669',
      bio: 'Co-Founder of Junglans Solutions & ROS Developer. B.Tech in Artificial Intelligence & Data Science with Diploma in ROS from iHub School of Learning. Hands-on experience developing robotic software nodes (ROS1/ROS2), hardware automation, and sensor control.',
      skills: ['ROS1 / ROS2', 'Robotics & Automation', 'Python / C++', 'Machine Learning', 'Sensor Control', 'Hardware Integration'],
      email: 'kanishpatrick@gmail.com',
      linkedin: 'https://www.linkedin.com/in/srikanish-parthiban-56a783368/',
      isFounder: true
    },
    {
      id: 'member-3',
      name: 'Yashika P',
      role: 'Founder @ AscendiaEdu & Lead DevOps Engineer',
      department: 'leadership',
      badge: 'FOUNDER @ ASCENDIA',
      avatar: 'YP',
      color: '#10B981',
      bio: 'Founder at AscendiaEdu & Lead DevOps Engineer. B.Tech in Artificial Intelligence & Data Science. Junior DevOps Engineer Trainee (Mr Intelligence Inc). Specialist in building CI/CD pipelines, Docker, Terraform cloud automation, and data analytics.',
      skills: ['DevOps', 'CI/CD Pipelines', 'Docker', 'Terraform', 'Python / Go', 'Cloud Automation'],
      email: 'yashikayash193@gmail.com',
      linkedin: 'https://linkedin.com/in/yashikap21',
      ascendiaEduUrl: 'https://ascendiaedu.online',
      isFounder: true
    },
    {
      id: 'member-4',
      name: 'Govindarajan Selvaraj',
      role: 'ML Engineer',
      department: 'ai',
      badge: 'ML ENGINEER',
      avatar: 'GS',
      color: '#059669',
      bio: 'B.Tech AI & Data Science graduate with expertise in machine learning, deep learning, computer vision, and robotics. Skilled in end-to-end model development with Python, PyTorch, and TensorFlow.',
      skills: ['Python', 'PyTorch', 'TensorFlow', 'Computer Vision', 'NLP', 'Deep Learning'],
      email: 'govindarajan1305@gmail.com',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 'member-5',
      name: 'Surya N',
      role: 'Full Stack Developer',
      department: 'engineering',
      badge: 'FULL STACK',
      avatar: 'SN',
      color: '#10B981',
      bio: 'B.Tech Information Technology graduate skilled in modern web development across MERN & PERN stacks. Hands-on experience building full-stack web applications using React, Node.js, Express, Next.js, and MongoDB.',
      skills: ['React', 'Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'Next.js'],
      email: 'suryan2398@gmail.com',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 'member-6',
      name: 'Vinoth M',
      role: 'Full Stack Developer',
      department: 'engineering',
      badge: 'FULL STACK',
      avatar: 'VM',
      color: '#10B981',
      bio: 'Full Stack Developer specializing in responsive scalable web applications, RESTful microservices, and database modeling across MERN & PERN stacks.',
      skills: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'Next.js', 'REST APIs'],
      email: 'vinoth@junglans.io',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 'member-7',
      name: 'Guruprasath C M',
      role: 'Mobile App Developer',
      department: 'engineering',
      badge: 'MOBILE DEV',
      avatar: 'GC',
      color: '#059669',
      bio: 'Mobile Application Developer with expertise in cross-platform development, native device integrations, state management, and high-performance mobile UI.',
      skills: ['Flutter', 'React Native', 'Android / iOS', 'Dart', 'State Management', 'Mobile UI/UX'],
      email: 'guruprasath@junglans.io',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 'member-8',
      name: 'Akshaya Keerthi A V',
      role: 'UI/UX Developer',
      department: 'product',
      badge: 'UI/UX DEV',
      avatar: 'AK',
      color: '#10B981',
      bio: 'UI/UX Developer crafting intuitive design systems, interactive prototypes, user journey workflows, and pixel-perfect responsive web interfaces.',
      skills: ['UI/UX Design', 'Figma', 'Design Systems', 'TailwindCSS', 'Frontend Architecture', 'Prototyping'],
      email: 'akshayakeerthi@junglans.io',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 'member-9',
      name: 'Sharmila S',
      role: 'AI Engineer',
      department: 'ai',
      badge: 'AI ENGINEER',
      avatar: 'SS',
      color: '#059669',
      bio: 'AI Engineer specialized in machine learning pipelines, deep learning model evaluation, natural language processing, and neural network optimization.',
      skills: ['Python', 'Deep Learning', 'PyTorch', 'NLP', 'Computer Vision', 'Model Evaluation'],
      email: 'sharmila@junglans.io',
      linkedin: 'https://linkedin.com'
    }
  ];

  const filteredMembers = teamMembers.filter((m) => {
    if (activeFilter === 'all') return true;
    return m.department === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#08090c] bg-precision-grid relative overflow-hidden">
      {/* Ambient Glow Orbs */}
      <div className="absolute top-20 left-1/3 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] bg-[#10B981]/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute top-[600px] right-1/4 w-[400px] sm:w-[550px] h-[400px] sm:h-[550px] bg-[#34D399]/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-16 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-12 pb-4 border-b border-[#A7F3D0]/60">
          <Link
            to="/"
            className="font-mono text-xs text-slate-600 hover:text-[#10B981] transition flex items-center gap-2 font-bold cursor-pointer w-fit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home & Products
          </Link>
          <span className="font-mono text-[9px] sm:text-xs text-[#059669] bg-[#ECFDF5] px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#A7F3D0] font-bold uppercase tracking-wider w-fit">
            JUNGLANS SOLUTIONS // OUR TEAM
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 sm:gap-2.5 font-mono text-[10px] sm:text-xs text-[#08090c] bg-white border border-[#A7F3D0] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 shadow-sm">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#10B981] animate-pulse-ring"></span>
            <span className="tracking-wider sm:tracking-widest uppercase font-bold text-[#059669]">PEOPLE & INNOVATION</span>
          </div>

          <h1 className="font-heading text-3xl min-[360px]:text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.08] sm:leading-[1.05] tracking-tight sm:tracking-tight text-[#08090c] mb-4 sm:mb-6">
            Meet the team behind <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] bg-clip-text text-transparent">
              Junglans Solutions.
            </span>
          </h1>

          <p className="font-body text-sm sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Our multi-disciplinary team of AI architects, system engineers, security researchers, and designers work together to build local-first enterprise software.
          </p>
        </div>

        {/* Founder & Lead Architect Feature Banner */}
        <div className="mb-14">
          <div className="font-mono text-xs text-[#059669] mb-4 font-bold uppercase tracking-widest text-center sm:text-left">
            EXECUTIVE LEADERSHIP // FOUNDER & LEAD ARCHITECT
          </div>
          <FounderSpotlight />
        </div>

        {/* Filter Pills Navigation */}
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-heading text-3xl font-bold text-[#08090c]">
            Core Team & Specialists
          </h2>

          <div className="flex flex-wrap items-center gap-2 max-w-full font-mono text-xs">
            {[
              { id: 'all', label: 'All Team Members' },
              { id: 'leadership', label: 'Leadership' },
              { id: 'ai', label: 'AI & Data Science' },
              { id: 'engineering', label: 'Engineering & Mobile' },
              { id: 'product', label: 'UI/UX & Product' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-medium border transition cursor-pointer whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-[#10B981] text-white border-transparent shadow-md font-bold scale-105'
                    : 'bg-white text-slate-600 hover:text-[#08090c] border-[#A7F3D0] hover:border-[#10B981]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="glow-card p-6 sm:p-7 rounded-3xl bg-white border border-[#A7F3D0] shadow-lg flex flex-col justify-between hover:border-[#10B981] transition-all duration-300 group"
            >
              <div>
                {/* Header Badge & Avatar */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl text-white font-heading font-bold text-xl flex items-center justify-center shadow-md transform group-hover:rotate-6 transition-transform"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.avatar}
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                    {member.badge}
                  </span>
                </div>

                {/* Name & Role */}
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#08090c] group-hover:text-[#10B981] transition-colors">
                  {member.name}
                </h3>
                <div className="font-mono text-xs text-[#059669] font-bold mt-1 mb-3">
                  {member.role}
                </div>

                {/* Bio */}
                <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {member.bio}
                </p>

                {/* Skills Tags */}
                <div className="space-y-2 mb-6">
                  <div className="font-mono text-[10px] text-slate-400 font-bold uppercase">KEY EXPERTISE:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-[#F4FBF7] text-slate-700 border border-[#A7F3D0]/70"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs font-bold text-[#059669]">
                <a
                  href={`mailto:${member.email}`}
                  className="hover:text-[#10B981] transition flex items-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Email
                </a>
                {member.ascendiaEduUrl ? (
                  <a
                    href={member.ascendiaEduUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#10B981] hover:underline flex items-center gap-1"
                  >
                    AscendiaEdu ↗
                  </a>
                ) : (
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-[#10B981] transition"
                  >
                    LinkedIn ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Culture & Hiring CTA Section */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 bg-white border border-[#A7F3D0] shadow-xl text-center relative overflow-hidden mb-12">
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="font-mono text-xs text-[#059669] font-bold uppercase tracking-widest bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0] inline-block mb-4">
              JOIN OUR ENGINEERING TEAM
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#08090c] tracking-tight mb-4">
              Want to build local-first software with us?
            </h2>
            <p className="font-body text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
              We are expanding our technical team in Systems Rust/C++, AI Research, Cryptography, and Product Design. Work remotely or on-site on high-impact local-first applications.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:careers@junglans.io"
                className="font-mono text-xs sm:text-sm bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                Send Your Resume / CV
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <Link
                to="/"
                className="font-mono text-xs sm:text-sm bg-white text-[#08090c] border border-[#A7F3D0] px-8 py-4 rounded-xl font-bold hover:bg-[#ECFDF5] transition"
              >
                Explore Product Portfolio
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
