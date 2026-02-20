export const tr = {
    app: {
        title: "SİSTEM DONANIM PROTOKOLÜ",
        version: "v8.3.1",
        status: "SİSTEM ÇEVRİMİÇİ"
    },
    nav: {
        settings: "AYARLAR",
        override: "OVERRIDE"
    },
    ui: {
        tabs: {
            dashboard: "DASHBOARD",
            training: "ANTRENMAN",
            nutrition: "BESLENME",
            progress: "GELİŞİM",
            anatomy: "ANATOMİ LAB",
            mental: "ZİHİNSEL"
        }
    },
    modal: {
        info: "BİLGİ",
        close: "Kapat"
    },
    alert: {
        title: "SİSTEM UYARISI",
        acknowledge: "ANLAŞILDI KOMUTANIM"
    },
    override: {
        mission: "GÖREV: TAMAMLANMAMIŞ İŞLER",
        exit: "ÇIKIŞ (ESC)"
    },
    dashboard: {
        system_integrity: "SYSTEM INTEGRITY",
        goal: "GOAL:",
        update_sensor: "[ UPDATE SENSOR ]",
        uptime_streak: "UPTIME STREAK",
        days: "GÜN",
        last_28_days: "SON 28 GÜN",
        consistency: "CONSISTENCY",
        daily_protocol: "DAILY PROTOCOL",
        training: "ANTRENMAN",
        tasks: "Görev",
        protein: "PROTEİN",
        missing: "EKSİK",
        sleep: "UYKU",
        hours: "Saat",
        click_to_save: "Kaydetmek icin tikla",
        hydration_level: "HYDRATION LEVEL",
        fuel_energy: "FUEL & ENERGY",
        energy_level: "ENERGY LEVEL",
        gainer_shake: "GAINER SHAKE",
        gainer_ingredients: "Süt + Yulaf + Fıstık + Muz",
        injected: "INJECTED",
        inject_now: "INJECT NOW",
        system_check: "SYSTEM CHECK: COMPLETE DAY",
        all_tasks_done: "ALL TASKS DONE"
    },
    training: {
        active_tasks: "AKTİF GÖREVLER",
        completed: "TAMAMLANANLAR",
        select_region: "Bölge Seçimi...",
        enter_set_rep: "Set / Tekrar girin",
        weight_kg: "Ağırlık (kg)",
        time_sec: "Süre (sn)",
        weighted_set: "Ağırlıklı Set",
        timed_set: "Süreli Set",
        finish_workout: "Antrenmanı Bitir",
        save: "KAYDET",
        done: "Bitti"
    },
    nutrition: {
        daily_protein: "Günlük Protein:",
        daily_cal: "Günlük Kalori:",
        breakfast: "KAHVALTI",
        lunch: "ÖĞLE",
        dinner: "AKŞAM",
        shake: "SHAKE",
        snack: "SNACK",
        add_meal: "{mealName} Ekle",
        macro_details: "Makro Detayları",
        grams: "Gram",
        kcal: "Kcal"
    },
    sleep: {
        sleep_level: "UYKU SEVİYESİ",
        sleep_hours_placeholder: "Uyku saati...",
        save_data: "VERİYİ KAYDET",
        warning: "Yetersiz uyku. Lütfen dinlenmeye özen göster."
    },
    db: {
        weekly_plan: {
            "1": { name: "PAZARTESİ", title: "FULL BODY START" },
            "2": { name: "SALI", title: "BESLENME & RECOVERY" },
            "3": { name: "ÇARŞAMBA", title: "CORE & KERNEL" },
            "4": { name: "PERŞEMBE", title: "LEG DAY" },
            "5": { name: "CUMA", title: "STRESS TEST" },
            "6": { name: "CUMARTESİ", title: "ACTIVE REST" },
            "0": { name: "PAZAR", title: "SYSTEM REBOOT" }
        },
        foods: {
            breakfast: {
                _0: "3 Yumurta (Tavada/Omlet) + 3 Dilim Kaşar + Ekmek",
                _1: "3 Haşlanmış Yumurta + 5-6 Zeytin + Bol Ekmek",
                _2: "Menemen (3 Yumurtalı) + Yarım Ekmek",
                _3: "Krep (2 Yumurta + 2 Bardak Süt + Un) + Fıstık Ezmesi",
                _4: "Sucuklu Yumurta (3 Yumurta) + Ekmek",
                _5: "Bal + Kaymak + 2 Dilim Ekmek + 1 Bardak Süt",
                _6: "Simit (2 Adet) + Beyaz Peynir + Çay",
                _7: "Poğaça (2 Adet) + Ayran",
                _8: "Peynir Tabağı (Kaşar + Beyaz) + Zeytin + Domates + Ekmek",
                _9: "Mercimek Çorbası (2 Kase) + Ekmek + Limon",
                _10: "Yulaf Lapası (Sütle) + Muz + Bal",
                _11: "Açma (2 Adet) + Nutella + Süt",
            },
            fuel: {
                _0: "GAINER SHAKE (Temel: Süt + Yulaf + Muz)",
                _1: "GAINER SHAKE + 1 Muz (Ekstra)",
                _2: "SHAKE: Süt + Yulaf + Fıstık Ezmesi + Muz",
                _3: "SHAKE: Süt + Kakao + Yulaf + Bal",
                _4: "SHAKE: Süt + Muz + Hurma (3 Adet) + Yulaf",
                _5: "Kakaolu Süt (500ml) + 2 Muz",
                _6: "SHAKE: Süt + Cici Bebe + Muz",
                _7: "Ayran (500ml) + Fıstık Ezmeli Ekmek",
            },
            lunch: {
                _0: "Tavuklu Pilav (1.5 Porsiyon / Bol Tavuklu)",
                _1: "Tavuk Döner (Tam Ekmek / Zurna Dürüm)",
                _2: "Kıymalı Pide (1.5 Porsiyon)",
                _3: "Makarna (Bol Salçalı ve Yağlı) + Yoğurt",
                _4: "İskender (1.5 Porsiyon)",
                _5: "Adana Dürüm (2 Adet)",
                _6: "Lahmacun (3 Adet) + Ayran",
                _7: "Kuru Fasulye + Pilav (Dolu Tabak) + Turşu",
                _8: "Tantuni Dürüm (2 Adet)",
                _9: "Köfte Ekmek (2 Adet) + Ayran",
                _10: "Etli Ekmek (1 Porsiyon)",
                _11: "Mantı (Dolu Tabak) + Yoğurt + Tereyağı",
                _12: "Çiğ Köfte Dürüm (2 Adet) + Şalgam",
                _13: "Mercimek Köftesi (10 Adet) + Ayran + Ekmek",
            },
            pre_workout: {
                _0: "1 Muz + 1 Sade Kahve",
                _1: "2 Dilim Fıstık Ezmeli Ekmek",
                _2: "1 Paket Cici Bebe + Süt",
                _3: "3-4 Hurma + Türk Kahvesi",
                _4: "Kuru Kayısı (5-6 Adet) + 1 Avuç Fıstık",
                _5: "Muz + 1 Kaşık Fıstık Ezmesi",
                _6: "Yulaf Bar + Kahve",
                _7: "Pekmezli Ekmek (2 Dilim)",
            },
            dinner: {
                _0: "Ev Yemeği (Bakliyat/Sebze) + 100gr Lor Peyniri",
                _1: "Kıymalı Makarna (Dolu Tabak) + Yoğurt",
                _2: "Tavuk Sote + Pilav (Dolu Tabak)",
                _3: "Karnıyarık (2 Adet) + Pilav",
                _4: "İmam Bayıldı (2 Adet) + Bulgur Pilavı",
                _5: "Etli Nohut + Pilav + Cacık",
                _6: "Köfte (6 Adet) + Patates Püresi + Salata",
                _7: "Tavuk Izgara (250g) + Makarna",
                _8: "Sebzeli Güveç + Ekmek + Yoğurt",
                _9: "Fırın Tavuk But (2 Adet) + Pilav",
                _10: "Mercimek Çorbası + Kaşarlı Tost",
                _11: "Zeytinyağlı Fasulye + Pilav + Cacık",
            },
            night: {
                _0: "1 Bardak Süt + 1 Avuç Kuruyemiş (Fıstık/Leblebi)",
                _1: "Kaşarlı Tost (Çift Kaşarlı)",
                _2: "Kalan Shake (Varsa)",
                _3: "Süzme Yoğurt (200g) + Bal + Ceviz",
                _4: "Ayran (500ml) + 2 Dilim Kaşar",
                _5: "Muzlu Süt (Blender)",
                _6: "Kefir (500ml) + 1 Muz",
                _7: "Lor Peyniri (100g) + Bal",
                _8: "Gevrek + Süt (1 Kase)",
                _9: "Fıstık Ezmeli Ekmek + Süt",
            },
        },
        exercises: {
            stomach_vacuum: {
                title: "Stomach Vacuum",
                desc: "Sabah aç karnına. Nefesinin tamamını dışarı üfle. Nefes almadan göbeğini omurgana yapıştır. 10-15 saniye bekle. İç korseyi (Transversus Abdominis) sıkılaştırır.<br><br><strong>HEDEF:</strong> 3 Set x 15-20 Saniye Bekle.",
                tags: {
                    _0: "Core",
                    _1: "İç Korse",
                },
                steps: {
                    _0: "Nefesi boşalt.",
                    _1: "Vakumla.",
                    _2: "Bekle.",
                },
            },
            squat: {
                title: "Squat (Warmup)",
                desc: "Ayaklar omuz genişliğinde. İnerken 'Sandalyeye oturur gibi' geriye git. Dizlerin içeri çökmesin. Kalkarken TOPUKLARINA bas.<br><br><strong>HEDEF:</strong> 4 Set x 20 Tekrar.",
                tags: {
                    _0: "Bacak",
                    _1: "Kalça",
                },
                steps: {
                    _0: "Ayaklar omuz genişliğinde.",
                    _1: "Sırt dik.",
                    _2: "Topuklara bas.",
                },
            },
            goblet_squat: {
                title: "Goblet Squat (Yüklü)",
                desc: "Ayaklar omuz genişliğinde. Ağırlığı göğsüne YAPIŞTIR (Goblet). İnerken 'Sandalyeye oturur gibi' geriye git. Dizlerin içeri çökmesin (Valgus Collapse). Kalkarken TOPUKLARINA bas.<br><br><strong>HEDEF:</strong> 4 Set x 20 Tekrar.",
                tags: {
                    _0: "Bacak",
                    _1: "Güç",
                },
                steps: {
                    _0: "Ağırlığı kucakla.",
                    _1: "Kalça geriye.",
                    _2: "Topukla it.",
                },
            },
            pushup: {
                title: "Incline/Standard Push-up",
                desc: "Eller koltuk/yatak kenarında (veya yerde). Vücut dümdüz (Plank formunda). İnerken 3 saniye (Yavaş/Negatif), kalkarken 1 saniye (Patlayıcı).<br><br><strong>HEDEF:</strong> 4 Set x MAKSİMUM Tekrar.",
                tags: {
                    _0: "Göğüs",
                    _1: "Patlayıcı Güç",
                },
                steps: {
                    _0: "Vücut ok gibi düz.",
                    _1: "Yavaş in (3sn).",
                    _2: "Patlayıcı kalk (1sn).",
                },
            },
            one_arm_row: {
                title: "One Arm Row (Tek Kol Çekiş)",
                desc: "Yatağın/Koltuğun kenarına geç. Bir elini ve dizini daya (Masa pozisyonu). Diğer elinle ağırlığı CEBİNE DOĞRU çek.<br><br><strong>HEDEF:</strong> 4 Set x 12 Tekrar (Her Kol).",
                tags: {
                    _0: "Sırt",
                    _1: "Kanat",
                },
                steps: {
                    _0: "Masa pozisyonu al.",
                    _1: "Dirseği sürt.",
                    _2: "Cebine çek.",
                },
            },
            plank: {
                title: "RKC Plank",
                desc: "Dirsekler omuz altında. Elleri birleştirme (Yumruk yap). Kalçanı sık (Posterior Tilt), karnını içeri vakumla.<br><br><strong>HEDEF:</strong> 3 Set x 30-45 Saniye.",
                tags: {
                    _0: "Core",
                    _1: "Stabilizasyon",
                },
                steps: {
                    _0: "Dirsekler yerde.",
                    _1: "Götünü sık.",
                    _2: "Dirsekleri ayaklara çek.",
                },
            },
            farmers_walk: {
                title: "Farmer's Walk",
                desc: "Yükleri iki eline al. Omuzlar geride, göğüs ileride. Kollarını 'Ölü Ağırlık' gibi aşağı sal.<br><br><strong>HEDEF:</strong> 3 Tur (Parmaklar açılana kadar).",
                tags: {
                    _0: "Bilek",
                    _1: "Pençe Kuvveti",
                },
                steps: {
                    _0: "Omuzlar geride.",
                    _1: "Kollar kilitli.",
                    _2: "Yürü.",
                },
            },
            hammer_curl: {
                title: "Hammer Curl",
                desc: "Ayakta dur. Ağırlığı çekiç tutar gibi kavra. Dirseklerini vücuduna YAPIŞTIR ve kilitle.<br><br><strong>HEDEF:</strong> 4 Set x 12 Tekrar.",
                tags: {
                    _0: "Biceps",
                    _1: "Ön Kol",
                },
                steps: {
                    _0: "Dirsek yapışık.",
                    _1: "Çekiç tutuş.",
                    _2: "Yavaş indir.",
                },
            },
            kegel: {
                title: "Kegel",
                desc: "Tuvaletini tutar gibi PC kasını sık. Kalçanı veya karnını sıkma, sadece o bölgeyi izole et.<br><br><strong>HEDEF:</strong> 5 Set x 10 Tekrar.",
                tags: {
                    _0: "Pelvis",
                    _1: "Cinsel Güç",
                },
                steps: {
                    _0: "İzole et.",
                    _1: "Sık (3sn).",
                    _2: "Bırak (3sn).",
                },
            },
            mountain_climber: {
                title: "Mountain Climber",
                desc: "Yerde koşma.<br><br><strong>HEDEF:</strong> 3 x 45sn.",
                tags: {
                    _0: "Kardiyo",
                },
                steps: {
                    _0: "Şınav pozisyonu.",
                    _1: "Koş.",
                },
            },
            lying_leg_raise: {
                title: "Lying Leg Raise",
                desc: "Sırt üstü yat. ELLERİNİ KALÇANIN ALTINA KOY. Belini yere mühürle. Bacakları kaldır, indirirken BELİN KALKMADAN hemen önce dur.<br><br><strong>HEDEF:</strong> 4 Set x 12.",
                tags: {
                    _0: "Alt Karın",
                    _1: "Core",
                },
                steps: {
                    _0: "Eller popo altı.",
                    _1: "Belini bas.",
                    _2: "Kontrollü indir.",
                },
            },
            eat_home: {
                title: "EV YEMEĞİ",
                desc: "Dışarıdan yeme.",
                tags: {
                    _0: "Beslenme",
                },
            },
            single_leg_raise: {
                title: "Single Leg Raise",
                desc: "Tek tek kaldır.<br><br><strong>HEDEF:</strong> 4 Set x 12.",
                tags: {
                    _0: "Alt Karın",
                },
                steps: {
                    _0: "Tek bacak.",
                },
            },
            bottle_curl: {
                title: "Bottle Curl",
                desc: "Ağırlık ile curl.<br><br><strong>HEDEF:</strong> 4 Set x 12.",
                tags: {
                    _0: "Pazı",
                },
                steps: {
                    _0: "Kaldır.",
                },
            },
            squat_heavy: {
                title: "Bulgarian Split Squat",
                desc: "Ayağını arkadaki koltuğa koy. Tek bacakla çök kalk.<br><br><strong>HEDEF:</strong> 4 Set x 12 (Her Bacak).",
                tags: {
                    _0: "Bacak",
                },
                steps: {
                    _0: "Tek ayak koltukta.",
                    _1: "Dik dur.",
                    _2: "Çök.",
                },
            },
            superman: {
                title: "Superman",
                desc: "Yüzüstü yat. Kollarını ve bacaklarını aynı anda kaldır. 2-3 saniye tepede tut.<br><br><strong>HEDEF:</strong> 3 Set x 12 Tekrar.",
                tags: {
                    _0: "Alt Sırt",
                    _1: "Core",
                },
                steps: {
                    _0: "Yüzüstü yat.",
                    _1: "Kol ve bacakları kaldır.",
                    _2: "Tepede tut.",
                },
            },
            neck_curl: {
                title: "Lying Neck Curls (Network Hardening)",
                desc: "<strong>SYSTEM GOAL:</strong> Kalın boyun inşası - \",
                tags: {
                    _0: "Boyun",
                    _1: "Stabilizasyon",
                },
                steps: {
                    _0: "Başı aşağı sarkıt.",
                    _1: "Ağırlığı alna koy.",
                    _2: "Çeneyi kıvır.",
                },
            },
            wrist_curl: {
                title: "Wrist Curls (I/O Controller Upgrade)",
                desc: "<strong>SYSTEM GOAL:</strong> Vaskülarite (Front-end Estetik) ve Grip Strength (Hardware Input Control) artışı.<br><br><strong>PROTOKOL:</strong> Otur, ön kol uylukta, el dizden sarkık. 5L şişe tutarak sadece bileği yukarı kıvır.<br><br><strong>HEDEF:</strong> 3 Set x Failure (Stress Test).",
                tags: {
                    _0: "Ön Kol",
                    _1: "Kavrama",
                },
                steps: {
                    _0: "Kol uylukta.",
                    _1: "El sarkık.",
                    _2: "Bileği kıvır.",
                },
            },
            tibialis_raise: {
                title: "Tibialis Raises (System Stability Patch)",
                desc: "<strong>SYSTEM GOAL:</strong> \",
                tags: {
                    _0: "Kaval Kemiği",
                    _1: "Denge",
                },
                steps: {
                    _0: "Duvara yaslan.",
                    _1: "Bacaklar düz.",
                    _2: "Parmakları kaldır.",
                },
            },
            eat_bulk: {
                title: "BULK YE (Kalori Yükleme)",
                desc: "Kalori al. Hedef kaloriye ulaşmak için yüksek kalorili yemekler ye. Dirty bulk modunda sınır yok.",
                tags: {
                    _0: "Beslenme",
                    _1: "Yemek",
                },
                steps: {
                    _0: "Yemek ye.",
                    _1: "Kalori takip et.",
                    _2: "Hedefe ulaş.",
                },
            },
            stretch: {
                title: "ESNEME (System Recovery)",
                desc: "Kasları rahatla. 5-10 dakika esneme rutini yap. Özellikle çalışan kas gruplarına odaklan.",
                tags: {
                    _0: "Recovery",
                    _1: "Esneklik",
                },
                steps: {
                    _0: "Rahatla.",
                    _1: "5-10 dk esne.",
                    _2: "Nefes al.",
                },
            },
            weigh_in: {
                title: "TARTI (Weight Check)",
                desc: "Sabah aç karnına tartıl ve kiloyu sisteme kaydet. Progress takibi için kritik.",
                tags: {
                    _0: "Ölçüm",
                    _1: "İzleme",
                },
                steps: {
                    _0: "Tartıya çık.",
                    _1: "Kiloyu not et.",
                    _2: "Sisteme gir.",
                },
            },
            prep_food: {
                title: "YEMEK HAZIRLA (Meal Prep)",
                desc: "Haftanın yemeklerini hazırla. Tavuk haşla, pilav pişir, yumurta kaynat.",
                tags: {
                    _0: "Beslenme",
                    _1: "Planlama",
                },
                steps: {
                    _0: "Malzemeleri al.",
                    _1: "Pişir.",
                    _2: "Porsiyonla.",
                },
            },
            walk_outside: {
                title: "DIŞARI ÇIK (Outdoor Walk)",
                desc: "En az 20 dakika dışarıda yürü. Güneş ışığı, temiz hava, zihin temizliği.",
                tags: {
                    _0: "Cardio",
                    _1: "Mental",
                },
                steps: {
                    _0: "Dışarı çık.",
                    _1: "20+ dk yürü.",
                    _2: "Nefes al.",
                },
            },
            cool_down: {
                title: "SOĞUMA (Cool Down)",
                desc: "Antrenman sonrası soğuma. Nabzı düşür, hafif esneme yap.",
                tags: {
                    _0: "Recovery",
                    _1: "Esneklik",
                },
                steps: {
                    _0: "Yavaş yürü.",
                    _1: "Nefes kontrol.",
                    _2: "Esne.",
                },
            },
        },
        foods_list: {
            _0: {
                name: "GAINER SHAKE (Bizim Tarif)",
                cat: "PROTOKOL",
            },
            _1: {
                name: "Zeytinyağı",
                cat: "PROTOKOL",
            },
            _2: {
            },
            _3: {
            },
            _4: {
                name: "Tavuk Göğsü (Haşlama/Izgara)",
                cat: "PROTEİN",
            },
            _5: {
            },
            _6: {
            },
            _7: {
            },
            _8: {
                name: "Tavuk But (Daha Yağlı)",
                cat: "PROTEİN",
            },
            _9: {
            },
            _10: {
            },
            _11: {
                name: "Köfte (Ev Yapımı)",
                cat: "PROTEİN",
            },
            _12: {
                name: "Ton Balığı (Yağlı/Süzülmüş)",
                cat: "PROTEİN",
            },
            _13: {
            },
            _14: {
            },
            _15: {
                name: "Yumurta (Haşlanmış)",
                cat: "PROTEİN",
            },
            _16: {
                name: "Lor Peyniri",
                cat: "PROTEİN",
            },
            _17: {
            },
            _18: {
            },
            _19: {
                name: "Kaşar Peyniri",
                cat: "PROTEİN",
            },
            _20: {
                name: "Pirinç Pilavı",
                cat: "KARBONHİDRAT",
            },
            _21: {
            },
            _22: {
            },
            _23: {
            },
            _24: {
                name: "Bulgur Pilavı",
                cat: "KARBONHİDRAT",
            },
            _25: {
            },
            _26: {
            },
            _27: {
            },
            _28: {
                name: "Makarna (Sade/Salçalı)",
                cat: "KARBONHİDRAT",
            },
            _29: {
            },
            _30: {
            },
            _31: {
            },
            _32: {
            },
            _33: {
                name: "Haşlanmış Patates",
                cat: "KARBONHİDRAT",
            },
            _34: {
                name: "Ekmek (Beyaz/Somun)",
                cat: "KARBONHİDRAT",
            },
            _35: {
            },
            _36: {
            },
            _37: {
            },
            _38: {
                name: "Lavaş",
                cat: "KARBONHİDRAT",
            },
            _39: {
                name: "Tavuk Döner",
                cat: "SOKAK",
            },
            _40: {
            },
            _41: {
            },
            _42: {
            },
            _43: {
                name: "Et Döner",
                cat: "SOKAK",
            },
            _44: {
            },
            _45: {
            },
            _46: {
            },
            _47: {
                name: "Lahmacun",
                cat: "SOKAK",
            },
            _48: {
                name: "Çiğ Köfte",
                cat: "SOKAK",
            },
            _49: {
            },
            _50: {
            },
            _51: {
                name: "Simit",
                cat: "SOKAK",
            },
            _52: {
                name: "Kıymalı Pide",
                cat: "SOKAK",
            },
            _53: {
                name: "Kuru Fasulye / Nohut",
                cat: "EV YEMEĞİ",
            },
            _54: {
            },
            _55: {
            },
            _56: {
            },
            _57: {
                name: "Taze Fasulye / Türlü",
                cat: "EV YEMEĞİ",
            },
            _58: {
            },
            _59: {
            },
            _60: {
                name: "Mercimek Çorbası",
                cat: "EV YEMEĞİ",
            },
            _61: {
            },
            _62: {
            },
            _63: {
                name: "Menemen",
                cat: "EV YEMEĞİ",
            },
            _64: {
            },
            _65: {
            },
            _66: {
                name: "Cici Bebe",
                cat: "SNACK",
            },
            _67: {
            },
            _68: {
            },
            _69: {
            },
            _70: {
                name: "Fıstık Ezmesi",
                cat: "SNACK",
            },
            _71: {
            },
            _72: {
            },
            _73: {
            },
            _74: {
                name: "Yulaf Ezmesi",
                cat: "SNACK",
            },
            _75: {
            },
            _76: {
            },
            _77: {
            },
            _78: {
                name: "Muz",
                cat: "SNACK",
            },
            _79: {
                name: "Süt (Tam/Yarım)",
                cat: "SNACK",
            },
            _80: {
            },
            _81: {
            },
            _82: {
            },
            _83: {
                name: "Yoğurt",
                cat: "SNACK",
            },
            _84: {
            },
            _85: {
            },
            _86: {
                name: "Cips",
                cat: "SNACK",
            },
            _87: {
            },
            _88: {
            },
            _89: {
            },
            _90: {
                name: "Kakaolu Süt (Küçük)",
                cat: "SNACK",
            },
            _91: {
                name: "Indomie Noodle",
                cat: "SNACK",
            },
            _92: {
                name: "Kavrulmuş Fıstık (Tuzsuz)",
                cat: "SNACK",
            },
            _93: {
            },
            _94: {
            },
            _95: {
                name: "Kuru Kayısı",
                cat: "SNACK",
            },
        },
        food_options: {
            _0: {
                _0: "1 Tatlı Kaşığı",
                _1: "1 Yemek Kaşığı",
            },
            _1: {
                _0: "Küçük Porsiyon (100g)",
                _1: "Normal Porsiyon (150g)",
                _2: "Sporcu Porsiyonu (250g)",
            },
            _2: {
                _0: "1 Adet But",
                _1: "2 Adet But",
            },
            _3: {
                _0: "Küçük Kutu (80g)",
                _1: "Büyük Kutu (160g)",
            },
            _4: {
                _0: "3-4 Kaşık (100g)",
                _1: "Yarım Paket (250g)",
            },
            _5: {
                _0: "Az (4-5 Kaşık)",
                _1: "Tabak (200g)",
                _2: "Dolu Tabak (300g)",
            },
            _6: {
                _0: "Az (4-5 Kaşık)",
                _1: "Tabak (200g)",
                _2: "Dolu Tabak (300g)",
            },
            _7: {
                _0: "Küçük Tabak",
                _1: "Normal Tabak",
                _2: "Tepeleme Dolu",
                _3: "Yarım Paket (Kuru)",
            },
            _8: {
                _0: "1 Dilim",
                _1: "Çeyrek Ekmek",
                _2: "Yarım Ekmek",
            },
            _9: {
                _0: "Yarım Ekmek",
                _1: "Dürüm",
                _2: "Zurna Dürüm",
            },
            _10: {
                _0: "Yarım Ekmek",
                _1: "Dürüm",
                _2: "Porsiyon",
            },
            _11: {
                _0: "Dürüm",
                _1: "Porsiyon (10 Sıkım)",
            },
            _12: {
                _0: "Az (Yarım Tabak)",
                _1: "Tam Porsiyon",
                _2: "Esnaf Porsiyonu (Bol)",
            },
            _13: {
                _0: "Normal Tabak",
                _1: "Dolu Tabak",
            },
            _14: {
                _0: "1 Kase",
                _1: "Büyük Kase",
            },
            _15: {
                _0: "Yarım Tava (Tek Kişilik)",
                _1: "Tam Tava",
            },
            _16: {
                _0: "10 Adet",
                _1: "Yarım Paket",
                _2: "1 Kase Sütlü",
            },
            _17: {
                _0: "1 Tatlı Kaşığı",
                _1: "1 Yemek Kaşığı",
                _2: "Tepeleme Kaşık",
            },
            _18: {
                _0: "3-4 Kaşık",
                _1: "1 Su Bardağı",
                _2: "Büyük Kase",
            },
            _19: {
                _0: "1 Bardak (200ml)",
                _1: "Büyük Kupa (300ml)",
                _2: "Yarım Kutu (500ml)",
            },
            _20: {
                _0: "1 Kase",
                _1: "Büyük Kase",
            },
            _21: {
                _0: "1 Avuç",
                _1: "Küçük Paket",
                _2: "Büyük Paket",
            },
            _22: {
                _0: "1 Avuç (~30g)",
                _1: "2 Avuç (~60g)",
            },
        },
        mental_phases: {
            _0: {
                title: "FAZ 1: JAGUAR TEORİSİ",
                desc: "Algı Yönetimi. Dışarıya güçlü görün, içeriği doldur.",
                core: "Dışarıdan bakıldığında kırılgan, dağınık veya çaresiz görünmemek. Önce dışarıya soğukkanlı, kontrollü ve güçlü bir 'kasa' kurmak, sonra bu kasanın içini zamanla gerçek performans ve kapasiteyle doldurmak.",
                intent: "İmaj ile iç gerçeklik arasındaki farkı bilinçli yönetmek. Şu an eksik olsan bile 'kendi kendini ciddiye alan' bir duruş inşa etmek.",
                strategy: {
                    _0: "Kendi hakkında sürekli şikâyet eden, mağdur tonundan çıkmak.",
                    _1: "İnsanlara problemlerini değil, hareket planını ve ilerlemeni göstermek.",
                    _2: "Her ortamda minimum şikâyet, maksimum çözüm/aksiyon cümlesi kullanmak.",
                },
                practice: {
                    _0: "Günlük: En az 1 durumda 'şikâyet etmek yerine aksiyon cümlesi' kur.",
                    _1: "Günlük: Kendi hakkında negatif konuşmalarını fark edince durdurup nötr/çözüm odaklı cümleye çevir.",
                },
            },
            _1: {
                title: "FAZ 2: KARANLIK SANATLAR",
                desc: "Sistemin açıklarını bul. 48 Yasa oku.",
                core: "İnsan ve sistem dinamiklerini naiflikten çıkıp daha soğuk ve analitik şekilde görmek. Sosyal oyunları, güç ilişkilerini ve manipülasyonları fark edip, bunları en azından savunma seviyesinde bilmek.",
                intent: "'Neden böyle oldu?' diye safça kalmak yerine, insanların hareketlerinin arkasındaki çıkar, korku ve güç dinamiklerini okumayı öğrenmek.",
                strategy: {
                    _0: "Temel kaynak: 48 Power Laws gibi kitapları saha rehberi gibi okumak.",
                    _1: "Günlük olayları 'hangi yasa / hangi dinamik' üzerinden işlediğini analiz etmek.",
                    _2: "Saflık ile aptallığı ayırmayı öğrenmek.",
                },
                practice: {
                    _0: "Günlük: Gün içinde seni etkileyen 1 olayı seç ve 'burada kim ne istiyordu?' diye analiz et.",
                    _1: "Haftalık: En az 1 kere, birinin davranışını sadece söylediklerine göre değil, çıkarına göre yorumlamaya çalış.",
                },
            },
            _2: {
                title: "FAZ 3: ROBOTİK İCRAAT",
                desc: "Duyguları kapat. Canın istemese de yap.",
                core: "'İçimden gelmiyor' bahanesini öldürmek. Duygusal moduna göre değil, protokole göre hareket etmek. Canın istemediği hâlde minimum paketi bile olsa işi yapmayı öğrenmek.",
                intent: "Ruh hâline göre değişmeyen, makine gibi çalışan küçük rutinler kurmak.",
                strategy: {
                    _0: "Her gün için 'duygu bağımsız' 2–3 zorunlu davranış belirlemek.",
                    _1: "Kendine duygu analizi değil, metrik soruları sormak: 'Yaptım mı / yapmadım mı?'.",
                    _2: "Minimum versiyonu kabul etmek: 0 yerine 1 birim iş.",
                },
                practice: {
                    _0: "Günlük: Her ne olursa olsun yapacağın 2 küçük rutin belirle.",
                    _1: "Günlük: 'Canım istemiyor' dediğin anda, rutini en küçük versiyonuyla da olsa icra et.",
                },
            },
            _3: {
                title: "FAZ 4: DEBUGGING",
                desc: "Reddedilmek hatadır. Analiz et, tekrar dene.",
                core: "Bir şey yolunda gitmediğinde bunu kişisel değerine saldırı gibi değil, sistemdeki bir bug gibi görmek. Reddedilme, başarısızlık, görmezden gelinme gibi olayları soğukkanlı şekilde dissect etmek.",
                intent: "'Ben kötüyüm' yerine 'denemem yanlış kurgulanmış' diyebilecek mesafe kazanmak.",
                strategy: {
                    _0: "Her başarısız girişimi 3 soruyla incelemek: Ne denedim? Nerede kırıldı? Ne değiştirebilirim?",
                    _1: "Aynı denemeyi iyileştirerek tekrar etmek.",
                    _2: "Veri toplamadan debugging yapmamak.",
                },
                practice: {
                    _0: "Günlük/Haftalık: Sende iz bırakan her 'red' için 3 maddelik mini log yaz.",
                    _1: "Her red sonrası en az 1 tane 'revize edilmiş yeni deneme' belirle.",
                },
            },
            _4: {
                title: "FAZ 5: ASYNC EXECUTION",
                desc: "Mükemmeli bekleme. Aksak ayakla yürü.",
                core: "Her şey hazır olmadan da harekete geçmek. Ekipman, ortam, ruh hâli, mükemmel plan beklemeden 'neyle mümkünse onunla' yola çıkmak.",
                intent: "Sürekli erteleyen 'hazırlık modu'ndan çıkıp, kusurlu ama çalışan bir yürüyüşe geçmek.",
                strategy: {
                    _0: "Projeleri 'mükemmel versiyon' yerine 'bugün başlayabileceğim minimum versiyon'la tanımlamak.",
                    _1: "Mazeret listesini kısaltmak.",
                    _2: "Küçük ama gerçek ilerleme metriği tutmak.",
                },
                practice: {
                    _0: "Günlük: En az 1 projede 'hazır değilim' dediğin noktada 5–10 dakikalık mini icraat yap.",
                    _1: "Günlük: 'Bugün mükemmel değildi ama şunları yaptım' diye liste çıkar.",
                },
            },
            _5: {
                title: "FAZ 6: ÜRETİCİ MODU",
                desc: "Tüketici olma. Tool yaz, içerik üret.",
                core: "Sürekli izleyen, okuyan, kaydıran tarafta kalmak yerine bir şeyler üreten tarafa geçmek. Bilgiyi sadece depolamak değil, işleyip dışarı veren sistem olmak.",
                intent: "Her gün seni 'izleyici' konumundan biraz daha 'üretici' konumuna taşıyan bir output bırakmak.",
                strategy: {
                    _0: "Tüketim/üretim oranını görmek için basit bir log tutmak.",
                    _1: "Tek bir üretim formatı seçmek.",
                    _2: "Tükettiğin her büyük içerik için en az 1 küçük üretim çıktısı bırakmak.",
                },
                practice: {
                    _0: "Günlük: En az 1 'çıktı' bırak (tweet, kısa yazı, mini script, repo update vs).",
                    _1: "Günlük: Tüketimi belirli bir banda kilitle.",
                },
            },
            _6: {
                title: "FAZ 7: ŞANS MİMARİSİ",
                desc: "Havuzunu kaz. Şans yağınca dolacak.",
                core: "Şansı, tamamen rastgele bir olay olarak değil, senin önceden kazdığın havuzlara yağacak bir yağmur gibi görmek. İnsanlar, beceriler, projeler ve görünürlük üzerinden şans yüzdüğünde yakalayabileceğin yüzey alanını büyütmek.",
                intent: "Gelecekteki fırsatlara hazır olacak altyapıyı bugünden kurmak.",
                strategy: {
                    _0: "Skill havuzu oluşturmak.",
                    _1: "Network havuzu oluşturmak.",
                    _2: "Görünürlük havuzu oluşturmak.",
                },
                practice: {
                    _0: "Günlük/Haftalık: 1 kişiyle hafif bir temas kur.",
                    _1: "Haftalık: Yeni bir 'havuz taşı' ekle (küçük repo, not, proje).",
                },
            },
            _7: {
                title: "FAZ 8: DİNAMİK ADAPTASYON",
                desc: "Statik olma. Sürekli kendini güncelle.",
                core: "Planı kutsal değil, yönü kutsal görmek. Şartlara, geri bildirimlere ve kendi değişen hâline göre sistemi güncelleyebilmek.",
                intent: "Sürekli 'ben böyleyim' diye takılı kalmak yerine, versiyon numaranı yükselten bir yaklaşım benimsemek.",
                strategy: {
                    _0: "Haftalık review rutinini ciddiye almak.",
                    _1: "Sabit kimlik cümleleri yerine, 'şu an'ki versiyonunu tanımlayan ifadeler kullanmak.",
                    _2: "Hataları ve saçmalıkları 'sürüm notu' gibi yazmak.",
                },
                practice: {
                    _0: "Haftalık: 20–30 dakikalık 'sistem review' zamanı ayır.",
                    _1: "Aylık: Kendine 'version log' yaz (Bu ay ne değişti?).",
                },
            },
        },
        anatomy: {
            chest: { name: "Pectoralis Major", function: "İtme kuvveti.", system: "Üst Gövde İtiş", action: "Push-up, Floor Press", recovery: "48-72 Saat" },
            abs: { name: "Rectus Abdominis", function: "Core gücü, cinsel dayanıklılık.", system: "Merkezi Denge", action: "Plank, Leg Raise, Vacuum", recovery: "24-48 Saat" },
            quads: { name: "Quadriceps", function: "Vücudu taşıma, piston gücü.", system: "Lokomotor", action: "Squat", recovery: "72 Saat" },
            biceps: { name: "Biceps Brachii", function: "Çekme, kavrama.", system: "Üst Gövde Çekiş", action: "Hammer Curl", recovery: "48 Saat" },
            traps: { name: "Trapezius", function: "Omuz stabilizasyonu.", system: "Posterior Zincir", action: "Farmer's Walk", recovery: "48 Saat" },
            lats: { name: "Latissimus Dorsi", function: "Gövdeyi yukarı çekme.", system: "Posterior Zincir", action: "One Arm Row", recovery: "48-72 Saat" },
            glutes: { name: "Gluteus Maximus", function: "İtiş gücü (Thrust).", system: "Güç Merkezi", action: "Squat", recovery: "72 Saat" },
            hamstrings: { name: "Hamstrings", function: "Diz bükme.", system: "Lokomotor", action: "Squat", recovery: "48-72 Saat" },
            lowerback: { name: "Erector Spinae", function: "Omurgayı dik tutma.", system: "Core Destek", action: "Superman", recovery: "48 Saat" },
            pelvic: { name: "Pelvik Taban", function: "Boşalma kontrolü.", system: "Üreme", action: "Kegel", recovery: "24 Saat" }
        }
    }
};
