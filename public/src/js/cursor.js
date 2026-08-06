document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const mediaElements = document.querySelectorAll('img, video');
    mediaElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-large');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-large');
        });
    });
});