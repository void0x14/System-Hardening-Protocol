/**
 * Copyright (c) 2025-2026 void0x14
 */

// components/Toast.js - Toast Notification Component
// Extracted from ui.js for reusability

/**
 * Toast Manager Class
 * Handles toast notification lifecycle
 */
export class Toast {
    /**
     * @param {Object} options - Toast configuration
     * @param {string} options.containerId - ID of the toast container element
     * @param {number} options.duration - Duration in ms before auto-dismiss
     */
    constructor(options = {}) {
        this.containerId = options.containerId || 'toast-container';
        this.duration = options.duration || 3000;
    }

    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {('success'|'error'|'warning'|'info')} [type='success'] - Toast type
     */
    show(message, type = 'success') {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('[Toast] Container not found:', this.containerId);
            return;
        }

        const toast = document.createElement('div');
        toast.className = this._getClasses(type);
        toast.innerHTML = this._getContent(message, type);
        
        container.appendChild(toast);
        
        // Auto-remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, this.duration);
    }

    /**
     * Show success toast
     * @param {string} message - Message to display
     */
    success(message) {
        this.show(message, 'success');
    }

    /**
     * Show error toast
     * @param {string} message - Message to display
     */
    error(message) {
        this.show(message, 'error');
    }

    /**
     * Show warning toast
     * @param {string} message - Message to display
     */
    warning(message) {
        this.show(message, 'warning');
    }

    /**
     * Show info toast
     * @param {string} message - Message to display
     */
    info(message) {
        this.show(message, 'info');
    }

    /**
     * Get CSS classes for toast type
     * @private
     */
    _getClasses(type) {
        const baseClasses = 'toast mb-3 rounded shadow-lg bg-cyber-dark border-l-4 text-sm font-bold flex items-center gap-3 transition-all duration-300';
        
        const typeClasses = {
            success: 'border-neon-green text-neon-green',
            error: 'border-neon-red text-neon-red',
            warning: 'border-accent-orange text-accent-orange',
            info: 'border-neon-blue text-neon-blue'
        };

        return `${baseClasses} ${typeClasses[type] || typeClasses.success}`;
    }

    /**
     * Get HTML content for toast
     * @private
     */
    _getContent(message, type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const safeMessage = this._escapeHtml(message);
        return `<i class="fas ${icons[type] || icons.success}"></i> ${safeMessage}`;
    }

    /**
     * Escape HTML to prevent XSS
     * @private
     */
    _escapeHtml(value) {
        if (value === null || value === undefined) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

/**
 * Create toast container HTML
 * @returns {string} HTML string for toast container
 */
export function createToastContainerHTML() {
    return `
        <div id="toast-container" class="fixed top-4 right-4 z-50 flex flex-col items-end pointer-events-none">
            <!-- Toasts will be injected here -->
        </div>
    `;
}

/**
 * Quick toast function for backward compatibility
 * @param {string} message - Message to display
 * @param {('success'|'error')} [type='success'] - Toast type
 */
export function showToast(message, type = 'success') {
    const toast = new Toast();
    toast.show(message, type);
}

// Default instance for backward compatibility
export const toast = new Toast();

export default Toast;
