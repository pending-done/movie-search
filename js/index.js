// 1997
// 5cbcc190dfddff747f1a38eea2f7b053
// 1. fetch('https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=30', options)
//  => 최고 평점 순 (다른 데이터 요청 방법 못찾음)
// 2. fetch('https://api.themoviedb.org/3/discover/movie?api_key=5cbcc190dfddff747f1a38eea2f7b053&with_origin_country=KR&page=1&language=ko-KR&without_genres=10749', options)  
// => 인기순, 제작 국가별(KR,US,JP), 언어(KR번역), genre_ids [10749] : 성인컨텐츠 (안가져옴)



// API 선언
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Y2JjYzE5MGRmZGRmZjc0N2YxYTM4ZWVhMmY3YjA1MyIsIm5iZiI6MTcyMTYzNDM2MC43OTA1ODUsInN1YiI6IjY2OWUwYzQ1MjJiNmYzMmEwMGE2ZTkyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BvuzMJA_8kMTzwVp93l82e12hn6a8eO2QZospBgZtCk'
    }
};

const API_KEY = '5cbcc190dfddff747f1a38eea2f7b053';
const BASE_URL = 'https://api.themoviedb.org/3/discover/movie?language=ko-KR&without_genres=10749&page=1&api_key=5cbcc190dfddff747f1a38eea2f7b053&with_origin_country=';

const getUrl = countryCode => BASE_URL+countryCode;

// API 데이터 가져오기 (KR, US, JP)
async function fetchData(countryCode, processData) {
    try {
        const res = await fetch(getUrl(countryCode));
        data = await res.json(); 
        processData(data); 
    } catch (e) {
        console.error(e);
    }
}

function processDataKr(data) {
    createHTML("KR", data);
}

function processDataUS(data){
    console.log(data);

}

function processDataJP(data){
    console.log(data);
}

fetchData("KR", processDataKr);
fetchData("US", processDataUS);
fetchData("JP", processDataJP);


function createHTML(countryCode, data){

    console.log(data);
    const movieListKr = document.getElementById("movieListKr");


}


