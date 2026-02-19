// theme.js - UI Theme Constants
// Extracted from config.js for Phase 2: Configuration Extraction

/**
 * UI theme and styling constants for System Hardening app.
 * Tailwind CSS class compositions for consistent styling.
 * 
 * @module config/theme
 */

/**
 * Card component styling.
 * Used for main content containers and panels.
 * 
 * @constant {string}
 * @example
 * <div class="${THEME.card}">Content</div>
 */
export const CARD_CLASSES = "bg-surface-card rounded-xl p-6 md:p-8 shadow-2xl transition-all card-hover-lift";

/**
 * Button component styling.
 * Primary action buttons with hover effects.
 * 
 * @constant {string}
 * @example
 * <button class="${THEME.btn}">Click Me</button>
 */
export const BUTTON_CLASSES = "bg-surface-raised hover:bg-neon-green hover:text-gunmetal text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2";

/**
 * Input field styling.
 * Form inputs with focus states.
 * 
 * @constant {string}
 * @example
 * <input class="${THEME.input}" type="text" />
 */
export const INPUT_CLASSES = "bg-surface-raised border-0 text-white rounded-lg p-3 focus:ring-2 focus:ring-neon-green/30 outline-none w-full transition-all";

/**
 * Label styling.
 * Form labels with uppercase tracking.
 * 
 * @constant {string}
 * @example
 * <label class="${THEME.label}">Field Name</label>
 */
export const LABEL_CLASSES = "text-xs uppercase tracking-[0.2em] text-text-muted font-bold mb-3 block";

/**
 * Color palette for the app.
 * Neon green on dark theme (cyberpunk aesthetic).
 * 
 * @constant {Object}
 * @property {string} PRIMARY - Primary accent color (neon green)
 * @property {string} SECONDARY - Secondary accent color
 * @property {string} BACKGROUND - Main background color
 * @property {string} SURFACE - Surface/card background
 * @property {string} TEXT - Primary text color
 * @property {string} TEXT_MUTED - Muted/secondary text color
 * @property {string} SUCCESS - Success state color
 * @property {string} WARNING - Warning state color
 * @property {string} ERROR - Error state color
 */
export const COLORS = {
    PRIMARY: '#00ff41',      // Neon green
    PRIMARY_DARK: '#00cc33', // Darker green for hover
    SECONDARY: '#00d4ff',    // Cyan accent
    BACKGROUND: '#0a0a0a',   // Near black
    SURFACE: '#1a1a1a',      // Dark gray
    SURFACE_CARD: '#141414', // Card background
    SURFACE_RAISED: '#242424', // Raised elements
    TEXT: '#ffffff',         // White text
    TEXT_MUTED: '#888888',   // Gray text
    SUCCESS: '#00ff41',      // Green
    WARNING: '#ffaa00',      // Orange
    ERROR: '#ff4444'         // Red
};

/**
 * Animation durations (in milliseconds).
 * 
 * @constant {Object}
 * @property {number} FAST - Quick animations (150ms)
 * @property {number} NORMAL - Standard animations (300ms)
 * @property {number} SLOW - Slow animations (500ms)
 * @property {number} EPIC - Epic reveal animations (1000ms)
 */
export const ANIMATION_DURATIONS = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    EPIC: 1000
};

/**
 * Z-index layers for stacking context.
 * 
 * @constant {Object}
 * @property {number} BASE - Default layer (0)
 * @property {number} DROPDOWN - Dropdowns (100)
 * @property {number} STICKY - Sticky elements (200)
 * @property {number} MODAL - Modal dialogs (300)
 * @property {number} OVERLAY - Full-screen overlays (400)
 * @property {number} TOAST - Toast notifications (500)
 */
export const Z_INDEX = {
    BASE: 0,
    DROPDOWN: 100,
    STICKY: 200,
    MODAL: 300,
    OVERLAY: 400,
    TOAST: 500
};

/**
 * Breakpoint definitions (pixels).
 * Matches Tailwind default breakpoints.
 * 
 * @constant {Object}
 * @property {number} SM - Small devices (640px)
 * @property {number} MD - Medium devices (768px)
 * @property {number} LG - Large devices (1024px)
 * @property {number} XL - Extra large devices (1280px)
 * @property {number} XXL - 2XL devices (1536px)
 */
export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536
};

/**
 * Spacing scale (rem units).
 * Consistent spacing values for margins and padding.
 * 
 * @constant {Object}
 * @property {number} XS - Extra small (0.25rem = 4px)
 * @property {number} SM - Small (0.5rem = 8px)
 * @property {number} MD - Medium (1rem = 16px)
 * @property {number} LG - Large (1.5rem = 24px)
 * @property {number} XL - Extra large (2rem = 32px)
 * @property {number} XXL - 2XL (3rem = 48px)
 */
export const SPACING = {
    XS: 0.25,
    SM: 0.5,
    MD: 1,
    LG: 1.5,
    XL: 2,
    XXL: 3
};

/**
 * Border radius values.
 * 
 * @constant {Object}
 * @property {string} SM - Small radius (0.25rem)
 * @property {string} MD - Medium radius (0.5rem)
 * @property {string} LG - Large radius (1rem)
 * @property {string} XL - Extra large radius (1.5rem)
 * @property {string} FULL - Full/pill radius (9999px)
 */
export const BORDER_RADIUS = {
    SM: '0.25rem',
    MD: '0.5rem',
    LG: '1rem',
    XL: '1.5rem',
    FULL: '9999px'
};

/**
 * Combined theme object for easy access.
 * 
 * @constant {Object}
 */
export const THEME = {
    card: CARD_CLASSES,
    btn: BUTTON_CLASSES,
    input: INPUT_CLASSES,
    label: LABEL_CLASSES,
    colors: COLORS,
    animation: ANIMATION_DURATIONS,
    zIndex: Z_INDEX,
    breakpoints: BREAKPOINTS,
    spacing: SPACING,
    borderRadius: BORDER_RADIUS
};

/**
 * Get a CSS class string for a component type.
 * 
 * @param {string} component - Component type ('card', 'btn', 'input', 'label')
 * @returns {string} CSS class string
 * 
 * @example
 * getClasses('card') // Returns card CSS classes
 */
export function getClasses(component) {
    const classMap = {
        card: CARD_CLASSES,
        btn: BUTTON_CLASSES,
        button: BUTTON_CLASSES,
        input: INPUT_CLASSES,
        label: LABEL_CLASSES
    };
    return classMap[component] || '';
}

/**
 * Create a modified button class with variant.
 * 
 * @param {string} [variant='primary'] - Button variant ('primary', 'secondary', 'danger')
 * @returns {string} Modified button CSS classes
 */
export function getButtonVariant(variant = 'primary') {
    const baseClasses = "font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2";
    
    const variants = {
        primary: `bg-surface-raised hover:bg-neon-green hover:text-gunmetal text-white ${baseClasses}`,
        secondary: `bg-surface-card hover:bg-surface-raised text-text-muted hover:text-white ${baseClasses}`,
        danger: `bg-error/20 hover:bg-error text-error hover:text-white ${baseClasses}`,
        success: `bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-gunmetal ${baseClasses}`
    };
    
    return variants[variant] || variants.primary;
}

export default THEME;
