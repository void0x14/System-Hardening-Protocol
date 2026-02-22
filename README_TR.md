<p align="center">
  <img src="docs/assets/void_tux_mascot.png" alt="Void Dual Tux Maskotu" width="600">
</p>

<p align="center">
  <a href="README.md">English</a> | <a href="README_TR.md">Türkçe</a>
</p>

<h1 align="center">🛡️ Sistem Sertleştirme Protokolü</h1>

<p align="center">
  <img src="https://img.shields.io/badge/versiyon-9.0.0-00ff88?style=for-the-badge&labelColor=0a0a0a" alt="Versiyon">
  <img src="https://img.shields.io/badge/lisans-MIT-blue?style=for-the-badge&labelColor=0a0a0a" alt="Lisans">
  <img src="https://img.shields.io/badge/sıfır-bağımlılık-ff4444?style=for-the-badge&labelColor=0a0a0a" alt="Sıfır Bağımlılık">
  <img src="https://img.shields.io/badge/önce-çevrimdışı-00ccff?style=for-the-badge&labelColor=0a0a0a" alt="Önce Çevrimdışı">
  <img src="https://img.shields.io/badge/tek-dosya-ffaa00?style=for-the-badge&labelColor=0a0a0a" alt="Tek Dosya">
</p>

<p align="center">
  <em>"Sıfır bağımlılık. Sıfır sızıntı. Sıfır zayıflık."</em><br>
  Biyolojik ve zihinsel yetenekleriniz için Operasyonel Güvenlik (OPSEC).
</p>

---

## ⚡ Bu Nedir?

**Sistem Sertleştirme Protokolü**, bedenini ve zihnini yüksek değerli bir varlık olarak ele alan, sıfır bağımlılıklı, önce çevrimdışı öncelikli bir kişisel komuta merkezidir. **Tek bir HTML dosyasına** derlenir — sunucu yok, bulut yok, veri sızıntısı yok. Her şey yerel olarak tarayıcınızda çalışır.

Bu bir fitness takipçisi **değildir**. Bu bir diyet uygulaması **değildir**. Bu, biyolojik varlığınız için bir **komuta merkezidir**.

### Neden Kullanmalı?

- 🔒 **%100 Özel** — Tüm veriler tarayıcınızın localStorage alanında kalır. Hesap yok, takip yok, telemetri yok.
- ⚡ **Anında** — Tek HTML dosyası, sıfır yükleme süresi. Çevrimdışı çalışır.
- 🎯 **Hepsi Bir Arada** — Antrenman, beslenme, ilerleme analitiği, anatomi görselleştirme ve zihinsel koşullandırma tek bir yerde.
- 🖥️ **Cyberpunk Arayüz** — Neon vurgulu askeri düzeyde karanlık arayüz. Sıradan sağlık uygulamalarından farklıdır.
- 🕵️ **Gizlilik Modu** — Toplum içindeyken uygulamayı anında kamufle etmek için `Ctrl+Shift+H` tuşlarına basın.

---

## 🖥️ Komuta Merkezi

### 📊 Panel (Durum Odası)
Mevcut durumunuzun gerçek zamanlı teşhisi — kilo takibi, çalışma süresi serileri, günlük kalori dağılımı ve görev tamamlama durumu.

<p align="center">
  <img src="docs/screenshots/dashboard_full_hd.png" alt="Panel" width="700">
</p>

### 🏋️ Antrenman (Operasyonlar)
Egzersiz veritabanları, dinamik set yönetimi, hacim takibi ve gömülü video gösterimleri içeren tam antrenman protokolleri.

<p align="center">
  <img src="docs/screenshots/training_full_hd.png" alt="Antrenman" width="700">
</p>

### 🍽️ Beslenme (Lojistik)
Protein/karbonhidrat/yağ/su izleme, öğün kaydı, özel yiyecek oluşturma ve akıllı günlük yakıt hesaplamaları ile gelişmiş makro takibi.

<p align="center">
  <img src="docs/screenshots/nutrition_full_hd.png" alt="Beslenme" width="700">
</p>

### 📈 İlerleme (İstihbarat)
Veri analiz motoru — haftalık kalori özetleri, antrenman hacmi trendleri, kilo geçmişi grafikleri ve vücut ölçü takibi.

<p align="center">
  <img src="docs/screenshots/progress_full_hd.png" alt="İlerleme" width="700">
</p>

### 🧬 Anatomi Laboratuvarı (Teşhis)
Belirli kas gruplarını hedeflemek için etkileşimli görsel vücut haritası. Egzersizleri, durumu ve teşhis verilerini görüntülemek için herhangi bir kasa tıklayın.

<p align="center">
  <img src="docs/screenshots/anatomy_interactive.png" alt="Anatomi Laboratuvarı" width="700">
</p>

### 🧠 Zihinsel Savaş (Psikolojik Operasyonlar)
8 aşamalı ilerleme, günlük mikro eylemler ve algı yönetimi protokolleri aracılığıyla psikolojik koşullandırma.

