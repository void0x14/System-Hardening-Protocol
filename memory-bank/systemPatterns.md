# Sistem Desenleri

## Mimari Genel Bakış

System Hardening Protocol, modüler bir mimariye geçiş yapmaktadır. Aşağıdaki desenler, refactoring sürecinde uygulanan ve uygulanacak olan tasarım desenlerini açıklamaktadır.

## Mevcut Desenler (Phase 4 Sonrası)

### 1. Dependency Injection (DI) Container

**Amaç**: Bağımlılıkların yönetimini merkezi hale getirmek ve loose coupling sağlamak.

**Uygulama**: `src/js/core/Container.js`

```javascript
// Container kullanımı
const container = new Container();

// Singleton service
container.register('config', () => new Config());

// Service with dependencies
container.register('store', (c) => new Store(c.get('config')));

// Transient service (new instance each time)
container.register('logger', () => new Logger(), 'transient');

// Resolution
const store = container.get('store');
```

**Lifecycle Türleri**:
- `singleton` (default): Tek instance, tüm isteklerde paylaşılır
- `transient`: Her istekte yeni instance

**Avantajlar**:
- Test edilebilirlik (mock injection)
- Bağımlılık yönetimi
- Lazy instantiation
- Service isolation

### 2. Event Bus (Pub/Sub Pattern)

**Amaç**: Bileşenler arası gevşek bağlı iletişim sağlamak.

**Uygulama**: `src/js/core/EventBus.js`

```javascript
const eventBus = new EventBus();

// Subscribe
const unsubscribe = eventBus.on('store:change', (state) => {
    console.log('State changed:', state);
});

// One-time subscription
eventBus.once('app:ready', () => initializeApp());

// Emit
eventBus.emit('store:change', newState);

// Cleanup
unsubscribe();
```

**Event Naming Convention**:
- `entity:action` formatı
- Örnekler: `user:login`, `store:change`, `workout:complete`

**Avantajlar**:
- Decoupled communication
- Easy testing
- Runtime flexibility
- Memory management (unsubscribe)

### 3. Factory Pattern

**Amaç**: Karmaşık nesne oluşturumunu kapsüllemek.

**Uygulama**: `src/js/components.js`

```javascript
// Component factory
Components.card({ title: 'Title', content: '...' });
Components.progressBar({ value: 75, max: 100 });
```

**Mevcut Component'ler**:
- `card()` - Kart bileşeni
- `progressBar()` - İlerleme çubuğu
- `statCard()` - İstatistik kartı
- `toggle()` - Toggle switch
- `input()` - Input alanı
- `select()` - Select dropdown
- `button()` - Buton
- `badge()` - Rozet
- `iconButton()` - İkonlu buton
- `macroRing()` - Makro halkası
- `mealCard()` - Öğün kartı
- `setRow()` - Set satırı

### 4. Module Pattern (ES Modules)

**Amaç**: Kod organizasyonu ve namespace yönetimi.

**Uygulama**: Tüm yeni dosyalar ES module formatında

```javascript
// Export
export { Container } from './Container.js';
export { EventBus } from './EventBus.js';

// Import
import { Container, EventBus } from './core/index.js';
```

### 5. Repository Pattern (Phase 3)

**Amaç**: Veri erişim katmanını soyutlamak ve business logic'den ayırmak.

**Uygulama**: `src/js/repositories/`

```javascript
// Base Repository
class BaseRepository {
    constructor(storage, keyPrefix) { ... }
    async get(key) { ... }
    async set(key, value) { ... }
    async delete(key) { ... }
    async getAll() { ... }
    async find(predicate) { ... }
}

// Concrete Repository
class WeightRepository extends BaseRepository {
    async getCurrentWeight() { ... }
    async saveWeight(weight, date) { ... }
    async getHistory() { ... }
    async getStatistics() { ... }
}

// Usage
const weightRepo = new WeightRepository(storage);
await weightRepo.saveWeight(75.5, '2026-02-14');
const history = await weightRepo.getHistory();
```

