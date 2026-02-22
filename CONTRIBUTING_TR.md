# Sistem Sertleştirme Protokolüne Katkıda Bulunmak

Öncelikle, sorumluluk aldığınız için teşekkürler. **Sistem Sertleştirme Protokolüne** katkıda bulunmak demek, insan optimizasyonu ve dijital egemenlik için bir araç inşa etmeye yardımcı olmak demektir. Biz sadece kod yazmıyoruz; varlığı sertleştiriyoruz.

---

<p align="center">
  <a href="CONTRIBUTING.md">English</a> | <a href="CONTRIBUTING_TR.md">Türkçe</a>
</p>

---

## 🔱 Temel İlkeler (Kurallar)

Tek bir satır yazmadan önce felsefemizi anlayın:

1.  **Sıfır Bağımlılık**: `npm install` yok. `Harici Framework` yok. `Tedarik Zinciri Riski` yok. Eğer bir yardımcı araca ihtiyacınız varsa, onu kendiniz yazın veya yerel bir Web API'si kullanın.
2.  **Saf Performans**: Saf ES6+ JavaScript ve CSS3. Sanal DOM veya ağır soyutlamalar kullanmıyoruz. Kod hızlı, yalın ve okunabilir olmalıdır.
3.  **Önce Gizlilik**: Tüm veriler kullanıcıya aittir. Telemetri yok, bulut senkronizasyonu yok, takip yok. Tek gerçeklik kaynağı LocalStorage'dır.
4.  **Terry Davis Felsefesi**: Sadece gerçekten ihtiyacınız olanı inşa edin. Şişkinlikten kaçının. "On metrelik bir sopa, beynin yerini tutmaz."
5.  **Hardcore Arayüz (UI)**: Arayüz askeri düzeydedir. Yüksek kontrast, karanlık mod, neon vurgular ve yüksek bilgi yoğunluğu.

---

## 🚀 Branch Stratejisi

İki ana branch ile çalışıyoruz:

-   **`main`**: "Kararlı/Üretim" branch'i. Mevcut savaşa hazır versiyonu içerir.
-   **`workspace`**: "Geliştirme" branch'i. Tüm aktif geliştirmeler, deneyler ve testler burada gerçekleşir.

**Kural**: ASLA doğrudan `main` branch'ine PR göndermeyin. Her zaman `workspace` branch'ini hedefleyin.

---

## 🛠️ Nasıl Katkıda Bulunulur?

1.  Depoyu **Fork** edin.
2.  **Workspace branch'ine geçin**: `git checkout workspace`.
3.  **Kendi görev branch'inizi oluşturun**: `git checkout -b feat/göreviniz`.
4.  **Uygulayın**: Mimari desenleri takip edin (Durum-Oluşturucu-Eylemler).
5.  **Test Edin**: Regresyon olmadığından emin olun. `node tests/run-all.js` komutunu çalıştırın.
    *(Not: `tests/` dizini **SADECE `workspace` branch'inde** mevcuttur; üretim `main` branch'inde bulunmaz).*
6.  **Commit**: Conventional Commits (Geleneksel Commit) yapısını kullanın.
7.  **Push ve PR**: `workspace` branch'ine bir Pull Request açın.

---

## 📁 Proje Mimarisi (İstihbarat)

Kodunuz mevcut modüler yapıya uygun olmalıdır:

```
src/js/
├── config/         # Sistem sabitleri, DB anahtarları ve doğrulama kuralları
├── core/           # EventBus ve temel konteyner mantığı
├── db/             # Statik veritabanları (Egzersizler, Gıdalar, Anatomi)
├── infrastructure/ # Depolama adaptörleri (LocalStorage/Memory)
├── locales/        # Uluslararasılaştırma dizgileri (en.json, tr.json)
├── performance/    # Sanal listeler, önbelleğe alma ve tembel yükleme
├── renderers/      # Düşük seviyeli UI oluşturma mantığı
├── repositories/   # Durum için veri erişim katmanı
├── services/       # İş mantığı (i18n, İstatistikler, Yedekleme)
├── state/          # Durum yönetimi (Reducers, Middleware)
├── ui/             # Üst seviye UI yönetimi
├── views/          # Bölüme özel görünümler (Panel, Antrenman vb.)
└── components/     # Yeniden kullanılabilir UI bileşenleri (Modallar, Kartlar vb.)
```

---

## 📏 Kod Standartları

### JavaScript
- **ES6+ Modüllerini** kullanın.
- Dolaylı olarak **Strict Mode** kullanın.
- `var` yok. Varsayılan olarak `const`, gerekirse `let` kullanın.
- Karmaşık mantığı JSDoc ile belgeleyin.
- **Saf Fonksiyonlar**: Mümkün olduğunda mantığı yan etkilerden ayırın.

### CSS
- `:root` içinde tanımlanan **CSS Değişkenlerini** kullanın.
- Satır içi (inline) stil yok.
- **Cyberpunk/Askeri** estetiği koruyun (Işımalar, kenarlıklar, spesifik HSL değerleri).

### Commit Mesajları
[Conventional Commits](https://www.conventionalcommits.org/) yapısını takip edin:
- yeni yetenekler için `feat:`.
- taktiksel hata düzeltmeleri için `fix:`.
- hızı artırmak/boyutu azaltmak için `perf:`.
- istihbarat güncellemeleri için `docs:`.
- mantığı değiştirmeden yapısal sertleştirme için `refactor:`.

---

## 📄 Lisans

Katkıda bulunarak, çalışmalarınızın **MIT Lisansı** altında lisanslanacağını kabul etmiş olursunuz.

---

<p align="center">
  <em>Disiplin özgürlüktür. Niyetle kodlayın.</em>
</p>
