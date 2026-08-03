# Junglans AI Notes — Connection App

A full-stack **AI-powered note-taking application** that turns plain notes into an interactive **knowledge graph**. Write notes, sign in securely, and watch an on-device AI (Ollama) extract entities and relationships from your text to visualize your personal knowledge network.

> Also known internally as *"Junglans Notes"* / *ConnectionApp*.

![Stack](https://img.shields.io/badge/Frontend-React%20Native%20(Expo)-0A1F44)
![Stack](https://img.shields.io/badge/Backend-Flask-white)
![Stack](https://img.shields.io/badge/Database-MongoDB-00C6D1)
![Stack](https://img.shields.io/badge/AI-Ollama%20(Mistral)-4DA3FF)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Backend Setup (Flask + MongoDB + Ollama)](#backend-setup-flask--mongodb--ollama)
- [Frontend Setup (Expo / React Native)](#frontend-setup-expo--react-native)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [API Base URL](#api-base-url)
- [API Reference](#api-reference)
- [How the AI Knowledge Graph Works](#how-the-ai-knowledge-graph-works)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)

---

## Overview

**Junglans Notes** is a mobile app (plus web) for capturing and organizing notes, with a twist: it uses a local **Large Language Model (LLM)** via [Ollama](https://ollama.com) to automatically:

1. Read all of your notes.
2. Extract the key **entities (nodes)** — people, projects, organizations, locations, concepts, technologies.
3. Extract the **relationships (edges)** between them.
4. Render everything as an interactive, zoomable **knowledge graph** inside the app.

The result is a dynamic "second brain" where the connections between your ideas are surfaced automatically, without any manual tagging or linking.

---

## Features

**Authentication**
- User registration & login with **bcrypt-hashed passwords**
- **JWT-based sessions** (30-day expiry) protected by middleware
- Secure token storage via `expo-secure-store` (native) / `localStorage` (web)

**Notes**
- Full CRUD: create, read, update, delete
- Title, content, and tag support
- Notes automatically list newest-first

**AI Knowledge Graph**
- Background graph generation using **Ollama** (`mistral` model, JSON mode)
- Node **groups** (Person / Project / Organization / Location / Concept / Technology)
- Per-node **importance** score and summary
- Entities linked back to the **source note** they came from
- Strict validation of edges (only existing nodes are connected)
- Custom "glass/cyan glow" holographic visualization via **vis.js**
- On-demand regeneration endpoint

**UI/UX**
- "Junglans AI BlueFusion" design system (deep tech blue `#0A1F44`, cyan `#00C6D1`)
- Floating "glass dock" bottom tab bar
- Branded splash screen
- Animated slide transitions

---

## Tech Stack

| Layer        | Technology                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **Frontend** | Expo SDK 54, React Native 0.81.5, React 19.1, React Navigation 7, TypeScript |
| **Graph UI** | vis.js (embedded via WebView), react-native-webview, @shopify/react-native-skia (unused), react-native-graph |
| **Backend***  | Python 3, Flask, Flask-CORS, Flask-PyMongo, Flask-Bcrypt, PyJWT            |
| **Database**  | MongoDB (MongoDB Atlas or local)                                            |
| **AI**        | Ollama (`mistral` model) running on `localhost:11434`                       |
| **Storage**   | `expo-secure-store` (native) / `localStorage` (web)                         |

> Note: `react-native-graph`, `react-native-svg`, and `@shopify/react-native-skia` are listed in `package.json` but the knowledge graph is currently rendered through a vis.js WebView.

---

## Repository Structure

```
Connection_app/
├── api_flask/                 # Flask backend
│   ├── app.py                 # Main backend (recommended)
│   ├── app_1.py               # Earlier variant of app.py
│   ├── app_2.py               # Earlier variant of app.py
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment config (MONGO_URI, SECRET_KEY)
│   └── cache_<user_id>.json   # Generated graph caches (auto-created)
│
├── NotesApp/                  # Expo / React Native frontend
│   ├── App.js                 # App entry (AuthProvider + RootNavigator)
│   ├── app.json               # Expo configuration ("Junglans Notes")
│   ├── package.json           # npm dependencies & scripts
│   ├── assets/                # Icons, splash screen images
│   ├── src/
│   │   ├── config/api.js      # API base URL config
│   │   ├── services/
│   │   │   ├── ApiService.js  # All REST calls (auth, notes, graph)
│   │   │   └── StorageService.js  # Secure token storage wrapper
│   │   ├── contexts/
│   │   │   └── AuthContext.js # Auth state + signIn/signOut/signUp
│   │   ├── navigation/
│   │   │   ├── RootNavigator.js  # Auth routing + splash gate
│   │   │   ├── AuthStack.js      # Login / Register
│   │   │   ├── MainTabs.js       # Floating tab bar (Notes/Graph/Profile)
│   │   │   └── NotesStack.js     # Notes list / detail / create
│   │   ├── screens/
│   │   │   ├── auth/LoginScreen.js
│   │   │   ├── auth/RegisterScreen.js
│   │   │   ├── common/SplashScreen.js
│   │   │   ├── notes/NotesListScreen.js
│   │   │   ├── notes/CreateNoteScreen.js
│   │   │   ├── notes/NoteDetailScreen.js
│   │   │   ├── graph/GraphScreen.js   # vis.js knowledge graph (WebView)
│   │   │   └── profile/ProfileScreen.js
│   │   ├── components/
│   │   │   ├── common/Button.js, Input.js, LoadingSpinner.js
│   │   │   └── notes/NoteCard.js
│   │   └── styles/
│   │       ├── theme.js        # Colors & constants
│   │       └── commonStyles.js # Shared StyleSheet objects
│   └── android/                # Pre-built Android project (gradle)
│
├── file structure             # Design notes for the project layout (see above)
└── requirements               # Legacy setup notes (older Express backend idea)
```

---

## Prerequisites

- **Node.js** >= 18 and `npm`
- **Python** >= 3.9 and `pip`
- **MongoDB** — a local instance (default `mongodb://localhost:27017/notes_db`) **or** a MongoDB Atlas connection string
- **Ollama** installed and running, with the `mistral` model pulled:
  ```bash
  ollama pull mistral
  ```
- A phone with the **Expo Go** app (or an Android/iOS emulator) for the frontend

---

## Backend Setup (Flask + MongoDB + Ollama)

1. Navigate to the backend folder:

   ```bash
   cd api_flask
   ```

2. (Recommended) Create and activate a virtual environment:

   ```bash
   python -m venv venv
   venv\Scripts\activate      # Windows
   source venv/bin/activate  # macOS/Linux
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure the `.env` file (see [Configuration](#environment-variables)).

5. Make sure MongoDB and Ollama are running, then start the server:

   ```bash
   python app.py
   ```

   The server binds to `http://<your-ip>:5000`. To accept connections from any device on your network, change the `host` argument in `app.py`:

   ```python
   app.run(debug=True, host='0.0.0.0', port=5000)
   ```

6. Verify it is up:

   ```bash
   curl http://localhost:5000/
   # {"status":"healthy","ollama_connected":true,...}
   ```

> The backend gracefully degrades: if Ollama isn't running or the graph prompt still, `ollama_connected` will be `false` and the graph features will return empty data **without crashing** the server.

---

## Frontend Setup (Expo / React Native)

1. Navigate into the app:

   ```bash
   cd NotesApp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. The app may require Expo packages at versions matching your SDK; the project ships with `package-lock.json` prepared:

   ```bash
   npx expo install --check
   ```

4. Configure the backend URL — **important!** Update the API base URL to point at your Flask server:

   - `src/config/api.js` → `export const API_BASE_URL = 'http://<YOUR_IP>:5000';`
   - `src/services/ApiService.js` → `const API_BASE_URL = 'http://<YOUR_IP>:5000';`

5. Start the dev server:

   ```bash
   npx expo start
   ```

6. Scan the QR code with the **Expo Go** app (make sure your phone and PC are on the same network).

### Available scripts

| Command             | Description                    |
|---------------------|--------------------------------|
| `npm start`         | Start the Expo dev server      |
| `npm run android`   | Build/run on Android           |
| `npm run ios`       | Build/run on iOS               |
| `npm run web`       | Run in the browser (`expo start --web`) |
| `npm run lint`      | Run ESLint (`expo lint`)       |

---

## Configuration

### Environment Variables

Backend — `api_flask/.env`:

| Variable      | Description                                                        | Example |
|---------------|--------------------------------------------------------------------|---------|
| `MONGO_URI`   | MongoDB connection string (local or Atlas)                        | `mongodb://localhost:27017/notes_db` |
| `SECRET_KEY`  | Secret used to sign & verify JWTs                                  | a long random string |

Values are loaded via `python-dotenv`. Sensible development fallbacks exist in the code (`localhost` DB, `dev_secret_key`), but **set real values in production**.

### API Base URL

The frontend hardcodes the backend address in **two** places; update both when your backend IP/host changes:

| File                              | Default value                    |
|-----------------------------------|-----------------------------------|
| `src/config/api.js`               | `http://<host-ip>:5000`           |
| `src/services/ApiService.js`      | `http://<host-ip>:5000`           |

> For physical devices, use your computer's LAN IP (e.g. `192.168.x.x`), and ensure the Android project allows cleartext traffic (`usesCleartextTraffic: true` is already set in `app.json`).

---

## API Reference

All endpoints except `/` are JSON. Protected routes require the header:

```
Authorization: Bearer <token>
```

| Method | Endpoint             | Auth  | Description                                             |
|--------|----------------------|-------|---------------------------------------------------------|
| `GET`  | `/`                  | No    | Health check (also reports Ollama connectivity)        |
| `POST` | `/register`          | No    | Register a new user (`{username, password}`)           |
| `POST` | `/login`             | No    | Login → returns `{token, username}`                    |
| `GET`  | `/notes`             | Yes   | List current user's notes (newest-first)               |
| `POST` | `/notes`             | Yes   | Create note (`{title, content, tags?}`)                |
| `GET`  | `/notes/<id>`        | Yes   | Get a single note                                      |
| `PUT`  | `/notes/<id>`        | Yes   | Update a note                                        |
| `DELETE` | `/notes/<id>`      | Yes   | Delete a note (204)                                   |
| `GET`  | `/graph`             | Yes   | Get the cached knowledge graph `{nodes, edges}`       |
| `POST` | `/graph/regenerate`  | Yes   | Force a background graph regeneration (202 + async)   |

**Response shapes**

- Successful login:
  ```json
  { "token": "<jwt>", "username": "<name>" }
  ```
- A note includes `_id`, `id` (string copy for the frontend), `title`, `content`, `tags`, `userId`, `createdAt`, `updatedAt`.
- Graph endpoint returns:
  ```json
  {
    "nodes": [ {"id", "label", "group", "summary", "importance", "sourceNoteId"} ],
    "edges": [ {"from", "to", "label"} ]
  }
  ```

---

## How the AI Knowledge Graph Works

1. **Trigger** — Every note create/update/delete launches a **background thread** (`regenerate_graph_cache_for_user`) that rebuilds the user's graph.
2. **Prompt** — All of the user's notes are formatted as `SOURCE_ID / TITLE / CONTENT` blocks and fed to the LLM with a strict, schema-like JSON prompt.
3. **Extraction** — Ollama (`mistral`) returns JSON with nodes and edges.
4. **Normalization** — IDs are lowercased and snake_cased; duplicate entities are merged; missing fields get defaults (`group: "Concept"`, `importance: 5`).
5. **Validation** — Edges are only kept if **both** endpoints exist in the final node set (no dangling links).
6. **Cache** — The cleaned graph is written to `api_flask/cache_<user_id>.json`.
7. **Rendering** — `GraphScreen` loads the cache in a `WebView` and draws a holographic-style force-directed graph with **vis.js** (node size = importance, colored groups, cyan glow).

If a cache doesn't exist yet, creation is kicked off in the background and an empty graph is returned immediately, then refresh the Graph tab again to see the rebuilt.

---

## Troubleshooting

| Problem | Likely cause & fix |
|---------|--------------------|
| App can't reach backend | Update `API_BASE_URL` in `src/config/api.js` and `src/services/ApiService.js` to your LAN IP; keep the phone/PC on the same network and run the backend with `host='0.0.0.0'`. |
| Repeated `401` errors | The stored token is missing/stale → logout and log in again; confirm the `Authorization: Bearer <token>` header is being sent (`console.log` is included in `ApiService.js`). |
| `ollama_connected: false` | Ensure Ollama runs (`ollama serve`) with the model installed (`ollama pull mistral`). |
| Graph is empty | The cache file for the user may not exist yet, or Ollama returned unparsable JSON. Force regeneration via `POST /graph/regenerate` and check the Flask logs. |
| The health route fails | MongoDB is not running — start MongoDB (or fix `MONGO_URI` in `.env`). |
| `npm run` errors | Run `npx expo install --fix` to align Expo package versions with SDK 54. |

---

## Security Notes

- Passwords are hashed with **bcrypt** before storage; never store plain text passwords.
- JWTs are signed with `SECRET_KEY` (store a strong, random value in production).
- `expo-secure-store` encrypts tokens on iOS/Android, but the **web fallback uses `localStorage`** — acceptable for development only.
- `.env` contains credentials → it is not meant to be committed. Keep secrets out of version control.
- Graph cache files are written to the backend filesystem; in multi-user deployments, ensure they are not served publicly.

---

## License

This is a private/development project. No license is currently specified — contact the maintainer for usage details.