**Mevcut Repository'ler**:
- `WeightRepository` - Kilo verisi (history, current weight, statistics)
- `WorkoutRepository` - Antrenman verisi (logs, exercise history, PRs)
- `MealRepository` - Beslenme verisi (meals, custom foods, daily plan)

**Avantajlar**:
- Single Responsibility Principle
- Test edilebilirlik (mock repository)
- Storage backend değişikliği kolaylığı
- Query logic merkezi yönetim

### 6. Storage Adapter Pattern (Phase 3)

**Amaç**: Farklı storage backend'leri için tutarlı API sağlamak.

**Uygulama**: `src/js/infrastructure/`

```javascript
// Abstract Interface
class StorageAdapter {
    async get(key) { throw new Error('Not implemented'); }
    async set(key, value) { throw new Error('Not implemented'); }
    async remove(key) { throw new Error('Not implemented'); }
    async clear() { throw new Error('Not implemented'); }
    async keys() { throw new Error('Not implemented'); }
    async has(key) { throw new Error('Not implemented'); }
}

// Concrete Implementation
class LocalStorageAdapter extends StorageAdapter {
    async get(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    async set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }
}

// Usage
const storage = new LocalStorageAdapter({ prefix: 'monk_' });
await storage.set('weight', 75.5);
const weight = await storage.get('weight');
```

**Mevcut Adapter'ler**:
- `LocalStorageAdapter` - Browser localStorage (production)
- `MemoryStorageAdapter` - In-memory storage (testing)

**Avantajlar**:
- Dependency Inversion Principle
- Easy testing (MemoryStorage)
- Future extensibility (IndexedDB, Cloud)
- Consistent error handling

### 7. State Manager Pattern ✅ NEW (Phase 4)

**Amaç**: Merkezi state yönetimi, change detection ve predictable state updates.

**Uygulama**: `src/js/state/StateManager.js`

```javascript
import { StateManager, initialState, rootReducer } from './state/index.js';

// Create store
const store = new StateManager(initialState, rootReducer);

// Get state (immutable copy)
const state = store.getState();
const weight = store.select(state => state.weight);

// Subscribe to all changes
const unsubscribe = store.subscribe((prev, next, action) => {
    console.log('State changed:', action.type);
});

// Subscribe to specific state changes
store.subscribeTo(
    state => state.weight,
    (newWeight, oldWeight) => console.log('Weight:', oldWeight, '->', newWeight)
);

// Dispatch actions
store.dispatch({ type: 'SET_WEIGHT', payload: 75.5 });

// Cleanup
unsubscribe();
```

**Özellikler**:
- Immutable state (deep cloning)
- Middleware support
- Selectors for derived state
- Subscription management
- Action dispatch pattern

**Avantajlar**:
- Predictable state changes
- Time-travel debugging (future)
- Easy testing
- Decoupled UI updates

### 8. Reducer Pattern ✅ NEW (Phase 4)

**Amaç**: State transformation logic'ini kapsüllemek ve test edilebilir kılmak.

**Uygulama**: `src/js/state/reducers.js`

```javascript
// Action Types
const ActionTypes = {
    SET_WEIGHT: 'SET_WEIGHT',
    ADD_MEAL: 'ADD_MEAL',
    TOGGLE_TASK: 'TOGGLE_TASK',
    // ... 30+ action types
};

// Reducer Function
export function weightReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_WEIGHT:
            return { ...state, weight: action.payload };
        case ActionTypes.SAVE_WEIGHT:
            return {
                ...state,
                weight: action.payload.weight,
                weightHistory: {
                    ...state.weightHistory,
                    [action.payload.date]: action.payload.weight
                }
            };
        default:
            return state;
    }
}

// Root Reducer combines all
export function rootReducer(state, action) {
    let newState = state;
    newState = weightReducer(newState, action);
    newState = mealReducer(newState, action);
    newState = workoutReducer(newState, action);
    // ...
    return newState;
}
```

