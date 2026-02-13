// config.js - Configuration and Theme Constants
// Extracted from original index.html lines 631-664

// Global scope assignments
const CONFIG = {
    VERSION: '8.3.1',
    DEBUG_MODE: false, // Set to true for development debug logs
    KEYS: {
        WEIGHT: 'monk_weight',
        FUEL: 'monk_fuel_date',
        WORKOUT: 'monk_workout_log_',
        WORKOUT_DATA: 'monk_workout_data_',
        MEAL: 'monk_meal_log_',
        MEASURE: 'monk_body_stats',
        WEIGHT_HISTORY: 'monk_weight_history',
        CUSTOM_FOODS: 'monk_custom_foods',
        DAILY_PLAN: 'monk_daily_plan',
        STREAK: 'monk_streak_data',
        BACKUP: 'monk_last_backup_date',
        SLEEP: 'monk_sleep_log_',
        WATER: 'monk_water_',
        EXERCISE_HISTORY: 'monk_exercise_history',
        MENTAL_PROGRESS: 'monk_mental_progress'
    },
    TARGETS: {
        START: 45.0,
        GOAL: 60.0,
        CAL: 3000,
        PROT: 225,
        CARB: 375,
        FAT: 67,
        WATER: 8,
        SLEEP: 7.5
    },
    MILESTONES: [
        { weight: 48, title: "Başlangıç +3kg", icon: "🌱" },
        { weight: 50, title: "Yarım Yüzlük", icon: "⚡" },
        { weight: 55, title: "Yarı Yol", icon: "🔥" },
        { weight: 60, title: "HEDEF", icon: "🏆" }
    ]
};

const THEME = {
    card: "bg-surface-card rounded-xl p-6 md:p-8 shadow-2xl transition-all card-hover-lift",
    btn: "bg-surface-raised hover:bg-neon-green hover:text-gunmetal text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2",
    input: "bg-surface-raised border-0 text-white rounded-lg p-3 focus:ring-2 focus:ring-neon-green/30 outline-none w-full transition-all",
    label: "text-xs uppercase tracking-[0.2em] text-text-muted font-bold mb-3 block"
};

if (CONFIG.DEBUG_MODE) {
    console.log(`[Config] System Hardening Protocol v${CONFIG.VERSION}`);
}
