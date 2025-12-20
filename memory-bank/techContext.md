# Teknik Bağlam

## Teknolojiler
- **HTML5**: Tek dosya yapısı (`index.html`)
- **CSS**: Tailwind CSS (CDN), özel stiller inline
- **JavaScript**: Vanilla JS, ES6+ async/await
- **Fontlar**: JetBrains Mono, Orbitron, Inter (Google Fonts CDN)
- **İkonlar**: Font Awesome 6.4 (CDN)

## Veri Depolama
- **localStorage**: Tüm veriler tarayıcıda
- **Anahtar Yapısı**:
  - `monk_weight` - Mevcut kilo
  - `monk_workout_log_YYYY-MM-DD` - Günlük tamamlanan görevler
  - `monk_workout_data_YYYY-MM-DD` - Set/tekrar detayları
  - `monk_meal_log_YYYY-MM-DD` - Günlük öğünler
  - `monk_exercise_history` - Tüm zamanların egzersiz geçmişi (YENİ)

## Mimari Yapı
```
CONFIG → Sabitler, hedefler, anahtarlar
DB → Egzersizler, yiyecekler, haftalık plan
Utils → Yardımcı fonksiyonlar, storage adapter
Store → State yönetimi, veri işlemleri
UI → DOM manipülasyonu, modal, toast
Renderers → Tab görünümleri (dashboard, training, nutrition...)
Actions → Kullanıcı etkileşim handlerleri
```

## Kısıtlamalar
- Tek dosya olmalı (bağımsız çalışma)
- İnternet kesilse de çalışmalı (localStorage)
- Derleme/build adımı yok
- Test framework yok (manuel test)
