# Sistem Kalıpları

## Mimari Desen: State-Renderer-Actions

```
[Kullanıcı Etkileşimi]
        ↓
    Actions.xxx()
        ↓
    Store.xxx() → localStorage
        ↓
    Renderers.tabName() → HTML string
        ↓
    DOM Güncelleme
```

## Temel Bileşenler

### Store Objesi
- `state`: Aktif durum (weight, activeTab, selectedMuscle...)
- `init()`: Başlangıç yüklemesi
- `get/set` metodları: Veri okuma/yazma

### Renderers Objesi
- Her tab için async fonksiyon: `dashboard()`, `training()`, `nutrition()`...
- HTML string döndürür (template literal)
- Store'dan veri çeker, UI'a yansıtır

### Actions Objesi
- Kullanıcı eventlerini handle eder
- Store'u günceller
- Tab'ı yeniden render eder

### Global Export Kalıbı
- Modüller runtime'da global olarak paylaşılır (`window.Actions`, `window.Store`, `window.UI`, `window.Renderers`, `window.DB`).
- Bu kalıp bağımlılık sırasını basitleştirir ancak namespace izolasyonu sağlamaz.
- Güvenlik/izolasyon açısından orta vadede IIFE veya ESM kapsülleme değerlendirilmelidir.

## Önemli Kalıplar

### Veri Kalıcılığı
```javascript
await Utils.storage.set(key, value);
const data = await Utils.storage.get(key);
```

### Modal Sistemi
```javascript
UI.modal.open(title, htmlContent);
UI.modal.close();
```

### Toast Bildirimleri
```javascript
UI.showToast("Mesaj", "success|error|warning");
```

### Video Runtime Kuralı
```javascript
Actions.playVideoInline(element, videoId);
```
- YouTube embed akışı inline çalışır.
- Güvenilir oynatma için uygulama `http://localhost`/`https` altında servis edilmelidir.

## Renk Paleti (Tailwind Özel)
- `neon-green`: #00ff41 (Başarı, ilerleme)
- `neon-red`: #ff003c (Hata, tehlike)
- `neon-blue`: #00f3ff (Bilgi, vurgu)
- `accent-orange`: #ff6b35 (Uyarı)
- `gunmetal`: #0a0a0f (Arka plan)
- `surface-card`: #111116 (Kart arka plan)
