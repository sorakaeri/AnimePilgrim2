// ============================================
// AnimePilgrim 클래스 정의
// ============================================
class AnimePilgrim {
  constructor(workTitle, location, visitDate, rating, category, memo) {
    this.workTitle = workTitle;
    this.location = location;
    this.visitDate = visitDate;
    this.rating = rating;
    this.category = category;
    this.memo = memo;
    this.id = Date.now() + Math.random(); // 고유 ID 생성
  }

  // 객체 정보를 문자열로 반환하는 메서드
  getInfo() {
    return `${this.workTitle} - ${this.location} (${this.visitDate}) | 평점: ${this.rating}/10`;
  }

  // 날짜를 YYYY.MM.DD 형식으로 변환
  getFormattedDate() {
    return this.visitDate.replace(/-/g, ".");
  }

  // 카드 형태로 렌더링
  renderCard() {
    const card = document.createElement("div");
    card.className = "pilgrim-card";
    card.dataset.id = this.id;

    const memoHTML = this.memo
      ? `<div class="card-memo" id="memo-${this.id}"><strong>메모:</strong> ${this.memo}</div>`
      : "";

    card.innerHTML = `
      <div class="card-header">
        <span class="card-title">${this.workTitle}</span>
        <span class="card-rating">⭐ ${this.rating}</span>
      </div>
      <div class="card-body">
        <div class="card-info">
          <span class="card-label">장소:</span>
          <span>${this.location}</span>
        </div>
        <div class="card-info">
          <span class="card-label">방문일:</span>
          <span>${this.getFormattedDate()}</span>
        </div>
        <span class="card-category">${this.category}</span>
        ${memoHTML}
      </div>
      <div class="card-footer">
        <button class="btn-delete" data-id="${this.id}">삭제</button>
      </div>
    `;

    // 카드 클릭 시 메모 토글
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn-delete")) {
        const memo = card.querySelector(".card-memo");
        if (memo) {
          memo.classList.toggle("show");
        }
      }
    });

    return card;
  }

  // 테이블 행으로 렌더링
  renderTableRow() {
    const row = document.createElement("tr");
    row.dataset.id = this.id;

    row.innerHTML = `
      <td>${this.workTitle}</td>
      <td>${this.location}</td>
      <td>${this.getFormattedDate()}</td>
      <td>⭐ ${this.rating}</td>
      <td>${this.category}</td>
      <td><button class="btn-delete-table" data-id="${
        this.id
      }">삭제</button></td>
    `;

    return row;
  }
}

// ============================================
// 전역 변수
// ============================================
let pilgrims = [];

// 초기 데이터 (샘플)
pilgrims.push(
  new AnimePilgrim(
    "너의 이름은",
    "스가 신사",
    "2025-01-18",
    9,
    "애니메이션",
    ["신카이 마코토", "도쿄"],
    "도쿄 시내에 위치한 아름다운 신사. 계단이 매우 인상적이었습니다."
  )
);

pilgrims.push(
  new AnimePilgrim(
    "스즈메의 문단속",
    "히지리바시 다리",
    "2025-01-17",
    8,
    "애니메이션",
    ["신카이 마코토"],
    "조용하고 평화로운 분위기의 다리입니다."
  )
);

// ============================================
// DOM 요소
// ============================================
const form = document.getElementById("pilgrimForm");
const cardContainer = document.getElementById("cardContainer");
const tableBody = document.getElementById("tableBody");
const itemCount = document.getElementById("itemCount");
const sortByDateBtn = document.getElementById("sortByDate");
const sortByRatingBtn = document.getElementById("sortByRating");
const sortByNameBtn = document.getElementById("sortByName");
const clearAllBtn = document.getElementById("clearAll");

// ============================================
// 함수: 화면 렌더링
// ============================================
function renderAll() {
  // 카드 컨테이너 초기화
  cardContainer.innerHTML = "";

  // 테이블 바디 초기화
  tableBody.innerHTML = "";

  // 데이터가 없을 때
  if (pilgrims.length === 0) {
    cardContainer.innerHTML =
      '<p style="text-align: center; color: #999; width: 100%;">등록된 기록이 없습니다.</p>';
    tableBody.innerHTML =
      '<tr><td colspan="6" style="text-align: center; color: #999;">등록된 기록이 없습니다.</td></tr>';
  } else {
    // 카드 렌더링
    pilgrims.forEach((pilgrim) => {
      cardContainer.appendChild(pilgrim.renderCard());
    });

    // 테이블 렌더링
    pilgrims.forEach((pilgrim) => {
      tableBody.appendChild(pilgrim.renderTableRow());
    });
  }

  // 아이템 카운트 업데이트
  itemCount.textContent = pilgrims.length;

  // 삭제 버튼 이벤트 리스너 등록
  attachDeleteListeners();
}

// ============================================
// 함수: 삭제 버튼 이벤트 리스너 등록
// ============================================
function attachDeleteListeners() {
  const deleteButtons = document.querySelectorAll(
    ".btn-delete, .btn-delete-table"
  );

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      const id = parseFloat(this.dataset.id);

      if (confirm("정말 삭제하시겠습니까?")) {
        // 배열에서 제거
        pilgrims = pilgrims.filter((pilgrim) => pilgrim.id !== id);

        // 화면 다시 렌더링
        renderAll();
      }
    });
  });
}

// ============================================
// 이벤트: 폼 제출
// ============================================
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // 폼 데이터 가져오기
  const workTitle = document.getElementById("workTitle").value.trim();
  const location = document.getElementById("location").value.trim();
  const visitDate = document.getElementById("visitDate").value;
  const rating = parseInt(document.getElementById("rating").value);
  const category = document.getElementById("category").value;
  const memo = document.getElementById("memo").value.trim();

  // 새 객체 생성
  const newPilgrim = new AnimePilgrim(
    workTitle,
    location,
    visitDate,
    rating,
    category,
    memo
  );

  // 배열에 추가
  pilgrims.push(newPilgrim);

  // 화면 렌더링
  renderAll();

  // 폼 초기화
  form.reset();

  // 성공 메시지
  alert("성지순례 기록이 등록되었습니다!");
});

// ============================================
// 이벤트: 정렬 버튼
// ============================================
sortByDateBtn.addEventListener("click", function () {
  pilgrims.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
  renderAll();
});

sortByRatingBtn.addEventListener("click", function () {
  pilgrims.sort((a, b) => b.rating - a.rating);
  renderAll();
});

sortByNameBtn.addEventListener("click", function () {
  pilgrims.sort((a, b) => a.workTitle.localeCompare(b.workTitle));
  renderAll();
});

// ============================================
// 이벤트: 전체 삭제 버튼
// ============================================
clearAllBtn.addEventListener("click", function () {
  if (pilgrims.length === 0) {
    alert("삭제할 기록이 없습니다.");
    return;
  }

  if (confirm("정말 모든 기록을 삭제하시겠습니까?")) {
    pilgrims = [];
    renderAll();
    alert("모든 기록이 삭제되었습니다.");
  }
});

// ============================================
// 초기 렌더링
// ============================================
renderAll();
