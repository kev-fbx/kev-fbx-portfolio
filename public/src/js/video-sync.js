(function () {
    const READY_STATE_HAVE_FUTURE_DATA = 3;
    const START_FALLBACK_MS = 3000;

    function whenReady(video) {
        return new Promise((resolve) => {
            if (video.readyState >= READY_STATE_HAVE_FUTURE_DATA) {
                resolve();
                return;
            }

            const onReady = () => {
                video.removeEventListener('canplaythrough', onReady);
                video.removeEventListener('canplay', onReady);
                video.removeEventListener('error', onReady);
                resolve();
            };

            video.addEventListener('canplaythrough', onReady, { once: true });
            video.addEventListener('canplay', onReady, { once: true });
            video.addEventListener('error', onReady, { once: true });
        });
    }

    function initVideoSync() {
        const videos = Array.from(document.querySelectorAll('.landing-video'));

        if (videos.length === 0) {
            return;
        }

        let started = false;

        function startTogether() {
            if (started) {
                return;
            }

            started = true;

            for (const video of videos) {
                if (video.currentTime !== 0) {
                    video.currentTime = 0;
                }
            }

            for (const video of videos) {
                const playback = video.play();

                if (playback && typeof playback.catch === 'function') {
                    playback.catch(() => {});
                }
            }
        }

        const fallbackId = window.setTimeout(startTogether, START_FALLBACK_MS);

        Promise.all(videos.map(whenReady)).then(() => {
            window.clearTimeout(fallbackId);
            startTogether();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoSync, { once: true });
    } else {
        initVideoSync();
    }
})();
