// exercises.js - Exercise Database
// Extracted from original index.html

import { CONFIG } from '../config/index.js';
import { DB } from '../config/db.js';

const DB = {};

DB.EXERCISES = {
    "stomach_vacuum": {
        title: "Stomach Vacuum",
        tags: ["Core", "İç Korse"],
        desc: "Sabah aç karnına. Nefesinin tamamını dışarı üfle. Nefes almadan göbeğini omurgana yapıştır. 10-15 saniye bekle. İç korseyi (Transversus Abdominis) sıkılaştırır.<br><br><strong>HEDEF:</strong> 3 Set x 15-20 Saniye Bekle.",
        steps: ["Nefesi boşalt.", "Vakumla.", "Bekle."]
    },
    "squat": {
        title: "Squat (Warmup)",
        tags: ["Bacak", "Kalça"],
        desc: "Ayaklar omuz genişliğinde. İnerken 'Sandalyeye oturur gibi' geriye git. Dizlerin içeri çökmesin. Kalkarken TOPUKLARINA bas.<br><br><strong>HEDEF:</strong> 4 Set x 20 Tekrar.",
        steps: ["Ayaklar omuz genişliğinde.", "Sırt dik.", "Topuklara bas."],
        videoId: "xqvCmoLULNY"
    },
    "goblet_squat": {
        title: "Goblet Squat (Yüklü)",
        tags: ["Bacak", "Güç"],
        desc: "Ayaklar omuz genişliğinde. Ağırlığı göğsüne YAPIŞTIR (Goblet). İnerken 'Sandalyeye oturur gibi' geriye git. Dizlerin içeri çökmesin (Valgus Collapse). Kalkarken TOPUKLARINA bas.<br><br><strong>HEDEF:</strong> 4 Set x 20 Tekrar.",
        steps: ["Ağırlığı kucakla.", "Kalça geriye.", "Topukla it."],
        videoId: "MxsFDhcyFyE"
    },
    "pushup": {
        title: "Incline/Standard Push-up",
        tags: ["Göğüs", "Patlayıcı Güç"],
        desc: "Eller koltuk/yatak kenarında (veya yerde). Vücut dümdüz (Plank formunda). İnerken 3 saniye (Yavaş/Negatif), kalkarken 1 saniye (Patlayıcı).<br><br><strong>HEDEF:</strong> 4 Set x MAKSİMUM Tekrar.",
        steps: ["Vücut ok gibi düz.", "Yavaş in (3sn).", "Patlayıcı kalk (1sn)."],
        videoId: "IODxDxX7oi4"
    },
    "one_arm_row": {
        title: "One Arm Row (Tek Kol Çekiş)",
        tags: ["Sırt", "Kanat"],
        desc: "Yatağın/Koltuğun kenarına geç. Bir elini ve dizini daya (Masa pozisyonu). Diğer elinle ağırlığı CEBİNE DOĞRU çek.<br><br><strong>HEDEF:</strong> 4 Set x 12 Tekrar (Her Kol).",
        steps: ["Masa pozisyonu al.", "Dirseği sürt.", "Cebine çek."],
        videoId: "pYcpY20QaE8"
    },
    "plank": {
        title: "RKC Plank",
        tags: ["Core", "Stabilizasyon"],
        desc: "Dirsekler omuz altında. Elleri birleştirme (Yumruk yap). Kalçanı sık (Posterior Tilt), karnını içeri vakumla.<br><br><strong>HEDEF:</strong> 3 Set x 30-45 Saniye.",
        steps: ["Dirsekler yerde.", "Götünü sık.", "Dirsekleri ayaklara çek."],
        videoId: "kL_NJAkCQBg"
    },
    "farmers_walk": {
        title: "Farmer's Walk",
        tags: ["Bilek", "Pençe Kuvveti"],
        desc: "Yükleri iki eline al. Omuzlar geride, göğüs ileride. Kollarını 'Ölü Ağırlık' gibi aşağı sal.<br><br><strong>HEDEF:</strong> 3 Tur (Parmaklar açılana kadar).",
        steps: ["Omuzlar geride.", "Kollar kilitli.", "Yürü."],
        videoId: "Fkzk_RqlYig"
    },
    "hammer_curl": {
        title: "Hammer Curl",
        tags: ["Biceps", "Ön Kol"],
        desc: "Ayakta dur. Ağırlığı çekiç tutar gibi kavra. Dirseklerini vücuduna YAPIŞTIR ve kilitle.<br><br><strong>HEDEF:</strong> 4 Set x 12 Tekrar.",
        steps: ["Dirsek yapışık.", "Çekiç tutuş.", "Yavaş indir."],
        videoId: "zC3nLlEvin4"
    },
    "kegel": {
        title: "Kegel",
        tags: ["Pelvis", "Cinsel Güç"],
        desc: "Tuvaletini tutar gibi PC kasını sık. Kalçanı veya karnını sıkma, sadece o bölgeyi izole et.<br><br><strong>HEDEF:</strong> 5 Set x 10 Tekrar.",
        steps: ["İzole et.", "Sık (3sn).", "Bırak (3sn)."]
    },
    "mountain_climber": {
        title: "Mountain Climber",
        tags: ["Kardiyo"],
        desc: "Yerde koşma.<br><br><strong>HEDEF:</strong> 3 x 45sn.",
        steps: ["Şınav pozisyonu.", "Koş."],
        videoId: "nmwgirgXLYM"
    },
    "lying_leg_raise": {
        title: "Lying Leg Raise",
        tags: ["Alt Karın", "Core"],
        desc: "Sırt üstü yat. ELLERİNİ KALÇANIN ALTINA KOY. Belini yere mühürle. Bacakları kaldır, indirirken BELİN KALKMADAN hemen önce dur.<br><br><strong>HEDEF:</strong> 4 Set x 12.",
        steps: ["Eller popo altı.", "Belini bas.", "Kontrollü indir."],
        videoId: "JB2oyawG9KI"
    },
    "eat_home": { title: "EV YEMEĞİ", tags: ["Beslenme"], desc: "Dışarıdan yeme.", steps: [] },
    "single_leg_raise": { title: "Single Leg Raise", tags: ["Alt Karın"], desc: "Tek tek kaldır.<br><br><strong>HEDEF:</strong> 4 Set x 12.", steps: ["Tek bacak."] },
    "bottle_curl": { title: "Bottle Curl", tags: ["Pazı"], desc: "Ağırlık ile curl.<br><br><strong>HEDEF:</strong> 4 Set x 12.", steps: ["Kaldır."] },
    "squat_heavy": { title: "Bulgarian Split Squat", tags: ["Bacak"], desc: "Ayağını arkadaki koltuğa koy. Tek bacakla çök kalk.<br><br><strong>HEDEF:</strong> 4 Set x 12 (Her Bacak).", steps: ["Tek ayak koltukta.", "Dik dur.", "Çök."] },
    "superman": {
        title: "Superman",
        tags: ["Alt Sırt", "Core"],
        desc: "Yüzüstü yat. Kollarını ve bacaklarını aynı anda kaldır. 2-3 saniye tepede tut.<br><br><strong>HEDEF:</strong> 3 Set x 12 Tekrar.",
        steps: ["Yüzüstü yat.", "Kol ve bacakları kaldır.", "Tepede tut."],
        videoId: "z6PJMT2y8GQ"
    },
    "neck_curl": {
        title: "Lying Neck Curls (Network Hardening)",
        tags: ["Boyun", "Stabilizasyon"],
        desc: "<strong>SYSTEM GOAL:</strong> Kalın boyun inşası - \"System Choke\" riskini minimize eder ve \"Server\" (Beyin) ünitesini fiziksel travmaya karşı korur.<br><br><strong>PROTOKOL:</strong> Sırt üstü yat, başın yatak/banktan sarkık. Alna havlu veya ağırlık yerleştir. Çeneyi göğse doğru kontrollü kıvır.<br><br><strong>HEDEF:</strong> 3 Set x 15-20 Tekrar (High Volume Traffic).",
        steps: ["Başı aşağı sarkıt.", "Ağırlığı alna koy.", "Çeneyi kıvır."],
        trackingType: "weighted",
        sets: 3
    },
    "wrist_curl": {
        title: "Wrist Curls (I/O Controller Upgrade)",
        tags: ["Ön Kol", "Kavrama"],
        desc: "<strong>SYSTEM GOAL:</strong> Vaskülarite (Front-end Estetik) ve Grip Strength (Hardware Input Control) artışı.<br><br><strong>PROTOKOL:</strong> Otur, ön kol uylukta, el dizden sarkık. 5L şişe tutarak sadece bileği yukarı kıvır.<br><br><strong>HEDEF:</strong> 3 Set x Failure (Stress Test).",
        steps: ["Kol uylukta.", "El sarkık.", "Bileği kıvır."],
        trackingType: "weighted",
        sets: 3
    },
    "tibialis_raise": {
        title: "Tibialis Raises (System Stability Patch)",
        tags: ["Kaval Kemiği", "Denge"],
        desc: "<strong>SYSTEM GOAL:</strong> \"Shin Splints\" (System Bugs) önleme, ayak bileği güçlendirme ve \"Glitchless\" hareket mekaniği sağlama.<br><br><strong>PROTOKOL:</strong> Duvara yaslan, bacaklar düz ve ileri. Topuklar yerde, parmak uçlarını baldırlara doğru kaldır.<br><br><strong>HEDEF:</strong> 3 Set x 25 Tekrar (Long-Term Support - LTS).",
        steps: ["Duvara yaslan.", "Bacaklar düz.", "Parmakları kaldır."],
        trackingType: "weighted",
        sets: 3
    },
    // ===========================================
    // LIFESTYLE & RECOVERY TASKS (Simple Toggle)
    // ===========================================
    "eat_bulk": {
        title: "BULK YE (Kalori Yükleme)",
        tags: ["Beslenme", "Yemek"],
        desc: "Kalori al. Hedef kaloriye ulaşmak için yüksek kalorili yemekler ye. Dirty bulk modunda sınır yok.",
        steps: ["Yemek ye.", "Kalori takip et.", "Hedefe ulaş."],
        trackingType: "simple",
        sets: 1
    },
    "stretch": {
        title: "ESNEME (System Recovery)",
        tags: ["Recovery", "Esneklik"],
        desc: "Kasları rahatla. 5-10 dakika esneme rutini yap. Özellikle çalışan kas gruplarına odaklan.",
        steps: ["Rahatla.", "5-10 dk esne.", "Nefes al."],
        trackingType: "simple",
        sets: 1
    },
    "weigh_in": {
        title: "TARTI (Weight Check)",
        tags: ["Ölçüm", "İzleme"],
        desc: "Sabah aç karnına tartıl ve kiloyu sisteme kaydet. Progress takibi için kritik.",
        steps: ["Tartıya çık.", "Kiloyu not et.", "Sisteme gir."],
        trackingType: "simple",
        sets: 1
    },
    "prep_food": {
        title: "YEMEK HAZIRLA (Meal Prep)",
        tags: ["Beslenme", "Planlama"],
        desc: "Haftanın yemeklerini hazırla. Tavuk haşla, pilav pişir, yumurta kaynat.",
        steps: ["Malzemeleri al.", "Pişir.", "Porsiyonla."],
        trackingType: "simple",
        sets: 1
    },
    "walk_outside": {
        title: "DIŞARI ÇIK (Outdoor Walk)",
        tags: ["Cardio", "Mental"],
        desc: "En az 20 dakika dışarıda yürü. Güneş ışığı, temiz hava, zihin temizliği.",
        steps: ["Dışarı çık.", "20+ dk yürü.", "Nefes al."],
        trackingType: "simple",
        sets: 1
    },
    "cool_down": {
        title: "SOĞUMA (Cool Down)",
        tags: ["Recovery", "Esneklik"],
        desc: "Antrenman sonrası soğuma. Nabzı düşür, hafif esneme yap.",
        steps: ["Yavaş yürü.", "Nefes kontrol.", "Esne."],
        trackingType: "simple",
        sets: 1
    }
};