**Mevcut Reducer'lar**:
- `weightReducer` - Weight state changes
- `mealReducer` - Meal/food state changes
- `workoutReducer` - Workout/exercise state changes
- `mentalReducer` - Mental progress state changes
- `statsReducer` - Statistics state changes
- `uiReducer` - UI state changes
- `systemReducer` - System state changes

**Avantajlar**:
- Pure functions (testable)
- Predictable state changes
- Easy to add new features
- Separation of concerns

### 9. Middleware Pattern ✅ NEW (Phase 4)

**Amaç**: Cross-cutting concerns'ları action processing'den ayırmak.

**Uygulama**: `src/js/state/middleware.js`

```javascript
// Logging middleware
const loggingMiddleware = (store, next, action) => {
    console.log('Dispatching:', action.type);
    const result = next(action);
    console.log('New state:', store.getState());
    return result;
};

// Persistence middleware
const persistenceMiddleware = (storage) => (store, next, action) => {
    const result = next(action);
    storage.set('state', store.getState());
    return result;
};

// Add to store
store.addMiddleware(loggingMiddleware);
store.addMiddleware(persistenceMiddleware(localStorage));
```

**Mevcut Middleware'ler**:
- `loggingMiddleware` - Development logging
- `silentLoggingMiddleware` - Production error logging
- `persistenceMiddleware` - Auto-save to storage
- `throttleMiddleware` - Rate limiting
- `debounceMiddleware` - Debounce rapid updates
- `validationMiddleware` - Action validation
- `errorMiddleware` - Error handling
- `transformMiddleware` - Action transformation
- `timingMiddleware` - Performance monitoring
- `batchMiddleware` - Batch multiple actions
- `composeMiddleware` - Combine middlewares

**Avantajlar**:
- Cross-cutting concerns isolation
- Easy to add/remove features
- Testable independently
- Flexible composition

## Hedef Desenler (Gelecek Phases)

### 10. Service Layer Pattern ✅ COMPLETED (Phase 5)

**Amaç**: Business logic'i UI'dan ayırmak.

**Uygulama**: `src/js/services/`

```javascript
// ValidationService - Data validation and sanitization
class ValidationService {
    toSafeNumber(value, fallback, min, max) { ... }
    sanitizeDateString(value) { ... }
    sanitizeMealEntry(entry) { ... }
    sanitizeImportedData(data) { ... }
}

// BackupService - Export/import functionality
class BackupService {
    async exportData() { ... }
    async importData(data) { ... }
    async checkBackupStatus() { ... }
}

// StatisticsService - Metrics and analytics
class StatisticsService {
    async getVolumeStats() { ... }
    async getWeeklySummary() { ... }
    async getProgressData() { ... }
}

// ExerciseHistoryService - Exercise history tracking
class ExerciseHistoryService {
    async saveToHistory(exerciseId, weight, reps) { ... }
    async getPersonalBest(exerciseId) { ... }
    async checkForPR(exerciseId, weight, reps) { ... }
}

// StreakService - Streak management
class StreakService {
    async getStreak() { ... }
    async updateStreak() { ... }
    calculateStreak(dates) { ... }
}

// Usage with ServiceContainer
import { createServices } from './services/index.js';

const services = createServices({
    storage: localStorageAdapter,
    config: appConfig,
    weeklyPlan: WEEKLY_PLAN
});

await services.streak.getStreak();
await services.statistics.getVolumeStats();
```

**Avantajlar**:
- Single Responsibility Principle
- Test edilebilirlik (mock services)
- Business logic isolation
- Dependency injection support

### 11. View Component Pattern

**Amaç**: UI render logic'ini modüler hale getirmek.

**Planlanan Uygulama**: Phase 6

```javascript
// Base View class
class View {
    constructor(store, components, eventBus) { ... }
    render() { ... }
    gatherData() { ... }
}

// Concrete views
class DashboardView extends View {
    render() {
        const data = this.gatherData();
        return this.template(data);
    }
}
```

## Katmanlı Mimari

