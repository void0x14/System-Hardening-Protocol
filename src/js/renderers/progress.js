(function(window) {
    'use strict';

    if (typeof window.Renderers === 'undefined') {
        window.Renderers = {};
    }

    Renderers.progress = async function() {
        const hist = await Store.getHistory();
        const statsData = await Store.getStats();
        const volStats = await Store.getVolumeStats();
        const stats = statsData.current || {};
        const measureHistory = statsData.history || [];
        const dates = Object.keys(hist).sort().slice(-7);
        const volDates = Object.keys(volStats.daily).sort();
        const weeklySummary = await Store.getWeeklySummary();
        const sleepStats = await Store.getSleepStats();
        const waterStats = await Store.getWaterStats();
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

        let weightBars = '', dateLabels = '', weightHistoryTable = '';

        if (dates.length > 0) {
            weightBars = dates.map(d => {
                const h = ((hist[d] - CONFIG.TARGETS.START) / (CONFIG.TARGETS.GOAL - CONFIG.TARGETS.START)) * 70 + 15;
                return `<div class="flex-1 flex flex-col items-center"><div class="text-[9px] text-neon-green font-bold mb-1">${hist[d]}</div><div class="w-full bg-gray-800 hover:bg-neon-green/50 rounded-t transition-all" style="height:${h}%"></div></div>`;
            }).join('');

            dateLabels = dates.map((d, i) => {
                const parts = d.split('-');
                const day = parts[2];
                const monthIdx = parseInt(parts[1]) - 1;
                const showMonth = (i === 0 || i === dates.length - 1);
                return `<div class="flex-1 text-center text-[8px] text-gray-500">${day}${showMonth ? ' ' + months[monthIdx] : ''}</div>`;
            }).join('');
        } else {
            weightBars = '<div class="text-gray-600 text-xs w-full text-center self-center flex flex-col items-center justify-center h-full"><i class="fas fa-weight text-3xl mb-2 opacity-30"></i><span>Veri yok</span></div>';
        }

        let volumeChart = '';
        if (volStats.weekly > 0) {
            const maxVol = Math.max(...Object.values(volStats.daily), 1);
            volumeChart = volDates.map(d => {
                const val = volStats.daily[d] || 0;
                const h = (val / maxVol) * 80;
                const parts = d.split('-');
                const day = parts[2];
                return `<div class="flex-1 flex flex-col items-center group"><div class="text-[8px] text-neon-blue font-bold mb-1 opacity-0 group-hover:opacity-100 transition">${val > 0 ? Math.round(val) : ''}</div><div class="w-full bg-gray-800 hover:bg-neon-blue/60 rounded-t transition-all" style="height:${Math.max(5, h)}%"></div><div class="text-[8px] text-gray-500 mt-1">${day}</div></div>`;
            }).join('');
        } else {
            volumeChart = '<div class="text-gray-600 text-xs w-full text-center flex flex-col items-center justify-center h-full"><i class="fas fa-dumbbell text-3xl mb-2 opacity-30"></i><span>Henüz antrenman verisi yok</span></div>';
        }

        const labels = { chest: 'GÖĞÜS', arm: 'KOL', waist: 'BEL', leg: 'BACAK' };
        const measurementInputs = ['chest', 'arm', 'waist', 'leg'].map(k => `
            <div class="bg-surface-raised p-3 rounded-lg">
                <label class="text-[10px] text-gray-500 font-bold uppercase block mb-2">${labels[k]}</label>
                <input type="number" id="stat-${k}" value="${stats[k] || ''}" placeholder="cm" class="${THEME.input} text-center text-lg font-bold">
            </div>
        `).join('');

        const isSanitized = typeof Stealth !== 'undefined' && Stealth.active;
        const summaryGridClass = isSanitized ? 'flex flex-wrap justify-center gap-3' : 'grid grid-cols-3 md:grid-cols-6 gap-3';

        return `
            <div class="space-y-6 animate-slide-up">
            <!-- SUMMARY ROW -->
            <div class="${summaryGridClass}">
                <div class="${THEME.card} text-center py-3 ${isSanitized ? 'w-32 md:w-40' : ''}"><div class="text-[9px] text-gray-500 font-bold">MEVCUT</div><div class="text-xl font-bold text-white mt-1">${Store.state.weight} <span class="text-[10px] text-neon-green">kg</span></div></div>
                <div class="${THEME.card} text-center py-3 border-neon-green/30 ${isSanitized ? 'w-32 md:w-40' : ''}"><div class="text-[9px] text-neon-green font-bold">BUGÜN</div><div class="text-xl font-bold text-white mt-1">${Math.round(volStats.daily[Utils.dateStr()] || 0)} <span class="text-[10px] text-gray-500">kg</span></div></div>
                <div class="${THEME.card} text-center py-3 border-neon-blue/30 ${isSanitized ? 'w-32 md:w-40' : ''}"><div class="text-[9px] text-neon-blue font-bold">HAFTALIK</div><div class="text-xl font-bold text-white mt-1">${(volStats.weekly / 1000).toFixed(1)} <span class="text-[10px] text-gray-500">ton</span></div></div>
                <div class="${THEME.card} text-center py-3 border-accent-orange/30 ${isSanitized ? 'w-32 md:w-40' : ''}"><div class="text-[9px] text-accent-orange font-bold">AYLIK</div><div class="text-xl font-bold text-white mt-1">${(volStats.monthly / 1000).toFixed(1)} <span class="text-[10px] text-gray-500">ton</span></div></div>
                <div class="${THEME.card} text-center py-3 ${isSanitized ? 'w-32 md:w-40' : ''}"><div class="text-[9px] text-gray-500 font-bold">TOPLAM SET</div><div class="text-xl font-bold text-neon-blue mt-1">${volStats.totalSets}</div></div>
                <div class="${THEME.card} text-center py-3 sensitive-content"><div class="text-[9px] text-gray-500 font-bold">HEDEF</div><div class="text-xl font-bold text-neon-green mt-1">${CONFIG.TARGETS.GOAL} <span class="text-[10px]">kg</span></div></div>
            </div>

            <!-- SLEEP & WATER STATS -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="${THEME.card} text-center py-3 border-purple-500/30"><div class="text-[9px] text-purple-400 font-bold">😴 HAFTALIK UYKU</div><div class="text-xl font-bold text-white mt-1">${sleepStats.weekAvg} <span class="text-[10px] text-gray-500">saat/gün</span></div></div>
                <div class="${THEME.card} text-center py-3 border-purple-500/30"><div class="text-[9px] text-purple-400 font-bold">😴 AYLIK UYKU</div><div class="text-xl font-bold text-white mt-1">${sleepStats.monthAvg} <span class="text-[10px] text-gray-500">saat/gün</span></div></div>
                <div class="${THEME.card} text-center py-3 border-neon-blue/30"><div class="text-[9px] text-neon-blue font-bold">💧 HAFTALIK SU</div><div class="text-xl font-bold text-white mt-1">${waterStats.weekTotal} <span class="text-[10px] text-gray-500">bardak</span></div></div>
                <div class="${THEME.card} text-center py-3 border-neon-blue/30"><div class="text-[9px] text-neon-blue font-bold">💧 AYLIK SU</div><div class="text-xl font-bold text-white mt-1">${waterStats.monthTotal} <span class="text-[10px] text-gray-500">bardak</span></div></div>
            </div>

            <!-- VOLUME ANALYSIS -->
            <div class="${THEME.card}">
                <div class="flex justify-between items-center mb-4">
                    <div><span class="text-neon-blue font-bold text-sm">ANTRENMAN HACMİ</span><span class="text-[10px] text-gray-500 ml-2">Son 7 Gün</span></div>
                    <div class="text-xs text-gray-500">${volStats.weekly > 0 ? `Toplam: ${(volStats.weekly / 1000).toFixed(2)} ton` : ''}</div>
                </div>
                <div class="flex items-end gap-1 h-28">${volumeChart}</div>
            </div>

            <!-- WEEKLY SUMMARY -->
            <div class="${THEME.card}">
                <div class="${THEME.label}">📅 HAFTALIK ÖZET (Son 4 Hafta)</div>
                <div class="overflow-x-auto mt-4">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="text-gray-500 text-xs border-b border-gray-800">
                                <th class="text-left py-2">Hafta</th>
                                <th class="text-center py-2">Ort. Kalori</th>
                                <th class="text-center py-2">Antrenman</th>
                                <th class="text-right py-2">Kilo Δ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${weeklySummary.map((w, i) => `
                                <tr class="border-b border-gray-800/50 ${i === 0 ? 'bg-gray-800/30' : ''}">
                                    <td class="py-2 ${i === 0 ? 'text-neon-green font-bold' : 'text-gray-400'}">${i === 0 ? 'Bu Hafta' : i === 1 ? 'Geçen Hafta' : `${w.week}. Hafta Önce`}</td>
                                    <td class="text-center py-2 font-mono ${w.avgCal >= CONFIG.TARGETS.CAL ? 'text-neon-green' : w.avgCal > 0 ? 'text-accent-orange' : 'text-gray-600'}">${w.avgCal > 0 ? w.avgCal : '-'}</td>
                                    <td class="text-center py-2">${w.workoutDays > 0 ? `<span class="text-neon-blue font-bold">${w.workoutDays}</span> gün` : '<span class="text-gray-600">-</span>'}</td>
                                    <td class="text-right py-2 font-mono ${w.weightChange > 0 ? 'text-neon-green' : w.weightChange < 0 ? 'text-neon-red' : 'text-gray-500'}">${w.weightChange !== null ? (w.weightChange > 0 ? '+' : '') + w.weightChange + ' kg' : '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- WEIGHT HISTORY -->
                <div class="${THEME.card} flex flex-col">
                    <span class="text-[10px] text-gray-500 font-bold mb-2">AĞIRLIK GEÇMİŞİ (Son 7 Gün)</span>
                    <div class="flex items-end gap-1 h-32 border-b border-gray-800">${weightBars}</div>
                    <div class="flex gap-1 mt-1">${dateLabels}</div>
                </div>

                <!-- MEASUREMENTS -->
                <div class="${THEME.card}">
                    <div class="flex justify-between mb-4 items-center">
                        <span class="text-[10px] text-gray-500 font-bold block">ÖLÇÜLER (CM)</span>
                        <button onclick="Actions.saveStats()" class="bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-black text-xs font-bold px-4 py-2 rounded-lg transition-all">
                            <i class="fas fa-save mr-1"></i>KAYDET
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-3">${measurementInputs}</div>
                </div>
            </div>
        </div>`;
    }
})(window);
