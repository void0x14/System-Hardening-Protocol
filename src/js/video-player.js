/**
 * Copyright (c) 2025-2026 void0x14
 */

// video-player.js - YouTube Video Player with Fallback System
// Extracted from original index.html lines 3015-3036

// Global scope assignment
import { Actions } from './actions.js';
import { CONFIG } from './config/index.js';

const VideoPlayer = {
    openVideo(videoId) {
        console.warn('VideoPlayer.openVideo deprecated. Use Actions.playVideoInline instead.');
    }
};

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log('[VideoPlayer] Video system loaded');
}
