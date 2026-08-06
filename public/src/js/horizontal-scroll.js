const content = document.querySelector('.project-content');

if (content) {
  const isStacked = () => window.matchMedia('(max-width: 1100px)').matches;

  content.addEventListener('wheel', (evt) => {
    if (evt.deltaY === 0 || isStacked()) {
      return;
    }

    const before = content.scrollLeft;
    content.scrollLeft += evt.deltaY * 2;

    if (content.scrollLeft !== before) {
      evt.preventDefault();
    }
  }, { passive: false });

  const smoothly = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

  const step = (direction) => {
    const contentLeft = content.getBoundingClientRect().left;
    const padLeft = parseFloat(getComputedStyle(content).paddingLeft) || 0;
    const offsets = Array.from(content.querySelectorAll('.divider'), (divider) =>
      divider.getBoundingClientRect().left - contentLeft - padLeft
    );

    const target = direction > 0
      ? offsets.find((offset) => offset > 1)
      : offsets.filter((offset) => offset < -1).pop();

    if (target === undefined) {
      return;
    }

    content.scrollBy({ left: target, behavior: smoothly() });
  };

  const keys = {
    ArrowRight: () => step(1),
    ArrowLeft: () => step(-1),
    Home: () => content.scrollTo({ left: 0, behavior: smoothly() }),
    End: () => content.scrollTo({ left: content.scrollWidth, behavior: smoothly() })
  };

  window.addEventListener('keydown', (evt) => {
    if (isStacked() || evt.ctrlKey || evt.altKey || evt.metaKey) {
      return;
    }

    const target = evt.target;
    if (target instanceof Element &&
        target.closest('input, textarea, select, [contenteditable="true"]')) {
      return;
    }

    const action = keys[evt.key];
    if (!action) {
      return;
    }

    evt.preventDefault();
    action();
  });

  const progress = document.getElementById('scroll-bar-progress');

  if (progress) {
    const update = () => {
      const travel = content.scrollWidth - content.clientWidth;
      const thumb = content.scrollWidth > 0
        ? Math.min((content.clientWidth / content.scrollWidth) * 100, 100)
        : 100;
      const reached = travel > 0 ? content.scrollLeft / travel : 0;

      progress.style.width = thumb + '%';
      progress.style.left = reached * (100 - thumb) + '%';
    };

    content.addEventListener('scroll', () => {
      window.requestAnimationFrame(update);
    }, { passive: true });

    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();
  }
}
