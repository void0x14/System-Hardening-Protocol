# Contributing to System Hardening Protocol

First off, thanks for considering contributing to the **System Hardening Protocol**! Every contribution helps make this tool sharper and more battle-tested.

## 🎯 How to Contribute

### Reporting Bugs

Found a bug? Open an [issue](https://github.com/void0x14/System-Hardening-Protocol/issues) with:
- A clear title and description
- Steps to reproduce the behavior
- Expected vs actual behavior
- Browser and OS version
- Screenshots if applicable

### Suggesting Features

Have an idea? Open an issue with the `enhancement` label:
- Describe the feature and its use case
- Explain why it would benefit the project
- Include mockups/sketches if possible

### Code Contributions

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/your-feature`
3. **Build** the project: `pnpm run build`
4. **Test** by opening `dist/index.html` in your browser
5. **Commit** with clear messages: `git commit -m "feat: add new feature"`
6. **Push** to your fork: `git push origin feat/your-feature`
7. **Open** a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to Use |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructuring |
| `perf:` | Performance improvement |
| `chore:` | Maintenance tasks |

## 🏗️ Project Architecture

```
src/
├── template.html          # Base HTML template
├── build.js               # Build script (Node.js)
├── js/
│   ├── config.js          # Global configuration
│   ├── db/                # Exercise, food, and plan databases
│   ├── utils.js           # Utility functions
│   ├── store.js           # State management (localStorage)
│   ├── ui.js              # UI rendering engine
│   ├── components.js      # Reusable UI components
│   ├── renderers/         # Section-specific renderers
│   ├── actions.js         # User interaction handlers
│   └── app.js             # Application entry point
└── styles/
    ├── base.css            # Core styles
    ├── components.css      # Component styles
    ├── animations.css      # Animations & transitions
    └── overrides.css       # Tailwind overrides
```

### Build Process

The project bundles into a **single HTML file** (`dist/index.html`):

```bash
pnpm run build
```

This concatenates all JS modules in dependency order and injects them into `template.html`.

## 📜 Code of Conduct

- Be respectful and constructive
- Focus on the code, not the person
- Help others learn and grow

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
