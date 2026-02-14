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

## Test Altyapısı (Phase 0 - Yeni)

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

## Modül Yapısı (Dependency Order)
```
Layer 1: config.js, db/ (exercises, foods, weekly-plan, mental-phases, anatomy)
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
- **Anahtar Yapısı**:
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
- ~~Test framework yok (manuel test)~~ → **Custom test framework aktif (Phase 0)**
