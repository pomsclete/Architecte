const editItems = document.querySelectorAll(".edit_area");
const editPortfolio = document.querySelector(".edit_portfolio");
const modal = document.querySelector(".modal");
const modaleGalleryWrapper = document.querySelector(".portfolio_wrapper");

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
  document.querySelector(".fa-xmark").addEventListener("click", closeModale);
  displayModaleGallery();
};

// Ferme la modale
const closeModale = function (e) {
  e.preventDefault();
  console.log("closeModale");

  modal.style.display = "none";
  document.body.style.overflow = 'inherit';
  document.querySelector(".fa-xmark").removeEventListener("click",closeModale);
  const iconList = document.querySelectorAll(".icon_del");
  for (icon of iconList) {
    console.log(icon);
    icon.removeEventListener("click",deleteWork);
  }
  modaleGalleryWrapper.replaceChildren();
  // Recharge la galerie à la fermeture s'il y a eu des maj
  // displayGallery();
};

// chargement de la galerie dans la modale
const displayModaleGallery = function () {

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

    if (response.status === 200 || response.status === 204) {
        removeFigure(figID);
    } else {
      throw new Error(response.status);
    }
  } catch (e) {
    console.log(e);
  }

};

const removeFigure = function (figID) {

  // retire la figure de la modale
  const figClassWrapper = ".portfolio_wrapper .fig"+figID;
  document.querySelector(figClassWrapper).remove();

  // retire la figure de la galerie
  const figClassGallery = ".fig"+figID;
  document.querySelector(figClassGallery).remove();
}

// async function encode(token) {

//   const encoder = new TextEncoder();
//   const data = encoder.encode(token);
//   const hash = await crypto.subtle.digest('SHA-256', data);
//   const hashArray = Array.from(new Uint8Array(hash));
//   const hashHex = hashArray.map(elem => elem.toString(16).padStart(2, '0')).join('');
//   return hashHex;
// }

// affichage du mode édition si l'utilisateur est connecté avec le token administrateur



