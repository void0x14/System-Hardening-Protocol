# Teknik Bağlam

## Teknolojiler
- **HTML5**: Tek dosya yapısı (`dist/index.html` — build output)
- **CSS**: Tailwind CSS (CDN) + özel stiller (4 modüler CSS dosyası)
- **JavaScript**: Vanilla JS, ES6+ async/await (15 modüler dosya)
- **Fontlar**: JetBrains Mono, Orbitron, Inter (Google Fonts CDN)
- **İkonlar**: Font Awesome 6.4 (CDN)

## Paket Yönetimi
- **pnpm**: Proje paket yöneticisi (`packageManager` field ile sabitlenmiş)
- **i18n Service**: Zero-dependency internationalization (Turkish/English) with JSON-based locale files.
- **Zero-Dependency Goal**: Pure Vanilla JS/CSS architecture, no external libraries for logic or core functions.

## Build Sistemi
- **Yaklaşım**: Build-time bundling (modüler src → tek dist/index.html)
- **Build Script**: `src/build.js` — Node.js built-in `fs`/`path` ile
- **Girdi**: `src/template.html` + `src/js/*.js` + `src/styles/*.css`
- **Çıktı**: `dist/index.html` (~208 KB)
- **Bağımlılık**: Sadece Node.js runtime (harici npm paketi yok)

## Test Altyapısı (Phase 0-7)

### Test Framework
- **Yaklaşım**: Custom-built test framework (Zero Dependencies)
- **Test Runner**: `tests/runner.js` - describe/it pattern
- **Assertion Library**: `tests/assert.js` - 18 assertion fonksiyonu
- **Reporter**: `tests/reporter.js` - Console output formatting
- **Entry Point**: `tests/run-all.js` - Runs all tests with CLI options

### Test Dizin Yapısı
```
tests/
├── runner.js           # Custom test runner (describe/it pattern)
├── assert.js           # Assertion library (18 functions)
├── reporter.js         # Test reporter (console output)
├── run-all.js          # Test runner entry point
├── core/
│   ├── Container.test.js    # DI Container tests
│   └── EventBus.test.js     # Event Bus tests
├── mocks/
│   └── storage.js      # Mock localStorage adapter
├── services/
│   ├── ValidationService.test.js  # Validation tests (60+ cases)
│   ├── BackupService.test.js      # Backup/restore tests
│   └── StatisticsService.test.js  # Statistics tests
├── repositories/
│   ├── WeightRepository.test.js   # Weight data tests
│   ├── WorkoutRepository.test.js  # Workout data tests
│   └── MealRepository.test.js     # Meal data tests
├── state/
│   ├── StateManager.test.js       # State management tests
│   ├── reducers.test.js           # Reducer tests
│   └── middleware.test.js         # Middleware tests
├── infrastructure/
│   ├── LocalStorageAdapter.test.js  # localStorage tests
│   └── MemoryStorageAdapter.test.js # Memory storage tests
└── views/              # View tests (placeholder)
```

### Test Coverage (Phase 7)
- **Core Tests**: Container, EventBus (Phase 1)
- **Service Tests**: ValidationService, BackupService, StatisticsService
- **Repository Tests**: WeightRepository, WorkoutRepository, MealRepository
- **State Tests**: StateManager, reducers, middleware
- **Infrastructure Tests**: LocalStorageAdapter, MemoryStorageAdapter
- **Total Test Cases**: 200+

### Assertion Fonksiyonları
- `assertEqual(actual, expected)` - Strict equality (===)
- `assertTrue(value)` - Truthy kontrolü
- `assertFalse(value)` - Falsy kontrolü
- `assertDeepEqual(actual, expected)` - JSON comparison
- `assertThrows(fn)` - Fonksiyon hata fırlatmalı
- `assertThrowsType(fn, ErrorType)` - Belirli hata tipi
- `assertNull(value)` / `assertNotNull(value)`
- `assertUndefined(value)` / `assertDefined(value)`
- `assertInstanceOf(value, ClassType)`
- `assertContains(str, substring)` - String contains
- `assertLength(arr, length)` - Array length
- `assertNaN(value)` / `assertNotNaN(value)`
- `assertApproxEqual(actual, expected, tolerance)` - Yaklaşık eşitlik
- `assertResolves(asyncFn)` / `assertRejects(asyncFn)` - Async assertions

