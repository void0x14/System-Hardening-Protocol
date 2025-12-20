# Aktif Bağlam

## Şu Anki Çalışma
**v6.2.0 - Component Factory Pattern + HTML Düzeltme** - TAMAMLANDI ✅

### Son Güncelleme (13 Aralık 2025)

#### Components Factory (12 fonksiyon)
- `card`, `progressBar`, `progressRow` - Layout
- `statCard`, `statMini`, `badge` - Veri gösterimi
- `btn`, `iconBtn` - Butonlar
- `weightedSetRow`, `timedSetRow`, `simpleTaskBtn` - Set input
- `statusDot` - Durum göstergesi

#### Refactored Renderers
- `training()` - Components kullanımına geçti (~70 satır azaldı)

#### HTML Regression Fix
42 bozuk HTML tag düzeltildi:
- `< div class=` → `<div class=`
- `</div >` → `</div>`
- `border - 2` → `border-2`
- `onclick = ` → `onclick=`

#### trackingType Sistemi (v6.1.0)
- `weighted`, `timed`, `duration`, `activity`, `task`
