import {
    fetchTVData,
    fetchTypeMoviesData,
    fetchDetailMovieData,
    fetchActorsData,
} from './tmdbApi.js'

import render from './render.js'

const {
    createSubContainer,
    createImgContainer,
    createActorContainer,
    createDetailElement,
} = render;

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
console.log(`movie ID ${movieId}`);


// 유형별 데이터 검색키 (장르, 곧 개봉, 명작 ...)
const genres = { name: "genres", countryCode: null, genres: null, page: 1 };
const upcoming = { name: "upcoming", countryCode: null, page: 1 };
const topRated = { name: "topRated", countryCode: null, page: 1 };
const type = { topRated, genres, upcoming };


// TV 프로그램
const KR = { countryCode: "KR", genres: 18, page: 1 };
const JP = { countryCode: "JP", genres: 16, page: 1 };
const US = { countryCode: "US", genres: 18, page: 1 };
const tvConfig = { KR, JP, US };
let detailCountry; // 영화의 발매국가 전역변수

// 페이지 기본 로드 (이미지 로드 될때까지 로딩 아이콘 표시)
fetchDetailMovieData(movieId, (data) => {
    processDetailMovieData(data);
}).then(() => {
    onImagesLoaded(() => {
        document.getElementById('loadingOverlay').style.opacity = 0;
        document.getElementsByClassName('main-container')[0].style.display = 'block';
    });
});;

// 영화 상세정보
function processDetailMovieData(data) {
    detailCountry = data.origin_country[0];
    type.genres.countryCode = detailCountry;
    type.genres.genres = data.genres;
    type.topRated.countryCode = detailCountry;

    let headerTitle;

    if (detailCountry == "JP") {
        headerTitle = "일본의 인기 애니메이션"
    } else if (detailCountry == "KR") {
        headerTitle = "한국의 인기 드라마"
    } else {
        headerTitle = "명작 미드"
    }

    // 상세데이터 생성
    createDetailElement(data);
    // 배우 데이터
    fetchActorsData(movieId, processActorsData);
    //  인기 데이터 생성
    fetchTypeMoviesData(type.topRated, (data) => {
        processMovieData(data, "최고의 작품들", "topRated") // 얘가 먼저 실행되었따는 개념이 아님
    });
    // 곧 개봉 데이터 
    fetchTypeMoviesData(type.upcoming, (data) => {
        processMovieData(data, "밍순!", "upcoming")
    });
    // 장르 데이터
    fetchTypeMoviesData(type.genres, (data) => {
        processMovieData(data, "비슷한 장르의 작품들", "genres");
    });
    // TV 데이터
    fetchTVData(tvConfig[detailCountry], (data) => {
        processMovieData(data, headerTitle, "tv-show");
    });
}

const baseContainer = document.querySelector('.actor');

// 유형별 데이터 처리 통합 함수 (인기, 곧 개봉, 장르)
const processMovieData = (data, text, type) => {
    const subContainer = createSubContainer(text, type);

    data.forEach(data => {
        const imgContainer = createImgContainer(data);
        const posterContainer = subContainer.querySelector('.poster-container');
        posterContainer.appendChild(imgContainer);
    });

    baseContainer.insertAdjacentElement('afterend', subContainer);
}

// 배우 데이터 처리 함수
const processActorsData = (data) => {
    data.forEach(data => createActorContainer(data));
}


function processNextpage(targetElement) {
    const subContainer = targetElement.closest('.sub-container');
    const typeName = Array.from(subContainer.classList)[1];
    targetElement.closest('.poster-container');
    const posterContainer = targetElement.closest('.poster-container');

    if (typeName == "tv-show") {
        tvConfig[detailCountry]['page']++;

        fetchTVData(tvConfig[detailCountry], (data) => {
            createNextPageData(data, posterContainer);
        })

    } else {
        type[typeName]['page']++;

        fetchTypeMoviesData(type[typeName], (data) => {
            createNextPageData(data, posterContainer);
        })
    }
}

