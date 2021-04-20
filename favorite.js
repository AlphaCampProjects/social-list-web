const BASE_URL = "https://lighthouse-user-api.herokuapp.com/";
const INDEX_URL = BASE_URL + "api/v1/users/";
const dataPanel = document.querySelector("#data-panel");
const modalName = document.querySelector("#user-modal-title");
const users = JSON.parse(localStorage.getItem("favoriteUsers"));

//movies list
function renderUserList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    rawHTML += `     
      <div class="col-auto"> 
        <div class="mb-3">
          <div class="card" style="width: 15rem;">
            <img style="height: auto" src="${item.avatar}" class="card-img-top" alt="...">
            <div class="card-body">
             <p class="card-text text-center"><strong>${item.name} ${item.surname}</strong></p>
            </div>
            <div class="card-footer text-center"
            style="background-color: snow">
              <button class="btn btn-show-user-info" style="background-color: #1bd1a5; color: snow" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">More
              </button>
              <button class="btn btn-outline-danger btn-remove-favorite addLove" data-id="${item.id}">Remove♥</button>
            </div>
          </div>
        </div>
      </div> `;
  });
  dataPanel.innerHTML = rawHTML;
}

//button's event listener
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user-info")) {
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

// remove the favorite area
function removeFromFavorite(id) {
  if (!users) return;
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return;

  users.splice(userIndex, 1);
  localStorage.setItem("favoriteUsers", JSON.stringify(users));
  renderUserList(users);
}

// display the modal area
function showUserModal(id) {
  const modalAge = document.querySelector("#user-age");
  const modalEmail = document.querySelector("#user-email");
  const modalGender = document.querySelector("#user-gender");
  const modalBirth = document.querySelector("#user-birth");
  const modalRegion = document.querySelector("#user-region");
  const modalAvatar = document.querySelector("#user-avatar");
  const user = users.find((user) => user.id === id);
  modalName.innerText = `${user.name} ${user.surname}`;
  modalEmail.innerText = `E-Mail：${user.email}`;
  modalRegion.innerText = `Region：${user.region}`;
  modalBirth.innerText = `Birthday：${user.birthday}`;
  modalAge.innerText = `Age：${user.age}`;
  modalGender.innerText = `Gender：${user.gender}`;
  modalAvatar.innerHTML = `<img src='${user.avatar}' class="card-img-modal" alt="...">`;
}

renderUserList(users);
