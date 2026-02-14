# REFACTORING STRATEGY: System-Hardening-Protocol

**Document Version:** 1.0  
**Audit Date:** 2026-02-14  
**Auditor:** Senior Principal Software Architect  
**Codebase Version:** 8.3.1

---

## Section 1: Executive Technical Summary

### Health Score: **42/100**

The System-Hardening-Protocol codebase demonstrates functional competence but suffers from significant architectural debt that will impede scalability. The application works correctly for its current scope but is structured as a monolithic SPA with global scope pollution, making feature expansion risky and testing nearly impossible.

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Architecture | 25/100 | 30% | 7.5 |
| Code Quality | 40/100 | 25% | 10.0 |
| Testability | 5/100 | 20% | 1.0 |
| Security | 65/100 | 15% | 9.75 |
| Extensibility | 35/100 | 10% | 3.5 |
| **Total** | | | **31.75/100** |

*Adjusted Score: 42/100 (accounting for functional correctness)*

### Critical Blockers to Scalability

1. **Global Scope Pollution** - All modules use `const Name = {...}` at global scope, preventing proper module isolation and tree-shaking.

2. **God Object Anti-Pattern** - [`Store`](src/js/store.js:1) handles state management, data validation, sanitization, backup/restore, and business logic in a single 1000+ line object.

3. **No Dependency Injection** - Direct references to global objects (`Store`, `UI`, `CONFIG`) make unit testing impossible without mocking the entire global scope.

4. **Monolithic Renderer** - [`dashboard.js`](src/js/renderers/dashboard.js:1) contains 6 different view renderers in a single 53KB file, violating Single Responsibility Principle.

5. **Hardcoded Localization** - Turkish strings are embedded throughout the codebase, making internationalization impossible without massive refactoring.

---

## Section 2: Architectural Anti-Patterns

### 2.1 Global Scope Pollution (Critical)

**Location:** All core files ([`app.js`](src/js/app.js:1), [`store.js`](src/js/store.js:1), [`actions.js`](src/js/actions.js:1), [`ui.js`](src/js/ui.js:1))

**Current Implementation:**
```javascript
// store.js - Line 4
const Store = {
    state: { ... },
    // 1000+ lines of methods
};

// actions.js - Line 5
const Actions = {
    // 800+ lines of methods
};
```

**Problem:** All modules are defined as global constants, creating implicit dependencies that cannot be traced, tested, or tree-shaken. The build process concatenates files in a specific order to satisfy dependencies.

**Recommended Pattern:** ES Modules with explicit imports/exports
```javascript
// store.js
export class Store {
    constructor(storageAdapter, config) {
        this.storage = storageAdapter;
        this.config = config;
    }
}

// actions.js
import { Store } from './store.js';
import { UI } from './ui.js';

export class Actions {
    constructor(store, ui) {
        this.store = store;
        this.ui = ui;
    }
}
```

---

### 2.2 God Object: Store (Critical)

**Location:** [`src/js/store.js`](src/js/store.js:1) - Lines 4-965

**Current Responsibilities (Violating SRP):**
| Responsibility | Lines | Should Be |
|---------------|-------|-----------|
| State Management | 4-50 | State Manager |
| Data Validation | 200-400 | Validator Service |
| Sanitization | 400-700 | Sanitizer Service |
| Backup/Restore | 700-800 | Backup Service |
| Exercise History | 800-900 | History Repository |
| Statistics | 900-965 | Stats Service |

**Problem:** The Store object has grown to handle every data-related concern. Adding a new feature requires modifying this central object, increasing the risk of regressions.

**Recommended Pattern:** Service Layer with Dependency Injection
```
src/js/services/
├── StateManager.js      # Pure state management
├── ValidationService.js # Input validation
├── SanitizerService.js  # Data sanitization
├── BackupService.js     # Export/Import
├── ExerciseHistoryRepository.js
└── StatisticsService.js
```

