# Junglans 🍀

A **fully offline** mobile game collection built with **React Native (Expo SDK 54)**, themed around a fresh jungle-green aesthetic (`#2E7D32`). Seven playable games, a shared visual identity, persistent high scores, and zero backend.

> Works in Expo Go, and can be built into standalone APK/IPA binaries via EAS Build (`com.manos.junglansgmae`).

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [The Games](#the-games)
  - [2048](#1-2048)
  - [Tetris](#2-tetris)
  - [Sudoku](#3-sudoku)
  - [Chess](#4-chess)
  - [Ludo](#5-ludo)
  - [Tic-Tac-Toe](#6-tic-tac-toe)
- [Shared Infrastructure](#shared-infrastructure)
  - [Theme](#theme)
  - [Navigation](#navigation)
  - [BubbleBackground](#bubblebackground)
  - [GameResultModal](#gameresultmodal)
  - [High Score Persistence](#high-score-persistence)
- [Running & Building](#running--building)
- [Architecture Deep Dive](#architecture-deep-dive)
- [Known Limitations & Ideas](#known-limitations--ideas)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Expo SDK 54](https://expo.dev) |
| Core | React 19.1.0 · React Native 0.81.5 |
| Navigation | `@react-navigation/native` + `@react-navigation/stack` |
| Persistence | `@react-native-async-storage/async-storage` |
| Chess engine | [`chess.js`](https://github.com/jhlywa/chess.js) v1.3.1 (the only game-engine library) |
| Graphics | `expo-linear-gradient` (gradients) · Ionicons / FontAwesome5 icons |
| Animations | built-in RN `Animated` (bubbles) + `PanResponder` (2048 swipes) |
| Gestures | `react-native-gesture-handler` (required by the stack navigator) |
| Build/CI | EAS Build (`eas.json`) — dev / preview / production profiles |

> Note: `react-native-reanimated` and `react-native-svg` are declared as dependencies but are **not actually used** in the game code — the UI drives on the built-in `Animated` API.

---

## Project Structure

```
junglansgmae/
├── App.js                      # Navigation container + stack of 8 screens
├── index.js                    # Expo entry (registerRootComponent)
├── app.json                    # Expo app config (name, icons, Android package, EAS project id)
├── eas.json                    # EAS build profiles (dev / preview / production APK)
├── babel.config.js             # babel-preset-expo + reanimated plugin
├── constants/
│   └── Theme.js                # Jungle-green color palette + shared styles
├── components/
│   ├── BubbleBackground.js     # Gradient background with looping animated bubbles
│   ├── GameCard.js             # Home-screen tile (icon + title)
│   └── GameResultModal.js      # Shared win/lose modal w/ score + high-score
├── screens/
│   ├── HomeScreen.js           # Grid launcher (2 columns)
│   ├── Game2048Screen.js       # Classic 2048 (swipe)
│   ├── TetrisScreen.js         # Stack-novice Tetris (buttons)
│   ├── SudokuScreen.js         # Sudoku w/ backtracking generator
│   ├── ChessScreen.js          # Chess vs random-move CPU or hot-seat
│   ├── LudoHome.js             # Ludo setup (players + mode selector)
│   ├── LudoScreen.js           # Full 4-player Ludo w/ CPU
│   └── TicTacToeScreen.js      # 3×3 hot-seat only
└── utils/
    ├── highScores.js           # AsyncStorage-backed high-score API
    └── sudoku.js               # Sudoku generator / solver
```

---

## The Games

### 1. 2048
`Game2048Screen.js` — 387 lines

- Classic **4×4** slide-and-merge.
- **Elegan-c trick:** only implements `moveLeft` + a 90°–CW `rotate(grid)`. Any swipe direction = rotate the board so the target direction becomes *left*, run `moveLeft`, rotate back. Direction→rotation map: `left=0, down=1, right=2, up=3`.
- Spawn: adds a random tile to an empty cell — `2` (90%) or `4` (10%).
- Win when any tile reaches **2048**; game-over only when the board is full **and** no adjacent equal pairs exist (horizontal + vertical scan).
- Input: **`PanResponder` swipe** detection (`|dx|` vs `|dy|`); a single tap is ignored.
- Score = sum of all merges → persisted via `setHighScore('2048', …)`.

### 2. Tetris
`TetrisScreen.js` — 366 lines

- Standard 10×20 Western Tetris, 7 shapes (I, O, T, L, J, S, Z) stored as matrices.
- **Rotation** = transpose + reverse rows (90° CW); **no wall-kick** — a rotation is rejected if it would collide.
- Gravity: `setInterval` at `1000 - min(score*10, 800)` ms → speeds up as you score (floor 200 ms).
- Line clear: `splice` full rows from the bottom + `unshift` empty rows; **+100 per line** (no Tetris-tier scoring).
- Input/output: on-screen **buttons** (← ↓ → ↻). No swipe, no hard drop, no hold/next/ghost preview.
- `useRef` is used for the active piece position, and the component bumps state afterward to force a render (a well-documented workaround).
- `paused` state exists in code but no pause button is wired to it.

### 3. Sudoku
`SudokuScreen.js` — 302 lines · `utils/sudoku.js` — 83 lines

- **Generator** (`generateSudoku(difficulty)`):
  1. Fill the three diagonal 3×3 boxes with random unique values.
  2. `solveSudoku` — backtracking DFS over the 81 cells, trying digits in **random order** (`isValid` checks row/col/box).
  3. Carve `difficulty` holes (here `30` blanks → 51 givens). *(No solution-uniqueness check — multi-solution puzzles are possible.)*
- In-game: tap a cell to select, tap a number button (1–9) to write, red **C** to clear. Locked cells (from `initialBoard`) ignore input.
- **Timer** counts up each second till first solve.
- Win = board fully filled — it does **not** verify that the numbers are legal (a correctness/UH wart worth knowing).
- Record: best **completion time** saved via `setLowScore('sudoku', timer)` only when faster.

### 4. Chess
`ChessScreen.js` — 402 lines

- All rules handled by **`chess.js`**; no UI logic duplicates it.
- Board rendered from `game.board()`, re-created via `new Chess(game.fen())` after every move.
- Tap-select → tap-destination move; **promotion is hard-coded to Queen** (`'q'`). Captures get a red overlay.
- **AI is a blind random mover** — `makeRandomMove` picks a uniformly random legal move (with a 500 ms fake-think delay). No minimax/evaluation. Good enough to train against, not to beat.
- **Undo/Redo**: `undoMove` uses `game.undo()` (+ an extra pop in CPU mode) into a `redoStack`; `redoMove` replays the first entry. CPU redo is intentionally imperfect.
- Detects checkmate / draw / stalemate → shared `GameResultModal`. No score or persistence.

### 5. Ludo
`LudoHome.js` (setup) + `LudoScreen.js` (532 lines — the biggest file)

- **Setup screen**: pick **2 / 3 / 4 players** and mode `vs CPU` or `Local`. Note: 2 players use the opposite (cross) colors (0-green & 2-blue), not adjacent ones.
- **Board**: a hand-defined **15×15 cell grid** with a 52-step `GLOBAL_PATH` (cross shape) + per-color 6-cell `HOME_PATHS` leading to the center `{7,7}`. 8 hard-coded `SAFE_SPOTS` (the stars) block captures-beats.
- Piece encoding: `-1` = in base, `0..50` = on track, `51..56` = home column, `≥56` = finished.
- **Dice**: rolling a **6** grants another roll; a piece needs a 6 to leave the base. If no legal move exists, turn passes automatically.
- **Capture**: landing on an opponent’s track square (not a safe spot) sends it back to base — with a `"Cut!"` alert.
- **AI**: on the CPU turn, auto-roll then play the **first legal move** (greedy thumb, no strategy).

### 6. Tic-Tac-Toe
`TicTacToeScreen.js` — 200 lines

- Clean 3×3 hot-seat PvP: `board` (9 `null`/'X'/'O'), `isXNext`, eight hard-coded winning lines (`calculateWinner`).
- Draw detection: no winner + board full. Both open the result modal.
- No CPU mode, no score, no persistence.

---

## Shared Infrastructure

### Theme
`constants/Theme.js` exposes a `Colors` palette (`primary #2E7D32`, `primaryDark #1B5E20`, `light #E8F5E9`, `accent #66BB6A`, …) and a few `Styles` (shadow, title, container) re-used by every screen so the whole app stays on-brand.

### Navigation
`App.js` registers a `Stack.Navigator` with 8 screens, heading-shown false (each screen draws its own header/back button for a fully custom look) with a white background and primary-tinted headers.

### BubbleBackground
`BubbleBackground.js` renders a `LinearGradient` scroll and 15 random green bubbles that drift continuously upward via `Animated.timing` (`useNativeDriver: true`, infinite loop). All screens are wrapped in it for a consistent jungle vibe.

### GameResultModal
`GameResultModal.js` — a shared transparent `Modal` (fade) used by 2048, Tetris, Sudoku, Chess, Ludo, and Tic-Tac-Tac. Renders: trophy/medal/frown icon, title ("Victory!"/"Game Over"), optional `NEW HIGH SCORE!` gold badge, score + high-score rows, **Play Again** (gradient) + **Exit to Home** buttons.

### High Score Persistence
`utils/highScores.js` wraps `AsyncStorage`:
- Keys: `@highscore_2048`, `@highscore_tetris`, `@highscore_sudoku`.
- `getHighScore(game)` /  `setHighScore(game, score)` (only saves if *higher*) / `setLowScore(game, score)` (only if *lower* — used by Sudoku’s best time) / `getAllHighScores()` / `resetHighScore()` / `resetAllHighScores()`.
- On-crash-safe: stored as strings, parsed with `parseInt`, invalid → 0.

---

## Running & Building

```bash
# Install
npm install

# Run in Expo Go / dev
npm start          # or: npx expo start
npm run android    # or: --ios / --web

# Release build (APK production profile)
eas build --platform android --profile production

# Submit to stores
eas submit --platform android --profile production
```

The build profiles live in `eas.json` (`development`, `preview`, `production`=Android APK).

---

## Architecture Deep Dive

**Two big patterns worth noting if you extend this:** the rotate-then-moveLeft abstraction for 2048 and the `chess.js` delegation in Chess — everything else is hand-rolled and self-contained per screen.

**Cross-cutting design decisions:**
1. **No global state.** No Redux / Context / MobX. Functional components + `useState`/`useEffect`/`useRef` only. The only cross-screen data flow is React Navigation `route.params` (e.g. Ludo settings).
2. **Touch:** 2048 uses `PanResponder` swipes; every other game is plain `TouchableOpacity` taps.
3. **AI is deliberately light:** Chess = random legal move; Ludo CPU = first legal move; everything else is single-player or hot-seat.
4. **Persistence is minimal** (3 high-score keys), read lazily on mount, written on game-over.

---

## Known Limitations & Ideas

- **Sudoku** generates multi-solution puzzles; completion doesn't validate legality.
- **Chess AI** is random and promotion is always Queen; castling/promotion prompts don't exist.
- **Tetris** has no hard drop, hold piece, next-piece preview, wall-kicks, or pause wiring.
- **Ludo** captures rely on hard-coded safe indices — if the board layout changes, path/`SAFE_SPOTS`/`startIndices` must be kept in sync.
- **reanimated** / **svg** deps are unused — safe to remove or a natural extension point (e.g. animated tiles or SUI-driven particle effects).
- Future ideas: per-game stats, a shared “achievements” screen, sound effects, themes, and an actual (minimax) Chess difficulty selector.

---

## License

Private project — resources name **junglansgmae** (project id `466ab7bc-29d9-44c5-9746-cddfc126b143`).

> "Junglans — Offline Gaming" 🌿