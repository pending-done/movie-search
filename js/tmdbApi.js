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
const BASE_URL = `https://api.themoviedb.org/3/discover/movie?language=ko-KR&without_genres=10749&page=1&api_key=${API_KEY}`;

// const COUNTRY_CODES = {
//     KR:'&with_origin_country=KR',
//     US: '&with_origin_country=US',
//     JP: '&with_origin_country=JP',
// }; 

const COUNTRY_CODES = ['KR', 'US', 'JP']

// const searchCriteria = {
//     countryCode: null,
//     genres: null,
//     id: null,
// }


function generateUrl(searchCriteria){

    // 영화 id값으로 조회
    if(searchCriteria.id != null){
        const movieId = searchCriteria.id;

        return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`;
    }

    if(searchCriteria.type != null){
        const type = searchCriteria.type;

        if(type == "topRated"){
            return `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ko-KR`;
        }else if(type == "upcoming"){
            return `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=ko-KR&page=1`;
        }
        
    }
    

    if(searchCriteria.countryCode !== "ALL"){
        const countryCode = searchCriteria.countryCode;
        let genres = searchCriteria.genres;

        if(genres == null){
            genres = [
                {id:null},
                {id:null},
            ]
        }

        // 일본이면 애니메이션 장르
        if(countryCode !== "JP"){
            // return  `${BASE_URL}&with_origin_country=${countryCode}&with_genres=${genres[0].id ?? ""}`.toString();
            return  `${BASE_URL}&with_origin_country=${countryCode}&with_genres=${genres[0].id ?? ""}`.toString();
        }else{
            return `${BASE_URL}&with_origin_country=${countryCode}&with_genres=16&${genres[1].id ?? ""}`.toString();
        }
    }else if(searchCriteria.countryCode === "ALL"){
        return COUNTRY_CODES.map((countryCode) => BASE_URL + '&with_origin_country=' + countryCode) //`${BASE_URL}'&with_origin_country=${code}`
    }



}

// API 데이터 가져오기 (KR, US, JP)
async function fetchData(searchCriteria, searchKey, processData) { // searchKey = 내가 입력한 문자
    try {
        const movieList = [];
        if(searchCriteria === null) alert("데이터 불러올떄 에러났음");

        if (searchCriteria.countryCode === "ALL") {
            const urlArr = generateUrl(searchCriteria);

            for(const url of urlArr){
                const data = await fetch(url).then((data) => data.json());
                movieList.push(...data.results);

            }
        } else {
            // 예외처리 (kr, us, jp 등이 아닐 경우)
            const data = await fetch(generateUrl(searchCriteria)).then((data) => data.json());

            if(data.results == null){
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
function generateDetailUrl(searchCriteria, movieId){
    /**
     * searchCriterial
     * credits: 출연진(감독)  Acting(Directing)   //'https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR'
     * images: 배우 사진 // https://api.themoviedb.org/3/person/${castId}/images
     * 
     * images: 스틸이미지?              
     * 
     * 배우 누르면 관련 영화 페이지 ?
     *  
     */

    // 크레딧 (출연진, 감독)
    if(searchCriteria.credits != null){
        return `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-kr&api_key=${API_KEY}`
    }

    // 배우 사진
    if(searchCriteria.actorId != null){
        return `https://api.themoviedb.org/3/person/${searchCriteria.actorId}/images?api_key=${API_KEY}`
    }

}

async function fetchDetail(movieId){
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`
    const data = await fetch(url).then(data => data.json());

    processDetailData(data);
}

// 상세페이지 (하단 영역 데이터)
async function fetchDetailSub(searchCriteria, movieId, processData){
    const url = generateDetailUrl(searchCriteria, movieId);

    debugger;

    const data = await fetch(url).then(data => data.json());

    processData(data);
}


// 데이터 인기순 정렬 (b.popularity - a.popularity)
function sortByPopularityDesc (data, searchKey, processData) {
    data.sort((a, b) => b.popularity - a.popularity);

    if (searchKey !== '') {
        data = searchAllData(data, searchKey);

        console.log(data);
    }
    processData(data);
}