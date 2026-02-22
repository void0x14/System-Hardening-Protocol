/**
 * Copyright (c) 2025-2026 void0x14
 */

// exercises.js - Exercise Database
// Extracted from original index.html

import { CONFIG } from '../config/index.js';
import { DB } from '../config/db.js';
import { i18n } from '../services/i18nService.js';

export function initExercisesDB() {
    DB.EXERCISES = {
        "stomach_vacuum": {
            title: i18n.t('db.exercises.stomach_vacuum.title'),
            tags: [i18n.t('db.exercises.stomach_vacuum.tags._0'), i18n.t('db.exercises.stomach_vacuum.tags._1')],
            desc: i18n.t('db.exercises.stomach_vacuum.desc'),
            steps: [i18n.t('db.exercises.stomach_vacuum.steps._0'), i18n.t('db.exercises.stomach_vacuum.steps._1'), i18n.t('db.exercises.stomach_vacuum.steps._2')]
        },
        "squat": {
            title: i18n.t('db.exercises.squat.title'),
            tags: [i18n.t('db.exercises.squat.tags._0'), i18n.t('db.exercises.squat.tags._1')],
            desc: i18n.t('db.exercises.squat.desc'),
            steps: [i18n.t('db.exercises.squat.steps._0'), i18n.t('db.exercises.squat.steps._1'), i18n.t('db.exercises.squat.steps._2')],
            videoId: "xqvCmoLULNY"
        },
        "goblet_squat": {
            title: i18n.t('db.exercises.goblet_squat.title'),
            tags: [i18n.t('db.exercises.goblet_squat.tags._0'), i18n.t('db.exercises.goblet_squat.tags._1')],
            desc: i18n.t('db.exercises.goblet_squat.desc'),
            steps: [i18n.t('db.exercises.goblet_squat.steps._0'), i18n.t('db.exercises.goblet_squat.steps._1'), i18n.t('db.exercises.goblet_squat.steps._2')],
            videoId: "MxsFDhcyFyE"
        },
        "pushup": {
            title: i18n.t('db.exercises.pushup.title'),
            tags: [i18n.t('db.exercises.pushup.tags._0'), i18n.t('db.exercises.pushup.tags._1')],
            desc: i18n.t('db.exercises.pushup.desc'),
            steps: [i18n.t('db.exercises.pushup.steps._0'), i18n.t('db.exercises.pushup.steps._1'), i18n.t('db.exercises.pushup.steps._2')],
            videoId: "IODxDxX7oi4"
        },
        "one_arm_row": {
            title: i18n.t('db.exercises.one_arm_row.title'),
            tags: [i18n.t('db.exercises.one_arm_row.tags._0'), i18n.t('db.exercises.one_arm_row.tags._1')],
            desc: i18n.t('db.exercises.one_arm_row.desc'),
            steps: [i18n.t('db.exercises.one_arm_row.steps._0'), i18n.t('db.exercises.one_arm_row.steps._1'), i18n.t('db.exercises.one_arm_row.steps._2')],
            videoId: "pYcpY20QaE8"
        },
        "plank": {
            title: i18n.t('db.exercises.plank.title'),
            tags: [i18n.t('db.exercises.plank.tags._0'), i18n.t('db.exercises.plank.tags._1')],
            desc: i18n.t('db.exercises.plank.desc'),
            steps: [i18n.t('db.exercises.plank.steps._0'), i18n.t('db.exercises.plank.steps._1'), i18n.t('db.exercises.plank.steps._2')],
            videoId: "kL_NJAkCQBg"
        },
        "farmers_walk": {
            title: i18n.t('db.exercises.farmers_walk.title'),
            tags: [i18n.t('db.exercises.farmers_walk.tags._0'), i18n.t('db.exercises.farmers_walk.tags._1')],
            desc: i18n.t('db.exercises.farmers_walk.desc'),
            steps: [i18n.t('db.exercises.farmers_walk.steps._0'), i18n.t('db.exercises.farmers_walk.steps._1'), i18n.t('db.exercises.farmers_walk.steps._2')],
            videoId: "Fkzk_RqlYig"
        },
        "hammer_curl": {
            title: i18n.t('db.exercises.hammer_curl.title'),
            tags: [i18n.t('db.exercises.hammer_curl.tags._0'), i18n.t('db.exercises.hammer_curl.tags._1')],
            desc: i18n.t('db.exercises.hammer_curl.desc'),
            steps: [i18n.t('db.exercises.hammer_curl.steps._0'), i18n.t('db.exercises.hammer_curl.steps._1'), i18n.t('db.exercises.hammer_curl.steps._2')],
            videoId: "zC3nLlEvin4"
        },
        "kegel": {
            title: i18n.t('db.exercises.kegel.title'),
            tags: [i18n.t('db.exercises.kegel.tags._0'), i18n.t('db.exercises.kegel.tags._1')],
            desc: i18n.t('db.exercises.kegel.desc'),
            steps: [i18n.t('db.exercises.kegel.steps._0'), i18n.t('db.exercises.kegel.steps._1'), i18n.t('db.exercises.kegel.steps._2')]
        },
        "mountain_climber": {
            title: i18n.t('db.exercises.mountain_climber.title'),
            tags: [i18n.t('db.exercises.mountain_climber.tags._0')],
            desc: i18n.t('db.exercises.mountain_climber.desc'),
            steps: [i18n.t('db.exercises.mountain_climber.steps._0'), i18n.t('db.exercises.mountain_climber.steps._1')],
            videoId: "nmwgirgXLYM"
        },
        "lying_leg_raise": {
            title: i18n.t('db.exercises.lying_leg_raise.title'),
            tags: [i18n.t('db.exercises.lying_leg_raise.tags._0'), i18n.t('db.exercises.lying_leg_raise.tags._1')],
            desc: i18n.t('db.exercises.lying_leg_raise.desc'),
            steps: [i18n.t('db.exercises.lying_leg_raise.steps._0'), i18n.t('db.exercises.lying_leg_raise.steps._1'), i18n.t('db.exercises.lying_leg_raise.steps._2')],
            videoId: "JB2oyawG9KI"
        },
        "eat_home": { title: i18n.t('db.exercises.eat_home.title'), tags: [i18n.t('db.exercises.eat_home.tags._0')], desc: i18n.t('db.exercises.eat_home.desc'), steps: [] },
        "single_leg_raise": { title: i18n.t('db.exercises.single_leg_raise.title'), tags: [i18n.t('db.exercises.single_leg_raise.tags._0')], desc: i18n.t('db.exercises.single_leg_raise.desc'), steps: [i18n.t('db.exercises.single_leg_raise.steps._0')] },
        "bottle_curl": { title: i18n.t('db.exercises.bottle_curl.title'), tags: [i18n.t('db.exercises.bottle_curl.tags._0')], desc: i18n.t('db.exercises.bottle_curl.desc'), steps: [i18n.t('db.exercises.bottle_curl.steps._0')] },
        "squat_heavy": { title: i18n.t('db.exercises.squat_heavy.title'), tags: [i18n.t('db.exercises.squat_heavy.tags._0')], desc: i18n.t('db.exercises.squat_heavy.desc'), steps: [i18n.t('db.exercises.squat_heavy.steps._0'), i18n.t('db.exercises.squat_heavy.steps._1'), i18n.t('db.exercises.squat_heavy.steps._2')] },
        "superman": {
            title: i18n.t('db.exercises.superman.title'),
            tags: [i18n.t('db.exercises.superman.tags._0'), i18n.t('db.exercises.superman.tags._1')],
            desc: i18n.t('db.exercises.superman.desc'),
            steps: [i18n.t('db.exercises.superman.steps._0'), i18n.t('db.exercises.superman.steps._1'), i18n.t('db.exercises.superman.steps._2')],
            videoId: "z6PJMT2y8GQ"
        },
        "neck_curl": {
            title: i18n.t('db.exercises.neck_curl.title'),
            tags: [i18n.t('db.exercises.neck_curl.tags._0'), i18n.t('db.exercises.neck_curl.tags._1')],
            desc: i18n.t('db.exercises.neck_curl.desc') + ` "System Choke" riskini minimize eder ve "Server" (Beyin) ünitesini fiziksel travmaya karşı korur.<br><br><strong>PROTOKOL:</strong> Sırt üstü yat, başın yatak/banktan sarkık. Alna havlu veya ağırlık yerleştir. Çeneyi göğse doğru kontrollü kıvır.<br><br><strong>HEDEF:</strong> 3 Set x 15-20 Tekrar (High Volume Traffic).`,
            steps: [i18n.t('db.exercises.neck_curl.steps._0'), i18n.t('db.exercises.neck_curl.steps._1'), i18n.t('db.exercises.neck_curl.steps._2')],
            trackingType: "weighted",
            sets: 3
        },
        "wrist_curl": {
            title: i18n.t('db.exercises.wrist_curl.title'),
            tags: [i18n.t('db.exercises.wrist_curl.tags._0'), i18n.t('db.exercises.wrist_curl.tags._1')],
            desc: i18n.t('db.exercises.wrist_curl.desc'),
            steps: [i18n.t('db.exercises.wrist_curl.steps._0'), i18n.t('db.exercises.wrist_curl.steps._1'), i18n.t('db.exercises.wrist_curl.steps._2')],
            trackingType: "weighted",
            sets: 3
        },
        "tibialis_raise": {
            title: i18n.t('db.exercises.tibialis_raise.title'),
            tags: [i18n.t('db.exercises.tibialis_raise.tags._0'), i18n.t('db.exercises.tibialis_raise.tags._1')],
            desc: i18n.t('db.exercises.tibialis_raise.desc') + ` "Shin Splints" (System Bugs) önleme, ayak bileği güçlendirme ve "Glitchless" hareket mekaniği sağlama.<br><br><strong>PROTOKOL:</strong> Duvara yaslan, bacaklar düz ve ileri. Topuklar yerde, parmak uçlarını baldırlara doğru kaldır.<br><br><strong>HEDEF:</strong> 3 Set x 25 Tekrar (Long-Term Support - LTS).`,
            steps: [i18n.t('db.exercises.tibialis_raise.steps._0'), i18n.t('db.exercises.tibialis_raise.steps._1'), i18n.t('db.exercises.tibialis_raise.steps._2')],
            trackingType: "weighted",
            sets: 3
        },
        // ===========================================
        // LIFESTYLE & RECOVERY TASKS (Simple Toggle)
        // ===========================================
        "eat_bulk": {
            title: i18n.t('db.exercises.eat_bulk.title'),
            tags: [i18n.t('db.exercises.eat_bulk.tags._0'), i18n.t('db.exercises.eat_bulk.tags._1')],
            desc: i18n.t('db.exercises.eat_bulk.desc'),
            steps: [i18n.t('db.exercises.eat_bulk.steps._0'), i18n.t('db.exercises.eat_bulk.steps._1'), i18n.t('db.exercises.eat_bulk.steps._2')],
            trackingType: "simple",
            sets: 1
        },
        "stretch": {
            title: i18n.t('db.exercises.stretch.title'),
            tags: [i18n.t('db.exercises.stretch.tags._0'), i18n.t('db.exercises.stretch.tags._1')],
            desc: i18n.t('db.exercises.stretch.desc'),
            steps: [i18n.t('db.exercises.stretch.steps._0'), i18n.t('db.exercises.stretch.steps._1'), i18n.t('db.exercises.stretch.steps._2')],
            trackingType: "simple",
            sets: 1
        },
        "weigh_in": {
            title: i18n.t('db.exercises.weigh_in.title'),
            tags: [i18n.t('db.exercises.weigh_in.tags._0'), i18n.t('db.exercises.weigh_in.tags._1')],
            desc: i18n.t('db.exercises.weigh_in.desc'),
            steps: [i18n.t('db.exercises.weigh_in.steps._0'), i18n.t('db.exercises.weigh_in.steps._1'), i18n.t('db.exercises.weigh_in.steps._2')],
            trackingType: "simple",
            sets: 1
        },
        "prep_food": {
            title: i18n.t('db.exercises.prep_food.title'),
            tags: [i18n.t('db.exercises.prep_food.tags._0'), i18n.t('db.exercises.prep_food.tags._1')],
            desc: i18n.t('db.exercises.prep_food.desc'),
            steps: [i18n.t('db.exercises.prep_food.steps._0'), i18n.t('db.exercises.prep_food.steps._1'), i18n.t('db.exercises.prep_food.steps._2')],
            trackingType: "simple",
            sets: 1
        },
        "walk_outside": {
            title: i18n.t('db.exercises.walk_outside.title'),
            tags: [i18n.t('db.exercises.walk_outside.tags._0'), i18n.t('db.exercises.walk_outside.tags._1')],
            desc: i18n.t('db.exercises.walk_outside.desc'),
            steps: [i18n.t('db.exercises.walk_outside.steps._0'), i18n.t('db.exercises.walk_outside.steps._1'), i18n.t('db.exercises.walk_outside.steps._2')],
            trackingType: "simple",
            sets: 1
        },
        "cool_down": {
            title: i18n.t('db.exercises.cool_down.title'),
            tags: [i18n.t('db.exercises.cool_down.tags._0'), i18n.t('db.exercises.cool_down.tags._1')],
            desc: i18n.t('db.exercises.cool_down.desc'),
            steps: [i18n.t('db.exercises.cool_down.steps._0'), i18n.t('db.exercises.cool_down.steps._1'), i18n.t('db.exercises.cool_down.steps._2')],
            trackingType: "simple",
            sets: 1
        }
    };

    // Foods database
    DB.FOODS = [
        { id: 100, cat: i18n.t('db.foods_list._0.cat'), name: i18n.t('db.foods_list._0.name'), type: "piece", vals: { cal: 850, prot: 35, carb: 100, fat: 35 }, unitName: "Adet" },
        { id: 101, cat: i18n.t('db.foods_list._1.cat'), name: i18n.t('db.foods_list._1.name'), type: "portion", vals: { cal: 884, prot: 0, carb: 0, fat: 100 }, options: [{ label: i18n.t('db.food_options._0._0'), ratio: 0.05 }, { label: i18n.t('db.food_options._0._1'), ratio: 0.14 }] },
        { id: 1, cat: i18n.t('db.foods_list._4.cat'), name: i18n.t('db.foods_list._4.name'), type: "portion", vals: { cal: 165, prot: 31, carb: 0, fat: 3.6 }, options: [{ label: i18n.t('db.food_options._1._0'), ratio: 1 }, { label: i18n.t('db.food_options._1._1'), ratio: 1.5 }, { label: i18n.t('db.food_options._1._2'), ratio: 2.5 }] },
        { id: 2, cat: i18n.t('db.foods_list._8.cat'), name: i18n.t('db.foods_list._8.name'), type: "portion", vals: { cal: 210, prot: 24, carb: 0, fat: 12 }, options: [{ label: i18n.t('db.food_options._2._0'), ratio: 1.5 }, { label: i18n.t('db.food_options._2._1'), ratio: 3 }] },
        { id: 3, cat: i18n.t('db.foods_list._11.cat'), name: i18n.t('db.foods_list._11.name'), type: "piece", vals: { cal: 60, prot: 5, carb: 2, fat: 4 }, unitName: "Adet" },
        { id: 4, cat: i18n.t('db.foods_list._12.cat'), name: i18n.t('db.foods_list._12.name'), type: "portion", vals: { cal: 190, prot: 26, carb: 0, fat: 10 }, options: [{ label: i18n.t('db.food_options._3._0'), ratio: 0.8 }, { label: i18n.t('db.food_options._3._1'), ratio: 1.6 }] },
        { id: 5, cat: i18n.t('db.foods_list._15.cat'), name: i18n.t('db.foods_list._15.name'), type: "piece", vals: { cal: 75, prot: 7, carb: 0.6, fat: 5 }, unitName: "Adet" },
        { id: 6, cat: i18n.t('db.foods_list._16.cat'), name: i18n.t('db.foods_list._16.name'), type: "portion", vals: { cal: 90, prot: 15, carb: 2, fat: 1 }, options: [{ label: i18n.t('db.food_options._4._0'), ratio: 1 }, { label: i18n.t('db.food_options._4._1'), ratio: 2.5 }] },
        { id: 7, cat: i18n.t('db.foods_list._19.cat'), name: i18n.t('db.foods_list._19.name'), type: "piece", vals: { cal: 70, prot: 5, carb: 0.5, fat: 6 }, unitName: "Dilim" },
        { id: 20, cat: i18n.t('db.foods_list._20.cat'), name: i18n.t('db.foods_list._20.name'), type: "portion", vals: { cal: 130, prot: 2.7, carb: 28, fat: 0.3 }, options: [{ label: i18n.t('db.food_options._5._0'), ratio: 1 }, { label: i18n.t('db.food_options._5._1'), ratio: 2 }, { label: i18n.t('db.food_options._5._2'), ratio: 3 }] },
        { id: 21, cat: i18n.t('db.foods_list._24.cat'), name: i18n.t('db.foods_list._24.name'), type: "portion", vals: { cal: 85, prot: 3, carb: 18, fat: 0.2 }, options: [{ label: i18n.t('db.food_options._6._0'), ratio: 1 }, { label: i18n.t('db.food_options._6._1'), ratio: 2 }, { label: i18n.t('db.food_options._6._2'), ratio: 3 }] },
        { id: 22, cat: i18n.t('db.foods_list._28.cat'), name: i18n.t('db.foods_list._28.name'), type: "portion", vals: { cal: 131, prot: 5, carb: 25, fat: 1 }, options: [{ label: i18n.t('db.food_options._7._0'), ratio: 1 }, { label: i18n.t('db.food_options._7._1'), ratio: 2 }, { label: i18n.t('db.food_options._7._2'), ratio: 3.5 }, { label: i18n.t('db.food_options._7._3'), ratio: 9 }] },
        { id: 23, cat: i18n.t('db.foods_list._33.cat'), name: i18n.t('db.foods_list._33.name'), type: "piece", vals: { cal: 90, prot: 2, carb: 20, fat: 0.1 }, unitName: "Adet (Orta)" },
        { id: 24, cat: i18n.t('db.foods_list._34.cat'), name: i18n.t('db.foods_list._34.name'), type: "portion", vals: { cal: 260, prot: 9, carb: 49, fat: 3 }, options: [{ label: i18n.t('db.food_options._8._0'), ratio: 0.25 }, { label: i18n.t('db.food_options._8._1'), ratio: 0.6 }, { label: i18n.t('db.food_options._8._2'), ratio: 1.2 }] },
        { id: 25, cat: i18n.t('db.foods_list._38.cat'), name: i18n.t('db.foods_list._38.name'), type: "piece", vals: { cal: 180, prot: 5, carb: 35, fat: 2 }, unitName: "Adet" },
        { id: 40, cat: i18n.t('db.foods_list._39.cat'), name: i18n.t('db.foods_list._39.name'), type: "portion", vals: { cal: 250, prot: 15, carb: 30, fat: 10 }, options: [{ label: i18n.t('db.food_options._9._0'), ratio: 2 }, { label: i18n.t('db.food_options._9._1'), ratio: 2.5 }, { label: i18n.t('db.food_options._9._2'), ratio: 3.5 }] },
        { id: 41, cat: i18n.t('db.foods_list._43.cat'), name: i18n.t('db.foods_list._43.name'), type: "portion", vals: { cal: 280, prot: 18, carb: 30, fat: 15 }, options: [{ label: i18n.t('db.food_options._10._0'), ratio: 2 }, { label: i18n.t('db.food_options._10._1'), ratio: 2.5 }, { label: i18n.t('db.food_options._10._2'), ratio: 1.5 }] },
        { id: 42, cat: i18n.t('db.foods_list._47.cat'), name: i18n.t('db.foods_list._47.name'), type: "piece", vals: { cal: 180, prot: 10, carb: 25, fat: 5 }, unitName: "Adet" },
        { id: 43, cat: i18n.t('db.foods_list._48.cat'), name: i18n.t('db.foods_list._48.name'), type: "portion", vals: { cal: 250, prot: 5, carb: 40, fat: 10 }, options: [{ label: i18n.t('db.food_options._11._0'), ratio: 1 }, { label: i18n.t('db.food_options._11._1'), ratio: 1.2 }] },
        { id: 44, cat: i18n.t('db.foods_list._51.cat'), name: i18n.t('db.foods_list._51.name'), type: "piece", vals: { cal: 320, prot: 10, carb: 55, fat: 5 }, unitName: "Adet" },
        { id: 45, cat: i18n.t('db.foods_list._52.cat'), name: i18n.t('db.foods_list._52.name'), type: "piece", vals: { cal: 500, prot: 20, carb: 60, fat: 20 }, unitName: "Adet (Tüm)" },
        { id: 60, cat: i18n.t('db.foods_list._53.cat'), name: i18n.t('db.foods_list._53.name'), type: "portion", vals: { cal: 120, prot: 7, carb: 15, fat: 4 }, options: [{ label: i18n.t('db.food_options._12._0'), ratio: 1 }, { label: i18n.t('db.food_options._12._1'), ratio: 2 }, { label: i18n.t('db.food_options._12._2'), ratio: 3 }] },
        { id: 61, cat: i18n.t('db.foods_list._57.cat'), name: i18n.t('db.foods_list._57.name'), type: "portion", vals: { cal: 70, prot: 2, carb: 8, fat: 4 }, options: [{ label: i18n.t('db.food_options._13._0'), ratio: 2 }, { label: i18n.t('db.food_options._13._1'), ratio: 3 }] },
        { id: 62, cat: i18n.t('db.foods_list._60.cat'), name: i18n.t('db.foods_list._60.name'), type: "portion", vals: { cal: 60, prot: 3, carb: 8, fat: 2 }, options: [{ label: i18n.t('db.food_options._14._0'), ratio: 2 }, { label: i18n.t('db.food_options._14._1'), ratio: 3 }] },
        { id: 63, cat: i18n.t('db.foods_list._63.cat'), name: i18n.t('db.foods_list._63.name'), type: "portion", vals: { cal: 120, prot: 8, carb: 5, fat: 9 }, options: [{ label: i18n.t('db.food_options._15._0'), ratio: 2 }, { label: i18n.t('db.food_options._15._1'), ratio: 4 }] },
        { id: 80, cat: i18n.t('db.foods_list._66.cat'), name: i18n.t('db.foods_list._66.name'), type: "portion", vals: { cal: 440, prot: 6, carb: 75, fat: 12 }, options: [{ label: i18n.t('db.food_options._16._0'), ratio: 0.4 }, { label: i18n.t('db.food_options._16._1'), ratio: 1 }, { label: i18n.t('db.food_options._16._2'), ratio: 1.5 }] },
        { id: 81, cat: i18n.t('db.foods_list._70.cat'), name: i18n.t('db.foods_list._70.name'), type: "portion", vals: { cal: 590, prot: 25, carb: 20, fat: 50 }, options: [{ label: i18n.t('db.food_options._17._0'), ratio: 0.1 }, { label: i18n.t('db.food_options._17._1'), ratio: 0.2 }, { label: i18n.t('db.food_options._17._2'), ratio: 0.35 }] },
        { id: 82, cat: i18n.t('db.foods_list._74.cat'), name: i18n.t('db.foods_list._74.name'), type: "portion", vals: { cal: 370, prot: 13, carb: 60, fat: 7 }, options: [{ label: i18n.t('db.food_options._18._0'), ratio: 0.4 }, { label: i18n.t('db.food_options._18._1'), ratio: 1 }, { label: i18n.t('db.food_options._18._2'), ratio: 1.5 }] },
        { id: 83, cat: i18n.t('db.foods_list._78.cat'), name: i18n.t('db.foods_list._78.name'), type: "piece", vals: { cal: 105, prot: 1, carb: 27, fat: 0.4 }, unitName: "Adet" },
        { id: 84, cat: i18n.t('db.foods_list._79.cat'), name: i18n.t('db.foods_list._79.name'), type: "portion", vals: { cal: 60, prot: 3, carb: 5, fat: 3 }, options: [{ label: i18n.t('db.food_options._19._0'), ratio: 2 }, { label: i18n.t('db.food_options._19._1'), ratio: 3 }, { label: i18n.t('db.food_options._19._2'), ratio: 5 }] },
        { id: 85, cat: i18n.t('db.foods_list._83.cat'), name: i18n.t('db.foods_list._83.name'), type: "portion", vals: { cal: 65, prot: 4, carb: 5, fat: 3 }, options: [{ label: i18n.t('db.food_options._20._0'), ratio: 2 }, { label: i18n.t('db.food_options._20._1'), ratio: 3 }] },
        { id: 86, cat: i18n.t('db.foods_list._86.cat'), name: i18n.t('db.foods_list._86.name'), type: "portion", vals: { cal: 530, prot: 6, carb: 50, fat: 35 }, options: [{ label: i18n.t('db.food_options._21._0'), ratio: 0.2 }, { label: i18n.t('db.food_options._21._1'), ratio: 0.5 }, { label: i18n.t('db.food_options._21._2'), ratio: 1.5 }] },
        { id: 87, cat: i18n.t('db.foods_list._90.cat'), name: i18n.t('db.foods_list._90.name'), type: "piece", vals: { cal: 150, prot: 6, carb: 20, fat: 4 }, unitName: "Kutu (200ml)" },
        { id: 88, cat: i18n.t('db.foods_list._91.cat'), name: i18n.t('db.foods_list._91.name'), type: "piece", vals: { cal: 350, prot: 8, carb: 45, fat: 15 }, unitName: "Paket" },
        { id: 89, cat: i18n.t('db.foods_list._92.cat'), name: i18n.t('db.foods_list._92.name'), type: "portion", vals: { cal: 170, prot: 7, carb: 6, fat: 14 }, options: [{ label: i18n.t('db.food_options._22._0'), ratio: 1 }, { label: i18n.t('db.food_options._22._1'), ratio: 2 }] },
        { id: 90, cat: i18n.t('db.foods_list._95.cat'), name: i18n.t('db.foods_list._95.name'), type: "piece", vals: { cal: 25, prot: 0.3, carb: 6, fat: 0 }, unitName: "Adet" }
    ];

    if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
        console.log(`[DB] ${Object.keys(DB.EXERCISES).length} exercises, ${DB.FOODS.length} foods loaded`);
    }
} // end initExercisesDB
