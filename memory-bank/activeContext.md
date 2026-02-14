# Aktif Bağlam

## Şu Anki Çalışma
**Phase 6: UI Components** - ✅ COMPLETED

### Son Güncelleme (14 Şubat 2026)

#### Durum
Phase 6 tamamlandı. View ve Component katmanları modüler hale getirildi.

#### Yapılan İşlemler
1. **Views Dizin Yapısı**: `src/js/views/` dizini oluşturuldu
   - **DashboardView.js** - Main dashboard rendering
     - System integrity (circular progress)
     - Uptime streak with heatmap
     - Daily protocol status
     - Hydration and fuel tracking
   - **TrainingView.js** - Training tab
     - Exercise list with progress tracking
     - Weighted/timed set rows
     - Simple task buttons
   - **NutritionView.js** - Nutrition tab
     - Macro rings visualization
     - Meal list with cards
     - Daily plan display
   - **ProgressView.js** - Progress tab
     - Weight history chart
     - Volume analysis
     - Weekly summary table
     - Measurement inputs
   - **AnatomyView.js** - Anatomy lab
     - Interactive muscle diagrams (front/back)
     - Muscle info panel
   - **MentalView.js** - Mental health tab
     - Phase cards grid
     - Daily practice tracking
     - Progress bar

2. **Components Dizin Yapısı**: `src/js/components/` dizini oluşturuldu
   - **Card.js** - Card container component
     - `Card()` - Standard card wrapper
     - `StatCard()` - Centered value with label
     - `StatMini()` - Mini stat for grids
   - **ProgressBar.js** - Progress indicators
     - `ProgressBar()` - Linear progress bar
     - `ProgressRow()` - Labeled progress row
     - `CircularProgress()` - SVG circular progress
   - **MacroRing.js** - Nutrition visualization
     - `MacroRing()` - Single macro ring
     - `MacroRings()` - All macros together
   - **Modal.js** - Modal dialogs
     - `Modal` class - Modal manager
     - `AlertModal` class - Alert modal
   - **Toast.js** - Notifications
     - `Toast` class - Toast manager
     - `showToast()` - Quick function
   - **MealCard.js** - Meal display
     - `MealCard()` - Full meal card
     - `MealCardCompact()` - Compact variant
     - `EmptyMealList()` - Empty state
   - **SetRow.js** - Exercise sets
     - `WeightedSetRow()` - Weight x Reps input
     - `TimedSetRow()` - Duration input
     - `SimpleTaskBtn()` - Toggle button
     - `AddSetButton()` - Add set button

#### Proje Durumu
- **Versiyon**: v8.3.4-dev
- **Build**: `pnpm run build` → `dist/index.html`
- **Mimari**: Service-Oriented Architecture (30+ modüler JS dosyası)
- **Core**: DI Container + Event Bus
- **Config**: Modular configuration (5 modules)
- **Infrastructure**: Storage adapters (3 implementations)
- **Repositories**: Data access layer (4 repositories)
- **State**: StateManager + Reducers + Middleware
- **Services**: Business logic layer (5 services)
- **Views**: UI view layer (6 views)
- **Components**: Reusable UI (7 components)
- **Veri**: localStorage (tarayıcı yerel depolama)
- **Test**: Custom test framework + Core unit tests ✅

### Sonraki Adımlar (Phase 7: Testing Infrastructure)
1. Custom test framework enhancement
2. Service tests (80%+ coverage)
3. Repository tests
4. View tests
5. Integration tests

## Tamamlanan Sürümler
- ✅ Phase 6: UI Components (14 Şubat 2026) - Views, Components, modular UI layer
- ✅ Phase 5: Service Layer (14 Şubat 2026) - Validation, Backup, Statistics, ExerciseHistory, Streak services
- ✅ Phase 4: State Management (14 Şubat 2026) - StateManager, Reducers, Middleware
- ✅ Phase 3: Storage Abstraction (14 Şubat 2026) - Storage adapters, Repository pattern
- ✅ Phase 2: Configuration Extraction (14 Şubat 2026) - keys, validation, targets, theme, ConfigService
- ✅ Phase 1: Foundation (14 Şubat 2026) - DI Container, Event Bus
- ✅ Phase 0: Test Infrastructure (14 Şubat 2026)
- ✅ v8.3.1: Security documentation reconciliation (docs-only, version bump yok)
- ✅ v8.3.1: Documentation finalize, pnpm migration
- ✅ v8.3.0: Dynamic Set Management
- ✅ v8.2.0: Nutrition Tab Redesign
- ✅ v8.1.1: Training Tab UI/UX
- ✅ v8.1.0: Stealth Mode
- ✅ v8.0.0: Modular Build

## Aktif Kararlar ve Desenler

### State Manager Kullanım Deseni
```javascript
// Import state module
import { StateManager, initialState, rootReducer, actions } from './state/index.js';
import { persistenceMiddleware, loggingMiddleware } from './state/middleware.js';

// Create store with middleware
const store = new StateManager(initialState, rootReducer);
store.addMiddleware(loggingMiddleware);
store.addMiddleware(persistenceMiddleware(storage, { key: 'app_state' }));

// Subscribe to changes
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
store.dispatch(actions.setWeight(75.5));

// Get state
const state = store.getState();
const weight = store.select(state => state.weight);
```

