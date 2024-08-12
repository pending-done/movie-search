// API 선언
const OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Y2JjYzE5MGRmZGRmZjc0N2YxYTM4ZWVhMmY3YjA1MyIsIm5iZiI6MTcyMTYzNDM2MC43OTA1ODUsInN1YiI6IjY2OWUwYzQ1MjJiNmYzMmEwMGE2ZTkyMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BvuzMJA_8kMTzwVp93l82e12hn6a8eO2QZospBgZtCk'
    }
};

// 상수값들 module로 빼라
const API_KEY = '5cbcc190dfddff747f1a38eea2f7b053';
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'ko-KR';
const WITHOUT_GENRES = '10749';
const COUNTRY_CODES = ['KR', 'US', 'JP']
const DUMMY_GENRES = [
    { id: '' },
    { id: '' },
]

const ORIGIN_COUNTRY_CODE = {
    'US': '미국',
    'JP': '일본',
    'KR': '한국',
    'UK': '영국'
}
const IMG_URL = "https://image.tmdb.org/t/p/";


export default { OPTIONS, API_KEY, BASE_URL, LANGUAGE, WITHOUT_GENRES, COUNTRY_CODES, DUMMY_GENRES, ORIGIN_COUNTRY_CODE, IMG_URL }