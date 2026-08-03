# 🧠 Junglans — ML Visualizer

> A real-time, browser-only sandbox for watching 22 machine-learning and reinforcement-learning algorithms **learn from scratch**. Tune hyperparameters live, step through training epoch-by-epoch, run two configurations eye-to-eye, and export the result as a PNG.

This README is a **technical deep dive** into the actual implementation — not a vision document. Everything described below is what the code in this repo actually does.

---

## Table of Contents

1. [The Project in One Paragraph](#the-project-in-one-paragraph)
2. [Tech Stack (as shipped)](#tech-stack-as-shipped)
3. [Getting Started](#getting-started)
4. [System Architecture & Data Flow](#system-architecture--data-flow)
5. [Routing Structure](#routing-structure)
6. [State Layer — Zustand Stores](#state-layer--zustand-stores)
7. [The Algorithm Registry — Everything is Schema-Driven](#the-algorithm-registry--everything-is-schema-driven)
8. [The Engine Layer — A Shared Contract](#the-engine-layer--a-shared-contract)
9. [The Training Orchestrator — One Page, 22 Engines](#the-training-orchestrator)
10. [Training Playback Controls](#training-playback-controls)
11. [The Visualization Canvas — Rendering Deep Dive](#the-visualization-canvas--rendering-deep-dive)
12. [The Metrics Panel — Charts & "Fitting Status" Heuristics](#the-metrics-panel--charts--fitting-status-heuristics)
13. [Data Layer — Synthetic Generators & CSV Upload](#data-layer--synthetic-generators--csv-upload)
14. [Export System](#export--png)
15. [Comparison Mode (Dual-Engine)](#comparison-mode-dual-engine)
16. [Theming](#theming)
17. [API Surface](#api-surface)
18. [Directory Map (src/)](#directory-map-src)
19. [Performance Notes](#performance-notes)
20. [As-Built vs. The Design Doc](#as-built-vs-the-design-doc)
21. [Author & Credits](#author--roadmap)

---

## The Project in One Paragraph

Every algorithm is a **pure-JavaScript engine class** with a uniform, step-based interface (`initialize → step() → getState()`). A single server component (`src/app/visualize/[algorithm]/page.tsx`) drives whichever engine is mounted for the current URL slug using a `requestAnimationFrame` loop whose cadence is controlled by a *speed* slider. Each engine step returns a plain-JSON `state` that is pushed through a global **Zustand store** and re-rendered on a full-frame **Canvas 2D** plot — no SVG, no D3, no GPU, no TensorFlow.js at runtime. Compute is 100% in-browser, and hyperparameters, datasets, boundaries, and metrics are all defined by declarative schemas so that adding an algorithm is "write one engine file, add one registry entry, add one icon."

---

## Tech Stack (as shipped)

| Concern | Technology | Where it's used |
|---|---|---|
| Framework | **Next.js 16.2.6 (App Router, Turbopack)** | All routes, metadata, client components |
| Language | **TypeScript 5** | 100% of logic |
| UI | **React 19 + inline styles / global CSS custom props** | No component library — custom CSS classes in `globals.css` |
| Styling | **Tailwind v4 (PostCSS)** | Build pipeline; app UI is hand-rolled CSS variables |
| State | **Zustand 5** | Training + dataset stores |
| Rendering | **Raw Canvas 2D API** (`getContext('2d')`) | `VisualizationCanvas`, `MetricsPanel` charts |
| ML Engines | **Hand-written JS/TS** (no runtime ML libs) | All `src/engines/*.ts` |
| Lint | **ESLint 9** (`eslint-config-next`) | `npm run lint` |

> Most of the runtime dependencies in `package.json` (`@tensorflow/tfjs`, `d3`, `chart.js`, `react-chartjs-2`, `mathjs`) are **declared but not imported anywhere in `src/`**. All ML + charting is implemented from scratch. TF.js et al. are dead weight for the current build.

---

## Getting Started

```bash
npm install          # install dependencies
npm run dev          # start dev server → http://localhost:3000
npm run build        # production build
npm run start        # serve production build
npm run lint         # ESLint over the project
```

Deployment target: **Vercel** (`.vercel/project.json` exists). A `src/app/api/health` route is used by the landing page heartbeat to keep serverless functions warm during dev/preview.

---

## System Architecture & Data Flow

```
  / (gallery)                        /visualize/[algorithm]
  ┌──────────────┐                    ┌───────────────────────────────────────────────┐
  │ page.tsx     │  Link              │ page.tsx  (client)                             │
  │ Algorithm    │ ───────►           │  ├─ registry.getAlgorithmBySlug(slug)         │
  │ cards + tabs │                    │  ├─ ZUSTAND: setAlgorithm, setParams,          │
  └──────────────┘                    │  │            setDataset                        │
  │                                   │  ├─ createEngine() → new <Engine>()            │
  │   └ about/page.tsx                │  └─ TRAINING LOOP (requestAnimationFrame)      │
  │                                   │        └─ engine.initialize(params, dataset)   │
  │                                   │        └─ engine.step() → state snapshot       │
  │                                   │        └─ store.addMetrics + setVizState       │
                                      └──────────────────┬─────────────────────────────┘
                     ┌───────────────────────────────────▼────────────────────┐
                     │                       ZUSTAND                          │
                     │   useTrainingStore  ·  useDatasetStore                │
                     └───────────┬──────────────────────────────────┬────────┘
                     ┌───────────▼──────────┐        ┌──────────────▼─────────────┐
                     │ VisualizationCanvas   │        │ MetricsPanel               │
                     │  reads vizState +     │        │  reads metrics[] length     │
                     │  draws to <canvas>    │        │  draws loss/acc via Canvas  │
                     └──────────────────────┘        └────────────────────────────┘
```

The one non-obvious thing: **the page component is the orchestrator, the store is the render bus, and the engine is a pure state machine.** Components never talk to engines; they only read the store. Locating its flow in a single component makes the loop logic explicit:

1. **Mount** — `useEffect([slug])` → `setAlgorithm(slug)`, `setParams(getDefaultParams(slug))`, `setDataset(algorithm.defaultDataset)`, `setInitialized(true)`.
2. **Engine init** — `initEngine()` creates a fresh engine, calls `.initialize(params, activeDataset)`, pushes an *initial* (step 0) `metrics[0]` entry, computes `totalSteps` via `calcSteps()`.
3. **Play/Step** — `status === 'running'` triggers a `rAF` loop that calls `.step()`, then writes `{step, loss, accuracy, inertia, explainedVariance}` into the metrics array and the full state into `vizState`. `status === 'done'` ends the loop (you must Reset to run again).
4. **Observation** — React re-renders the canvas + metrics on every store writer.

---

## Routing Structure

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Landing + algorithm gallery, category filter tabs, feature cards, health-ping heartbeat |
| `/visualize/[algorithm]` | `src/app/visualize/[algorithm]/page.tsx` | The entire workspace (left: controls, center: canvas, right: metrics) |
| `/visualize/[algorithm]` | `src/app/visualize/[algorithm]/layout.tsx` | Viewport sizing wrapper |
| `/about` | `src/app/about/page.tsx` | Platform info + author contact |
| `/api/health` | `src/app/api/health/route.ts` | Returns `{status, timestamp, uptime}` |
| root | `src/app/layout.tsx` | `<html data-theme>`, fonts, `<Navbar>` |

There is no server-side ML; routes are Next.js App Router client components (`'use client'`) rendering the store-driven workspace.

---

## State Layer — Zustand Stores

### `src/store/useTrainingStore.ts`

The single global training state machine. Interfaces:

- `TrainingStatus = 'idle' | 'running' | 'paused' | 'done'`
- `MetricsEntry { step, loss?, accuracy?, inertia?, explainedVariance?, reward?, custom? }`
- `VizState = Record<string, any>` — an opaque payload passed straight from engines to the canvas

Highlights:
- `setAlgorithm(slug)` **must** be called before params — it resets `status/currentStep/metrics/vizState` (and the B-side fields).
- `metrics` is an append-only array; the metrics panel charts it, the progress counter reads `currentStep / totalSteps`.
- Comparison mode lives in the same store: `isComparisonMode`, `paramsB`, `vizStateB`, `metricsB` and symmetric setters.
- **Deliberate design decision:** a single store holds *both* A and B models, which keeps comparison UI trivially consistent (see §13).

### `src/store/useDatasetStore.ts`

| Field | Meaning |
|---|---|
| `activeDataset` | The `Dataset` currently fed to engines |
| `activeDatasetId` | `'' / 'custom' / sample-id` |
| `customDataset` | Holds an uploaded CSV's parsed dataset |
| `setDataset(id)` | `id === 'custom'` → swap in cached upload; otherwise regenerate a sample |
| `regenerateDataset()` | Re-roll a random sample of the *same* generation |
| `loadCustomCSV(dataset)` | Commit parsed upload |

---

## The Algorithm Registry — Everything is Schema-Driven

`src/utils/algorithm-registry.ts` exports `ALGORITHMS` — 22 declarative specs. Each `AlgorithmInfo` is a self-describing schema:

```ts
interface AlgorithmInfo {
  slug: string;              // URL segment + engine switch key
  name: string;             // Human label
  category: 'supervised' | 'unsupervised' | 'reinforcement';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;      // One-liner
  longDescription: string;  // Markdown-ish multi-line prose shown in workspace
  datasetType: 'classification' | 'regression' | 'clustering';
  params: ParamSchema[];    // Each param renders as SliderParam | DropdownParam | ToggleParam | NumberParam
  defaultDataset: string;   // e.g. 'moons', 'blobs3', 'linear1d'
  tags: string[];
}
```

`ParamSchema` carries everything a control needs — `{ key, label, type, default, min?, max?, step?, options?, advanced?, tooltip? }`.

`getDefaultParams(slug)` builds the initial runtime `params` from the schema defaults, so the panel is *generated* from data, never hand-coded. The engine then consumes those `params` in its `initialize()`.

### The 22 algorithms

| Category | Slugs |
|---|---|
| Classification | `knn`, `logistic-regression`, `naive-bayes`, `decision-tree`, `random-forest`, `svm`, `neural-network`, `adaboost`, `gradient-boosting` |
| Regression | `linear-regression`, `polynomial-regression`, `ridge-regression`, `lasso-regression`, `elastic-net` |
| Clustering / dim-reduction | `kmeans`, `k-medoids`, `dbscan`, `gmm`, `hierarchical-clustering`, `pca`, `tsne` |
| Reinforcement | `q-learning` |

Each registry entry also contains rich educational copy (the `longDescription`) explaining what each parameter *visually* does — e.g. *"Gamma sets the radius of influence of support vectors. High Gamma creates tight pockets around points."* — which is rendered directly into the workspace control panel.

---

## The Engine Layer — a Shared Contract

Every file in `src/engines/` exports an **engine class** that implements the contract:

```ts
initialize(params: Record<string, number | string | boolean>, dataset: Dataset): void
step():      { state: <EngineState>; done: boolean }
getState():  <EngineState>
reset():     void
```

- **`initialize`** reads the registry params, ingests `dataset.features` / `dataset.labels`, resets internal counters, and pre-computes step‑0 (e.g. K‑Means++ seeding).
- **`step()`** advances the model exactly once and returns `done: boolean` — the loop stops when `done` is true.
- **`getState()`** returns the same shape as a step so the UI can render *before* any training.

The engine is **pure JS math**, no frameworks — which is what makes per‑frame resumes cheap. Spot checks:

- **K‑Means** (`kmeans.ts`) — assigns→updates centroids→inertia; convergence when max centroid shift `< 0.001`. Ships both **K‑Means++** and random seeding.
- **Linear/ridge/lasso/elastic-net regression** — closed-form gradient descent with optional L1/L2 penalty terms folded into the gradient.
- **Neural Network** (`neural-network.ts`) — a genuinely hand-rolled MLP: 13 activation functions (`relu`, `sigmoid`, `tanh`, `leaky-relu`, `elu`, `selu`, `gelu`, `swish`, `mish`, `softplus`, `linear`, `hard-tanh`, `binary-step`) + SGD/Adam/RMSprop + dropout + batch options, backprop all in plain JS.
- **Q‑Learning / SARSA** (`q-learning.ts`) — tabular `qTable["row,col"] = [up,down,left,right]`, epsilon-greedy, TD updates; SARSA is on-policy (caches next action). Returns `loss` = accumulated reward.

The state objects are also serializable JSON, which keeps the canvas and metrics decoupled (a future streamed/worker version can reuse them — everything is already step-shaped).

---

## The Training Orchestrator

`src/app/visualize/[algorithm]/page.tsx` is the conductor. Key mechanics:

### `createEngine()` — the factory switch
A flat `switch (slug)` constructs the matching engine instance. Adding a new algorithm = one more case. Any unknown slug renders a "Algorithm not found" early-return with a link back to the gallery.

### `calcSteps()` — deriving `totalSteps` per algorithm
Because each algorithm paces its own loop, total steps are computed from the schema params:

```
knn naive-bayes        → ceil(gridResolution / 5)
*  regression/svm/nn   → epochs
kmeans k-medoids gmm tsne → maxIter
random-forest           → nTrees
adaboost gradient-boosting → nEstimators
q-learning              → episodes
pca                     → animationSpeed  (projection animation frames)
hierarchical-clustering → max(0, nSamples − k)   (number of merges)
dbscan                  → 1
```

### The loop

```ts
if (status !== 'running') → cancel animation frame; return
const loop = () => {
  if (timestamp − lastStep ≥ speed) {
    const engine = ... // single or comparison dual-engine path
    const result = engine.step()
    addMetrics({ step, loss/acc/… })   // appends to metrics[]
    setVizState(result.state)           // triggers canvas redraw
    if (result.done) setStatus('done')
  }
  animationRef = requestAnimationFrame(loop)
}
```

`speed` (10–500 ms between steps) is read from the store *inside* the loop, so the slider works reactively. The loop reschedules itself; cleanup cancels the frame on unmount.

**A pivotal detail:** `initEngine()` runs on mount and again whenever the *dataset* changes or the user hits **Apply & Reset** — but it never auto‑starts. Auto‑start is gated purely by `setStatus('running')` from the Play button.

---

## Visualization Playback Controls

`src/components/controls/TrainingControls.tsx`

- **Play / Pause / Resume** — toggles the status machine; disabled once `done` (must Reset).
- **⏭ Single Step** — shown only when idle/paused. If the engine isn't initialized, it initializes first (with `setTimeout(50)` to let state settle).
- **🔄 Reset** — cancels the loop and re-runs `initEngine`.
- **⟳ Apply & Reset** (page-level) — cancels, resets, re-initializes with the latest sliders *without* starting it — so you can re-render a configuration live.
- **Speed slider** — ms between steps.

The panel is entirely generated from the `AttrSchema` in the registry: `SliderParam`, `DropdownParam` (supports optgroups for NN activation list), `ToggleParam`, `NumberParam`. Advanced params collapse under an **"Advanced Options"** dropdown; the demo counts "N / M parameters shown".

---

## The Visualization Canvas — Rendering Deep Dive

`src/components/visualization/VisualizationCanvas.tsx` — a single `<canvas>` (two when comparing) redrawn from scratch on every `vizState` change.

### Rendering pipeline

```
resize (devicePixelRatio-aware) → clear → axial bounds → grid lines
  → layered algorithm-specific draws (in z-order)
      1. decision boundary (fillRectGrid)
      2. GMM covariance ellipses
      3. K-Means/K‑Medoid centroid markers + movement trails
      4. SVM support-vector rings
      5. regression curve / straight-line weights
      6. PCA eigenvectors (scaled by √eigenvalue) + stated directions
      7. data points
  → axis labels
```

The main code alternates on `vizState.field` — this is the load-bearing design insight: **the canvas panics on what the engine emits**, so each engine controls its own chapter of the drawing.

### 1. Classification boundaries
`state.boundaries[]` — an array of grid points with either `{x,y,cls}`, `{x,y,prob}` (logistic/NB/MLP), or `{x,y,decision}` (SVM margin heat) — drawn as filled **pixel rects** (`fillRect`) at 40×40 grid cells, colored by `BOUNDARY_COLORS` or a probability ramp. This approach is deliberately canvas-flat: a boundary is just millions of `fillRect` calls.

### 2. GMM ellipses
`state.gaussians` — each `{mean, cov2×2}` plotted as an oriented 2σ ellipse via eigenvalue decomposition `ψ(trace²/4−det)` for spread and `atan2(2b, a−d)/2` for rotation.

### 3. Centroids & trails
`state.centroids` + `prevCentroids` draw dashed movement trails between the two, then an X‑marker + halo published for each cluster color.

### 4. SVM support vectors
Amber rings around `state.supportVectors`.

### 5. Regression curve / weights
Either `state.regressionCurve` (poly) or a straight line computed inline from `weights[0]*x + weights[1]` (linear regressions).

### 6. PCA eigenvector overrides
`scale = sqrt(eigenvalue) * 2` arrows from the data mean; the two principal axes get distinct colors (indigo/rose). When `animateProjection` on, points tween from original space to the projection using `projectionProgress`.

### 7. The Q‑Learning grid world
A completely different branch: draws a `gridSize × gridSize` board with obstacles (crossed cells), goal (green star), per-cell Q-value intensity fill (`maxQ * 0.05` capped at 0.5), and the greedy policy arrows (up/down/left/right) from each cell's argmax Q-value. The agent is drawn as a centered indigo disc.

### Data point pass
`data[i]` position, tint from `assignments` (clustering) else class colors. t‑SNE and PCA override the coordinates with `projectedData`. 1‑D regression data is plotted `(x, label)`.

### Comparison overlay
In comparison mode two stacked canvas is rendered side-by-side, each tagged with a translucent "Model A/B Configuration" overlay built from active params (excluding purely-visual keys).

---

## The Metrics Panel — Charts + Fitting Heuristics

`src/components/metrics/MetricsPanel.tsx`

- **Live loss chart** — a zero-dependency Canvas line chart drawn from `metrics[].loss ?? inertia ?? reward`. In comparison mode plots write-line B in cyan; otherwise a graceful filled gradient under the curve.
- **Accuracy chart** — same pattern from `metrics[].accuracy`, normalized to [0,1] vertical axis.
- **Engine-specific stats cards** rendered conditionally per algorithm — `treesTrained`, `stumps`, `mergeCount/totalPoints` for hierarchical, NN `layerSizes` ("8 → 4"), naive-bayes "Current Phase", SVM `marginWidth` + `supportVectorCount`, PCA `explainedVariance` bars, and Q‑Learning `episode / totalSteps / epsilon%`.

### The `getFittingStatus` heuristics
A pure function (no engine access, only `algorithm` + `params` + latest metric + step) that plays a ~200-line rule engine per algorithm to label **Underfitting / Good Fit / Overfitting** with human reasons. Just a few of the rules:

- KNN: `k === 1` → overfit; `k ≥ 25` → underfit; `acc > 0.98` → overfit.
- Decision Tree: depth ≤ 2 → underfit; depth ≥ 10 or acc>0.99 → overfit.
- SVM: `C ≤ 0.05` → underfit; `rbf && gamma ≥ 15` → overfit.
- NN: tiny `[4]` layer + low acc → underfit; `lr > 0.5` → oscillation; acc>0.98 & no dropout → overfit.
- Polynomial: degree 1 → underfit; `degree ≥ 6 && λ = 0` → overfit (edge oscillations).
- DBSCAN: `eps ≥ 0.8` → clusters merged; `eps ≤ 0.12 && minPts ≥ 8` → all noise.

This gives beginner-learner UX ("your boundary is a 1-D rule missing the pattern"), on top of the numerics.

---

## Data Layer — Synthetic Generators + Custom Upload

### `src/datasets/sample-datasets.ts`

Deterministic-ish procedural synthesizers (yes, PRNG via `Math.random`, all seeded by the generator run — so "Regenerate" produces a fresh sample of the same type):

| id | Type | Details |
|---|---|---|
| `moons` | classification | interleaved half-moons, class 0 vs class 1 |
| `circles` | classification | concentric rings |
| `blobs` / `blobs3` | classification/clustering | Gaussian blobs, nClusters ∈ {2,3} |
| `xor` | classification | label = `(x>0) XOR (y>0)` |
| `linear1d` | regression | `y = 2.5x + 1 + noise` |
| `poly` | regression | cubic + noise |
| `sinusoidal` | regression | sine |
| `aniso` | clustering | three sheared blobs (necked ellipses) |
| `noisy` | clustering | high-noise moons |

The `Dataset` shape is `{ id, name, features:number[][], labels:number[], featureNames, nClasses? }`. Engines consume exactly this.

### Custom CSV upload (`DatasetPicker.tsx`)

Browser-side parser: reads text → splits lines → skips invalid → expects the **last column to be the label**. Auto-detects classification (integer labels ⇒ `nClasses = max+1`) vs regression. Full rows become `features`; a `DataPreview` shows the resulting table. On success saves to the store via `loadCustomCSV`, driving the engine's next `initialize()`.

---

## Export & PNG

`src/components/export/ExportModal.tsx` grabs the `#viz-canvas` DOM element and downloads a PNG via `canvas.toDataURL('image/png')` with a timestamped filename. SVG is shown as a disabled "Coming Soon" chip. (There's no video export yet, despite the design doc — see §20.)

---

## Comparison Mode (Dual-Engine)

A checkbox in `HyperParamPanel` flips `useTrainingStore.isComparisonMode`:

- On enable, `paramsB` is seeded as a copy of `params`; a **Model A / Model B** tab switcher lets you edit either set independently.
- The workspace page then initializes **two engines** (`engineA`/`engineB`) over the *same* dataset and runs the rAF loop twice per step, pushing each to separate viz/metrics state.
- `calcSteps` uses `max(stepsA, stepsB)` for the progress bar.
- `VisualizationCanvas` splits the race: flex-two horizontal panes, each drawing its own canvas, with the param overlay tagine.
- `MetricsPanel` renders every value twice (label + colored A/B bullets) and the fitting analyzer emits a per-side verdict.

This gives a head-to-head "same data, different hyperparameters" experiment in one screen — a genuinely powerful teaching tool that falls straight out of the dual-state store design.

---

## Theming

`globals.css` defines semantic CSS custom properties per theme:

```css
:root { --bg-primary:#fafbfc ... }
[data-theme="dark"] { --bg-primary:#09090f ... }
```

- `data-theme` is set on `<html>` and toggled by the `Navbar` icon button (dark default).
- All ui + Drawing is hardcode-casts theme tokens (`--accent-primary` indigo `#6366f1`, `--text-secondary`, `--border-color`); the canvas reads them via `getComputedStyle(document.documentElement)` so the canvas adapts to the theme live.

---

## API Surface

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | `{ status, timestamp, uptime }` — keeps serverless functions warm; pings every 2 min from `/` |

No training or data APIs — ML runs on the client.

---

## Directory Map (src)

```
src/
├── app/
│   ├── api/health/route.ts         health heartbeat
│   ├── layout.tsx                  html shell, themes, Navbar
│   ├── page.tsx                   landing + gallery
│   ├── about/page.tsx             about + creator details
│   └── visualize/[algorithm]/
│       ├── layout.tsx             full-height container
│       └── page.tsx               ORCHESTRATOR: engines, loop, control panel
├── components/
│   ├── controls/                  HyperParam/slider/dropdown/toggle/number,
│   │                              DatasetPicker, DataPreview, TrainingControls
│   ├── export/ExportModal.tsx     PNG download
│   ├── layout/                     Navbar, WorkspaceLayout (3-pane grid)
│   ├── metrics/MetricsPanel.tsx   live charts + fitting heuristics
│   ├── ui/AlgoIcons.tsx           per-slug SVG icon set + JunglansLogo
│   └── visualization/VisualizationCanvas.tsx   full Canvas renderer
├── datasets/sample-datasets.ts    procedural generators + registry
├── engines/                       22 model classes (unified contract)
├── store/                         useTrainingStore, useDatasetStore
└── utils/
    ├── algorithm-registry.ts      the 22-algo schema below the UI
    ├── color-schemes.ts           curated palettes + heatmaps + helpers
    ├── color-schemes.ts           curated palettes + heatmaps + helpers
    └── data-normalizer.ts         minMax / zScore normalize + denormalize (currently unused)
```

(There is no `hooks/` or `frame-recorder.ts` yet — those are future.)

---

## Performance Notes

- **Reactive architecture is cheap** — a step pushes plain JSON; canvas re-draw is the only heavy thing, and it's deliberately simple `fillRect` / paths.
- **Boundary rendering** is fixed-resolution (40-px grid) regardless of data size, so it's constant cost.
- **The training loop** yields back to the browser each tick via `rAF`; the `speed` param decimates how often a `step()` actually runs, letting the main thread breathe.
- **High-DPI** — canvas `width/height` are multiplied by `devicePixelRatio` and `ctx.scale()` applied, so exports look sharp.
- **Known costs,** acceptable for ≤ few-hundred points: full re-draw of all points per step, full recompute of loss per step, e.g. hierarchical clustering is O(N²) merges (per-step N advances fine).

---

## As-Built vs. The Design Doc

The root-level `ML_Visualizer_Architecture.md` describes a larger vision (TensorFlow.js/WebGL, D3/`Cytoscape`, backend FastAPI + Redis, video export via FFmpeg.wasm, WebSockets, etc.). The shipped implementation takes the browser-first core and implements it more simply and more robustly:

| Design Doc | In the actual code |
|---|---|
| TensorFlow.js / WebGL rendering | Hand-written TS engines + Canvas 2D |
| D3 / Chart.js charts | Hand-drawn Canvas line charts (zero deps) |
| WebSocket backend training | Pure client-side `rAF` loop |
| Video export (FFmpeg/Capture) | Not implemented (only PNG) |
| Dendrogram / neural-net graph viz | Not implemented (boundary + curve views) |
| Comparison mode | ✅ fully present and working |
| CSV upload, dark/light theme, step-through | ✅ fully present as described |

The actual codebase is the "smaller-but-polished MVP" slice of the architecture doc — the deferred items are specifically listed above.

---

## Author & Roadmap

Crafted by **Manosakthi** (see `/about` for contact, GitHub, and portfolio). Natural next steps:

- **Video export** — `canvas.captureStream()` + lazy-loaded FFmpeg.wasm
- **Reduce bundle** — drop unused deps (`@tensorflow/tfjs`, `d3`, `chart.js`, `mathjs`)
- **Web Workers** — offload heavy CSV parsing and large-N engines (e.g. hierarchical clustering) from the main thread
- **Shareable sessions** — encode active params in the URL search params
- **SVG export** — the UI already labels it "Coming Soon"