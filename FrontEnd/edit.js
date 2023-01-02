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

function showEditionMode () {
  console.log("coucou");
  let editItems = document.querySelectorAll(".edit_area");
  for (item of editItems) {
    item.style.display = null;
  }
}

function hideEditionMode () {
  let editItems = document.querySelectorAll(".edit_area");
  for (item of editItems) {
    item.style.display = 'none';
  }
}

const modal = document.querySelector(".modal");

document.querySelector(".edit_portfolio").onclick = (e) => {
  e.preventDefault();
  modal.style.display = null;
};

// chargement de la galerie dans la modale



// async function encode(token) {

//   const encoder = new TextEncoder();
//   const data = encoder.encode(token);
//   const hash = await crypto.subtle.digest('SHA-256', data);
//   const hashArray = Array.from(new Uint8Array(hash));
//   const hashHex = hashArray.map(elem => elem.toString(16).padStart(2, '0')).join('');
//   return hashHex;
// }

// affichage du mode édition si l'utilisateur est connecté avec le token administrateur



