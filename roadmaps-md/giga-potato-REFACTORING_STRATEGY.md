# System Hardening Protocol - Refactoring Strategy

## Section 1: Executive Technical Summary

### Current State Health Score: 42/100

**Core System Overview:**  
The System Hardening Protocol is a frontend-first fitness tracking application built with vanilla JavaScript, using localStorage for data persistence and Bootstrap for UI. It tracks workouts, nutrition, sleep, water intake, and mental health phases.

### Key Technical Debt Indicators:

| Metric | Value |
|--------|-------|
| Total Lines of Code | ~100,000+ |
| Global Scope Variables | 8+ (Store, UI, Actions, Renderers, DB, CONFIG, THEME, Stealth) |
| Monolithic Files > 30KB | 3 (actions.js, store.js, dashboard.js renderer) |
| Cyclomatic Complexity (Store) | Very High |
| Test Coverage | 0% |
| Dependencies | None (pure vanilla JS) |

### Biggest Blockers to Scalability:
1. **Global Scope Pollution:** All modules are declared in the global namespace, causing potential conflicts and making testing impossible
2. **Monolithic State Management:** Store.js (35KB) handles state, data access, sanitization, and business logic
3. **Tight Coupling:** UI, business logic, and data access are intertwined across all files
4. **Lack of Type Safety:** No type definitions or validation
5. **Hardcoded Configurations:** Target values, storage keys, and milestones are hardcoded in config.js
6. **Poor Error Handling:** Limited error handling with console.log only
7. **Non-Modular Architecture:** No module system or dependency injection

---

## Section 2: Architectural Anti-Patterns

### 2.1 Global Scope Pollution
**File:** `src/js/app.js`, `src/js/config.js`, all modules  
**Issue:** All major modules (Store, UI, Actions, Renderers) are declared as global `const` variables, causing:
- Potential namespace collisions
- Inability to test in isolation
- Difficult to refactor or replace components
- No encapsulation of internal state

**Solution:** Implement ES modules (ESM) with proper import/export statements

### 2.2 God Object - Store.js
**File:** `src/js/store.js` (35,663 bytes)  
**Lines:** Entire file  
**Issue:** The Store object violates the Single Responsibility Principle (SRP) by handling:
- State management
- localStorage access
- Data sanitization
- Business logic (e.g., generateDailyPlan)
- Backup/restore functionality
- Exercise history tracking
- Statistics calculation
- Streak management

**Solution:** Split into separate modules:
- `StateManager`: Handles core state management
- `DataRepository`: Manages localStorage operations
- `DataSanitizer`: Handles data validation/sanitization
- `StatisticsService`: Calculates metrics and analytics
- `BackupService`: Handles import/export

### 2.3 Tight Coupling - UI and Business Logic
**File:** `src/js/actions.js` (47,803 bytes)  
**Issue:** Actions.js contains both UI event handlers and business logic, such as:
```javascript
// Line 153: Mixes UI interaction with business logic
async saveWeight(v) {
    const num = parseFloat(v);
    if (isNaN(num) || num <= 0 || num > 300) {
        UI.showToast("Geçersiz kilo!", "error"); // UI logic
        return;
    }
    if (await Store.saveWeight(num)) { // Business logic
        UI.showToast("Kilo güncellendi."); // UI logic
        this.switchTab('dashboard'); // UI logic
    }
}
```

**Solution:** Separate into:
- `EventHandler`: Pure DOM event handlers
- `UseCase`: Business logic without UI dependencies
- `Presenter`: Maps data between use cases and UI

### 2.4 Hardcoded Configuration Values
**File:** `src/js/config.js` (1,910 bytes)  
**Lines:** Entire file  
**Issue:** All configuration values are hardcoded:
```javascript
const CONFIG = {
    VERSION: '8.3.1',
    DEBUG_MODE: false,
    KEYS: { /* hardcoded storage keys */ },
    TARGETS: { /* hardcoded fitness targets */ },
    MILESTONES: [ /* hardcoded milestones */ ]
};
```

**Solution:** 
- Move to environment variables (.env) for deploy-time config
- Use JSON configuration files for user-specific settings
- Implement a ConfigService to handle config loading

### 2.5 Massive Renderer Functions
**File:** `src/js/renderers/dashboard.js` (53,875 bytes)  
**Issue:** Single file handles all dashboard rendering, creating HTML strings directly:
- 500+ lines of HTML generation
- No component separation
- Difficult to maintain or test
- Tight coupling with Store state

**Solution:** Implement a component-based architecture with:
- Reusable UI components (Card, Button, Modal)
- Template rendering engine or JSX-like syntax
- Virtual DOM for efficient updates

---

## Section 3: The Hardening Plan (Phased Roadmap)

