// foods.js - Meal Plan Database
// Extracted from original index.html

const MEAL_PLAN_DB = {
    breakfast: [
        { text: "3 Yumurta (Tavada/Omlet) + 3 Dilim Kaşar + Ekmek", kcal: 550 },
        { text: "3 Haşlanmış Yumurta + 5-6 Zeytin + Bol Ekmek", kcal: 500 },
        { text: "Menemen (3 Yumurtalı) + Yarım Ekmek", kcal: 600 },
        { text: "Krep (2 Yumurta + 2 Bardak Süt + Un) + Fıstık Ezmesi", kcal: 700 },
        { text: "Sucuklu Yumurta (3 Yumurta) + Ekmek", kcal: 650 },
        { text: "Bal + Kaymak + 2 Dilim Ekmek + 1 Bardak Süt", kcal: 550 },
        { text: "Simit (2 Adet) + Beyaz Peynir + Çay", kcal: 480 },
        { text: "Poğaça (2 Adet) + Ayran", kcal: 520 },
        { text: "Peynir Tabağı (Kaşar + Beyaz) + Zeytin + Domates + Ekmek", kcal: 600 },
        { text: "Mercimek Çorbası (2 Kase) + Ekmek + Limon", kcal: 450 },
        { text: "Yulaf Lapası (Sütle) + Muz + Bal", kcal: 550 },
        { text: "Açma (2 Adet) + Nutella + Süt", kcal: 680 }
    ],
    fuel: [
        { text: "GAINER SHAKE (Temel: Süt + Yulaf + Muz)", kcal: 700 },
        { text: "GAINER SHAKE + 1 Muz (Ekstra)", kcal: 800 },
        { text: "SHAKE: Süt + Yulaf + Fıstık Ezmesi + Muz", kcal: 850 },
        { text: "SHAKE: Süt + Kakao + Yulaf + Bal", kcal: 750 },
        { text: "SHAKE: Süt + Muz + Hurma (3 Adet) + Yulaf", kcal: 780 },
        { text: "Kakaolu Süt (500ml) + 2 Muz", kcal: 550 },
        { text: "SHAKE: Süt + Cici Bebe + Muz", kcal: 720 },
        { text: "Ayran (500ml) + Fıstık Ezmeli Ekmek", kcal: 480 }
    ],
    lunch: [
        { text: "Tavuklu Pilav (1.5 Porsiyon / Bol Tavuklu)", kcal: 750 },
        { text: "Tavuk Döner (Tam Ekmek / Zurna Dürüm)", kcal: 800 },
        { text: "Kıymalı Pide (1.5 Porsiyon)", kcal: 750 },
        { text: "Makarna (Bol Salçalı ve Yağlı) + Yoğurt", kcal: 700 },
        { text: "İskender (1.5 Porsiyon)", kcal: 900 },
        { text: "Adana Dürüm (2 Adet)", kcal: 850 },
        { text: "Lahmacun (3 Adet) + Ayran", kcal: 700 },
        { text: "Kuru Fasulye + Pilav (Dolu Tabak) + Turşu", kcal: 750 },
        { text: "Tantuni Dürüm (2 Adet)", kcal: 720 },
        { text: "Köfte Ekmek (2 Adet) + Ayran", kcal: 680 },
        { text: "Etli Ekmek (1 Porsiyon)", kcal: 780 },
        { text: "Mantı (Dolu Tabak) + Yoğurt + Tereyağı", kcal: 820 },
        { text: "Çiğ Köfte Dürüm (2 Adet) + Şalgam", kcal: 600 },
        { text: "Mercimek Köftesi (10 Adet) + Ayran + Ekmek", kcal: 650 }
    ],
    pre_workout: [
        { text: "1 Muz + 1 Sade Kahve", kcal: 110 },
        { text: "2 Dilim Fıstık Ezmeli Ekmek", kcal: 350 },
        { text: "1 Paket Cici Bebe + Süt", kcal: 600 },
        { text: "3-4 Hurma + Türk Kahvesi", kcal: 180 },
        { text: "Kuru Kayısı (5-6 Adet) + 1 Avuç Fıstık", kcal: 280 },
        { text: "Muz + 1 Kaşık Fıstık Ezmesi", kcal: 220 },
        { text: "Yulaf Bar + Kahve", kcal: 250 },
        { text: "Pekmezli Ekmek (2 Dilim)", kcal: 300 }
    ],
    dinner: [
        { text: "Ev Yemeği (Bakliyat/Sebze) + 100gr Lor Peyniri", kcal: 500 },
        { text: "Kıymalı Makarna (Dolu Tabak) + Yoğurt", kcal: 650 },
        { text: "Tavuk Sote + Pilav (Dolu Tabak)", kcal: 700 },
        { text: "Karnıyarık (2 Adet) + Pilav", kcal: 750 },
        { text: "İmam Bayıldı (2 Adet) + Bulgur Pilavı", kcal: 680 },
        { text: "Etli Nohut + Pilav + Cacık", kcal: 720 },
        { text: "Köfte (6 Adet) + Patates Püresi + Salata", kcal: 780 },
        { text: "Tavuk Izgara (250g) + Makarna", kcal: 700 },
        { text: "Sebzeli Güveç + Ekmek + Yoğurt", kcal: 550 },
        { text: "Fırın Tavuk But (2 Adet) + Pilav", kcal: 800 },
        { text: "Mercimek Çorbası + Kaşarlı Tost", kcal: 580 },
        { text: "Zeytinyağlı Fasulye + Pilav + Cacık", kcal: 620 }
    ],
    night: [
        { text: "1 Bardak Süt + 1 Avuç Kuruyemiş (Fıstık/Leblebi)", kcal: 300 },
        { text: "Kaşarlı Tost (Çift Kaşarlı)", kcal: 400 },
        { text: "Kalan Shake (Varsa)", kcal: 300 },
        { text: "Süzme Yoğurt (200g) + Bal + Ceviz", kcal: 350 },
        { text: "Ayran (500ml) + 2 Dilim Kaşar", kcal: 280 },
        { text: "Muzlu Süt (Blender)", kcal: 300 },
        { text: "Kefir (500ml) + 1 Muz", kcal: 320 },
        { text: "Lor Peyniri (100g) + Bal", kcal: 200 },
        { text: "Gevrek + Süt (1 Kase)", kcal: 380 },
        { text: "Fıstık Ezmeli Ekmek + Süt", kcal: 420 }
    ]
};

// Add to DB namespace (exercises.js already declared DB)
DB.MEAL_PLAN_DB = MEAL_PLAN_DB;

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log('[DB] Meal plan database loaded');
}

