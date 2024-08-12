const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id'); // 'id'에 해당하는 Query Parameter 값 가져오기
console.log(`movie ID ${movieId}`);

// const IMG_URL = "https://image.tmdb.org/t/p/original";
const IMG_URL = "https://image.tmdb.org/t/p/";
const ORIGIN_COUNTRY_CODE = {
    'US': '미국',
    'JP': '일본',
    'KR': '한국',
    'UK': '영국'
}

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

// 영화 상세정보
function createDetailElement(data) {
    const img = getRandomImg(data);
    const overview = getOverview(data.overview, 200);

    const country = ORIGIN_COUNTRY_CODE[data.origin_country];
    let title2 = "";
    if (data.original_title === data.title) {
        title2 = data.tagline ?? "";
    } else {
        title2 = data.original_title;
    }

    // document.getElementById('back-img').src = IMG_URL + "original" + img.poster;
    document.getElementById('back').style.backgroundImage = `url(${IMG_URL + "original" + img.poster})`;

    // 이미지 속성 변경
    const backSize = "w1280";
    const posterSize = "w780"
    document.getElementById('backPosterImg').src = IMG_URL + backSize + img.back;
    document.getElementById('moviePosterImg').src = IMG_URL + posterSize + img.poster;

    // 텍스트 변경
    document.getElementById('detailGenres02').textContent = data.genres.map((v) => v.name).join(', '); // 장르 배열을 콤마로 구분된 문자열로 설정
    document.getElementById('detailSummary01').textContent = data.tagline;
    document.getElementById('detailSummary02').textContent = overview // overview 문자열의 첫 30자만 표시
    document.getElementById('detailCountry02').textContent = country;
    document.getElementById('detailTitle01').textContent = data.title;
    document.getElementById('detailTitle02').textContent = title2;
    document.getElementById("detailDate02").textContent = data.release_date;
}

// 유형별 영화 목록들 (장르, 곧 개봉, 명작 등 ..)
function createSubContainer(header, type) {
    const subContainer = document.createElement('div');
    subContainer.classList.add('sub-container', type);

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

function createImgContainer(data) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';

    const link = document.createElement('a');
    link.href = `../detail/detail.html?id=${data.id}`;

    const imgSize = "w780"
    const img = document.createElement('img');
    img.className = 'sub-poster';
    img.src = IMG_URL + imgSize + data.poster_path;
    img.alt = 'Movie Poster';

    link.appendChild(img);

    const p = document.createElement('p');
    p.className = 'content-title';
    p.id = 'contentTitle';
    p.textContent = data.title;

    imgContainer.appendChild(link);
    imgContainer.appendChild(p);
    return imgContainer;
}

// 배우 목록 
const baseContainer = document.querySelector('.actor');
function createActorContainer(data) {
    const parent = document.querySelector('.actor-main-container');

    const actorContainer = document.createElement('div');
    actorContainer.className = 'actor-container';

    const link = document.createElement('a');
    const imgSize = "w300";
    const img = document.createElement('img');
    img.className = 'actor-poster';
    img.id = data.id;
    img.src = IMG_URL + imgSize + data.file_path;
    link.appendChild(img);

    const p = document.createElement('p');
    p.className = 'actor-name';
    p.id = 'actorName';
    p.textContent = data.name;

    actorContainer.appendChild(link);
    actorContainer.appendChild(p);

    parent.appendChild(actorContainer);
}


/**************************************************************************************************/
/*********************************                               **********************************/
/*********************************      그 외 잡다구리 함수       **********************************/
/*********************************                               **********************************/
/**************************************************************************************************/

// 다음 페이지 로드
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
            bar = nextElement.querySelector('.bar');
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