### Phase 1: Stabilization & Decoupling (2-3 weeks)

#### Goals:
- Eliminate global scope pollution
- Implement modular architecture
- Extract configuration from code
- Set up modern development tooling

#### Key Tasks:
1. Set up build system with Vite or Webpack
2. Convert all files to ES modules with import/export
3. Create configuration service with environment variables
4. Extract data sanitization into separate module
5. Set up ESLint and Prettier for code quality
6. Add basic testing framework (Vitest)

#### Deliverables:
- `/src/modules/config/` - Configuration management
- `/src/modules/sanitizer/` - Data validation
- `/src/core/di/` - Dependency injection container
- Build configuration files (vite.config.js, .env.example)

---

### Phase 2: Refactoring Core Logic (3-4 weeks)

#### Goals:
- Apply SOLID principles
- Decouple business logic from UI
- Implement use case architecture
- Improve testability

#### Key Tasks:
1. Split Store.js into separate modules
2. Create use case classes for each business operation
3. Implement repository pattern for data access
4. Create presenter layer for UI communication
5. Refactor Actions.js to remove business logic
6. Write unit tests for core use cases

#### Deliverables:
- `/src/modules/state/` - State management
- `/src/modules/repository/` - Data persistence
- `/src/use-cases/` - Business logic
- `/src/presenters/` - UI mapping
- Unit test files for all core modules

---

### Phase 3: Security & Performance (2-3 weeks)

#### Goals:
- Improve security posture
- Optimize performance
- Implement proper error handling
- Add monitoring and analytics

#### Key Tasks:
1. Implement input validation for all user inputs
2. Add XSS protection to renderer functions
3. Improve data encryption for localStorage
4. Implement performance profiling
5. Add error tracking and logging
6. Optimize DOM updates with virtual DOM
7. Add loading states and error boundaries

#### Deliverables:
- `/src/security/` - Input validation & XSS protection
- `/src/monitoring/` - Error tracking
- Performance benchmarks
- Security audit report

---

## Section 4: Critical Hotspots - Top 5 Files

### 1. `src/js/store.js` (35,663 bytes)
**Issue:** God object containing all state and business logic  
**Refactor Strategy:**

```
Before: Single monolithic object
After:
├── src/modules/state/
│   ├── StateManager.js     - Core state management
│   └── initialState.js     - Initial state configuration
├── src/modules/repository/
│   ├── LocalStorageRepository.js - Data access layer
│   └── MemoryRepository.js  - In-memory for testing
├── src/modules/sanitizer/
│   └── DataSanitizer.js    - Data validation
├── src/use-cases/
│   ├── WorkoutUseCase.js
│   ├── NutritionUseCase.js
│   ├── WeightUseCase.js
│   └── ...other use cases
└── src/modules/statistics/
    └── StatisticsService.js - Metrics calculation
```

### 2. `src/js/renderers/dashboard.js` (53,875 bytes)
**Issue:** Massive renderer with no component separation  
**Refactor Strategy:**

```javascript
// Before: Single function that renders entire dashboard
async function renderDashboard() {
    // 500+ lines of HTML string concatenation
}

// After: Component-based approach
import { Card } from '../components/Card.js';
import { ProgressBar } from '../components/ProgressBar.js';

async function Dashboard() {
    const stats = await StatisticsService.getTodayProgress();
    const streak = await Store.getStreak();
    
    return `
        <div class="dashboard-container">
            ${Card({
                title: 'Today Progress',
                content: `
                    ${ProgressBar({ value: stats.tasksPercent, label: 'Tasks Completed' })}
                    ${ProgressBar({ value: stats.caloriesPercent, label: 'Calories Consumed' })}
                `
            })}
            ${Card({
                title: 'Streak',
                content: `<div class="streak-counter">${streak} days</div>`
            })}
        </div>
    `;
}
```

### 3. `src/js/actions.js` (47,803 bytes)
**Issue:** Mixes UI event handlers with business logic  
**Refactor Strategy:**

```javascript
// Before: Action with mixed concerns
async function saveWeight(v) {
    const num = parseFloat(v);
    if (isNaN(num) || num <= 0 || num > 300) {
        UI.showToast("Geçersiz kilo!", "error");
        return;
    }
    if (await Store.saveWeight(num)) {
        UI.showToast("Kilo güncellendi.");
        this.switchTab('dashboard');
    }
}

// After: Separate concerns
// 1. Event Handler (pure DOM interaction)
document.getElementById('weight-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const weightInput = document.getElementById('weight-input');
    const result = await WeightUseCase.updateWeight(parseFloat(weightInput.value));
    WeightPresenter.handleUpdateResult(result);
});

// 2. Use Case (pure business logic)
class WeightUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    
    async updateWeight(weight) {
        if (!this.validateWeight(weight)) {
            return { success: false, error: 'Invalid weight' };
        }
        await this.repository.saveWeight(weight);
        return { success: true };
    }
    
    validateWeight(weight) {
        return typeof weight === 'number' && weight > 0 && weight < 300;
    }
}

// 3. Presenter (maps data to UI)
class WeightPresenter {
    static handleUpdateResult(result) {
        if (result.success) {
            UI.showToast("Kilo güncellendi.", "success");
            NavigationService.navigate('dashboard');
        } else {
            UI.showToast(result.error, "error");
        }
    }
}
```