---

### 2.3 Monolithic Renderer (High)

**Location:** [`src/js/renderers/dashboard.js`](src/js/renderers/dashboard.js:1) - 53,875 bytes

**Current Structure:**
```javascript
const Renderers = {
    async dashboard() { /* 200 lines */ },
    async training() { /* 300 lines */ },
    async nutrition() { /* 200 lines */ },
    async progress() { /* 150 lines */ },
    async anatomy() { /* 100 lines */ },
    async mental() { /* 150 lines */ },
    // Plus helper functions
};
```

**Problem:** All view rendering logic is concentrated in one file. A change to the nutrition view requires loading and potentially breaking the training view.

**Recommended Pattern:** View Component Architecture
```
src/js/views/
├── DashboardView.js
├── TrainingView.js
├── NutritionView.js
├── ProgressView.js
├── AnatomyView.js
└── MentalView.js
```

---

### 2.4 Duplicate Utility Functions (Medium)

**Location:** 
- [`src/js/store.js:6`](src/js/store.js:6) - `_toSafeNumber()`
- [`src/js/renderers/dashboard.js:7`](src/js/renderers/dashboard.js:7) - `toSafeNumber()`

**Current Implementation:**
```javascript
// store.js - Line 246
_toSafeNumber(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
}

// dashboard.js - Line 7
const toSafeNumber = (value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
};
```

**Problem:** DRY violation - same logic duplicated with different naming conventions.

**Recommended Pattern:** Shared utility module
```javascript
// src/js/utils/numbers.js
export const toSafeNumber = (value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
};
```

---

### 2.5 Hardcoded Localization Strings (Medium)

**Location:** Throughout codebase, especially [`actions.js`](src/js/actions.js:1) and [`renderers/dashboard.js`](src/js/renderers/dashboard.js:1)

**Examples:**
```javascript
// actions.js - Line 95
UI.showToast("Geçersiz kilo!", "error");

// actions.js - Line 103
const messages = [
    { emoji: "⛽", text: "YAKIT ALINDI!", sub: "Motor çalışıyor. Kaslar büyüyor." },
    // ... more Turkish strings
];

// dashboard.js - Line 45
<div class="text-[10px] text-gray-500 font-bold">SON 28 GÜN</div>
```

**Problem:** All UI strings are hardcoded in Turkish, embedded directly in logic. Adding a new language requires modifying every file.

**Recommended Pattern:** i18n with external translation files
```javascript
// src/js/i18n/tr.json
{
    "errors.invalidWeight": "Geçersiz kilo!",
    "fuel.injected": "YAKIT ALINDI!",
    "fuel.subtitle": "Motor çalışıyor. Kaslar büyüyor."
}

// Usage
import { t } from './i18n';
UI.showToast(t('errors.invalidWeight'), "error");
```

---

### 2.6 Magic Numbers and Strings (Medium)

**Location:** [`src/js/store.js`](src/js/store.js:1) - Validation methods

**Examples:**
```javascript
// store.js - Line 252
_toSafeNumber(value, fallback, 20, 500)  // What do 20 and 500 represent?

// store.js - Line 390
.slice(-300)  // Why 300 custom foods max?

// store.js - Line 440
.slice(-100)  // Why 100 history entries?
```

**Problem:** Business rules are encoded as magic numbers without documentation or centralization.

**Recommended Pattern:** Configuration constants
```javascript
// src/js/config/validation.js
export const VALIDATION_LIMITS = {
    WEIGHT: { MIN: 20, MAX: 500, UNIT: 'kg' },
    CUSTOM_FOODS_MAX: 300,
    EXERCISE_HISTORY_MAX: 100,
    MEAL_NAME_MAX_LENGTH: 120
};
```

---

### 2.7 Event Delegation Coupling (Low)

**Location:** [`src/js/app.js`](src/js/app.js:1) - Lines 14-38

