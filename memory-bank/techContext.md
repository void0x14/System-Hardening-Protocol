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
- Test framework yok (manuel test)
