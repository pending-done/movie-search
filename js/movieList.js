let menu;


// 데이터 검색  (공백제거, 특문제거, 대문자 치환 => 초성검색)
function searchAllData(data, searchKey) {

    // 타이틀의 공백, 특수문자를 제거하고, 검색을합니다.
    return data.filter((value) => {
        const title = value.title.replace(/ /g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/g, '');
        return H.includesByCho(searchKey.toUpperCase(), title.toUpperCase())
    })
}


// 데이터 처리
const processData = (data) => {
    clearHTML();

    data.forEach(data => {
        createHTML(data);
    });
}
// function processData(data) {
//     clearHTML();

//     data.forEach(data => {
//         createHTML(data);
//     });
// }

// HTML Clear
function clearHTML() {
    let movieCard = document.getElementsByClassName('movie-card');
    while (movieCard.length > 0) {
        movieCard[0].parentNode.removeChild(movieCard[0]);
    }
}

// HTML Create

function createHTML(data) {
    // imgSize : [w92, w154, w185, w342, w500, w780, original]
    const imgPath = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    const imgLink = `/detail/detail.html?id=${data.id}`;
    const title = data.title;
    const release_date = data.release_date || '2024-01-01'; // 날짜 없는 애들 더미용
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
    imageLink.href = imgLink;
    imageLink.title = title;

    // div.movie-card > div.image > a.image > img.card-img
    let image = document.createElement("img");
    image.classList.add("card-img");
    image.src = imgPath;

    imageLink.appendChild(image);
    imageDiv.appendChild(imageLink);
    movieCard.appendChild(imageDiv);
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * */


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
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    // 최종 추가 (movie-card 생성)    
    movieList.appendChild(movieCard);
}


// 검색 입력 이벤트
document.getElementById('inputSearch').addEventListener('input', function (e) {

    fetchData("ALL", this.value);
});


const menuText = document.querySelectorAll('.menu-text');
menuText.forEach((target) => target.addEventListener('click', () => {
    fetchData(target.id, "", processData)
}))



// 페이지 로드 (전체데이터)
fetchData("ALL", "", processData);