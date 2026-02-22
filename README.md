<p align="center">
  <img src="docs/assets/void_tux_mascot.png" alt="Void Dual Tux Mascot" width="600">
</p>

<p align="center">
  <a href="README.md">English</a> | <a href="README_TR.md">Türkçe</a>
</p>

<h1 align="center">🛡️ System Hardening Protocol</h1>

<p align="center">
  <img src="https://img.shields.io/badge/version-9.0.0-00ff88?style=for-the-badge&labelColor=0a0a0a" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge&labelColor=0a0a0a" alt="License">
  <img src="https://img.shields.io/badge/zero-dependencies-ff4444?style=for-the-badge&labelColor=0a0a0a" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/offline-first-00ccff?style=for-the-badge&labelColor=0a0a0a" alt="Offline First">
  <img src="https://img.shields.io/badge/single-file-ffaa00?style=for-the-badge&labelColor=0a0a0a" alt="Single File">
</p>

<p align="center">
  <em>"Zero-dependency. Zero-leaks. Zero-weakness."</em><br>
  Operational Security (OPSEC) for your biological and mental capabilities.
</p>

---

## ⚡ What Is This?

**System Hardening Protocol** is a zero-dependency, offline-first personal command center that treats your body and mind as a high-value asset. It compiles into a **single HTML file** — no servers, no cloud, no data leaks. Everything runs locally in your browser.

This is **not** a fitness tracker. This is **not** a diet app. This is a **command center** for your biological existence.

### Why Use It?

- 🔒 **100% Private** — All data stays in your browser's localStorage. No accounts, no tracking, no telemetry.
- ⚡ **Instant** — Single HTML file, zero load time. Works offline.
- 🎯 **All-in-One** — Training, nutrition, progress analytics, anatomy visualization, and mental conditioning in one place.
- 🖥️ **Cyberpunk UI** — Military-grade dark interface with neon accents. Not your average wellness app.
- 🕵️ **Stealth Mode** — Press `Ctrl+Shift+H` to instantly disguise the app in public.

---

## 🖥️ Command Center

### 📊 Dashboard (Situation Room)
Real-time diagnostics of your current status — weight tracking, uptime streaks, daily caloric breakdown, and mission completion status.

<p align="center">
  <img src="docs/screenshots/dashboard_full_hd.png" alt="Dashboard" width="700">
</p>

### 🏋️ Training (Operations)
Full workout protocols with exercise databases, dynamic set management, volume tracking, and embedded video demonstrations.

<p align="center">
  <img src="docs/screenshots/training_full_hd.png" alt="Training" width="700">
</p>

### 🍽️ Nutrition (Logistics)
Advanced macro tracking with protein/carb/fat/water monitoring, meal logging, custom food creation, and smart daily fuel calculations.

<p align="center">
  <img src="docs/screenshots/nutrition_full_hd.png" alt="Nutrition" width="700">
</p>

### 📈 Progress (Intelligence)
Data analysis engine — weekly calorie summaries, workout volume trends, weight history graphs, and body measurement tracking.

<p align="center">
  <img src="docs/screenshots/progress_full_hd.png" alt="Progress" width="700">
</p>

### 🧬 Anatomy Lab (Diagnostics)
Interactive visual body map for targeting specific muscle groups. Click on any muscle to view exercises, status, and diagnostic data.

<p align="center">
  <img src="docs/screenshots/anatomy_interactive.png" alt="Anatomy Lab" width="700">
</p>

### 🧠 Mental Warfare (Psyops)
Psychological conditioning through 8 progressive phases, daily micro-actions, and perception management protocols.

<p align="center">
  <img src="docs/screenshots/mental_full_hd.png" alt="Mental Warfare" width="700">
</p>

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Single-file application structure |
| **Vanilla JavaScript (ES6+)** | Zero-framework, pure ES6+ logic. No external libraries |
| **CSS3** | Local stylesheets. Zero external dependencies |
| **localStorage** | Client-side data persistence |

### Architecture

```
State-Renderer-Actions Pattern

┌─────────┐     ┌───────────┐     ┌──────────┐
│  Store   │────▶│ Renderers │────▶│ Actions  │
│ (State)  │◀────│   (View)  │◀────│ (Logic)  │
└─────────┘     └───────────┘     └──────────┘
      │                                  │
      └──── localStorage ◀──────────────┘
```

**15 modular JS files** are concatenated in dependency order and injected into a single HTML template at build time. No bundler overhead. No virtual DOM. Pure performance.

---

## 🚀 Quick Start

### Download and Run (Simple)

1. **Download** the latest release from GitHub
2. **Extract** the folder anywhere
3. **Run one of these commands:**

#### Option 1: Python (macOS/Linux/Windows)
```bash
cd System-Hardening
python3 -m http.server 8000
```

#### Option 2: Node.js (if installed)
```bash
cd System-Hardening
node server.js
```

4. **Open browser**: `http://localhost:8000`

---

### Why HTTP Server?
Browser security prevents `file://` protocol from loading resources. Simple HTTP server fixes this.

