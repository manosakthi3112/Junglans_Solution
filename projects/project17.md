# Stock Video Generator — Deep Dive README

An end-to-end AI pipeline that fuses **alternative data (news + social sentiment)**, **technical indicators**, **macro context**, and **fundamentals** to predict stock direction across **three forecast horizons** (1 day / 5 days / 21 days), converts the output into actionable **BUY / SELL / HOLD signals** with risk-managed position sizing, and finally renders **cinematic animated report videos** in both landscape (16:9) and vertical Shorts (9:16) formats.

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                  │
│  StockTwits  NewsAPI  AlphaVantage  yfinance  Finnhub  FRED  Earnings   │
│      └─> TextCleaner (dedup / spam)      └─> OHLCV + returns            │
└──────────────────────────────┬───────────────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                              NLP LAYER                                   │
│  FinBERT (ProsusAI/finbert)  →  sentiment probs [pos, neg, neu]          │
│  spaCy NER → ticker linking          │                                  │
│  Event classifier (earnings/M&A/macro) → multiplier                     │
│  Weighted aggregation per (ticker, date)  → sentiment velocity/spike    │
└──────────────────────────────┬───────────────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           FEATURE LAYER                                  │
│  Technical: RSI, MACD, Bollinger, ATR, OBV, EMA cross, momentum,        │
│             volume-z, realized vol, stoch, Williams %R, VWAP dev,        │
│             autocorr, intraday range, gap, calendar (sin/cos)            │
│  Macro:  index returns/regime, VIX, rates, gold, FX, CPI, Fed, t10y2y  │
│  Context: earnings proximity, static fundamentals (P/E, mcap, ...)       │
│  Target: rolling quantile (33/66) → {-1, 0, +1} per horizon             │
│  → Sequences via FeatureBuilder.to_sequences(lookback=40)                │
└──────────────────────────────┬───────────────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                              MODEL LAYER                                 │
│  HybridStockModel  =  BiLSTM temporal branch                            │
│                   +  Transformer sentiment branch                        │
│                   +  Cross-Modal Attention Fusion                        │
│                   → 3-class head [Down, Flat, Up]                        │
│  PooledHybridModel (optional) = same + learnable ticker embedding        │
│  Training: class weights · label smoothing · mixup · cosine restarts     │
│  Inference: 3-model ensemble · TTA · temperature sharpening              │
└──────────────────────────────┬───────────────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                            SIGNAL LAYER                                  │
│  Confidence gate → direction → ATR SL/TP → R:R check → Kelly sizing     │
│  Sector concentration cap → BUY / SELL / HOLD + entry plan               │
└──────────────────────────────┬───────────────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         OUTPUT LAYER (inference.py)                      │
│  Console multi-horizon report · CSV · structured JSON                    │
│  SignalVideoRenderer → 16:9 MP4 + 9:16 Shorts MP4 (+ optional TTS)       │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Table of Contents

