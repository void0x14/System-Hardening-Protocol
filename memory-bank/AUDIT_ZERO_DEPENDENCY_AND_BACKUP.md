# Proje Audit: Zero-Dependency & Backup/Import Analizi

**Tarih:** 2026-02-22  
**Versiyon:** v8.3.1  
**Durum:** Bulgular + Çözüm Önerileri

---

## 1. Zero-Dependency Tanımı ve Felsefi Çerçeve

### Mevcut Yaklaşımın Savunulabilirliği

Projenin zero-dependency iddiası şu pragmatik tanıma dayanıyor:

> "Kullanıcının uygulamayı çalıştırmak için herhangi bir şey kurması gerekmez. Sadece `index.html` aç, çalışır."

Bu tanım çerçevesinde **build tool bağımlılığı da bir dependency'dir**:  
- `npm run build` = kullanıcı Node.js + npm kurmak zorunda  
- `webpack`, `vite`, `esbuild` vb. = harici araç bağımlılığı  
- Bu araçlar olmadan kullanıcı uygulamayı dağıtamaz veya kullanamaz

Bu yüzden proje Tailwind CSS'i **yerel `vendors/tailwindcss.min.js`'e** alarak build adımını ortadan kaldırmış. Bu karar — build tool'u vendor'a almak — pragmatik açıdan savunulabilir ve tutarlı bir mimarı karar.

### Ancak: İhlal Olan Kısımlar

Build tool argument'ı kabul edilse bile, **çalışma zamanında dış ağa bağımlı olmak** başka bir meseledir.

---

## 2. Zero-Dependency İhlalleri

### 🔴 KRİTİK İhlal: Font Awesome CDN

**Dosya:** `index.html`, satır 12  
**Kod:**
```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      rel="stylesheet"
      integrity="sha384-iw3OoTErCYJJB9mCa8LNS2hbsQ7M3C0EpIsO/H5+EGAkPGc6rk+V8i04oW/K5xq0"
      crossorigin="anonymous">
```

**Sorun:**
- Uygulama çevrimdışı çalışmaz (ikonlar kaybolur)
- `cdnjs.cloudflare.com`'a runtime bağımlılığı var
- CSP politikası `style-src` ve `font-src`'de bu domain whitelist'te → uygulama bu olmadan tasarlanmamış
- `fas fa-*`, `fab fa-*` sınıfları onlarca yerde kullanılıyor:
  - `index.html`: biohazard, cog, power-off, times, exclamation-triangle
  - `actions.js`: skull, dumbbell, list-ol, trophy, chart-bar, play, youtube, lightbulb, bullseye, chess, caret-right, bolt, check, fire, language, sync-alt, file-export, download, upload, save, rocket, exclamation-triangle vb.
  - `renderers/dashboard.js` ve diğer dosyalar da dahil

**Neden "build tool dependency" argümanı bu karar için geçerli değil:**  
Tailwind JIT runtime **zaten vendor'a alındı** (`vendors/tailwindcss.min.js`). Aynı mantık Font Awesome için de uygulanabilirdi ama uygulanmadı. Bu tutarsız bir mimari karar.

**Daha önceki geçmiş:** `5a5bc1f5` konuşmasında Font Awesome'u SVG sprite ile değiştirme planlanmış ve kısmen başlatılmış, ancak tamamlanmamış. `index.html` hâlâ CDN'i içeriyor.

**Çözüm:**
1. `src/assets/icons.svg` sprite dosyası oluştur (tüm kullanılan ikonları topla)
2. `index.html`'e sprite include et: `<img src="icons.svg">` yerine inline SVG veya CSS `mask`
3. `<i class="fas fa-X">` → `<svg><use href="#icon-X"/></svg>` dönüşümü yap
4. Font Awesome CDN `<link>` satırını kaldır
5. CSP'den `cdnjs.cloudflare.com`'u kaldır

---

### 🟡 Kısmi Kabul: Tailwind CSS Vendor'a Alınmış

