// actions.js - User Interaction Event Handlers
// Extracted from original index.html lines 3038-3973

// Using window. for global scope access
const Actions = window.Actions = {
    // v7.1.0: Video modal
    playVideo(videoId) {
        const html = `<div class="aspect-video w-full"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        UI.modal.open('Video Eğitimi', html);
    },

    // v8.3.0: Fixed Error 153 by removing Data URI wrapper
    playVideoInline(el, videoId) {
        // Direct injection to preserve Origin/Referer headers
        // This fixes "Video unavailable" (Error 153) caused by opaque origin in data: URIs
        el.innerHTML = `<iframe 
            class="w-full aspect-video" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
            title="YouTube video player"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
        </iframe>`;

        el.onclick = null;
        el.classList.remove('cursor-pointer', 'hover:border-red-600/50');
    },

    async switchTab(id) {
        Store.state.activeTab = id;
        UI.updateTab(id);
        document.getElementById('view-container').innerHTML = await Renderers[id]();
    },

    async saveWeight(v) {
        const num = parseFloat(v);
        if (isNaN(num) || num <= 0 || num > 300) {
            UI.showToast("Geçersiz kilo!", "error");
            return;
        }
        if (await Store.saveWeight(num)) {
            UI.showToast("Kilo güncellendi.");
            this.switchTab('dashboard');
        }
    },

    async injectFuel() {
        await Store.saveFuel();
        const messages = [
            { emoji: "⛽", text: "YAKIT ALINDI!", sub: "Motor çalışıyor. Kaslar büyüyor." },
            { emoji: "🍼", text: "SHAKE İÇİLDİ!", sub: "Protein sızıyor. Anabolizma aktif." },
            { emoji: "🚀", text: "GÜÇ YÜKLENDİ!", sub: "Enerji deposu %100. Hazırsın." },
            { emoji: "💪", text: "KAS YAPIMI BAŞLADI!", sub: "Her yudum seni güçlendiriyor." },
            { emoji: "🥤", text: "GAINER TAMAM!", sub: "Bulk sezonunda önemli adım." }
        ];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        UI.showEpicOverlay(msg.emoji, msg.text, msg.sub, '#ff6b35');
        setTimeout(() => this.switchTab('dashboard'), 2300);
    },

    // --- SLEEP & WATER ACTIONS ---
    async saveSleep() {
        const input = document.getElementById('sleep-input');
        if (!input || !input.value) { UI.showToast("Uyku saati girin!", "error"); return; }
        const hours = parseFloat(input.value);
        if (hours < 0 || hours > 14) { UI.showToast("Geçersiz değer (0-14)", "error"); return; }
        await Store.setSleep(hours);
        UI.showToast(`Uyku kaydedildi: ${hours} saat`);
        this.switchTab('dashboard');
    },

    async addWater(cups) {
        const current = await Store.getWater(Utils.dateStr());
        const newVal = Math.max(0, current + cups);
        await Utils.storage.set(CONFIG.KEYS.WATER + Utils.dateStr(), newVal);
        if (cups > 0) UI.showToast(`+ ${cups} bardak 💧`);
        this.switchTab('dashboard');
    },

    /**
     * Quick add meal by food ID (for quick-add buttons)
     * Uses default portion (1 unit for piece, first option for portion)
     * @param {number} foodId - Food ID from DB.FOODS
     */
    async quickAddMeal(foodId) {
        const foods = Store.getAllFoods();
        const food = foods.find(f => f.id === foodId);
        if (!food) {
            UI.showToast("Yiyecek bulunamadı!", "error");
            return;
        }

        let ratio = 1;
        let unitLabel = "";

        if (food.type === 'portion') {
            // Use first option as default
            const opt = food.options[0];
            ratio = opt.ratio;
            unitLabel = opt.label;
        } else if (food.type === 'piece') {
            ratio = 1;
            unitLabel = food.unitName || 'Adet';
        } else {
            ratio = 1;
            unitLabel = 'Adet';
        }

        await Store.addMeal({
            name: food.name,
            amount: 1,
            unit: food.type || 'custom',
            portionLabel: unitLabel,
            cal: Math.round(food.vals.cal * ratio),
            prot: Math.round(food.vals.prot * ratio),
            carb: Math.round(food.vals.carb * ratio),
            fat: Math.round(food.vals.fat * ratio)
        });

        UI.showToast(`${food.name} eklendi ⚡`);
        this.switchTab('nutrition');
    },

    async toggleTask(id) {
        await Store.toggleTask(id);
        this.switchTab('training');
    },

    // ROBOT MODE (EMOTION OVERRIDE) SYSTEM
    overrideState: { active: false, startTime: null, timerInterval: null },

    async toggleOverride() {
        if (this.overrideState.active) {
            this.exitOverride();
            return;
        }

        this.overrideState.active = true;
        this.overrideState.startTime = Date.now();
        document.body.classList.add('override-mode');

        const btn = document.getElementById('btn-override');
        btn.innerHTML = '<i class="fas fa-skull mr-1"></i> ROBOT MODE';
        btn.classList.add('bg-red-900', 'animate-pulse');

        this.overrideState.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.overrideState.startTime) / 1000);
            const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const secs = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('override-timer').textContent = `${mins}:${secs} `;
        }, 1000);

        const mission = await this.generateOverrideMission();
        document.getElementById('override-mission').textContent = mission;

        const commands = [
            "DUYGULAR ÖNEMSİZ. GÖREV KUTSAL.",
            "CANIM İSTEMİYOR DEME. YAP.",
            "AKSAK AYAKLA YÜRÜ, AMA YÜRÜ.",
            "ŞİMDİ YAPMAZSAN KİM YAPACAK?",
            "BU SENİN SEÇİMİN. ROBOT GİBİ ÇALIŞ."
        ];
        UI.showToast(commands[Math.floor(Math.random() * commands.length)], "warning");

        const currentTab = Store.state.activeTab || 'training';
        this.switchTab(currentTab);

        document.addEventListener('keydown', this.handleOverrideEsc);
    },

    handleOverrideEsc(e) {
        if (e.key === 'Escape' && Actions.overrideState.active) {
            Actions.exitOverride();
        }
    },

    exitOverride() {
        this.overrideState.active = false;
        document.body.classList.remove('override-mode');

        const btn = document.getElementById('btn-override');
        btn.innerHTML = '<i class="fas fa-power-off mr-1"></i> EMOTION OVERRIDE';
        btn.classList.remove('bg-red-900', 'animate-pulse');

        if (this.overrideState.timerInterval) {
            clearInterval(this.overrideState.timerInterval);
        }

        const elapsed = Math.floor((Date.now() - this.overrideState.startTime) / 1000);
        const mins = Math.floor(elapsed / 60);
        UI.showToast(`Robot Modu: ${mins} dakika odaklandın.`);

        document.removeEventListener('keydown', this.handleOverrideEsc);
    },

    async generateOverrideMission() {
        const today = Utils.dateStr();
        const workout = await Store.getWorkout(today);
        const meals = await Store.getMeals(today);
        const day = new Date().getDay();
        const plan = WEEKLY_PLAN[day];

        const incompleteTasks = plan.tasks.filter(t => !workout.includes(t)).length;
        const totalCal = meals.reduce((sum, m) => sum + m.cal, 0);
        const calDeficit = CONFIG.TARGETS.CAL - totalCal;

        if (incompleteTasks > 0) {
            return `GÖREV: ${incompleteTasks} ANTRENMAN KALDI`;
        } else if (calDeficit > 500) {
            return `GÖREV: ${calDeficit} KALORİ EKSİK`;
        } else if (calDeficit > 0) {
            return `GÖREV: ${calDeficit} KAL EKSİK - BİTİRE GEL`;
        } else {
            return "TÜM GÖREVLER TAMAM. KAZANDIN.";
        }
    },

    async rerollPlan() {
        await Store.generateDailyPlan();
        UI.showToast("Günlük menü yenilendi.");
        this.switchTab('nutrition');
    },

    async deleteMeal(index) {
        if (await Store.deleteMeal(index)) {
            UI.showToast("Öğün silindi.");
            this.switchTab('nutrition');
        }
    },

    openMealModal() {
        const foods = Store.getAllFoods();
        UI.modal.open("YAKIT EKLE", `
            <div class="flex gap-2 mb-4 border-b border-gray-800 pb-2">
                <button onclick="document.getElementById('tab-exist').style.display='block';document.getElementById('tab-new').style.display='none'" class="text-xs text-neon-green font-bold hover:underline">LİSTEDEN SEÇ</button>
                <button onclick="document.getElementById('tab-exist').style.display='none';document.getElementById('tab-new').style.display='block'" class="text-xs text-gray-500 font-bold hover:text-white hover:underline">YENİ TANIMLA</button>
            </div>
            <div id="tab-exist">
                <div class="space-y-4">
                    <div>
                        <input type="text" id="food-search" placeholder="Besin Ara (örn: Döner, Pilav)" class="${THEME.input} mb-2 border-neon-blue/30 text-sm" onkeyup="UI.filterFoodList()">
                        <select id="m-food" class="${THEME.input} custom-scrollbar" onchange="UI.renderPortionInputs()" size="5">
                            ${foods.map((f, i) => `<option value="${i}">${Utils.escapeHtml(f.name)}</option>`).join('')}
                        </select>
                    </div>
                    <div id="portion-container">
                        <!-- Dynamic Inputs Here -->
                    </div>
                    <button onclick="Actions.submitMeal()" class="${THEME.btn} w-full mt-2">EKLE</button>
                </div>
            </div>
            <div id="tab-new" style="display:none">
                <div class="space-y-3">
                    <input type="text" id="new-name" placeholder="Besin Adı (Örn: Çiğ Köfte)" class="${THEME.input}">
                    <div class="grid grid-cols-2 gap-2">
                        <input type="number" id="new-cal" placeholder="Kalori (100g veya Adet)" class="${THEME.input}">
                        <input type="number" id="new-prot" placeholder="Protein" class="${THEME.input}">
                        <input type="number" id="new-carb" placeholder="Karbonhidrat" class="${THEME.input}">
                        <input type="number" id="new-fat" placeholder="Yağ" class="${THEME.input}">
                    </div>
                     <div>
                        <label class="text-[10px] text-gray-500 font-bold block mb-1">BİRİM TÜRÜ</label>
                        <select id="new-unit" class="${THEME.input}">
                            <option value="gr">Gram (100g üzerinden)</option>
                            <option value="ad">Adet/Porsiyon</option>
                        </select>
                    </div>
                    <button onclick="Actions.createCustomFood()" class="${THEME.btn} w-full border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black">VERİTABANINA KAYDET</button>
                </div>
            </div>
        `);
        setTimeout(() => {
            const select = document.getElementById('m-food');
            if (select && select.options.length > 0) {
                select.selectedIndex = 0;
                UI.renderPortionInputs();
            }
        }, 100);
    },

    async submitMeal() {
        const idx = document.getElementById('m-food').value;
        const f = Store.getAllFoods()[idx];
        let amt = 0;
        let ratio = 0;
        let unitLabel = "";

        if (f.type === 'portion') {
            const radios = document.getElementsByName('portion_opt');
            let selectedOptIdx = 0;
            for (const r of radios) { if (r.checked) { selectedOptIdx = parseInt(r.value); break; } }
            const opt = f.options[selectedOptIdx];
            ratio = opt.ratio;
            amt = 1;
            unitLabel = opt.label;
        } else if (f.type === 'piece') {
            amt = parseFloat(document.getElementById('m-amount').value);
            if (!amt) return;
            ratio = amt;
            unitLabel = f.unitName || 'Adet';
        } else {
            amt = parseFloat(document.getElementById('m-amount').value);
            if (!amt) return;
            if (f.unit === 'ad') {
                ratio = amt;
                unitLabel = 'Adet';
            } else {
                ratio = amt / 100;
                unitLabel = 'Gr';
            }
        }

        await Store.addMeal({
            name: f.name,
            amount: amt,
            unit: f.type || 'custom',
            portionLabel: unitLabel,
            cal: Math.round(f.vals.cal * ratio),
            prot: Math.round(f.vals.prot * ratio),
            carb: Math.round(f.vals.carb * ratio),
            fat: Math.round(f.vals.fat * ratio)
        });

        UI.modal.close();
        UI.showToast("Öğün eklendi.");
        this.switchTab('nutrition');
    },

    async createCustomFood() {
        const n = document.getElementById('new-name').value;
        const c = parseFloat(document.getElementById('new-cal').value);
        const p = parseFloat(document.getElementById('new-prot').value);
        const carb = parseFloat(document.getElementById('new-carb').value);
        const f = parseFloat(document.getElementById('new-fat').value);
        const u = document.getElementById('new-unit').value;

        if (!n || !c) { UI.showToast("Eksik bilgi!", "error"); return; }

        await Store.addCustomFood({
            name: n,
            type: 'custom',
            unit: u,
            vals: { cal: c, prot: p || 0, carb: carb || 0, fat: f || 0 }
        });

        UI.modal.close();
        UI.showToast("Veritabanı güncellendi.");
        setTimeout(() => this.openMealModal(), 500);
    },

    async saveStats() {
        const newStats = {
            chest: document.getElementById('stat-chest').value,
            arm: document.getElementById('stat-arm').value,
            waist: document.getElementById('stat-waist').value,
            leg: document.getElementById('stat-leg').value
        };
        await Store.saveStats(newStats);
        UI.showToast("Ölçüler kaydedildi ✓");
        this.switchTab('progress');
    },

    async showExercise(id) {
        const ex = DB.EXERCISES[id];
        const history = await Store.getExerciseHistory(id);
        const pr = await Store.getPersonalBest(id);

        const targetMatch = ex.desc.match(/(\d+)\s*Set\s*x\s*(\d+)/i);
        const targetSets = targetMatch ? targetMatch[1] : '3-4';
        const targetReps = targetMatch ? targetMatch[2] : '12';

        const last5 = history.slice(-5);
        const maxVol = Math.max(...last5.map(h => h.volume || 0), 1);
        const miniChart = last5.length > 0
            ? last5.map(h => {
                const height = Math.max(8, ((h.volume || 0) / maxVol) * 60);
                return `<div class="flex-1 flex flex-col items-center gap-1"><div class="w-full bg-neon-blue/60 rounded-t transition-all" style="height:${height}px"></div><div class="text-[8px] text-gray-600">${h.date ? h.date.split('-')[2] : ''}</div></div>`;
            }).join('')
            : '<div class="text-gray-600 text-xs text-center w-full">Henüz veri yok</div>';

        const stepsHtml = ex.steps.map((s, i) => `
            <div class="flex items-start gap-3 p-2 bg-gray-800/50 rounded-lg">
                <div class="w-6 h-6 rounded-full bg-neon-green/20 border border-neon-green/50 flex items-center justify-center text-neon-green font-bold text-xs flex-shrink-0">${i + 1}</div>
                <span class="text-gray-200 text-sm">${s}</span>
            </div>
        `).join('');

        const modalContent = `
            <div class="space-y-5">
                <div class="flex items-center gap-3 pb-4 border-b border-gray-800">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-blue/20 flex items-center justify-center text-2xl">
                        <i class="fas fa-dumbbell text-neon-green"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex flex-wrap gap-2">
                            ${ex.tags.map(t => `<span class="text-[10px] px-2 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700">${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="text-sm text-gray-300 leading-relaxed p-3 bg-gray-900/50 rounded-lg border-l-3 border-neon-blue">
                    ${ex.desc}
                </div>
                
                <div>
                    <div class="text-[10px] text-gray-500 font-bold tracking-widest mb-3">
                        <i class="fas fa-list-ol mr-2 text-neon-green"></i>OPERASYON ADIMLARI
                    </div>
                    <div class="space-y-2">${stepsHtml}</div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl border border-gray-700">
                        <div class="text-[10px] text-gray-500 font-bold mb-2">
                            <i class="fas fa-trophy text-neon-yellow mr-1"></i>KİŞİSEL REKOR (PR)
                        </div>
                        ${pr
                ? `<div class="text-2xl font-bold text-white">${pr.volume} <span class="text-sm text-gray-500">vol</span></div>
                               <div class="text-xs text-gray-500 mt-1">${pr.weight}kg × ${pr.reps} tekrar</div>
                               <div class="text-[10px] text-gray-600 mt-2">${pr.date || ''}</div>`
                : `<div class="text-gray-600 text-sm">Henüz kayıt yok</div>
                               <div class="text-[10px] text-gray-700 mt-1">İlk setini tamamla!</div>`
            }
                    </div>
                    
                    <div class="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl border border-gray-700">
                        <div class="text-[10px] text-gray-500 font-bold mb-2">
                            <i class="fas fa-chart-bar text-neon-blue mr-1"></i>SON 5 ANTRENMAN
                        </div>
                        <div class="flex items-end gap-1 h-16">${miniChart}</div>
                    </div>
                </div>
                
                ${ex.videoId ? `
                <div class="border border-gray-800 rounded-xl overflow-hidden hover:border-red-600/50 transition-all group cursor-pointer video-trigger"
                    onclick="event.stopPropagation(); Actions.playVideoInline(this, '${ex.videoId}')">
                    <div class="relative">
                        <div class="aspect-video w-full bg-gray-900 relative overflow-hidden">
                            <img src="https://img.youtube.com/vi/${ex.videoId}/maxresdefault.jpg" 
                                alt="Video thumbnail"
                                class="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                onerror="this.src='https://img.youtube.com/vi/${ex.videoId}/hqdefault.jpg'">
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <i class="fas fa-play text-white text-2xl ml-1"></i>
                                </div>
                            </div>
                        </div>
                        <div class="p-3 bg-gradient-to-r from-red-900/30 to-gray-900 flex items-center gap-3">
                            <i class="fab fa-youtube text-red-500 text-xl"></i>
                            <div>
                                <div class="text-white font-bold text-sm">Video Eğitimi</div>
                                <div class="text-[10px] text-gray-500">Tıkla → Yeni sekmede aç</div>
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <div class="text-center p-4 bg-neon-green/10 rounded-xl border border-neon-green/30">
                    <div class="text-[10px] text-gray-500 font-bold mb-1">🎯 HEDEF</div>
                    <div class="text-xl font-bold text-neon-green">${targetSets} Set × ${targetReps} Tekrar</div>
                </div>
            </div>
        `;

        UI.modal.open(ex.title, modalContent);
    },

    async showPhase(id) {
        const phaseIcons = ['🐆', '🎭', '🤖', '🔧', '⚡', '🎯', '🍀', '🔄'];
        const p = MENTAL_PHASES.find(x => x.id == id);
        const idx = MENTAL_PHASES.findIndex(x => x.id == id);
        const icon = phaseIcons[idx] || '🧠';

        const mentalData = await Utils.storage.get(CONFIG.KEYS.MENTAL_PROGRESS) || { completedPhases: [] };
        const isCompleted = mentalData.completedPhases?.includes(id);

        const modalContent = `
            <div class="space-y-5">
                <div class="flex items-center gap-4 pb-4 border-b border-gray-800">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40 
                        flex items-center justify-center text-4xl">
                        ${icon}
                    </div>
                    <div class="flex-1">
                        <div class="text-xs text-purple-400 font-mono mb-1">FAZ ${p.id} / 8</div>
                        <div class="text-lg font-bold text-white">${p.title.replace(/FAZ \d+: /, '')}</div>
                        <div class="text-xs text-gray-500 mt-1">${p.desc}</div>
                    </div>
                    ${isCompleted ? '<div class="text-neon-green text-2xl">✓</div>' : ''}
                </div>
                
                <div class="bg-gradient-to-br from-purple-900/20 to-gray-900 p-4 rounded-xl border border-purple-500/20">
                    <div class="text-[10px] text-purple-400 font-bold tracking-widest mb-2">
                        <i class="fas fa-lightbulb mr-1"></i>ÇEKİRDEK FİKİR
                    </div>
                    <p class="text-sm text-gray-300 leading-relaxed">${p.core}</p>
                </div>
                
                <div class="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                    <div class="text-[10px] text-gray-500 font-bold tracking-widest mb-2">
                        <i class="fas fa-bullseye mr-1"></i>NİYET / AMAÇ
                    </div>
                    <p class="text-sm text-gray-400 leading-relaxed">${p.intent}</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-900 p-4 rounded-xl border-l-4 border-purple-500">
                        <div class="text-[10px] text-purple-400 font-bold tracking-widest mb-3">
                            <i class="fas fa-chess mr-1"></i>STRATEJİ
                        </div>
                        <ul class="space-y-2">
                            ${p.strategy.map(s => `
                                <li class="flex gap-2 text-xs text-gray-300">
                                    <i class="fas fa-caret-right text-purple-400 mt-0.5"></i>
                                    <span>${s}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="bg-gray-900 p-4 rounded-xl border-l-4 border-neon-green">
                        <div class="text-[10px] text-neon-green font-bold tracking-widest mb-3">
                            <i class="fas fa-bolt mr-1"></i>PRATİK UYGULAMALAR
                        </div>
                        <ul class="space-y-2">
                            ${p.practice.map(s => `
                                <li class="flex gap-2 text-xs text-gray-300">
                                    <i class="fas fa-check text-neon-green mt-0.5"></i>
                                    <span>${s}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="flex gap-3 pt-4 border-t border-gray-800">
                    ${!isCompleted ? `
                        <button onclick="Actions.markPhaseComplete(${p.id})" 
                            class="flex-1 py-3 bg-neon-green/10 border-2 border-neon-green text-neon-green font-bold rounded-xl hover:bg-neon-green hover:text-black transition-all">
                            <i class="fas fa-check-double mr-2"></i>Bu Fazı Anladım
                        </button>
                    ` : `
                        <div class="flex-1 py-3 bg-neon-green/10 border border-neon-green/30 text-neon-green text-center font-bold rounded-xl">
                            <i class="fas fa-trophy mr-2"></i>Faz Tamamlandı!
                        </div>
                    `}
                    <button onclick="UI.modal.close()" 
                        class="px-6 py-3 bg-gray-800 border border-gray-700 text-gray-400 font-bold rounded-xl hover:bg-gray-700 hover:text-white transition-all">
                        Kapat
                    </button>
                </div>
            </div>
        `;

        UI.modal.open(p.title, modalContent);
    },

    // Mental progress actions
    async completeDailyPractice() {
        const mentalData = await Utils.storage.get(CONFIG.KEYS.MENTAL_PROGRESS) || { completedPhases: [], dailyPractice: {} };
        const today = Utils.dateStr();
        mentalData.dailyPractice = mentalData.dailyPractice || {};
        mentalData.dailyPractice[today] = true;
        await Utils.storage.set(CONFIG.KEYS.MENTAL_PROGRESS, mentalData);

        UI.showEpicOverlay('🧠', 'ZİHİN GÜÇLENDİ!', 'Günlük pratik tamamlandı. Bir adım daha ileridesin.', '#a855f7');
        setTimeout(() => this.switchTab('mental'), 2300);
    },

    async markPhaseComplete(phaseId) {
        const mentalData = await Utils.storage.get(CONFIG.KEYS.MENTAL_PROGRESS) || { completedPhases: [], dailyPractice: {} };
        mentalData.completedPhases = mentalData.completedPhases || [];

        if (!mentalData.completedPhases.includes(phaseId)) {
            mentalData.completedPhases.push(phaseId);
            await Utils.storage.set(CONFIG.KEYS.MENTAL_PROGRESS, mentalData);

            UI.modal.close();

            if (mentalData.completedPhases.length >= 8) {
                UI.showEpicOverlay('👑', 'MENTAL MASTER!', 'Tüm fazları tamamladın. Zihinsel savaşı kazandın!', '#fbbf24');
            } else {
                UI.showEpicOverlay('⭐', 'FAZ TAMAMLANDI!', `${mentalData.completedPhases.length}/8 faz tamamlandı.`, '#a855f7');
            }

            setTimeout(() => this.switchTab('mental'), 2300);
        }
    },

    setAnatomyView(v) { UI.activeView = v; Store.state.selectedMuscle = null; this.switchTab('anatomy'); },
    selectMuscle(id) { Store.state.selectedMuscle = id; this.switchTab('anatomy'); },

    // --- ALERT SYSTEM ---
    async checkSystemAlerts() {
        const shakeDone = Store.state.fuelDate === Utils.dateStr();
        const meals = await Store.getMeals(Utils.dateStr()) || [];
        let alertMsg = "";

        if (!shakeDone) {
            alertMsg += "<div class='mb-4'><span class='text-neon-yellow font-bold'>⚠️ KRİTİK UYARI:</span><br>Günlük Gainer Shake henüz sisteme girilmedi! Yakıt seviyesi kritik.</div>";
        }

        if (meals.length === 0) {
            alertMsg += "<div><span class='text-neon-red font-bold'>⚠️ BESLENME HATASI:</span><br>Bugün hiçbir öğün kaydı yapılmadı. Sistem aç çalışamaz!</div>";
        }

        if (alertMsg !== "") {
            UI.alert.show(alertMsg);
            const nutBtn = document.getElementById('badge-nutrition');
            if (nutBtn && meals.length === 0) nutBtn.classList.remove('hidden');
        }
    },

    openWarmup() {
        const warmupRoutine = `
            <div class="space-y-4 text-sm text-gray-300">
                <div class="bg-gray-900 p-4 rounded-xl border border-neon-blue">
                    <h4 class="text-neon-blue font-bold mb-2 flex items-center gap-2">
                        <i class="fas fa-fire animate-pulse"></i>
                        SİSTEM BAŞLATILIYOR (ISINMA)
                    </h4>
                    <p class="text-sm text-gray-400 mb-4">Motor soğukken gazlama. Sakatlanmamak için bu 3 dakikalık rutini her antrenmandan önce yap.</p>
                    
                    <ul class="space-y-3">
                        <li class="flex gap-3 items-center p-2 bg-gray-800/50 rounded-lg">
                            <i class="fas fa-check-circle text-neon-blue"></i>
                            <div><span class="font-bold text-white">Boyun Çevirme</span><div class="text-xs text-gray-500">Sağa, sola, öne, arkaya yavaşça (30sn)</div></div>
                        </li>
                        <li class="flex gap-3 items-center p-2 bg-gray-800/50 rounded-lg">
                            <i class="fas fa-check-circle text-neon-blue"></i>
                            <div><span class="font-bold text-white">Kol Çevirme</span><div class="text-xs text-gray-500">Kollarını pervane gibi öne ve arkaya çevir (30sn)</div></div>
                        </li>
                        <li class="flex gap-3 items-center p-2 bg-gray-800/50 rounded-lg">
                            <i class="fas fa-check-circle text-neon-blue"></i>
                            <div><span class="font-bold text-white">Bel Dairesi</span><div class="text-xs text-gray-500">Eller belde, geniş daireler çiz (30sn)</div></div>
                        </li>
                        <li class="flex gap-3 items-center p-2 bg-gray-800/50 rounded-lg">
                            <i class="fas fa-check-circle text-neon-blue"></i>
                            <div><span class="font-bold text-white">Hafif Koşu</span><div class="text-xs text-gray-500">Olduğun yerde sekerek nabzını yükselt (1dk)</div></div>
                        </li>
                    </ul>
                </div>
                <div class="text-center">
                    <button onclick="Actions.startWorkout()" class="${THEME.btn} w-full bg-neon-green/20 border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-black font-bold text-lg py-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,255,65,0.3)]">
                        <i class="fas fa-rocket mr-2"></i>HAZIRIM, BAŞLAT!
                    </button>
                </div>
            </div>
        `;
        UI.modal.open("SYSTEM BOOT (ISINMA)", warmupRoutine);
    },

    startWorkout() {
        const messages = [
            { emoji: "🔥", text: "YANMAYA HAZIR OL!", sub: "Acı geçici, gurur kalıcı." },
            { emoji: "💪", text: "GÜÇ SENDİR!", sub: "Limitler zihninde, kır onları." },
            { emoji: "⚡", text: "SİSTEM AKTİF!", sub: "Her rep seni daha güçlü yapıyor." },
            { emoji: "🎯", text: "HEDEF KİLİTLİ!", sub: "Bugün dünden daha iyi ol." },
            { emoji: "🚀", text: "KALKIŞ BAŞARILI!", sub: "Başlamak bitirmenin yarısı." },
            { emoji: "👊", text: "SAVAŞ ZAMANI!", sub: "Bahaneler zayıflar içindir." },
            { emoji: "🦁", text: "ASLAN GİBİ!", sub: "Korku ile cesaret aynı yerde yaşar." }
        ];
        const msg = messages[Math.floor(Math.random() * messages.length)];

        UI.modal.close();
        UI.showEpicOverlay(msg.emoji, msg.text, msg.sub, '#00ff41');
    },

    // --- SETTINGS & DATA ---
    openSettings() {
        UI.modal.open("VERİ YÖNETİMİ", `
            <div class="space-y-6">
                <div class="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green">
                            <i class="fas fa-download"></i>
                        </div>
                        <div>
                            <h4 class="text-white font-bold text-sm">YEDEKLE (EXPORT)</h4>
                            <p class="text-[10px] text-gray-500">Tüm verilerini cihazına indir (.json)</p>
                        </div>
                    </div>
                    <button onclick="Actions.exportData()" class="${THEME.btn} w-full text-xs">YEDEĞİ İNDİR</button>
                </div>

                <div class="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-full bg-neon-red/20 flex items-center justify-center text-neon-red">
                            <i class="fas fa-upload"></i>
                        </div>
                        <div>
                            <h4 class="text-white font-bold text-sm">GERİ YÜKLE (IMPORT)</h4>
                            <p class="text-[10px] text-gray-500">Dikkat: Mevcut veriler silinir!</p>
                        </div>
                    </div>
                    <input type="file" id="import-file" accept=".json" class="hidden" onchange="Actions.startImport(this)">
                    <button onclick="document.getElementById('import-file').click()" class="w-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 font-bold py-3 px-6 rounded-lg transition text-xs border border-dashed border-gray-600">DOSYA SEÇ VE YÜKLE</button>
                </div>
            </div>
        `);
    },

    async exportData() {
        if (confirm("Tüm veri yedeği indirilsin mi?")) {
            await Store.exportData();
            UI.showToast("Yedekleme başarılı ✓");
            UI.modal.close();
        }
    },

    async startImport(input) {
        if (input.files && input.files[0]) {
            if (confirm("DİKKAT: Bu işlem mevcut tüm verileri silecek ve yedeği yükleyecektir. Emin misin?")) {
                const reader = new FileReader();
                reader.onload = async function (e) {
                    const result = await Store.importData(e.target.result);
                    if (result.success) {
                        alert(`Yedek başarıyla yüklendi! (Tarih: ${result.date})\nSayfa yenileniyor...`);
                        location.reload();
                    } else {
                        alert("Hata: " + result.error);
                    }
                };
                reader.readAsText(input.files[0]);
            } else {
                input.value = '';
            }
        }
    },

    // --- ACTIVE TRAINING ACTIONS ---
    toggleExerciseBody(id) {
        const el = document.getElementById(`body-${id}`);
        const icon = document.getElementById(`icon-${id}`);
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
            el.classList.add('animate-slide-down');
            icon.style.transform = 'rotate(180deg)';
        } else {
            el.classList.add('hidden');
            el.classList.remove('animate-slide-down');
            icon.style.transform = 'rotate(0deg)';
        }
    },

    async saveSet(taskId, setIdx, isDoneBtn) {
        const wInput = document.getElementById(`w-${taskId}-${setIdx}`);
        const rInput = document.getElementById(`r-${taskId}-${setIdx}`);
        const weight = wInput ? wInput.value : 0;
        const reps = rInput ? rInput.value : 0;

        if (isDoneBtn && (!weight || !reps)) {
            UI.showToast("Kilo ve Tekrar girin!", "error");
            return;
        }

        const oldPR = await Store.getPersonalBest(taskId);
        const oldPRVolume = oldPR ? oldPR.volume : 0;

        const result = await Store.logSet(taskId, setIdx, weight, reps, isDoneBtn);

        if (isDoneBtn) {
            const evt = window.event;
            const btn = evt ? (evt.currentTarget || evt.target.closest('button')) : null;
            if (btn) {
                btn.classList.remove('bg-gray-700', 'text-gray-400', 'hover:bg-gray-600');
                btn.classList.add('bg-neon-green', 'text-black');
                btn.innerHTML = '<i class="fas fa-check"></i>';
            }
            if (wInput) {
                wInput.classList.replace('border-gray-600', 'border-neon-green');
                wInput.classList.add('text-neon-green');
            }
            if (rInput) {
                rInput.classList.replace('border-gray-600', 'border-neon-green');
                rInput.classList.add('text-neon-green');
            }

            const newVolume = result.volume;
            if (newVolume > oldPRVolume && oldPRVolume > 0) {
                UI.showToast(`🎉 YENİ REKOR! ${newVolume} volume (${result.weight}kg × ${result.reps})`, "success");
            } else {
                UI.showToast(`Set ${setIdx + 1} ✓ | ${newVolume} volume`, "success");
            }
        }
    },

    async saveTimedSet(taskId, setIdx) {
        const dInput = document.getElementById(`d-${taskId}-${setIdx}`);
        const duration = dInput ? parseFloat(dInput.value) || 0 : 0;

        const date = Utils.dateStr();
        const key = 'monk_workout_data_' + date;
        const data = await Utils.storage.get(key) || {};
        if (!data[taskId]) data[taskId] = [];

        data[taskId][setIdx] = {
            duration: duration,
            timestamp: new Date().toISOString(),
            completed: true
        };
        await Utils.storage.set(key, data);

        await Store.setTaskDone(taskId, true);

        if (dInput) {
            dInput.classList.replace('border-gray-600', 'border-neon-green');
            dInput.classList.add('text-neon-green');
        }
        const btn = event.currentTarget || event.target.closest('button');
        if (btn) {
            btn.classList.remove('bg-gray-700', 'text-gray-400');
            btn.classList.add('bg-neon-green', 'text-black');
            btn.innerHTML = '<i class="fas fa-check"></i>';
        }

        UI.showToast(`Set ${setIdx + 1} ✓ | ${duration} saniye`, "success");
    },

    async toggleSimpleTask(taskId) {
        const date = Utils.dateStr();
        const done = await Store.getWorkout(date);
        const isDone = done.includes(taskId);

        await Store.setTaskDone(taskId, !isDone);

        if (!isDone) {
            UI.showToast(`${DB.EXERCISES[taskId]?.title || taskId} ✓ Tamamlandı!`, "success");
        }

        await Actions.switchTab('training');
    },

    openWeightModal() {
        const current = Store.state.weight;
        UI.modal.open("SENSÖR KALİBRASYONU", `
            <div class="space-y-4">
                <div class="text-center">
                    <div class="text-[10px] text-gray-500 mb-2 tracking-widest">MEVCUT SİSTEM YÜKÜ</div>
                    <input type="number" id="modal-weight-input" value="${current}" step="0.1" class="${THEME.input} text-center text-4xl font-black text-white h-20 border-2 border-neon-blue focus:border-neon-green bg-black/50">
                </div>
                <button onclick="Actions.saveWeightFromModal()" class="${THEME.btn} w-full bg-neon-green text-black hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)]">
                    <i class="fas fa-save mr-2"></i>VERİYİ İŞLE
                </button>
            </div>
        `);
        setTimeout(() => document.getElementById('modal-weight-input')?.focus(), 100);
    },

    async saveWeightFromModal() {
        const val = document.getElementById('modal-weight-input').value;
        await this.saveWeight(val);
        UI.modal.close();
    },

    completeDailyMission() {
        UI.modal.open("SİSTEM KONTROLÜ", `
            <div class="text-center space-y-4">
                <i class="fas fa-exclamation-triangle text-5xl text-neon-green animate-pulse"></i>
                <div>
                    <h3 class="text-white font-bold text-lg">GÜNLÜK RAPOR ONAYI</h3>
                    <p class="text-gray-400 text-xs mt-2">Tüm günlük görevler (Antrenman, Beslenme vb.) 'TAMAMLANDI' olarak işaretlenecek.</p>
                </div>
                <div class="grid grid-cols-2 gap-3 mt-4">
                    <button onclick="UI.modal.close()" class="py-3 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition text-xs font-bold">İPTAL</button>
                    <button onclick="Actions.confirmDailyMission()" class="py-3 rounded-lg bg-neon-green text-black font-bold hover:bg-white transition text-xs shadow-[0_0_15px_rgba(0,255,65,0.3)]">ONAYLA</button>
                </div>
            </div>
        `);
    },

    async confirmDailyMission() {
        UI.modal.close();

        const day = new Date().getDay();
        const plan = WEEKLY_PLAN[day];

        if (plan && plan.tasks) {
            for (const taskId of plan.tasks) {
                await Store.setTaskDone(taskId, true);
            }
        }

        UI.showEpicOverlay("🛡️", "SİSTEM GÜVENLİ", "Günlük protokol tamamlandı.", "#00ff41");
        this.switchTab('dashboard');
    },

    // --- DYNAMIC SET MANAGEMENT (v8.3.0) ---
    /**
     * Adds a new empty set to the specified exercise.
     * If no logs exist, initializes with default set count + 1.
     * @param {string} taskId - Exercise ID
     */
    async addSet(taskId) {
        const date = Utils.dateStr();
        const key = 'monk_workout_data_' + date;
        const data = await Utils.storage.get(key) || {};

        // Get default set count from exercise definition
        const ex = DB.EXERCISES[taskId];
        const defaultSets = ex ? (ex.sets || 3) : 3;

        // Initialize array if not exists
        if (!data[taskId] || data[taskId].length === 0) {
            data[taskId] = [];
            for (let i = 0; i < defaultSets; i++) {
                data[taskId].push({}); // Empty placeholder for default sets
            }
        }

        // Add new empty set at the end
        data[taskId].push({});

        await Utils.storage.set(key, data);
        UI.showToast(`Set ${data[taskId].length} eklendi ⚡`);
        await this.switchTab('training');
        // v8.3.0 UX: Re-open the exercise card and scroll to it
        setTimeout(() => {
            this.toggleExerciseBody(taskId);
            const card = document.getElementById('body-' + taskId);
            if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    },

    /**
     * Removes a set from the specified exercise at the given index.
     * Ensures at least 1 set remains.
     * @param {string} taskId - Exercise ID
     * @param {number} setIndex - Index of the set to remove (0-based)
     */
    async removeSet(taskId, setIndex) {
        const date = Utils.dateStr();
        const key = 'monk_workout_data_' + date;
        const data = await Utils.storage.get(key) || {};

        // If no data, initialize with defaults first
        if (!data[taskId] || data[taskId].length === 0) {
            const ex = DB.EXERCISES[taskId];
            const defaultSets = ex ? (ex.sets || 3) : 3;
            data[taskId] = [];
            for (let i = 0; i < defaultSets; i++) {
                data[taskId].push({});
            }
        }

        // Don't allow removing if only 1 set remains
        if (data[taskId].length <= 1) {
            UI.showToast("En az 1 set olmalı!", "error");
            return;
        }

        // Remove the set at the specified index
        data[taskId].splice(setIndex, 1);

        await Utils.storage.set(key, data);
        UI.showToast(`Set ${setIndex + 1} kaldırıldı`);
        await this.switchTab('training');
        // v8.3.0 UX: Re-open the exercise card and scroll to it
        setTimeout(() => {
            this.toggleExerciseBody(taskId);
            const card = document.getElementById('body-' + taskId);
            if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
};

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log('[Actions] Event handlers loaded');
}