### Reducer Pattern
```javascript
// Action types
const ActionTypes = {
    SET_WEIGHT: 'SET_WEIGHT',
    ADD_MEAL: 'ADD_MEAL',
    // ...
};

// Reducer function
export function weightReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_WEIGHT:
            return { ...state, weight: action.payload };
        default:
            return state;
    }
}

// Root reducer combines all
export function rootReducer(state, action) {
    let newState = state;
    newState = weightReducer(newState, action);
    newState = mealReducer(newState, action);
    // ...
    return newState;
}
```

### Middleware Pattern
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

### Repository Pattern Kullanım Deseni
```javascript
// Import repositories
import { WeightRepository, WorkoutRepository, MealRepository } from './repositories/index.js';
import { LocalStorageAdapter } from './infrastructure/index.js';

// Create storage adapter
const storage = new LocalStorageAdapter({ prefix: 'monk_' });

// Create repositories
const weightRepo = new WeightRepository(storage);
const workoutRepo = new WorkoutRepository(storage);
const mealRepo = new MealRepository(storage);

// Use repositories
await weightRepo.saveWeight(75.5);
const history = await weightRepo.getHistory();

await workoutRepo.addExercise('2026-02-14', { exercise: 'squat', sets: [] });
const pr = await workoutRepo.getPersonalBest('squat', 'volume');

await mealRepo.addMeal('2026-02-14', { name: 'Breakfast', calories: 500 });
const nutrition = await mealRepo.getDailyNutrition('2026-02-14');
```

### Storage Adapter Kullanım Deseni
```javascript
// LocalStorage for production
const storage = new LocalStorageAdapter({ prefix: 'monk_' });

// MemoryStorage for testing
const testStorage = new MemoryStorageAdapter({
    initialData: { testKey: { value: 123 } }
});

// Common operations
await storage.set('key', { data: 'value' });
const data = await storage.get('key');
await storage.remove('key');
const allKeys = await storage.keys();
```

### ConfigService Kullanım Deseni
```javascript
// Import singleton instance
import { config } from './config/index.js';

// Get storage key
const weightKey = config.getKey('WEIGHT'); // 'monk_weight'

// Get target value
const calorieTarget = config.getTarget('CALORIES', 'TARGET'); // 3000

// Get validation limit
const maxWeight = config.getLimit('WEIGHT', 'MAX'); // 500

// Get theme classes
const cardClasses = config.getThemeClasses('card');

// Create dated key
const workoutKey = config.createDatedKey(config.keys.WORKOUT, '2026-02-14');
```

### DI Container Kullanım Deseni
```javascript
// Service registration
container.register('eventBus', () => new EventBus());
container.register('store', (c) => new Store(c.get('eventBus')));

// Singleton (default) - same instance every time
container.register('config', () => new Config());

// Transient - new instance every time
container.register('logger', () => new Logger(), 'transient');
```

### Event Bus Kullanım Deseni
```javascript
// Subscribe with auto-unsubscribe
const unsubscribe = eventBus.on('store:change', (state) => {
    console.log('State updated:', state);
});

// One-time subscription
eventBus.once('app:ready', () => initializeApp());

// Emit events
eventBus.emit('user:login', { id: 1, name: 'John' });

// Cleanup
unsubscribe();
```

### Service Layer Kullanım Deseni
```javascript
// Import services
import { createServices } from './services/index.js';

// Create services with dependencies
const services = createServices({
    storage: localStorageAdapter,
    config: appConfig,
    weeklyPlan: WEEKLY_PLAN
});

// Use services
const streak = await services.streak.getStreak();
const stats = await services.statistics.getVolumeStats();
const pr = await services.exerciseHistory.getPersonalBest('squat');
await services.backup.exportData();
```

### ValidationService Kullanım Deseni
```javascript
import { ValidationService } from './services/ValidationService.js';

const validation = new ValidationService({ limits: config.validation });

// Number validation
const safeWeight = validation.toSafeNumber(userInput, 45, 20, 500);

// Date validation
const safeDate = validation.sanitizeDateString(userDate);

// Complex object sanitization
const safeMeal = validation.sanitizeMealEntry(mealData);
```

### Öğrenilen Dersler
1. **Private Fields**: ES2022 private fields (`#`) kullanımı modern browser'larda çalışır
2. **Factory Pattern**: Factory functions container'ı alarak dependency resolution yapabilir
3. **Unsubscribe Pattern**: `on()` metodunun unsubscribe function döndürmesi cleanup'i kolaylaştırır
4. **Error Isolation**: Event handler'larda try-catch kullanımı bir handler hatasının diğerlerini etkilemesini engeller
5. **Magic Numbers**: Tüm magic numbers merkezi configuration'a taşınmalı - bakım kolaylığı sağlar
6. **Module Re-exports**: index.js'den tüm sub-module'leri re-export etmek kullanım kolaylığı sağlar
7. **Repository Pattern**: Data access logic'ini business logic'ten ayırmak test edilebilirliği artırır
8. **Storage Abstraction**: Farklı storage backend'leri için aynı API'yi sağlamak flexibility sağlar
9. **Deep Cloning**: Memory storage'da deep cloning kullanmak mutation bug'larını önler
10. **Immutable State**: State her zaman immutable copy olarak dönmeli - mutation bug'larını önler
11. **Middleware Chain**: Middleware chain pattern'i cross-cutting concerns'ları ayırmayı sağlar
12. **Action Creators**: Action creator functions action type safety sağlar
13. **Service Layer**: Business logic'i UI'dan ayırmak test edilebilirliği ve bakım kolaylığını artırır
14. **Dependency Injection**: Service'ler dependency'lerini constructor'dan almalı - test edilebilirlik
15. **Single Responsibility**: Her service tek bir sorumluluk alanına odaklanmalı

---