// Foods database
DB.FOODS = [
    { id: 100, cat: "PROTOKOL", name: "GAINER SHAKE (Bizim Tarif)", type: "piece", vals: { cal: 850, prot: 35, carb: 100, fat: 35 }, unitName: "Adet" },
    { id: 101, cat: "PROTOKOL", name: "Zeytinyağı", type: "portion", vals: { cal: 884, prot: 0, carb: 0, fat: 100 }, options: [{ label: "1 Tatlı Kaşığı", ratio: 0.05 }, { label: "1 Yemek Kaşığı", ratio: 0.14 }] },
    { id: 1, cat: "PROTEİN", name: "Tavuk Göğsü (Haşlama/Izgara)", type: "portion", vals: { cal: 165, prot: 31, carb: 0, fat: 3.6 }, options: [{ label: "Küçük Porsiyon (100g)", ratio: 1 }, { label: "Normal Porsiyon (150g)", ratio: 1.5 }, { label: "Sporcu Porsiyonu (250g)", ratio: 2.5 }] },
    { id: 2, cat: "PROTEİN", name: "Tavuk But (Daha Yağlı)", type: "portion", vals: { cal: 210, prot: 24, carb: 0, fat: 12 }, options: [{ label: "1 Adet But", ratio: 1.5 }, { label: "2 Adet But", ratio: 3 }] },
    { id: 3, cat: "PROTEİN", name: "Köfte (Ev Yapımı)", type: "piece", vals: { cal: 60, prot: 5, carb: 2, fat: 4 }, unitName: "Adet" },
    { id: 4, cat: "PROTEİN", name: "Ton Balığı (Yağlı/Süzülmüş)", type: "portion", vals: { cal: 190, prot: 26, carb: 0, fat: 10 }, options: [{ label: "Küçük Kutu (80g)", ratio: 0.8 }, { label: "Büyük Kutu (160g)", ratio: 1.6 }] },
    { id: 5, cat: "PROTEİN", name: "Yumurta (Haşlanmış)", type: "piece", vals: { cal: 75, prot: 7, carb: 0.6, fat: 5 }, unitName: "Adet" },
    { id: 6, cat: "PROTEİN", name: "Lor Peyniri", type: "portion", vals: { cal: 90, prot: 15, carb: 2, fat: 1 }, options: [{ label: "3-4 Kaşık (100g)", ratio: 1 }, { label: "Yarım Paket (250g)", ratio: 2.5 }] },
    { id: 7, cat: "PROTEİN", name: "Kaşar Peyniri", type: "piece", vals: { cal: 70, prot: 5, carb: 0.5, fat: 6 }, unitName: "Dilim" },
    { id: 20, cat: "KARBONHİDRAT", name: "Pirinç Pilavı", type: "portion", vals: { cal: 130, prot: 2.7, carb: 28, fat: 0.3 }, options: [{ label: "Az (4-5 Kaşık)", ratio: 1 }, { label: "Tabak (200g)", ratio: 2 }, { label: "Dolu Tabak (300g)", ratio: 3 }] },
    { id: 21, cat: "KARBONHİDRAT", name: "Bulgur Pilavı", type: "portion", vals: { cal: 85, prot: 3, carb: 18, fat: 0.2 }, options: [{ label: "Az (4-5 Kaşık)", ratio: 1 }, { label: "Tabak (200g)", ratio: 2 }, { label: "Dolu Tabak (300g)", ratio: 3 }] },
    { id: 22, cat: "KARBONHİDRAT", name: "Makarna (Sade/Salçalı)", type: "portion", vals: { cal: 131, prot: 5, carb: 25, fat: 1 }, options: [{ label: "Küçük Tabak", ratio: 1 }, { label: "Normal Tabak", ratio: 2 }, { label: "Tepeleme Dolu", ratio: 3.5 }, { label: "Yarım Paket (Kuru)", ratio: 9 }] },
    { id: 23, cat: "KARBONHİDRAT", name: "Haşlanmış Patates", type: "piece", vals: { cal: 90, prot: 2, carb: 20, fat: 0.1 }, unitName: "Adet (Orta)" },
    { id: 24, cat: "KARBONHİDRAT", name: "Ekmek (Beyaz/Somun)", type: "portion", vals: { cal: 260, prot: 9, carb: 49, fat: 3 }, options: [{ label: "1 Dilim", ratio: 0.25 }, { label: "Çeyrek Ekmek", ratio: 0.6 }, { label: "Yarım Ekmek", ratio: 1.2 }] },
    { id: 25, cat: "KARBONHİDRAT", name: "Lavaş", type: "piece", vals: { cal: 180, prot: 5, carb: 35, fat: 2 }, unitName: "Adet" },
    { id: 40, cat: "SOKAK", name: "Tavuk Döner", type: "portion", vals: { cal: 250, prot: 15, carb: 30, fat: 10 }, options: [{ label: "Yarım Ekmek", ratio: 2 }, { label: "Dürüm", ratio: 2.5 }, { label: "Zurna Dürüm", ratio: 3.5 }] },
    { id: 41, cat: "SOKAK", name: "Et Döner", type: "portion", vals: { cal: 280, prot: 18, carb: 30, fat: 15 }, options: [{ label: "Yarım Ekmek", ratio: 2 }, { label: "Dürüm", ratio: 2.5 }, { label: "Porsiyon", ratio: 1.5 }] },
    { id: 42, cat: "SOKAK", name: "Lahmacun", type: "piece", vals: { cal: 180, prot: 10, carb: 25, fat: 5 }, unitName: "Adet" },
    { id: 43, cat: "SOKAK", name: "Çiğ Köfte", type: "portion", vals: { cal: 250, prot: 5, carb: 40, fat: 10 }, options: [{ label: "Dürüm", ratio: 1 }, { label: "Porsiyon (10 Sıkım)", ratio: 1.2 }] },
    { id: 44, cat: "SOKAK", name: "Simit", type: "piece", vals: { cal: 320, prot: 10, carb: 55, fat: 5 }, unitName: "Adet" },
    { id: 45, cat: "SOKAK", name: "Kıymalı Pide", type: "piece", vals: { cal: 500, prot: 20, carb: 60, fat: 20 }, unitName: "Adet (Tüm)" },
    { id: 60, cat: "EV YEMEĞİ", name: "Kuru Fasulye / Nohut", type: "portion", vals: { cal: 120, prot: 7, carb: 15, fat: 4 }, options: [{ label: "Az (Yarım Tabak)", ratio: 1 }, { label: "Tam Porsiyon", ratio: 2 }, { label: "Esnaf Porsiyonu (Bol)", ratio: 3 }] },
    { id: 61, cat: "EV YEMEĞİ", name: "Taze Fasulye / Türlü", type: "portion", vals: { cal: 70, prot: 2, carb: 8, fat: 4 }, options: [{ label: "Normal Tabak", ratio: 2 }, { label: "Dolu Tabak", ratio: 3 }] },
    { id: 62, cat: "EV YEMEĞİ", name: "Mercimek Çorbası", type: "portion", vals: { cal: 60, prot: 3, carb: 8, fat: 2 }, options: [{ label: "1 Kase", ratio: 2 }, { label: "Büyük Kase", ratio: 3 }] },
    { id: 63, cat: "EV YEMEĞİ", name: "Menemen", type: "portion", vals: { cal: 120, prot: 8, carb: 5, fat: 9 }, options: [{ label: "Yarım Tava (Tek Kişilik)", ratio: 2 }, { label: "Tam Tava", ratio: 4 }] },
    { id: 80, cat: "SNACK", name: "Cici Bebe", type: "portion", vals: { cal: 440, prot: 6, carb: 75, fat: 12 }, options: [{ label: "10 Adet", ratio: 0.4 }, { label: "Yarım Paket", ratio: 1 }, { label: "1 Kase Sütlü", ratio: 1.5 }] },
    { id: 81, cat: "SNACK", name: "Fıstık Ezmesi", type: "portion", vals: { cal: 590, prot: 25, carb: 20, fat: 50 }, options: [{ label: "1 Tatlı Kaşığı", ratio: 0.1 }, { label: "1 Yemek Kaşığı", ratio: 0.2 }, { label: "Tepeleme Kaşık", ratio: 0.35 }] },
    { id: 82, cat: "SNACK", name: "Yulaf Ezmesi", type: "portion", vals: { cal: 370, prot: 13, carb: 60, fat: 7 }, options: [{ label: "3-4 Kaşık", ratio: 0.4 }, { label: "1 Su Bardağı", ratio: 1 }, { label: "Büyük Kase", ratio: 1.5 }] },
    { id: 83, cat: "SNACK", name: "Muz", type: "piece", vals: { cal: 105, prot: 1, carb: 27, fat: 0.4 }, unitName: "Adet" },
    { id: 84, cat: "SNACK", name: "Süt (Tam/Yarım)", type: "portion", vals: { cal: 60, prot: 3, carb: 5, fat: 3 }, options: [{ label: "1 Bardak (200ml)", ratio: 2 }, { label: "Büyük Kupa (300ml)", ratio: 3 }, { label: "Yarım Kutu (500ml)", ratio: 5 }] },
    { id: 85, cat: "SNACK", name: "Yoğurt", type: "portion", vals: { cal: 65, prot: 4, carb: 5, fat: 3 }, options: [{ label: "1 Kase", ratio: 2 }, { label: "Büyük Kase", ratio: 3 }] },
    { id: 86, cat: "SNACK", name: "Cips", type: "portion", vals: { cal: 530, prot: 6, carb: 50, fat: 35 }, options: [{ label: "1 Avuç", ratio: 0.2 }, { label: "Küçük Paket", ratio: 0.5 }, { label: "Büyük Paket", ratio: 1.5 }] },
    { id: 87, cat: "SNACK", name: "Kakaolu Süt (Küçük)", type: "piece", vals: { cal: 150, prot: 6, carb: 20, fat: 4 }, unitName: "Kutu (200ml)" },
    { id: 88, cat: "SNACK", name: "Indomie Noodle", type: "piece", vals: { cal: 350, prot: 8, carb: 45, fat: 15 }, unitName: "Paket" },
    { id: 89, cat: "SNACK", name: "Kavrulmuş Fıstık (Tuzsuz)", type: "portion", vals: { cal: 170, prot: 7, carb: 6, fat: 14 }, options: [{ label: "1 Avuç (~30g)", ratio: 1 }, { label: "2 Avuç (~60g)", ratio: 2 }] },
    { id: 90, cat: "SNACK", name: "Kuru Kayısı", type: "piece", vals: { cal: 25, prot: 0.3, carb: 6, fat: 0 }, unitName: "Adet" }
];

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log(`[DB] ${Object.keys(DB.EXERCISES).length} exercises loaded`);
}