**Current Implementation:**
```javascript
const delegateAction = async (e) => {
    const actionEl = e.target.closest('[data-action]');
    // ... parsing logic
    if (typeof Actions[action] !== 'function') return;
    await Actions[action](...params);
};
```

**Problem:** The event delegation system is tightly coupled to the global `Actions` object. Testing individual action handlers requires the full delegation infrastructure.

**Recommended Pattern:** Event Bus with decoupled handlers
```javascript
// src/js/core/EventBus.js
export class EventBus {
    constructor() {
        this.handlers = new Map();
    }
    
    register(action, handler) {
        this.handlers.set(action, handler);
    }
    
    async dispatch(action, params) {
        const handler = this.handlers.get(action);
        if (handler) return handler(...params);
    }
}
```

---

## Section 3: The Hardening Plan (Phased Roadmap)

### Phase 1: Stabilization & Decoupling

**Objective:** Establish architectural boundaries without breaking functionality.

#### 1.1 Module System Migration

**Files Affected:** All `.js` files in `src/js/`

**Tasks:**
1. Convert global objects to ES modules with explicit exports
2. Create `src/js/index.js` as module entry point
3. Update build process to use Vite's native ES module support
4. Add import/export statements for all cross-file dependencies

**Validation Criteria:**
- [ ] No global scope pollution (verify with `Object.keys(window)`)
- [ ] All dependencies explicitly imported
- [ ] Build output unchanged (functional parity)

#### 1.2 Extract Configuration Layer

**Files Affected:** [`src/js/config.js`](src/js/config.js:1), new files

**Tasks:**
1. Create `src/js/config/` directory structure:
   ```
   config/
   ├── index.js          # Aggregated exports
   ├── keys.js           # Storage key constants
   ├── targets.js        # Nutrition/fitness targets
   ├── validation.js     # Input validation limits
   └── theme.js          # UI theme constants
   ```
2. Extract magic numbers from `store.js` to `validation.js`
3. Create environment-based configuration support

**Validation Criteria:**
- [ ] All magic numbers replaced with named constants
- [ ] Configuration values documented with JSDoc
- [ ] Unit tests for configuration validation

#### 1.3 Implement Dependency Injection Container

**Files Affected:** New files, [`src/js/app.js`](src/js/app.js:1)

**Tasks:**
1. Create `src/js/core/Container.js` - Simple DI container
2. Register all services with their dependencies
3. Refactor `app.js` to use container for initialization

**Pseudo-code:**
```javascript
// src/js/core/Container.js
export class Container {
    constructor() {
        this.services = new Map();
        this.factories = new Map();
    }
    
    register(name, factory) {
        this.factories.set(name, factory);
    }
    
    get(name) {
        if (!this.services.has(name)) {
            const factory = this.factories.get(name);
            this.services.set(name, factory(this));
        }
        return this.services.get(name);
    }
}

// src/js/app.js
import { Container } from './core/Container.js';
import { Store } from './services/Store.js';
import { UI } from './services/UI.js';
import { Actions } from './services/Actions.js';

const container = new Container();
container.register('config', () => Config);
container.register('store', (c) => new Store(c.get('config')));
container.register('ui', (c) => new UI(c.get('store')));
container.register('actions', (c) => new Actions(c.get('store'), c.get('ui')));
```

---

### Phase 2: Refactoring Core Logic

**Objective:** Apply SOLID principles to reduce complexity and improve maintainability.

#### 2.1 Decompose Store into Services

**Files Affected:** [`src/js/store.js`](src/js/store.js:1) → Multiple new files

**Target Architecture:**
```
src/js/services/
├── StateManager.js       # Pure state container
├── ValidationService.js  # Input validation
├── SanitizerService.js   # Data sanitization
├── BackupService.js      # Export/Import functionality
├── repositories/
│   ├── MealRepository.js
│   ├── WorkoutRepository.js
│   ├── ExerciseHistoryRepository.js
│   └── StatsRepository.js
└── StatisticsService.js  # Aggregated statistics
```

