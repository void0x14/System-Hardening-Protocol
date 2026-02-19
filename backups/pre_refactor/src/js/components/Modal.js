// components/Modal.js - Modal Dialog Component
// Extracted from ui.js for reusability

/**
 * Modal Manager Class
 * Handles modal dialog lifecycle with ESC key and backdrop close
 */
export class Modal {
    /**
     * @param {Object} options - Modal configuration
     * @param {string} options.modalId - ID of the modal element
     * @param {string} options.titleId - ID of the title element
     * @param {string} options.bodyId - ID of the body element
     */
    constructor(options = {}) {
        this.modalId = options.modalId || 'universal-modal';
        this.titleId = options.titleId || 'modal-title';
        this.bodyId = options.bodyId || 'modal-body';
        this._escHandler = null;
    }

    /**
     * Open modal with text content (escaped)
     * @param {string} title - Modal title
     * @param {string} content - Text content (will be escaped)
     */
    open(title, content = '') {
        this._openInternal(title, content, false);
    }

    /**
     * Open modal with HTML content
     * @param {string} title - Modal title
     * @param {string} content - HTML content
     */
    openHtml(title, content = '') {
        this._openInternal(title, content, true);
    }

    /**
     * Internal open method
     * @private
     */
    _openInternal(title, content, allowHtml) {
        const titleEl = document.getElementById(this.titleId);
        const bodyEl = document.getElementById(this.bodyId);
        const modalEl = document.getElementById(this.modalId);

        if (!titleEl || !bodyEl || !modalEl) {
            console.error('[Modal] Required elements not found');
            return;
        }

        titleEl.innerText = title;
        
        if (allowHtml) {
            bodyEl.innerHTML = String(content ?? '');
            this._bindMediaFallbacks(bodyEl);
        } else {
            bodyEl.textContent = String(content ?? '');
        }

        modalEl.classList.add('active');
        
        // Setup ESC handler
        this._escHandler = (e) => {
            if (e.key === 'Escape') this.close();
        };
        document.addEventListener('keydown', this._escHandler);
    }

    /**
     * Close the modal
     */
    close() {
        const modalEl = document.getElementById(this.modalId);
        if (modalEl) {
            modalEl.classList.remove('active');
        }

        if (this._escHandler) {
            document.removeEventListener('keydown', this._escHandler);
            this._escHandler = null;
        }
    }

    /**
     * Bind image fallback handlers
     * @private
     */
    _bindMediaFallbacks(root) {
        if (!root) return;
        const images = root.querySelectorAll('img[data-fallback-src]');
        images.forEach(img => {
            if (img.dataset.fallbackBound === 'true') return;
            img.dataset.fallbackBound = 'true';
            img.addEventListener('error', () => {
                const fallbackSrc = img.dataset.fallbackSrc;
                if (!fallbackSrc || img.dataset.fallbackApplied === 'true') return;
                img.dataset.fallbackApplied = 'true';
                img.src = fallbackSrc;
            });
        });
    }
}

/**
 * Alert Modal Manager Class
 * Red-themed warning/alert modal
 */
export class AlertModal {
    /**
     * @param {Object} options - Alert configuration
     * @param {string} options.modalId - ID of the alert modal element
     * @param {string} options.messageId - ID of the message element
     */
    constructor(options = {}) {
        this.modalId = options.modalId || 'alert-modal';
        this.messageId = options.messageId || 'alert-message';
    }

    /**
     * Show alert with text message
     * @param {string} message - Alert message
     */
    show(message) {
        const messageEl = document.getElementById(this.messageId);
        const modalEl = document.getElementById(this.modalId);

        if (!messageEl || !modalEl) {
            console.error('[AlertModal] Required elements not found');
            return;
        }

        messageEl.textContent = String(message ?? '');
        modalEl.classList.add('active');
    }

    /**
     * Show alert with HTML content
     * @param {string} message - HTML message
     */
    showHtml(message) {
        const messageEl = document.getElementById(this.messageId);
        const modalEl = document.getElementById(this.modalId);

        if (!messageEl || !modalEl) {
            console.error('[AlertModal] Required elements not found');
            return;
        }

        messageEl.innerHTML = String(message ?? '');
        modalEl.classList.add('active');
    }

    /**
     * Close the alert
     */
    close() {
        const modalEl = document.getElementById(this.modalId);
        if (modalEl) {
            modalEl.classList.remove('active');
        }
    }
}

/**
 * Create modal HTML structure
 * @param {string} id - Modal ID
 * @param {string} title - Default title
 * @returns {string} HTML string for modal structure
 */
export function createModalHTML(id, title = 'Modal') {
    return `
        <div id="${id}" class="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden items-center justify-center p-4">
            <div class="modal-content bg-cyber-dark border border-gray-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
                <div class="modal-header flex justify-between items-center p-4 border-b border-gray-800">
                    <h3 id="${id}-title" class="text-lg font-bold text-white">${title}</h3>
                    <button onclick="this.closest('.modal-overlay').classList.remove('active')" class="text-gray-500 hover:text-white transition">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div id="${id}-body" class="modal-body p-4 overflow-y-auto max-h-[70vh]">
                    <!-- Content injected here -->
                </div>
            </div>
        </div>
    `;
}

// Default instances for backward compatibility
export const modal = new Modal();
export const alertModal = new AlertModal();

export default Modal;
