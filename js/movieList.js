import { fetchAllMoviesData, fetchMoviesByCountry } from './tmdbApi.js';
import render from './render.js'

const KR = { countryCode: "KR", page: 1 };
const JP = { countryCode: "JP", genres: 16, page: 1 };
const US = { countryCode: "US", page: 1 };
const countryConfig = { KR, JP, US };
let selectedCountry = "";


const processData = (data) => {
    clearHTML();
    data = filterMovieData(data);

    data.forEach(data => {
        render.createHTML(data);
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
    } else {
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