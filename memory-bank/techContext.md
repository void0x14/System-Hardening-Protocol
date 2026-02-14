# Teknik Bağlam

## Teknolojiler
- **HTML5**: Tek dosya yapısı (`dist/index.html` — build output)
- **CSS**: Tailwind CSS (CDN) + özel stiller (4 modüler CSS dosyası)
- **JavaScript**: Vanilla JS, ES6+ async/await (15 modüler dosya)
- **Fontlar**: JetBrains Mono, Orbitron, Inter (Google Fonts CDN)
- **İkonlar**: Font Awesome 6.4 (CDN)

## Paket Yönetimi
- **pnpm**: Proje paket yöneticisi (`packageManager` field ile sabitlenmiş)
- **package.json**: Build scriptleri tanımlı, harici bağımlılık yok
- **Build komutu**: `pnpm run build` → `node src/build.js`

## Build Sistemi
- **Yaklaşım**: Build-time bundling (modüler src → tek dist/index.html)
- **Build Script**: `src/build.js` — Node.js built-in `fs`/`path` ile
- **Girdi**: `src/template.html` + `src/js/*.js` + `src/styles/*.css`
- **Çıktı**: `dist/index.html` (~208 KB)
- **Bağımlılık**: Sadece Node.js runtime (harici npm paketi yok)

## Test Altyapısı (Phase 0)

### Test Framework
- **Yaklaşım**: Custom-built test framework (Zero Dependencies)
- **Test Runner**: `tests/runner.js` - describe/it pattern
- **Assertion Library**: `tests/assert.js` - 18 assertion fonksiyonu
- **Reporter**: `tests/reporter.js` - Console output formatting

### Test Dizin Yapısı
```
tests/
├── runner.js      # Custom test runner (describe/it pattern)
├── assert.js      # Assertion library (assertEqual, assertTrue, etc.)
├── reporter.js    # Test reporter (console output)
└── mocks/
    └── storage.js # Mock localStorage adapter
```

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
node tests/runner.js
# veya
pnpm test
```

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

## Modül Yapısı (Dependency Order)
```
Layer 0: core/ (Container, EventBus)
Layer 1: config/ (keys, validation, targets, theme), db/ (exercises, foods, weekly-plan, mental-phases, anatomy)
Layer 2: utils.js
Layer 3: store.js
Layer 4: ui.js, components.js, video-player.js, stealth.js
Layer 5: renderers/dashboard.js
Layer 6: actions.js
Layer 7: app.js
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
- Tek dosya olmalı (bağımsız çalışma)
- İnternet kesilse de çalışmalı (localStorage)
- Build adımı: `pnpm run build`
- Test framework: Custom-built (Zero Dependencies)
