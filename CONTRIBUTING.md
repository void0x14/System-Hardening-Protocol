# Contributing to System Hardening Protocol

First off, thank you for stepping up. Contributing to the **System Hardening Protocol** means you're helping build a tool for human optimization and digital sovereignty. We don't just write code; we harden existence.

---

<p align="center">
  <a href="CONTRIBUTING.md">English</a> | <a href="CONTRIBUTING_TR.md">Türkçe</a>
</p>

---

---

## 🔱 Guiding Principles (The Code)

Before you write a single line, understand our philosophy:

1.  **Zero Dependencies**: No `npm install`. No `External Frameworks`. No `Supply Chain Risks`. If you need a utility, write it or use a native Web API.
2.  **Vanilla Performance**: Pure ES6+ JavaScript and CSS3. We don't use virtual DOMs or heavy abstractions. The code must be fast, lean, and readable.
3.  **Privacy First**: All data belongs to the user. No telemetry, no cloud sync, no tracking. LocalStorage is the only source of truth.
4.  **Terry Davis Philosophy**: Build only what you actually need. Avoid bloat. "A ten-foot pole is not a replacement for a brain."
5.  **Hardcore UI**: The interface is military-grade. High contrast, dark mode, neon accents, and high informational density.

---

## 🚀 Branching Strategy

We operate with two primary branches:

-   **`main`**: The "Stable/Production" branch. Contains the current battle-ready version.
-   **`workspace`**: The "Development" branch. All active development, experiments, and tests happen here.

**Rule**: NEVER submit a PR directly to `main`. Always target `workspace`.

---

## 🛠️ How to Contribute

1.  **Fork** the repository.
2.  **Switch to workspace**: `git checkout workspace`.
3.  **Create your mission branch**: `git checkout -b feat/your-mission`.
4.  **Implement**: Follow the architecture patterns (State-Renderer-Actions).
5.  **Test**: Ensure no regressions. Run `node tests/run-all.js`. 
    *(Note: The `tests/` directory exists **strictly on the `workspace` branch**; it is not included in the production `main` branch).*
6.  **Commit**: Use Conventional Commits.
7.  **Push and PR**: Open a Pull Request into the `workspace` branch.

---

## 📁 Project Architecture (Intelligence)

Your code must fit into the existing modular structure:

```
src/js/
├── config/         # System constants, DB keys, and validation rules
├── core/           # EventBus and base container logic
├── db/             # Static databases (Exercises, Foods, Anatomy)
├── infrastructure/ # Storage adapters (LocalStorage/Memory)
├── locales/        # Internationalization strings (en.json, tr.json)
├── performance/    # Virtual lists, caching, and lazy loading
├── renderers/      # Low-level UI rendering logic
├── repositories/   # Data access layer for State
├── services/       # Business logic (i18n, Statistics, Backup)
├── state/          # State management (Reducers, Middleware)
├── ui/             # High-level UI management
├── views/          # Section-specific views (Dashboard, Training, etc.)
└── components/     # Reusable UI elements (Modals, Cards, Buttons)
```

---

## 📏 Code Standards

### JavaScript
- Use **ES6+ Modules**.
- Use **Strict Mode** implicitly.
- No `var`. Use `const` by default, `let` if necessary.
- Document complex logic with JSDoc.
- **Pure Functions**: Keep logic separate from side effects where possible.

### CSS
- Use **CSS Variables** defined in `:root`.
- No inline styles.
- Maintain the **Cyberpunk/Military** aesthetic (Glows, borders, specific HSL values).

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` for new capabilities.
- `fix:` for tactical bug fixes.
- `perf:` for increasing speed/reducing size.
- `docs:` for intelligence updates.
- `refactor:` for structural hardening without changing logic.

---

## 📄 License

By contributing, you agree that your work will be licensed under the **MIT License**.

---

<p align="center">
  <em>Discipline equals freedom. Code with intent.</em>
</p>
