# Flix Catcher
TMDB API를 이용하여 영화를 검색하는 페이지입니다. 

## Preview
### 메인
![image](https://github.com/user-attachments/assets/324e8c2c-c9d0-4427-8cad-e26a543fe211)
### 상세
![image](https://github.com/user-attachments/assets/95f6e3c0-3e81-4d50-b2f9-2374ed581b8f)
![image](https://github.com/user-attachments/assets/77dba8ca-61dc-4711-8a6b-f678c2b49348)
## 기능
### 메인페이지
- 영화 목록
    - 메뉴별 영화 목록 (전체, 한국, 미국, 일본...)
    - 전체 목록
        - 국가별 전체 영화를 인기순으로 목록에 출력
    - 국가별 목록
        - 메뉴 선택 시 국가별 출력
    - 영화에 대한 간략한 정보 표시   
    - 스크롤 최대로 내릴 경우 다음 데이터 로드
    <br/>
- 영화 검색
    - 실시간 검색 기능 (페이지 새로고침 X)
    - 초성 검색 기능 
        - ex) ㅇㅅㅇㄷ아웃 => 인사이드아웃   
    <br/>
### 상세페이지
- 상세정보
    - 메인페이지의 목록을 클릭하면 상세페이지로 이동
    - 클릭한 영화의 상세 정보 출력 (배경 및 포스터, 제목, 장르, 발매국, 발매일, 개요)
- 부가정보
    - 상세정보 하단영역에 다른 영화 추천 (비슷한 장르, 곧 개봉, 최고 평점)
    - 다른 영화 추천 최대로 스크롤할 경우 다음 데이터 로드
    - 출연진 목록
    - 스크롤 기능 
        <br/>
## 코딩 스타일 가이드
1. 변수 선언은 const, let 사용
2. 변수, 함수 명명 규칙: camelCase

## 사용 기술

![js](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white)
![html](https://img.shields.io/badge/HTML-239120?style=for-the-badge&logo=html5&logoColor=white)
![css](    https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white)   
<br/>
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=LeeJY97&exclude_repo=sparta_first,sparta_jsrunning_train&theme=blue-green)

