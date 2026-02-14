# Sistem Desenleri

## Mimari Genel Bakış

System Hardening Protocol, modüler bir mimariye geçiş yapmaktadır. Aşağıdaki desenler, refactoring sürecinde uygulanan ve uygulanacak olan tasarım desenlerini açıklamaktadır.

## Mevcut Desenler (Phase 1 Sonrası)

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

## Hedef Desenler (Gelecek Phases)

### 5. Repository Pattern

**Amaç**: Veri erişim katmanını soyutlamak.

**Planlanan Uygulama**: Phase 3

```javascript
// Repository interface
class MealRepository {
    async getByDate(date) { ... }
    async add(date, meal) { ... }
    async delete(date, index) { ... }
}

// Usage
const mealRepo = container.get('mealRepository');
const meals = await mealRepo.getByDate('2026-02-14');
```

### 6. State Manager Pattern

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

### 7. Service Layer Pattern

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

### 8. View Component Pattern

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
│         Repository Layer                 │
│  (MealRepo, WorkoutRepo, etc.)          │
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
├── services/       # Service tests (future)
├── repositories/   # Repository tests (future)
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
