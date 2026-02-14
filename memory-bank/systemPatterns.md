# Sistem Desenleri

## Mimari Genel Bakış

System Hardening Protocol, modüler bir mimariye geçiş yapmaktadır. Aşağıdaki desenler, refactoring sürecinde uygulanan ve uygulanacak olan tasarım desenlerini açıklamaktadır.

## Mevcut Desenler (Phase 8 Sonrası - FINAL)

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

### 7. State Manager Pattern (Phase 4)

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

### 8. Reducer Pattern (Phase 4)

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

### 9. Middleware Pattern (Phase 4)

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

### 10. Service Layer Pattern (Phase 5)

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

### 11. View Component Pattern (Phase 6)

**Amaç**: UI render logic'ini modüler hale getirmek.

**Uygulama**: `src/js/views/`

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

**Mevcut Views**:
- `DashboardView` - Ana dashboard
- `TrainingView` - Antrenman sekmesi
- `NutritionView` - Beslenme sekmesi
- `ProgressView` - İlerleme sekmesi
- `AnatomyView` - Anatomi lab
- `MentalView` - Zihinsel sağlık sekmesi

### 12. Cache Pattern ✅ NEW (Phase 8)

**Amaç**: Expensive computation'ları ve data fetch'lerini cache'lemek.

**Uygulama**: `src/js/performance/CacheService.js`

```javascript
import { CacheService } from './performance/index.js';

const cache = new CacheService({ 
    defaultTTL: 60000,  // 1 dakika
    maxSize: 1000       // Max 1000 entry
});

// Basit cache
cache.set('user:123', userData);
const user = cache.get('user:123');

// Cache-aside pattern
const data = await cache.getOrSet('expensive:key', async () => {
    return await fetchExpensiveData();
}, 30000);

// Tag-based grouping
cache.set('temp:data', value, 5000, 'temporary');
cache.deleteByTag('temporary');

// İstatistikler
const stats = cache.getStats();
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
```

**Özellikler**:
- TTL (Time-to-live) desteği
- LRU eviction (max size)
- Tag-based grouping
- Statistics tracking
- Automatic cleanup

**Avantajlar**:
- Reduced API calls
- Faster UI response
- Memory management
- Debugging support

### 13. Memoization Pattern ✅ NEW (Phase 8)

**Amaç**: Fonksiyon sonuçlarını cache'lemek ve tekrarlı hesaplamaları önlemek.

**Uygulama**: `src/js/performance/Memoize.js`

```javascript
import { memoize, memoizeAsync, memoizeWith } from './performance/index.js';

// Basit memoizasyon
const expensiveCalc = memoize((n) => {
    return complexComputation(n);
}, { ttl: 60000, maxSize: 100 });

expensiveCalc(100); // Hesaplar
expensiveCalc(100); // Cache'den döner

// Custom key function
const fetchUser = memoizeWith(
    (id) => `user:${id}`,
    async (id) => fetchUserFromAPI(id)
);

// Async memoizasyon
const fetchData = memoizeAsync(async (url) => {
    const res = await fetch(url);
    return res.json();
}, { ttl: 300000 });

// İstatistikler
console.log(expensiveCalc.getStats());
```

**Mevcut Memoize Türleri**:
- `memoize()` - Basit memoizasyon
- `memoizeWith()` - Custom key function
- `memoizeAsync()` - Async fonksiyonlar için
- `memoizeWeak()` - WeakMap ile object memoizasyonu
- `memoizeThrottled()` - Throttle + memoize

**Avantajlar**:
- Performance optimization
- Reduced computation
- Easy to apply
- Debugging support

### 14. Virtual Scrolling Pattern ✅ NEW (Phase 8)

**Amaç**: Büyük listeleri verimli render etmek.

**Uygulama**: `src/js/performance/VirtualList.js`

```javascript
import { VirtualList } from './performance/index.js';

const list = new VirtualList(container, {
    itemHeight: 50,
    itemCount: 10000,
    buffer: 5,
    renderItem: (index) => {
        const div = document.createElement('div');
        div.textContent = `Item ${index}`;
        return div;
    }
});

// Scroll to index
list.scrollToIndex(500);

// Update items
list.setItems(newItems);

// Keyboard navigation
// Arrow Up/Down, Page Up/Down, Home/End
```

**Özellikler**:
- Only visible items rendered
- Buffer zone for smooth scrolling
- Keyboard navigation
- ResizeObserver integration
- ARIA accessibility

**Avantajlar**:
- Handles 100,000+ items
- Smooth scrolling
- Low memory usage
- Fast initial render

### 15. Lazy Loading Pattern ✅ NEW (Phase 8)

**Amaç**: Kaynakları ihtiyaç duyulduğunda yüklemek.

**Uygulama**: `src/js/performance/LazyLoader.js`

```javascript
import { LazyLoader, LazyImage, LazyComponent } from './performance/index.js';

// Genel lazy loading
const loader = new LazyLoader({
    rootMargin: '100px',
    threshold: 0.1,
    onLoad: (el) => console.log('Loaded:', el)
});

loader.observe(document.querySelectorAll('.lazy'));

// Lazy resimler
const lazyImg = new LazyImage({
    placeholder: '/placeholder.jpg',
    fadeIn: true,
    fadeInDuration: 300
});

const img = lazyImg.create('/images/photo.jpg', { alt: 'Photo' });
container.appendChild(img);

// Lazy bileşenler
const lazyComp = new LazyComponent({
    placeholder: '<div class="skeleton">Loading...</div>',
    loader: async (el) => {
        const module = await import('./HeavyComponent.js');
        module.render(el);
    }
});
```

