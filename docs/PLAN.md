# 🚀 True Zero-Dependency Architecture & i18n Strategy (Phase 1)

## 🕵️‍♂️ 1. Mevcut Mimari Analizi (Spaghetti mi, Clean mi?)
Tüm dosya sistemini (`code-index` ve MCP tool'ları ile) taradıktan ve `run-all.js` ile test sonuçlarını gördükten sonra analizim şudur:
Mevcut kod **ASLA SPAGHETTI DEĞİL**. Aksine, harika bir kurumsal (enterprise) ve Clean Code mimarisidir.
- **Güçlü Yönleri:** Sınıf bağımlılıklarını çözen `Container.js`, bileşen iletişimini izole eden `EventBus.js`, veri izolasyonu sağlayan `*Repository.js` yapıları son derece modern yazılım prensiplerine (SOLID) uygundur.
- **Kritik Hata (Neden "Aptalca" hissettirdi?):** Bu kadar modern ve modüler (ES Modules) yazılan kodu alıp, sanki yıl 2010'muş gibi `build.js` ile tek bir devasa "dist/index.html" dosyasına "concat" (alt alta yapıştırma) yapmaya çalışmışlar. Bu, saf Vanilla JS gücünü çöpe atıp, monolitik ve sürdürülemez bir Frankenstien yaratmaktı. Ayrıca `package.json`, CDNs (Tailwind) gibi unsurlar da "Zero-Dependency" (sıfır dışa bağımlılık) prensibine direkt ihanettir.

## 🎯 2. Ana Hedef: Mutlak Bağımsızlık (True Zero-Dependency)
Senin felsefen olan Linus Torvalds, Ken Thompson ekolündeki tam bağımsızlık, yüksek performans ve güvenlik yaklaşımını inşa edeceğiz.

### a. "node_modules" ve Paket Yöneticisi Katliamı
- **Eylem:** `package.json`, `package-lock.json`, `node_modules` klasörleri TAMAMEN silinecek. Projenin derlenmesi veya çalışması için Node.js paket yöneticisine ihtiyaç kalmayacak.
- **Sonuç:** Supply-chain atakları (Tedarik zinciri saldırıları) riski sıfıra indirilecek.

### b. Monolitik Yapının Parçalanması ve Native ES Modülleri
- **Eylem:** `src/build.js` ve "dist/index.html" yaratma mantığı tamamen çöpe atılacak.
- **Yeni Yapı:** Doğrudan tarayıcının yerleşik (native) gücü kullanılacak. `index.html` içerisinden `<script type="module" src="js/app.js"></script>` ile ana dosya çağırılacak. Tarayıcı zaten internal (dahili) `import / export` mekanizmasını en mükemmel ve optimize şekilde (HTTP/2 multiplexing ile) çözüyor.

### c. CDN Zincirlerinin Kırılması (Tailwind & FontAwesome)
- **Eylem:** `template.html` içerisindeki TailwindCDN ve FontAwesome silinecek.
- **Yeni Yapı:** Güvenliği artırmak ve bağlantı bağımsızlığı sağlamak için projenin kendi özel tasarım sistemi (Native Pure CSS/Variables) `css/system-style.css` içerisinde kurulacak.

### d. Native Zero-Dependency i18n Lokalizasyon Sistemi
- **Eylem:** Dış paket kullanmadan, tamamen Vanilla JS tabanlı bir `Locales` yönetim sistemi kurulacak.
- **Yapısı:** `src/js/locales/en.js` ve `src/js/locales/tr.js` modülleri yaratılıp bir `i18nService.js` Container'a eklenecek. UI render sırasında metinler bu kaynaktan çekilecek.

---

## 📅 3. İcra Planı (Sıralı İş Paketleri)

- [ ] **Aşama 1: Temizlik ve Yıkım (Purge)**
  - `package.json` ve `build.js` silinecek.
  - `dist` klasörü ve gereksiz monolitik yapılar tarihe gömülecek.
  
- [ ] **Aşama 2: Native Bootstrapping (ESM)**
  - `src/template.html` doğrudan ana dizine `index.html` olarak alınacak ve Native kaynak yolları ( `<script type="module">`) verilecek.
  - Tailwind CDN kaldırılıp yerine minimal ama güçlü bir `system-style.css` iskeleti (Dark Mode & Fluid Layout tabanlı) bağlanacak.

- [ ] **Aşama 3: Localization (i18n) Altyapısı**
  - Container'a `i18nService` kaydedilecek.
  - Sabit (hardcoded) statik menü isimleri ve başlıklar i18n anahtarlarına dönüştürülecek.

- [ ] **Aşama 4: Test ve Stabilizasyon**
  - Geriye kalan özel Test aracı Native Browser formatına veya pure Deno/Node argümanlarına çekilecek. Node_modules olmadığı için sadece built-in API'ler kullanılacak.