### Mock Storage
- `MockStorage` sınıfı localStorage API'sini taklit eder
- `createSystemHardeningStorage()` - Örnek veri ile mock storage
- Event listener desteği (storage events)
- JSON helper metodları (`getJSON`, `setJSON`)
- Snapshot/restore özelliği

### Test Komutu
```bash
node tests/run-all.js
# veya
pnpm test
```

### CLI Options
- `--verbose` - Detailed output
- `--filter=X` - Run only tests matching pattern X
- `--parallel` - Run tests in parallel

## Core Modül Yapısı (Phase 1)

### Dizin Yapısı
```
src/js/core/
├── index.js       # Module exports (Container, EventBus)
├── Container.js   # DI Container
└── EventBus.js    # Event Bus (Pub/Sub)
```

### DI Container (Container.js)
- **Lifecycle**: Singleton (default), Transient
- **API**: `register(name, factory, lifecycle)`, `get(name)`, `has(name)`, `remove(name)`
- **Features**: Child container creation, instantiation tracking
- **Pattern**: Factory-based dependency injection

### Event Bus (EventBus.js)
- **API**: `on(event, handler)`, `off(event, handler)`, `emit(event, data)`, `once(event, handler)`
- **Features**: Unsubscribe function return, async emit (`emitAsync`), event history
- **Pattern**: Observer/Pub-Sub

## Config Modül Yapısı (Phase 2)

### Dizin Yapısı
```
src/js/config/
├── index.js       # ConfigService + exports
├── keys.js        # Storage key constants
├── targets.js     # Nutrition/fitness targets
├── validation.js  # Input validation limits
└── theme.js       # UI theme constants
```

### ConfigService (index.js)
- **Pattern**: Singleton via exported `config` instance
- **API**: `getKey()`, `getTarget()`, `getLimit()`, `getThemeClasses()`
- **Features**: Unified configuration access, helper methods

### Storage Keys (keys.js)
- **15 localStorage key constants**
- **Helper functions**: `isDatePrefixedKey()`, `createDatedKey()`, `getAllKeys()`
- **Key types**: Single value keys, Date-prefixed keys (append YYYY-MM-DD)

### Validation Limits (validation.js)
- **Weight limits**: 20-500 kg
- **Calorie limits**: 0-20000 kcal
- **Macro limits**: 0-1000g
- **Sleep limits**: 0-24 hours
- **Water limits**: 0-50 glasses
- **Exercise limits**: weight, reps, duration, volume
- **Storage limits**: history entries, custom foods, etc.
- **Helper functions**: `clampToRange()`, `isValidIsoDate()`, `isValidTimestamp()`

### Targets (targets.js)
- **Weight targets**: START: 45kg, GOAL: 60kg
- **Calorie targets**: 3000 kcal daily
- **Macro targets**: 225g protein, 375g carbs, 67g fat
- **Milestones**: 4 weight milestones (48kg, 50kg, 55kg, 60kg)
- **Helper functions**: `getNextMilestone()`, `getCompletedMilestones()`, `getProgressPercentage()`