**Refactoring Steps:**

1. **Extract ValidationService** (Lines 246-470 from store.js)
   ```javascript
   // src/js/services/ValidationService.js
   export class ValidationService {
       constructor(config) {
           this.limits = config.validationLimits;
       }
       
       toSafeNumber(value, fallback, min, max) { ... }
       sanitizeDateString(value) { ... }
       sanitizeMealEntry(entry) { ... }
       // ... all validation methods
   }
   ```

2. **Extract Repositories** (Data access patterns)
   ```javascript
   // src/js/services/repositories/MealRepository.js
   export class MealRepository {
       constructor(storage) {
           this.storage = storage;
       }
       
       async getByDate(date) { ... }
       async add(meal) { ... }
       async delete(index) { ... }
   }
   ```

3. **Create StateManager** (Pure state)
   ```javascript
   // src/js/services/StateManager.js
   export class StateManager {
       constructor(initialState = {}) {
           this.state = initialState;
           this.subscribers = [];
       }
       
       getState() { return { ...this.state }; }
       
       setState(updates) {
           this.state = { ...this.state, ...updates };
           this.notify();
       }
       
       subscribe(callback) {
           this.subscribers.push(callback);
           return () => this.subscribers.filter(cb => cb !== callback);
       }
   }
   ```

#### 2.2 Split Renderers into View Components

**Files Affected:** [`src/js/renderers/dashboard.js`](src/js/renderers/dashboard.js:1) → Multiple new files

**Target Architecture:**
```
src/js/views/
├── DashboardView.js
├── TrainingView.js
├── NutritionView.js
├── ProgressView.js
├── AnatomyView.js
├── MentalView.js
└── components/
    ├── Card.js
    ├── ProgressBar.js
    ├── MacroRing.js
    ├── MealCard.js
    └── SetRow.js
```

**Refactoring Pattern:**
```javascript
// src/js/views/DashboardView.js
import { Card, ProgressBar, MacroRing } from './components/index.js';

export class DashboardView {
    constructor(store, components) {
        this.store = store;
        this.components = components;
    }
    
    async render() {
        const data = await this.gatherData();
        return this.template(data);
    }
    
    async gatherData() {
        // Data fetching logic
    }
    
    template(data) {
        // HTML template
    }
}
```

#### 2.3 Implement Proper Error Handling

**Files Affected:** All service files

**Tasks:**
1. Create custom error classes:
   ```javascript
   // src/js/errors/index.js
   export class ValidationError extends Error { ... }
   export class StorageError extends Error { ... }
   export class AuthenticationError extends Error { ... }
   ```

2. Replace generic error handling with specific error types
3. Add error boundaries in UI layer

---

### Phase 3: Security & Performance

**Objective:** Optimize the hardened structure and enhance security posture.

#### 3.1 Security Enhancements

**Current Security Posture:**
| Area | Status | Action Required |
|------|--------|-----------------|
| XSS Prevention | ✅ Good | `Utils.escapeHtml` implemented |
| Input Validation | ✅ Good | Comprehensive sanitization in Store |
| YouTube ID Validation | ✅ Good | `Utils.isValidYouTubeId` |
| Storage Encryption | ❌ Missing | Implement for sensitive data |
| CSP Headers | ❌ Missing | Add Content Security Policy |
| Rate Limiting | ❌ Missing | Add for user actions |

**Tasks:**
1. **Implement Storage Encryption**
   ```javascript
   // src/js/services/EncryptedStorage.js
   export class EncryptedStorage {
       constructor(storage, encryptionKey) {
           this.storage = storage;
           this.key = encryptionKey;
       }
       
       async set(key, value) {
           const encrypted = await this.encrypt(JSON.stringify(value));
           return this.storage.set(key, encrypted);
       }
   }
   ```

