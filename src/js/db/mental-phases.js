/**
 * Copyright (c) 2025-2026 void0x14
 */

// mental-phases.js - Mental Hardening Phases
// Extracted from original index.html

// Global scope assignment
import { CONFIG } from '../config/index.js';
import { DB } from '../config/db.js';
import { i18n } from '../services/i18nService.js';

export function initMentalPhasesDB() {
    const MENTAL_PHASES = [
        {
            id: 1,
            title: i18n.t('db.mental_phases._0.title'),
            desc: i18n.t('db.mental_phases._0.desc'),
            core: i18n.t('db.mental_phases._0.core'),
            intent: i18n.t('db.mental_phases._0.intent'),
            strategy: [i18n.t('db.mental_phases._0.strategy._0'), i18n.t('db.mental_phases._0.strategy._1'), i18n.t('db.mental_phases._0.strategy._2')],
            practice: [i18n.t('db.mental_phases._0.practice._0'), i18n.t('db.mental_phases._0.practice._1')]
        },
        {
            id: 2,
            title: i18n.t('db.mental_phases._1.title'),
            desc: i18n.t('db.mental_phases._1.desc'),
            core: i18n.t('db.mental_phases._1.core'),
            intent: i18n.t('db.mental_phases._1.intent'),
            strategy: [i18n.t('db.mental_phases._1.strategy._0'), i18n.t('db.mental_phases._1.strategy._1'), i18n.t('db.mental_phases._1.strategy._2')],
            practice: [i18n.t('db.mental_phases._1.practice._0'), i18n.t('db.mental_phases._1.practice._1')]
        },
        {
            id: 3,
            title: i18n.t('db.mental_phases._2.title'),
            desc: i18n.t('db.mental_phases._2.desc'),
            core: i18n.t('db.mental_phases._2.core'),
            intent: i18n.t('db.mental_phases._2.intent'),
            strategy: [i18n.t('db.mental_phases._2.strategy._0'), i18n.t('db.mental_phases._2.strategy._1'), i18n.t('db.mental_phases._2.strategy._2')],
            practice: [i18n.t('db.mental_phases._2.practice._0'), i18n.t('db.mental_phases._2.practice._1')]
        },
        {
            id: 4,
            title: i18n.t('db.mental_phases._3.title'),
            desc: i18n.t('db.mental_phases._3.desc'),
            core: i18n.t('db.mental_phases._3.core'),
            intent: i18n.t('db.mental_phases._3.intent'),
            strategy: [i18n.t('db.mental_phases._3.strategy._0'), i18n.t('db.mental_phases._3.strategy._1'), i18n.t('db.mental_phases._3.strategy._2')],
            practice: [i18n.t('db.mental_phases._3.practice._0'), i18n.t('db.mental_phases._3.practice._1')]
        },
        {
            id: 5,
            title: i18n.t('db.mental_phases._4.title'),
            desc: i18n.t('db.mental_phases._4.desc'),
            core: i18n.t('db.mental_phases._4.core'),
            intent: i18n.t('db.mental_phases._4.intent'),
            strategy: [i18n.t('db.mental_phases._4.strategy._0'), i18n.t('db.mental_phases._4.strategy._1'), i18n.t('db.mental_phases._4.strategy._2')],
            practice: [i18n.t('db.mental_phases._4.practice._0'), i18n.t('db.mental_phases._4.practice._1')]
        },
        {
            id: 6,
            title: i18n.t('db.mental_phases._5.title'),
            desc: i18n.t('db.mental_phases._5.desc'),
            core: i18n.t('db.mental_phases._5.core'),
            intent: i18n.t('db.mental_phases._5.intent'),
            strategy: [i18n.t('db.mental_phases._5.strategy._0'), i18n.t('db.mental_phases._5.strategy._1'), i18n.t('db.mental_phases._5.strategy._2')],
            practice: [i18n.t('db.mental_phases._5.practice._0'), i18n.t('db.mental_phases._5.practice._1')]
        },
        {
            id: 7,
            title: i18n.t('db.mental_phases._6.title'),
            desc: i18n.t('db.mental_phases._6.desc'),
            core: i18n.t('db.mental_phases._6.core'),
            intent: i18n.t('db.mental_phases._6.intent'),
            strategy: [i18n.t('db.mental_phases._6.strategy._0'), i18n.t('db.mental_phases._6.strategy._1'), i18n.t('db.mental_phases._6.strategy._2')],
            practice: [i18n.t('db.mental_phases._6.practice._0'), i18n.t('db.mental_phases._6.practice._1')]
        },
        {
            id: 8,
            title: i18n.t('db.mental_phases._7.title'),
            desc: i18n.t('db.mental_phases._7.desc'),
            core: i18n.t('db.mental_phases._7.core'),
            intent: i18n.t('db.mental_phases._7.intent'),
            strategy: [i18n.t('db.mental_phases._7.strategy._0'), i18n.t('db.mental_phases._7.strategy._1'), i18n.t('db.mental_phases._7.strategy._2')],
            practice: [i18n.t('db.mental_phases._7.practice._0'), i18n.t('db.mental_phases._7.practice._1')]
        }
    ];

    // Add to DB namespace (exercises.js already declared DB)
    DB.MENTAL_PHASES = MENTAL_PHASES;

    if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
        console.log('[DB] Mental phases loaded');
    }
} // end initMentalPhasesDB
