// anatomy.js - Anatomy Database
// Extracted from original index.html

// Use window.DB directly (exercises.js already declared it)
window.DB.ANATOMY_DB = {
    "chest": { name: "Pectoralis Major", function: "İtme kuvveti.", system: "Üst Gövde İtiş", action: "Push-up, Floor Press", recovery: "48-72 Saat" },
    "abs": { name: "Rectus Abdominis", function: "Core gücü, cinsel dayanıklılık.", system: "Merkezi Denge", action: "Plank, Leg Raise, Vacuum", recovery: "24-48 Saat" },
    "quads": { name: "Quadriceps", function: "Vücudu taşıma, piston gücü.", system: "Lokomotor", action: "Squat", recovery: "72 Saat" },
    "biceps": { name: "Biceps Brachii", function: "Çekme, kavrama.", system: "Üst Gövde Çekiş", action: "Hammer Curl", recovery: "48 Saat" },
    "traps": { name: "Trapezius", function: "Omuz stabilizasyonu.", system: "Posterior Zincir", action: "Farmer's Walk", recovery: "48 Saat" },
    "lats": { name: "Latissimus Dorsi", function: "Gövdeyi yukarı çekme.", system: "Posterior Zincir", action: "One Arm Row", recovery: "48-72 Saat" },
    "glutes": { name: "Gluteus Maximus", function: "İtiş gücü (Thrust).", system: "Güç Merkezi", action: "Squat", recovery: "72 Saat" },
    "hamstrings": { name: "Hamstrings", function: "Diz bükme.", system: "Lokomotor", action: "Squat", recovery: "48-72 Saat" },
    "lowerback": { name: "Erector Spinae", function: "Omurgayı dik tutma.", system: "Core Destek", action: "Superman", recovery: "48 Saat" },
    "pelvic": { name: "Pelvik Taban", function: "Boşalma kontrolü.", system: "Üreme", action: "Kegel", recovery: "24 Saat" }
};

console.log('[DB] Anatomy database loaded');
