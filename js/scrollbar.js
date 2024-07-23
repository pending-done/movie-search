document.addEventListener('DOMContentLoaded', function() {
    const content = document.querySelector('.movie-container');
    const thumb = document.querySelector('.thumb');
    const scrollbar = document.querySelector('.scrollbar');

    const updateThumbHeight = () => {
        const viewportHeight = window.innerHeight;
        const contentHeight = content.scrollHeight;
        const thumbHeight = Math.max(viewportHeight / contentHeight * scrollbar.clientHeight, 20); // 최소 높이 20px
        thumb.style.height = `${thumbHeight}px`;
    };

    updateThumbHeight();

    let isDragging = false;
    let startY;
    let startTop;

    thumb.addEventListener('mousedown', function(event) {
        isDragging = true;
        startY = event.clientY;
        startTop = thumb.offsetTop;
        document.body.style.userSelect = 'none'; 
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        document.body.style.userSelect = '';  
    });

    document.addEventListener('mousemove', function(event) {
        if (!isDragging) return;

        const dy = event.clientY - startY;
        const newTop = Math.min(Math.max(startTop + dy, 0), scrollbar.clientHeight - thumb.clientHeight);
        thumb.style.top = `${newTop}px`;

        const scrollPercent = newTop / (scrollbar.clientHeight - thumb.clientHeight);
        window.scrollTo(0, scrollPercent * (content.scrollHeight - window.innerHeight));
    });

    window.addEventListener('scroll', function() {
        if (!isDragging) {
            const scrollPercent = window.scrollY / (content.scrollHeight - window.innerHeight);
            const newTop = scrollPercent * (scrollbar.clientHeight - thumb.clientHeight);
            thumb.style.top = `${newTop}px`;
        }
    });

    window.addEventListener('resize', updateThumbHeight);
});