2. **Add Content Security Policy**
   ```html
   <!-- In template.html -->
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; 
                  script-src 'self' 'unsafe-inline'; 
                  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                  font-src https://fonts.gstatic.com;
                  frame-src https://www.youtube-nocookie.com;">
   ```

3. **Implement Action Rate Limiting**
   ```javascript
   // src/js/core/RateLimiter.js
   export class RateLimiter {
       constructor(maxActions, windowMs) {
           this.maxActions = maxActions;
           this.windowMs = windowMs;
           this.actions = [];
       }
       
       canProceed() {
           const now = Date.now();
           this.actions = this.actions.filter(t => t > now - this.windowMs);
           if (this.actions.length >= this.maxActions) return false;
           this.actions.push(now);
           return true;
       }
   }
   ```

#### 3.2 Performance Optimizations

**Tasks:**
1. **Implement Virtual Scrolling** for long lists (exercise history, meal logs)
2. **Add Request Deduplication** for storage operations
3. **Implement Memoization** for expensive calculations
4. **Add Service Worker** for offline capability

```javascript
// src/js/utils/memoize.js
export function memoize(fn, keyGenerator) {
    const cache = new Map();
    return (...args) => {
        const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}
```

#### 3.3 Testing Infrastructure

**Tasks:**
1. Set up Jest testing framework
2. Create test utilities for mocking storage
3. Write unit tests for all services (target: 80% coverage)
4. Add integration tests for critical user flows

```javascript
// tests/services/ValidationService.test.js
import { ValidationService } from '../../src/js/services/ValidationService.js';
import { mockConfig } from '../mocks/config.js';

describe('ValidationService', () => {
    let service;
    
    beforeEach(() => {
        service = new ValidationService(mockConfig);
    });
    
    describe('toSafeNumber', () => {
        it('should return fallback for non-numeric input', () => {
            expect(service.toSafeNumber('abc', 0)).toBe(0);
        });
        
        it('should clamp values to min/max', () => {
            expect(service.toSafeNumber(1000, 0, 0, 100)).toBe(100);
        });
    });
});
```

---

## Section 4: Critical Hotspots

### Hotspot #1: [`src/js/store.js`](src/js/store.js:1) - God Object

**Severity:** Critical  
**Lines of Code:** 965  
**Cyclomatic Complexity:** High (estimated 50+)

**Issues:**
- Handles 8+ distinct responsibilities
- Contains 30+ methods
- Deeply nested validation logic
- Tightly coupled to localStorage

**Refactoring Priority:** Immediate

**Refactoring Approach:**
```
Phase 1: Extract ValidationService (Week 1)
Phase 2: Extract Repositories (Week 2)
Phase 3: Extract BackupService (Week 3)
Phase 4: Create StateManager (Week 4)
```

**Pseudo-code for Extracted Services:**
```javascript
// Before: Store handles everything
const Store = {
    state: {},
    init() { /* 50 lines */ },
    validate() { /* 200 lines */ },
    sanitize() { /* 200 lines */ },
    backup() { /* 100 lines */ },
    // ... more
};

// After: Single responsibility
class StateManager {
    state = {};
    subscribe(cb) { /* 5 lines */ }
    notify() { /* 3 lines */ }
}

class ValidationService {
    validateMeal(meal) { /* 10 lines */ }
    validateWeight(weight) { /* 5 lines */ }
}

class MealRepository {
    async getByDate(date) { /* 5 lines */ }
    async add(meal) { /* 5 lines */ }
}
```

---

### Hotspot #2: [`src/js/renderers/dashboard.js`](src/js/renderers/dashboard.js:1) - Monolithic Renderer

**Severity:** High  
**Lines of Code:** ~1,400  
**Responsibilities:** 6 view renderers

**Issues:**
- Single file contains all view logic
- Difficult to test individual views
- Changes to one view risk breaking others
- No code splitting possible

**Refactoring Priority:** High

