// video-player.js - YouTube Video Player with Fallback System
// Extracted from original index.html lines 3015-3036

// Global scope assignment
const VideoPlayer = window.VideoPlayer = {
    openVideo(videoId) {
        // Embed URL ile dene
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        const popup = window.open(embedUrl, 'VideoPlayer', 'width=854,height=480,resizable=yes');

        // 3 saniye sonra kontrol et
        setTimeout(() => {
            try {
                if (!popup || popup.closed) {
                    // Popup kapandıysa normal YouTube'a yönlendir
                    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                    UI.showToast('Video yeni sekmede açılıyor...', 'info');
                }
            } catch (error) {
                // Cross-origin hatası - normal davranış
                console.log('Video popup açıldı (cross-origin)');
            }
        }, 3000);
    }
};

console.log('[VideoPlayer] Video system loaded');
