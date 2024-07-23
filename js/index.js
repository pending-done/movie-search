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

let menu = "all";

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

// 국가별 데이터 한번에 가져오기 (메뉴별로 페이지 나누게 되어서 필요 없어짐)
// COUNTRY_CODES.forEach((code) => fetchData(code, ""));

// 전체 데이터 병합 (KR + US + JP ...)
function mergeAllData(data1, data2, data3, searchKey) {
    const data = [...data1.results, ...data2.results, ...data3.results];
    sortAllData(data, searchKey);
}

// 전체 데이터 인기순 정렬
function sortAllData(data, searchKey) {
    data.sort((a, b) => b.popularity - a.popularity);

    if (searchKey !== "") {
        data = getSearchAllData(data, searchKey);

        console.log(data);
    }

    processAllData(data);
}

function processAllData(data) {
    clearHTML();

    data.forEach(data => {
        createHTML(data);
        // imgPath: "https://image.tmdb.org/t/p/original"+data.backdrop_path,
        // title: data.title,
        // release_date: data.release_date,
        // overview: data.overview,
        // popularity: data.popularity,
        // vote_average: data.vote_average,
        // vote_count: data.vote_count;

    });

}


/**
 * 아래 형태의 html 생성
 * <div class="movie-card">
        <div class="image">
            <a class="image" href="#" title="인사이드 아웃 2">
                <img class="card-img" src="https://image.tmdb.org/t/p/w342/pmemGuhr450DK8GiTT44mgwWCP7.jpg">
            </a>
        </div>
        <div class="content">
            <h2>인사이드 아웃 2</h2>
            <p>2024-06-11</p>
        </div>
    </div>
 */

function clearHTML(){
    let movieCard = document.getElementsByClassName('movie-card');
    while(movieCard.length > 0){
        movieCard[0].parentNode.removeChild(movieCard[0]);
    }

    debugger;
}

function createHTML(data) {
    
    debugger;



    const imgPath = "https://image.tmdb.org/t/p/w342" + data.poster_path;
    const title = data.title;
    const release_date = data.release_date || '2024-01-01';
    const overview = data.overview;
    const popularity = data.popularity;
    const vote_average = data.vote_average;
    const vote_count = data.vote_count;

    
    const movieList = document.getElementById('movieList');

    // div.movie-card 
    let movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.id = "movieCard";

    /* * * * * * * * * * * 사진 영역 * * * * * * * * * * * * */
    // div.movie-card > div.image
    let imageDiv = document.createElement("div");
    imageDiv.classList.add("image");

    // div.movie-card > div.image > a.image
    let imageLink = document.createElement("a");
    imageLink.classList.add("image");
    imageLink.href = "#";
    imageLink.title = title;

    // div.movie-card > div.image > a.image > img.card-img
    let image = document.createElement("img");
    image.classList.add("card-img");
    image.src = imgPath;

    imageLink.appendChild(image);
    imageDiv.appendChild(imageLink);
    movieCard.appendChild(imageDiv);


    /* * * * * * * * * * * 정보 영역 * * * * * * * * * * * * */
    // div.movie-card > div.content
    let contentDiv = document.createElement("div");
    contentDiv.classList.add("content");

    // div.movie-card > div.content > h2
    let h2 = document.createElement("h2");
    h2.textContent = title;

    // div.movie-card > div.content > p
    let p = document.createElement("p");
    p.textContent = release_date;

    contentDiv.appendChild(h2);
    contentDiv.appendChild(p);
    movieCard.appendChild(contentDiv);

    // 최종 추가 (movie-card 생성)    
    movieList.appendChild(movieCard);
}

function getSearchAllData(data, searchKey) {
    return data.filter((value) => {
        const title = value.title.replace(/ /g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/g, '');

        // searchKey = Hangul.disassemble(searchKey).join('');
        return H.includesByCho(searchKey, title)
    }
    )
}


// 전체데이터 기본 로드
fetchData("", "")





document.getElementById('inputSearch').addEventListener('input', function (e) {

    // let text = this.value;
    // let target = H.divideHangul("범죄도시").join('');
    // console.log(H.includesByCho(text, "범죄도시"));

    fetchData("", this.value);

});


function checkTextInTitle(text, target) {


}