### Theme (theme.js)
- **CSS class compositions**: card, button, input, label
- **Color palette**: Neon green (#00ff41) on dark theme
- **Animation durations**: FAST (150ms), NORMAL (300ms), SLOW (500ms), EPIC (1000ms)
- **Z-index layers**: BASE (0) to TOAST (500)
- **Breakpoints**: SM (640px) to XXL (1536px)
- **Helper functions**: `getClasses()`, `getButtonVariant()`

## Infrastructure Modül Yapısı (Phase 3)

### Dizin Yapısı
```
src/js/infrastructure/
├── index.js              # Module exports
├── StorageAdapter.js     # Abstract interface
├── LocalStorageAdapter.js # Browser localStorage
└── MemoryStorageAdapter.js # In-memory storage
```

### Storage Adapters
- **StorageAdapter**: Abstract base class with interface definition
- **LocalStorageAdapter**: Browser localStorage implementation with prefix support
- **MemoryStorageAdapter**: In-memory storage for testing with deep cloning

## Repository Modül Yapısı (Phase 3)

### Dizin Yapısı
```
src/js/repositories/
├── index.js           # Module exports
├── BaseRepository.js  # Base class with CRUD
├── WeightRepository.js # Weight data access
├── WorkoutRepository.js # Workout data access
└── MealRepository.js  # Meal data access
```

### Repository Pattern
- **BaseRepository**: Common CRUD operations, date handling
- **WeightRepository**: Weight history, current weight, statistics
- **WorkoutRepository**: Workout logs, exercise history, personal records
- **MealRepository**: Meal CRUD, daily nutrition, custom foods

## State Modül Yapısı (Phase 4)

### Dizin Yapısı
```
src/js/state/
├── index.js        # Module exports
├── StateManager.js # Core state container
├── initialState.js # Default state values
├── reducers.js     # State transformation functions
└── middleware.js   # Cross-cutting concerns
```

### State Management
- **StateManager**: Redux-inspired state container with dispatch/subscribe
- **Reducers**: 7 reducers (weight, meal, workout, mental, stats, ui, system)
- **Middleware**: 10 middleware types (logging, persistence, throttle, debounce, etc.)
- **Action Types**: 30+ action types

## Service Modül Yapısı (Phase 5)

### Dizin Yapısı
```
src/js/services/
├── index.js                  # Module exports, ServiceContainer
├── ValidationService.js      # Data validation/sanitization
├── BackupService.js          # Export/import functionality
├── StatisticsService.js      # Metrics and analytics
├── ExerciseHistoryService.js # Exercise history tracking
└── StreakService.js          # Streak calculation
```

### Service Layer
- **ValidationService**: 20+ sanitization methods
- **BackupService**: Export/import with validation
- **StatisticsService**: Volume stats, sleep/water tracking, weekly summary
- **ExerciseHistoryService**: History tracking, PR management
- **StreakService**: Streak calculation, milestones, risk detection

## Views Modül Yapısı (Phase 6)

### Dizin Yapısı
```
src/js/views/
├── index.js         # Module exports
├── DashboardView.js # Main dashboard
├── TrainingView.js  # Training tab
├── NutritionView.js # Nutrition tab
├── ProgressView.js  # Progress tab
├── AnatomyView.js   # Anatomy lab
└── MentalView.js    # Mental health tab
```

## Components Modül Yapısı (Phase 6)

### Dizin Yapısı
```
src/js/components/
├── index.js        # Module exports
├── Card.js         # Card components
├── ProgressBar.js  # Progress indicators
├── MacroRing.js    # Nutrition visualization
├── Modal.js        # Modal dialogs
├── Toast.js        # Notifications
├── MealCard.js     # Meal display
└── SetRow.js       # Exercise sets
```

## Modül Yapısı (Dependency Order)
```
Layer 0: core/ (Container, EventBus)
Layer 1: config/ (keys, validation, targets, theme), db/ (exercises, foods, weekly-plan, mental-phases, anatomy)
Layer 2: infrastructure/ (Storage adapters)
Layer 3: repositories/ (Weight, Workout, Meal)
Layer 4: state/ (StateManager, reducers, middleware)
Layer 5: services/ (Validation, Backup, Statistics, ExerciseHistory, Streak)
Layer 6: components/ (Card, ProgressBar, MacroRing, Modal, Toast, MealCard, SetRow)
Layer 7: views/ (Dashboard, Training, Nutrition, Progress, Anatomy, Mental)
Layer 8: utils.js, store.js, ui.js
Layer 9: renderers/dashboard.js, actions.js
Layer 10: app.js
```

## Namespace Modeli
- Modüller çalışma zamanında `window.*` üzerinden erişilebilir olacak şekilde export edilir.
- Örnekler: `window.CONFIG`, `window.Store`, `window.UI`, `window.Actions`, `window.Renderers`, `window.DB`.
- Bu yaklaşım geliştirme/bundle sırası açısından pratik olsa da global yüzeyi büyütür (isim çakışması ve script etkileşimi riski).

## Veri Depolama
- **localStorage**: Tüm veriler tarayıcıda
- **Anahtar Yapısı** (config/keys.js'den):
  - `monk_weight` - Mevcut kilo
  - `monk_workout_log_YYYY-MM-DD` - Günlük tamamlanan görevler
  - `monk_workout_data_YYYY-MM-DD` - Set/tekrar detayları
  - `monk_meal_log_YYYY-MM-DD` - Günlük öğünler
  - `monk_exercise_history` - Tüm zamanların egzersiz geçmişi

## Runtime Ortam Varsayımı
- Temel tracking özellikleri `file://` üzerinden çalışabilir.
- YouTube embed özelliği için güvenilir çalışma ortamı: `http://localhost` veya `https`.
- `file://` altında YouTube Error 153 görülebilir; bu platform/policy kısıtıdır.

## Kısıtlamalar
- İnternet kesilse de çalışmalı (localStorage)
- Test framework: Custom-built (Zero Dependencies)
- Test coverage: 200+ test cases across all modules
