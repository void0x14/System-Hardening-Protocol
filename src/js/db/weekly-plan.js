// weekly-plan.js - Weekly Training Plan
// Extracted from original index.html

// Global scope assignment
import { CONFIG } from '../config/index.js';
import { DB } from '../config/db.js';
import { i18n } from '../services/i18nService.js';

const WEEKLY_PLAN = {
    1: { name: "PAZARTESİ", title: "FULL BODY START", tasks: ["squat", "pushup", "one_arm_row", "plank"] },
    2: { name: "SALI", title: "BESLENME & RECOVERY", tasks: ["eat_bulk", "stretch", "farmers_walk"] },
    3: { name: "ÇARŞAMBA", title: "CORE & KERNEL", tasks: ["lying_leg_raise", "mountain_climber", "stomach_vacuum", "kegel", "bottle_curl"] },
    4: { name: "PERŞEMBE", title: "LEG DAY", tasks: ["squat_heavy", "single_leg_raise", "stretch"] },
    5: { name: "CUMA", title: "STRESS TEST", tasks: ["goblet_squat", "one_arm_row", "pushup", "hammer_curl"] },
    6: { name: "CUMARTESİ", title: "ACTIVE REST", tasks: ["stomach_vacuum", "farmers_walk", "cool_down", "walk_outside"] },
    0: { name: "PAZAR", title: "SYSTEM REBOOT", tasks: ["weigh_in", "prep_food"] }
};

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log('[DB] Weekly plan loaded');
}

