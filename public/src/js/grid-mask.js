(function () {
    const COLS = 4;
    const ROWS = 4;
    const CELL_COUNT = COLS * ROWS;
    const MIN_HOLD_MS = 6000;
    const MAX_HOLD_MS = 10000;
    const MIN_FADE_MS = 1300;
    const MAX_FADE_MS = 2800;

    function getRandomVal(min, max) {
        return min + Math.random() * (max - min);
    }

    function createSvgElement(tagName) {
        return document.createElementNS('http://www.w3.org/2000/svg', tagName);
    }

    function initGridMask() {
        const grid = document.getElementById('mask-grid');
        const container = document.getElementById('video-mask-container');
        const wireframeVideo = document.getElementById('wireframe-video');
        const renderVideo = document.getElementById('render-video');

        if (!grid || !container || !wireframeVideo || !renderVideo) {
            return;
        }

        grid.innerHTML = '';
        const cellIcons = document.getElementById('mask-cell-icons');

        for (let index = 0; index < CELL_COUNT; index++) {
            const cell = document.createElement('div');
            cell.className = 'inner-cell';

            const icon = cellIcons &&
                cellIcons.content.querySelector('[data-cell="' + (index + 1) + '"]');

            if (icon) {
                cell.appendChild(icon.cloneNode(true));
            }

            grid.appendChild(cell);
        }

        const svg = createSvgElement('svg');
        svg.classList.add('grid-mask-defs');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');

        const defs = createSvgElement('defs');
        svg.appendChild(defs);

        const wireframeMask = createSvgElement('mask');
        wireframeMask.setAttribute('id', 'grid-wireframe-mask');
        wireframeMask.setAttribute('maskUnits', 'objectBoundingBox');
        wireframeMask.setAttribute('maskContentUnits', 'objectBoundingBox');
        wireframeMask.setAttribute('mask-type', 'alpha');

        const renderMask = createSvgElement('mask');
        renderMask.setAttribute('id', 'grid-render-mask');
        renderMask.setAttribute('maskUnits', 'objectBoundingBox');
        renderMask.setAttribute('maskContentUnits', 'objectBoundingBox');
        renderMask.setAttribute('mask-type', 'alpha');

        const state = [];

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const wireframeRect = createSvgElement('rect');
                const renderRect = createSvgElement('rect');

                const x = col / COLS;
                const y = row / ROWS;
                const width = 1 / COLS;
                const height = 1 / ROWS;

                for (const rect of [wireframeRect, renderRect]) {
                    rect.setAttribute('x', String(x));
                    rect.setAttribute('y', String(y));
                    rect.setAttribute('width', String(width));
                    rect.setAttribute('height', String(height));
                    rect.setAttribute('fill', '#ffffff');
                }

                wireframeRect.setAttribute('opacity', Math.random() < 0.5 ? '1' : '0');
                renderRect.setAttribute('opacity', wireframeRect.getAttribute('opacity') === '1' ? '0' : '1');

                wireframeMask.appendChild(wireframeRect);
                renderMask.appendChild(renderRect);

                state.push({
                    current: wireframeRect.getAttribute('opacity') === '1' ? 'wireframe' : 'render',
                    target: null,
                    startTime: 0,
                    duration: 0,
                    timeoutId: null,
                    wireframeRect,
                    renderRect,
                });
            }
        }

        defs.appendChild(wireframeMask);
        defs.appendChild(renderMask);
        container.appendChild(svg);

        wireframeVideo.style.mask = 'url(#grid-wireframe-mask)';
        wireframeVideo.style.webkitMask = 'url(#grid-wireframe-mask)';
        renderVideo.style.mask = 'url(#grid-render-mask)';
        renderVideo.style.webkitMask = 'url(#grid-render-mask)';

        let rafId = null;

        function drawCell(index, wireframeOpacity, renderOpacity) {
            const cell = state[index];
            cell.wireframeRect.setAttribute('opacity', String(wireframeOpacity));
            cell.renderRect.setAttribute('opacity', String(renderOpacity));
        }

        function scheduleNext(index) {
            const cell = state[index];
            if (cell.timeoutId !== null) {
                clearTimeout(cell.timeoutId);
            }

            cell.timeoutId = window.setTimeout(() => {
                startTransition(index);
            }, getRandomVal(MIN_HOLD_MS, MAX_HOLD_MS));
        }

        function startTransition(index) {
            const cell = state[index];
            cell.timeoutId = null;
            cell.target = cell.current === 'wireframe' ? 'render' : 'wireframe';
            cell.startTime = performance.now();
            cell.duration = getRandomVal(MIN_FADE_MS, MAX_FADE_MS);

            if (rafId === null) {
                rafId = window.requestAnimationFrame(tick);
            }
        }

        function tick(now) {
            let activeTransition = false;

            for (let index = 0; index < state.length; index++) {
                const cell = state[index];

                if (!cell.target) {
                    if (cell.current === 'wireframe') {
                        drawCell(index, 1, 0);
                    } else {
                        drawCell(index, 0, 1);
                    }
                    continue;
                }

                activeTransition = true;
                const progress = Math.min(1, (now - cell.startTime) / cell.duration);

                if (cell.target === 'render') {
                    drawCell(index, 1 - progress, progress);
                } else {
                    drawCell(index, progress, 1 - progress);
                }

                if (progress >= 1) {
                    cell.current = cell.target;
                    cell.target = null;
                    scheduleNext(index);
                }
            }

            if (activeTransition) {
                rafId = window.requestAnimationFrame(tick);
            } else {
                rafId = null;
            }
        }

        for (let index = 0; index < state.length; index++) {
            scheduleNext(index);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGridMask, { once: true });
    } else {
        initGridMask();
    }
})();