`src/js/vendors/tailwindcss.min.js` — yerel, CDN yok.  
Build step gerektirmez, tarayıcıda JIT çalışır.  
**Karar: Proje felsefesiyle tutarlı. Sorun yok.**

Ancak not: Bu dosya ~1.8MB, her sayfada parse ediliyor. İleride performans sorunu yaratabilir. Kritik değil, bilgi amaçlı.

---

## 3. Backup/Import Fonksiyon Bugları

### 🔴 BUG-001: `WEEKLY_PLAN` Bare Global — Runtime ReferenceError

**Dosyalar ve satırlar:**
- `store.js` satır 252: `const plan = WEEKLY_PLAN[day];` (updateStreak)
- `store.js` satır 771: `const plan = WEEKLY_PLAN[day];` (setTaskDone)
- `store.js` satır 823: `const plan = WEEKLY_PLAN[day];` (getTodayProgress)
- `actions.js` satır 967: `const plan = WEEKLY_PLAN[day];` (confirmDailyMission)

**store.js'in mevcut importları:**
```javascript
import { UI } from './ui.js';
import { Utils } from './utils.js';
import { CONFIG } from './config/index.js';
import { DB } from './config/db.js';
```

`WEEKLY_PLAN` import edilmemiş. Diğer yerlerde `DB.WEEKLY_PLAN` kullanılıyor (doğru), bu 4 yer bare global kullanıyor.

**Etki:** Import sonrası `location.reload()` çağrısı var (`startImport` fonksiyonunda). Sayfa yenilendikten sonra kullanıcı training sekmesine geçtiğinde veya set tamamladığında:
- `setTaskDone()` → `updateStreak()` → `WEEKLY_PLAN[day]` → `ReferenceError`
- Uygulama tamamen çöker
- Kullanıcı verilerini göremez

**Çözüm:**
```javascript
// store.js ve actions.js'de bare WEEKLY_PLAN → DB.WEEKLY_PLAN
const plan = DB.WEEKLY_PLAN[day];
```

---

### 🔴 BUG-002: `BackupService.js` Yanlış Import Path

**Dosya:** `src/js/services/BackupService.js`, satır 5  
**Mevcut:**
```javascript
import { ValidationService } from '../ValidationService.js';
```
**Gerçek dosya konumu:** `src/js/services/ValidationService.js`  
**Doğru import:**
```javascript
import { ValidationService } from './ValidationService.js';
```

Aynı hata aşağıdaki dosyalarda da var:
- `src/js/services/StreakService.js` satır 5
- `src/js/services/ExerciseHistoryService.js` satır 5
- `src/js/services/index.js` satır 17

**Etki:** `BackupService`, `StreakService`, `ExerciseHistoryService` import edildiğinde `ModuleNotFoundError` fırlatır. Phase 5 service layer çalışmaz.

**Çözüm:** 4 dosyada `'../ValidationService.js'` → `'./ValidationService.js'` değiştir.

---

### 🔴 BUG-003: Import Sırasında Weight History Yanlış Silme

**Dosya:** `store.js`, satır 661-667  
**Kod:**
```javascript
const prefixes = Object.values(CONFIG.KEYS).map(k => k.replace(/_$/, ''));
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && prefixes.some(p => key.startsWith(p))) keysToRemove.push(key);
}
```

**Sorun:**
- `CONFIG.KEYS.WEIGHT = 'monk_weight'` → prefix: `'monk_weight'`
- `CONFIG.KEYS.WEIGHT_HISTORY = 'monk_weight_history'`
- `'monk_weight_history'.startsWith('monk_weight')` → `true` ✓
- Yani weight history, `monk_weight`'in prefix eşleşmesiyle zaten silenecekti ama...
- Asıl sorun: Bu prefix listesi `monk_weight` içeriyor, `monk_workout_log_2026-01-01` gibi anahtarlar `monk_workout` prefix'iyle silinmeli ama `monk_workout_data_` prefix'i de var; ikisi çakışabilir

