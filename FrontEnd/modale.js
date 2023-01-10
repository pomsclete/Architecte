const editItems = document.querySelectorAll(".edit_area");
const editPortfolio = document.querySelector(".edit_portfolio");
const modal = document.querySelector(".modal");
const modaleGalleryWrapper = document.querySelector(".portfolio_wrapper");
const closeMark = document.querySelector(".fa-xmark");
const backMark = document.querySelector(".fa-arrow-left");
const defaultModaleView = document.querySelectorAll(".js_default_view");
const addModaleView = document.querySelectorAll(".js_add_view");
const input = document.getElementById("image");
const infoText = document.querySelector(".message-info");
const form = document.getElementById("add_photo_form");
const addButton = document.getElementById("send_photo_button");
const logInOut = document.getElementById("login_logout");

// Vérifie la présence d'un token de session au chargement
document.addEventListener('DOMContentLoaded', async (event) => {

  const token = sessionStorage.getItem("token");

  if (token) {
    showEditionMode();
  } else {
    hideEditionMode();
  }
});

function showEditionMode () { // Montre le mode édition
  for (item of editItems) {
    item.style.display = null;
  }
  document.body.style.position = 'relative'
  document.body.style.top = '60px';

  editPortfolio.addEventListener("click",openModale);
  logInOut.replaceChildren(document.createTextNode("logout"));
  logInOut.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    hideEditionMode();
    e.currentTarget.removeEventListener(e.type,arguments.callee);
  });
}

function hideEditionMode () { // Cache le mode édition
  for (item of editItems) {
    item.style.display = 'none';
  }
  logInOut.replaceChildren(document.createTextNode("login"));
  document.body.style.position = 'inherit';
  document.body.style.top = '0';
  editPortfolio.removeEventListener("click",openModale);
}

function openModale (e) { // Ouvre la modale
  e.preventDefault();

  modal.style.display = null;
  document.body.style.overflow = "hidden";

  closeMark.addEventListener("click", closeModale);
  modal.addEventListener("click",closeModale);
  document.querySelector(".modal_wrapper").addEventListener("click", stopPropagation);
  document.querySelector("button.add_photo").addEventListener("click", showAddView);
  input.addEventListener("change",updateImagePreview);
  backMark.addEventListener("click",showDefaultView);
  addButton.addEventListener("click",uploadProject);

  showDefaultView(new CustomEvent('modaleOpened'));
  displayModaleGallery();
}

function stopPropagation (e) { // Arrête la propagation du click
  e.stopPropagation();
}

function closeModale (e) { // Ferme la modale
  e.preventDefault();

  modal.style.display = "none";
  document.body.style.overflow = 'inherit';

  closeMark.removeEventListener("click",closeModale);
  modal.removeEventListener("click",closeModale);
  document.querySelector(".modal_wrapper").removeEventListener("click",stopPropagation);
  document.querySelector("button.add_photo").removeEventListener("click",showAddView);
  input.removeEventListener("change",updateImagePreview);
  backMark.removeEventListener("click",showDefaultView);
  addButton.removeEventListener("click",uploadProject);

  const iconList = document.querySelectorAll(".icon_del");
  for (icon of iconList) {
    icon.removeEventListener("click",deleteWork);
  }

  modaleGalleryWrapper.replaceChildren();  // Suppression de la galerie de la modale
}

function displayModaleGallery () { // chargement de la galerie dans la modale
  
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

async function deleteWork (figID) { // Suppression d'un projet

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
        displayInfoMessage("delete","Projet supprimé de la galerie");
    } else {
      throw new Error(response.status);
    }
  } catch (e) {
    console.log(e);
  }
};

function displayInfoMessage (action,texte) {

  let timeout = false;
  if (action === "delete") {
    timeout = true;
  }

  infoText.replaceChildren(document.createTextNode(texte));
  infoText.style.visibility = 'visible';

  if (!timeout) {
    return;
  }

  setTimeout( () => {
    infoText.classList.add("fadeOut");
  }, 5000);
};

function removeFigure (figID) {

  // retire la figure de la modale
  const figClassWrapper = ".portfolio_wrapper .fig"+figID;
  document.querySelector(figClassWrapper).remove();

  // retire la figure de la galerie
  const figClassGallery = ".fig"+figID;
  document.querySelector(figClassGallery).remove();
}

function showAddView (e) { // Affichage de la vue d'ajout de photo
  e.preventDefault();

  document.querySelector(".modal_wrapper h3").replaceChildren(document.createTextNode("Ajout photo"));

  for (item of defaultModaleView) {
    item.style.display = "none";
  }

  for (item of addModaleView) {
    item.style.display = null
  }

  form.reset();
  updateImagePreview(new CustomEvent("form-reseted"));
}

function showDefaultView (e) { // Affiche la vue par défaut de la modale
  e.preventDefault();

  infoText.replaceChildren();
  infoText.style.visibility = "hidden";

  document.querySelector(".modal_wrapper h3").replaceChildren(document.createTextNode("Galerie photo"));
  for (item of defaultModaleView) {
    item.style.display = null
  }

  for (item of addModaleView) {
    item.style.display = "none";
  }
}

function updateImagePreview (e) {

  const fileList = input.files;
  const currentFile = fileList[0];
  const content = document.getElementById("image_input_content");
  const image_div = document.getElementById("image_preview");

  infoText.replaceChildren();
  infoText.style.visibility = "hidden";

  if (fileList.length === 0 || currentFile.size === 0) {
    showImagePreviewContent(content,image_div);
    return;
  }

  if (currentFile.type != "image/png" && currentFile.type != "image/jpg" && currentFile.type != "image/jpeg") {
    showImagePreviewContent(content,image_div);
    displayInfoMessage("add","Format invalide ; Formats acceptés : png et jpg");
    return;
  }

  if (currentFile.size > 4194304) {
    showImagePreviewContent(content,image_div);
    displayInfoMessage("add","Fichier trop volumineux");
    return;
  }

  hideImagePreviewContent(content,image_div,currentFile);
}

function showImagePreviewContent (content,image_div) {

  content.style.opacity = '1';
  image_div.style.display = "none";
  image_div.replaceChildren();
  image_div.removeEventListener("click",propagationToInputFile);
}

function hideImagePreviewContent (content,image_div,file) {

  content.style.opacity = '0';
  image_div.style.display = null;
  const image = document.createElement('img');
  image.src = URL.createObjectURL(file);
  image_div.replaceChildren(image);
  image_div.addEventListener("click",propagationToInputFile);
}

function propagationToInputFile (e) {
  input.click();
}

async function uploadProject (e) {
  e.preventDefault();

  form_data = new FormData(form);
  const image = form_data.get("image");

  if (image.size === 0) {
    displayInfoMessage("add","Une image est requise");
    return;
  }

  if (form_data.get("title") === "") {
    displayInfoMessage("add","Un titre est requis");
    return;
  }

  const bearer = "Bearer " + sessionStorage.getItem("token");

  const myheaders = new Headers ({
    'accept': 'application/json',
    'Authorization': bearer
  });

  const httpOptions = {
    method: "POST",
    headers: myheaders,
    body: form_data
  };

  const response = await fetch("http://localhost:5678/api/works",httpOptions);

  if (response.status != 201) {
    return;
  }

  closeModale(new CustomEvent("modale-closed"));
  displayGallery();
}