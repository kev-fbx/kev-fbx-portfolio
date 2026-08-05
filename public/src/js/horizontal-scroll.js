const container = document.querySelector('#content-cell');

if (container) {
  const getMaxScrollLeft = () => {
    const lastItem = container.querySelector('.project-divider > :last-child');

    if (!lastItem) {
      return Math.max(0, container.scrollWidth - container.clientWidth);
    }

    return Math.max(0, lastItem.offsetLeft + lastItem.offsetWidth - container.clientWidth);
  };

  container.addEventListener('wheel', (evt) => {
    if (evt.deltaY === 0) {
      return;
    }

    const nextScrollLeft = container.scrollLeft + evt.deltaY * 2;
    container.scrollLeft = Math.min(getMaxScrollLeft(), Math.max(0, nextScrollLeft));
    evt.preventDefault();
  }, { passive: false });
}