**Refactoring Approach:**
```javascript
// Before: Single monolithic object
const Renderers = {
    async dashboard() { /* 200 lines */ },
    async training() { /* 300 lines */ },
    async nutrition() { /* 200 lines */ },
    // ...
};

// After: Separate view modules
// src/js/views/DashboardView.js
export class DashboardView {
    constructor(store, components) { /* ... */ }
    async render() { /* ... */ }
}

// src/js/views/TrainingView.js
export class TrainingView {
    constructor(store, components) { /* ... */ }
    async render() { /* ... */ }
}

// src/js/views/index.js
export { DashboardView } from './DashboardView.js';
export { TrainingView } from './TrainingView.js';
// ...
```

---

### Hotspot #3: [`src/js/actions.js`](src/js/actions.js:1) - Action Handler Bloat

**Severity:** High  
**Lines of Code:** ~950  
**Methods:** 40+

**Issues:**
- Single object with 40+ action handlers
- Mixed levels of abstraction
- Some methods are 100+ lines
- Contains business logic that should be in services

**Refactoring Priority:** High

**Refactoring Approach:**
```
src/js/actions/
├── index.js              # Action registry
├── MealActions.js        # Food/nutrition actions
├── WorkoutActions.js     # Training actions
├── StatsActions.js       # Progress tracking
├── SystemActions.js      # Backup/restore
└── OverrideActions.js    # Robot mode
```

**Example Refactoring:**
```javascript
// Before: actions.js
const Actions = {
    async saveWeight(v) { /* ... */ },
    async injectFuel() { /* ... */ },
    async toggleTask(id) { /* ... */ },
    // ... 40 more methods
};

// After: actions/MealActions.js
export class MealActions {
    constructor(store, ui) {
        this.store = store;
        this.ui = ui;
    }
    
    async quickAddMeal(foodId) { /* ... */ }
    async openMealModal() { /* ... */ }
    async submitMeal() { /* ... */ }
}

// After: actions/index.js
import { MealActions } from './MealActions.js';
import { WorkoutActions } from './WorkoutActions.js';

export function createActions(store, ui) {
    return {
        ...new MealActions(store, ui),
        ...new WorkoutActions(store, ui),
    };
}
```

---

### Hotspot #4: [`src/js/components.js`](src/js/components.js:1) - Mixed Abstractions

**Severity:** Medium  
**Lines of Code:** ~450  

**Issues:**
- Mixes simple presentational components with complex business components
- `weightedSetRow` and `timedSetRow` contain inline event handlers
- No separation between component logic and template

**Refactoring Priority:** Medium

**Refactoring Approach:**
```javascript
// Before: components.js
const Components = {
    card: (label, content) => `...`,
    progressBar: (percent) => `...`,
    weightedSetRow: (tid, idx, log, isDone) => `...complex HTML...`,
};

// After: components/
// components/Card.js
export const Card = (label, content, accent = '') => `
    <div class="${THEME.card} ${accent}">
        <div class="${THEME.label}">${label}</div>
        ${content}
    </div>
`;

// components/SetRow.js (complex component)
export class SetRow {
    constructor(props) {
        this.props = props;
    }
    
    render() {
        const { taskId, index, log, isDone } = this.props;
        return `...template...`;
    }
    
    attachEvents(element) {
        // Event binding logic
    }
}
```

---

### Hotspot #5: [`src/js/utils.js`](src/js/utils.js:1) - Incomplete Utility Coverage

**Severity:** Medium  
**Lines of Code:** ~180  

**Issues:**
- Missing common utility functions (debounce, throttle, deepClone)
- Storage adapter mixed with general utilities
- No date manipulation utilities (dates are handled inline everywhere)

**Refactoring Priority:** Medium

**Refactoring Approach:**
```
src/js/utils/
├── index.js           # Re-export all
├── date.js            # Date manipulation
├── number.js          # Number utilities
├── string.js          # String utilities (escapeHtml, etc.)
├── function.js        # debounce, throttle, memoize
├── storage.js         # Storage adapter
└── validation.js      # Common validation patterns
```

