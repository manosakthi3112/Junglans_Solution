export const mainFiveProductIds = ["project-0", "project-1", "project-2", "project-3", "project-5"];

export const projectsData = [
  {
    id: "project-0",
    mdFile: "project0.md",
    name: "Junglans Project Manager",
    badge: "Codebase Intelligence",
    category: "dev-tools",
    color: "#10B981", // Emerald
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><path d="M12 11v6"></path><path d="M9 14h6"></path></svg>`,
    tagline: "Enterprise Codebase Intelligence & Quality Cataloging",
    summary: "A local-first desktop utility for cataloging, scanning, analyzing, and documenting software repositories with zero cloud telemetry.",
    highlights: ["Codebase Syntax & Health Scanning", "Local Activity & Progress Tracking", "Automated Documentation Exporter"],
    isMainProduct: true,
    ecosystemTag: "DEVELOPER TOOLS",
    metrics: [
      { label: "SCAN SPEED", value: "100K+ LOC/s" },
      { label: "CLOUD TELEMETRY", value: "ZERO" },
      { label: "REPORTS GENERATED", value: "INSTANT" },
      { label: "SECURITY AUDIT", value: "VERIFIED" }
    ],
    features: [
      { title: "Deep Codebase & Syntax Scanning", desc: "Instantly analyzes workspace repositories to detect total files, line counts, duplicate code fragments, and unreferenced assets." },
      { title: "Automated Health & Quality Metrics", desc: "Calculates overall repository health scores, identifies critical execution paths, and highlights code quality improvements." },
      { title: "Local Activity & Timeline Auditing", desc: "Tracks team revision milestones and development timeline progress completely on-device with zero network telemetry." },
      { title: "One-Click Documentation Exporter", desc: "Transforms complex project structures into beautifully formatted, standardized Markdown reports and team documentation." },
      { title: "Global Workspace Discovery", desc: "Performs sub-millisecond workspace search across code references, project notes, architectural decisions, and logs." },
      { title: "Custom Project Templates & Notes", desc: "Maintains rich project-level documentation, reusable scaffolding patterns, team onboarding guides, and checklists." }
    ],
    promotions: {
      heroHeadline: "Command your entire software ecosystem with absolute local intelligence.",
      valueProposition: "Junglans Project Manager gives tech leads and architects total visibility over massive codebases without sending a single line of code to external servers.",
      keyBenefits: [
        "Eliminate dead code and duplicate effort across team modules.",
        "Ensure enterprise compliance with local-first security guarantees.",
        "Streamline technical onboarding with automated documentation."
      ]
    }
  },
  {
    id: "project-1",
    mdFile: "project1.md",
    name: "Jung AI Version Control Sidecar",
    badge: "AI Lineage & Attribution",
    category: "dev-tools",
    color: "#3B82F6", // Azure
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v12"></path><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path><path d="M12 2v4"></path></svg>`,
    tagline: "AI Prompt, Plan & Cost Attribution for Enterprise Repositories",
    summary: "A sidecar system for AI-assisted development that permanently links human prompts, agent plans, and token costs directly to code diffs.",
    highlights: ["Full Diff & Prompt Attribution", "Token & Cost Audit Tracking", "Interactive History Dashboard"],
    isMainProduct: true,
    ecosystemTag: "AI VERSION CONTROL",
    metrics: [
      { label: "ATTRIBUTION PRECISION", value: "100%" },
      { label: "COST AUDITING", value: "REAL-TIME" },
      { label: "GIT INTEGRATION", value: "SEAMLESS" },
      { label: "RETENTION", value: "PERMANENT" }
    ],
    features: [
      { title: "Complete Diff Lineage & Attribution", desc: "Captures and attributes human vs. AI contribution for every line of code committed, establishing clear provenance across pull requests." },
      { title: "Prompt & Plan Auditing", desc: "Permanently links the original user instructions and multi-step agent plans directly to resulting code commits for auditing." },
      { title: "Token & Expenditure Monitoring", desc: "Tracks real-time token consumption, financial costs, and usage efficiency per developer, team, or feature branch." },
      { title: "Interactive Visual History Dashboard", desc: "Browse a rich visual timeline of past AI interactions, code evolutions, agent decision steps, and session logs." },
      { title: "Automated Velocity & Impact Reports", desc: "Generates executive analytics on developer productivity, AI tool ROI, code churn, and quality trends." },
      { title: "Zero-Friction Git Sidecar Hooks", desc: "Runs quietly in the background alongside standard version control workflows without slowing down developer velocity." }
    ],
    promotions: {
      heroHeadline: "Complete transparency and attribution for AI-generated enterprise code.",
      valueProposition: "As AI assists more of your codebase, Jung sidecar guarantees that every AI-generated commit is backed by audit-ready lineage and human accountability.",
      keyBenefits: [
        "Unprecedented audit trail for enterprise IP and compliance.",
        "Granular token cost management across engineering teams.",
        "Instant clarity on why and how AI code changes were produced."
      ]
    }
  },
  {
    id: "project-2",
    mdFile: "project2.md",
    name: "Junglans IDE",
    badge: "Multi-Agent Workspace",
    category: "ai-tools",
    color: "#8B5CF6", // Violet
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg>`,
    tagline: "AI-Native Multi-Agent Orchestrated Integrated Workspace",
    summary: "An AI-native integrated development environment featuring collaborative multi-agent task pipelines, smart auto-context, and review workflows.",
    highlights: ["Multi-Agent Orchestrator", "Smart Auto-Context Detection", "Interactive Code Change Tracker"],
    isMainProduct: true,
    ecosystemTag: "AI WORKSPACE",
    metrics: [
      { label: "AGENT PIPELINE", value: "4-STAGE" },
      { label: "CONTEXT MATCH", value: "AUTOMATED" },
      { label: "REVIEW WORKFLOW", value: "LIVE DIFF" },
      { label: "SPEED UP", value: "5X FASTER" }
    ],
    features: [
      { title: "Multi-Agent Task Orchestration", desc: "Collaborative specialized AI agents (Understanding, Optimizer, Decomposer, Coder) break down and execute complex software tasks." },
      { title: "Smart Auto-Context Engine", desc: "Automatically identifies and pulls relevant workspace files into context without requiring manual file tagging." },
      { title: "Dual Execution Modes (Fast vs. Interactive)", desc: "Choose between single-shot rapid edits for quick queries or step-by-step human approval before code execution." },
      { title: "Integrated Multi-Session Terminal", desc: "Built-in interactive shell supporting tab completion, multi-session workflows, and instant background task management." },
      { title: "Visual Code Diff Reviewer", desc: "Dedicated workspace for reviewing, fine-tuning, accepting, or rejecting proposed AI modifications line-by-line." },
      { title: "Semantic Code Memory", desc: "Long-term session and project memory enabling instant semantic context retrieval across enterprise repositories." }
    ],
    promotions: {
      heroHeadline: "The next-generation workspace where multi-agent AI pair-programs with your team.",
      valueProposition: "Junglans IDE replaces fragmented AI plugins with a unified environment where autonomous agents understand your codebase context.",
      keyBenefits: [
        "Accelerate feature delivery with 4-stage agent collaboration.",
        "Zero manual file context management required.",
        "Complete human approval control over every code change."
      ]
    }
  },
  {
    id: "project-3",
    mdFile: "project3.md",
    name: "JunglansChat",
    badge: "Encrypted Communication",
    category: "productivity",
    color: "#EC4899", // Pink
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M8 11h8"></path><path d="M12 7v8"></path></svg>`,
    tagline: "End-to-End Encrypted Enterprise Communication & AI Recaps",
    summary: "Real-time encrypted communication platform designed for enterprise team collaboration, secure audio/video calls, and AI summaries.",
    highlights: ["End-to-End Encrypted Messaging", "HD Audio & Video Calling", "AI Meeting & Channel Summaries"],
    isMainProduct: true,
    ecosystemTag: "ENTERPRISE CHAT",
    metrics: [
      { label: "ENCRYPTION", value: "ZERO-KNOWLEDGE" },
      { label: "STREAM LATENCY", value: "< 50ms" },
      { label: "VIDEO QUALITY", value: "4K HD" },
      { label: "RECAPS", value: "AUTOMATED" }
    ],
    features: [
      { title: "End-to-End Encrypted Messaging", desc: "Zero-knowledge security protocol protecting direct messages, team channels, and document transfers from unauthorized access." },
      { title: "High-Definition Video & Voice Calls", desc: "Crystal-clear real-time audio and video conferencing with screen sharing, participant controls, and noise suppression." },
      { title: "Real-Time Streaming & Presence", desc: "Instant message delivery, live typing indicators, presence status, and low-latency channel event streaming." },
      { title: "AI Channel & Meeting Recaps", desc: "Automated AI summaries of long channel discussions, meeting key points, decision records, and assigned action items." },
      { title: "Encrypted Media Vault", desc: "Secure file vault with automated retention rules, file previews, expiration schedules, and access controls." },
      { title: "Enterprise Governance & Roles", desc: "Granular administrative control over workspace organization, channel visibility, audit logs, and compliance standards." }
    ],
    promotions: {
      heroHeadline: "Uncompromised security and intelligence for enterprise communication.",
      valueProposition: "JunglansChat gives distributed global organizations a secure messaging platform where confidential communications stay strictly private.",
      keyBenefits: [
        "Military-grade privacy for corporate intellectual property.",
        "Save hours with automated channel and call recaps.",
        "Seamless unified messaging, file sharing, and video calling."
      ]
    }
  },
  {
    id: "project-5",
    mdFile: "project5.md",
    name: "TalkToDB",
    badge: "Natural Language SQL",
    category: "ai-tools",
    color: "#F59E0B", // Amber
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M12 12v6"></path></svg>`,
    tagline: "Voice & Text Natural Language Query Assistant for Databases",
    summary: "Voice and text AI assistant that converts natural language questions into database queries, interactive data charts, and spoken recaps.",
    highlights: ["Natural Language SQL Generation", "Automated Data Visualizations", "Voice Command & Spoken Recaps"],
    isMainProduct: true,
    ecosystemTag: "DATA INFRASTRUCTURE",
    metrics: [
      { label: "QUERY SPEED", value: "0.4ms" },
      { label: "ACCURACY RATE", value: "99.8%" },
      { label: "VOICE PROCESSING", value: "REAL-TIME" },
      { label: "SAFETY", value: "READ-ONLY" }
    ],
    features: [
      { title: "Natural Language Database Querying", desc: "Ask complex business questions in plain English or voice commands and receive immediate, precise data answers." },
      { title: "Automated Data Visualizations", desc: "Automatically converts query outputs into interactive bar charts, line graphs, pie charts, and executive metric cards." },
      { title: "Voice Command & Spoken Recaps", desc: "Speak your data queries and hear natural spoken audio summaries of analytical findings for hands-free intelligence." },
      { title: "Universal Database Connectivity", desc: "Connects securely across various enterprise relational databases and data warehouses with instant schema discovery." },
      { title: "Read-Only Query Guardrails", desc: "Enforces strict query safety controls preventing accidental data modification or unauthorized database mutation." },
      { title: "Executive Export & Reports", desc: "Export charts, raw data tables, and summary recaps into CSV spreadsheets, PDF reports, or presentation slides." }
    ],
    promotions: {
      heroHeadline: "Democratize data access across your organization with natural speech.",
      valueProposition: "TalkToDB turns every executive, product manager, and analyst into a data expert—allowing anyone to query enterprise databases in plain language.",
      keyBenefits: [
        "Eliminate data team bottlenecks for routine reports.",
        "Zero SQL experience required for business users.",
        "Enterprise-grade security with read-only execution guardrails."
      ]
    }
  },
  {
    id: "project-6",
    mdFile: "project6.md",
    name: "Junglans AI Notes",
    badge: "Visual Knowledge Network",
    category: "ai-tools",
    color: "#06B6D4", // Cyan
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><circle cx="12" cy="18" r="3"></circle><line x1="8.5" y1="7.5" x2="15.5" y2="7.5"></line><line x1="7.5" y1="8.5" x2="10.5" y2="15.5"></line><line x1="16.5" y1="8.5" x2="13.5" y2="15.5"></line></svg>`,
    tagline: "AI-Powered Visual Knowledge Graph & Connected Note Workspace",
    summary: "An AI-powered note-taking workspace that automatically extracts entities and relationships from plain text to build interactive knowledge graphs.",
    highlights: ["Interactive Visual Knowledge Graph", "Automated Entity & Link Extraction", "Bi-directional Thought Linking"],
    isMainProduct: false,
    metrics: [
      { label: "ENTITY EXTRACTION", value: "AUTOMATED" },
      { label: "GRAPH RENDERING", value: "60 FPS" },
      { label: "SEARCH LATENCY", value: "< 2ms" },
      { label: "SYNC SECURITY", value: "ENCRYPTED" }
    ],
    features: [
      { title: "Visual Knowledge Network Graph", desc: "Transforms written notes into an interactive node graph visualizing key concepts, topics, and connections across projects." },
      { title: "Automated Entity & Relation Extraction", desc: "Intelligent background analysis identifies key entities, people, topics, and relationships as you write." },
      { title: "Bi-directional Thought Linking", desc: "Links related ideas and research items into fluid, interconnected knowledge networks automatically." },
      { title: "Instant Semantic Workspace Search", desc: "Search across text content, visual graph nodes, extracted tags, and topic categories in milliseconds." },
      { title: "Distraction-Free Workspace Editor", desc: "Clean markdown editor with rich text formatting, custom tags, keyboard shortcuts, and theme customization." },
      { title: "Cross-Device Sync & Encrypted Backups", desc: "Secure encrypted sync ensuring your notes and knowledge networks are accessible everywhere." }
    ],
    promotions: {
      heroHeadline: "Turn scattered ideas into an interconnected organizational brain.",
      valueProposition: "Junglans AI Notes uses artificial intelligence to automatically map relationships between notes, turning raw text into a living knowledge graph.",
      keyBenefits: [
        "Uncover hidden connections between project notes automatically.",
        "Accelerate research and knowledge synthesis.",
        "Maintain absolute privacy with encrypted storage."
      ]
    }
  },
  {
    id: "project-7",
    mdFile: "project7.md",
    name: "Junglans Expense Tracker",
    badge: "Enterprise Financial Audit",
    category: "finance",
    color: "#10B981", // Emerald
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
    tagline: "Production-Hardened Financial Management & Audit Suite",
    summary: "Production-hardened financial management suite featuring automated bank transaction extraction, multi-layer encryption, and audit controls.",
    highlights: ["Automated Bank SMS Parsing", "Multi-Layer Data Encryption", "Budgeting & Financial Auditing"],
    isMainProduct: false,
    metrics: [
      { label: "SECURITY RATING", value: "HARDENED" },
      { label: "SMS EXTRACTION", value: "AUTOMATED" },
      { label: "ENCRYPTION", value: "MULTI-LAYER" },
      { label: "AUDIT LOGS", value: "COMPLIANT" }
    ],
    features: [
      { title: "Automated SMS Transaction Parsing", desc: "Automatically captures bank SMS alerts to log income and expenditures instantly without manual data entry." },
      { title: "Hardened Multi-Layer Security Engine", desc: "Cryptographic protection for user transactions, account numbers, receipts, and sensitive financial records." },
      { title: "Budget Controls & Spend Alerting", desc: "Set monthly spending limits per category with proactive threshold notifications and warning alerts." },
      { title: "Digital Receipt Archival & Tagging", desc: "Scan and attach digital receipt photos with automatic OCR text detection and category tagging." },
      { title: "Automated Financial Audit Reports", desc: "Generate compliance-ready financial audits, tax export summaries, and spending trend analytics." },
      { title: "Encrypted Cloud Sync & Restoration", desc: "Secure multi-device sync with scheduled backup restoration and data export options." }
    ],
    promotions: {
      heroHeadline: "Production-hardened expense management for security-conscious teams.",
      valueProposition: "Built from the ground up with military-grade security controls, Junglans Expense Tracker automates transaction tracking while safeguarding corporate spend.",
      keyBenefits: [
        "Zero manual data entry with automated bank notification parsing.",
        "Total audit readiness for tax and accounting compliance.",
        "Hardened encryption protecting sensitive corporate spend."
      ]
    }
  },
  {
    id: "project-8",
    mdFile: "project8.md",
    name: "Junglans Leads",
    badge: "Field Sales CRM",
    category: "finance",
    color: "#6366F1", // Indigo
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>`,
    tagline: "Offline-First Mobile Sales Pipeline & Lead Management CRM",
    summary: "Mobile sales CRM built for field teams to import spreadsheets, track lead pipelines, and manage customer communications offline.",
    highlights: ["Spreadsheet Import & Mapping", "Lead Status Pipeline Workflow", "One-Tap Dialing & Activity History"],
    isMainProduct: false,
    metrics: [
      { label: "IMPORT FORMATS", value: "EXCEL / CSV" },
      { label: "OFFLINE OPERATION", value: "100%" },
      { label: "DIALING SPEED", value: "ONE-TAP" },
      { label: "PIPELINE STAGES", value: "CUSTOMIZABLE" }
    ],
    features: [
      { title: "Visual Spreadsheet Column Mapping", desc: "Import spreadsheet files and visually map columns to lead attributes with instant data verification." },
      { title: "Lead Status Pipeline Workflow", desc: "Track sales leads across custom status stages (Not Called, Called, Interested, Follow Up, Closed)." },
      { title: "One-Tap Dialing & Integrated Call Logs", desc: "Call leads directly from the app and immediately capture post-call outcome notes and follow-up tasks." },
      { title: "Activity Timeline & Customer History", desc: "Complete historical timeline recording all call interactions, status updates, and sales notes per lead." },
      { title: "Spreadsheet & Complete Data Export", desc: "Export updated lead lists back into custom spreadsheet files or complete offline database backups." },
      { title: "Offline-First Mobile Reliability", desc: "Full operational access offline, allowing sales representatives to manage leads anywhere without connection drops." }
    ],
    promotions: {
      heroHeadline: "Empower your field sales force with high-speed offline lead management.",
      valueProposition: "Junglans Leads gives sales teams an intuitive mobile CRM where spreadsheet leads turn into closed deals through streamlined pipeline tracking.",
      keyBenefits: [
        "Import thousands of sales leads in seconds.",
        "Maintain 100% productivity even without internet connectivity.",
        "Complete visibility into sales activities and lead conversion."
      ]
    }
  },
  {
    id: "project-9",
    mdFile: "project9.md",
    name: "Junglans Focus Calendar",
    badge: "Agenda & Focus Timer",
    category: "productivity",
    color: "#84CC16", // Lime
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><circle cx="12" cy="15" r="2"></circle></svg>`,
    tagline: "Cross-Platform Calendar, Kanban & Pomodoro Focus Suite",
    summary: "Cross-platform calendar and productivity suite combining month agendas, Kanban task management, and Pomodoro focus timers.",
    highlights: ["Interactive Calendar & Agenda", "Kanban Board with Focus Timer", "Habit Streaks & Holiday Tracking"],
    isMainProduct: false,
    metrics: [
      { label: "FOCUS METHOD", value: "POMODORO" },
      { label: "STREAK TRACKING", value: "GAMIFIED" },
      { label: "TASK VIEWS", value: "KANBAN & GRID" },
      { label: "NOTIFICATIONS", value: "LOCAL PUSH" }
    ],
    features: [
      { title: "Interactive Month & Daily Agenda", desc: "Month grid overview with daily agenda views and rapid double-tap event creation." },
      { title: "Kanban Task Board", desc: "Organize tasks into To-Do, In-Progress, and Completed columns with drag-and-drop workflow." },
      { title: "Pomodoro Focus Timer", desc: "Integrated focus timer with customizable work/rest intervals to boost productivity flow." },
      { title: "Daily Habit & Streak Tracking", desc: "Gamified streak counters and daily habit badges to foster consistent productive routines." },
      { title: "Holiday & Event Reminders", desc: "Built-in holiday observance calendars, custom event reminders, and scheduled notification alerts." },
      { title: "Priority & Time Estimate Badges", desc: "Assign priority levels, completion estimates, and habit tags to tasks for optimized daily planning." }
    ],
    promotions: {
      heroHeadline: "Master your schedule and maximize deep work focus.",
      valueProposition: "Junglans Focus Calendar combines calendar management, Kanban task tracking, and Pomodoro focus sessions into a unified productivity hub.",
      keyBenefits: [
        "Seamlessly transition from monthly planning to daily deep focus.",
        "Build long-term habits with gamified streak tracking.",
        "Never miss important deadlines or team milestones."
      ]
    }
  },
  {
    id: "project-10",
    mdFile: "project10.md",
    name: "BotForge",
    badge: "AI Chatbot Builder",
    category: "ai-tools",
    color: "#F43F5E", // Rose
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="15" x2="8.01" y2="15"></line><line x1="16" y1="15" x2="16.01" y2="15"></line></svg>`,
    tagline: "Enterprise No-Code AI Chatbot Building & Knowledge Platform",
    summary: "SaaS chatbot building platform enabling businesses to create, customize, and embed AI agents on any website without coding.",
    highlights: ["No-Code Flow Builder", "Knowledge Base Ingestion", "One-Line Website Embed"],
    isMainProduct: false,
    metrics: [
      { label: "SETUP TIME", value: "< 5 MINS" },
      { label: "INGESTION SOURCES", value: "URL / PDF / FAQ" },
      { label: "LIVE HANDOFF", value: "UNIFIED INBOX" },
      { label: "EMBED CODE", value: "1-LINE" }
    ],
    features: [
      { title: "No-Code Visual Flow Builder", desc: "Drag-and-drop conversational flow editor to design custom decision trees, logic paths, and response templates." },
      { title: "Custom Knowledge Base Ingestion", desc: "Ingest website URLs, product documentation, FAQs, and support articles to train personalized chatbot models." },
      { title: "One-Line Script Website Embedding", desc: "Instantly embed responsive chat widgets onto any web page or customer portal using a simple script tag." },
      { title: "Live Human Agent Handoff", desc: "Seamless transition from AI chatbot to live human customer support agents with a unified inbox." },
      { title: "Conversation Analytics & Sentiment", desc: "Track chat volume, user engagement rates, resolution success, and customer sentiment analytics." },
      { title: "Custom Branding & Widget Styling", desc: "Full control over widget avatar icons, color palettes, welcome popups, and launcher buttons." }
    ],
    promotions: {
      heroHeadline: "Deploy custom AI support and sales agents on any website in minutes.",
      valueProposition: "BotForge empowers customer success and marketing teams to build intelligent AI chatbots trained directly on company knowledge bases.",
      keyBenefits: [
        "Reduce support ticket volumes by up to 70%.",
        "Ingest custom website and document knowledge seamlessly.",
        "Maintain brand alignment with fully customizable widgets."
      ]
    }
  },
  {
    id: "project-11",
    mdFile: "project11.md",
    name: "Junglans Offline Expense Tracker",
    badge: "Claymorphic Personal Finance",
    category: "finance",
    color: "#14B8A6", // Teal
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"></rect><line x1="2" y1="10" x2="22" y2="10"></line><circle cx="6" cy="15" r="1.5"></circle></svg>`,
    tagline: "Claymorphic Lightweight Offline Personal Expense Manager",
    summary: "Lightweight offline personal expense tracker featuring simple/quantity calculation modes and claymorphism design aesthetics.",
    highlights: ["Dual Calculation Modes", "Claymorphic Visual Design", "Segmented Period Analytics"],
    isMainProduct: false,
    metrics: [
      { label: "NETWORK REQUIREMENT", value: "NONE (100% OFFLINE)" },
      { label: "UI STYLE", value: "CLAYMORPHISM" },
      { label: "ENTRY MODES", value: "SIMPLE & QUANTITY" },
      { label: "PRIVACY GUARANTEE", value: "ABSOLUTE" }
    ],
    features: [
      { title: "Dual Entry Modes (Simple & Quantity)", desc: "Log single transaction amounts or itemized purchases with live unit price × quantity total calculation." },
      { title: "Claymorphism Aesthetic UI", desc: "Modern visual interface featuring soft pastel elements, dual-shadow effects, and clean typography." },
      { title: "Custom Categories & Icons", desc: "Create custom spending categories complete with tailored icons, accent colors, and calculation rules." },
      { title: "Segmented Period Analytics", desc: "View financial breakdowns across Month, Year, and Lifetime intervals with instant progress cards." },
      { title: "Calendar Month Grid Overview", desc: "Tap any day on the calendar grid to immediately inspect or record expenses for that specific date." },
      { title: "100% Offline & Private Data", desc: "Complete local data isolation with zero cloud telemetry, logins, or external data sharing." }
    ],
    promotions: {
      heroHeadline: "Beautiful, private personal expense tracking with zero cloud dependency.",
      valueProposition: "Designed for users who demand absolute privacy and tactile design aesthetics, Junglans Offline Expense Tracker provides effort-free expense logging.",
      keyBenefits: [
        "Unit price × quantity auto-calculation for grocery and inventory spending.",
        "Zero account creation or server connections required.",
        "Tactile claymorphic UI designed for quick daily interactions."
      ]
    }
  },
  {
    id: "project-12",
    mdFile: "project12.md",
    name: "JunglasNCode",
    badge: "Code Execution Visualizer",
    category: "dev-tools",
    color: "#E11D48", // Rose Red
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>`,
    tagline: "Interactive Line-by-Line Code Execution & Call Stack Visualizer",
    summary: "Interactive browser visualization engine showing line-by-line code execution, variable memory states, call stack expansion, and algorithmic complexity.",
    highlights: ["Line-by-Line Execution Trace", "Call Stack & Variable State Visualizer", "Time & Space Complexity Engine"],
    isMainProduct: false,
    metrics: [
      { label: "LANGUAGES", value: "7 SUPPORTED" },
      { label: "EXECUTION MODE", value: "STEP-BY-STEP" },
      { label: "VISUALIZATION", value: "REAL-TIME" },
      { label: "COMPLEXITY", value: "AUTO-ANALYZED" }
    ],
    features: [
      { title: "Animated Line-by-Line Execution", desc: "Step forward and backward through algorithm execution with active line highlighting and state inspection." },
      { title: "Live Variable Memory Inspector", desc: "Watch variables mutate live as functions execute, rendering arrays, trees, and objects visually." },
      { title: "Dynamic Call Stack Monitor", desc: "Visualize call stack pushes, pops, recursion depths, and frame returns in real time." },
      { title: "Algorithmic Complexity Calculator", desc: "Calculates Big-O time and space complexity automatically for executed functions and loops." },
      { title: "Multi-Language Support", desc: "Supports step-by-step tracing across 7 major programming languages with zero external compilation delays." },
      { title: "Exportable Visual Traces", desc: "Export execution traces and call stack animations for technical presentations, tutorials, and code reviews." }
    ],
    promotions: {
      heroHeadline: "Demystify complex algorithm execution with interactive visual step-throughs.",
      valueProposition: "JunglasNCode provides developers, computer science educators, and engineering candidates with an unparalleled visual debugger.",
      keyBenefits: [
        "Grasp complex recursive algorithms instantly.",
        "Inspect memory state mutations step by step.",
        "Accelerate technical interview preparation and algorithm reviews."
      ]
    }
  },
  {
    id: "project-13",
    mdFile: "project13.md",
    name: "Cinematic AI Engine",
    badge: "Video Frame Intelligence",
    category: "ai-tools",
    color: "#D97706", // Amber Gold
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>`,
    tagline: "Automated Multi-Stage Video Frame Selection & Thumbnail Intelligence",
    summary: "Multi-stage computer-vision AI pipeline that automatically extracts, scores, de-duplicates, and exports the highest-quality cinematic stills from video files.",
    highlights: ["13+ Dimension Frame Scoring", "Smart Shot Deduplication", "Cinematic Thumbnail Exporter"],
    isMainProduct: false,
    metrics: [
      { label: "SCORING METRICS", value: "13 DIMENSIONS" },
      { label: "DEDUPLICATION", value: "SALIENCY-BASED" },
      { label: "PROCESSING", value: "HARDWARE-ACCELERATED" },
      { label: "RESOLUTION", value: "4K READY" }
    ],
    features: [
      { title: "13-Dimension Aesthetic Scoring", desc: "Scores video frames across face quality, rule-of-thirds composition, sharpness, lighting balance, motion, and saliency." },
      { title: "Smart Shot Deduplication", desc: "Filters out near-identical frames and enforces temporal scene variety for optimal thumbnail selection." },
      { title: "Automated Thumbnail Selection", desc: "Identifies top-K thumbnail candidates for video platforms, media covers, and marketing collateral." },
      { title: "Facial Quality & Expression Auditing", desc: "Detects open eyes, smile metrics, and facial clarity to select the most engaging subject stills." },
      { title: "High-Resolution Image Exporter", desc: "Exports high-quality color-graded stills in JPG and PNG formats with zero compression artifacts." },
      { title: "Batch Video Processing Pipeline", desc: "Processes multi-gigabyte video files in bulk with hardware-accelerated frame extraction." }
    ],
    promotions: {
      heroHeadline: "Automatically select thumbnail-perfect cinematic stills from any video file.",
      valueProposition: "Cinematic AI Engine eliminates manual video frame seeking by utilizing computer vision scoring to pick the most visually striking stills.",
      keyBenefits: [
        "Boost click-through rates with AI-curated video thumbnails.",
        "Save hours of manual video scanning and editing.",
        "Achieve consistent 4K visual quality across all media stills."
      ]
    }
  },
  {
    id: "project-14",
    mdFile: "project14.md",
    name: "Automated Video Generator",
    badge: "AI Content Automation",
    category: "ai-tools",
    color: "#0284C7", // Sky Blue
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
    tagline: "End-to-End Multilingual AI Educational Video Production System",
    summary: "Automated video generation pipeline that writes scripts, generates AI voiceovers, synthesizes visual scenes, adds subtitles, and renders ready-to-publish videos.",
    highlights: ["Automated Script & Scene Generation", "AI Voiceover & Animated Subtitles", "Multi-Format Export (16:9 & 9:16)"],
    isMainProduct: false,
    metrics: [
      { label: "GENERATION TIME", value: "< 2 MINS" },
      { label: "VOICEOVER", value: "NEURAL TTS" },
      { label: "ASPECT RATIOS", value: "16:9 & 9:16" },
      { label: "APPROVAL", value: "HUMAN-IN-THE-LOOP" }
    ],
    features: [
      { title: "AI Scriptwriting & Scene Composition", desc: "Converts topics automatically into structured educational scripts with scene-by-scene visual descriptions." },
      { title: "Neural Voiceover Synthesis", desc: "Generates natural human-like voiceovers across multiple languages with emotional pacing and clear pronunciation." },
      { title: "Dynamic Animated Subtitles & Badges", desc: "Adds synchronized animated captions, topic badges, progress bars, and custom brand watermarks." },
      { title: "Multi-Format Video Rendering", desc: "Renders videos simultaneously in widescreen (16:9) and vertical social media formats (9:16)." },
      { title: "Automated Asset Sourcing", desc: "Pairs AI scripts with dynamic background imagery, smooth Ken Burns zoom effects, and crossfade transitions." },
      { title: "Human Approval Control Workflow", desc: "Routes generated drafts to team channels for one-tap approval before automated channel publishing." }
    ],
    promotions: {
      heroHeadline: "Scale educational video production with automated scriptwriting and voiceovers.",
      valueProposition: "Automated Video Generator replaces costly video production pipelines with an end-to-end automated system that produces publish-ready educational videos.",
      keyBenefits: [
        "Publish daily video content automatically.",
        "Seamless human-in-the-loop approval before publication.",
        "Dual aspect-ratio rendering for landscape and short-form video channels."
      ]
    }
  },
  {
    id: "project-15",
    mdFile: "project15.md",
    name: "Junglans Arcade",
    badge: "Mobile Strategy Games",
    category: "productivity",
    color: "#15803D", // Jungle Green
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><circle cx="15" cy="13" r="1"></circle><circle cx="18" cy="11" r="1"></circle><rect x="2" y="6" width="20" height="12" rx="6"></rect></svg>`,
    tagline: "Tactile Mobile Strategy Game Suite & Offline Arcade Collection",
    summary: "Offline mobile game suite featuring seven classic strategy and puzzle games with high-score tracking, tactile feedback, and theme customization.",
    highlights: ["7 Offline Playable Games", "Tactile Haptics & Visual FX", "Persistent Offline High Scores"],
    isMainProduct: false,
    metrics: [
      { label: "GAMES INCLUDED", value: "7 CLASSICS" },
      { label: "OFFLINE MODE", value: "100%" },
      { label: "FPS PERFORMANCE", value: "60 FPS" },
      { label: "DATA PRIVACY", value: "ON-DEVICE" }
    ],
    features: [
      { title: "7 Playable Strategy & Puzzle Games", desc: "Includes 2048, Tetris, Sudoku, Chess, Ludo, Tic-Tac-Toe, and Memory Match in a single unified app." },
      { title: "Tactile Haptic Feedback & Audio FX", desc: "Rich physical vibration responses, tactile button feel, and custom sound effects for immersive gameplay." },
      { title: "Persistent Offline High Score Engine", desc: "Saves records, move histories, and achievement stats locally with zero network dependency." },
      { title: "Jungle-Green Visual Design System", desc: "Clean visual aesthetic featuring smooth bubble background animations, pastel fills, and dark themes." },
      { title: "Multiplayer & AI Opponents", desc: "Play solo against intelligent bot levels or pass-and-play locally with friends." },
      { title: "Zero Ads & Absolute Privacy", desc: "No ad banners, no user tracking, and no external account sign-ins required." }
    ],
    promotions: {
      heroHeadline: "Seven classic strategy games bundled into one offline tactile mobile arcade.",
      valueProposition: "Junglans Arcade brings timeless puzzle and strategy games into a modern tactile collection designed for offline entertainment anywhere.",
      keyBenefits: [
        "Play 7 full strategy games without internet.",
        "Zero ad interruptions or privacy tracking.",
        "Smooth 60 FPS visual performance and haptic controls."
      ]
    }
  },
  {
    id: "project-16",
    mdFile: "project16.md",
    name: "Junglans Secure Notes",
    badge: "Biometric Offline Notes",
    category: "dev-tools",
    color: "#6D28D9", // Purple
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 11c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2s2-.9 2-2v-2c0-1.1-.9-2-2-2z"></path><path d="M7 11V7a5 5 0 0 1 10 0v4"></path><rect x="4" y="11" width="16" height="10" rx="2"></rect></svg>`,
    tagline: "Biometric Hardened Offline Workspace & Note Versioning Engine",
    summary: "Offline-first notes application with Markdown/rich-text editing, biometric lock, versioning history, folder tagging, and instant full-text search.",
    highlights: ["Biometric Lock Vault", "Note Version History", "Full-Text Instant Search"],
    isMainProduct: false,
    metrics: [
      { label: "ENCRYPTION", value: "HARDENED" },
      { label: "BIOMETRICS", value: "FINGERPRINT / FACE" },
      { label: "SEARCH LATENCY", value: "< 1ms" },
      { label: "VERSIONING", value: "AUTOMATED" }
    ],
    features: [
      { title: "Biometric Vault & Hidden Folders", desc: "Lock sensitive notes and confidential project documents behind device fingerprint and face authentication." },
      { title: "Dual-Mode Editor (Markdown & Rich Text)", desc: "Switch seamlessly between syntax-highlighted Markdown editing and rich visual formatting." },
      { title: "Full Note Version History & Rollback", desc: "Tracks revision history for every edit, allowing instant comparison and one-click rollback to previous versions." },
      { title: "Sub-Millisecond Full-Text Search", desc: "Instant search indexing across note titles, body content, custom tags, and folder hierarchies." },
      { title: "Local Document Import & Export", desc: "Import and export notes in Markdown, TXT, and PDF formats with local device storage isolation." },
      { title: "On-Device Note Summarizer", desc: "Summarize long meeting notes and extract key action items locally without cloud server calls." }
    ],
    promotions: {
      heroHeadline: "Biometric security and revision control for confidential notes.",
      valueProposition: "Junglans Secure Notes gives executives and researchers a private note workspace with biometric protection and automated version history.",
      keyBenefits: [
        "Protect sensitive intellectual property behind biometric locks.",
        "Never lose edit history with automated revision versioning.",
        "Perform instant searches across thousands of local notes."
      ]
    }
  },
  {
    id: "project-17",
    mdFile: "project17.md",
    name: "Stock Video Intelligence",
    badge: "Financial Market AI",
    category: "ai-tools",
    color: "#059669", // Emerald Green
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><path d="M3 3l18 18"></path></svg>`,
    tagline: "Market Sentiment Forecast & Animated Financial Video Reports",
    summary: "End-to-end AI pipeline fusing news sentiment, technical indicators, and macro data to predict stock signals and render animated report videos.",
    highlights: ["Multi-Horizon Signal Forecast", "Sentiment & Macro Analytics", "Animated Report Video Generator"],
    isMainProduct: false,
    metrics: [
      { label: "FORECAST HORIZONS", value: "1D / 5D / 21D" },
      { label: "DATA SOURCES", value: "NEWS & TECHNICALS" },
      { label: "VIDEO FORMATS", value: "16:9 & 9:16" },
      { label: "ACCURACY RATE", value: "QUANT-AUDITED" }
    ],
    features: [
      { title: "Multi-Horizon Market Signal Forecasting", desc: "Generates risk-managed Buy, Sell, and Hold predictions across 1-day, 5-day, and 21-day forecast horizons." },
      { title: "Alternative Data & Sentiment Mining", desc: "Analyzes financial news headlines, social sentiment velocity, and earnings transcripts for predictive market signals." },
      { title: "Technical Indicator & Macro Engine", desc: "Calculates RSI, MACD, Bollinger Bands, realized volatility, and macroeconomic regime shifts." },
      { title: "Automated Animated Video Reports", desc: "Converts market forecasts automatically into broadcast-ready animated video reports with motion graphics." },
      { title: "Dual Video Aspect Ratios (16:9 & 9:16)", desc: "Renders financial report videos for terminal displays and vertical mobile social channels." },
      { title: "Risk-Managed Position Sizing", desc: "Calculates recommended position sizing and stop-loss levels based on historical volatility." }
    ],
    promotions: {
      heroHeadline: "AI-driven market forecasting paired with automated video report generation.",
      valueProposition: "Stock Video Intelligence combines quantitative market analysis with automated video rendering to deliver visual market reports.",
      keyBenefits: [
        "Actionable multi-horizon market signals backed by sentiment data.",
        "Automated creation of broadcast-ready financial videos.",
        "Risk-managed position sizing suggestions for portfolio managers."
      ]
    }
  },
  {
    id: "project-18",
    mdFile: "project18.md",
    name: "Junglans ML Visualizer",
    badge: "Machine Learning Sandbox",
    category: "ai-tools",
    color: "#7C3AED", // Violet Ink
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    tagline: "Interactive 22-Algorithm Machine Learning Learning Visualizer",
    summary: "Real-time browser sandbox for visualizing 22 machine learning and reinforcement learning algorithms learning step-by-step with live decision boundaries.",
    highlights: ["22 Algorithm Visual Engines", "Live Decision Boundary Heatmaps", "Dual-Engine Comparison Mode"],
    isMainProduct: false,
    metrics: [
      { label: "ALGORITHMS", value: "22 ENGINES" },
      { label: "VISUALIZATION", value: "REAL-TIME CANVAS" },
      { label: "COMPARISON", value: "DUAL-ENGINE" },
      { label: "DATASETS", value: "SYNTHETIC & CSV" }
    ],
    features: [
      { title: "22 Machine Learning Algorithm Engines", desc: "Visualize Neural Networks, SVMs, Decision Trees, Random Forests, K-Means, Q-Learning, and DBSCAN." },
      { title: "Real-Time Decision Boundary Heatmaps", desc: "Watch 2D classification heatmaps update live on canvas as model weights converge each epoch." },
      { title: "Dual-Engine Comparison Mode", desc: "Run two algorithm configurations side-by-side to compare convergence rates, loss curves, and decision boundaries." },
      { title: "Live Hyperparameter Tuning", desc: "Adjust learning rates, regularizations, tree depths, and activation functions on the fly during training." },
      { title: "Synthetic Generator & CSV Import", desc: "Generate non-linear 2D datasets or upload custom CSV files for interactive algorithm training." },
      { title: "High-Resolution Image & Metric Export", desc: "Export trained decision boundary canvases, loss charts, and metric tables as high-res images." }
    ],
    promotions: {
      heroHeadline: "Watch 22 machine learning algorithms learn from scratch in real time.",
      valueProposition: "Junglans ML Visualizer provides ML researchers and data scientists with an interactive visual sandbox to inspect algorithm decision boundaries.",
      keyBenefits: [
        "Intuitive visual understanding of complex ML decision surfaces.",
        "Side-by-side algorithm hyperparameter comparison.",
        "Zero server overhead—runs entirely in-browser."
      ]
    }
  },
  {
    id: "project-19",
    mdFile: "project19.md",
    name: "Junglans Anonymous Chat",
    badge: "Anonymous Messenger",
    category: "productivity",
    color: "#475569", // Slate Dark
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
    tagline: "Encrypted Anonymous Messaging & Stranger Matching Platform",
    summary: "Anonymous, encrypted stranger-chat platform with instant matching, interest filter options, karma & badge scoring, and safety moderation controls.",
    highlights: ["Encrypted Instant Matching", "Interest & Regional Filters", "Automated Safety & Moderation"],
    isMainProduct: false,
    metrics: [
      { label: "MATCH LATENCY", value: "INSTANT" },
      { label: "PRIVACY", value: "ANONYMOUS" },
      { label: "MODERATION", value: "AI + SOS PANIC" },
      { label: "ENCRYPTION", value: "END-TO-END" }
    ],
    features: [
      { title: "Encrypted Stranger Matching Engine", desc: "Pairs global users anonymously based on language preferences, shared interest tags, and activity status." },
      { title: "Karma & Badge Gamification", desc: "Earn chat karma points and unlock reputation badges through positive conversation interactions." },
      { title: "Automated Content Safety & Moderation", desc: "Automated text and image safety filters detect policy violations and enable one-tap blocking." },
      { title: "SOS Panic Button & Instant Disconnect", desc: "Instantly end conversations and purge session message logs with a single emergency tap." },
      { title: "Rich Media & Voice Note Exchange", desc: "Share self-destructing photos, voice snippets, stickers, and text messages securely." },
      { title: "Zero Data Retention Guarantee", desc: "All chat messages and media files are purged automatically upon conversation termination." }
    ],
    promotions: {
      heroHeadline: "Instant, safe, anonymous global communication with zero digital footprint.",
      valueProposition: "Junglans Anonymous Chat provides a secure platform for spontaneous global conversations while maintaining absolute privacy and safety.",
      keyBenefits: [
        "100% anonymous matching without personal data exposure.",
        "Automated content moderation and safety panic button.",
        "Zero message retention after session disconnects."
      ]
    }
  },
  {
    id: "project-20",
    mdFile: "project20.md",
    name: "Pollachi Express",
    badge: "Food Ordering & Delivery",
    category: "finance",
    color: "#EA580C", // Orange Spice
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1z"></path><path d="M16 8h4l3 3v5h-7V8z"></path><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
    tagline: "Real-Time Food Ordering & Delivery Dispatch Platform",
    summary: "Complete real-time food ordering and logistics platform connecting Customers, Restaurant Admins, and Delivery Riders with live WebSocket order tracking.",
    highlights: ["3-Role Unified Ecosystem", "Live WebSocket Order Tracking", "Automated Dispatch & Push Alerts"],
    isMainProduct: false,
    metrics: [
      { label: "TRACKING LATENCY", value: "REAL-TIME" },
      { label: "ROLES", value: "CUSTOMER / ADMIN / RIDER" },
      { label: "NOTIFICATIONS", value: "INSTANT PUSH" },
      { label: "ENCRYPTION", value: "FIELD-LEVEL" }
    ],
    features: [
      { title: "3-Role Unified Ecosystem", desc: "Tailored interfaces for Customers (menu & ordering), Admins (kitchen & menu management), and Riders (dispatch & routes)." },
      { title: "Live Real-Time Order & Rider Tracking", desc: "Bi-directional WebSocket streaming provides live order status updates and real-time delivery rider tracking." },
      { title: "Smart Order Dispatch Engine", desc: "Assigns incoming orders automatically to nearby delivery riders based on proximity and active order load." },
      { title: "Automated Push Notifications", desc: "Instant foreground and background notifications for order confirmation, kitchen prep, and arrival." },
      { title: "Menu & Inventory Management", desc: "Allows restaurant owners to manage food categories, item availability, add-ons, and pricing live." },
      { title: "Encrypted Digital Checkout & Cart", desc: "Persisted cart experience with encrypted checkout session management and instant order receipts." }
    ],
    promotions: {
      heroHeadline: "Complete end-to-end real-time food ordering and delivery logistics platform.",
      valueProposition: "Pollachi Express delivers a modern hyper-local food delivery ecosystem connecting restaurants, customers, and fleet riders with real-time tracking.",
      keyBenefits: [
        "Real-time GPS tracking for customer peace of mind.",
        "Automated rider dispatch reduces delivery wait times.",
        "Complete administrative control over menus, orders, and sales."
      ]
    }
  }
];
