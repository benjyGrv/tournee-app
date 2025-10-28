let houses = JSON.parse(localStorage.getItem("houses")) || [];
let editIndex = null;

const houseContainer = document.getElementById("houseContainer");
const soldContainer = document.getElementById("soldContainer");
const addHouseBtn = document.getElementById("addHouseBtn");
const saveHouseBtn = document.getElementById("saveHouseBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("houseFormModal");
const houseName = document.getElementById("houseName");
const houseStatus = document.getElementById("houseStatus");

function renderHouses() {
  houseContainer.innerHTML = "";
  soldContainer.innerHTML = "";

  houses.forEach((house, index) => {
    const card = document.createElement("div");
    card.classList.add("house-card");

    const info = document.createElement("div");
    info.classList.add("house-info");
    info.textContent = `${house.nom} (${house.statut})`;

    const actions = document.createElement("div");
    actions.classList.add("house-actions");

    const sellBtn = document.createElement("button");
    sellBtn.textContent = "Vendre";
    sellBtn.classList.add("sell");
    sellBtn.onclick = () => markAsSold(index);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Modifier";
    editBtn.classList.add("edit");
    editBtn.onclick = () => editHouse(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.classList.add("delete");
    deleteBtn.onclick = () => deleteHouse(index);

    actions.append(sellBtn, editBtn, deleteBtn);
    card.append(info, actions);

    if (house.statut === "vendue") soldContainer.append(card);
    else houseContainer.append(card);
  });
}

function openModal() {
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  houseName.value = "";
  houseStatus.value = "disponible";
  editIndex = null;
}

function saveHouse() {
  const nom = houseName.value.trim();
  const statut = houseStatus.value;

  if (!nom) {
    alert("Veuillez entrer un nom de maison");
    return;
  }

  if (editIndex !== null) {
    houses[editIndex] = { nom, statut };
  } else {
    houses.push({ nom, statut });
  }

  localStorage.setItem("houses", JSON.stringify(houses));
  renderHouses();
  closeModal();
}

function editHouse(index) {
  const house = houses[index];
  houseName.value = house.nom;
  houseStatus.value = house.statut;
  editIndex = index;
  openModal();
}

function deleteHouse(index) {
  houses.splice(index, 1);
  localStorage.setItem("houses", JSON.stringify(houses));
  renderHouses();
}

function markAsSold(index) {
  if (houses[index].statut === "vendue") {
    alert("Cette maison est déjà vendue !");
    return;
  }
  houses[index].statut = "vendue";
  localStorage.setItem("houses", JSON.stringify(houses));
  renderHouses();
}

addHouseBtn.addEventListener("click", openModal);
saveHouseBtn.addEventListener("click", saveHouse);
closeModalBtn.addEventListener("click", closeModal);

renderHouses();
