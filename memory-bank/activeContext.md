# Aktif Bağlam

## Şu Anki Çalışma
**v9.0.0 Void Protocol - Phase 0: The Absolute Sandbox** - 🟢 IN PROGRESS

### Son Güncelleme (20 Şubat 2026)

#### Durum
**v9.0.0 Void Protocol (Zero-Build & AST Untangling) Başladı!** 🚀

Eski monolotik / Node.js tabanlı build yapısı (Phase 8) tamamen çöpe atıldı. 35+ dosyayı 0 build adımıyla `file://` protokolünde natif ES Module olarak çalıştıracak "Absolute Zero-Build" mimarisine geçişin temelleri (Phase 0) atılıyor.

#### Yapılan İşlemler
1. **Performance Directory Structure**: `src/js/performance/` dizini oluşturuldu

2. **CacheService.js**: In-memory caching sistemi
   - TTL (Time-to-live) desteği
   - getOrSet pattern (cache-aside)
   - İstatistik takibi (hits, misses, hit rate)
   - Otomatik temizleme
   - Tag bazlı gruplama
   - LRU eviction (max size)

3. **Memoize.js**: Fonksiyon memoizasyon araçları
   - `memoize()` - Basit memoizasyon
   - `memoizeWith()` - Özel key fonksiyonu
   - `memoizeAsync()` - Async fonksiyonlar için
   - `memoizeWeak()` - WeakMap ile object memoizasyonu
   - `memoizeThrottled()` - Throttle + memoize kombinasyonu
   - TTL ve maxSize desteği

4. **VirtualList.js**: Virtual scrolling bileşeni
   - Sadece görünür öğeleri render
   - Buffer zone desteği
   - Klavye navigasyonu
   - Scroll pozisyon yönetimi
   - ResizeObserver entegrasyonu
   - ARIA accessibility

5. **LazyLoader.js**: Lazy loading sistemi
   - IntersectionObserver tabanlı
   - `LazyImage` - Resim lazy loading
   - `LazyComponent` - Bileşen lazy loading
   - Placeholder ve fade-in efekti
   - Preloading desteği

6. **index.js**: Modül exports ve yardımcı fonksiyonlar
   - Tüm performance araçları export
   - `PerformanceMonitor` - Performans ölçüm araçları
   - `debounce`, `throttle`, `rafThrottle`
   - `batch` - Çağrı birleştirme
   - `createPerformanceContainer` - Factory function

#### Proje Durumu
- **Versiyon**: v9.0.0
- **Build**: `pnpm run build` → `dist/index.html`
- **Mimari**: Service-Oriented Architecture (35+ modüler JS dosyası)
- **Core**: DI Container + Event Bus
- **Config**: Modular configuration (5 modules)
- **Infrastructure**: Storage adapters (3 implementations)
- **Repositories**: Data access layer (4 repositories)
- **State**: StateManager + Reducers + Middleware
- **Services**: Business logic layer (5 services)
- **Views**: UI view layer (6 views)
- **Components**: Reusable UI (7 components)
- **Performance**: Cache, Memoize, VirtualList, LazyLoader (4 modules)
- **Veri**: localStorage (tarayıcı yerel depolama)
- **Test**: Custom test framework + 200+ test cases ✅

### Sonraki Adımlar
**v9.0.0 VOID PROTOCOL PLAN:**

