const BASE_URL = "https://lighthouse-user-api.herokuapp.com/";
const INDEX_URL = BASE_URL + "api/v1/users/";
const dataPanel = document.querySelector("#data-panel");
const paginator = document.querySelector("#paginator");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const randomPerson = document.querySelector("#randomPerson");
const mainSession = document.querySelector(".main-session");
const USERS_PER_PAGE = 20;
const users = [];
const list = JSON.parse(localStorage.getItem("favoriteUsers")) || [];
let filterUsers = [];

// Render user list
function renderUserList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    rawHTML += `     
      <div class="col-auto"> 
        <div class="mb-3">
          <div class="card" style="width: 15rem;">
            <img style="height: auto" src="${
              item.avatar
            }" class="card-img-top" alt="...">
            <div class="card-body">
             <p class="card-text text-center"><strong>${item.name} ${
      item.surname
    }</strong></p>
            </div>
            <div class="card-footer text-center"
            style="background-color: snow">
              <button class="btn btn-show-user-info" data-toggle="modal" data-target="#user-modal" data-id="${
                item.id
              }">More
              </button>
              <button type="checkbox" class="${checkId(item.id)} "data-id="${
      item.id
    }">♥</button>
            </div>
          </div>
        </div>
      </div> `;
  });
  dataPanel.innerHTML = rawHTML;
}

//確認卡片愛心狀態，避免重整時狀態消失
function checkId(id) {
  if (list.some((user) => user.id === id)) {
    return "btn btn-outline-danger btn-add-favorite addLove";
  } else {
    return "btn btn-outline-danger btn-add-favorite ";
  }
}

// add to favorite function
function addToFavorite(id) {
  const user = users.find((user) => user.id === id);
  console.log(user);
  console.log(typeof user);

  if (list.some((user) => user.id === id)) {
    return alert("已經在最愛清單中囉！");
  }
  list.push(user);
  localStorage.setItem("favoriteUsers", JSON.stringify(list));
}

//dispaly the user modal function
function showUserModal(id) {
  const modalAge = document.querySelector("#user-age");
  const modalEmail = document.querySelector("#user-email");
  const modalGender = document.querySelector("#user-gender");
  const modalBirth = document.querySelector("#user-birth");
  const modalRegion = document.querySelector("#user-region");
  const modalAvatar = document.querySelector("#user-avatar");
  const modalName = document.querySelector("#user-modal-title");
  const user = users.find((user) => user.id === id);
  modalName.innerText = `${user.name} ${user.surname}`;
  modalEmail.innerText = `E-Mail：${user.email}`;
  modalRegion.innerText = `Region：${user.region}`;
  modalBirth.innerText = `Birthday：${user.birthday}`;
  modalAge.innerText = `Age：${user.age}`;
  modalGender.innerText = `Gender：${user.gender}`;
  modalAvatar.innerHTML = `<img src='${user.avatar}' class="card-img-modal" alt="...">`;
  // send request to show api
  // axios.get(INDEX_URL + id).then((response) => {
  //   const data = response.data;
  //   // insert data into modal ui
  //   modalName.innerText = `${data.name} ${data.surname}`;
  //   modalEmail.innerText = `E-Mail：${data.email}`;
  //   modalRegion.innerText = `Region：${data.region}`;
  //   modalBirth.innerText = `Birthday：${data.birthday}`;
  //   modalAge.innerText = `Age：${data.age}`;
  //   modalGender.innerText = `Gender：${data.gender}`;
  //   modalAvatar.innerHTML = `<img src='${data.avatar}' class="card-img-modal" alt="...">`;
  // });
}

function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  filterUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(keyword) ||
      user.surname.toLowerCase().includes(keyword)
  );
  if (filterUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的人`);
  }
  renderUserList(getUsersByPage(1));
  renderPaginator(filterUsers.length);
}

// pagination area
// find the users' index on certain page
function getUsersByPage(page) {
  const data = filterUsers.length ? filterUsers : users;
  const startIndex = (page - 1) * USERS_PER_PAGE;
  return data.slice(startIndex, startIndex + USERS_PER_PAGE);
}

// display the Paginator below
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE);

  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

//button's event listener
mainSession.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user-info")) {
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
    event.target.classList.add("addLove");
  }
});

///////  Event Listener  ///////

//search bar area listen to input change and submit button
searchForm.addEventListener("input", onSearchFormSubmitted);
searchForm.addEventListener("submit", onSearchFormSubmitted);

//Random one lucky user area
randomPerson.addEventListener("click", function onRandomClicked(event) {
  if (event.target.matches(".btn-lucky-star")) {
    const luckyContent = document.querySelector("#lucky-content");
    const luckyName = document.querySelector("#lucky-name");
    const luckyAvatar = document.querySelector("#lucky-avatar");
    const luckyButton = document.querySelector("#lucky-button");
    let rawHTML = "";
    // random all users
    luckyIndex = Math.floor(Math.random() * users.length) + 1;

    rawHTML = `
    <p><em>Region：${users[luckyIndex].region}</em></p>
    <p><em>Gender：${users[luckyIndex].gender}</em></p>
    <p><em>Age：${users[luckyIndex].age}</em></p>
    `;
    luckyContent.innerHTML = rawHTML;
    luckyName.innerText = `${users[luckyIndex].name} ${users[luckyIndex].surname}`;
    luckyAvatar.innerHTML = `<img src='${users[luckyIndex].avatar}' class="card-img-lucky" alt="Avator">`;
    luckyButton.innerHTML = `
    <button class="btn btn-show-user-info mx-auto" data-toggle="modal" data-target="#user-modal" data-id="${users[luckyIndex].id}">More
    </button>
    <button class="btn btn-outline-danger btn-add-favorite mx-auto" data-id="${users[luckyIndex].id}">♥加入最愛</button>`;
  }
});

// Paginato's event listener
paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;
  const page = Number(event.target.dataset.page);
  const currentPage = event.target.parentElement;
  const pageNumber = document.querySelectorAll(".page-item");

  pageNumber.forEach(function removeClass(item) {
    if (item.matches(".active")) {
      item.classList.remove("active");
    }
  });
  currentPage.classList.add("active");
  renderUserList(getUsersByPage(page));
});

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results);
    renderUserList(getUsersByPage(1));
    renderPaginator(users.length);
  })
  .catch((err) => console.log(err));