```
┌─────────────────────────────────────────┐
│              View Layer                  │
│  (DashboardView, TrainingView, etc.)    │
├─────────────────────────────────────────┤
│            Action Layer                  │
│  (MealActions, WorkoutActions, etc.)    │
├─────────────────────────────────────────┤
│           Service Layer ✅ NEW           │
│  (Validation, Backup, Statistics)       │
├─────────────────────────────────────────┤
│         State Layer ✅                   │
│  (StateManager, Reducers, Middleware)   │
├─────────────────────────────────────────┤
│         Repository Layer                 │
│  (WeightRepo, WorkoutRepo, MealRepo)    │
├─────────────────────────────────────────┤
│        Infrastructure Layer              │
│  (StorageAdapter, LocalStorage, Memory) │
├─────────────────────────────────────────┤
│           Core Layer                     │
│  (Container, EventBus)                  │
└─────────────────────────────────────────┘
```

## Bağımlılık Akışı

```
Container
    ↓
EventBus ←→ StateManager
    ↓           ↓
Services ←→ Repositories
    ↓           ↓
    └─────→ Infrastructure (Storage)
    ↓
Views/Actions
```

## Service Layer Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Service Layer                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │ValidationService│  │  BackupService  │               │
│  │ - toSafeNumber  │  │ - exportData    │               │
│  │ - sanitizeDate  │  │ - importData    │               │
│  │ - sanitizeMeal  │  │ - validateImport│               │
│  └────────┬────────┘  └────────┬────────┘               │
│           │                    │                         │
│  ┌────────▼────────┐  ┌───────▼─────────┐               │
│  │StatisticsService│  │ExerciseHistory  │               │
│  │ - getVolumeStats│  │    Service      │               │
│  │ - getSleepStats │  │ - saveToHistory │               │
│  │ - getWeeklySum  │  │ - getPersonalBest│              │
│  └────────┬────────┘  └───────┬─────────┘               │
│           │                    │                         │
│           └──────────┬─────────┘                         │
│                      │                                   │
│              ┌───────▼───────┐                           │
│              │ StreakService │                           │
│              │ - getStreak   │                           │
│              │ - updateStreak│                           │
│              │ - calcStreak  │                           │
│              └───────┬───────┘                           │
│                      │                                   │
│                      ▼                                   │
│              ┌───────────────┐                           │
│              │  Repositories │                           │
│              │  & Storage    │                           │
│              └───────────────┘                           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## State Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    State Flow                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   Action ──→ Middleware ──→ Reducer ──→ New State       │
│     │            │             │            │            │
│     │            │             │            │            │
│     │            ▼             │            │            │
│     │      ┌─────────┐        │            │            │
│     │      │ Logging │        │            │            │
│     │      │Persist. │        │            │            │
│     │      │Validate │        │            │            │
│     │      └─────────┘        │            │            │
│     │                         │            │            │
│     │                         ▼            │            │
│     │                   ┌──────────┐       │            │
│     │                   │ Reducers │       │            │
│     │                   │  weight  │       │            │
│     │                   │  meal    │       │            │
│     │                   │ workout  │       │            │
│     │                   └──────────┘       │            │
│     │                                      │            │
│     └──────────────────────────────────────┘            │
│                                     │                    │
│                                     ▼                    │
│                              ┌───────────┐              │
│                              │  Notify   │              │
│                              │ Listeners │              │
│                              └───────────┘              │
│                                     │                    │
│                                     ▼                    │
│                              ┌───────────┐              │
│                              │    UI     │              │
│                              │  Updates  │              │
│                              └───────────┘              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Test Desenleri

### Unit Testing
- Her modül için ayrı test dosyası
- Mock storage adapter kullanımı
- Assertion library (custom)

### Test Organization
```
tests/
├── assert.js       # Assertion functions
├── runner.js       # Test runner
├── reporter.js     # Output formatting
├── mocks/          # Mock implementations
│   └── storage.js
├── core/           # Core module tests
│   ├── Container.test.js
│   └── EventBus.test.js
├── state/          # State module tests (future)
├── infrastructure/ # Infrastructure tests (future)
├── repositories/   # Repository tests (future)
├── services/       # Service tests (future)
└── views/          # View tests (future)
```