### Why Not Require Build Tools?
- **Zero npm packages** — No supply chain risk
- **Pure Vanilla JavaScript** — Code never breaks from external updates
- **Ship as-is** — What you see in source is what you get
- **Terry Davis Philosophy** — Build only what you need

---

### Development (Optional)

To contribute or run the full test suite, switch to the **`workspace` branch**:

```bash
git checkout workspace
cd System-Hardening

# Run test suite
node tests/run-all.js

# Start dev server
node server.js
```

---

## 🕵️ Stealth Mode (OPSEC)

Press **`Ctrl + Shift + H`** to activate **Sanitize Mode**:
- Hides all sensitive metrics and personal data
- Changes branding to generic "Personal Tracker"
- Safe for use in public environments (office, library, etc.)

---

## 📁 Project Structure

```
System-Hardening/
├── .gitignore
├── AGENTS.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── index.html
├── server.js
├── docs/
│   ├── assets/
│   │   └── void_tux_mascot.png
│   └── screenshots/
│       ├── anatomy_interactive.png
│       ├── dashboard_full_hd.png
│       ├── mental_full_hd.png
│       ├── nutrition_full_hd.png
│       ├── progress_full_hd.png
│       └── training_full_hd.png
├── memory-bank/
│   ├── activeContext.md
│   ├── productContext.md
│   ├── projectbrief.md
│   ├── progress.md
│   ├── roadmap.md
│   ├── systemPatterns.md
│   └── techContext.md
└── src/
    ├── assets/
    │   ├── fonts/
    │   │   ├── fa-brands-400.woff2
    │   │   ├── fa-regular-400.woff2
    │   │   └── fa-solid-900.woff2
    │   └── icons/
    ├── css/
    │   └── main.css
    ├── js/
    │   ├── actions.js
    │   ├── app.js
    │   ├── components.js
    │   ├── stealth.js
    │   ├── store.js
    │   ├── ui.js
    │   ├── utils.js
    │   ├── video-player.js
    │   ├── components/
    │   │   ├── Card.js
    │   │   ├── MacroRing.js
    │   │   ├── MealCard.js
    │   │   ├── Modal.js
    │   │   ├── ProgressBar.js
    │   │   ├── SetRow.js
    │   │   ├── Toast.js
    │   │   └── index.js
    │   ├── config/
    │   │   ├── db.js
    │   │   ├── index.js
    │   │   ├── keys.js
    │   │   ├── targets.js
    │   │   ├── theme.js
    │   │   └── validation.js
    │   ├── core/
    │   │   ├── Container.js
    │   │   ├── EventBus.js
    │   │   └── index.js
    │   ├── db/
    │   │   ├── anatomy.js
    │   │   ├── exercises.js
    │   │   ├── foods.js
    │   │   ├── mental-phases.js
    │   │   └── weekly-plan.js
    │   ├── infrastructure/
    │   │   ├── LocalStorageAdapter.js
    │   │   ├── MemoryStorageAdapter.js
    │   │   ├── StorageAdapter.js
    │   │   └── index.js
    │   ├── locales/
    │   │   ├── en.json
    │   │   └── tr.json
    │   ├── performance/
    │   │   ├── CacheService.js
    │   │   ├── LazyLoader.js
    │   │   ├── Memoize.js
    │   │   ├── VirtualList.js
    │   │   └── index.js
    │   ├── renderers/
    │   │   └── dashboard.js
    │   ├── repositories/
    │   │   ├── BaseRepository.js
    │   │   ├── MealRepository.js
    │   │   ├── WeightRepository.js
    │   │   ├── WorkoutRepository.js
    │   │   └── index.js
    │   ├── services/
    │   │   ├── BackupService.js
    │   │   ├── ExerciseHistoryService.js
    │   │   ├── StatisticsService.js
    │   │   ├── StreakService.js
    │   │   ├── ValidationService.js
    │   │   ├── i18nService.js
    │   │   └── index.js
    │   ├── state/
    │   │   ├── StateManager.js
    │   │   ├── index.js
    │   │   ├── initialState.js
    │   │   ├── middleware.js
    │   │   └── reducers.js
    │   ├── vendors/
    │   │   ├── fontawesome-local.css
    │   │   ├── fontawesome.min.css
    │   │   └── tailwindcss.min.js
    │   └── views/
    │       ├── AnatomyView.js
    │       ├── DashboardView.js
    │       ├── MentalView.js
    │       ├── NutritionView.js
    │       ├── ProgressView.js
    │       ├── TrainingView.js
    │       └── index.js
    └── styles/
        ├── animations.css
        ├── base.css
        ├── components.css
        └── overrides.css
```

---

## 🗺️ Roadmap

- [ ] Accessibility (A11Y) improvements
- [ ] PWA support for mobile installation
- [ ] In-depth maintenance regarding hardcode string expressions + route, target etc. everything will be changeable, not fixed.

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get involved.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## ⭐ Support

If this project helps you on your journey, consider giving it a **star** ⭐ — it helps others discover it.

---

<p align="center">
  <em>This is not a game. This is not a simulation. This is your life. Harden or perish.</em>
</p>
