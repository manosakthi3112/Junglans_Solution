# Tamil Civil Engineering Auto Video Generator 🎬

An end-to-end automated pipeline that **writes, voices, animates, and uploads Tamil civil-engineering educational videos** every day — then gets human approval over Telegram before anything goes live.

The system pairs a production `Flask + Telegram` control panel (`app.py`) with several generations of Python video-generator engines (`m2.py`, `main.py`, `m1.py`, `civil*.py`) that convert a topic into a narrated, subtitled MP4 and a 1080×1920 Shorts version.

---

## How It Works (High Level)

```
topics.txt ──► pick next topic (never repeats)
        │
        ▼
Gemini / OpenRouter / HF ──► 5 Tamil sentences + 5 English image prompts
        │
        ▼
Pollinations / Pexels / Wikimedia / loremflickr ──► 1280×720 background per scene
        │
        ▼
Sarvam AI / edge-tts / Google TTS / gTTS ──► spoken Tamil audio per scene
        │
        ▼
MoviePy ──► Ken Burns zoom + animated subtitles + topic badge
        │        + progress bar + company logo + crossfade transitions
        ▼
FFmpeg mux ──► landscape MP4 (1280×720) + vertical Shorts (1080×1920)
        │
        ▼
app.py (Telegram bot) ──► human approval → resumable YouTube upload
```

---

## Project Layout

| Path | Role |
|---|---|
| `app.py` | **Production control panel.** Flask dashboard + Telegram bot + APScheduler (daily 08:00). Sends both videos for approval, handles edit/regenerate/approve. |
| `m2.py` | **Primary engine.** Gemini script, Pollinations/Pexels images, Sarvam Tamil TTS, MoviePy rendering, promo-video append, Shorts generation, YouTube upload. |
| `main.py` | Engine variant — OpenRouter free LLM roster with automatic rate-limit fallback, edge-tts/Google TTS, fancier end-card with animated subscribe ring. |
| `m1.py` | Earlier engine variant — Gemini + edge-tts + end-card (predecessor of `m2.py`). |
| `a2v.py` | Tiny helper — muxes a video + audio file with ffmpeg. |
| `civil.py`, `civil_1.py` | Square (720×720) Shorts generator — edge-tts voice + optional **D-ID talking avatar** composited onto branded slides. |
| `civil_2.py` | gTTS + HuggingFace **Stable Diffusion SDXL** backgrounds (older experiment). |
| `civil_3_dynamic.py` | Engine variant — HuggingFace **Mistral/Qwen** dynamic script + FLUX image generation. |
| `main/m2.py`, `main/app.py` | Working copies / backups of the production files. |
| `FINAL/` | Standalone GitHub-Actions version (runs `civil_3_dynamic.py` on a cron, uploads to YouTube). |
| `final_yt/` | Standalone Docker/Render deployable copy of the `app.py` + `m2.py` stack with own `Dockerfile`, `render.yaml`, and `requirements.txt`. |
| `generate_youtube_token.py` | Run once to produce `youtube_token.json` from `client_secrets.json` (OAuth for uploads). |
| `topics.txt` / `used_topics.json` | Topic pool + replay-tracking used topics. |
| `output/` | Generated files: raw muxed clips, `tamil_video.mp4`, `tamil_shorts.mp4`. |
| `tamil_civil_dynamic_output/`, `civil_engineering_videos/`, `FINAL/`, `final_yt/` | Output folders / deployed variants. |

---

## The Production Path (`m2.py`)

`generate_video_pipeline()` orchestrates the whole flow:

| Stage | % | What happens |
|---|---|---|
| Topic | 5% | `get_next_topic()` pulls next unused topic from `topics.txt`; runs out → `generate_ai_topic()` asks Gemini for fresh engineering topics. |
| Script | 10% | `generate_script()` asks Gemini (model fallback chain, retries on 429) for **exactly 5** Tamil sentences in a definition→manufacturing→mixing→application→benefits arc, plus an English image prompt per scene. Validated by `_is_valid_tamil()`; hardcoded fallback script if all models fail. |
| Scenes | 10–60% | `build_scene()` per sentence: background image → TTS audio → renders each frame with Ken Burns zoom, eased slide-up subtitles, topic badge, amber progress bar, and the top-right company logo. |
| Transitions | 70% | `assemble_with_transitions()` weaves fade / slide-left / slide-up / zoom-blur / wipe-right 0.1 s transitions between scenes. |
| BGM | — | Optional `bgm.mp3` ducked to 8% volume and looped to video length. |
| Mux | 80% | `write_and_mux()` writes libx264 frames (CRF 18) then muxes with the processed audio track. |
| Promo | — | If `promo.mp4` exists it is normalized, then appended after the main content via ffmpeg concat. |
| Shorts | 90% | `generate_shorts()` converts the landscape video to 1080×1920 with a blurred background fill. |
| Done | 100% | Returns paths + topic for upload or Telegram review. |