<p align="center">
  <img src="docs/screenshots/mental_full_hd.png" alt="Zihinsel Savaş" width="700">
</p>

---

## 🛠️ Teknoloji Yığını

| Teknoloji | Amaç |
|-----------|---------|
| **HTML5** | Tek dosya uygulama yapısı |
| **Vanilla JavaScript (ES6+)** | Sıfır framework, saf ES6+ mantığı. Harici kütüphane yok |
| **CSS3** | Yerel stil sayfaları. Sıfır harici bağımlılık |
| **localStorage** | İstemci tarafı veri kalıcılığı |

### Mimari

```
Durum-Oluşturucu-Eylemler (State-Renderer-Actions) Modeli

┌─────────┐     ┌───────────┐     ┌──────────┐
│  Depo    │────▶│ Oluşturucu│────▶│  Eylemler│
│ (Durum)  │◀────│  (Görünüm)│◀────│ (Mantık) │
└─────────┘     └───────────┘     └──────────┘
      │                                  │
      └──── localStorage ◀──────────────┘
```

**15 modüler JS dosyası**, bağımlılık sırasına göre birleştirilir ve derleme zamanında tek bir HTML şablonuna enjekte edilir. Paketleyici yükü yok. Sanal DOM yok. Saf performans.

---

## 🚀 Hızlı Başlangıç

### İndir ve Çalıştır (Basit)

1. GitHub'dan en son sürümü **indirin**.
2. Klasörü herhangi bir yere **çıkartın**.
3. **Şu komutlardan birini çalıştırın:**

#### Seçenek 1: Python (macOS/Linux/Windows)
```bash
cd System-Hardening
python3 -m http.server 8000
```

#### Seçenek 2: Node.js (eğer yüklüyse)
```bash
cd System-Hardening
node server.js
```

4. **Tarayıcıyı açın**: `http://localhost:8000`

---

### Neden HTTP Sunucusu?
Tarayıcı güvenliği, `file://` protokolünün kaynakları yüklemesini engeller. Basit bir HTTP sunucusu bunu çözer.

### Neden Derleme Araçları Gerektirmez?
- **Sıfır npm paketi** — Tedarik zinciri riski yok.
- **Saf Vanilla JavaScript** — Kod, harici güncellemeler nedeniyle asla bozulmaz.
- **Olduğu gibi sunulur** — Kaynakta ne görüyorsanız onu alırsınız.
- **Terry Davis Felsefesi** — Sadece ihtiyacınız olanı inşa edin.

---

### Geliştirme (İsteğe Bağlı)

Katkıda bulunmak veya tam test paketini çalıştırmak için **`workspace` branch**'ine geçin:

```bash
git checkout workspace
cd System-Hardening

# Test paketini çalıştır
node tests/run-all.js

# Geliştirme sunucusunu başlat
node server.js
```

---

## 🕵️ Gizlilik Modu (OPSEC)

**Sanitize (Sterilize) Modunu** etkinleştirmek için **`Ctrl + Shift + H`** tuşlarına basın:
- Tüm hassas metrikleri ve kişisel verileri gizler.
- Markalamayı genel bir "Kişisel Takipçi" (Personal Tracker) olarak değiştirir.
- Kamuya açık ortamlarda (ofis, kütüphane vb.) kullanım için güvenlidir.

---

## 📁 Proje Yapısı

```
System-Hardening/
├── .gitignore
├── AGENTS.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── index.html
├── server.js
├── docs/
│   ├── assets/
│   │   └── void_tux_mascot.png
│   └── screenshots/
│       ├── anatomy_interactive.png
│       ├── dashboard_full_hd.png
│       ├── mental_full_hd.png
│       ├── nutrition_full_hd.png
│       ├── progress_full_hd.png
│       └── training_full_hd.png
├── memory-bank/
│   ├── activeContext.md
│   ├── productContext.md
│   ├── projectbrief.md
│   ├── progress.md
│   ├── roadmap.md
│   ├── systemPatterns.md
│   └── techContext.md
└── src/
    ├── assets/
... (Yapı README.md ile aynıdır)
```

---

## 🗺️ Yol Haritası

- [ ] Erişilebilirlik (A11Y) iyileştirmeleri
- [ ] Mobil kurulum için PWA desteği
- [ ] Hardcode dizgi ifadeleri + rota, hedef vb. ile ilgili derinlemesine bakım. Sabit değil, her şey değiştirilebilir olacak.

Nasıl dahil olacağınızı öğrenmek için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bakın.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır.

---

## ⭐ Destek

Bu proje yolculuğunuzda size yardımcı oluyorsa, bir **yıldız** ⭐ vermeyi düşünün — başkalarının keşfetmesine yardımcı olur.

---

<p align="center">
  <em>Bu bir oyun değil. Bu bir simülasyon değil. Bu senin hayatın. Sertleş ya da yok ol.</em>
</p>