function createNextPageData(data, posterContainer) {
    data.forEach(data => {
        const imgContainer = createImgContainer(data);
        posterContainer.appendChild(imgContainer);
    });
}



// (1) 마우스올리면 프로그레스바 색상 변경 이벤트 

// 동적으로 생성된 이벤트(이벤트 위임)
// closest()에 매개변수로 선택자를 넣어주면
// 호출한 요소 자신을 포함하여, 해당 요소의 조상 요소들 중에서 가장 가까운 요소(선택자)를 찾음
// 없으면 null, 본인이 해당하면 본인 반환
// 결론: .bar의 형제 요소를 closet()으로 찾고 nextElementSibling로 형제요소(.bar)에 대한 DOM을 가져오는 것
// closet()이 쓰인 이유: bar 찾으려고 (bar는 작으니까.. 거기에 hover를 줄 순 없으니까.. ,
//  그리고 동적 생성 요소라 document(전체요소?)에게 mousever 이벤트를 주고 내가 원하는 요소인 조건에만 
// 실행되게하려면 대충 이렇게 해야된다더라
document.addEventListener('mouseover', function (event) {
    const targetElement = event.target;

    if (targetElement.closest('.poster-container')) {
        event.preventDefault();
        changeColorOfProgressBar(targetElement, '.poster-container', '#ff0000');

    } else if (targetElement.closest('.section-body')) {
        changeColorOfProgressBar(targetElement, '.section-body', '#ff0000');
    }
}, { passive: false });


document.addEventListener('mouseout', function (event) {
    const targetElement = event.target;

    if (targetElement.closest('.poster-container')) {
        event.preventDefault();

        changeColorOfProgressBar(targetElement, '.poster-container', '#efb33b');
    } else if (targetElement.closest('.section-body')) {
        changeColorOfProgressBar(targetElement, '.section-body', '#efb33b');
    }
}, { passive: false });


function changeColorOfProgressBar(targetElement, className, colorCode) {
    const element = targetElement.closest(className);
    if (element) {
        const nextElement = element.nextElementSibling;
        if (nextElement) {
            const bar = nextElement.querySelector('.bar');
            if (bar) {
                bar.style.backgroundColor = colorCode;
            }
        }
    }
}


// (2) 스크롤시 프로그레스바 너비 변경 이벤트
document.addEventListener('wheel', function (event) {
    const targetElement = event.target;

    if (targetElement.closest('.poster-container')) {
        event.preventDefault(); // 기본 스크롤 이벤트 막기
        handleScroll(event, ".poster-container");
    } else if (targetElement.closest('.actor-main-container')) {
        event.preventDefault();
        handleScroll(event, ".actor-main-container");
    }
}, { passive: false });

function handleScroll(event, containerSelector) {
    const targetElement = event.target;

    const container = targetElement.closest(containerSelector);
    let parent;
    let progressBar;

    if (containerSelector === '.actor-main-container') {
        parent = container.closest('.section-body');
        progressBar = parent.nextElementSibling.querySelector('.bar');
    } else {
        progressBar = container.nextElementSibling.querySelector('.bar');
    }

    const scrollAmount = event.deltaY;
    container.scrollLeft += scrollAmount;

    let scrolledPercentage = (container.scrollLeft / (container.scrollWidth - container.clientWidth)) * 100;
    progressBar.style.width = `${scrolledPercentage}%`;


    if (scrolledPercentage === 100 && containerSelector === '.poster-container') {
        processNextpage(targetElement);
    }
}


// 이미지들이 전부 로드 되었는지 확인
function onImagesLoaded(callback) {
    const images = document.querySelectorAll('img');

    if (images.length === 0) {
        callback();
        return;
    }

    let loadedCount = 0;

    images.forEach((image) => {
        if (image.complete) {   // image가 이미 로드완료된 상태라면
            loadedCount++;
            if (loadedCount === images.length) {
                callback();
            }
        } else {
            image.addEventListener('load', () => {  // 로드되지 않은 image가 load되면
                loadedCount++;
                if (loadedCount === images.length) {
                    callback();
                }
            });
        }
    });
}