const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id'); // 'id'에 해당하는 Query Parameter 값 가져오기

console.log(`Loading details for movie ID ${movieId}`);





// 전체 영화중 id 비교해서 필터링, 
const processData = (data) => {
    const movieObj = data.filter(movie => movie.id == movieId);
}

function processDetailData(data){
    console.log(data);
}


function createElement(data){


}


fetchData("", "", processData);
fetchDetail(movieId);