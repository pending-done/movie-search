document.addEventListener('DOMContentLoaded', function () {
    const thumb = document.querySelector('.thumb');
    const scrollbar = document.querySelector('.scrollbar');
    const content = document.querySelector('body');
    let isDragging = false;
    let startY;
    let startTop;


    scrollbar.addEventListener('mousedown', function (event) {
        // mousedown => 해당 위치로 스크롤
        const clickY = event.clientY - scrollbar.getBoundingClientRect().top;
        const thumbTop = clickY - thumb.clientHeight / 2;
        thumb.style.top = `${Math.max(0, Math.min(thumbTop, scrollbar.clientHeight - thumb.clientHeight))}px`;
        const scrollPercent = thumbTop / (scrollbar.clientHeight - thumb.clientHeight);
        window.scrollTo(0, scrollPercent * (content.scrollHeight - window.innerHeight));

        // 클릭유지 된 상태로 mousemove
        isDragging = true;
        startY = event.clientY;
        startTop = thumb.offsetTop;
        document.body.style.userSelect = 'none';

        updateColorByScroll ([215,210,204],[48,67,82], scrollPercent);
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
        document.body.style.userSelect = '';
    });

    document.addEventListener('mousemove', function (event) {
        if (!isDragging) return;

        const dy = event.clientY - startY;
        const newTop = Math.min(Math.max(startTop + dy, 0), scrollbar.clientHeight - thumb.clientHeight);
        thumb.style.top = `${newTop}px`;

        const scrollPercent = newTop / (scrollbar.clientHeight - thumb.clientHeight);
        window.scrollTo(0, scrollPercent * (content.scrollHeight - window.innerHeight));

        updateColorByScroll ([215,210,204],[48,67,82], scrollPercent);
    });


    window.addEventListener('scroll', function () {
        if (!isDragging) {
            const scrollPercent = window.scrollY / (content.scrollHeight - window.innerHeight);
            const newTop = scrollPercent * (scrollbar.clientHeight - thumb.clientHeight);
            thumb.style.top = `${newTop}px`;

            updateColorByScroll ([215,210,204],[48,67,82], scrollPercent);
        }
    });

    function updateColorByScroll(start, end, scrollPercent) {
        // 그라데이션 색상 변경 (2가지)
        let startColor = start;// 시작 색상 (RGB)
        let endColor = end; // 끝 색상 (RGB)
        const currentColor = startColor.map((start, index) => {
            const end = endColor[index];
            return Math.round(start + (end - start) * scrollPercent);
        });
        thumb.style.backgroundColor = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
    }
});