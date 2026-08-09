(function () {
    const READY_STATE_HAVE_CURRENT_DATA = 2;
    const READY_TIMEOUT_MS = 4000;
    const TOLERANCE_S = 0.2;

    function whenReady(video) {
        if (video.readyState >= READY_STATE_HAVE_CURRENT_DATA) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            function settle() {
                window.clearTimeout(timeoutId);
                video.removeEventListener('loadeddata', settle);
                resolve();
            }

            const timeoutId = window.setTimeout(settle, READY_TIMEOUT_MS);
            video.addEventListener('loadeddata', settle, { once: true });

            if (video.readyState === 0) {
                video.load();
            }
        });
    }

    function initVideoSync() {
        const videos = Array.from(document.querySelectorAll('.landing-video'));

        if (videos.length === 0) {
            return;
        }

        let awaitingGesture = false;
        let offscreen = false;

        function playAll() {
            if (offscreen || document.hidden) {
                return;
            }

            const target = videos[0].currentTime;

            for (const video of videos) {
                if (video.readyState >= READY_STATE_HAVE_CURRENT_DATA &&
                    Math.abs(video.currentTime - target) > TOLERANCE_S) {
                    video.currentTime = target;
                }

                const attempt = video.play();

                if (attempt) {
                    attempt.catch(awaitGesture);
                }
            }
        }

        function awaitGesture() {
            if (awaitingGesture) {
                return;
            }

            awaitingGesture = true;

            function retry() {
                awaitingGesture = false;
                document.removeEventListener('touchend', retry);
                document.removeEventListener('click', retry);
                playAll();
            }

            document.addEventListener('touchend', retry, { once: true, passive: true });
            document.addEventListener('click', retry, { once: true });
        }

        function pauseAll() {
            for (const video of videos) {
                video.pause();
            }
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                pauseAll();
            } else {
                playAll();
            }
        });

        window.addEventListener('pageshow', playAll);

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                offscreen = !entries[0].isIntersecting;

                if (offscreen) {
                    pauseAll();
                } else {
                    playAll();
                }
            }, { threshold: 0 });

            observer.observe(videos[0].parentElement || videos[0]);
        }

        Promise.all(videos.map(whenReady)).then(playAll);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoSync, { once: true });
    } else {
        initVideoSync();
    }
})();
