// BackupService.js - Data Export/Import Functionality
// Phase 5: Service Layer - Extracted from store.js

import { config } from '../config/index.js';
import { ValidationService } from '../ValidationService.js';

/**
 * BackupService
 * Handles data export, import, and backup status operations
 * Zero external dependencies
 */
export class BackupService {
    /**
     * @param {Object} options - Configuration options
     * @param {Object} options.storage - Storage adapter (with get/set methods)
     * @param {Object} [options.validationService] - Validation service instance
     * @param {Object} [options.keys] - Storage keys from config
     * @param {string} [options.version] - App version
     */
    constructor(options) {
        this.storage = options.storage;
        this.validationService = options.validationService || new ValidationService();
        this.keys = options.keys || config.keys;
        this.version = options.version || '9.0.0';
    }

    /**
     * Export all application data to JSON file
     * @async
     * @returns {Promise<boolean>} Success status
     */
    async exportData() {
        const data = {};
        
        // Collect all data from storage
        for (const key in this.keys) {
            const storageKey = this.keys[key];
            
            // Handle prefixed keys (those ending with _)
            if (storageKey.endsWith('_')) {
                // Iterate through storage to find matching keys
                const allKeys = await this.storage.keys();
                for (const lsKey of allKeys) {
                    if (lsKey && lsKey.startsWith(storageKey)) {
                        data[lsKey] = await this.storage.get(lsKey);
                    }
                }
            } else {
                data[storageKey] = await this.storage.get(storageKey);
            }
        }
        
        // Add metadata
        data.meta = {
            version: this.version,
            date: new Date().toISOString(),
            user: 'SYSTEM_HARDENING_USER'
        };
        
        // Create and download file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system_hardening_backup_${this.getDateStr()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Update backup date
        await this.storage.set(this.keys.BACKUP, this.getDateStr());
        
        return true;
    }

    /**
     * Import data from JSON content
     * @async
     * @param {string} jsonContent - JSON string to import
     * @param {number} [defaultWeight=45.0] - Default weight for import
     * @returns {Promise<Object>} Result object with success status
     */
    async importData(jsonContent, defaultWeight = 45.0) {
        try {
            const parsed = JSON.parse(jsonContent);
            
            // Validate import data structure
            const validation = this.validateImportData(parsed);
            if (!validation.valid) {
                throw new Error(validation.error || 'Geçersiz yedek dosyası');
            }

            // Sanitize imported data
            const data = this.validationService.sanitizeImportedData(
                validation.data,
                this.keys,
                defaultWeight
            );
            
            // Clear existing data
            await this.clearExistingData();
            
            // Write new data
            for (const key in data) {
                if (key !== 'meta') {
                    await this.storage.set(key, data[key]);
                }
            }
            
            return { success: true, date: data.meta?.date };
        } catch (e) {
            console.error('Import Error:', e);
            return { success: false, error: e.message };
        }
    }

    /**
     * Validate import data structure
     * @param {*} data - Data to validate
     * @returns {Object} Validation result { valid, data, error }
     */
    validateImportData(data) {
        // Check if data is an object
        if (!data || typeof data !== 'object') {
            return { valid: false, error: 'Invalid data format' };
        }
        
        // Check for required meta field
        if (!data.meta) {
            return { valid: false, error: 'Missing metadata' };
        }
        
        // Check for at least one known key
        const knownKeys = Object.values(this.keys);
        const dataKeys = Object.keys(data).filter(k => k !== 'meta');
        const hasKnownKey = dataKeys.some(key => 
            knownKeys.some(known => 
                known.endsWith('_') ? key.startsWith(known) : key === known
            )
        );
        
        if (!hasKnownKey) {
            return { valid: false, error: 'No valid data keys found' };
        }
        
        return { valid: true, data };
    }

    /**
     * Clear existing data before import
     * @async
     * @private
     */
    async clearExistingData() {
        const prefixes = Object.values(this.keys).map(k => k.replace(/_$/, ''));
        const keysToRemove = [];
        
        const allKeys = await this.storage.keys();
        for (const key of allKeys) {
            if (prefixes.some(p => key.startsWith(p))) {
                keysToRemove.push(key);
            }
        }
        
        for (const key of keysToRemove) {
            await this.storage.remove(key);
        }
    }

    /**
     * Check backup status
     * @async
     * @returns {Promise<string>} Status: 'OK', 'WARNING', or 'NEVER'
     */
    async checkBackupStatus() {
        const lastBackup = await this.storage.get(this.keys.BACKUP);
        
        if (!lastBackup) return 'NEVER';
        
        const today = new Date();
        const last = new Date(lastBackup);
        
        if (isNaN(last.getTime())) return 'WARNING';
        
        const diffDays = Math.ceil(Math.abs(today - last) / (1000 * 60 * 60 * 24));
        
        if (diffDays > 7) return 'WARNING';
        
        return 'OK';
    }

    /**
     * Get current date string in YYYY-MM-DD format
     * @returns {string} Date string
     * @private
     */
    getDateStr() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Create a backup without downloading (for auto-backup)
     * @async
     * @returns {Promise<Object>} Backup data object
     */
    async createBackupData() {
        const data = {};
        
        for (const key in this.keys) {
            const storageKey = this.keys[key];
            
            if (storageKey.endsWith('_')) {
                const allKeys = await this.storage.keys();
                for (const lsKey of allKeys) {
                    if (lsKey && lsKey.startsWith(storageKey)) {
                        data[lsKey] = await this.storage.get(lsKey);
                    }
                }
            } else {
                data[storageKey] = await this.storage.get(storageKey);
            }
        }
        
        data.meta = {
            version: this.version,
            date: new Date().toISOString(),
            user: 'SYSTEM_HARDENING_USER',
            autoBackup: true
        };
        
        return data;
    }

    /**
     * Restore from backup data object
     * @async
     * @param {Object} backupData - Backup data to restore
     * @param {number} [defaultWeight=45.0] - Default weight for import
     * @returns {Promise<Object>} Result object with success status
     */
    async restoreFromData(backupData, defaultWeight = 45.0) {
        try {
            const validation = this.validateImportData(backupData);
            if (!validation.valid) {
                throw new Error(validation.error || 'Invalid backup data');
            }

            const data = this.validationService.sanitizeImportedData(
                validation.data,
                this.keys,
                defaultWeight
            );
            
            await this.clearExistingData();
            
            for (const key in data) {
                if (key !== 'meta') {
                    await this.storage.set(key, data[key]);
                }
            }
            
            return { success: true, date: data.meta?.date };
        } catch (e) {
            console.error('Restore Error:', e);
            return { success: false, error: e.message };
        }
    }
}

export default BackupService;
