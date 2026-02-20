// foods.js - Meal Plan Database
// Extracted from original index.html

import { CONFIG } from '../config/index.js';
import { DB } from '../config/db.js';
import { i18n } from '../services/i18nService.js';

const MEAL_PLAN_DB = {
    breakfast: [
        { text: i18n.t('db.foods.breakfast._0'), kcal: 550 },
        { text: i18n.t('db.foods.breakfast._1'), kcal: 500 },
        { text: i18n.t('db.foods.breakfast._2'), kcal: 600 },
        { text: i18n.t('db.foods.breakfast._3'), kcal: 700 },
        { text: i18n.t('db.foods.breakfast._4'), kcal: 650 },
        { text: i18n.t('db.foods.breakfast._5'), kcal: 550 },
        { text: i18n.t('db.foods.breakfast._6'), kcal: 480 },
        { text: i18n.t('db.foods.breakfast._7'), kcal: 520 },
        { text: i18n.t('db.foods.breakfast._8'), kcal: 600 },
        { text: i18n.t('db.foods.breakfast._9'), kcal: 450 },
        { text: i18n.t('db.foods.breakfast._10'), kcal: 550 },
        { text: i18n.t('db.foods.breakfast._11'), kcal: 680 }
    ],
    fuel: [
        { text: i18n.t('db.foods.fuel._0'), kcal: 700 },
        { text: i18n.t('db.foods.fuel._1'), kcal: 800 },
        { text: i18n.t('db.foods.fuel._2'), kcal: 850 },
        { text: i18n.t('db.foods.fuel._3'), kcal: 750 },
        { text: i18n.t('db.foods.fuel._4'), kcal: 780 },
        { text: i18n.t('db.foods.fuel._5'), kcal: 550 },
        { text: i18n.t('db.foods.fuel._6'), kcal: 720 },
        { text: i18n.t('db.foods.fuel._7'), kcal: 480 }
    ],
    lunch: [
        { text: i18n.t('db.foods.lunch._0'), kcal: 750 },
        { text: i18n.t('db.foods.lunch._1'), kcal: 800 },
        { text: i18n.t('db.foods.lunch._2'), kcal: 750 },
        { text: i18n.t('db.foods.lunch._3'), kcal: 700 },
        { text: i18n.t('db.foods.lunch._4'), kcal: 900 },
        { text: i18n.t('db.foods.lunch._5'), kcal: 850 },
        { text: i18n.t('db.foods.lunch._6'), kcal: 700 },
        { text: i18n.t('db.foods.lunch._7'), kcal: 750 },
        { text: i18n.t('db.foods.lunch._8'), kcal: 720 },
        { text: i18n.t('db.foods.lunch._9'), kcal: 680 },
        { text: i18n.t('db.foods.lunch._10'), kcal: 780 },
        { text: i18n.t('db.foods.lunch._11'), kcal: 820 },
        { text: i18n.t('db.foods.lunch._12'), kcal: 600 },
        { text: i18n.t('db.foods.lunch._13'), kcal: 650 }
    ],
    pre_workout: [
        { text: i18n.t('db.foods.pre_workout._0'), kcal: 110 },
        { text: i18n.t('db.foods.pre_workout._1'), kcal: 350 },
        { text: i18n.t('db.foods.pre_workout._2'), kcal: 600 },
        { text: i18n.t('db.foods.pre_workout._3'), kcal: 180 },
        { text: i18n.t('db.foods.pre_workout._4'), kcal: 280 },
        { text: i18n.t('db.foods.pre_workout._5'), kcal: 220 },
        { text: i18n.t('db.foods.pre_workout._6'), kcal: 250 },
        { text: i18n.t('db.foods.pre_workout._7'), kcal: 300 }
    ],
    dinner: [
        { text: i18n.t('db.foods.dinner._0'), kcal: 500 },
        { text: i18n.t('db.foods.dinner._1'), kcal: 650 },
        { text: i18n.t('db.foods.dinner._2'), kcal: 700 },
        { text: i18n.t('db.foods.dinner._3'), kcal: 750 },
        { text: i18n.t('db.foods.dinner._4'), kcal: 680 },
        { text: i18n.t('db.foods.dinner._5'), kcal: 720 },
        { text: i18n.t('db.foods.dinner._6'), kcal: 780 },
        { text: i18n.t('db.foods.dinner._7'), kcal: 700 },
        { text: i18n.t('db.foods.dinner._8'), kcal: 550 },
        { text: i18n.t('db.foods.dinner._9'), kcal: 800 },
        { text: i18n.t('db.foods.dinner._10'), kcal: 580 },
        { text: i18n.t('db.foods.dinner._11'), kcal: 620 }
    ],
    night: [
        { text: i18n.t('db.foods.night._0'), kcal: 300 },
        { text: i18n.t('db.foods.night._1'), kcal: 400 },
        { text: i18n.t('db.foods.night._2'), kcal: 300 },
        { text: i18n.t('db.foods.night._3'), kcal: 350 },
        { text: i18n.t('db.foods.night._4'), kcal: 280 },
        { text: i18n.t('db.foods.night._5'), kcal: 300 },
        { text: i18n.t('db.foods.night._6'), kcal: 320 },
        { text: i18n.t('db.foods.night._7'), kcal: 200 },
        { text: i18n.t('db.foods.night._8'), kcal: 380 },
        { text: i18n.t('db.foods.night._9'), kcal: 420 }
    ]
};

// Add to DB namespace (exercises.js already declared DB)
DB.MEAL_PLAN_DB = MEAL_PLAN_DB;

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log('[DB] Meal plan database loaded');
}

