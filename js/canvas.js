window.onload = function() {
    const image = document.getElementById('backPosterImg');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    image.onload = function() {
        // 캔버스 크기 설정
        
        canvas.width = image.width;
        canvas.height = image.height;
        image.crossOrigin;

        // 이미지 그리기
        context.drawImage(image, 0, 0);

        try {
            // 이미지 데이터 가져오기
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            let r = 0, g = 0, b = 0;
            const length = data.length / 4; // 각 픽셀은 4개의 값(R, G, B, A)을 가짐

            // 색상 데이터의 총합을 구함
            for (let i = 0; i < length; i++) {
                r += data[i * 4];
                g += data[i * 4 + 1];
                b += data[i * 4 + 2];
            }

            // 평균 색상 계산
            r = Math.floor(r / length);
            g = Math.floor(g / length);
            b = Math.floor(b / length);

            // 연한 색상 생성
            const lightColor = `rgb(${Math.floor(r * 0.8)}, ${Math.floor(g * 0.8)}, ${Math.floor(b * 0.8)})`;

            // 배경색을 그라데이션으로 설정
            document.body.style.background = `linear-gradient(to bottom right, ${lightColor}, rgb(${r}, ${g}, ${b}))`;

            console.log('Average Color:', `rgb(${r}, ${g}, ${b})`);
        } catch (e) {
            console.error('Error accessing image data:', e);
        }
    };

    // 이미지를 다시 로드 (캐시된 이미지일 경우)
    image.src = image.src;
};