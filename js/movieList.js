import { fetchAllMoviesData, fetchMoviesByCountry, searchAllData } from './tmdbApi.js';

const KR = { countryCode: "KR", page: 1 };
const JP = { countryCode: "JP", genres: 16, page: 1 };
const US = { countryCode: "US", page: 1 };
const countryConfig = { KR, JP, US };
let selectedCountry = "";


const processData = (data) => {
    clearHTML();
    data = filterMovieData(data);

    data.forEach(data => {
        createHTML(data);
    });
}

function filterMovieData(data) {
    return data.filter(data => data.vote_count >= 15);
}

function clearHTML() {
    let movieCard = document.getElementsByClassName('movie-card');
    while (movieCard.length > 0) {
        movieCard[0].parentNode.removeChild(movieCard[0]);
    }
}


function createHTML(data) {
    // imgSize : [w92, w154, w185, w342, w500, w780, original]
    const imgPath = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    const imgLink = `./detail/detail.html?id=${data.id}`;
    const title = data.title;
    const release_date = data.release_date || '2024-01-01'; // 날짜 없는 애들 더미용
    const overview = data.overview;
    const popularity = data.popularity;
    const vote_average = Math.round(data.vote_average * 10) / 10;;
    const vote_count = data.vote_count;

    const movieList = document.getElementById('movieList');

    let movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.id = "movieCard";

    let imageDiv = document.createElement("div");
    imageDiv.classList.add("image");

    let imageLink = document.createElement("a");
    imageLink.classList.add("image");
    imageLink.href = imgLink;
    imageLink.title = title;

    let image = document.createElement("img");
    image.classList.add("card-img");
    image.src = imgPath;

    imageLink.appendChild(image);
    imageDiv.appendChild(imageLink);
    movieCard.appendChild(imageDiv);


    let contentDiv = document.createElement("div");
    contentDiv.classList.add("content");

    let h2 = document.createElement("h2");
    h2.textContent = title;
    contentDiv.appendChild(h2);

    let contentBoxDiv = document.createElement("div");
    contentBoxDiv.classList.add("content-box");

    let p1 = document.createElement("p");
    p1.textContent = "24.04.04"; // 날짜 텍스트
    contentBoxDiv.appendChild(p1);

    let p2 = document.createElement("p");
    p2.textContent = vote_average;
    contentBoxDiv.appendChild(p2);

    contentDiv.appendChild(contentBoxDiv);
    movieCard.appendChild(contentDiv);

    movieList.appendChild(movieCard);
}


// 검색 입력 이벤트
document.getElementById('inputSearch').addEventListener('input', function (e) {
    fetchAllMoviesData(this.value, processData);
});


// 메뉴 클릭 이벤트
const menuText = document.querySelectorAll('.menu-text');
menuText.forEach((target) => target.addEventListener('click', () => {
    selectedCountry = target.id; // KR

    if (countryConfig[selectedCountry]) {
        countryConfig[selectedCountry].page = 1;
    }

    if (selectedCountry === "ALL") {
        fetchAllMoviesData("", processData);
    } else { //countryConfig['KR']
        fetchMoviesByCountry(countryConfig[selectedCountry], processData);
    }

    document.querySelector('.menu-text.selected')?.classList.remove('selected');
    target.classList.add('selected');
}))

fetchAllMoviesData("", processData);

window.addEventListener('scroll', () => {
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.innerHeight + window.scrollY;

    if (scrollPosition >= documentHeight) {
        countryConfig[selectedCountry].page++;
        fetchMoviesByCountry(countryConfig[selectedCountry], (data) => {
            processNextpage(data);
        });
    }
});

function processNextpage(data) {
    console.log(countryConfig);
    console.log(data);

    data = filterMovieData(data);

    data.forEach(data => {
        createHTML(data);
    });
}