### 4. `src/js/config.js` (1,910 bytes)
**Issue:** Hardcoded configuration values  
**Refactor Strategy:**

```javascript
// Before: Hardcoded values
const CONFIG = {
    VERSION: '8.3.1',
    DEBUG_MODE: false,
    TARGETS: {
        START: 45.0,
        GOAL: 60.0,
        CAL: 3000,
        PROT: 225,
        CARB: 375,
        FAT: 67,
        WATER: 8,
        SLEEP: 7.5
    }
};

// After: Environment variables and user config
import { loadEnv } from '../modules/config/ConfigLoader.js';

class ConfigService {
    constructor() {
        this.env = loadEnv();
        this.userConfig = this.loadUserConfig();
    }
    
    getVersion() {
        return this.env.VERSION;
    }
    
    isDebugMode() {
        return this.env.DEBUG_MODE === 'true';
    }
    
    getTargets() {
        return this.userConfig.targets || this.getDefaultTargets();
    }
    
    getDefaultTargets() {
        return {
            START: 45.0,
            GOAL: 60.0,
            CAL: 3000,
            PROT: 225,
            CARB: 375,
            FAT: 67,
            WATER: 8,
            SLEEP: 7.5
        };
    }
    
    loadUserConfig() {
        return JSON.parse(localStorage.getItem('user_config')) || {};
    }
    
    saveUserConfig(config) {
        localStorage.setItem('user_config', JSON.stringify(config));
    }
}

export const configService = new ConfigService();
```

### 5. `src/js/utils.js` (6,040 bytes)
**Issue:** Utility functions without structure or typing  
**Refactor Strategy:**

```javascript
// Before: Random collection of utility functions
const Utils = {
    storage: { /* ... */ },
    dateStr() { /* ... */ },
    escapeHtml() { /* ... */ },
    /* 20+ more functions */
};

// After: Structured utility modules
// src/utils/storage.js
export class StorageService {
    static get(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
    
    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    static remove(key) {
        localStorage.removeItem(key);
    }
}

// src/utils/date.js
export class DateService {
    static formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    
    static getTodayString() {
        return this.formatDate(new Date());
    }
    
    static isDateValid(dateStr) {
        return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
    }
}

// src/utils/string.js
export class StringService {
    static escapeHtml(text) {
        const map = {
            '&': '&',
            '<': '<',
            '>': '>',
            '"': '"',
            "'": '&#039;'
        };
        return text.replace(/[&<>"]/g, m => map[m]);
    }
}
```

---

## Section 5: Implementation Guidelines

### Naming Conventions:
- **Modules:** Use kebab-case for file/folder names
- **Classes:** PascalCase (e.g., `UserRepository`)
- **Methods/Functions:** camelCase (e.g., `getUserById()`)
- **Variables/Properties:** camelCase (e.g., `userData`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_ENDPOINT`)

### Code Quality Standards:
- Maximum function length: 50 lines
- Maximum cyclomatic complexity: 5
- No nested callbacks deeper than 2 levels
- All functions must have JSDoc comments
- All changes must be covered by tests

### Testing Strategy:
- Unit tests for all use cases, services, and utilities
- Integration tests for repository layer
- E2E tests for critical user journeys
- 80% minimum test coverage

---

## Appendices

### A. File Size Distribution
| File | Size | Status |
|------|------|--------|
| dashboard.js | 53,875 bytes | Red (needs refactor) |
| actions.js | 47,803 bytes | Red (needs refactor) |
| store.js | 35,663 bytes | Red (needs refactor) |
| components.js | 16,230 bytes | Yellow (needs review) |
| exercises.js | 16,355 bytes | Green (data file) |
| foods.js | 4,676 bytes | Green (data file) |

### B. Dependencies to Add
- **Build:** Vite
- **Testing:** Vitest, React Testing Library (for UI)
- **Code Quality:** ESLint, Prettier
- **Environment:** dotenv
- **State Management:** MobX or Redux Toolkit (or custom)
- **HTTP:** Axios (for future API integration)