**Özellikler**:
- IntersectionObserver-based
- Placeholder support
- Fade-in effects
- Preloading support
- Error handling

**Avantajlar**:
- Faster initial load
- Reduced bandwidth
- Better UX
- SEO friendly

### 16. Debounce/Throttle Pattern ✅ NEW (Phase 8)

**Amaç**: Fonksiyon çağrılarını rate-limit etmek.

**Uygulama**: `src/js/performance/index.js`

```javascript
import { debounce, throttle, rafThrottle } from './performance/index.js';

// Debounce - son çağrıyı çalıştır
const debouncedSearch = debounce((query) => {
    fetchResults(query);
}, 300);

input.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});

// Throttle - belirli aralıklarla çalıştır
const throttledScroll = throttle((pos) => {
    updateUI(pos);
}, 100);

window.addEventListener('scroll', () => {
    throttledScroll(window.scrollY);
});

// RAF throttle - animasyon frame'inde çalıştır
const rafScroll = rafThrottle((pos) => {
    updateAnimation(pos);
});
```

**Avantajlar**:
- Reduced function calls
- Better performance
- Smoother UX
- Memory efficient

## Katmanlı Mimari

```
┌─────────────────────────────────────────┐
│              View Layer                  │
│  (DashboardView, TrainingView, etc.)    │
├─────────────────────────────────────────┤
│            Action Layer                  │
│  (MealActions, WorkoutActions, etc.)    │
├─────────────────────────────────────────┤
│           Service Layer                  │
│  (Validation, Backup, Statistics)       │
├─────────────────────────────────────────┤
│         State Layer                      │
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
├─────────────────────────────────────────┤
│       Performance Layer ✅ NEW           │
│  (Cache, Memoize, VirtualList, Lazy)    │
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
    ↓
Performance (Cache, Memoize, VirtualList, LazyLoader)
```

## Performance Layer Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  Performance Layer                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │  CacheService   │  │    Memoize      │               │
│  │ - set/get       │  │ - memoize       │               │
│  │ - getOrSet      │  │ - memoizeAsync  │               │
│  │ - TTL support   │  │ - memoizeWith   │               │
│  │ - Tag grouping  │  │ - memoizeWeak   │               │
│  └────────┬────────┘  └────────┬────────┘               │
│           │                    │                         │
│  ┌────────▼────────┐  ┌───────▼─────────┐               │
│  │  VirtualList    │  │   LazyLoader    │               │
│  │ - Virtual scroll│  │ - Lazy images   │               │
│  │ - Keyboard nav  │  │ - Lazy comp.    │               │
│  │ - ResizeObserver│  │ - Intersection  │               │
│  └────────┬────────┘  └───────┬─────────┘               │
│           │                    │                         │
│           └──────────┬─────────┘                         │
│                      │                                   │
│              ┌───────▼───────┐                           │
│              │   Utilities   │                           │
│              │ - debounce    │                           │
│              │ - throttle    │                           │
│              │ - rafThrottle │                           │
│              │ - batch       │                           │
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
├── state/          # State module tests
│   ├── StateManager.test.js
│   ├── reducers.test.js
│   └── middleware.test.js
├── infrastructure/ # Infrastructure tests
│   ├── LocalStorageAdapter.test.js
│   └── MemoryStorageAdapter.test.js
├── repositories/   # Repository tests
│   ├── WeightRepository.test.js
│   ├── WorkoutRepository.test.js
│   └── MealRepository.test.js
├── services/       # Service tests
│   ├── ValidationService.test.js
│   ├── BackupService.test.js
│   └── StatisticsService.test.js
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

## Güvenlik Desenleri

### Input Validation
```javascript
// Validation service
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
├── services/                # Business logic layer
│   ├── ValidationService.js # Data validation
│   ├── BackupService.js     # Export/import
│   ├── StatisticsService.js # Metrics/analytics
│   ├── ExerciseHistoryService.js # History tracking
│   ├── StreakService.js     # Streak management
│   └── index.js             # Exports & factories
├── views/                   # UI view layer
│   ├── DashboardView.js     # Main dashboard
│   ├── TrainingView.js      # Training tab
│   ├── NutritionView.js     # Nutrition tab
│   ├── ProgressView.js      # Progress tab
│   ├── AnatomyView.js       # Anatomy lab
│   ├── MentalView.js        # Mental health tab
│   └── index.js             # Exports & factories
├── components/              # Reusable UI components
│   ├── Card.js              # Card container
│   ├── ProgressBar.js       # Progress indicators
│   ├── MacroRing.js         # Nutrition rings
│   ├── Modal.js             # Modal dialogs
│   ├── Toast.js             # Notifications
│   ├── MealCard.js          # Meal display
│   ├── SetRow.js            # Exercise sets
│   └── index.js             # Exports & factories
├── performance/             # Performance optimization ✅ NEW
│   ├── CacheService.js      # In-memory caching
│   ├── Memoize.js           # Function memoization
│   ├── VirtualList.js       # Virtual scrolling
│   ├── LazyLoader.js        # Lazy loading
│   └── index.js             # Exports & utilities
└── actions/                 # Event handlers
```

## Performans Optimizasyonu Özeti

| Pattern | Kullanım | Fayda |
|---------|----------|-------|
| CacheService | API responses, expensive data | Reduced API calls, faster UI |
| Memoize | Expensive computations | Reduced CPU usage |
| VirtualList | Large lists (1000+ items) | Smooth scrolling, low memory |
| LazyLoader | Images, components | Faster initial load |
| debounce | Search inputs, resize | Reduced function calls |
| throttle | Scroll, mousemove | Smoother performance |
| rafThrottle | Animations | 60fps smooth |

