/**
 * Copyright (c) 2025-2026 void0x14
 */

// anatomy.js - Anatomy Database
// Extracted from original index.html

// Use DB namespace directly (exercises.js already declared it)
import { CONFIG } from '../config/index.js';
import { DB } from '../config/db.js';
import { i18n } from '../services/i18nService.js';

export function initAnatomyDB() {
    DB.ANATOMY_DB = {
        "chest": { name: i18n.t('db.anatomy.chest.name'), function: i18n.t('db.anatomy.chest.function'), system: i18n.t('db.anatomy.chest.system'), action: i18n.t('db.anatomy.chest.action'), recovery: i18n.t('db.anatomy.chest.recovery') },
        "abs": { name: i18n.t('db.anatomy.abs.name'), function: i18n.t('db.anatomy.abs.function'), system: i18n.t('db.anatomy.abs.system'), action: i18n.t('db.anatomy.abs.action'), recovery: i18n.t('db.anatomy.abs.recovery') },
        "quads": { name: i18n.t('db.anatomy.quads.name'), function: i18n.t('db.anatomy.quads.function'), system: i18n.t('db.anatomy.quads.system'), action: i18n.t('db.anatomy.quads.action'), recovery: i18n.t('db.anatomy.quads.recovery') },
        "biceps": { name: i18n.t('db.anatomy.biceps.name'), function: i18n.t('db.anatomy.biceps.function'), system: i18n.t('db.anatomy.biceps.system'), action: i18n.t('db.anatomy.biceps.action'), recovery: i18n.t('db.anatomy.biceps.recovery') },
        "traps": { name: i18n.t('db.anatomy.traps.name'), function: i18n.t('db.anatomy.traps.function'), system: i18n.t('db.anatomy.traps.system'), action: i18n.t('db.anatomy.traps.action'), recovery: i18n.t('db.anatomy.traps.recovery') },
        "lats": { name: i18n.t('db.anatomy.lats.name'), function: i18n.t('db.anatomy.lats.function'), system: i18n.t('db.anatomy.lats.system'), action: i18n.t('db.anatomy.lats.action'), recovery: i18n.t('db.anatomy.lats.recovery') },
        "glutes": { name: i18n.t('db.anatomy.glutes.name'), function: i18n.t('db.anatomy.glutes.function'), system: i18n.t('db.anatomy.glutes.system'), action: i18n.t('db.anatomy.glutes.action'), recovery: i18n.t('db.anatomy.glutes.recovery') },
        "hamstrings": { name: i18n.t('db.anatomy.hamstrings.name'), function: i18n.t('db.anatomy.hamstrings.function'), system: i18n.t('db.anatomy.hamstrings.system'), action: i18n.t('db.anatomy.hamstrings.action'), recovery: i18n.t('db.anatomy.hamstrings.recovery') },
        "lowerback": { name: i18n.t('db.anatomy.lowerback.name'), function: i18n.t('db.anatomy.lowerback.function'), system: i18n.t('db.anatomy.lowerback.system'), action: i18n.t('db.anatomy.lowerback.action'), recovery: i18n.t('db.anatomy.lowerback.recovery') },
        "pelvic": { name: i18n.t('db.anatomy.pelvic.name'), function: i18n.t('db.anatomy.pelvic.function'), system: i18n.t('db.anatomy.pelvic.system'), action: i18n.t('db.anatomy.pelvic.action'), recovery: i18n.t('db.anatomy.pelvic.recovery') }
    };

    if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
        console.log('[DB] Anatomy database loaded');
    }
} // end initAnatomyDB
