const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id'); // 'id'에 해당하는 Query Parameter 값 가져오기
const IMG_URL = "https://image.tmdb.org/t/p/original";
console.log(`Loading details for movie ID ${movieId}`);



// 전체 영화 가져올일 있을때 사용
const processData = (data) => {
    searchMovieId(data);
}

// 영화 id로 필터링 (쓸일없을듯)
function searchMovieId(data) {
}

function processDetailData(data) {
    createDetailElement(data);
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


// fetchData("", "", processData);
fetchDetail(movieId);


// 페이지 로딩 애니메이션?
(function () {
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.opacity = 0;
        document.getElementsByClassName('main-container')[0].style.display = 'block';
    }, 700)
})()

// window.onload = function () {

// };




const posterContainer = document.querySelector('.poster-container');
const bar = document.querySelector('.bar');

const imgContainerWidth = document.querySelector('.poster-container .img-container').offsetWidth;
const imgContainerCount = document.querySelectorAll('.poster-container .img-container').length;
const posterContaienrWidth = imgContainerWidth * imgContainerCount;

posterContainer.addEventListener('wheel', (event) => {
    event.preventDefault(); // 기본 스크롤 이벤트 막기

    const scrollAmount = event.deltaY; // deltaY 값에 따라 스크롤 양 결정
    posterContainer.scrollLeft += scrollAmount; // 스크롤 이동

    const scrollLeftPosition = posterContainer.scrollLeft;


    // 스크롤된 비율을 계산
    // const scrolledPercentage = (scrollLeftPosition / (posterContaienrWidth)) * 100;
    const scrolledPercentage = (posterContainer.scrollLeft / (posterContainer.scrollWidth - posterContainer.clientWidth)) * 100;

    // 프로그레스 바의 너비를 스크롤 비율에 따라 조정
    bar.style.width = `${scrolledPercentage}%`;
});


