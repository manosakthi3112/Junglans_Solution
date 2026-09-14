export const packagesData = [
  {
    id: "trail",
    slug: "trail",
    npmPackageName: "@junglans/trail",
    name: "@junglans/trail",
    shortName: "Trail Unified",
    registry: "npm",
    registryUrl: "https://www.npmjs.com/package/@junglans/trail",
    repoUrl: "https://github.com/junglans/trail",
    version: "0.6.0",
    badge: "Unified Full-Stack Bundle",
    ecosystem: "javascript",
    category: "Analytics & Telemetry",
    runtime: "Node.js & Browser",
    installCommands: {
      npm: "npm install @junglans/trail",
      pnpm: "pnpm add @junglans/trail",
      yarn: "yarn add @junglans/trail",
      bun: "bun add @junglans/trail"
    },
    tagline: "Unified Local-First Analytics, On-Page Heatmaps & Diagnostic Telemetry for React and Node.js",
    summary: "A unified enterprise-grade bundle combining both the React client SDK (@junglans/trail-react) and Node.js backend middleware (@junglans/trail-server). Store all customer and user telemetry inside your own SQLite database under /api/jungtrail with zero monthly SaaS fees, zero cloud leakage, and complete privacy compliance.",
    highlights: [
      "Unified Full-Stack Distribution",
      "104 Built-In Capabilities Out of the Box",
      "Local SQLite WAL Architecture (/api/jungtrail)",
      "Zero Cloud Tracker Dependence"
    ],
    stats: [
      { label: "CAPABILITIES", value: "104" },
      { label: "MONTHLY SAAS COST", value: "$0" },
      { label: "STORAGE ENGINE", value: "SQLite WAL" },
      { label: "CLOUD LEAKAGE", value: "0.00%" }
    ],
    cliCommands: [
      { name: "jungtrail", desc: "Interactive CLI utility for administering the local analytics SQLite store, viewing sessions, running health checks, and exporting datasets." },
      { name: "junglans-trail", desc: "Binary alias for running database migrations, inspecting telemetry traffic, and generating summary reports." }
    ],
    quickstarts: [
      {
        title: "Express.js Backend",
        language: "javascript",
        filename: "server.js",
        code: `import express from 'express';
import { jungtrailMiddleware } from '@junglans/trail/server';

const app = express();
app.use(express.json());

// Mount all 104 analytics, heatmap, e-commerce, and auth endpoints
app.use('/api/jungtrail', jungtrailMiddleware({
  dbName: 'analytics.db',
  dbPath: './data/analytics.db',
  adminKey: process.env.ADMIN_KEY || 'demo-admin-key',
}));

app.listen(3000, () => {
  console.log('Trail server running at http://localhost:3000/api/jungtrail');
});`
      },
      {
        title: "Next.js App Router Backend",
        language: "typescript",
        filename: "app/api/jungtrail/[...jungtrail]/route.ts",
        code: `import { createJungtrailRoute } from '@junglans/trail/server';

const handler = createJungtrailRoute({
  dbName: 'analytics.db',
  dbPath: './data/analytics.db',
  adminKey: process.env.ADMIN_KEY || 'demo-admin-key',
});

export { handler as GET, handler as POST, handler as DELETE };`
      },
      {
        title: "React Frontend Integration",
        language: "tsx",
        filename: "App.tsx",
        code: `import React from 'react';
import { TrailProvider, TrailWidget, useAnalytics } from '@junglans/trail/react';

export default function App() {
  return (
    <TrailProvider endpoint="/api/jungtrail">
      <MainApplication />
      {/* Floating admin analytics drawer + live on-page radial heatmap */}
      <TrailWidget adminKey="demo-admin-key" />
    </TrailProvider>
  );
}

function MainApplication() {
  const { trackPurchase, trackExperiment, trackNps } = useAnalytics();

  return (
    <button
      onClick={() => {
        trackPurchase('ord_1001', 49.99, [
          { id: 'pro', name: 'Pro Plan', price: 49.99, quantity: 1 }
        ]);
        trackNps(10, 'Outstanding performance with local-first privacy!');
      }}
    >
      Buy Now
    </button>
  );
}`
      }
    ],
    capabilitiesCategories: [
      {
        title: "Core Tracking",
        count: 27,
        items: ["Page views", "Click tracking", "Rage clicks", "Dead clicks", "Scroll funnels (25/50/75/100%)", "Time spent on page", "Exit intent", "Asset downloads", "Clipboard copies", "Web Vitals (LCP/CLS/FID/INP)", "UTM parameters", "Device / OS / Browser breakdown", "Referrer analytics", "Viewport dimensions", "Focus & Blur detection"]
      },
      {
        title: "Auth & Identity",
        count: 18,
        items: ["Login success/failure rates", "Registration funnels", "Password reset flows", "MFA verification audits", "OAuth distribution", "Role & privilege tracking", "User pseudonym stitching", "Session takeover detection", "Brute-force velocity alerts"]
      },
      {
        title: "Session Lifecycle",
        count: 17,
        items: ["Active concurrent sessions", "Session duration", "Bounce detection", "Idle vs active time ratio", "Multi-tab broadcast sync", "Engagement tiers (Low/Med/High/Power)", "GDPR automated erasure", "Inactivity timeouts"]
      },
      {
        title: "Heatmap & Spatial",
        count: 7,
        items: ["Live canvas radial heatmap", "Element click leaderboard", "Target CSS selector tagging", "Device viewport filtering", "Dynamic container scroll recalculation", "Scroll depth gradients", "Heat intensity thresholds"]
      },
      {
        title: "Diagnostics & Performance",
        count: 8,
        items: ["Unhandled JS error logging", "Console capture", "Network status & offline detection", "Client diagnostics payload", "Slow API call alerts", "Memory threshold flags", "DOM element leak detection", "Rehydration mismatch logs"]
      },
      {
        title: "Database & Admin",
        count: 7,
        items: ["SQLite WAL high-throughput engine", "JSON / CSV bulk exports", "Automatic DB backups", "Admin key token authentication", "Pruning retention policies", "VACUUM optimization routines", "Schema auto-migration"]
      },
      {
        title: "E-Commerce & Revenue",
        count: 8,
        items: ["Product impressions", "Add to cart", "Remove from cart", "Checkout funnel progression", "Purchases & revenue tracking", "Cart abandonment alerts", "Discount coupon analytics", "Refund logging"]
      },
      {
        title: "A/B Testing & Feature Flags",
        count: 4,
        items: ["Experiment variant exposures", "Variant conversion tracking", "Feature flag evaluation logs", "Statistical confidence calculators"]
      },
      {
        title: "Feedback, NPS & CSAT",
        count: 4,
        items: ["NPS scoring (Promoters / Passives / Detractors)", "CSAT satisfaction surveys", "In-app feedback notes", "Sentiment tagging"]
      },
      {
        title: "Resilience & Latency",
        count: 4,
        items: ["Client API latency benchmarking", "Health check probes", "IndexedDB offline queue persistence", "Buffer overflow backpressure protection"]
      }
    ],
    faq: [
      {
        q: "What is @junglans/trail and how does it differ from separate packages?",
        a: "@junglans/trail is the umbrella bundle containing both @junglans/trail-react and @junglans/trail-server. Installing @junglans/trail gives you direct subpath exports (@junglans/trail/react and @junglans/trail/server) along with the bundled CLI utilities (jungtrail and junglans-trail)."
      },
      {
        q: "Does this require a paid cloud subscription or third-party telemetry server?",
        a: "No. All telemetry events are received by your own server middleware and stored in your local SQLite database using write-ahead logging (WAL). No data ever leaves your own infrastructure."
      },
      {
        q: "Can I use @junglans/trail in a monorepo or Next.js application?",
        a: "Yes. In Next.js, use createJungtrailRoute in your App Router API route (app/api/jungtrail/[...jungtrail]/route.ts) and wrap your client layout in TrailProvider from @junglans/trail/react."
      }
    ]
  },
  {
    id: "trail-server",
    slug: "trail-server",
    npmPackageName: "@junglans/trail-server",
    name: "@junglans/trail-server",
    shortName: "Trail Server",
    registry: "npm",
    registryUrl: "https://www.npmjs.com/package/@junglans/trail-server",
    repoUrl: "https://github.com/junglans/trail",
    version: "0.6.0",
    badge: "Node.js & Express Middleware",
    ecosystem: "javascript",
    category: "Backend Middleware",
    runtime: "Node.js 18+",
    installCommands: {
      npm: "npm install @junglans/trail-server",
      pnpm: "pnpm add @junglans/trail-server",
      yarn: "yarn add @junglans/trail-server",
      bun: "bun add @junglans/trail-server"
    },
    tagline: "Embedded Analytics & On-Page Heatmap Backend Middleware for Express and Next.js",
    summary: "An ultra-fast, zero-cloud-telemetry backend middleware that stores all incoming application events in your own local SQLite database under /api/jungtrail. Powered by better-sqlite3 with Write-Ahead Logging (WAL) for sub-millisecond event ingestion.",
    highlights: [
      "Native SQLite WAL Engine via better-sqlite3",
      "Drop-In Support for Express & Next.js App Router",
      "Role-Based Admin Key Authentication",
      "Automatic Schema Generation & Migrations"
    ],
    stats: [
      { label: "INGESTION LATENCY", value: "<0.8ms" },
      { label: "PEER DEPENDENCIES", value: "Express >=4.0" },
      { label: "DATA PERSISTENCE", value: "Local SQLite" },
      { label: "EXTERNAL TRAFFIC", value: "Zero Bytes" }
    ],
    quickstarts: [
      {
        title: "Express.js Implementation",
        language: "javascript",
        filename: "server.js",
        code: `import express from 'express';
import { jungtrailMiddleware } from '@junglans/trail-server';

const app = express();
app.use(express.json());

// Mount the analytics API onto Express
app.use('/api/jungtrail', jungtrailMiddleware({
  dbName: 'analytics.db',
  dbPath: './data/analytics.db',
  adminKey: process.env.JUNGLANS_ADMIN_KEY || 'production-secret-key',
  cors: true,
  retentionDays: 90
}));

app.listen(8000, () => {
  console.log('Junglans Trail server active on port 8000');
});`
      },
      {
        title: "Next.js App Router Route Handler",
        language: "typescript",
        filename: "app/api/jungtrail/[...jungtrail]/route.ts",
        code: `import { createJungtrailRoute } from '@junglans/trail-server';

const handler = createJungtrailRoute({
  dbName: 'analytics.db',
  dbPath: './data/analytics.db',
  adminKey: process.env.ADMIN_KEY,
  maxBatchSize: 100,
});

export { handler as GET, handler as POST, handler as DELETE };`
      }
    ],
    apiReference: [
      {
        method: "POST",
        endpoint: "/api/jungtrail/events",
        auth: "Public / Write Key",
        desc: "Ingests client and backend batches of user interactions, clicks, rage clicks, Web Vitals, and errors."
      },
      {
        method: "GET",
        endpoint: "/api/jungtrail/heatmap",
        auth: "Admin Key Required",
        desc: "Returns coordinates, element selectors, and click density clusters formatted for live canvas heatmap rendering."
      },
      {
        method: "GET",
        endpoint: "/api/jungtrail/stats",
        auth: "Admin Key Required",
        desc: "Retrieves aggregate KPIs: unique sessions, total page views, bounce rate, average time-on-page, top referral paths."
      },
      {
        method: "GET",
        endpoint: "/api/jungtrail/stats/ecommerce",
        auth: "Admin Key Required",
        desc: "Calculates e-commerce conversion rates, cart abandonment funnel metrics, total revenue, and average order value."
      },
      {
        method: "GET",
        endpoint: "/api/jungtrail/export",
        auth: "Admin Key Required",
        desc: "Streams a full JSON or CSV export of all indexed telemetry records for offline reporting and data warehousing."
      }
    ],
    options: [
      { name: "dbName", type: "string", default: "'analytics.db'", desc: "Filename of the SQLite database created in the target directory." },
      { name: "dbPath", type: "string", default: "'./data/analytics.db'", desc: "Relative or absolute filesystem path where database and WAL journal files are maintained." },
      { name: "adminKey", type: "string", default: "undefined", desc: "Secret passphrase required to access /stats, /heatmap, and /export endpoints." },
      { name: "cors", type: "boolean", default: "true", desc: "Enables Cross-Origin Resource Sharing headers for multi-domain frontend clients." },
      { name: "retentionDays", type: "number", default: "90", desc: "Automatic rolling retention period after which old event rows are vacuumed." }
    ],
    faq: [
      {
        q: "What database does @junglans/trail-server use?",
        a: "It uses SQLite via better-sqlite3 with Write-Ahead Logging (WAL) enabled, providing concurrent read/write access and high throughput without requiring a separate database server process."
      },
      {
        q: "How do I secure the admin dashboard and statistics?",
        a: "Pass an adminKey option to the middleware. Requests to admin routes like /stats, /heatmap, and /export must supply this key either via the x-admin-key header or as a query parameter."
      }
    ]
  },
  {
    id: "trail-react",
    slug: "trail-react",
    npmPackageName: "@junglans/trail-react",
    name: "@junglans/trail-react",
    shortName: "Trail React",
    registry: "npm",
    registryUrl: "https://www.npmjs.com/package/@junglans/trail-react",
    repoUrl: "https://github.com/junglans/trail",
    version: "0.6.0",
    badge: "React 18 & 19 SDK",
    ecosystem: "javascript",
    category: "Frontend UI & Trackers",
    runtime: "Browser (React 18+)",
    installCommands: {
      npm: "npm install @junglans/trail-react",
      pnpm: "pnpm add @junglans/trail-react",
      yarn: "yarn add @junglans/trail-react",
      bun: "bun add @junglans/trail-react"
    },
    tagline: "React Components, Automated Trackers, On-Page Visual Heatmaps & Analytics Widget",
    summary: "A lightweight, battle-tested React library providing automated DOM interaction trackers, rage-click and dead-click detection, Core Web Vitals monitoring, and a floating admin drawer with a live radial heatmap overlay.",
    highlights: [
      "Zero-Config Automated DOM Event Capturing",
      "Live In-Browser Radial Heatmap Canvas Overlay",
      "Floating Admin Analytics Drawer Component",
      "Type-Safe useAnalytics Hook for Custom Tracking"
    ],
    stats: [
      { label: "BUNDLE OVERHEAD", value: "<12KB gzip" },
      { label: "HEATMAP OVERLAY", value: "Real-time" },
      { label: "REACT COMPATIBILITY", value: "18.x & 19.x" },
      { label: "OFFLINE RESILIENCE", value: "IndexedDB" }
    ],
    quickstarts: [
      {
        title: "Root Provider & Admin Heatmap Widget",
        language: "tsx",
        filename: "App.tsx",
        code: `import React from 'react';
import { TrailProvider, TrailWidget } from '@junglans/trail-react';

export default function App() {
  return (
    <TrailProvider
      endpoint="/api/jungtrail"
      autoTrackPageViews={true}
      autoTrackClicks={true}
      autoTrackErrors={true}
      autoTrackVitals={true}
    >
      <RouterView />
      {/* Floating admin badge that expands into live heatmap and analytics */}
      <TrailWidget adminKey="demo-admin-key" position="bottom-right" />
    </TrailProvider>
  );
}`
      },
      {
        title: "Programmatic Tracking with useAnalytics Hook",
        language: "tsx",
        filename: "CartCheckout.tsx",
        code: `import React from 'react';
import { useAnalytics } from '@junglans/trail-react';

export function CartCheckout({ cart, total }) {
  const { trackPurchase, trackClick, trackNps, trackCustom } = useAnalytics();

  const handleCompleteOrder = async () => {
    trackClick('complete_checkout_button', { itemsCount: cart.length });

    // Send order to backend API
    const order = await api.submitOrder(cart);

    // Track e-commerce conversion locally
    trackPurchase(order.id, total, cart);

    // Prompt for Net Promoter Score
    trackNps(10, 'Seamless checkout flow');
  };

  return (
    <button onClick={handleCompleteOrder} className="checkout-btn">
      Confirm & Pay ₹{total}
    </button>
  );
}`
      }
    ],
    componentsList: [
      {
        name: "<TrailProvider>",
        desc: "Context provider wrapping your React application. Manages batch event aggregation, session cookies, offline queue fallback, and telemetry network transport."
      },
      {
        name: "<TrailWidget>",
        desc: "Floating developer/admin widget. Displays a toggleable on-page radial canvas heatmap, real-time visitor count, session timeline, and instant diagnostics drawer."
      },
      {
        name: "useAnalytics()",
        desc: "Hook exposing programmatic telemetry methods: trackEvent, trackPurchase, trackCartAdd, trackExperiment, trackNps, trackCsat, trackError, and flush."
      }
    ],
    faq: [
      {
        q: "Does @junglans/trail-react slow down page performance?",
        a: "No. Events are debounced, batched in memory, and sent using navigator.sendBeacon when available or asynchronously via non-blocking fetch. In-browser heatmap calculations run on an isolated HTML5 canvas."
      },
      {
        q: "Does it work with Server-Side Rendering (Next.js, Remix)?",
        a: "Yes. Wrap your client components or app root. In Next.js App Router, mark the provider container file with 'use client'."
      }
    ]
  },
  {
    id: "jung",
    slug: "jung",
    pypiPackageName: "jung",
    name: "jung",
    shortName: "jung AI Sidecar",
    registry: "pypi",
    registryUrl: "https://pypi.org/project/jung/",
    repoUrl: "https://github.com/jung/jung",
    version: "0.1.2",
    badge: "Python 3.11+ / Git Sidecar",
    ecosystem: "python",
    category: "AI Version Control",
    runtime: "Python 3.11+ & Git",
    installCommands: {
      pip: "pip install jung",
      uv: "uv add jung",
      poetry: "poetry add jung"
    },
    tagline: "A Version Control Sidecar for AI-Assisted Development with Prompt, Plan, Cost & Diff Attribution",
    summary: "Git tracks WHAT changed. jung tracks WHY and WHO (human or AI agent). A local-first development sidecar that captures conversation logs, multi-step plans, tool executions, token expenditures, and human-vs-agent code attribution behind every code change — permanently linked to git diffs.",
    highlights: [
      "Permanent AI Prompt-to-Diff Provenance",
      "Human vs. Agent Line Attribution (jung blame)",
      "Real-Time Token Usage & Financial Cost Auditing",
      "Rich CLI with 24+ Commands & Interactive Web Dashboard"
    ],
    stats: [
      { label: "ATTRIBUTION ACCURACY", value: "100%" },
      { label: "STORAGE ARCHITECTURE", value: "SQLite + SHA-256 Blobs" },
      { label: "GIT HOOK SPEED", value: "<15ms" },
      { label: "CLI COMMANDS", value: "24+" }
    ],
    cliCommandsList: [
      { command: "jung init", desc: "Initializes a .jung/ store with SQLite index and content-addressed blob store in the repository. Automatically installs a Git post-commit hook." },
      { command: "jung watch", desc: "Starts the background daemon to discover IDE sessions (Antigravity, Cursor, Claude Code) and correlate file modifications to conversation turns." },
      { command: "jung status", desc: "Checks daemon health, active branch, last AI-attributed commit, uncommitted changes, and store statistics." },
      { command: "jung log", desc: "Lists captured sessions, conversation turns, actor attribution, models used, and estimated USD costs." },
      { command: "jung show <turn-id>", desc: "Displays full turn context: prompt/response content, multi-step agent plans, tool calls, and syntax-highlighted diffs." },
      { command: "jung diff [turn-id]", desc: "Compares file changes produced in specific conversation turns or across entire AI sessions." },
      { command: "jung blame <file>", desc: "Like git blame, but shows whether each line was authored by a human or AI agent, plus turn ID and date." },
      { command: "jung cost", desc: "Summarizes token expenditures and financial costs grouped by session, calendar day, or AI model (Gemini, Claude, GPT)." },
      { command: "jung search <query>", desc: "High-speed full-text search across turns, agent reasoning, and markdown artifacts using SQLite FTS5." },
      { command: "jung dashboard --open", desc: "Spawns a local-first interactive web dashboard to browse conversation threads, diff lineages, and cost charts." },
      { command: "jung commit -m 'msg'", desc: "Creates an explicit checkpoint snapshot of AI changes and conversation context." },
      { command: "jung branch <name>", desc: "Branches development context for isolated AI experimentation without disturbing the main timeline." }
    ],
    quickstarts: [
      {
        title: "Quickstart Workflow",
        language: "bash",
        filename: "terminal",
        code: `# 1. Install the CLI sidecar
pip install jung

# 2. Initialize in your repository
cd my-project
jung init

# 3. Start the background watcher
jung watch

# 4. Check status and browse captured AI context
jung status
jung log
jung cost
jung blame src/main.py

# 5. Launch the local web dashboard
jung dashboard --open`
      }
    ],
    faq: [
      {
        q: "Does jung replace Git?",
        a: "No. jung works alongside git. It reads git state (HEAD commit, diffs) and attaches conversation turns and token attribution to commits, but never alters git history or pushes to remote repositories automatically."
      },
      {
        q: "How does jung blame determine who wrote a line?",
        a: "jung monitors the filesystem during active IDE assistant sessions and correlates file modification timestamps with assistant tool calls and responses, accurately classifying human edits versus agent generations."
      },
      {
        q: "What IDEs and AI assistants are supported?",
        a: "Out of the box, jung includes native log adapters for Gemini Antigravity, Cursor, Claude Code, and configurable custom JSONL transcript streams."
      }
    ]
  },
  {
    id: "junglans-trail",
    slug: "junglans-trail",
    pypiPackageName: "junglans-trail",
    name: "junglans-trail",
    shortName: "Trail Python",
    registry: "pypi",
    registryUrl: "https://pypi.org/project/junglans-trail/",
    repoUrl: "https://github.com/junglans/trail",
    version: "0.1.0",
    badge: "Python / FastAPI Middleware",
    ecosystem: "python",
    category: "Backend Middleware",
    runtime: "Python 3.8+ (FastAPI & Starlette)",
    installCommands: {
      pip: "pip install junglans-trail",
      uv: "uv add junglans-trail",
      poetry: "poetry add junglans-trail"
    },
    tagline: "Embedded Local-First Analytics & On-Page Heatmap Middleware for Python (FastAPI & Starlette)",
    summary: "Zero standalone servers. Store all telemetry, on-page heatmap coordinates, e-commerce transactions, and diagnostic events directly in your Python application's local SQLite database under /api/jungtrail with 104 capabilities built-in.",
    highlights: [
      "Drop-in 3-Line FastAPI / Starlette Middleware",
      "Python TrailClient for Backend Telemetry Tracking",
      "Native SQLite WAL Storage under /api/jungtrail",
      "104 Capabilities: Auth, Heatmaps, E-Commerce, Errors"
    ],
    stats: [
      { label: "CAPABILITIES", value: "104" },
      { label: "FRAMEWORK", value: "FastAPI / Starlette" },
      { label: "DATABASE", value: "SQLite WAL" },
      { label: "SETUP TIME", value: "<30s" }
    ],
    quickstarts: [
      {
        title: "FastAPI Middleware Setup",
        language: "python",
        filename: "main.py",
        code: `from fastapi import FastAPI
from junglans_trail import jungtrail_fastapi_middleware

app = FastAPI(title="My Enterprise Service")

# Mount all 104 analytics, heatmap, and telemetry endpoints under /api/jungtrail
storage = jungtrail_fastapi_middleware(
    app,
    db_name="analytics.db",       # Custom SQLite WAL database
    db_path="data/analytics.db",  # Storage path
    admin_key="your-admin-secret" # Protects stats, export, and heatmap endpoints
)

@app.get("/")
def home():
    return {"message": "Hello from Junglans Trail"}
`
      },
      {
        title: "Python Backend Event Tracking",
        language: "python",
        filename: "services/orders.py",
        code: `from junglans_trail import TrailClient

client = TrailClient(
    endpoint="http://localhost:8000/api/jungtrail",
    write_key="optional-write-key"
)

# Track an e-commerce purchase from Python
client.track(
    event_type="purchase",
    route="/checkout/success",
    meta={"order_id": "ord_9901", "revenue": 149.00, "items_count": 2}
)

# Track authentication & security events
client.track(
    event_type="login_success",
    route="/api/v1/auth/login",
    meta={"provider": "github", "user_id": "usr_abc"}
)

client.flush()`
      }
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/jungtrail/events", desc: "Ingest batch telemetry events from client or server." },
      { method: "GET", path: "/api/jungtrail/heatmap", desc: "Retrieve spatial coordinates for live visual DOM heatmaps." },
      { method: "GET", path: "/api/jungtrail/stats", desc: "Aggregate core metrics: clicks, page views, scroll depth, error rates." },
      { method: "GET", path: "/api/jungtrail/stats/ecommerce", desc: "Revenue metrics, conversion rates, cart abandonment data." },
      { method: "GET", path: "/api/jungtrail/export", desc: "Export captured telemetry in JSON or CSV format." }
    ],
    faq: [
      {
        q: "Does junglans-trail support async FastAPI routes?",
        a: "Yes. Ingestion and dispatch are fully non-blocking and optimized for high-concurrency ASGI servers like Uvicorn and Hypercorn."
      },
      {
        q: "Can I use junglans-trail alongside @junglans/trail-react on the frontend?",
        a: "Yes, they are 100% interoperable! Mount junglans-trail onto your FastAPI backend and point <TrailProvider endpoint='/api/jungtrail'> from @junglans/trail-react to your FastAPI API."
      }
    ]
  }
];

