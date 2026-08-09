(function () {
    const READY_STATE_HAVE_ENOUGH_DATA = 4;

    function whenCanPlayThrough(video) {
        if (video.readyState >= READY_STATE_HAVE_ENOUGH_DATA) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            video.addEventListener('canplaythrough', resolve, { once: true });
        });
    }

    function initVideoSync() {
        const videos = Array.from(document.querySelectorAll('.landing-video'));

        if (videos.length === 0) {
            return;
        }

        Promise.all(videos.map(whenCanPlayThrough)).then(() => {
            for (const video of videos) {
                video.play().catch(() => {});
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoSync, { once: true });
    } else {
        initVideoSync();
    }
})();
