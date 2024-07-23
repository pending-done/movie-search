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

const COUNTRY_CODES = ["KR", "US", "JP"];

const getUrl = countryCode => BASE_URL + countryCode;


// API 데이터 가져오기 (KR, US, JP)
async function fetchData(countryCode, searchKey) {
    try {
        if (countryCode !== "") {
            const res = await fetch(getUrl(countryCode));
            data = await res.json();
            processCountryData(countryCode, data);
        } else {
            const data1 = await fetch(getUrl("KR")).then((data) => data.json());
            const data2 = await fetch(getUrl("US")).then((data) => data.json());
            const data3 = await fetch(getUrl("JP")).then((data) => data.json());

            mergeAllData(data1, data2, data3, searchKey);

        }

    } catch (e) {
        console.error(e);
    }
}

// KR, US, JP ...
function processCountryData(countryCode, data) {
    console.log(data);
}

COUNTRY_CODES.forEach((code) => fetchData(code, ""));

// 전체 데이터 병합 (KR + US + JP ...)
function mergeAllData(data1, data2, data3, searchKey) {
    const data = [...data1.results, ...data2.results, ...data3.results];
    sortAllData(data, searchKey);
}

// 전체 데이터 인기순 정렬
function sortAllData(data, searchKey) {
    data.sort((a, b) => b.vote_average - a.vote_average);

    if(searchKey !== ""){
        data = getSearchAllData(data, searchKey);
        console.log(data);
    }

    processAllData(data);
}

function processAllData(data) {
}

function getSearchAllData(data, searchKey){
    return data.filter((value) => {
        const title = value.title.replace(/ /g, '')
        return H.includesByCho(searchKey, title)}
    )
}




// 전체데이터 기본 로드
fetchData("", "");


function createHTML(countryCode, data) {

    // console.log(data);
    const movieListKr = document.getElementById("movieListKr");


}


document.getElementById('inputSearch').addEventListener('input', function (e) {

    // let text = this.value;
    // let target = H.divideHangul("범죄도시").join('');
    // console.log(H.includesByCho(text, "범죄도시"));

    fetchData("", this.value);

});


function checkTextInTitle(text, target){


}

