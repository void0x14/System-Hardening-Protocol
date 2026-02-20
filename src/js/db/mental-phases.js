// mental-phases.js - Mental Hardening Phases
// Extracted from original index.html

// Global scope assignment
import { CONFIG } from '../config/index.js';
import { DB } from '../config/db.js';

const MENTAL_PHASES = [
    {
        id: 1,
        title: "FAZ 1: JAGUAR TEORİSİ",
        desc: "Algı Yönetimi. Dışarıya güçlü görün, içeriği doldur.",
        core: "Dışarıdan bakıldığında kırılgan, dağınık veya çaresiz görünmemek. Önce dışarıya soğukkanlı, kontrollü ve güçlü bir 'kasa' kurmak, sonra bu kasanın içini zamanla gerçek performans ve kapasiteyle doldurmak.",
        intent: "İmaj ile iç gerçeklik arasındaki farkı bilinçli yönetmek. Şu an eksik olsan bile 'kendi kendini ciddiye alan' bir duruş inşa etmek.",
        strategy: ["Kendi hakkında sürekli şikâyet eden, mağdur tonundan çıkmak.", "İnsanlara problemlerini değil, hareket planını ve ilerlemeni göstermek.", "Her ortamda minimum şikâyet, maksimum çözüm/aksiyon cümlesi kullanmak."],
        practice: ["Günlük: En az 1 durumda 'şikâyet etmek yerine aksiyon cümlesi' kur.", "Günlük: Kendi hakkında negatif konuşmalarını fark edince durdurup nötr/çözüm odaklı cümleye çevir."]
    },
    {
        id: 2,
        title: "FAZ 2: KARANLIK SANATLAR",
        desc: "Sistemin açıklarını bul. 48 Yasa oku.",
        core: "İnsan ve sistem dinamiklerini naiflikten çıkıp daha soğuk ve analitik şekilde görmek. Sosyal oyunları, güç ilişkilerini ve manipülasyonları fark edip, bunları en azından savunma seviyesinde bilmek.",
        intent: "'Neden böyle oldu?' diye safça kalmak yerine, insanların hareketlerinin arkasındaki çıkar, korku ve güç dinamiklerini okumayı öğrenmek.",
        strategy: ["Temel kaynak: 48 Power Laws gibi kitapları saha rehberi gibi okumak.", "Günlük olayları 'hangi yasa / hangi dinamik' üzerinden işlediğini analiz etmek.", "Saflık ile aptallığı ayırmayı öğrenmek."],
        practice: ["Günlük: Gün içinde seni etkileyen 1 olayı seç ve 'burada kim ne istiyordu?' diye analiz et.", "Haftalık: En az 1 kere, birinin davranışını sadece söylediklerine göre değil, çıkarına göre yorumlamaya çalış."]
    },
    {
        id: 3,
        title: "FAZ 3: ROBOTİK İCRAAT",
        desc: "Duyguları kapat. Canın istemese de yap.",
        core: "'İçimden gelmiyor' bahanesini öldürmek. Duygusal moduna göre değil, protokole göre hareket etmek. Canın istemediği hâlde minimum paketi bile olsa işi yapmayı öğrenmek.",
        intent: "Ruh hâline göre değişmeyen, makine gibi çalışan küçük rutinler kurmak.",
        strategy: ["Her gün için 'duygu bağımsız' 2–3 zorunlu davranış belirlemek.", "Kendine duygu analizi değil, metrik soruları sormak: 'Yaptım mı / yapmadım mı?'.", "Minimum versiyonu kabul etmek: 0 yerine 1 birim iş."],
        practice: ["Günlük: Her ne olursa olsun yapacağın 2 küçük rutin belirle.", "Günlük: 'Canım istemiyor' dediğin anda, rutini en küçük versiyonuyla da olsa icra et."]
    },
    {
        id: 4,
        title: "FAZ 4: DEBUGGING",
        desc: "Reddedilmek hatadır. Analiz et, tekrar dene.",
        core: "Bir şey yolunda gitmediğinde bunu kişisel değerine saldırı gibi değil, sistemdeki bir bug gibi görmek. Reddedilme, başarısızlık, görmezden gelinme gibi olayları soğukkanlı şekilde dissect etmek.",
        intent: "'Ben kötüyüm' yerine 'denemem yanlış kurgulanmış' diyebilecek mesafe kazanmak.",
        strategy: ["Her başarısız girişimi 3 soruyla incelemek: Ne denedim? Nerede kırıldı? Ne değiştirebilirim?", "Aynı denemeyi iyileştirerek tekrar etmek.", "Veri toplamadan debugging yapmamak."],
        practice: ["Günlük/Haftalık: Sende iz bırakan her 'red' için 3 maddelik mini log yaz.", "Her red sonrası en az 1 tane 'revize edilmiş yeni deneme' belirle."]
    },
    {
        id: 5,
        title: "FAZ 5: ASYNC EXECUTION",
        desc: "Mükemmeli bekleme. Aksak ayakla yürü.",
        core: "Her şey hazır olmadan da harekete geçmek. Ekipman, ortam, ruh hâli, mükemmel plan beklemeden 'neyle mümkünse onunla' yola çıkmak.",
        intent: "Sürekli erteleyen 'hazırlık modu'ndan çıkıp, kusurlu ama çalışan bir yürüyüşe geçmek.",
        strategy: ["Projeleri 'mükemmel versiyon' yerine 'bugün başlayabileceğim minimum versiyon'la tanımlamak.", "Mazeret listesini kısaltmak.", "Küçük ama gerçek ilerleme metriği tutmak."],
        practice: ["Günlük: En az 1 projede 'hazır değilim' dediğin noktada 5–10 dakikalık mini icraat yap.", "Günlük: 'Bugün mükemmel değildi ama şunları yaptım' diye liste çıkar."]
    },
    {
        id: 6,
        title: "FAZ 6: ÜRETİCİ MODU",
        desc: "Tüketici olma. Tool yaz, içerik üret.",
        core: "Sürekli izleyen, okuyan, kaydıran tarafta kalmak yerine bir şeyler üreten tarafa geçmek. Bilgiyi sadece depolamak değil, işleyip dışarı veren sistem olmak.",
        intent: "Her gün seni 'izleyici' konumundan biraz daha 'üretici' konumuna taşıyan bir output bırakmak.",
        strategy: ["Tüketim/üretim oranını görmek için basit bir log tutmak.", "Tek bir üretim formatı seçmek.", "Tükettiğin her büyük içerik için en az 1 küçük üretim çıktısı bırakmak."],
        practice: ["Günlük: En az 1 'çıktı' bırak (tweet, kısa yazı, mini script, repo update vs).", "Günlük: Tüketimi belirli bir banda kilitle."]
    },
    {
        id: 7,
        title: "FAZ 7: ŞANS MİMARİSİ",
        desc: "Havuzunu kaz. Şans yağınca dolacak.",
        core: "Şansı, tamamen rastgele bir olay olarak değil, senin önceden kazdığın havuzlara yağacak bir yağmur gibi görmek. İnsanlar, beceriler, projeler ve görünürlük üzerinden şans yüzdüğünde yakalayabileceğin yüzey alanını büyütmek.",
        intent: "Gelecekteki fırsatlara hazır olacak altyapıyı bugünden kurmak.",
        strategy: ["Skill havuzu oluşturmak.", "Network havuzu oluşturmak.", "Görünürlük havuzu oluşturmak."],
        practice: ["Günlük/Haftalık: 1 kişiyle hafif bir temas kur.", "Haftalık: Yeni bir 'havuz taşı' ekle (küçük repo, not, proje)."]
    },
    {
        id: 8,
        title: "FAZ 8: DİNAMİK ADAPTASYON",
        desc: "Statik olma. Sürekli kendini güncelle.",
        core: "Planı kutsal değil, yönü kutsal görmek. Şartlara, geri bildirimlere ve kendi değişen hâline göre sistemi güncelleyebilmek.",
        intent: "Sürekli 'ben böyleyim' diye takılı kalmak yerine, versiyon numaranı yükselten bir yaklaşım benimsemek.",
        strategy: ["Haftalık review rutinini ciddiye almak.", "Sabit kimlik cümleleri yerine, 'şu an'ki versiyonunu tanımlayan ifadeler kullanmak.", "Hataları ve saçmalıkları 'sürüm notu' gibi yazmak."],
        practice: ["Haftalık: 20–30 dakikalık 'sistem review' zamanı ayır.", "Aylık: Kendine 'version log' yaz (Bu ay ne değişti?)."]
    }
];

// Add to DB namespace (exercises.js already declared DB)
DB.MENTAL_PHASES = MENTAL_PHASES;

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log('[DB] Mental phases loaded');
}

