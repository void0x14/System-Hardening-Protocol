/**
 * Copyright (c) 2025-2026 void0x14
 */

// weekly-plan.js - Weekly Training Plan
// Extracted from original index.html

import { CONFIG } from '../config/index.js';
import { DB } from '../config/db.js';
import { i18n } from '../services/i18nService.js';

export function initWeeklyPlan() {
    DB.WEEKLY_PLAN = {
        1: { name: i18n.t('db.weekly_plan.1.name'), title: i18n.t('db.weekly_plan.1.title'), tasks: ["squat", "pushup", "one_arm_row", "plank"] },
        2: { name: i18n.t('db.weekly_plan.2.name'), title: i18n.t('db.weekly_plan.2.title'), tasks: ["eat_bulk", "stretch", "farmers_walk"] },
        3: { name: i18n.t('db.weekly_plan.3.name'), title: i18n.t('db.weekly_plan.3.title'), tasks: ["lying_leg_raise", "mountain_climber", "stomach_vacuum", "kegel", "bottle_curl"] },
        4: { name: i18n.t('db.weekly_plan.4.name'), title: i18n.t('db.weekly_plan.4.title'), tasks: ["squat_heavy", "single_leg_raise", "stretch"] },
        5: { name: i18n.t('db.weekly_plan.5.name'), title: i18n.t('db.weekly_plan.5.title'), tasks: ["goblet_squat", "one_arm_row", "pushup", "hammer_curl"] },
        6: { name: i18n.t('db.weekly_plan.6.name'), title: i18n.t('db.weekly_plan.6.title'), tasks: ["stomach_vacuum", "farmers_walk", "cool_down", "walk_outside"] },
        0: { name: i18n.t('db.weekly_plan.0.name'), title: i18n.t('db.weekly_plan.0.title'), tasks: ["weigh_in", "prep_food"] }
    };
}

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log('[DB] Weekly plan module loaded');
}
