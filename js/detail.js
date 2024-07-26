const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id'); // 'id'에 해당하는 Query Parameter 값 가져오기
// const IMG_URL = "https://image.tmdb.org/t/p/original";
const IMG_URL = "https://image.tmdb.org/t/p/";
console.log(`Loading details for movie ID ${movieId}`);

// 페이지 기본 로드
// fetchData({ id: movieId }, "", processDetailData);

fetchDetailMovieData(movieId, (data) => {
    processDetailMovieData(data);
});

// 전체 영화 가져올일 있을때 사용
const processData = (data) => {
    searchMovieId(data);
}

// 영화 id로 필터링 (쓸일없을듯)
function searchMovieId(data) {
}


function processDetailMovieData(data) {
    console.log(data);

    // 상세 데이터 생성
    createDetailElement(data);

    // 인기순
    const topRated = { type: "topRated", genres: data.genres };
    const genres = { type:"genres", countryCode: data.origin_country[0], genres: data.genres };
    const upcoming = {type: "upcoming", genres: data.genres};

    //  인기 데이터 생성
    fetchTypeMoviesData(topRated, (data) => {
        processMovieData(data, "최고의 작품들")
    })

    fetchTypeMoviesData(upcoming, (data) => {
        processMovieData(data, "밍순!")
    })
    // 장르 데이터
    fetchTypeMoviesData(genres, (data) => {
        processMovieData(data, "비슷한 장르의 작품들")
    })

    // 출연진 데이터
    fetchActors({ credits: " " }, movieId, processActorData);


}

const processMovieData = (data, text) => {
    const subContainer = createSubContainer(text);

    data.forEach(data => {
        const imgContainer = createImgContainer(data);
        const posterContainer = subContainer.querySelector('.poster-container');
        posterContainer.appendChild(imgContainer);
    });

    baseContainer.insertAdjacentElement('afterend', subContainer);
}





const processActorData = (data) => {

    console.log(data);

    data.forEach(data => createActorContainer(data));
}

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

    

    // return actorContainer;
}




// 배우 
const baseContainer = document.querySelector('.actor');



function createImgContainer(data) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';

    const link = document.createElement('a');
    link.href = `/detail/detail.html?id=${data.id}`;

    const imgSize = "w780"
    const img = document.createElement('img');
    img.className = 'sub-poster';
    img.src = IMG_URL + imgSize + data.poster_path;
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
    const backSize = "w1280";
    const posterSize = "w780"
    document.getElementById('backPosterImg').src = IMG_URL + backSize + img.back;
    document.getElementById('moviePosterImg').src = IMG_URL + posterSize + img.poster;

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
            // img.poster = data.belongs_to_collection.poster_path;
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
document.addEventListener('wheel', function (event) {
    const targetElement = event.target;

    if (targetElement.closest('.poster-container')) {
        event.preventDefault(); // 기본 스크롤 이벤트 막기

        // closet = 선택자를 현재 요소 기준 가장 가까운 부모에서 찾아줌 
        const posterContainer = targetElement.closest('.poster-container');

        const scrollAmount = event.deltaY;
        posterContainer.scrollLeft += scrollAmount;

        const scrolledPercentage = (posterContainer.scrollLeft / (posterContainer.scrollWidth - posterContainer.clientWidth)) * 100;
        const progressBar = posterContainer.nextElementSibling.querySelector('.bar');
        progressBar.style.width = `${scrolledPercentage}%`;
    }else if(targetElement.closest('.actor-main-container')){
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


