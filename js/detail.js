const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id'); // 'id'에 해당하는 Query Parameter 값 가져오기
const IMG_URL = "https://image.tmdb.org/t/p/original";
console.log(`Loading details for movie ID ${movieId}`);

// 페이지 기본 로드
fetchData({ id: movieId }, "", processDetailData);

// 전체 영화 가져올일 있을때 사용
const processData = (data) => {
    searchMovieId(data);
}

// 영화 id로 필터링 (쓸일없을듯)
function searchMovieId(data) {
}


function processDetailData(data) {
    console.log(data);

    // 상세 데이터 생성
    createDetailElement(data);

    // 장르 데이터 생성
    fetchData({ countryCode: data.origin_country[0], genres: data.genres }, "", processGenresData);
    //  곧 개봉 생성
    // fetchData({ type: "upcoming", genres: data.genres }, "", processUpcomingData);

    //  인기 데이터 생성
    // fetchData({ type: "topRated", genres: data.genres }, "", processPopularityData);

    // 출연진 데이터
    fetchDetailSub({credits: " "}, movieId, processActorData);

    
    

    // 출연진 ?
}


const processActorData = (data) => {
    console.log("배우 데이터");
    console.log(data);

    const result = data.cast.map(({ id, name }) => ({ id, name }));

    console.log(result);
}



// 공통함수 싹다 합쳐야됨 processGenresData().... 등
// ex) 내일할거임
const 임시함수 = (제목, 무슨데이터생성햇는가) => {

    // 내용은 똑같음 
    const subContainer = createSubContainer(제목);

    //분기
    if(무슨데이터생성햇는가 == "곧개봉"){
        // 개봉예정일 기준으로 뭐 대충 정렬하는 함수 호출
    }else if(무슨데이터생성햇는가 == "현재상영"){
        // 가장 많이 예매햇다던지(이건 기본값), 개봉일 내림차순으로 한다던지 뭐 
    }else{
        // 그 외 그냥 대충 popularity 기준으로 할거면 그냥 바로 createElemet 해버리면 됨
    }

    data.forEach(data => {
        const imgContainer = createImgContainer(data);
        const posterContainer = subContainer.querySelector('.poster-container');
        posterContainer.appendChild(imgContainer);
    });

    const mainContainer = document.querySelector('.main-container');
    mainContainer.insertAdjacentElement('beforeend', subContainer);
}




const mainContainer = document.querySelector('.main-container');

const processGenresData = (data) => {

    const subContainer = createSubContainer("비슷한 장르의 작품들");
    data.forEach(data => {
        const imgContainer = createImgContainer(data);
        const posterContainer = subContainer.querySelector('.poster-container');
        posterContainer.appendChild(imgContainer);
    });

    const mainContainer = document.querySelector('.main-container');
    mainContainer.insertAdjacentElement('afterend', subContainer);
}


const processUpcomingData = (data) => {

    const subContainer = createSubContainer("밍순!");
    data.forEach(data => {
        const imgContainer = createImgContainer(data);
        const posterContainer = subContainer.querySelector('.poster-container');
        posterContainer.appendChild(imgContainer);
    });

    const mainContainer = document.querySelector('.main-container');
    mainContainer.insertAdjacentElement('afterend', subContainer);

}

const processPopularityData = (data) => {

    const subContainer = createSubContainer("최고의 작품들");
    data.forEach(data => {
        const imgContainer = createImgContainer(data);
        const posterContainer = subContainer.querySelector('.poster-container');
        posterContainer.appendChild(imgContainer);
    });

    const mainContainer = document.querySelector('.main-container');
    mainContainer.insertAdjacentElement('afterend', subContainer);

}



function createImgContainer(data) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';

    const link = document.createElement('a');
    link.href = `/detail/detail.html?id=${data.id}`;

    const img = document.createElement('img');
    img.className = 'sub-poster';
    img.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    img.alt = 'Movie Poster';

    link.appendChild(img);
    imgContainer.appendChild(link);

    return imgContainer;
}

