

// API 선언
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Y2JjYzE5MGRmZGRmZjc0N2YxYTM4ZWVhMmY3YjA1MyIsIm5iZiI6MTcyMTYzNDM2MC43OTA1ODUsInN1YiI6IjY2OWUwYzQ1MjJiNmYzMmEwMGE2ZTkyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BvuzMJA_8kMTzwVp93l82e12hn6a8eO2QZospBgZtCk'
    }
};

const API_KEY = '5cbcc190dfddff747f1a38eea2f7b053';
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'ko-KR';
const WITHOUT_GENRES = '10749';
const COUNTRY_CODES = ['KR', 'US', 'JP']
const DUMMY_GENRES = [
    { id: null },
    { id: null },
]

// 최고 평점 영화
const TOP_RATED_MOVIES_URL = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${LANGUAGE}`;
// 곧 개봉 예정 영화
const UPCOMING_MOVIES_URL = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=${LANGUAGE}`;



// 영화 ID로 조회하는 주소
const getMovieDetailsUrl = (movieId) => `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${LANGUAGE}`;

// 일본 영화 정보 (기본 장르 및 국가 코드)
const getJapaneseMoviesUrl = (countryCode, genres) => `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&with_origin_country=${countryCode}&with_genres=16`;

// 다른 나라별 영화 정보 (기본 장르 및 국가 코드)
const getOtherCountryMoviesUrl = (countryCode, genres) => `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&with_origin_country=${countryCode}&${genres[0].id}`;

// 출연진
const getMovieCreditsUrl = (movieId) => `${BASE_URL}/movie/${movieId}/credits?language=${LANGUAGE}&api_key=${API_KEY}`;

// 배우 사진
const getActorImagesUrl = (actorId) => `${BASE_URL}/person/${actorId}/images?api_key=${API_KEY}`;

// 전체 국가 COUNTRY_CODES에 있는 국가 url 배열로 반환 
const getAllCountryMovies = (countryCode) => {
    return COUNTRY_CODES.map((code) => {
        if (code === "JP") return getJapaneseMoviesUrl(code, "16");
        if (code !== "JP") return getOtherCountryMoviesUrl(code, DUMMY_GENRES);
    })
};


function getUrl(searchCriteria) {

    // 영화 id값으로 조회
    if (searchCriteria.id != null) {
        const movieId = searchCriteria.id;

        return getMovieDetailsUrl(movieId);
    }

    // 메뉴별 조회 (전체, 한국, 일본, 미국)
    if (searchCriteria.countryCode === "ALL") {

        return COUNTRY_CODES.map((countryCode) => getAllCountryMovies());

    } else if (searchCriteria.countryCode !== "ALL") {

        const countryCode = searchCriteria.countryCode;

        // 일본이면 애니메이션 장르
        if (countryCode === "JP") {
            return getJapaneseMoviesUrl(countryCode, DUMMY_GENRES);
        } else {
            return getOtherCountryMoviesUrl(countryCode, DUMMY_GENRES);
        }
    }
}


// API 데이터 가져오기 (KR, US, JP)
async function fetchData(searchCriteria, searchKey, processData) { // searchKey = 내가 입력한 문자
    try {
        const movieList = [];
        if (searchCriteria === null) alert("데이터 불러올떄 에러났음");

        console.log(searchCriteria.countryCode);

        if (searchCriteria.countryCode === "ALL") {
            const urlArr = getAllCountryMovies(searchCriteria.countryCode);

            for (const url of urlArr) {
                const data = await fetch(url).then((data) => data.json());
                movieList.push(...data.results);
            }
        } else {
            // const data = await fetch(getUrl(searchCriteria)).then((data) => data.json());
            const data = await fetch(getUrl(searchCriteria)).then((data) => data.json());

            if (data.results == null) {
                processData(data);  // 상세 정보 (단일)
                return;
            }
            movieList.push(...data.results);
        }

        sortByPopularityDesc(movieList, searchKey, processData);
    } catch (e) {
        console.error(e);
    }
}


// 영화 상세정보 (movieID)
function generateActorUrl(searchCriteria, movieId) {
    // 크레딧 (출연진, 감독)
    if (searchCriteria.credits != null) {
        return `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-kr&api_key=${API_KEY}`
    }

    // 배우 사진
    if (searchCriteria.actorId != null) {
        return `https://api.themoviedb.org/3/person/${searchCriteria.actorId}/images?api_key=${API_KEY}`
    }
}

// 유형별 (인기, 장르, 곧 개봉 등)
async function fetchTypeMoviesData(searchCriteria, callback){
    let data;
    if(searchCriteria.type === "topRated"){
        const url = TOP_RATED_MOVIES_URL;
        data = await fetch(url).then((data) => data.json());
    }else if(searchCriteria.type === "genres"){
        const url = getOtherCountryMoviesUrl(searchCriteria.countryCode, searchCriteria.genres);
        data = await fetch(url).then((data) => data.json());
    }else if(searchCriteria.type === "upcoming"){
        const url = UPCOMING_MOVIES_URL;
        data =  await fetch(url).then((data) => data.json());
    }

    callback([...data.results]);
}



async function fetchDetailMovieData(movieId, processMovieData){
     const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`;
     const data = await fetch(url).then(data => data.json());

     processMovieData(data);
}



// 상세페이지 ((배우, 배우사진))
async function fetchActors(searchCriteria, movieId, processData) {
    const url = generateActorUrl(searchCriteria, movieId);

    const res = await fetch(url).then(data => data.json());
    let actors = res.cast.map(({ id, name, file_path }) => ({ id, name, file_path })).slice(0, 15);

    let sliceIndex = 0;
    let shouldSliceArray = false;
    for (const actor of actors) {
        const url = generateActorUrl({ actorId: actor.id });
        const data = await fetch(url).then(data => data.json());

        // 배우 상세정보가 없을때
        if (!Array.isArray(data.profiles) || data.profiles.length === 0) {
            shouldSliceArray = true;
            break;
        }

        actor.file_path = data.profiles[0].file_path;
        sliceIndex++;
    }

    if (shouldSliceArray) {
        actors = actors.slice(0, sliceIndex);
    }


    processData(actors);
}


// 데이터 인기순 정렬 (b.popularity - a.popularity)
function sortByPopularityDesc(data, searchKey, processData) {
    data.sort((a, b) => b.popularity - a.popularity);

    if (searchKey !== '') {
        data = searchAllData(data, searchKey);

        console.log(data);
    }
    processData(data);
}