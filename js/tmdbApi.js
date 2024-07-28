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

function generateUrl(type, { movieId = null, actorId = null, countryCode = null, genres = null, sort, page = 1 } = {}) {
    switch (type) {
        case 'topRated':
            return `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${LANGUAGE}&page=${page}`;
        case 'upcoming':
            return `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=${LANGUAGE}&page=${page}`;
        case 'genres':
            if (!genres || !countryCode || !page) throw new Error('무슨 장르 보고싶은데?');
            return `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&with_origin_country=${countryCode}&with_genres=${genres[0].id}&without_genres=${WITHOUT_GENRES}&page=${page}&sort_by=popularity.desc`;
        case 'detail':
            if (!movieId) throw new Error('Movie ID가 없다네');
            return `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${LANGUAGE}`;
        case 'byCountries':
            if (!countryCode || !genres) throw new Error('나라별 영화는 countryCode랑 genres가 필수이거늘');
            if (countryCode === "JP") return `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&with_origin_country=${countryCode}&with_genres=16&without_genres=${WITHOUT_GENRES}}&page=${page}`;
            if (countryCode !== "JP") return `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&with_origin_country=${countryCode}&with_genres=${genres[0].id}&without_genres=${WITHOUT_GENRES}}&page=${page}`
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
        case 'TV':
            if (!countryCode || !genres) throw new Error('TV 프로그램을 보려면 장르와, 나라코드');
            return `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=${LANGUAGE}&with_genres=${genres}&with_origin_country=${countryCode}&sort_by=${sort}.desc&page=${page}`;
            // if (!countryCode) throw new Error('TV 애니메이션 목록을 보려면 ...');
        default:
            throw new Error('url 어딘가 에러');
    }
}


/********************************* 메인 페이지 **********************************/
// 전체 국가
async function fetchAllMoviesData(searchKey, callback) {
    const urlArr = generateUrl("ALL", { countryCode: "ALL", genres: DUMMY_GENRES });
    const movieList = [];

    for (const url of urlArr) {
        const data = await fetch(url).then((data) => data.json());
        movieList.push(...data.results);
    }

    sortByPopularityDesc(movieList, searchKey, callback);
}


// 나라별
async function fetchMoviesByCountry(countryConfig, callback) {
    let url;
    const countryCode = countryConfig.countryCode;
    const page = countryConfig.page;

    if (countryCode === "JP") {
        url = generateUrl("byCountries", { countryCode, genres: DUMMY_GENRES, page });
    } else {

        url = generateUrl("byCountries", { countryCode, genres: DUMMY_GENRES, page });
    }

    const data = await fetch(url).then((data) => data.json());

    callback([...data.results]);
};

// 전체 데이터 인기순 정렬
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



/********************************** 상세페이지 **********************************/
// TV 프로그램
async function fetchTVData(searchCriteria, callback) {
    let data;
    const countryCode = searchCriteria.countryCode;
    const genres = searchCriteria.genres;
    const page = searchCriteria.page;
    let sort = "popularity";


    if (countryCode === "JP") {
        const url = generateUrl("TV", { countryCode, genres, page,  sort});
        data = await fetch(url).then((data) => data.json());
    } else if (countryCode === "KR") {
        const url = generateUrl("TV", { countryCode, genres, page, sort});
        data = await fetch(url).then((data) => data.json());
    } else if (countryCode === "US") {
        sort = "vote_count";
        const url = generateUrl("TV", { countryCode, genres, page, sort});
        data = await fetch(url).then((data) => data.json());
    }


    data = setTitleOfTvData([...data.results]);

    callback(data);
}

function setTitleOfTvData(data){
    data.forEach(item => {
        item.title = item.name;
    })

    return data;
}



// 유형별 (인기, 장르, 곧 개봉 등)
async function fetchTypeMoviesData(searchCriteria, callback) {
    let data;

    if (searchCriteria.name === "topRated") {
        const page = searchCriteria.page;
        const url = generateUrl("topRated", { page });
        data = await fetch(url).then((data) => data.json());
    } else if (searchCriteria.name === "genres") {
        const countryCode = searchCriteria.countryCode;
        const genres = searchCriteria.genres;
        const page = searchCriteria.page;
        const url = generateUrl("genres", { countryCode, genres, page })
        data = await fetch(url).then((data) => data.json());
    } else if (searchCriteria.name === "upcoming") {
        const page = searchCriteria.page;
        const url = generateUrl("upcoming", { page });
        data = await fetch(url).then((data) => data.json());
    }

    callback([...data.results]);
}


// 영화 상세정보(단일데이터)
async function fetchDetailMovieData(movieId, processMovieData) {
    //  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`;
    const url = generateUrl("detail", { movieId });
    const data = await fetch(url).then(data => data.json());

    processMovieData(data);
}


// 출연진, 배우사진
async function fetchActorsData(movieId, callback) {

    const url = generateUrl("credit", { movieId });

    const credits = await fetch(url).then(data => data.json());

    let actors = credits.cast.map(({ id, name, file_path }) => ({ id, name, file_path })).slice(0, 15);

    // 기존 직렬? 로 처리되던 await fetcah(...) 을 Promise.all()을 사용해서 병렬 처리함  
    // map(async actor => {...}) : async키워드를 주게되면 항상 promsie를 반환함
    // fetchActorImgs는 [promise, promise ...]와 같은 형태의 데이터로 이루어지게 되고
    // Promise.all()을 하면 저런 배열형태의 promise를 전부 처리해줌
    const fetchActorImgs = actors.map(async (actor) => {
        const url = generateUrl("actorImg", { actorId: actor.id });
        const response = await fetch(url);
        const data = await response.json();


        if (data.profiles.length === 0) {
            return actor;
        }

        actor.file_path = data.profiles[0].file_path;

        return actor;
    });


    const results = await Promise.all(fetchActorImgs);


    callback(results);
}