function createSubContainer(header) {
    const subContainer = document.createElement('div');
    subContainer.className = 'sub-container';

    const section = document.createElement('section');
    section.className = 'sub-section';

    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'section-header';

    const h1 = document.createElement('h1');
    h1.textContent = header;

    const sectionBody = document.createElement('div');
    sectionBody.className = 'section-body';

    const posterContainer = document.createElement('div');
    posterContainer.className = 'poster-container';

    const progress = document.createElement('div');
    progress.className = 'progress';

    const progressBar = document.createElement('div');
    progressBar.className = 'bar';

    sectionHeader.appendChild(h1);
    section.appendChild(sectionHeader);
    sectionBody.appendChild(posterContainer);
    sectionBody.appendChild(progress);
    progress.appendChild(progressBar);
    section.appendChild(sectionBody);
    subContainer.appendChild(section);

    return subContainer;
}


// html 생성
function createDetailElement(data) {
    console.log(data);

    // const randomImg = getRandomImg(data);

    const img = getRandomImg(data);
    const overview = getOverview(data.overview, 200);


    // 이미지 속성 변경
    document.getElementById('backPosterImg').src = IMG_URL + img.back;
    document.getElementById('moviePosterImg').src = IMG_URL + img.poster;

    // 텍스트 변경
    document.getElementById('detailGenres02').textContent = data.genres.map((v) => v.name).join(', '); // 장르 배열을 콤마로 구분된 문자열로 설정
    document.getElementById('detailSummary01').textContent = data.tagline;
    document.getElementById('detailSummary02').textContent = overview // overview 문자열의 첫 30자만 표시
    document.getElementById('detailCountry02').textContent = data.origin_country[0];
    document.getElementById('detailTitle01').textContent = data.title;
    document.getElementById('detailTitle02').textContent = data.original_title;
    document.getElementById("detailDate02").textContent = data.release_date;
}

// 배경이미지, 포스터이미지 랜덤
function getRandomImg(data) {
    const randomNumber = Math.random();
    const img = {
        back: data.backdrop_path,
        poster: data.poster_path,
    }

    if (data.belongs_to_collection === null || data.belongs_to_collection.backdrop_path == null) return img;

    if (data.belongs_to_collection.poster_path !== null) {
        if (randomNumber < 0.25) {
            img.back = data.belongs_to_collection.backdrop_path;
            img.poster = data.belongs_to_collection.poster_path;
        }
    } else {
        if (randomNumber < 0.25) {
            img.back = data.belongs_to_collection.backdrop_path;
        }
    }
    return img;
}

function getOverview(overview, maxLength) {
    if (overview.length > maxLength) {
        return overview.substring(0, maxLength) + ". . .";
    } else {
        return overview;
    }
}



// 페이지 로딩 애니메이션?
(function () {
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.opacity = 0;
        document.getElementsByClassName('main-container')[0].style.display = 'block';
    }, 700)
})()



// 동적으로 생성된 요소에 스크롤이벤트
document.addEventListener('wheel', function(event) {
    const targetElement = event.target;

    if (targetElement.closest('.poster-container')) {
        event.preventDefault(); // 기본 스크롤 이벤트 막기

        const posterContainer = targetElement.closest('.poster-container');

        const scrollAmount = event.deltaY;
        posterContainer.scrollLeft += scrollAmount;

        const scrolledPercentage = (posterContainer.scrollLeft / (posterContainer.scrollWidth - posterContainer.clientWidth)) * 100;
        const progressBar = posterContainer.nextElementSibling.querySelector('.bar');
        progressBar.style.width = `${scrolledPercentage}%`;
    }
}, { passive: false });


// const posterContainer = document.querySelector('.poster-container');
// const bar = document.querySelector('.bar');

// const imgContainerWidth = document.querySelector('.poster-container .img-container').offsetWidth;
// const imgContainerCount = document.querySelectorAll('.poster-container .img-container').length;
// const posterContaienrWidth = imgContainerWidth * imgContainerCount;

// posterContainer.addEventListener('wheel', (event) => {
//     event.preventDefault(); // 기본 스크롤 이벤트 막기

//     const scrollAmount = event.deltaY; // deltaY 값에 따라 스크롤 양 결정
//     posterContainer.scrollLeft += scrollAmount; // 스크롤 이동


//     const scrollLeftPosition = posterContainer.scrollLeft;
//     const scrolledPercentage = (posterContainer.scrollLeft / (posterContainer.scrollWidth - posterContainer.clientWidth)) * 100;

//     bar.style.width = `${scrolledPercentage}%`;
// });


