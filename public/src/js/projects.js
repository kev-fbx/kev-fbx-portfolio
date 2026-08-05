document.addEventListener('DOMContentLoaded', () => {
    const rail = document.getElementById('project-rail');
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll('.project-card'));
    const indexEl = document.getElementById('rail-index');
    const totalEl = document.getElementById('rail-total');
    const progressEl = document.getElementById('rail-progress');
    const pad = (n) => String(n).padStart(2, '0');

    if (totalEl) totalEl.textContent = pad(cards.length);

    /* ---- Wheel drives the rail sideways ----
       Listening on the window rather than the rail: the page itself never
       scrolls (html/body are overflow:hidden), so every wheel event on this
       page belongs to the rail, wherever the pointer happens to be. */
    window.addEventListener('wheel', (e) => {
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (!delta) return;
        const before = rail.scrollLeft;
        rail.scrollLeft += delta;
        if (rail.scrollLeft !== before) e.preventDefault();
    }, { passive: false });

    /* ---- Drag to scroll ---- */
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let moved = 0;

    rail.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') return; // native touch scrolling handles this
        pointerId = e.pointerId;
        startX = e.clientX;
        startScroll = rail.scrollLeft;
        moved = 0;
    });

    rail.addEventListener('pointermove', (e) => {
        if (e.pointerId !== pointerId) return;
        const dx = e.clientX - startX;
        moved = Math.max(moved, Math.abs(dx));
        if (moved > 4) {
            if (!rail.hasPointerCapture(pointerId)) rail.setPointerCapture(pointerId);
            rail.scrollLeft = startScroll - dx;
        }
    });

    const endDrag = (e) => {
        if (e.pointerId !== pointerId) return;
        if (rail.hasPointerCapture(pointerId)) rail.releasePointerCapture(pointerId);
        pointerId = null;
    };

    rail.addEventListener('pointerup', endDrag);
    rail.addEventListener('pointercancel', endDrag);
    rail.addEventListener('dragstart', (e) => e.preventDefault());

    // A drag should not open the project it finished on
    rail.addEventListener('click', (e) => {
        if (moved > 6) {
            e.preventDefault();
            moved = 0;
        }
    });

    /* ---- Arrow keys step one slice ---- */
    rail.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const step = cards.length ? cards[0].offsetWidth : rail.clientWidth * 0.25;
        const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        rail.scrollBy({
            left: e.key === 'ArrowRight' ? step : -step,
            behavior: smooth ? 'smooth' : 'auto'
        });
    });

    /* ---- Position readout ---- */
    const updateStatus = () => {
        const max = rail.scrollWidth - rail.clientWidth;
        const ratio = max > 0 ? rail.scrollLeft / max : 0;

        if (progressEl) {
            const width = rail.scrollWidth > 0
                ? Math.min((rail.clientWidth / rail.scrollWidth) * 100, 100)
                : 100;
            progressEl.style.width = width + '%';
            progressEl.style.left = ratio * (100 - width) + '%';
        }

        if (indexEl && cards.length) {
            const centre = rail.scrollLeft + rail.clientWidth / 2;
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

    rail.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateStatus);
    }, { passive: true });
    window.addEventListener('resize', updateStatus);
    updateStatus();
});