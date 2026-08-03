# Cinematic AI Engine — Frame Selector v7.0

Automatically selects the **best frames** from a video using a multi-stage computer-vision + deep-learning pipeline. Scores every sampled frame across 13+ dimensions — face quality, composition, saliency, sharpness, lighting, motion, aesthetics — de-duplicates near-identical shots, enforces temporal variety, and exports the top-K frames as polished JPGs ready for thumbnails, social covers, and cinematic stills.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Architecture Overview](#architecture-overview)
5. [Deep Dive: Pipeline Stages](#deep-dive-pipeline-stages)
6. [Deep Dive: Scoring Engine](#deep-dive-scoring-engine)
7. [Deep Dive: Deduplication](#deep-dive-deduplication)
8. [Deep Dive: Configuration](#deep-dive-configuration)
9. [Programmatic API](#programmatic-api)
10. [Project Structure](#project-structure)
11. [Performance & Memory Model](#performance--memory-model)
12. [Extras, Manual Dependencies & Gotchas](#extras-manual-dependencies--gotchas)
13. [Testing](#testing)
14. [Roadmap](#roadmap)

---

## Quick Start

```bash
pip install -e .[all]
frame-selector --video input.mp4 --top_k 20
```

Output lands in `./best_frames_v7/` with filenames like:

```
rank001_score0.9234_t12.50s_cinematic_mesh.jpg
```

...plus a `selection_report_v7.json` containing full per-frame metrics.

---

## Installation

The package supports a **modular dependency model** — it always runs on the core stack (OpenCV + NumPy + SciPy + Pillow) and *gracefully degrades* when optional accelerators/detectors are missing.

```bash
pip install -e .                      # base (CPU, OpenCV only)
pip install -e ".[gpu]"               # + PyTorch / torchvision (GPU metrics, MobileNetV3)
pip install -e ".[yolo]"              # + Ultralytics YOLOv8 (subject composition)
pip install -e ".[face]"              # + MediaPipe (468-pt face mesh)
pip install -e ".[ocr]"               # + pytesseract (social-media spam filter)
pip install -e ".[hash]"              # + imagehash (dedup alternative)
pip install -e ".[yaml]"              # + PyYAML (YAML configs)
pip install -e ".[all]"               # everything
pip install -e ".[dev]"               # + pytest / pytest-cov
```

| Optional Dependency | Extra | What breaks if missing |
|---|---|---|
| PyTorch + torchvision | `gpu` | Falls back to NumPy CPU kernels; semantic dedup disabled |
| Ultralytics | `yolo` | Composition falls back to face-anchor scoring |
| MediaPipe | `face` | Face analysis uses OpenCV Haar cascades |
| pytesseract | `ocr` | Spam filter disabled |
| PyYAML | `yaml` | Defaults used |
| imagehash | `hash` | Custom pHash/dHash already implemented — redundant |

> On Windows without a CUDA toolkit, install PyTorch wheel from the official index: `pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118`. The engine auto-detects `cuda` → `mps` → `cpu`.

---

## Usage

```bash
# Basic — analyze 1 of every 5 frames, save top 20
frame-selector --video input.mp4

# Explicitly ask for 20 frames
frame-selector --video input.mp4 --top_k 20

# Tune concurrency
frame-selector --video input.mp4 --workers 8 --batch_size 64

# Custom YAML config
frame-selector --video input.mp4 --config configs/my_config.yaml

# CPU-only even if CUDA is available
frame-selector --video input.mp4 --no_cuda

# Face-required gate: frames with no face score 0
frame-selector --video input.mp4 --face_required

# Social-media overlay filtering (video thumbnails with "SUBSCRIBE")
frame-selector --video input.mp4 --ocr

# Skip the post-scoring enhancement
frame-selector --video input.mp4 --no_enhance

# Demo mode — score 10 hand-crafted synthetic scenarios, no video needed
frame-selector --demo
```

**All CLI flags override YAML values**, which override dataclass defaults.

---

## Architecture Overview

The system is a streaming, chunked pipeline. Frames are read once, analyzed at reduced resolution, distilled into a fixed-capacity min-heap of candidates, and only the survivors are re-read at full resolution for the final save.

```
Video ──► BufferedFrameExtractor ──► GPUBatchPreprocessor ──► Pre-filter ──► [face+GPU metrics]
   (producer/consumer,          (sharpness, lighting,      (drop dark,
    1/N sampling, scene,           motion blur,                blurry)          │
    optical flow action)           aesthetic, vibrance)                        ▼
                                                                  AdvancedDuplicateRemover
                                                                            │  MD5 / pHash / dHash
                                                                            ▼
                                                                 YOLOComposer ──► SaliencyAnalyzer
                                                                      │              │
                                                                      ▼              ▼
                                                AdvancedScoringEngine (13-dim weighted sum)
                                                                            │
                                                        min-heap (cap = top_k × 4)
                                                                            │
                                       Global cross-chunk dedup ─► Temporal diversity ─► (OCR filter)
                                                                            │
                                        full-res re-read ─► enhance ─► optional crop ─► rank*.jpg
                                                                            │
                                                               selection_report_v7.json
```

Key design principles:

- **Analyze low, save high.** All scoring runs on downscaled frames (`analysis_size=720`); only winners are re-read at native resolution.
- **Stream, don't load.** Video is consumed in chunks (`chunk_size=256`), keeping memory flat.
- **Threads, not processes.** `ThreadPoolExecutor` for face analysis (thread-local MediaPipe instances) avoids Windows `spawn` issues.
- **GPU where it counts.** Laplacian/Sobel/statistics run as batched PyTorch conv2d on CUDA/MPS — 10–100× faster than CPU. Frames per chunk processed with `.batch_size`.
- **Checkpoint & resume.** After each chunk, the heap is serialized to `checkpoint_<video_md5>.json`; an interrupted run resumes from the next chunk.

---

## Deep Dive: Pipeline Stages

### Stage 1 — Extraction (`extraction.py::BufferedFrameExtractor`)

A **producer–consumer** reader:

- A producer thread pulls raw frames from `cv2.VideoCapture(..., cv2.CAP_FFMPEG)` into a bounded queue (`QUEUE_SIZE = 16`), providing backpressure so decoding keeps up with analysis without buffering the whole file.
- The consumer keeps every **1-in-`sample_ratio`** frame, resizes to `analysis_size` height (INTER_AREA), records `timestamp = raw_idx / fps`.
- **Scene detection** — mean absolute pixel difference between consecutive sampled frames; a jump > `scene_diff_thresh` increments `scene_id` (a cheap proxy for cut detection).
- **Action intensity** via dense optical flow (`calcOpticalFlowFarneback`), mean magnitude clipped to `[0,1]`. This powers the `action` score weight.

The extractor yields `(chunk, native_fps, total_frames)` where chunk items are tuples `(ext_idx, raw_idx, ts, small_bgr, scene_id, action)`.

### Stage 2 — GPU-batch quality metrics (`gpu_metrics.py::GPUBatchPreprocessor`)

Batch ops run as `[N,1,H,W]` tensors through `F.conv2d`; CPU fallbacks (`_cpu_*`) replicate them with NumPy/OpenCV.

| Metric | Kernel / method | Meaning |
|---|---|---|
| `sharpness` | Laplacian 3×3, variance / `blur_sharp_norm`, clamped | Acuity / in-focus quality |
| `lighting` | mean (brightness), std (contrast) | `0.6·(1-|μ-128|/128) + 0.4·(σ/80)` |
| `motion_blur` | Sobel x/y energy ratio | Directional blur (weight 0 in defaults) |
| `aesthetic` | LAB channel chroma + HSV saturation | Color richness |
| `vibrance` | HSV hue masks (`H≈80-100` teal, `H≈5-25` orange) | Cinematic teal-orange saturation |

The pipeline intentionally **parallelizes** this chunk: face-analysis jobs are handed to the thread pool *before* the remaining GPU metrics run, so CPU (face) and GPU (Sobel/color) work overlap per chunk.

### Stage 3 — Face analysis (`face_analysis.py::AdvancedFaceAnalyzer`)

**Primary: MediaPipe FaceMesh (468 landmarks, `refine_landmarks=True`)**. Computes:

- **Eye openness (EAR)** — vertical/horizontal eyelid ratios averaged over both eyes, normalized so a typical open eye ≈ 1.0.
- **Smile score** — mouth corner curvature plus openness ratio.
- **Pose (yaw)** — nose-tip displacement from the inter-cheek axis → frontal-facing confidence.
- **Awkward-micro-expression gate** — blinks (EAR < 0.18) or a frozen half-open mouth dip `face_present` to 0.05, harshly suppressing mid-blink/wallmouth frames.
- **Composition** — nose position vs the 4 rule-of-thirds power points.
- **Chiaroscuro** — absolute mean-luminance difference between left/right half of the face crop ÷ 80 (dramatic side-lighting score).
- Face box + normalized face center (consumed by saliency, cropping, safe-area logic).

**Fallback: OpenCV Haar cascades** (face/smile/eye) when MediaPipe is absent or a mesh isn't detected — a cruder smile width/height ratio, eye count, and symmetric-eye pose estimate.

Each thread owns a private analyzer (`threading.local()`) so MediaPipe state isn't shared across worker threads.

### Stage 5 — Deep learning & semantics (`deep_learning.py`)

Each class individually degrades:

- `YOLOComposer` — YOLOv8n (`yolov8n.pt`) detects classes `[0,14,15,16]` (person, bird?—actually person/person-based categories), takes the largest box, and scores proximity of the subject center to rule-of-thirds. Runs micro-batches of 16 with `torch.cuda.empty_cache()` between them to survive small VRAM. Falls back to face-based composition if no box clears `conf=0.4`.
- `SaliencyAnalyzer` — OpenCV `StaticSaliencySpectralResidual`; samples the saliency map inside the face box (×1.5 boost) or the central 40% region otherwise. Model "what the eye is drawn to".
- `CNNFeatureExtractor` — MobileNetV3-small (`pretrained`, L2-normalized 1000-d classifiers embedding) for **semantic** similarity (used to break cross-chunk duplicates). Disabled without PyTorch.
- `ORBDeduplicator` — ORB + BFMatcher good-match ratio for **structural** similarity.

### Stage 6 — Scoring & selection (`scoring.py`, `pipeline.py`)

Per candidate, `AdvancedScoringEngine.compute(FrameMetrics)` produces a `[0,1]` score:

```
base = Σ weights[k]·metric[k]        # 13 weighted metrics
     × (0.5 + sharpness·2)           # soft blur penalty when sharpness < 0.25
     × 0.7                          # if brightness < 30 or > 220
```

Then a **min-heap capped at top_k × 4** keeps only the best candidates streaming through memory. `motion_blur` is weighted 0 by default — deliberately disabled.

### Stage 7 — Global re-selection (`pipeline.py`)

After all chunks:

1. **Global cross-chunk dedup** — re-reads each candidate at full res, recomputes MD5 + 16×16 pHash + dHash, removes later duplicates (pHash ≤ 6, dHash ≤ 8). This catches duplicates that span chunk boundaries.
2. **Temporal diversity** — greedy best-first selection that rejects any frame within `min_temporal_gap_sec` of an already-picked timestamp. Prevents bursts of near-identical shots.
3. **OCR filter** (only with `--ocr`) — `SocialMediaTextFilter` runs Tesseract with a banned-word list (`subscribe`, `follow`, `comment`, `ring the bell`, …) against thumbnail + binarized upscaled grayscale; flagged frames are dropped.

### Stage 8 — Save

Winners are sorted by `raw_index` so one `VideoCapture` seeks **sequentially** (minimizing disk seeks), then per frame: optional OCR re-check, optional `AdvancedFrameEnhancer.enhance()` (CLAHE → unsharp mask → saturation ×1.15), optional `SmartAutoCropper.auto_crop()` to 4:5 (fallback to image center), and JPEG quality-95 write with rank/score/timestamp/method in the filename.

Finally `selection_report_v7.json` serializes the full configuration, every scored frame, and all saved-frame metrics.

### Stage 9 — Post-selection niceties

- **Checkpoint resume** — `checkpoint_<md5>.json` stores `chunks_completed`, `total_seen`, `total_skipped`, `total_faces`, and the heap. On restart the pipeline fast-forwards through completed chunks and rebuilds the heap. The checkpoint is deleted on clean completion.
- **Yield protection** inside `run()` — if dedup/temporal gates would produce fewer than `top_k` frames, the pipeline lifts the *highest-scoring* deleted frames back into the selection (best-effort).

---

## Deep Dive: Scoring Engine

The default `score_weights` (must sum to 1.0):

| Metric | Weight | Source |
|---|---|---|
| `face_present` | 0.04 | face_analysis |
| `smile_score` | 0.10 | face_analysis |
| `eye_score` | 0.05 | face_analysis |
| `pose_score` | 0.08 | face_analysis |
| `composition` | 0.12 | YOLO (fallback: face anchors) |
| `saliency` | 0.10 | SaliencyAnalyzer |
| `chiaroscuro` | 0.08 | face_analysis |
| `sharpness` | 0.15 | GPUBatchPreprocessor |
| `action` | 0.10 | optical flow |
| `lighting` | 0.07 | GPUBatchPreprocessor |
| `aesthetic` | 0.06 | GPUBatchPreprocessor |
| `vibrance` | 0.05 | GPUBatchPreprocessor |
| `motion_blur` | 0.00 | GPUBatchPreprocessor (disabled) |

Read as: **"Sharper frames with a rule-of-thirds subject hold up, eyes an active, smiling focused, with good lighting & movement rank best."** Face is deliberately *not* mandatory (weight 0.04) so documentary/landscape frames can still win — flip `face_required=true` to gate otherwise.

---

## Deep Dive: Deduplication

`AdvancedDuplicateRemover` (`dedup.py`) three-layer, chunk-local:

1. **MD5 (8×8 grayscale thumbnail)** — exact image-clone removal, flagged by explicit hash.
2. **pHash** — 64×64 resize → 2D DCT → 16×16 low-frequency band → median-threshold bits; Hamming distance ≤ `phash_threshold` (8) flags a duplicate. Robust to JPEG noise.
3. **dHash** — 17×16 resize, horizontal-gradient bits; ≤ `dhash_threshold` (10) flags. Structural/gradient invariant.

Both classes also support an optional **histogram correlation** path (`mark_duplicates_with_histogram`, 32-bin per-channel fingerprints, cosine × 0.97) — enabled by `hist_correl_threshold` if you set it below 1.0 (default `1.01` effectively disables the modulo check).

Dedup only compares against prior frames within a sliding `WINDOW=120` window and uses vectorized `np.count_nonzero(a ^ b)` XOR across candidate rows — O(n·WINDOW), ~1 ms/frame. Frames flagged duplicate never enter the scoring heap.

---

## Deep Dive: Configuration

Configuration follows a **three-layer precedence**:

`CLI flags → YAML file (--config) → Config dataclass defaults`

The full `Config` surface lives in `frame_selector/config.py` and `configs/default.yaml`. Key knobs:

| Key | Default | Effect |
|---|---|---|
| `score_weights` | (table above) | Relative importance of each dimension |
| `top_k` | 20 | Frames saved |
| `sample_ratio` | 5 | Analyze 1 per N frames (higher = faster, sparser) |
| `workers` | 4 | Face-analysis thread pool |
| `batch_size` | 32 | Chunking size for GPU metrics |
| `chunk_size` | 256 | Frames per checkpoint/streaming chunk |
| `analysis_size` | 720 | Analysis resize max height |
| `enhance` | true | CLAHE+sharpen+color boost |
| `save_report` | true | Write `selection_report_v7.json` |
| `force_cpu` | false | Ignore CUDA/MPS |
| `use_mediapipe` / `use_yolo` / `use_ocr_filter` | true / true / false | Feature toggles |
| `min_score_cutoff` | 0.05 | Frames below this are dropped |
| `min_temporal_gap_sec` | 0.3 | Min seconds between chosen frames |
| `phash_threshold` / `dhash_threshold` | 8 / 10 | In-window dedup sensitivity |
| `hist_correl_threshold` | 1.01 | Histogram dedup; **set <1.0 to enable** |
| `scene_diff_thresh` | 35.0 | Scene-cut MDA threshold |

---

## Programmatic API

```python
from frame_selector import AdvancedSmartFrameSelector, Config

config = Config(top_k=30, sample_ratio=5, workers=8, use_yolo=False)
selector = AdvancedSmartFrameSelector(config)
ranked, saved = selector.run("input.mp4")
# ranked: list[FrameMetrics]  saved: list[dict] with 'file' & 'metrics'
```

Every stage is an importable, independently testable class:

```python
from frame_selector import (
    BufferedFrameExtractor, GPUBatchPreprocessor, AdvancedFaceAnalyzer,
    AdvancedDuplicateRemover, YOLOComposer, SaliencyAnalyzer,
    CNNFeatureExtractor, ORBDeduplicator, AdvancedScoringEngine,
    AdvancedFrameEnhancer, SmartAutoCropper, SocialMediaTextFilter,
)
```

---

## Project Structure

```
frame/
├── frame_selector/                # v7 re-engineered package
│   ├── __init__.py                # Public API re-exports
│   ├── cli.py                     # argparse entry point + demo mode
│   ├── config.py                  # Config dataclass + YAML loader
│   ├── extraction.py              # BufferedFrameExtractor
│   ├── gpu_metrics.py             # GPUBatchPreprocessor
│   ├── face_analysis.py           # AdvancedFaceAnalyzer
│   ├── dedup.py                   # AdvancedDuplicateRemover
│   ├── deep_learning.py           # YOLOComposer / Saliency / CNN / ORB
│   ├── scoring.py                 # AdvancedScoringEngine
│   ├── enhancement.py             # AdvancedFrameEnhancer / SmartAutoCropper
│   ├── filters.py                 # SocialMediaTextFilter
│   ├── pipeline.py                # AdvancedSmartFrameSelector + FrameMetrics
│   └── utils.py                   # device, stderr suppression, thread glue
├── configs/default.yaml           # canonical config
├── tests/                         # pytest suite
│   ├── test_pipeline_integration.py
│   ├── test_dedup.py
│   ├── test_scoring.py
│   ├── test_face_analysis.py
│   └── test_extraction.py
├── archive/                       # historical monolithic v1–v7_6 main.py files
├── pyproject.toml / requirements.txt
├── input.mp4                      # sample video
├── yolov8n.pt                     # YOLOv8n weights
└── best_frames_v7/                # output dir
```

---

## Performance & Memory Model

- **Constant memory**: chunked frames + a capped heap (`top_k × 4`), not the whole video.
- **GPU-fast metrics**: batched convolution ops run on GPU where available.
- **Cheap pre-filter**: frames with `sharpness < 0.02` or `brightness < 10 / > 250` skip face/YOLO/saliency entirely.
- **One decode pass** for scoring; one **Full re-read seek** at save time (sorted sequential). If the seek lands >2 frames off, it rewinds and re-disambiguates, finally jumping to exact frame index.
- **Careful around config**: `sharpness` normalization and dedup thresholds dominate output character. Raise `sample_ratio` for long videos.

Single-chunk speed on CPU: web-ish ~ tens of frames/s including optical flow; YOLO batch speeds this meaningfully.

---

## Extras, Manual & Gotchas

- **Tesseract** is only enabled when `--ocr` is passed; binary auto-detected via default install path (`C:\Program Files\Tesseract-OCR\tesseract.exe`) or `shutil.which`.
- **YOLO weights** must exist at `yolov8n.pt` (or auto-downloaded by ultralytics on first run with the `yolo` extra).
- **`cv2.setNumThreads(0)`** is not used in the refactor — OpenMP deadlocks between cv2 and PyTorch are avoided by running torch metrics sequentially in the main thread while cv2 face work stays on threads.
- **`hist_correl_threshold`** remains `1.01` by default — the histogram-dedup path is intentionally off (nice overlap with `mark_duplicates_with_histogram` if you want it).
- **Blur/OCR/spam filters** are disabled unless `--ocr`/config `use_ocr_filter=true`.

---

## Testing

```bash
pip install -e ".[dev]"
pytest tests/ -v                       # full suite
pytest tests/test_scoring.py -v        # scoring math incl. penalty paths
pytest tests/test_dedup.py -v          # fingerprint layouts
```

Tests cover extraction streaming, dedup fingerprint correctness (+ histogram), scoring weights/face-gate/soft-penalties, face-analysis method dispatch, and an end-to-end pipeline integration with a synthetic generated video (no real assets required).

---

## Roadmap

- Async backpressure loop instead of chunks (via `asyncio`)
- Capped LRU frame cache to avoid re-read seeks
- VRAM-aware batch scaling + automatic YOLO micro-batch sizing
- Pluggable `MetricProvider` registry for custom scoring dimensions
- Energy/fps watermark submission for tier ordering