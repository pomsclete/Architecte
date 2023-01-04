const editItems = document.querySelectorAll(".edit_area");
const editPortfolio = document.querySelector(".edit_portfolio");
const modal = document.querySelector(".modal");
const modaleGalleryWrapper = document.querySelector(".portfolio_wrapper");
const closeMark = document.querySelector(".fa-xmark");
const backMark = document.querySelector(".fa-arrow-left");
const defaultModaleView = document.querySelectorAll(".js_default_view");
const addModaleView = document.querySelectorAll(".js_add_view");

// Vérifie la présence d'un token de session au chargement
document.addEventListener('DOMContentLoaded', async (event) => {

  const token = sessionStorage.getItem("token");
  console.log(token);

  if (token) {
    console.log("You're connected !");
    showEditionMode();
  } else {
    console.log("No session cookie.");
    hideEditionMode();
  }

  // openModale(new CustomEvent('modaleOpened'));
});

// Montre le mode édition
function showEditionMode () {
  console.log("showEdit");
  for (item of editItems) {
    item.style.display = null;
  }
  document.body.style.position = 'relative'
  document.body.style.top = '60px';

  editPortfolio.addEventListener("click",openModale);
}

// Cache le mode édition
function hideEditionMode () {
  console.log("hideEdit");
  for (item of editItems) {
    item.style.display = 'none';
  }
  editPortfolio.removeEventListener("click",openModale);
}

// Ouvre la modale
const openModale = function (e) {
  e.preventDefault();
  console.log("openModale");

  modal.style.display = null;
  document.body.style.overflow = "hidden";

  closeMark.addEventListener("click", closeModale);
  modal.addEventListener("click",closeModale);
  document.querySelector(".modal_wrapper").addEventListener("click", stopPropagation);
  document.querySelector("button.add_photo").addEventListener("click", showAddView);

  showDefaultView(new CustomEvent('modaleOpened'));
  // showAddView(new CustomEvent('modaleOpened'));
  displayModaleGallery();
};

// Arrête la propagation du click
const stopPropagation = function (e) {
  e.stopPropagation();
}

// Ferme la modale
const closeModale = function (e) {
  e.preventDefault();
  console.log("closeModale");

  modal.style.display = "none";
  document.body.style.overflow = 'inherit';

  closeMark.removeEventListener("click",closeModale);
  modal.removeEventListener("click",closeModale);
  document.querySelector(".modal_wrapper").removeEventListener("click",stopPropagation);
  document.querySelector("button.add_photo").removeEventListener("click",showAddView);

  const iconList = document.querySelectorAll(".icon_del");
  for (icon of iconList) {
    icon.removeEventListener("click",deleteWork);
  }

  // Suppression de la galerie de la modale
  modaleGalleryWrapper.replaceChildren();
};

// chargement de la galerie dans la modale

const displayModaleGallery = function () {
  console.log("displayModaleGallery");

  const figList = gallery_div.childNodes;

  const iconDiv = document.createElement("div");
  iconDiv.classList.add("icon_del");
  const delIcon = document.createElement("i");
  delIcon.classList.add("fa-solid");
  delIcon.classList.add("fa-trash-can");
  iconDiv.append(delIcon);
  const modaleFigCaption = document.createTextNode("éditer");

  for (figure of figList) {

    let figid = figure.classList[1].slice(3);
    let newDelIcon = iconDiv.cloneNode(true);
    newDelIcon.addEventListener("click", function () {
        deleteWork(figid);
    });

    let newFig = figure.cloneNode(true);
    newFig.prepend(newDelIcon);
    newFig.childNodes.item(2).replaceChildren(modaleFigCaption.cloneNode(true));
    modaleGalleryWrapper.append(newFig);
  }
};

// Suppression d'un projet

const deleteWork = async function (figID) {

  const bearer = "Bearer " + sessionStorage.getItem("token");

  const headers = new Headers ({
    'accept': '*/*',
    'Authorization': bearer
  });

  const httpOptions = {
    method: "DELETE",
    headers: headers
  };

  const url = "http://localhost:5678/api/works/"+figID;

  try {
    const response = await fetch(url,httpOptions);

    if (response.status === 204) {
        removeFigure(figID);
        displayInfoMessage();
    } else {
      throw new Error(response.status);
    }
  } catch (e) {
    console.log(e);
  }
};

const displayInfoMessage = function () {

  let infoText = document.querySelector(".message-info");
  infoText.replaceChildren();

  infoText.append(document.createTextNode("Projet supprimé de la galerie"));
  setTimeout( () => {
    infoText.style.visibility = 'visible';
  }, 1000);
  setTimeout( () => {
    infoText.classList.add("fadeOut");
  }, 5000);
};

const removeFigure = function (figID) {

  // retire la figure de la modale
  const figClassWrapper = ".portfolio_wrapper .fig"+figID;
  document.querySelector(figClassWrapper).remove();

  // retire la figure de la galerie
  const figClassGallery = ".fig"+figID;
  document.querySelector(figClassGallery).remove();
}

// Affichage de la vue d'ajout de photo

const showAddView = function (e) {
  e.preventDefault();
  document.querySelector(".modal_wrapper h3")
  .replaceChildren(document.createTextNode("Ajout photo"));

  for (item of defaultModaleView) {
    item.style.display = "none";
  }

  for (item of addModaleView) {
    item.style.display = null
  }

  backMark.addEventListener("click",showDefaultView);
};

// Affiche la vue par défaut de la modale

const showDefaultView = function (e) {
  e.preventDefault();
  console.log("showDefaultView");

  document.querySelector(".modal_wrapper h3")
  .replaceChildren(document.createTextNode("Galerie photo"));
  for (item of defaultModaleView) {
    item.style.display = null
  }

  for (item of addModaleView) {
    item.style.display = "none";
  }
}