## Zero Dependencies İlkesi

Tüm desenler pure vanilla JavaScript ile uygulanır:
- ❌ React, Vue, Angular
- ❌ Redux, MobX, Zustand
- ❌ Jest, Mocha, Vitest
- ❌ Lodash, Underscore
- ✅ Native ES Modules
- ✅ Native Web APIs
- ✅ Custom implementations

## Performans Desenleri

### Lazy Loading (Planlanan)
```javascript
// Dynamic import for views
const MentalView = await import('./views/MentalView.js');
```

### Memoization (Planlanan)
```javascript
const memoizedStats = memoize(calculateStats);
```

### Virtual Scrolling (Planlanan)
```javascript
// For long lists
const virtualList = new VirtualList({ itemHeight: 40 });
```

## Güvenlik Desenleri

### Input Validation
```javascript
// Validation service (Phase 5)
if (isNaN(weight) || weight <= 0 || weight > 300) {
    throw new Error('Invalid weight');
}
```

### XSS Prevention
```javascript
// Sanitize user input before rendering
const sanitized = sanitize(userInput);
```

### Data Integrity
```javascript
// Schema validation on import
validateImportedData(data);
```

## Repository-Storage İlişkisi

```
┌──────────────────────────────────────────────────────┐
│                   Application                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │ WeightRepo      │  │ WorkoutRepo     │          │
│  │ - saveWeight()  │  │ - addExercise() │          │
│  │ - getHistory()  │  │ - getPRs()      │          │
│  └────────┬────────┘  └────────┬────────┘          │
│           │                    │                    │
│           └──────────┬─────────┘                    │
│                      │                              │
│              ┌───────▼───────┐                      │
│              │ StorageAdapter │ (Interface)         │
│              └───────┬───────┘                      │
│                      │                              │
│         ┌────────────┼────────────┐                 │
│         │            │            │                 │
│  ┌──────▼──────┐ ┌───▼────┐ ┌────▼─────┐          │
│  │LocalStorage │ │ Memory │ │ IndexedDB│          │
│  │  Adapter    │ │Adapter │ │ (future) │          │
│  └─────────────┘ └────────┘ └──────────┘          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Dosya Organizasyonu

```
src/js/
├── core/                    # Core infrastructure
│   ├── Container.js         # DI Container
│   ├── EventBus.js          # Event Bus
│   └── index.js             # Exports
├── config/                  # Configuration
│   ├── keys.js              # Storage keys
│   ├── validation.js        # Validation limits
│   ├── targets.js           # Fitness targets
│   ├── theme.js             # UI theme
│   └── index.js             # ConfigService
├── state/                   # State management
│   ├── StateManager.js      # Core state container
│   ├── initialState.js      # Default state values
│   ├── reducers.js          # State transformation
│   ├── middleware.js        # Cross-cutting concerns
│   └── index.js             # Exports
├── infrastructure/          # Storage layer
│   ├── StorageAdapter.js    # Abstract interface
│   ├── LocalStorageAdapter.js
│   ├── MemoryStorageAdapter.js
│   └── index.js             # Exports
├── repositories/            # Data access layer
│   ├── BaseRepository.js    # Base class
│   ├── WeightRepository.js  # Weight data
│   ├── WorkoutRepository.js # Workout data
│   ├── MealRepository.js    # Meal data
│   └── index.js             # Exports
├── services/                # Business logic layer ✅ NEW
│   ├── ValidationService.js # Data validation
│   ├── BackupService.js     # Export/import
│   ├── StatisticsService.js # Metrics/analytics
│   ├── ExerciseHistoryService.js # History tracking
│   ├── StreakService.js     # Streak management
│   └── index.js             # Exports & factories
├── views/                   # UI components (Phase 6)
└── actions/                 # Event handlers (Phase 6)
```
