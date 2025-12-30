# 🛡️ System Hardening Protocol

> **"Discipline is the bridge between goals and accomplishment."**

A cyberpunk-themed life optimization dashboard built for **Monk Mode** practitioners. Track your fitness, nutrition, mental fortitude, and personal growth in one unified command center.

![Version](https://img.shields.io/badge/version-8.2.0-00ff41?style=flat-square)
![License](https://img.shields.io/badge/license-Private-ff003c?style=flat-square)
![Status](https://img.shields.io/badge/status-Field%20Test%20Approved-00ff41?style=flat-square)

---

## 🎯 Philosophy

This isn't just a tracker app. It's a **personal operating system** for self-improvement.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Jaguar Theory** | Appear strong externally, build substance internally |
| **Robotic Execution** | Execute regardless of emotional state |
| **Async Execution** | Start imperfectly, iterate continuously |
| **Debugging Mindset** | Treat failures as bugs to fix, not personal flaws |
| **Producer Mode** | Create more than you consume |

### The 8 Mental Phases

The protocol includes 8 phases of mental hardening, from perception management to dynamic adaptation.

---

## ✨ Features

### 📊 Dashboard
- Real-time streak tracking
- Weight progress visualization
- Daily water & sleep monitoring
- Milestone celebrations with epic overlays

### 🏋️ Training
- Garage gym optimized exercise database
- Set-by-set logging with PR tracking
- YouTube video tutorials embedded
- Support for weighted, timed, and activity-based exercises

### 🍽️ Nutrition
- 50+ Turkish student-budget food database
- Smart portion system (radio buttons for common portions)
- Macro ring visualization (Protein/Carb/Fat)
- Daily calorie goal tracking (3000 kcal target)

### 🧠 Mental Warfare
- 8-phase mental hardening protocol
- Daily practice tracking per phase
- Philosophy cards with actionable strategies

### 🦴 Anatomy Lab
- Interactive SVG muscle map
- Front/back body views
- Exercise-to-muscle mapping

### 📈 Progress
- Weight history charts
- Body measurement tracking (chest, arm, waist, leg)
- Weekly/monthly summary reports

### 🔒 Stealth Mode
- Privacy-first sanitized view
- Hide sensitive content instantly
- Safe for public use

### 🤖 Robot Mode (Emotion Override)
- Bypass emotional resistance
- Focus timer with mission display
- Grayscale visual mode for distraction reduction

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **UI Framework** | Tailwind CSS (CDN) |
| **Icons** | Font Awesome 6.4.0 |
| **Fonts** | Inter, JetBrains Mono, Orbitron |
| **Storage** | localStorage / Custom Storage API |
| **Build** | Node.js build script (single-file output) |
| **Architecture** | Modular source → Single-file deployment |

---

## 📁 Project Structure

```
System-Hardening/
├── dist/
│   └── index.html          # Production build (single-file)
├── src/
│   ├── js/
│   │   ├── config.js       # Configuration & theme
│   │   ├── db/             # Data (exercises, foods, etc.)
│   │   ├── renderers/      # View renderers (dashboard, training, etc.)
│   │   ├── store.js        # State management
│   │   ├── ui.js           # UI helpers (toast, modal, etc.)
│   │   ├── utils.js        # Utility functions
│   │   ├── actions.js      # Event handlers
│   │   ├── components.js   # Reusable UI components
│   │   ├── stealth.js      # Privacy mode
│   │   └── app.js          # Bootstrap
│   ├── styles/             # CSS files
│   ├── template.html       # HTML template
│   └── build.js            # Build script
├── memory-bank/            # Project documentation
│   ├── progress.md         # Feature progress & known issues
│   ├── activeContext.md    # Current work focus
│   └── roadmap.md          # Future plans
└── .jules/                 # Security journal
```

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge)
- Node.js (for development/building)

### Usage

**Option 1: Direct Use**
```bash
# Open the production build directly
open dist/index.html
```

**Option 2: Development**
```bash
# Build from source
node src/build.js

# Output: dist/index.html
```

---

## 📊 Version History

| Version | Highlights |
|---------|------------|
| **v8.2.0** | Nutrition Tab Redesign, Macro Rings, Security Fixes |
| **v8.1.1** | Training Tab UI/UX Overhaul |
| **v8.1.0** | Stealth Mode (Privacy) |
| **v8.0.0** | Modular Architecture |
| **v7.1.0** | Video Player Fallback System |
| **v7.0.0** | Security (XSS prevention), Performance (caching) |

---

## 🗺️ Roadmap

### Immediate Priorities
- [ ] **YOLCULUK Tab** - Visual journey tracker with progress photos
- [ ] Settings menu redesign
- [ ] Dashboard fatigue reduction

### Future Phases
1. **Core Stability** - Auto-backup, crash recovery
2. **Psychology Engine** - Habit formation AI
3. **Predictive Analytics** - Plateau detection
4. **Gamification 2.0** - XP, achievements, boss battles
5. **PWA** - Offline support, push notifications

See [roadmap.md](memory-bank/roadmap.md) for full details.

---

## 🔐 Security

- XSS prevention via `Utils.escapeHtml()`
- Input validation on user data
- Security audit documented in `.jules/sentinel.md`

---

## 🤝 Contributing

This is currently a private project. If you have access:

1. Read `memory-bank/` for context
2. Follow existing code patterns
3. Update documentation after changes
4. Run `node src/build.js` before committing

---

## 📜 License

Private - All rights reserved.

---

## 🙏 Acknowledgments

- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icon library
- **JetBrains** - Mono font
- **The Monk Mode community** - For the philosophy

---

<div align="center">

**Built with 💪 discipline and ☕ caffeine**

*"The system is not the goal. The system is the path."*

</div>
