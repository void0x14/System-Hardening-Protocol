(function(window) {
    'use strict';

    if (typeof window.Renderers === 'undefined') {
        window.Renderers = {};
    }

    Renderers.anatomy = async function() {
        const view = UI.activeView;
        const isSanitized = typeof Stealth !== 'undefined' && Stealth.active;

        // Pelvik üçgeni sanitize modda gizle
        const pelvicPath = isSanitized ? '' : `<path d="M85,158 L115,158 L100,183 Z" fill="#ff003c" opacity="0.5" onclick="Actions.selectMuscle('pelvic')" class="cursor-pointer hover:opacity-100"></path>`;

        const paths = {
            front: `<path d="M60,50 Q100,70 140,50 L135,90 Q100,100 65,90 Z" class="muscle-path" onclick="Actions.selectMuscle('chest')"></path><rect x="80" y="95" width="40" height="55" rx="5" class="muscle-path" onclick="Actions.selectMuscle('abs')"></rect><path d="M65,160 L90,160 L85,240 L60,240 Z" class="muscle-path" onclick="Actions.selectMuscle('quads')"></path><path d="M110,160 L135,160 L140,240 L115,240 Z" class="muscle-path" onclick="Actions.selectMuscle('quads')"></path><ellipse cx="45" cy="70" rx="10" ry="20" class="muscle-path" onclick="Actions.selectMuscle('biceps')"></ellipse><ellipse cx="155" cy="70" rx="10" ry="20" class="muscle-path" onclick="Actions.selectMuscle('biceps')"></ellipse>${pelvicPath}`,
            back: `<path d="M70,40 L100,20 L130,40 L100,60 Z" class="muscle-path" onclick="Actions.selectMuscle('traps')"></path><path d="M60,60 L40,100 L100,125 L160,100 L140,60 L100,60 Z" class="muscle-path" onclick="Actions.selectMuscle('lats')"></path><rect x="85" y="128" width="30" height="22" class="muscle-path" onclick="Actions.selectMuscle('lowerback')"></rect><path d="M70,150 Q100,170 130,150 L130,190 Q100,210 70,190 Z" class="muscle-path" onclick="Actions.selectMuscle('glutes')"></path><rect x="75" y="200" width="20" height="60" class="muscle-path" onclick="Actions.selectMuscle('hamstrings')"></rect><rect x="105" y="200" width="20" height="60" class="muscle-path" onclick="Actions.selectMuscle('hamstrings')"></rect>`
        };

        // Sanitize modda pelvik seçiliyse temizle
        let selectedMuscle = Store.state.selectedMuscle;
        if (isSanitized && selectedMuscle === 'pelvic') {
            selectedMuscle = null;
            Store.state.selectedMuscle = null;
        }

        const sel = selectedMuscle ? DB.ANATOMY_DB[selectedMuscle] : null;

        // Hassas metinleri filtrele
        let displayFunction = sel ? sel.function : '';
        let displaySystem = sel ? sel.system : '';
        if (isSanitized && sel) {
            // Hassas kelimeleri kaldır
            const sensitiveWords = ['cinsel', 'Cinsel', 'boşalma', 'Boşalma', 'üreme', 'Üreme', 'piston'];
            sensitiveWords.forEach(word => {
                displayFunction = displayFunction.replace(new RegExp(word + '[^,\\.]*[,\\.]?\\s*', 'gi'), '');
            });
            displayFunction = displayFunction.replace(/,\s*$/, '.').replace(/\s+/g, ' ').trim();
            if (displaySystem.toLowerCase().includes('üreme')) displaySystem = 'Core Destek';
        }

        return `<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up h-full"><div class="${THEME.card} flex flex-col items-center justify-center anatomy-grid min-h-[400px] relative"><div class="absolute top-4 left-4 flex gap-2"><button onclick="Actions.setAnatomyView('front')" class="px-4 py-2 text-xs font-bold border ${view === 'front' ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-gray-700 text-gray-500 hover:border-gray-500'} rounded-lg transition-all">ÖN</button><button onclick="Actions.setAnatomyView('back')" class="px-4 py-2 text-xs font-bold border ${view === 'back' ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-gray-700 text-gray-500 hover:border-gray-500'} rounded-lg transition-all">ARKA</button></div><div class="relative w-64 h-96"><svg viewBox="0 0 200 300" class="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,65,0.1)]"><path d="M100,20 L120,25 L130,40 L160,45 L150,100 L160,150 L140,280 L130,290 L100,250 L70,290 L60,280 L40,150 L50,100 L40,45 L70,40 L80,25 Z" fill="#111" stroke="#333" stroke-width="2"/>${paths[view]}</svg></div></div><div class="${THEME.card} relative overflow-hidden"><div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-green to-neon-blue"></div><div class="${THEME.label} text-neon-blue mb-6">DIAGNOSTIC PANEL</div>${sel ? `<div class="space-y-6"><div class="mb-6"><h2 class="text-3xl md:text-4xl font-header font-bold text-white mb-2">${sel.name}</h2><div class="text-sm text-gray-400 font-mono tracking-wide">// ${displaySystem}</div></div><div class="grid gap-4"><div class="bg-surface-raised p-4 rounded-lg border-l-4 border-neon-green"><div class="${THEME.label} mb-2">GÖREV</div><div class="text-base text-gray-200">${displayFunction || 'Güç ve stabilizasyon.'}</div></div><div class="bg-surface-raised p-4 rounded-lg border-l-4 border-accent-orange"><div class="${THEME.label} mb-2">HARDENING PROTOCOL</div><div class="text-lg text-accent-orange font-bold font-mono">${sel.action}</div></div><div class="bg-surface-raised p-4 rounded-lg border border-gray-700/50"><div class="flex justify-between items-center"><div><div class="${THEME.label} mb-1">RECOVERY TIME</div><div class="text-xl text-neon-blue font-bold">${sel.recovery}</div></div><i class="fas fa-clock text-neon-blue/30 text-3xl"></i></div></div></div></div>` : '<div class="h-full flex flex-col items-center justify-center text-gray-600"><i class="fas fa-fingerprint text-6xl mb-6 opacity-30"></i><p class="text-sm uppercase tracking-widest">Kas Seçimi Bekleniyor...</p></div>'}</div></div>`;
    }
})(window);