- **Phase 0 (Sandbox):** Fiziksel ve Git yedeklemeleri oluşturuldu.
- **Phase 1 (The Great Untangling):** AST parser (örn. `jscodeshift`) ile otomatik string extraction ve `translations.js` ES modülüne aktarım. Spagetti kodun modüler ES yapılarına ayrılması.
- **Phase 2 (Zero-Dependency UI):** Tailwind/FontAwesome CDN'lerinin silinmesi. Lokal CSS ve `index.html` içinde gömülü SVG Sprite kullanımı.
- **Phase 3 (Impenetrable Security):** `Sentinel.js` inşası. Trusted Types CSP, `innerHTML` yasağı ve DocumentFragment kullanımı. `Sanitizer API` yasaklandı.
- **Phase 4 (The Private Chamber):** Performans ve libido track verileri için IndexedDB arabiriminin (Interface) StateManager üzerine inşası.
- **Phase 5 (Native Modular Architecture):** `importmap`, `modulepreload` kullanımı. `sw.js` Service Worker ile cache bypass (file:// offline çalışma kabiliyeti). Node.js build araçlarının tamamen silinmesi.
- **Phase 6 (Final Validation):** XSS attribute testleri (`javascript:` protocol blokları) ve Network Offline Waterfall testleri.

## Tamamlanan Sürümler
- 🟢 Phase 0: The Absolute Sandbox (20 Şubat 2026) - Yedekleme tamamlandı.
- ✅ Phase 8: Performance Optimization (14 Şubat 2026) - Cache, Memoize, VirtualList, LazyLoader
- ✅ Phase 7: Testing Infrastructure (14 Şubat 2026) - 200+ test cases, all modules tested
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

### Performance Pattern
```javascript
// CacheService kullanımı
import { CacheService } from './performance/index.js';

const cache = new CacheService({ defaultTTL: 60000 });

// Basit cache
cache.set('user:123', userData);
const user = cache.get('user:123');

// Cache-aside pattern
const data = await cache.getOrSet('expensive:key', async () => {
    return await fetchExpensiveData();
}, 30000);

// İstatistikler
const stats = cache.getStats();
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
```

### Memoize Pattern
```javascript
import { memoize, memoizeAsync } from './performance/index.js';

// Senkron memoizasyon
const expensiveCalc = memoize((n) => {
    return complexComputation(n);
}, { ttl: 60000, maxSize: 100 });

// Async memoizasyon
const fetchUser = memoizeAsync(async (id) => {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
}, { ttl: 300000 });

// İstatistikler
console.log(expensiveCalc.getStats());
```

### VirtualList Pattern
```javascript
import { VirtualList } from './performance/index.js';

const list = new VirtualList(container, {
    itemHeight: 50,
    itemCount: 10000,
    renderItem: (index) => {
        const div = document.createElement('div');
        div.textContent = `Item ${index}`;
        return div;
    },
    buffer: 5
});

// Scroll to index
list.scrollToIndex(500);

// Update items
list.setItems(newItems);
```

### LazyLoader Pattern
```javascript
import { LazyLoader, LazyImage } from './performance/index.js';

// Genel lazy loading
const loader = new LazyLoader({
    rootMargin: '100px',
    onLoad: (el) => console.log('Loaded:', el)
});

loader.observe(document.querySelectorAll('.lazy'));

// Lazy resimler
const lazyImg = new LazyImage({
    placeholder: '/placeholder.jpg',
    fadeIn: true
});

const img = lazyImg.create('/images/photo.jpg', { alt: 'Photo' });
container.appendChild(img);
```

### Debounce/Throttle Pattern
```javascript
import { debounce, throttle, rafThrottle } from './performance/index.js';

// Debounce - son çağrıyı çalıştır
const debouncedSearch = debounce((query) => {
    fetchResults(query);
}, 300);

// Throttle - belirli aralıklarla çalıştır
const throttledScroll = throttle((pos) => {
    updateUI(pos);
}, 100);

// RAF throttle - animasyon frame'inde çalıştır
const rafScroll = rafThrottle((pos) => {
    updateAnimation(pos);
});
```

### Test Pattern
```javascript
// Test file structure
import { assertEqual, assertTrue, assertFalse } from '../assert.js';

let testCount = 0;
let passCount = 0;
let failCount = 0;

function test(name, fn) {
    testCount++;
    try {
        fn();
        passCount++;
        console.log(`  ✓ ${name}`);
    } catch (e) {
        failCount++;
        console.log(`  ✗ ${name}\n    ${e.message}`);
    }
}

function describe(name, fn) {
    console.log(`\n=== ${name} ===`);
    fn();
}

// Export for test runner
export { testCount, passCount, failCount };
```

### Mock Storage Pattern
```javascript
// MockLocalStorage for Node.js testing
class MockLocalStorage {
    constructor() {
        this.data = {};
    }
    
    getItem(key) { return this.data[key] || null; }
    setItem(key, value) { this.data[key] = value; }
    removeItem(key) { delete this.data[key]; }
    clear() { this.data = {}; }
    key(index) { return Object.keys(this.data)[index] || null; }
    get length() { return Object.keys(this.data).length; }
}

global.localStorage = new MockLocalStorage();
```

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
16. **Test Isolation**: Her test bağımsız çalışmalı, önceki testlerden etkilenmemeli
17. **Mock Patterns**: Mock objects gerçek implementation'ı taklit etmeli
18. **Async Testing**: Async operations için await kullanımı test reliability sağlar
19. **Cache TTL**: Cache entry'leri için TTL kullanmak stale data sorununu önler
20. **Virtual Scrolling**: Büyük listelerde sadece görünür öğeleri render etmek performansı artırır
21. **Lazy Loading**: IntersectionObserver ile lazy loading sayfa yükleme hızını artırır
22. **Memoization**: Expensive computation'ları cache'lemek tekrarlı çağrılarda performans sağlar

---

