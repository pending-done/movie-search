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
    { id: '' },
    { id: '' },
]


function generateUrl(type, { movieId = null, actorId = null, countryCode = null, genres = null } = {}){
    switch (type) {
        case 'topRated':
            return `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${LANGUAGE}`;
        case 'upcoming':
            return `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=${LANGUAGE}`;
        case 'genres':
            if(!genres || !countryCode) throw new Error('무슨 장르 보고싶은데?');
            return `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&with_origin_country=${countryCode}&with_genres=${genres[0].id}&without_genres=${WITHOUT_GENRES}`;
        case 'detail':
            if (!movieId) throw new Error('Movie ID가 없다네');
            return `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${LANGUAGE}`;
        case 'byCountries':
            if (!countryCode || !genres) throw new Error('나라별 영화는 countryCode랑 genres가 필수이거늘');
            if (countryCode === "JP") return `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&with_origin_country=${countryCode}&with_genres=16&without_genres=${WITHOUT_GENRES}`;
            if (countryCode !== "JP") return `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&with_origin_country=${countryCode}&with_genres=${genres[0].id}&without_genres=${WITHOUT_GENRES}`
        case 'credit':
            if (!movieId) throw new Error('출연진을 보려면 movie ID를 넣어야지');
            return `${BASE_URL}/movie/${movieId}/credits?language=${LANGUAGE}&api_key=${API_KEY}`;
        case 'actorImg':
            if (!actorId) throw new Error('배우사진을 보려면 actor ID를 넣어야지');
            return `${BASE_URL}/person/${actorId}/images?api_key=${API_KEY}`;
        case 'ALL':
            if (!countryCode) throw new Error('전체영화 목록을 보려면 countryCode를 잊지마');
            return COUNTRY_CODES.map((code) => {
                if (code === "JP") return `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&with_origin_country=${code}&with_genres=16&without_genres=${WITHOUT_GENRES}`;
                return `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&with_origin_country=${code}&with_genres=${genres[0].id}&without_genres=${WITHOUT_GENRES}`;
            });
        default:
            throw new Error('url 어딘가 에러');
    }
}


/********************** 메인 페이지 ***********************/

// 나라별
async function fetchMoviesByCountry(countryCode, callback){
    let url;

    if(countryCode === "JP"){
        // url =  getJapaneseMoviesUrl(countryCode, DUMMY_GENRES);
        url =  generateUrl("byCountries", {countryCode, genres:DUMMY_GENRES});
    }else{
        url = generateUrl("byCountries", {countryCode, genres:DUMMY_GENRES});
    }

    const data = await fetch(url).then((data) => data.json());
    callback([...data.results]);
};

// 전체 국가
async function fetchAllMoviesData(searchKey, callback){
    const urlArr = generateUrl("ALL", {countryCode:"ALL", genres:DUMMY_GENRES});
    const movieList = [];

    for (const url of urlArr) {
        const data = await fetch(url).then((data) => data.json());
        movieList.push(...data.results);
    }

    sortByPopularityDesc(movieList, searchKey, callback);
}


/******************** 상세페이지 *********************/
// 유형별 (인기, 장르, 곧 개봉 등)
async function fetchTypeMoviesData(searchCriteria, callback){
    let data;
    if(searchCriteria.type === "topRated"){
        const url = generateUrl("topRated");
        data = await fetch(url).then((data) => data.json());
    }else if(searchCriteria.type === "genres"){
        const countryCode = searchCriteria.countryCode;
        const genres = searchCriteria.genres;
        const url = generateUrl("genres",{countryCode, genres} )
        data = await fetch(url).then((data) => data.json());
    }else if(searchCriteria.type === "upcoming"){
        const url = generateUrl("upcoming");
        data =  await fetch(url).then((data) => data.json());
    }

    callback([...data.results]);
}


// 영화 상세정보(단일데이터)
async function fetchDetailMovieData(movieId, processMovieData){
    //  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`;
     const url = generateUrl("detail", {movieId});
     const data = await fetch(url).then(data => data.json());

     processMovieData(data);
}


// 배우, 배우사진
async function fetchActorsData(movieId, callback) {
    const url = getMovieCreditsUrl(movieId);

    const res = await fetch(url).then(data => data.json());
    
    // 배우 정보를 15 index까지 저장
    // 부족할 경우 마지막 index 체크해서
    // 다시 slice
    let actors = res.cast.map(({ id, name, file_path }) => ({ id, name, file_path })).slice(0, 15);
    let sliceIndex = 0;
    let shouldSliceArray = false;
    for (const actor of actors) {
        const url = getActorImagesUrl(actor.id);
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

    callback(actors);
}


// 데이터 인기순 정렬 (b.popularity - a.popularity)
function sortByPopularityDesc(data, searchKey, callback) {
    data.sort((a, b) => b.popularity - a.popularity);

    if (searchKey !== '') {
        data = searchAllData(data, searchKey);
    }
    callback(data);
}

// 데이터 검색  (공백제거, 특문제거, 대문자 치환 => 초성검색)
function searchAllData(data, searchKey) {

    // 타이틀의 공백, 특수문자를 제거하고, 검색을합니다.
    return data.filter((value) => {
        const title = value.title.replace(/ /g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/g, '');
        return H.includesByCho(searchKey.toUpperCase(), title.toUpperCase())
    })
}