**Daha ciddi sorun:** Eğer `CONFIG.KEYS` arasında bir key'in prefix'i başka bir key'in başlangıcıysa, yanlış anahtarlar silinebilir. Örneğin:
- `monk_sleep_` prefix: `monk_sleep`
- `monk_streak` key: `monk_streak`
- `'monk_streak'.startsWith('monk_s')` (start of sleep prefix after trim) → hayır bu örnekte olmaz ama genel mantık kırık

**Etki:** Import sırasında beklenmedik anahtarlar silinebilir. Veri kaybı.

**Çözüm:**
```javascript
// Tam isim eşleşmesi ile prefix'e göre kontrol
const keysToRemove = [];
const allStorageKeys = Object.keys(localStorage);
const configValues = Object.values(CONFIG.KEYS);

for (const lsKey of allStorageKeys) {
    const shouldRemove = configValues.some(configKey => {
        if (configKey.endsWith('_')) {
            return lsKey.startsWith(configKey); // prefix match
        }
        return lsKey === configKey; // exact match
    });
    if (shouldRemove) keysToRemove.push(lsKey);
}
keysToRemove.forEach(k => localStorage.removeItem(k));
```

---

### 🔴 BUG-004: Non-Atomic Import — Hata Durumunda Veri Kaybı

**Dosya:** `store.js`, `importData()` metodu

**Mevcut akış:**
1. JSON parse
2. Validasyon
3. Sanitizasyon
4. **Mevcut tüm veriyi sil** ← geri dönüşü yok
5. Yeni veriyi yaz

Eğer adım 5'te herhangi bir hata olursa (örn. localStorage quota exceeded, bir set() çağrısı exception fırlatırsa), veri tamamen kaybolur. Kullanıcı hem eski verisini hem de import etmeye çalıştığı veriyi kaybeder.

**Çözüm:**
```javascript
async importData(jsonContent) {
    try {
        const parsed = JSON.parse(jsonContent);
        const validation = Utils.validateImportData(parsed);
        if (!validation.valid) throw new Error(validation.error);

        const data = this._sanitizeImportedData(validation.data);
        
        // Önce tüm import verisini hazırla (hiçbir şeyi silme)
        const newEntries = Object.entries(data).filter(([k]) => k !== 'meta');
        
        // Test yazma (hata alırmıyız?)
        // Ancak browser'da bu tam transaction değil, en azından silme sonraya al:
        
        // 1. Sil
        const prefixes = ...; // düzeltilmiş prefix mantığı
        keysToRemove.forEach(k => localStorage.removeItem(k));
        
        // 2. Yaz
        for (const [key, value] of newEntries) {
            await Utils.storage.set(key, value);
        }
        
        return { success: true, date: data.meta.date };
    } catch (e) {
        // En azından hata durumunda kullanıcıya detaylı bilgi ver
        console.error('Import Error:', e);
        return { success: false, error: e.message };
    }
}
```

Gerçek atomik transaction için tarayıcı localStorage'da yetersizdir; en iyi çözüm silmeden önce mevcut verinin bir snapshot'ını hafızaya alıp hata durumunda geri yazmak:

```javascript
// Rollback snapshot
const snapshot = {};
const configValues = Object.values(CONFIG.KEYS);
for (const key of Object.keys(localStorage)) {
    if (configValues.some(cv => cv.endsWith('_') ? key.startsWith(cv) : key === cv)) {
        snapshot[key] = localStorage.getItem(key);
    }
}

try {
    // ... sil ve yaz
} catch (e) {
    // Geri yükle
    Object.entries(snapshot).forEach(([k, v]) => localStorage.setItem(k, v));
    return { success: false, error: e.message };
}
```

---

### 🟡 BUG-005: Backup Date Format ve Timezone Sorunu

**Dosya:** `store.js`, satır 302  
**Kod:**
```javascript
await Utils.storage.set(CONFIG.KEYS.BACKUP, Utils.dateStr());
// Kaydedilen: "2026-02-22"
```

**Kontrol kodu:**
```javascript
const last = new Date(lastBackup);
// new Date("2026-02-22") → UTC midnight olarak parse edilir
// Türkiye (UTC+3) saatinde bu dün gece 03:00 yerel zaman demek
// diffDays hesabı bu hata yüzünden 1 gün fazla çıkabilir
```