export const allCapabilitiesList = [
  {
    category: "Core Tracking",
    count: 27,
    icon: "Activity",
    description: "Fundamental user navigation, interaction behavior, and device environment analytics.",
    items: [
      { name: "Page Views", desc: "Real-time page views and route transitions with automatic SPA detection." },
      { name: "Click Tracking", desc: "Automated event capture on buttons, links, and actionable DOM targets." },
      { name: "Rage Clicks", desc: "Flags rapid repetitive clicking (≥3 clicks within 500ms) on unresponsive elements." },
      { name: "Dead Clicks", desc: "Detects clicks on interactive-looking elements that trigger no DOM mutations or navigation." },
      { name: "Scroll Depth Funnel", desc: "Milestone beacons triggered at 25%, 50%, 75%, and 100% vertical viewport scroll." },
      { name: "Time Spent on Page", desc: "Active visible engagement time excluding background tab states." },
      { name: "Exit Intent", desc: "Mouse velocity vector tracking toward browser top bar or tab closure." },
      { name: "File Downloads", desc: "Automatic tracking of PDFs, ZIPs, APKs, and documents without manual code hooks." },
      { name: "Clipboard Copy", desc: "Captures text copying actions on documentation code snippets and key quotes." },
      { name: "Largest Contentful Paint (LCP)", desc: "Core Web Vital timing metric for primary visual rendering speed." },
      { name: "Cumulative Layout Shift (CLS)", desc: "Calculates visual layout stability score across user lifecycle." },
      { name: "Interaction to Next Paint (INP)", desc: "Measures overall responsiveness to user clicks, taps, and key presses." },
      { name: "UTM Campaign Parsing", desc: "Extracts utm_source, utm_medium, utm_campaign, and referral parameters." },
      { name: "Device & Viewport Detection", desc: "Classifies Desktop, Mobile, Tablet with exact screen width/height." },
      { name: "Browser & OS Fingerprint", desc: "Privacy-preserving user agent parsing for Chrome, Safari, Firefox, Edge, etc." }
    ]
  },
  {
    category: "Auth & Identity",
    count: 18,
    icon: "ShieldCheck",
    description: "Auditing user authentication lifecycles, role permissions, and access patterns.",
    items: [
      { name: "Login Success & Failure Rates", desc: "Tracks authentication attempts and highlights credential stuffing patterns." },
      { name: "Registration Funnel", desc: "Step-by-step completion rate from sign-up form visit to email confirmation." },
      { name: "Password Reset Audits", desc: "Logs recovery token requests and password update completions." },
      { name: "MFA / 2FA Verification", desc: "Tracks TOTP and SMS token verification time and drop-off rates." },
      { name: "OAuth Provider Distribution", desc: "Breakdown of Google, GitHub, Microsoft, and SAML identity log-ins." },
      { name: "User Pseudonym Stitching", desc: "Attaches anonymous pre-login browsing history to authenticated user profiles." },
      { name: "Role & Permission Logs", desc: "Audits administrative role changes, team privilege updates, and invite states." }
    ]
  },
  {
    category: "Session Lifecycle",
    count: 17,
    icon: "Clock",
    description: "Multi-tab synchronization, idle detection, engagement segmentation, and GDPR compliance.",
    items: [
      { name: "Active Session Concurrency", desc: "Maintains real-time heartbeat of online users across browser tabs." },
      { name: "Session Duration", desc: "Calculates total span from initial landing to final interaction." },
      { name: "Bounce Rate Calculation", desc: "Identifies single-interaction visits under 10 seconds duration." },
      { name: "Idle vs Active Time Ratio", desc: "Disaggregates periods of inactivity from true user focus." },
      { name: "Multi-Tab BroadcastChannel Sync", desc: "Synchronizes session ID and cart changes across tabs in real-time." },
      { name: "Engagement Tiers", desc: "Classifies visitors into Low, Medium, High, or Power user segments." },
      { name: "GDPR One-Click Erasure", desc: "Endpoint allowing complete purge of a user's telemetry records upon request." }
    ]
  },
  {
    category: "Heatmap & Spatial",
    count: 7,
    icon: "Flame",
    description: "Visual on-page radial heatmaps, element click density maps, and spatial interaction overlays.",
    items: [
      { name: "Live Canvas Heatmap Overlay", desc: "Renders smooth radial gradients directly over the active website DOM." },
      { name: "Element Click Leaderboard", desc: "Ranked list of top-clicked CSS selectors and button components." },
      { name: "Target Tagging & Filters", desc: "Filter click heatmaps by route, date range, or device viewport." },
      { name: "Scroll Depth Gradient", desc: "Visual color overlay illustrating the percentage of users reaching each fold." },
      { name: "Dynamic Responsive Scaling", desc: "Recalculates click coordinates accurately when elements reflow on resize." }
    ]
  },
  {
    category: "Diagnostics & Performance",
    count: 8,
    icon: "Bug",
    description: "Client-side error monitoring, network drops, and performance bottleneck diagnostics.",
    items: [
      { name: "Unhandled JS Error Logging", desc: "Captures window.onerror and unhandled promise rejections with stack traces." },
      { name: "Console Error Interception", desc: "Logs console.error events with sanitized context arguments." },
      { name: "Network Offline Detection", desc: "Monitors online/offline transitions and queues telemetry for later dispatch." },
      { name: "Slow API Request Flags", desc: "Identifies backend calls exceeding configurable latency thresholds (e.g. >1000ms)." },
      { name: "Client Memory Diagnostics", desc: "Tracks JS heap memory limits on supported browsers to spot memory leaks." }
    ]
  },
  {
    category: "Database & Admin",
    count: 7,
    icon: "Database",
    description: "SQLite WAL persistence, backup automation, zero-config migrations, and data export.",
    items: [
      { name: "SQLite Write-Ahead Logging", desc: "High-concurrency database engine supporting thousands of events/second." },
      { name: "JSON & CSV Bulk Export", desc: "Download full historical event logs for offline analysis or spreadsheet import." },
      { name: "Automatic Database Backups", desc: "Creates timestamped snapshot copies without stopping the ingestion pipeline." },
      { name: "Admin Key Token Guard", desc: "Ensures administrative endpoints are accessible only by authorized team leads." },
      { name: "Automatic Rolling Prune", desc: "Automatically trims aged events beyond the configured retention window." }
    ]
  },
  {
    category: "E-Commerce & Revenue",
    count: 8,
    icon: "ShoppingCart",
    description: "Cart funnels, conversion tracking, checkout stages, revenue metrics, and coupon analytics.",
    items: [
      { name: "Product Impression Tracking", desc: "Records whenever product cards or catalog listings enter the viewport." },
      { name: "Add / Remove from Cart", desc: "Tracks item quantities, variations, and catalog drop-offs." },
      { name: "Multi-Step Checkout Funnel", desc: "Monitors shipping address, payment method, and confirmation steps." },
      { name: "Purchase & Revenue Attribution", desc: "Calculates total order value, average cart size, and product margin trends." },
      { name: "Cart Abandonment Detection", desc: "Identifies sessions where items were added to cart but checkout was incomplete." },
      { name: "Coupon & Discount Auditing", desc: "Logs promotional voucher redemption rates and discount margin impact." }
    ]
  },
  {
    category: "A/B Testing & Feature Flags",
    count: 4,
    icon: "FlaskConical",
    description: "Experiment exposure tracking, variant conversion, and statistical confidence scoring.",
    items: [
      { name: "Variant Exposure Logging", desc: "Records which experiment variant (Control vs Test A/B) each user viewed." },
      { name: "Variant Conversion Funnel", desc: "Compares conversion rates between variations across multiple milestones." },
      { name: "Feature Flag Evaluation", desc: "Tracks client-side feature toggle checks and roll-out percentages." }
    ]
  },
  {
    category: "Feedback, NPS & CSAT",
    count: 4,
    icon: "HeartHandshake",
    description: "In-app customer sentiment surveys, Net Promoter Scores, and qualitative notes.",
    items: [
      { name: "NPS Survey Engine", desc: "Scores users from 0-10 and categorizes Promoters, Passives, and Detractors." },
      { name: "CSAT Satisfaction Ratings", desc: "Captures 1-to-5 star ratings on key task completion moments." },
      { name: "Customer Feedback Notes", desc: "Accepts free-form feedback commentary attached to session timelines." }
    ]
  },
  {
    category: "Resilience & Latency",
    count: 4,
    icon: "Zap",
    description: "IndexedDB buffer queues, backpressure handling, and latency benchmarking.",
    items: [
      { name: "Offline IndexedDB Persistence", desc: "Stores pending events in browser IndexedDB if internet connectivity is lost." },
      { name: "Buffer Overflow Backpressure", desc: "Safeguards against memory exhaustion under burst traffic by dropping low-priority pings." },
      { name: "Client API Latency Benchmarking", desc: "Measures round-trip time between client and ingestion endpoint." }
    ]
  }
];
