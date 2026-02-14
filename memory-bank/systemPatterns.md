# Sistem Desenleri

## Mimari Genel Bakış

System Hardening Protocol, modüler bir mimariye geçiş yapmaktadır. Aşağıdaki desenler, refactoring sürecinde uygulanan ve uygulanacak olan tasarım desenlerini açıklamaktadır.

## Mevcut Desenler (Phase 3 Sonrası)

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

### 5. Repository Pattern ✅ NEW (Phase 3)

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

### 6. Storage Adapter Pattern ✅ NEW (Phase 3)

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

## Hedef Desenler (Gelecek Phases)

### 7. State Manager Pattern

**Amaç**: Merkezi state yönetimi ve change detection.

**Planlanan Uygulama**: Phase 4

```javascript
class StateManager {
    getState() { ... }
    setState(updates) { ... }
    subscribe(callback) { ... }
}

// Usage
const stateMgr = container.get('stateManager');
stateMgr.setState({ weight: 75 });
```

### 8. Service Layer Pattern

**Amaç**: Business logic'i UI'dan ayırmak.

**Planlanan Uygulama**: Phase 5

```javascript
// Services
class ValidationService {
    validateWeight(value) { ... }
    sanitizeInput(input) { ... }
}

class BackupService {
    async exportData() { ... }
    async importData(data) { ... }
}

class StatisticsService {
    getVolumeStats(exerciseId) { ... }
    getWeeklySummary() { ... }
}
```

### 9. View Component Pattern

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
│           Service Layer                  │
│  (Validation, Backup, Statistics)       │
├─────────────────────────────────────────┤
│         Repository Layer ✅ NEW          │
│  (WeightRepo, WorkoutRepo, MealRepo)    │
├─────────────────────────────────────────┤
│        Infrastructure Layer ✅ NEW       │
│  (StorageAdapter, LocalStorage, Memory) │
├─────────────────────────────────────────┤
│           Core Layer                     │
│  (Container, EventBus, StateMgr)        │
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
├── infrastructure/          # Storage layer ✅ NEW
│   ├── StorageAdapter.js    # Abstract interface
│   ├── LocalStorageAdapter.js
│   ├── MemoryStorageAdapter.js
│   └── index.js             # Exports
├── repositories/            # Data access layer ✅ NEW
│   ├── BaseRepository.js    # Base class
│   ├── WeightRepository.js  # Weight data
│   ├── WorkoutRepository.js # Workout data
│   ├── MealRepository.js    # Meal data
│   └── index.js             # Exports
├── services/                # Business logic (Phase 5)
├── views/                   # UI components (Phase 6)
└── actions/                 # Event handlers (Phase 6)
```
