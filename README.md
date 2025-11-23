# AnimePilgrim2 — 애니메이션 성지순례 기록 사이트

## 선택한 도메인 / 테마

- 도메인: 개인 방문 기록(여행/로컬 가이드) — "애니메이션 성지순례 기록 사이트"
- 설명: 애니메이션, 만화, 게임, 영화 등에 등장한 실제 장소(성지)를 사용자가 등록하고 관리하는 간단한 프론트엔드 애플리케이션입니다. 방문 날짜, 장소, 작품명, 평점, 메모를 저장해 카드형 및 테이블형으로 확인할 수 있습니다.

---

## 데이터 구조 및 클래스 설계

- 파일: `js/app.js`
- 주요 클래스: `AnimePilgrim`
    - 생성자 시그니처: `constructor(workTitle, location, visitDate, rating, category, memo)`
    - 속성:
        - `workTitle` (string): 작품 제목
        - `location` (string): 실제 장소 이름
        - `visitDate` (string, YYYY-MM-DD): 방문 날짜
        - `rating` (number): 만족도 (1~10)
        - `category` (string): 카테고리(애니/게임/만화/영화)
        - `memo` (string): 방문 소감 등 메모
        - `id` (number): 고유 ID (Date.now() + Math.random())
    - 메서드:
        - `getInfo()` : 작품·장소·날짜·평점을 문자열로 반환
        - `getFormattedDate()` : `visitDate`를 `YYYY.MM.DD` 형식으로 변환
        - `renderCard()` : 카드형 DOM 노드를 생성하여 반환
        - `renderTableRow()` : 테이블 행 DOM 노드를 생성하여 반환

---

## 주요 기능

- 등록(추가): 폼(`index.html`의 `#pilgrimForm`)을 통해 항목을 입력하면 `AnimePilgrim` 객체를 생성하여 `pilgrims` 배열에 추가하고 화면을 갱신합니다.
- 출력: 등록된 항목은
    - 카드 레이아웃(`div#cardContainer`) — `renderCard()`에서 생성한 DOM 사용
    - 테이블 레이아웃(`table#pilgrimTable > tbody#tableBody`) — `renderTableRow()` 사용
    둘 다 동일한 데이터 소스(`pilgrims`)로 렌더링됩니다.
- 삭제: 카드 또는 테이블의 삭제 버튼(`.btn-delete`, `.btn-delete-table`) 클릭 시 항목을 `pilgrims` 배열에서 제거하고 `renderAll()`로 갱신합니다.
- 정렬/필터: UI 상단의 정렬 버튼들
    - `#sortByDate`: 날짜순 정렬 (내림차순)
    - `#sortByRating`: 평점순 정렬
    - `#sortByName`: 이름순 정렬
    정렬 후 `renderAll()` 호출하여 화면 갱신.
- 전체 삭제: `#clearAll` 버튼으로 `pilgrims = []` 후 렌더링.

---

## 폼 유효성 및 접근성 고려 사항

- HTML 레벨 유효성
    - `required`, `minlength`, `maxlength`, `min`, `max` 등으로 기본 검증을 적용 (`index.html` 입력 요소들).
- 접근성(ARIA)
    - 각 입력에 `aria-describedby`를 연결하여 시각적 힌트 텍스트(`small#*-hint`)를 보조 기술에 전달합니다. 예: `input#workTitle`는 `aria-describedby="workTitle-hint"`으로 연결되어 있습니다.
    - 동적 오류 메시지를 도입할 경우 권장 방식:
        - `aria-invalid="true"`와 `aria-errormessage="<error-id>"` 조합 사용
        - 또는 오류 엘리먼트에 `role="alert"` 또는 `aria-live="assertive"`를 부여해 변경 시 즉시 읽히도록 함
- 권장 개선
    - 사용자 입력을 `innerHTML`로 직접 삽입하는 대신 `textContent` 또는 `createTextNode`를 사용해 XSS를 방지하세요.
    - 폼 에러를 화면에 표시할 때 `id`가 고유한지 확인하고 스크린리더에서 읽히는지 검증하세요.

---

## 사용한 CSS3 효과 및 사용 위치

- 색상/그래디언트
    - 페이지 배경: `body { background: linear-gradient(135deg, #667eea, #764ba2); }` — 전체 배경 그라데이션.
    - 표 헤더: `thead { background: linear-gradient(135deg, #667eea, #764ba2); }`.
- 그림자 (box-shadow)
    - 카드, 섹션, 테이블 등에 `box-shadow`를 광범위하게 사용하여 입체감 부여 (`.section-box`, `.pilgrim-card`, `table` 등).
- 트랜지션 / 트랜스폼
    - `.section-box`, `.flex-item`, `.pilgrim-card`에 `transition`과 `transform: translateY()`로 호버 시 부드럽게 올리는 효과.
    - 카드 호버에서 `scale(1.02)`로 약간 확대 효과.
- 반응형
    - `@media (max-width: 768px)`를 사용해 폼과 카드 레이아웃을 세로로 정렬.
- 레이아웃
    - Flexbox(`.flex-row`, `.card-container`)로 폼/카드 레이아웃 구성.

---

## 동작 스크린샷

1. 등록 폼 영역
    - 설명: 작품 이름, 장소, 날짜, 평점, 카테고리, 메모 입력 폼이 보입니다.
2. 목록 출력(카드/테이블) 영역
    - 설명: 등록된 항목이 카드로 표시된 상태(또는 `assets/img/screenshots/list-table.png`로 테이블 뷰).
3. 삭제/필터 동작 화면
    - 설명: 정렬 버튼 사용 직후 또는 삭제 확인창을 보여주는 화면 캡처.

---
