// 1997
// 5cbcc190dfddff747f1a38eea2f7b053
// 1. fetch('https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=30', options)
//  => 최고 평점 순 (다른 데이터 요청 방법 못찾음)
// 2. fetch('https://api.themoviedb.org/3/discover/movie?api_key=5cbcc190dfddff747f1a38eea2f7b053&with_origin_country=KR&page=1&language=ko-KR&without_genres=10749', options)  
// => 인기순, 제작 국가별(KR,US,JP), 언어(KR번역), genre_ids [10749] : 성인컨텐츠 (안가져옴)

// 'https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR' 
// => 영화 상세 정보 

/**
 * 메인페이지, 상세페이지 공통 코드
 * api 연결 -> 데이터 병합 -> 데이터 정렬 -> 메인 or 상세 데이터 전달
 */


// API 선언
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Y2JjYzE5MGRmZGRmZjc0N2YxYTM4ZWVhMmY3YjA1MyIsIm5iZiI6MTcyMTYzNDM2MC43OTA1ODUsInN1YiI6IjY2OWUwYzQ1MjJiNmYzMmEwMGE2ZTkyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BvuzMJA_8kMTzwVp93l82e12hn6a8eO2QZospBgZtCk'
    }
};

const API_KEY = '5cbcc190dfddff747f1a38eea2f7b053';
const BASE_URL = `https://api.themoviedb.org/3/discover/movie?language=ko-KR&without_genres=10749&page=1&api_key=${API_KEY}&with_origin_country=`;
const COUNTRY_CODES = ["KR", "US", "JP"];   //enum 

function getUrl(countryCode){
    if(countryCode === "JP"){
        return BASE_URL + countryCode + "&with_genres=16";
    }
    return BASE_URL + countryCode;
}

// API 데이터 가져오기 (KR, US, JP)
async function fetchData(countryCode, searchKey, processData) { // searchKey = 내가 입력한 문자
    try {
        if (countryCode === "ALL") {
            // 유지보수 문제 생길수있음
            const data1 = await fetch(getUrl("KR")).then((data) => data.json());
            const data2 = await fetch(getUrl("US")).then((data) => data.json());
            const data3 = await fetch(getUrl("JP")).then((data) => data.json());

            const movieList = [...data1.results, ...data2.results, ...data3.results];

            mergeAllData(movieList, searchKey, processData);
        } else {
            // 예외처리 (kr, us, jp 등이 아닐 경우)
            const res = await fetch(getUrl(countryCode));
            
            data = await res.json();
            sortByPopularityDesc([...data.results], searchKey, processData);
        }
    } catch (e) {
        console.error(e);
    }
}

// 영화 상세정보
async function fetchDetail(movieId){
    const DETAIL_URL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`
    const data = await fetch(DETAIL_URL).then(data => data.json());

    processDetailData(data);
}

// 전체 데이터 병합 (KR + US + JP to All Data)
function mergeAllData(data, searchKey, processData) {
    sortByPopularityDesc(data, searchKey, processData);
}

// 데이터 인기순 정렬 (b.popularity - a.popularity)
function sortByPopularityDesc (data, searchKey, processData) {
    data.sort((a, b) => b.popularity - a.popularity);

    if (searchKey !== "") {
        data = searchAllData(data, searchKey);

        console.log(data);
    }
    // processData(data);
    processData(data);
}