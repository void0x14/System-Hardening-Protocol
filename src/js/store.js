// store.js - State Management and Data Operations
// Extracted from original index.html lines 1340-1963

// Global scope assignment
const Store = window.Store = {
    state: {
        weight: 45.0,
        fuelDate: null,
        customFoods: [],
        meals: {},
        dailyPlan: null,
        selectedMuscle: null,
        activeTab: 'dashboard'
    },

    // v7.0.0: Performance cache
    _cache: {},

    /**
     * v7.0.0: Cache'i temizle
     * @param {string} [key] - Belirli bir cache key, boşsa tümünü temizle
     */
    clearCache(key) {
        if (key) delete this._cache[key];
        else this._cache = {};
    },

    /**
     * Store'u başlat. localStorage'dan verileri yükler.
     * @async
     */
    async init() {
        const w = await Utils.storage.get(CONFIG.KEYS.WEIGHT);
        if (w) this.state.weight = parseFloat(w);
        this.state.fuelDate = await Utils.storage.get(CONFIG.KEYS.FUEL);
        this.state.customFoods = await Utils.storage.get(CONFIG.KEYS.CUSTOM_FOODS) || [];

        const today = Utils.dateStr();
        const savedPlan = await Utils.storage.get(CONFIG.KEYS.DAILY_PLAN);

        if (savedPlan && savedPlan.date === today) {
            this.state.dailyPlan = savedPlan.plan;
        } else {
            await this.generateDailyPlan();
        }
    },

    /**
     * Günlük öğün planı oluştur.
     * @async
     */
    async generateDailyPlan() {
        const plan = {
            breakfast: Utils.getRandomMeal('breakfast'),
            fuel: Utils.getRandomMeal('fuel'),
            lunch: Utils.getRandomMeal('lunch'),
            pre_workout: Utils.getRandomMeal('pre_workout'),
            dinner: Utils.getRandomMeal('dinner'),
            night: Utils.getRandomMeal('night')
        };
        this.state.dailyPlan = plan;
        await Utils.storage.set(CONFIG.KEYS.DAILY_PLAN, { date: Utils.dateStr(), plan: plan });
    },

    /**
     * Belirtilen tarihteki antrenman görevlerini al.
     * @async
     * @param {string} date - Tarih (YYYY-MM-DD)
     * @returns {Promise<string[]>} Tamamlanan görev ID'leri
     */
    async getWorkout(date) {
        return await Utils.storage.get(CONFIG.KEYS.WORKOUT + date) || [];
    },

    /**
     * Görev durumunu toggle et.
     * @async
     * @param {string} id - Görev ID'si
     */
    async toggleTask(id) {
        const date = Utils.dateStr();
        let tasks = await this.getWorkout(date);
        tasks = tasks.includes(id) ? tasks.filter(t => t !== id) : [...tasks, id];
        await Utils.storage.set(CONFIG.KEYS.WORKOUT + date, tasks);
        await this.updateStreak();
    },

    /**
     * Kiloyu kaydet ve geçmişe ekle.
     * @async
     * @param {number} w - Kaydedilecek kilo (kg)
     */
    async saveWeight(w) {
        this.state.weight = parseFloat(w);
        await Utils.storage.set(CONFIG.KEYS.WEIGHT, this.state.weight);
        let hist = await Utils.storage.get(CONFIG.KEYS.WEIGHT_HISTORY) || {};
        hist[Utils.dateStr()] = this.state.weight;
        await Utils.storage.set(CONFIG.KEYS.WEIGHT_HISTORY, hist);
        return true;
    },

    /**
     * Gainer Shake alındığını kaydet.
     * @async
     */
    async saveFuel() {
        this.state.fuelDate = Utils.dateStr();
        await Utils.storage.set(CONFIG.KEYS.FUEL, this.state.fuelDate);
    },

    /**
     * Öğün ekle.
     * @async
     * @param {Object} meal - Öğün objesi
     */
    async addMeal(meal) {
        const date = Utils.dateStr();
        const key = CONFIG.KEYS.MEAL + date;
        let meals = await Utils.storage.get(key) || [];
        meals.push(meal);
        await Utils.storage.set(key, meals);
    },

    /**
     * Belirtilen tarihteki öğünleri al.
     * @async
     */
    async getMeals(date) {
        return await Utils.storage.get(CONFIG.KEYS.MEAL + date) || [];
    },

    /**
     * Belirtilen indeksteki öğünü sil.
     * @async
     */
    async deleteMeal(index) {
        const date = Utils.dateStr();
        const key = CONFIG.KEYS.MEAL + date;
        let meals = await Utils.storage.get(key) || [];
        if (index >= 0 && index < meals.length) {
            meals.splice(index, 1);
            await Utils.storage.set(key, meals);
            return true;
        }
        return false;
    },

    /**
     * Özel yiyecek ekle.
     * @async
     */
    async addCustomFood(food) {
        this.state.customFoods.push(food);
        await Utils.storage.set(CONFIG.KEYS.CUSTOM_FOODS, this.state.customFoods);
    },

    /**
     * Tüm yiyecekleri al (DB + özel tanımlı).
     */
    getAllFoods() {
        const combined = [...DB.FOODS, ...this.state.customFoods];
        return combined.sort((a, b) => {
            if (a.cat === 'PROTOKOL') return -1;
            if (b.cat === 'PROTOKOL') return 1;
            return a.name.localeCompare(b.name);
        });
    },

    /**
     * Vücut ölçülerini al.
     * @async
     */
    async getStats() {
        const data = await Utils.storage.get(CONFIG.KEYS.MEASURE);
        if (!data) return { current: {}, history: [] };
        if (!data.current && !data.history) {
            return { current: data, history: [] };
        }
        return data;
    },

    /**
     * Vücut ölçülerini kaydet.
     * @async
     * @param {Object} s - Ölçü objesi {chest, arm, waist, leg}
     */
    async saveStats(s) {
        const existing = await this.getStats();
        const today = Utils.dateStr();
        const current = existing.current || {};
        const history = existing.history || [];

        if (Object.keys(current).length > 0 && current.chest) {
            const lastEntry = history[history.length - 1];
            const lastDate = lastEntry ? lastEntry.date : null;
            if (lastDate !== today && current.savedAt !== today) {
                history.push({
                    date: current.savedAt || today,
                    chest: current.chest,
                    arm: current.arm,
                    waist: current.waist,
                    leg: current.leg
                });
            }
        }

        existing.current = { ...s, savedAt: today };
        existing.history = history.slice(-30);
        await Utils.storage.set(CONFIG.KEYS.MEASURE, existing);
    },

    /**
     * Kilo geçmişini al.
     * @async
     */
    async getHistory() {
        return await Utils.storage.get(CONFIG.KEYS.WEIGHT_HISTORY) || {};
    },

    /**
     * Mevcut streak'i al.
     * @async
     */
    async getStreak() {
        const streakData = await Utils.storage.get(CONFIG.KEYS.STREAK) || { count: 0, lastDate: null };
        const today = Utils.dateStr();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yy = yesterday.getFullYear();
        const ym = String(yesterday.getMonth() + 1).padStart(2, '0');
        const yd = String(yesterday.getDate()).padStart(2, '0');
        const yesterdayStr = `${yy}-${ym}-${yd}`;

        if (streakData.lastDate === today) {
            return streakData.count;
        }
        if (streakData.lastDate === yesterdayStr) {
            return streakData.count;
        }
        return 0;
    },

    async updateStreak() {
        const today = Utils.dateStr();
        const workout = await this.getWorkout(today);
        const day = new Date().getDay();
        const plan = WEEKLY_PLAN[day];

        if (workout.length >= Math.ceil(plan.tasks.length / 2)) {
            let streakData = await Utils.storage.get(CONFIG.KEYS.STREAK) || { count: 0, lastDate: null };

            if (streakData.lastDate !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yy = yesterday.getFullYear();
                const ym = String(yesterday.getMonth() + 1).padStart(2, '0');
                const yd = String(yesterday.getDate()).padStart(2, '0');
                const yesterdayStr = `${yy}-${ym}-${yd}`;

                if (streakData.lastDate === yesterdayStr) {
                    streakData.count += 1;
                } else if (streakData.lastDate !== today) {
                    streakData.count = 1;
                }
                streakData.lastDate = today;
                await Utils.storage.set(CONFIG.KEYS.STREAK, streakData);
            }
        }
    },

    // --- BACKUP/RESTORE ---
    async exportData() {
        const data = {};
        for (const key in CONFIG.KEYS) {
            const storageKey = CONFIG.KEYS[key];
            if (storageKey.endsWith('_')) {
                for (let i = 0; i < localStorage.length; i++) {
                    const lsKey = localStorage.key(i);
                    if (lsKey && lsKey.startsWith(storageKey)) {
                        data[lsKey] = await Utils.storage.get(lsKey);
                    }
                }
            } else {
                data[storageKey] = await Utils.storage.get(storageKey);
            }
        }
        data.meta = { version: CONFIG.VERSION, date: new Date().toISOString(), user: 'SYSTEM_HARDENING_USER' };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system_hardening_backup_${Utils.dateStr()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        await Utils.storage.set(CONFIG.KEYS.BACKUP, Utils.dateStr());
        return true;
    },

    async importData(jsonContent) {
        try {
            const data = JSON.parse(jsonContent);
            if (!data.meta) throw new Error("Geçersiz yedek dosyası");
            const prefixes = Object.values(CONFIG.KEYS).map(k => k.replace(/_$/, ''));
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && prefixes.some(p => key.startsWith(p))) keysToRemove.push(key);
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
            for (const key in data) {
                if (key !== 'meta') await Utils.storage.set(key, data[key]);
            }
            return { success: true, date: data.meta.date };
        } catch (e) {
            console.error("Import Error:", e);
            return { success: false, error: e.message };
        }
    },

    async checkBackupStatus() {
        const lastBackup = await Utils.storage.get(CONFIG.KEYS.BACKUP);
        if (!lastBackup) return 'NEVER';
        const today = new Date();
        const last = new Date(lastBackup);
        if (isNaN(last.getTime())) return 'WARNING';
        const diffDays = Math.ceil(Math.abs(today - last) / (1000 * 60 * 60 * 24));
        if (diffDays > 7) return 'WARNING';
        return 'OK';
    },

    // --- ACTIVE TRAINING ENGINE ---
    async getWorkoutData(date) {
        return await Utils.storage.get('monk_workout_data_' + date) || {};
    },

    async logSet(taskId, setIndex, weight, reps, isDone) {
        const date = Utils.dateStr();
        const key = 'monk_workout_data_' + date;
        const data = await Utils.storage.get(key) || {};
        if (!data[taskId]) data[taskId] = [];
        const w = parseFloat(weight) || 0;
        const r = parseFloat(reps) || 0;
        data[taskId][setIndex] = {
            weight: w,
            reps: r,
            timestamp: new Date().toISOString(),
            completed: isDone
        };
        await Utils.storage.set(key, data);

        if (isDone && w > 0 && r > 0) {
            await this.saveToExerciseHistory(taskId, w, r);
        }

        const hasCompletedSet = data[taskId].some(s => s && s.completed);
        if (hasCompletedSet) await this.setTaskDone(taskId, true);
        return { weight: w, reps: r, volume: w * r };
    },

    // --- Egzersiz Geçmişi Takibi ---
    async saveToExerciseHistory(exerciseId, weight, reps) {
        const history = await Utils.storage.get(CONFIG.KEYS.EXERCISE_HISTORY) || {};
        if (!history[exerciseId]) history[exerciseId] = [];
        history[exerciseId].push({
            date: Utils.dateStr(),
            weight: weight,
            reps: reps,
            volume: weight * reps,
            timestamp: new Date().toISOString()
        });
        if (history[exerciseId].length > 100) {
            history[exerciseId] = history[exerciseId].slice(-100);
        }
        await Utils.storage.set(CONFIG.KEYS.EXERCISE_HISTORY, history);
    },

    async getExerciseHistory(exerciseId) {
        const history = await Utils.storage.get(CONFIG.KEYS.EXERCISE_HISTORY) || {};
        return history[exerciseId] || [];
    },

    async getPersonalBest(exerciseId) {
        const history = await this.getExerciseHistory(exerciseId);
        if (history.length === 0) return null;
        let maxVolume = 0;
        let prRecord = null;
        history.forEach(record => {
            const vol = record.volume || (record.weight * record.reps);
            if (vol > maxVolume) {
                maxVolume = vol;
                prRecord = { ...record, volume: vol };
            }
        });
        return prRecord;
    },

    async setTaskDone(id, status) {
        const date = Utils.dateStr();
        let tasks = await this.getWorkout(date);
        if (status) {
            if (!tasks.includes(id)) tasks.push(id);
        } else {
            tasks = tasks.filter(t => t !== id);
        }
        await Utils.storage.set(CONFIG.KEYS.WORKOUT + date, tasks);
        await this.updateStreak();

        const day = new Date().getDay();
        const plan = WEEKLY_PLAN[day];
        if (tasks.length >= plan.tasks.length) {
            const messages = [
                { emoji: "🏆", text: "GÜN TAMAMLANDI!", sub: "Bugünü fethetttin. Yarın daha güçlü dön." },
                { emoji: "👑", text: "KRAL GİBİ!", sub: "Disiplin = Özgürlük. Bunu kanıtladın." },
                { emoji: "🔥", text: "YANDIN AMA AYAKTASIN!", sub: "Acı büyüme demek. Tebrikler." },
                { emoji: "⭐", text: "YİLDİZ PERFORMANS!", sub: "Bugün kendini aştın." },
                { emoji: "💪", text: "CANAVAR MOD!", sub: "Hiçbir şey seni durduramaz." }
            ];
            const msg = messages[Math.floor(Math.random() * messages.length)];
            setTimeout(() => UI.showEpicOverlay(msg.emoji, msg.text, msg.sub, '#00ff41'), 500);
        }
    },

    async getVolumeStats() {
        const today = new Date();
        const stats = { weekly: 0, monthly: 0, daily: {}, totalSets: 0, weeklyDays: 0 };

        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dy = d.getFullYear();
            const dm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const dateStr = `${dy}-${dm}-${dd}`;
            const data = await this.getWorkoutData(dateStr);
            let vol = 0;
            let sets = 0;
            Object.values(data).forEach(setArray => {
                setArray.forEach(s => {
                    if (s && s.completed) {
                        vol += ((s.weight || 0) * (s.reps || 0));
                        sets++;
                    }
                });
            });

            stats.monthly += vol;
            stats.totalSets += sets;

            if (i < 7) {
                stats.daily[dateStr] = vol;
                stats.weekly += vol;
                if (vol > 0) stats.weeklyDays++;
            }
        }
        return stats;
    },

    async getTodayProgress() {
        const today = Utils.dateStr();
        const day = new Date().getDay();
        const plan = WEEKLY_PLAN[day];
        const workout = await this.getWorkout(today);
        const meals = await this.getMeals(today);

        const totalCal = meals.reduce((sum, m) => sum + m.cal, 0);
        const tasksDone = workout.length;
        const tasksTotal = plan.tasks.length;

        return {
            tasksDone,
            tasksTotal,
            tasksPercent: Math.round((tasksDone / tasksTotal) * 100),
            calories: totalCal,
            caloriesTarget: CONFIG.TARGETS.CAL,
            caloriesPercent: Math.round((totalCal / CONFIG.TARGETS.CAL) * 100)
        };
    },

    // --- SLEEP TRACKING ---
    async getSleep(date) {
        return await Utils.storage.get(CONFIG.KEYS.SLEEP + date) || 0;
    },
    async setSleep(hours) {
        const date = Utils.dateStr();
        await Utils.storage.set(CONFIG.KEYS.SLEEP + date, parseFloat(hours));
        this.clearCache('sleepStats');
        return true;
    },

    // --- WATER TRACKING ---
    async getWater(date) {
        return await Utils.storage.get(CONFIG.KEYS.WATER + date) || 0;
    },
    async addWater(cups = 1) {
        const date = Utils.dateStr();
        const current = await this.getWater(date);
        await Utils.storage.set(CONFIG.KEYS.WATER + date, current + cups);
        this.clearCache('waterStats');
        return current + cups;
    },

    // --- SLEEP & WATER STATISTICS ---
    async getSleepStats() {
        const today = Utils.dateStr();
        const todayVal = await this.getSleep(today);
        const history = [];
        let weekTotal = 0, weekDays = 0;
        let monthTotal = 0, monthDays = 0;

        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const val = await this.getSleep(dateStr);
            if (val > 0) {
                if (i < 7) { weekTotal += val; weekDays++; }
                monthTotal += val;
                monthDays++;
            }
            if (i < 7) history.push({ date: dateStr, value: val });
        }

        return {
            today: todayVal,
            weekAvg: weekDays > 0 ? (weekTotal / weekDays).toFixed(1) : 0,
            monthAvg: monthDays > 0 ? (monthTotal / monthDays).toFixed(1) : 0,
            weekDays,
            monthDays,
            history: history.reverse()
        };
    },

    async getWaterStats() {
        const today = Utils.dateStr();
        const todayVal = await this.getWater(today);
        const history = [];
        let weekTotal = 0;
        let monthTotal = 0;

        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const val = await this.getWater(dateStr);
            if (i < 7) { weekTotal += val; history.push({ date: dateStr, value: val }); }
            monthTotal += val;
        }

        return {
            today: todayVal,
            weekTotal,
            monthTotal,
            weekAvg: (weekTotal / 7).toFixed(1),
            monthAvg: (monthTotal / 30).toFixed(1),
            history: history.reverse()
        };
    },

    // --- MILESTONE CHECK ---
    getNextMilestone() {
        const w = this.state.weight;
        for (const m of CONFIG.MILESTONES) {
            if (w < m.weight) return m;
        }
        return CONFIG.MILESTONES[CONFIG.MILESTONES.length - 1];
    },
    getCompletedMilestones() {
        return CONFIG.MILESTONES.filter(m => this.state.weight >= m.weight);
    },

    // --- WEEKLY SUMMARY ---
    async getWeeklySummary() {
        const weeks = [];
        const today = new Date();

        for (let w = 0; w < 4; w++) {
            let totalCal = 0, calDays = 0, workoutDays = 0;
            let startWeight = null, endWeight = null;

            for (let d = 0; d < 7; d++) {
                const date = new Date(today);
                date.setDate(date.getDate() - (w * 7 + d));
                const dy = date.getFullYear();
                const dm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                const dateStr = `${dy}-${dm}-${dd}`;

                const meals = await this.getMeals(dateStr);
                if (meals.length > 0) {
                    totalCal += meals.reduce((sum, m) => sum + m.cal, 0);
                    calDays++;
                }

                const workout = await this.getWorkout(dateStr);
                if (workout.length > 0) workoutDays++;

                const hist = await this.getHistory();
                if (hist[dateStr]) {
                    if (!endWeight) endWeight = hist[dateStr];
                    startWeight = hist[dateStr];
                }
            }

            weeks.push({
                week: w + 1,
                avgCal: calDays > 0 ? Math.round(totalCal / calDays) : 0,
                workoutDays,
                weightChange: (startWeight && endWeight) ? (endWeight - startWeight).toFixed(1) : null
            });
        }
        return weeks;
    }
};

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log('[Store] State management loaded');
}

