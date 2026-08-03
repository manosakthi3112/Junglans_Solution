# ⚡ JunglasNCode — Live Code Execution Visualizer

> **JunglasNCode** (project codename: *CodeTrace*) is an interactive, step-by-step code execution visualizer for the browser. It shows **which line is executing**, **what every variable holds**, **how the call stack grows and shrinks**, **what your program prints**, and **the time/space complexity** of the algorithm — all animated line by line.

Designed by **Manosakthi Thisygarajan**.

[![Language Support](https://img.shields.io/badge/languages-7-blue)](#supported-languages)
[![Editor](https://img.shields.io/badge/editor-Monaco-orange)](#features)
[![Platform](https://img.shields.io/badge/platform-Web%20%2F%20No%20Build-green)](#quick-start)

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Supported Languages](#supported-languages)
4. [Getting Started](#quick-start)
5. [Usage Guide](#usage-guide)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Architecture](#architecture)
8. [Project Structure](#project-structure)
9. [How Execution Works](#how-execution-works)
10. [Complexity Analysis](#complexity-analysis)
11. [Development](#development)
12. [Testing](#testing)
13. [Limitations](#limitations)
14. [Roadmap](#roadmap)
15. [Design & Theming](#design--theming)
16. [Credits](#credits)

---

## Overview

**JunglasNCode** helps students, teachers, and interview preppers **see code the way a computer runs it**. Instead of just reading code and guessing, you:

1. **Paste or type** your program into a Monaco editor.
2. Click **▶ Run** (or press `F5`).
3. Watch execution **step by step** — with the current line highlighted, variables updating live, frames pushing/popping off the call stack, and output appearing line by line.
4. **Step forward and backward** through time using the timeline scrubber.
5. Read a **live complexity analysis** (Big-O for time and space) for the algorithm.

The entire app runs **client-side** (no server required) for JavaScript and Python.

---

## Features

### 🔍 Step-by-Step Execution
- Current executing line highlighted in **amber** with a ▶ glyph in the gutter.
- Previously executed line shown with a faded **green** highlight.
- Per-line **execution count** tracking.

### 📋 Live Variable State Table
- Columns: **Name · Type · Value · Status**.
- Rows **flash green** when a value changes and **red** when a variable goes out of scope.
- **🧠 Memory** tab — visual block-based memory viewer for arrays/lists (with optional 3D rendering).
- **🔀 Flow** tab — canvas-based execution flow graph showing how control moved between lines.

### 📚 Call Stack Visualizer
- Vertical stack of frames with function name + line number.
- **List** view and **🧊 3D isometric stack** view.
- Frame **push / pop** animations.

### 💻 Output Console
- Live stdout as execution progresses.
- **stdin** input box for programs that read input.
- One-click **copy output** button.

### 📈 Live Complexity Analysis
- Detects loops, nesting, recursion to estimate **Time** and **Space** complexity.
- Color-coded badge: 🟢 good · 🟡 ok · 🔴 bad.
- **Complexity graph** plotted on a canvas.

### 🎛 Execution Controls
- ▶ **Run** (`F5`) — execute the whole program.
- ⏭ **Step** (`F10`) — advance one step.
- ⏮ **Back** (`←`) — rewind one step.
- ⏹ **Reset** (`Esc`).
- **Speed presets** 🐌 0.5× / ⚡ 1× / 🚀 2× / 🛸 5× + fine-grained slider (0.1× – 5×).

### ⏱ Execution Timeline
- Scrubable progress bar across **every step**.
- Jump to any point in the execution instantly.

### 🔴 Breakpoints
- Click a line number in the **gutter** to toggle a breakpoint (red dot).
- Auto-pause when the running code reaches a breakpoint.

### 🧊 3D Mode
- Toggle **"3D"** in the header to render:
  - Isometric **3D call stack**.
  - **3D memory array blocks** — great for visualizing sorting algorithms.
- Call stack panels slide into the isometric view.

### 🌙 Light / Dark Theme
- Instant **dark/light** toggle across the whole UI.

### ⌨️ Keyboard Navigation
- Full keyboard shortcuts (see [below](#keyboard-shortcuts)).

### 📱 Responsive Layout
- **Desktop:** side-by-side 50/50 split with a **draggable divider**.
- **Mobile:** tabbed ✏ Editor / 📊 Visualization panels.

---

## Supported Languages

| # | Language | Version        | Editor Syntax | Native Trace | Transpiles |
|---|----------|----------------|---------------|--------------|------------|
| 1 | Python   | 3.11           | ✅            | ✅           | —          |
| 2 | JavaScript | ES2024      | ✅            | ✅           | —          |
| 3 | C        | GCC 13.2       | ✅            | —            | ✅ (to JS) |
| 4 | C++      | G++ 13.2       | ✅            | —            | ✅ (to JS) |
| 5 | Java     | JDK 21         | ✅            | —            | ✅ (to JS) |
| 6 | Go       | 1.22           | ✅            | —            | ✅ (to JS) |
| 7 | Rust     | 1.77           | ✅            | —            | ✅ (to JS) |

> **JavaScript** and **Python** run **natively** through the built-in `JSTracer` and `PythonTracer`. The other five languages are **transpiled to JavaScript** via `Transpiler` so they can trace execution without a backend. When a language can't execute custom code, the app falls back to a **pre-built example trace** (a notice is shown in the UI).

---

## Quick Start

There is **no build step** — just serve the folder as static files.

### Option A — just open the file

Double-click `index.html` — it works from `file://` in most modern browsers.

### Option B — local server (recommended)

You can use a one-liner static server:

```bash
# Python 3
python -m http.server 8080

# Node.js (any version)
npx serve .
```

Then visit **http://localhost:8080**.

> ⚠️ **Recommended:** Use a local server. Some browsers restrict Monaco's worker loading from `file://`.

### Requirements

- Any modern browser (**Chrome / Edge / Firefox / Safari**).
- **Internet connection** for CDN resources (Monaco Editor, Google Fonts, Devicons).
- No npm packages, no framework, no installation.

---

## Usage Guide

1. **Pick a language** from the dropdown in the header — the editor loads a handy example for that language (bubble sort, Fibonacci, binary search, merge sort, linked list, goroutines, ownership demo, etc.).
2. **Edit the code** (or paste your own) in the Monaco editor.
3. (Optional) Type input in the **📥 Standard Input (stdin)** box if your program reads console input.
4. Click **▶ Run** — the app executes the whole program, collects a trace, and reveals it step 1.
5. Scrub the **timeline** or use **⏭ Step / ⏮ Back** to inspect any moment of execution.
6. Watch the **variables panel**, **call stack**, **output console**, and **complexity badge** update in sync.
7. Toggle **🧊 3D** to see the call stack and memory blocks rendered in 3D.
8. Click **line numbers** to toggle breakpoints and pause mid-run.

---

## Keyboard Shortcuts

| Action                | Shortcut      |
|-----------------------|---------------|
| Run code              | `F5`         |
| Step forward          | `F10`        |
| Step back             | `←`          |
| Reset                 | `Esc`        |
| Toggle breakpoint     | click gutter line number |

---

## Architecture

```
User Code Input
       │
       ▼
┌─────────────────────┐
│  Monaco Editor      │   (index.html + js/app.js)
└──────────┬──────────┘
           ▼
┌─────────────────────┐        ┌──────────────────────┐
│  ExecutionEngine   │────────│ JSTracer (native JS)  │
│  (step/playback)    │        │ PythonTracer          │
└──────────┬──────────┘        │ Transpiler → JS trace │
           └──────────┬────────┘
                      ▼
┌───────────────────────────────┐
│  Step trace stream            │
│  {line, event, scope, variables,│
│   call_stack, stdout, ...}     │
└──────────────┬─────────────────┘
               ▼
┌─────────────────────────────────────────────┐
│  UI Renderer  (js/ui.js + js/viz3d.js)      │
│  Variables · Memory · Flow · Call Stack ·   │
│  Output · Complexity · Timeline · 3D        │
└─────────────────────────────────────────────┘
```

Key modules:
- **app.js** — orchestrates everything: Monaco + engine + tracers + UI.
- **executionEngine.js** — core step state machine, playback, breakpoints, event bus.
- **jsTracer.js** — custom JS interpreter/tracer for client-side execution.
- **pythonTracer.js** — Python execution + tracing (subprocess/sandboxed or interpreter-based).
- **transpiler.js** — converts C / C++ / Java / Go / Rust syntax into JS for tracing.
- **complexityAnalyzer.js** — static AST analysis for Big-O detection.
- **ui.js** — renders variables table, call stack, output, complexity, flow canvas.
- **viz3d.js** — 3D isometric call stack + memory-array block renderer.
- **codeExamples.js** — language definitions, example snippets, pre-built traces.

---

## Project Structure

```
Jung_code_visualizer/
├── index.html                    # Entry HTML (layout, head, Monaco loader)
├── styles.css                    # Full design system + light/dark themes
├── test_all_languages.js         # Test runner over all 7 languages
├── test_cpp_parse.js             # Transpiler / C++ parse sanity test
├── test_tracer.js                # Tracer sanity test (JS + Python)
├── report.md                     # Detailed design report
├── code_visualizer_spec.md       # Original product specification
└── js/
    ├── app.js                    # Main app controller/bootstrapper
    ├── executionEngine.js        # Playback engine, breakpoints, events
    ├── jsTracer.js               # JS tracer
    ├── pythonTracer.js           # Python tracer
    ├── transpiler.js             # Cross-language transpiler → JS
    ├── complexityAnalyzer.js     # Big-O analyzer
    ├── ui.js                     # DOM renderers
    ├── viz3d.js                  # 3D visualizer module
    └── codeExamples.js           # LANGUAGES table + examples + prebuilt traces
```

---

## How Execution Works

1. **Parse & pre-process** — the chosen language's code is passed through the tracer or transpiler.
2. **Generate a trace** — a sequence of *step objects*, each capture:
   - step index,
   - executed line number,
   - event type (call / line / return / exception),
   - current scope,
   - **full variable snapshot** (name → `{type, value, changed}`),
   - **call-stack frames** with args,
   - accumulated **stdout**.
3. **Playback** — the `ExecutionEngine` walks the trace; each step notifies the UI to update highlight, variables, stack, output, and timeline.
4. **Interactivity** — stepping forward/back just indexes into the trace; breakpoints pause automatic playback.

---

## Complexity Analysis

`complexityAnalyzer.js` inspects the code pattern statically:

| Pattern | Approx. Complexity | Badge |
|----------|--------------------|-------|
| No loops              | O(1)      | 🟢 |
| Single loop over n    | O(n)      | 🟠 |
| Loop inside loop      | O(n²)     | 🔴 |
| Triple-nested loop    | O(n³)     | 🔴 |
| Halving loop / recursion | O(log n)   | 🟢 |
| Loop + binary search  | O(n log n) | 🟠 |
| Exponential recursion | O(2ⁿ)     | 🔴 |
| Permutations          | O(n!)     | 🔴 |

The result renders as a **color-coded badge** plus a **canvas complexity graph**.

---

## Development

- **No framework, no npm required** — plain HTML + CSS + ES modules.
- Edit `styles.css` for design theming (CSS custom properties define entire palette).
- All logic is in ES Modules under `js/`; imports are referenced in `app.js`.

To tweak or extend:

```bash
# Serve locally while developing
python -m http.server 8080    # or npx serve
```

### Adding a new language
1. Register it in `LANGUAGES` inside `js/codeExamples.js`.
2. Give it a `CODE_EXAMPLES` entry and a prebuilt trace if `canExecute: false`.
3. Add a transpile case in `js/transpiler.js` if you want custom execution.

---

## Testing

The repo ships small Node-based smoke tests. They run headless:

```bash
node test_all_languages.js   # Tries to transpile+execute every language example
node test_cpp_parse.js      # Checks the C++ transpiler round-trip
node test_tracer.js         # Checks JS + Python tracers
```

> These scripts exercise the interpreter/transpiler/logic **outside** the browser; the app's DOM/visual behavior must be reviewed in a browser.

---

## Limitations

- **C, C++, Java, Go, Rust** don't run natively in the browser — they are transpiled to JS for tracing. Complex stdlib calls / OS-level constructs may not translate ⚠️. When unsupported, the app loads a **pre-built example trace** and shows a notice.
- Limited to **JavaScript** interpretation — unsupported JS features (some DOM APIs, etc.) may not trace correctly.
- Complexity analysis is **static** — it estimates worst-case from structure; it cannot read runtime data.
- Requires **internet for CDN assets** (Monaco, fonts, icons, Devicons).

---

## Roadmap

- [ ] Breakpoint **condition** support (right-click → conditional).
- [ ] Step-out / step-over nav.
- [ ] Variable **expansion** for nested objects in memory view.
- [ ] Save/share trace URLs.
- [ ] True frontend interpreters for Go, Rust via WASM.
- [ ] Export trace as JSON.

---

## Design & Theming

- **Palette** controlled entirely by CSS custom properties in `styles.css` **:root** (light) and `[data-theme=dark]` block — green/emerald accent theme, amber active-line, green prior-line, red breakpoints.
- **Fonts:** Inter (UI) + JetBrains Mono (code).
- **Editor:** Monaco (VS Code's editor) with custom decorations for active line, previous line, ▶ glyphs, and breakpoint dots.
- **Icons:** Devicons via CDN for language logos.

---

## Credits

- **Designed by Manosakthi Thisygarajan** — design concept, UX, color system, and code.
- **Monaco Editor** — [Microsoft](https://microsoft.github.io/monaco-editor/) code editing engine.
- **Devicons** — programming language icons.
- **CodeTrace / JunglasNCode** — original spec in `code_visualizer_spec.md`.

---

*JunglasNCode — see your code run.* ⚡