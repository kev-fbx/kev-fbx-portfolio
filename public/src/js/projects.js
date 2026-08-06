document.addEventListener('DOMContentLoaded', () => {
    const scrollBar = document.getElementById('project-scroll-bar');
    if (!scrollBar) return;

    const cards = Array.from(scrollBar.querySelectorAll('.project-card'));
    const indexEl = document.getElementById('scroll-bar-index');
    const totalEl = document.getElementById('scroll-bar-total');
    const progressEl = document.getElementById('scroll-bar-progress');
    const pad = (n) => String(n).padStart(2, '0');

    if (totalEl) totalEl.textContent = pad(cards.length);

    const isStacked = () => window.matchMedia('(max-width: 1100px)').matches;

    window.addEventListener('wheel', (e) => {
        if (isStacked()) return;
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (!delta) return;
        const before = scrollBar.scrollLeft;
        scrollBar.scrollLeft += delta;
        if (scrollBar.scrollLeft !== before) e.preventDefault();
    }, { passive: false });

    scrollBar.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const step = cards.length ? cards[0].offsetWidth : scrollBar.clientWidth * 0.25;
        const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        scrollBar.scrollBy({
            left: e.key === 'ArrowRight' ? step : -step,
            behavior: smooth ? 'smooth' : 'auto'
        });
    });

    const updateStatus = () => {
        const max = scrollBar.scrollWidth - scrollBar.clientWidth;
        const ratio = max > 0 ? scrollBar.scrollLeft / max : 0;

        if (progressEl) {
            const width = scrollBar.scrollWidth > 0
                ? Math.min((scrollBar.clientWidth / scrollBar.scrollWidth) * 100, 100)
                : 100;
            progressEl.style.width = width + '%';
            progressEl.style.left = ratio * (100 - width) + '%';
        }

        if (indexEl && cards.length) {
            const centre = scrollBar.scrollLeft + scrollBar.clientWidth / 2;
            let nearest = 0;
            let best = Infinity;
            cards.forEach((card, i) => {
                const dist = Math.abs((card.offsetLeft + card.offsetWidth / 2) - centre);
                if (dist < best) {
                    best = dist;
                    nearest = i;
                }
            });
            indexEl.textContent = pad(nearest + 1);
        }
    };

    scrollBar.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateStatus);
    }, { passive: true });
    window.addEventListener('resize', updateStatus);
    updateStatus();
});