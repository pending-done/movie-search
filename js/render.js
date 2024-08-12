import constants from "./constants.js";

// 영화 상세정보
function createDetailElement(data) {
    const img = getRandomImg(data);
    const overview = getOverview(data.overview, 200);

    const country = constants.ORIGIN_COUNTRY_CODE[data.origin_country];
    if (data.original_title === data.title) {
        data.title2 = data.tagline ?? "";
    } else {
        data.title2 = data.original_title;
    }

    // document.getElementById('back-img').src = IMG_URL + "original" + img.poster;
    document.getElementById('back').style.backgroundImage = `url(${constants.IMG_URL + "original" + img.poster})`;

    // 이미지 속성 변경
    const backSize = "w1280";
    const posterSize = "w780"
    document.getElementById('backPosterImg').src = constants.IMG_URL + backSize + img.back;
    document.getElementById('moviePosterImg').src = constants.IMG_URL + posterSize + img.poster;

    // 텍스트 변경
    document.getElementById('detailGenres02').textContent = data.genres.map((v) => v.name).join(', '); // 장르 배열을 콤마로 구분된 문자열로 설정
    document.getElementById('detailSummary01').textContent = data.tagline;
    document.getElementById('detailSummary02').textContent = overview // overview 문자열의 첫 30자만 표시
    document.getElementById('detailCountry02').textContent = country;
    document.getElementById('detailTitle01').textContent = data.title;
    document.getElementById('detailTitle02').textContent = data.title2;
    document.getElementById("detailDate02").textContent = data.release_date;
}

function getOverview(overview, maxLength) {
    if (overview.length > maxLength) {
        return overview.substring(0, maxLength) + ". . .";
    } else {
        return overview;
    }
}
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
    img.src = constants.IMG_URL + imgSize + data.poster_path;
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

function createActorContainer(data) {
    const parent = document.querySelector('.actor-main-container');

    const actorContainer = document.createElement('div');
    actorContainer.className = 'actor-container';

    const link = document.createElement('a');
    const imgSize = "w300";
    const img = document.createElement('img');
    img.className = 'actor-poster';
    img.id = data.id;
    img.src = constants.IMG_URL + imgSize + data.file_path;
    link.appendChild(img);

    const p = document.createElement('p');
    p.className = 'actor-name';
    p.id = 'actorName';
    p.textContent = data.name;

    actorContainer.appendChild(link);
    actorContainer.appendChild(p);

    parent.appendChild(actorContainer);
}

export default {
    createSubContainer,
    createImgContainer,
    createActorContainer,
    createDetailElement
}