**Etki:** 7 günlük backup kontrolü yanlış "WARNING" dönebilir. Kullanıcı sürekli backup uyarısı görür.

**Çözüm:**
```javascript
// Backup tarihini ISO string olarak kaydet
await Utils.storage.set(CONFIG.KEYS.BACKUP, new Date().toISOString());
// "2026-02-22T05:19:46.000Z" → timezone-safe parse
```

---

### 🟡 BUG-006: `require()` Kullanımı ES Module Context'inde

**Dosyalar:**
- `src/js/components/index.js`, satır 66: `const { MacroRing } = require('./MacroRing.js');`
- `src/js/performance/index.js`, satır 95: `const { memoizeAsync: memoAsync } = require('./Memoize.js');`

**Sorun:** Uygulama `type="module"` kullanıyor (`app.js` ES module). `require()` browser'da çalışmaz. Bu dosyalar doğrudan import ediliyorsa `ReferenceError: require is not defined` hatası alınır.

**Etki:** Bu modüller eğer aktif import zincirindeyse, ilgili component'ler yüklenmez.

**Çözüm:**
```javascript
// require() → dynamic import() veya static import
import { MacroRing } from './MacroRing.js';
// veya
const { MacroRing } = await import('./MacroRing.js');
```

---

## 4. Mevcut Durumun Özet Tablosu

| # | Alan | Seviye | Etki | Durum |
|---|------|--------|------|-------|
| 1 | Font Awesome CDN | 🔴 Kritik | Offline çalışmaz, zero-dep ihlali | Düzeltilmeli |
| 2 | Tailwind vendor'a alınmış | ✅ Kabul | Build tool bağımlılığını ortadan kaldırır | Mimari karar, OK |
| 3 | `WEEKLY_PLAN` bare global | 🔴 Kritik | Import sonrası uygulama crash | Düzeltilmeli |
| 4 | BackupService import path | 🔴 Kritik | Service layer çalışmaz | Düzeltilmeli |
| 5 | Import prefix eşleme hatası | 🔴 Kritik | Yanlış veri silinir, kayıp | Düzeltilmeli |
| 6 | Non-atomic import | 🔴 Kritik | Hata durumunda toplam veri kaybı | Düzeltilmeli |
| 7 | Backup date timezone | 🟡 Orta | Yanlış backup uyarıları | Düzeltilmeli |
| 8 | `require()` ES module içinde | 🟡 Orta | İlgili component yüklenmez | Kontrol edilmeli |

---

## 5. Öncelik Sırası

### Acil (Kullanıcı veri kaybeder)
1. **BUG-003 + BUG-004:** Import sırasında yanlış veri silme + non-atomic işlem  
2. **BUG-001:** `WEEKLY_PLAN` → `DB.WEEKLY_PLAN` (import sonrası crash)

### Yüksek (Zero-dependency ihlali)
3. **Font Awesome CDN kaldırma:** SVG sprite geçişini tamamla

### Orta (Service layer bütünlüğü)
4. **BUG-002:** `BackupService.js` ve diğer servislerdeki yanlış import path'ler  
5. **BUG-005:** Backup date format düzeltmesi  
6. **BUG-006:** `require()` → `import` dönüşümü

---

## 6. Notlar

- `BackupService.js` (`services/` altında) ile `store.js`'deki `exportData`/`importData` metodları **ikili implementasyon** durumunda. Biri kullanılıyor, diğeri refactoring kalıntısı olabilir. Hangisinin aktif kod yolunda olduğu netleştirilmeli ve biri kaldırılmalı.
- `actions.js`'deki `startImport` fonksiyonu doğrudan `Store.importData()` çağırıyor, yani `BackupService` değil `store.js`'deki versiyon aktif.
- `store.js`'deki `_sanitizeImportedData` metodunun içeriği, `services/ValidationService.js`'deki metodlarla neredeyse birebir kopyalanmış. Kod duplikasyonu var.