- [Repository Layout](#repository-layout)
- [Why this design](#why-this-design)
- [Data ingestion — `data_ingest/ingestion.py`](#data-ingestion)
- [NLP & sentiment — `data_ingest/nlp_pipeline.py`](#nlp--sentiment)
- [Feature engineering — `utils/feature_engineering.py`](#feature-engineering)
- [Model architecture — `models/hybrid_model.py`](#model-architecture)
- [Pooled cross-ticker training — `models/pooled_model.py`](#pooled-cross-ticker-training)
- [Signal & risk engine — `signals/generator.py`](#signal--risk-engine)
- [Walk-forward backtesting — `backtest/engine.py`](#walk-forward-backtesting)
- [Video renderer — `utils/video_renderer.py`](#video-renderer)
- [CLI usage](#cli-usage)
- [Configuration & environment](#configuration--environment)
- [Known limitations & sharp edges](#known-limitations--sharp-edges)

---

## Repository Layout

```text
STOCK_VIDEO_GENERATOR/
├── inference.py                 # Main engine: train / predict / evaluate
├── main.py                      # Simpler legacy orchestrator (live / backtest)
├── requirements.txt
├── .env / .env.template         # Optional API keys (none required)
├── data_ingest/
│   ├── ingestion.py             # Text + price + macro + fundamentals fetch
│   └── nlp_pipeline.py          # FinBERT scoring, event detection, aggregation
├── models/
│   ├── hybrid_model.py          # Per-ticker BiLSTM+Transformer model & trainer
│   └── pooled_model.py          # Cross-ticker pooled model with ticker embeddings
├── signals/
│   └── generator.py             # Probabilities → trading signals with risk rules
├── backtest/
│   └── engine.py                # Walk-forward backtesting with metrics
├── utils/
│   ├── feature_engineering.py   # Unified feature matrix + sequence builder
│   └── video_renderer.py        # Cinematic 16:9 / 9:16 video rendering
├── checkpoints/                 # Saved PyTorch model weights (per ticker/horizon)
└── YYYY-MM-DD/                  # Timestamped run outputs (CSV, JSON, videos)
```

> ⚠️ One commit history (`cd1ff1a9 "firsy"`); this whole pipeline has been evolving
> alongside research — treat the code as actively-developed, not "final".

---

## Why this design

The core hypothesis: **price direction is driven by a combination of technical
microstructure, narrative/sentiment shift, and macro regime.** Models that look at
only one modality miss signals. The architecture intentionally:

1. **Splits modalities into dedicated branches** — a BiLSTM on the full technical
   sequence and a Transformer over the per-day sentiment sequence — then **lets
   cross-modal attention decide when news matters most** (`CrossModalFusion`).
2. **Predicts three horizons from one feature table** (`target`, `target_5d`,
   `target_21d`), so the same input features answer short- and medium-term questions.
3. **Uses self-labeled classes** — instead of hard ±X% thresholds, each horizon's
   forward return is binned using **rolling 33/66 quantiles** over 252 days. That
   produces ~balanced down/flat/up classes that adapt to each ticker's volatility
   regime.
4. **Never looks ahead** — normalization is fit on train only, sequences are built
   causally, and the backtester strictly trains on the past before testing on the
   future.

---

## Data Ingestion — `data_ingest/ingestion.py`

Everything converges on a single `TextRecord` dataclass, so score weights and the
NLP layer treat all sources identically:

```python
@dataclass
class TextRecord:
    text: str
    source: str            # "stocktwits" | "news"
    ticker: Optional[str]
    timestamp: datetime
    score: int = 0         # engagement proxy (likes/upvotes)
    url: str = ""
    extra: dict = field(default_factory=dict)
```

| Ingester | Source | Needs key? | Notes |
|---|---|---|---|
| `StockTwitsIngester` | StockTwits REST | No (optional token) | `fetch()` per ticker + `fetch_trending()` for surprise movers; falls back to yfinance news on 403/CLOUD |
| `NewsIngester` | AlphaVantage → NewsAPI → yfinance | No (there are 3 fallback sources) | Each ticker is searched in order until ≥ 10 records gathered; yfinance is the always-free final fallback |
| `FinnhubIngester` | Finnhub company-news | Optional `FINNHUB_KEY` | Extra structured news with per-article sentiment field |
| `PriceIngester` | yfinance OHLCV | No | Adds `returns`, `log_returns`, `ticker` column; handles MultiIndex columns; drops exchange TZ; retries `max` → `10y` → `5y` if empty |
| `MacroIngester` | yfinance indices + FRED | Optional `FRED_API_KEY` | Builds market/macro context (see below) |
| `EarningsCalendar` | yfinance `get_earnings_dates` | No | Past + upcoming earnings dates for the ticker |
| `FundamentalsIngester` | yfinance `.info` | No | Static snapshot ratios, logged: `log_mcap, pe_ratio, pb_ratio, div_yield, rev_growth, gross_margin` |

**Market indices** (`MARKET_INDICES`): US → S&P 500, VIX, 10Y yield, gold, USD/INR.
India → Nifty, Sensex, India VIX, gold, USD/INR.
**FRED series** (`FRED_SERIES`): CPI (YoY, 12-month % Δ), Fed Funds, unemployment,
10Y–2Y spread.

`TextCleaner.clean()` deduplicates by a hash of the first 100 chars, strips
spammy phrases (`"click here"`, `"pump incoming"`, …), and drops records with
< 5 words.

`get_source_weight()` rewards credible outlets (Reuters/Bloomberg ×1.2, ET ×1.0,
MoneyControl ×0.9) and influential StockTwits users (followers > 10k → ×1.15,
> 1k → ×1.05, native sentiment bonus ×1.2).

---

## NLP & Sentiment (`data_ingest/nlp_pipeline.py`)

1. **Sentiment** — `FinBERTScorer` loads `ProsusAI/finbert`, batches texts at
   `BATCH_SIZE=16`, `MAX_LEN=512`, converting logits to softmax probs
   `[positive, negative, neutral]`.
2. **Weighting** — each record's weighted score is `(pos − neg) × source_weight
   × event_multiplier`.
3. **Event detection** — regex-based `classify_event()` tags one or more of
   `earnings_beat`, `earnings_miss`, `merger_acq`, `product_launch`,
   `regulatory`, `macro_fed`, `geopolitical`, `insider_trading`, `dividend`,
   `guidance` (defaults to `"general"`). `EVENT_SENTIMENT_MULTIPLIERS` amplify
   (e.g. earnings_miss × −1.3) or dampen.
4. **Entity linking** — spaCy `en_core_web_sm` NER finds ORG/PRODUCT entities
   and maps them through `COMPANY_TICKER_MAP` to tickers (also catches `$TICKER`
   mentions). Used as the fallback ticker when a record has none.
5. **Daily aggregation** (`aggregate_sentiment`) → DataFrame indexed
   `(ticker, date)` with:

| Feature | Meaning |
|---|---|
| `weighted_sentiment` | Weighted (pos − neg) average ∈ [−1, 1] |
| `mention_count` / `mention_spike` | Volume of mentions + z-score surge |
| `positive_ratio` / `negative_ratio` / `neutral_ratio` | FinBERT probs averaged |
| `sentiment_velocity` | day-over-day change of weighted sentiment |
| `has_earnings` / `has_macro` / `has_regulatory` | Boolean event flags |

---

## Feature Engineering (`utils/feature_engineering.py`)

`FeatureBuilder.build()` produces one row per trading day. Feature groups:

**Technical** (hand-rolled equivalents so TA-Lib is *not* required):
`rsi`, `macd`, `macd_sig`, `macd_hist`, `atr`, `atr_pct`, `obv_zscore`,
`bb_width`, `bb_pct_b`, `cross_9_21`, `cross_21_50`, `above_200`,
`mom_5d/10d/21d/63d`, `vol_zscore`, `realvol`, `price_pos`, `stoch_k`,
`stoch_d`, `williams_r`, `vwap_dev`, `ret_autocorr`, `range_ratio`, `gap`.

**Calendar**: `dow_sin`, `dow_cos`, `month_sin`, `month_cos`.

**Market/regime** (only when `market_df` present): `market_ret_1d/5d/21d`
(from Nifty or S&P 500), `market_regime` (`index > 200-SMA`), `vix_level`,
`vix_chg`, `us10y_chg`, `gold_ret`, `usdinr_ret`, `cpi_yoy`, `fed_rate`,
`unrate`, `t10y2y`. Missing → all zeros so train/serve shapes always match.

**Earnings proximity:** `days_to_earnings`, `has_earnings_soon (≤5d)`,
`post_earnings (≤3d after)`.

**Fundamentals (static per ticker):** `log_mcap`, `pe_ratio`, `pb_ratio`,
`div_yield`, `rev_growth`, `gross_margin`.

**Sentiment merge:** the 9 columns above, forward-filled onto trading days.

**Targets** — for each horizon *h*:
`raw = close.shift(-h) / close − 1`, then binned against *rolling 252-day*
33/66 quantiles:
- `raw > q_66h` → **1 (Up)**
- `raw < q_33h` → **−1 (Down)**
- otherwise → **0 (Flat)**

Dropped columns (removed before the model): raw OHLC, BB bands, EMA levels,
OBV level, `ticker`, `dividends`, `stocks splits`.

```python
X, y = builder.to_sequences(df, target_col="target_5d")
# → X (n, lookback=40, n_features), y (n,) ∈ {-1,0,1}
```

`SequenceNormalizer` does per-feature z-scoring, fit **only on training** to avoid
data leakage; zero-variance columns (constant fundamentals) are mapped to 0.

---

## Model Architecture (`models/hybrid_model.py`)

### HybridStockModel

```
x: (B, T=40, F)
├── BiLSTMBranch(x)          → (B, 128)   # 2×64, additive attention over T
├── TransformerBranch(x_sent) → (B, 32)    # 2-layer, d=32, 4 heads, avg-pool on sentiment slice
└── CrossModalFusion(tmp, snt) → (B, 128)  # cross-attention + residual + LayerNorm
     └── classifier: 128→64→32→3 (GELU, BatchNorm, Dropout)
```

- The **temporal branch** sees all features; the **sentiment branch** sees only
  the sentiment columns (`SENTIMENT_FEATURE_NAMES`), positional-encoded and
  transformer-attended over the 40-day window.
- `CrossModalFusion` uses cross attention (query from temporal, key/value from
  sentiment), residual skip, `LayerNorm` — the mechanism that lets the net
  learn "news was important on date _d_".

### Training (`ModelTrainer`)

| Knob | Value | Why |
|---|---|---|
| Optimizer | AdamW `lr=5e-4`, wd=1e-4 | Standard robust choice |
| Scheduler | CosineAnnealingWarmRestarts (`T_0=20, T_mult=2`) | Periodic LR resets |
| Loss | Label-smoothed `CrossEntropyLoss(0.1)` + **class weights** | discourages overconfident noise, rebalances rare up/down |
| Mixup | α=0.2, off for last 20% of epochs | regularize + fine-tune period |
| Clip | grad norm 1.0 | stability |
| Early stop | patience on validation loss (default 25) | king saves best state |
| Checkpoint | `torch.save(state_dict)` path per (ticker, horizon) | |

### Prediction helpers

- `predict_proba` — batched softmax `[P_down, P_flat, P_up]`.
- `predict_proba_tta` — applies **test-time augmentation**: averages softmax
  over 4 extra noisy views (`N(0, 0.02)`) + the clean input, `repeats=5`.
  Reduces single-sample prediction variance.

---

## Pooled Cross-Ticker Training (`models/pooled_model.py`)

Per-ticker models each see only ~1–4k samples; the pooled variant trains **one
model per market** across all its tickers:

- A learnable **ticker embedding** (`n_tickers × 16`) is appended to the temporal
  branch input, letting weights be shared while each name keeps its own base-rate
  offset.
- Sample count multiplies ~10× (market × all names) → better generalization.
- The checkpoint suite keeps a `pooled_{MARKET}_tickers.json` mapping so
  prediction can look up the embedding index.
- `PooledModelTrainer` re-implements mixup to blend tensor pairs using both the
  mixed-feature view under **each participant's ticker id** (correct for a shared
  weight).

Requires ≥ 2 tickers in a market, else it skips back to per-ticker training and
falls back gracefully at prediction time.

---

## Signal & Risk Engine (`signals/generator.py`)

`SignalGenerator.generate` turns `[P_down, P_flat, P_up]` into an actionable plan:

1. **Confidence gate** — `max(P_up, P_down) ≥ CONFIDENCE_THRESHOLD (0.50)` and
   spread ≥ `FLAT_ZONE_MARGIN (0.03)`; else → **HOLD**.
2. **Direction** — `BUY` if `P_up > P_down` else `SELL`.
3. **ATR-based SL/TP** — `SL = entry ∓ ATR_SL_MULTIPLIER*atr`,
   `TP = entry ∓ ATR_TP_MULTIPLIER*atr` (long/short mirrored).
4. **R:R sanity** — skip if `tp_dist/sl_dist < MIN_RISK_REWARD (1.5)`.
5. **Kelly sizing** — fractional Kelly (`KELLY_FRACTION = 0.25`),
   `f* = (p·b − q)/b` with `b = avg_win/avg_loss`, capped at
   `MAX_POSITION_PCT = 15%`. `earnings_beat/guidance/merger_acq` events boost ×1.2.
6. **Portfolio rules** — `generate_portfolio()` enforces a
   `MAX_SECTOR_PCT (35%)` cap and existing-position awareness, downgrading any
   signal that would breach the cap.

`RiskConfig` also exposes `MAX_DRAWDOWN_LIMIT (20%)` (halt switch, not yet
wired into execution) and `hist_win_rate` (0.55 default for sizing bias).

---

## Walk-Forward Backtesting (`backtest/engine.py`)

`WalkForwardBacktester(n_train=252, n_test=63)`:

```text
|───── TRAIN (1y) ─────|── TEST (1Q) ──|
                       |──── TRAIN+63d ──────|── TEST ──|   (roll forward 63d)
```

- **Zero lookahead**: model factory is called per window on train-only data
  (in `main.py` this is a `GradientBoostingClassifier` surrogate for speed).
- Tracks per-window and aggregate metrics: total return, Sharpe (annualized),
  max drawdown, Calmar, win rate, profit factor, avg win/loss.
- **Trade simulation** exits on intraday SL/TP hits (with slippage), enters long
  on BUY signals only, applies commission, and marks `closed_tp`, `closed_sl`,
  or `open` statuses.
- `inference.py` has a separate, honestly-reported **walk-forward accuracy
  evaluation** (`--mode evaluate`) that reports OOS accuracy + up/down precision
  directly to `evaluation_report.csv`.

---

## Video Renderer (`utils/video_renderer.py`)

`SignalVideoRenderer` writes two MP4 files per ticker/horizon:

| Output | Format | Resolution |
|---|---|---|
| `…_{slug}.mp4` | 16:9 landscape (YouTube) | 1280×720 |
| `…_{slug}_shorts.mp4` | 9:16 vertical (Shorts/Reels) | 720×1280 |

- 30 fps, into/outro cards + main chart segment with eased (smoothstep)
  motion → draw-on line, pulsing current-price marker, star markers for
  1d/5d/21d target prices, dashed TP/SL guides, gradient background, watermark
  `SIGNAL•AI ▸ GENERATED BY AI`.
- Probabilities are shown as segmented up/flat/down bars per card.
- `ffmpeg` (bundled in `ffmpeg/bin`) transcodes `mp4v` → `libx264`/`faststart`;
  falls back to the raw codec if ffmpeg is missing.
- Optional `--voiceover`: edge-tts narration (free) mixed in via ffmpeg
  (`en-US-GuyNeural`, rate +5%).

---

## CLI Usage

The main entry point (and the current recommended tool) is **`inference.py`**:

```bash
# Train models (per-ticker ensemble, all horizons)
python inference.py --mode train --tickers RELIANCE.NS INFY.NS --price-period max

# Train shared pooled models per market
python inference.py --mode train --tickers RELIANCE.NS INFY.NS HDFCBANK.NS --pooled

# Run predictions (auto-trains/re-trains stale checkpoints ≥ 7 days old)
python inference.py --mode predict --tickers INFY.NS RELIANCE.NS PNB.NS

# Force re-train + fresh predictions + voiceover videos
python inference.py --mode predict --tickers AAPL TSLA --retrain --voiceover

# Honest OOS accuracy via walk-forward
python inference.py --mode evaluate --tickers TCS.NS INFY.NS
```

`main.py` is a lighter legacy orchestrator:

```bash
python main.py --tickers TCS.NS INFY.NS RELIANCE.NS --mode backtest
python main.py --tickers AAPL TSLA NVDA --mode live
```

### Cold start behavior

At `predict` time the engine decides per (ticker, horizon):

- checkpoints exist AND < `AUTO_RETRAIN_DAYS` (7) → use them;
- older than 7 days → **auto-retrain the ensemble**;
- none → **train an ensemble of 3** (`_e0/_e1/_e2`, seeds `42 + i*137`);
- predictions average softmax across all found checkpoints, **temperature
  sharpened** `T = 0.55` (`probs^(1/0.55) / sum`).

A **pooled** checkpoint takes priority for a horizon; per-ticker ensembles fill
in the gaps.

### Report output (predict mode)

- `YYYY-MM-DD/inference_YYYYMMDD_HHMM.csv` — flat, per-horizon columns
  (`action`, `confidence`, `prob_up/flat/down`, `stop_loss`, `take_profit`,
  `predicted_price`, `position_pct`, `reason`).
- `YYYY-MM-DD/inference_YYYYMMDD_HHMM.json` — nested machine-readable structure.
- Per-ticker videos under `YYYY-MM-DD/{TICKER_SLUG}/`.

### Estimated price

`predicted_price = current_price + (P_up − P_down) × vol_mult_h × ATR`,
with `vol_mult = {1d: 1.0, 5d: 2.2, 21d: 4.5}` and per-horizon SL/TP
multipliers `{1d: (2.0, 3.0), 5d: (3.0, 4.5), 21d: (5.0, 7.5)}`.

---

## Configuration & Environment

No keys are required — everything runs on free endpoints.

| Variable | Optional? | Purpose |
|---|---|---|
| `ALPHA_VANTAGE_KEY` | Yes | Premium news+sentiment feed (25 req/day) |
| `FRED_API_KEY` | Yes | FRED macro series (CPI, Fed, unemployment, 10Y-2Y) |
| `STOCKTWITS_TOKEN` | Yes | Higher StockTwits rate limits |
| `NEWSAPI_KEY` | Yes | `newsapi-python` fallback source |
| `FINNHUB_KEY` | Yes | Extra structured news + sentiment |

Setup:

```bash
python -m venv .jung && .jung\Scripts\pip install -r requirements.txt
python -m spacy download en_core_web_sm
# optional voiceover
pip install edge-tts
cp .env.template .env    # only if you want the premium keys inside
```

---

## Known Limitations & Sharp Edges

- **Sentiment in `main.py` backtest mode is ignored** (`builder.build(price_df, None)`);
  `inference.py --mode evaluate` includes sentiment. An R&D gap: live signal
  contains today's news, backtest/train features don't — that asymmetry can
  produce overoptimistic live recall.
- The `main.py` backtest currently uses a **GradientBoostingClassifier surrogate**
  (flat features, `atr` hard-coded to 14), not the hybrid sequence model. The
  comment even notes it should be swapped to `FeatureBuilder.to_sequences` +
  `HybridStockModel` for production-grade backtests.
- `SequenceNormalizer` on prediction is fit on the **entire** feature history
  (primarily for the latest sequence), slightly differing from the
  *train-only-fit* discipline used in model fitting. For single latest sequences the
  difference is small, but it is a subtle form of leakage.
- **Ensemble temperature sharpening** uses a hard-coded `T=0.55`; this is
  calibration-dependent and ideally tuned per ticker/horizon.
- **Fixing `hist_win_rate`** — 0.55 is a placeholder; the backtester could feed
  true per-ticker win rates for a better Kelly. `MAX_DRAWDOWN_LIMIT` is defined
  but not enforced anywhere yet.
- Copy-paste `.env` placeholders ship real-looking keys (AlphaVantage, FRED) —
  if these are your own, don't commit them.

---

*Generated for the deep-dive reader. This is not financial advice — the model is
a research/automation experiment and its output should never be traded paper /
real money blindly.*