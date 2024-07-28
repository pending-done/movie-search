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

// 유형별 데이터 검색키

const topRated = {name:"topRated", countryCode: null, page:1};
const genres = {name: "genres", countryCode: null, genres: null, page: 1 };
const upcoming = {name: "upcoming", countryCode: null, page:1};
const type = {topRated, genres, upcoming};


// 페이지 기본 로드
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
    // 상세데이터 생성
    console.log("상세데이터")
    console.log(data);
    type.genres.countryCode = data.origin_country[0];
    type.genres.genres = data.genres;


    createDetailElement(data);
    // 배우 데이터
    fetchActorsData(movieId, processActorsData);


    //  인기 데이터 생성
    fetchTypeMoviesData(type.topRated, (data) => {
        processMovieData(data, "최고의 작품들", "topRated")
    })

    // 곧 개봉 데이터 
    fetchTypeMoviesData(type.upcoming, (data) => {
        processMovieData(data, "밍순!", "upcoming")
    })

    // 장르 데이터
    fetchTypeMoviesData(type.genres, (data) => {
        processMovieData(data, "비슷한 장르의 작품들", "genres");
    })
}

// 유형별 데이터 처리 통합 함수 (인기, 곧 개봉, 장르)
// 화살표함수인데 왜 호이스팅이 되는가에 대해서
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
    console.log("배우데이터")
    console.log(data);
    data.forEach(data => createActorContainer(data));
}


// 다음 페이지 로드
function processNextpage(targetElement) {
    const subContainer = targetElement.closest('.sub-container');
    const typeName = Array.from(subContainer.classList)[1];

    type[typeName]['page']++;

    targetElement.closest('.poster-container');
    

    const posterContainer = targetElement.closest('.poster-container');

    fetchTypeMoviesData(type[typeName], (data) => {
        createNextPageData(data, posterContainer);
    })
}


function createNextPageData(data, posterContainer){
    data.forEach(data => {
        const imgContainer = createImgContainer(data);
        posterContainer.appendChild(imgContainer);
    });
}





/**************************************************************************************************/
/*********************************                               **********************************/
/*********************************       HTML 생성 코드뭉치       **********************************/
/*********************************                               **********************************/
/**************************************************************************************************/

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


    document.getElementById('back-img').src = IMG_URL + "original" + img.poster;

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

// 유형별 영화 목록들
function createSubContainer(header, type) {
    const subContainer = document.createElement('div');
    subContainer.classList.add('sub-container', type);
    // subContainer.className = 'sub-container';

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
    imgContainer.appendChild(link);

    return imgContainer;
}



// 배우 목록 
const baseContainer = document.querySelector('.actor');
function createActorContainer(data) {
    // actor-main-container div
    const parent = document.querySelector('.actor-main-container');

    // actor-container div 
    const actorContainer = document.createElement('div');
    actorContainer.className = 'actor-container';

    // a 
    const link = document.createElement('a');
    // link.href = `/detail/actor.html?id=${data.actorId}`;

    // img
    const imgSize = "w300";
    const img = document.createElement('img');
    img.className = 'actor-poster';
    img.id = data.id;
    img.src = IMG_URL + imgSize + data.file_path;

    // <a> ----> img 
    link.appendChild(img);

    // p 
    const p = document.createElement('p');
    p.className = 'actor-name';
    p.id = 'actorName';
    p.textContent = data.name;

    // actor-container ---->  <a>, <p> 
    actorContainer.appendChild(link);
    actorContainer.appendChild(p);

    // actor-main-container ---> actor-contaienr
    parent.appendChild(actorContainer);

}



/**************************************************************************************************/
/*********************************                               **********************************/
/*********************************      그 외 잡다구리 함수       **********************************/
/*********************************                               **********************************/
/**************************************************************************************************/


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


/**************************************************************************************************/
/*********************************                               **********************************/
/*********************************      그 외외 이벤트처리        **********************************/
/*********************************                               **********************************/
/**************************************************************************************************/

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

// 동적으로 생성된 이벤트(이벤트 위임)
// closet()에 매개변수로 선택자를 넣어주면
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


document.addEventListener('wheel', function (event) {
    const targetElement = event.target;

    if (targetElement.closest('.poster-container')) {
        event.preventDefault(); // 기본 스크롤 이벤트 막기

        // closet = 선택자를 현재 요소 기준 가장 가까운 부모에서 찾아줌 
        const posterContainer = targetElement.closest('.poster-container');

        const scrollAmount = event.deltaY;
        posterContainer.scrollLeft += scrollAmount;

        let scrolledPercentage = (posterContainer.scrollLeft / (posterContainer.scrollWidth - posterContainer.clientWidth)) * 100;

        const progressBar = posterContainer.nextElementSibling.querySelector('.bar');
        progressBar.style.width = `${scrolledPercentage}%`;

        if (scrolledPercentage === 100) {

            processNextpage(targetElement);
        }
    } else if (targetElement.closest('.actor-main-container')) {
        event.preventDefault();

        const container = targetElement.closest('.actor-main-container');
        const parent = container.closest('.section-body');
        const progress = parent.nextElementSibling;

        const scrollAmount = event.deltaY;
        container.scrollLeft += scrollAmount;

        const scrolledPercentage = (container.scrollLeft / (container.scrollWidth - container.clientWidth)) * 100;
        const progressBar = progress.querySelector('.bar');
        progressBar.style.width = `${scrolledPercentage}%`;

    }
}, { passive: false });



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