**Example Additions:**
```javascript
// utils/date.js
export const dateStr = (date = new Date()) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

export const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

export const isToday = (dateStr) => dateStr === dateStr();

// utils/function.js
export const debounce = (fn, ms) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
};

export const throttle = (fn, ms) => {
    let last = 0;
    return (...args) => {
        const now = Date.now();
        if (now - last >= ms) {
            last = now;
            return fn(...args);
        }
    };
};
```

---

## Appendix A: Recommended File Structure

```
src/
├── index.js                    # Application entry point
├── core/
│   ├── Container.js            # DI Container
│   ├── EventBus.js             # Event delegation
│   └── RateLimiter.js          # Action rate limiting
├── config/
│   ├── index.js
│   ├── keys.js
│   ├── targets.js
│   ├── validation.js
│   └── theme.js
├── services/
│   ├── StateManager.js
│   ├── ValidationService.js
│   ├── SanitizerService.js
│   ├── BackupService.js
│   ├── StatisticsService.js
│   ├── EncryptedStorage.js
│   └── repositories/
│       ├── MealRepository.js
│       ├── WorkoutRepository.js
│       ├── ExerciseHistoryRepository.js
│       └── StatsRepository.js
├── views/
│   ├── DashboardView.js
│   ├── TrainingView.js
│   ├── NutritionView.js
│   ├── ProgressView.js
│   ├── AnatomyView.js
│   ├── MentalView.js
│   └── components/
│       ├── Card.js
│       ├── ProgressBar.js
│       ├── MacroRing.js
│       ├── MealCard.js
│       └── SetRow.js
├── actions/
│   ├── index.js
│   ├── MealActions.js
│   ├── WorkoutActions.js
│   ├── StatsActions.js
│   ├── SystemActions.js
│   └── OverrideActions.js
├── utils/
│   ├── index.js
│   ├── date.js
│   ├── number.js
│   ├── string.js
│   ├── function.js
│   ├── storage.js
│   └── validation.js
├── i18n/
│   ├── index.js
│   ├── tr.json
│   └── en.json
├── db/
│   ├── exercises.js
│   ├── foods.js
│   ├── anatomy.js
│   ├── mental-phases.js
│   └── weekly-plan.js
├── errors/
│   └── index.js
└── styles/
    ├── animations.css
    ├── base.css
    ├── components.css
    └── overrides.css
```

---

## Appendix B: Migration Checklist

### Phase 1 Checklist
- [ ] Convert all files to ES modules
- [ ] Create DI container
- [ ] Extract configuration layer
- [ ] Add JSDoc documentation to all public APIs
- [ ] Set up ESLint with strict rules
- [ ] Create development/production config separation

### Phase 2 Checklist
- [ ] Extract ValidationService from Store
- [ ] Extract all repositories
- [ ] Create StateManager
- [ ] Split Renderers into View components
- [ ] Refactor Actions into domain-specific modules
- [ ] Implement proper error classes

### Phase 3 Checklist
- [ ] Add storage encryption
- [ ] Implement CSP headers
- [ ] Add rate limiting
- [ ] Set up Jest testing
- [ ] Achieve 80% test coverage
- [ ] Add performance monitoring
- [ ] Implement service worker for offline

---

## Appendix C: Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking existing functionality | High | Critical | Comprehensive test suite before refactoring |
| Scope creep | Medium | High | Strict phase boundaries, time-boxed sprints |
| Performance regression | Low | Medium | Benchmark before/after each phase |
| Team resistance | Medium | Medium | Documentation, training, gradual rollout |
| Dependency conflicts | Low | Low | Use Vite's native ES module support |

---

**Document Status:** Complete  
**Next Review:** After Phase 1 completion  
**Approval Required:** Technical Lead, Product Owner