### Image fallback chain
1. Pollinations AI (free text-to-image, promptified)
2. Pexels API
3. Wikimedia Commons search
4. loremflickr
5. Themed procedural gradient (cement/brick/steel/water… palettes)

### Audio
- Primary: **Sarvam AI** Tamil TTS (`ta-IN`, voice `manisha`) → decoded, then FFmpeg post-processed (compressor, EQ, `loudnorm=-14 LUFS`).
- Fallback: 3-second silence so timing never breaks.

---

## The Control Plane (`app.py`)

A `Flask` dashboard on `:5000` + a Telegram bot + an APScheduler cron running at **08:00**.

**Telegram commands:**

| Command | Action |
|---|---|
| `/start` | Prints your Chat ID. |
| `/generate` | Gzip off one full generation in a background thread. |
| `/status` | Live progress bar of the running pipeline. |
| `/add_topic <x>` | Append a topic to `topics.txt`. |
| `/generate_topic` | Have Gemini invent new topics and append them. |
| `/description` | View the current pending description. |
| `/available_audio_quota` | Lists Sarvam voices (arya / maitreyi / manisha). |

**Inline buttons (approval flow):**
- **✅ Approve & Upload** → resumable uploads main video + Shorts to YouTube with auto-built descriptions.
- **📝 Edit Description** → bot enters "description capture mode"; next message overwrites it.
- **🔄 Regenerate** → discards the current video and pipelines a brand-new one.

---

## Run It Locally

> The scripts currently hardcode API keys and absolute Windows paths (e.g. `C:\Users\manos\Videos\AUTO_VIDEO\...`). Review and move secrets to environment variables before sharing / deploying.

```bash
# Core deps (see final_yt/requirements.txt for full list)
pip install flask apscheduler pyTelegramBotAPI requests numpy opencv-python-headless \
            Pillow moviepy==1.0.3 google-genai sarvamai \
            google-api-python-client google-auth-httplib2 google-auth-oauthlib

# ffmpeg must be reachable (m2.py sets mpconf.FFMPEG_BINARY)
# Pure pipeline run (generate + upload, no Telegram):
python m2.py

# Full control plane (Flask + Telegram + 8am scheduler):
python app.py
```

### First-time YouTube auth
```bash
# 1. Enable YouTube Data API v3 in Google Cloud Console.
# 2. Create OAuth desktop credentials, download as client_secrets.json.
python generate_youtube_token.py      # -> youtube_token.json
```

### Configuration knobs (`m2.py` / `main.py`)
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — bot identity + approval target.
- `GEMINI_API_KEY`, `PEXELS_API_KEY`, `SARVAM_API_KEY`, `YOUTUBE_TOKEN` — API credentials.
- `PROMO_VIDEO_PATH`, `BGM_PATH`, `COMPANY_LOGO_PATH` — branding assets.
- `TOPICS_FILE`, `USED_TOPICS_FILE` — topic schedule + replay tracking.
- `FFMPEG_PATH` — Windows-local ffmpeg binary.
- `speaker` in `m2.py` — Sarvam voice.

---

## Engines Side-by-Side

| Engine | Script LLM | TTS | Images | Note |
|---|---|---|---|---|
| `m2.py` | Gemini (free tier) | Sarvam AI | Pollinations→Pexels→Wikimedia→flickr | Production default |
| `main.py` | OpenRouter free model pool (~16 models, 429-aware) | Google Neural2→edge-tts→gTTS | Pexels→Wikimedia→flickr | Most resilient script gen |
| `m1.py` | Gemini | edge-tts | Pexels | Earlier version of m2 |
| `civil_3_dynamic.py` | HuggingFace Mistral/Qwen | (counts on HF chat) | FLUX.1-schnell | Used by `FINAL/` GitHub Actions variant |
| `civil.py` / `civil_1.py` | none (hardcoded scripts) | edge-tts | none (designed slides) | Shorts w/ optional D-ID avatar |

---

## Deployment Variants

- **`FINAL/`** — GitHub Actions workflow generates a video every day at 08:00 IST for free (2000 monthly minutes). Secrets: `HF_API_TOKEN`, `YOUTUBE_TOKEN`.
- **`final_yt/`** — Docker image (`python:3.10-slim` + ffmpeg) deployable on Render (`render.yaml`, free plan) running `app.py`; memory-tuned dependency installs; `mem_monitor.py` included.

---

## Security ⚠️

The repository contains **live API keys and OAuth tokens** both hardcoded in source (`m2.py`, `civil*.py`, `client_secrets.json`, `youtube_token.json`) that should be rotated and externalized into environment variables / secrets before going public.

---

## Roadmap Ideas

- Move all API keys to `.env` / env vars (see above).
- Support more LLMs and TTS voices behind a single provider abstraction.
- Add a web dashboard to preview/approve videos without Telegram.
- Test-suite + golden-frame QA for the rendering path.