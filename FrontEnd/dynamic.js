const gallery_div = document.getElementById("gallery");

function addFigure (url, text, catID, id) { // fonction pour ajouter une figure au portfolio

	let image = document.createElement("img");
	image.src = url;
	image.alt = text;
	image.crossOrigin = "anonymous";

	let figure_caption = document.createElement("figcaption");
	figure_caption.appendChild(document.createTextNode(text));

	let figure = document.createElement("figure");

	figure.classList.add("category"+catID);
	figure.classList.add("fig"+id);
	figure.append(image);
	figure.append(figure_caption);

	gallery_div.append(figure);
}

function addFilter (name, catID) { // fonction pour ajouter un bouton de filtre
	const filter_div = document.getElementById("filters");
	let button = document.createElement("button");
	button.type = "button";
	button.classList.add("category"+catID);
	button.setAttribute("onclick", "selectFilter(\'category"+catID+"\')");
	button.append(document.createTextNode(name));
	filter_div.appendChild(button);
}

function selectFilter (filterClass) { // fonction pour sélectionner et appliquer un filtre (appelée via 'onclick')
	let filter = document.querySelectorAll("button."+filterClass);
	let allFilters = document.querySelectorAll("#filters button");

	// on déselectionne les autres boutons
	for (let button of allFilters) {
		button.classList.remove("selected");
	}

	//on sélectionne le nouveau
	filter[0].classList.add("selected");

	// affichage des bonnes images de la galerie
	let selectedImages;

	if (filterClass == 'category0') {
		// si le filter 'Tous' est sélectionné on prend toutes les figures
		let allFigures = document.querySelectorAll('.gallery figure');
		for (let figure of allFigures) {
			figure.style.display = 'inherit';
		}

	} else {
		let shownFigures = document.querySelectorAll('figure.'+filterClass);
		let hiddenFigures = document.querySelectorAll('.gallery figure:not(.'+filterClass+")");

		for (let figure of hiddenFigures) {
			figure.style.display = "none";
		}

		for (let figure of shownFigures) {
			figure.style.display = "inherit";
		}
	}
}

async function displayFilters () { // affichage des filtres sur la page

	let catJson = await fetchCategories();
	addFilter("Tous", 0);
	selectFilter("category0");

	// ajout dynamique des catégories
	for (let i = 0; i < catJson.length; i++) {
		addFilter(catJson[i]["name"],catJson[i]["id"]);
	}
};

async function fetchCategories () { // requête fetch pour GET/categories

	try {
		const response_cat = await fetch("http://localhost:5678/api/categories");
		let categories = '';

		if (response_cat.status === 200) {
			categories = await response_cat.json();
			return categories;
		} else {
			throw new Error("HTTP error: " + response_cat.status);
		}
	} catch (error) {
		console.log(error);
	};
};

const displayGallery = async function () { // requête fetch pour GET/works

	// clear gallery if existent
	gallery_div.replaceChildren();

	try {
		const response_works = await fetch("http://localhost:5678/api/works");

		if (response_works.status === 200) {
			works = await response_works.json();
			for (let i = 0; i < works.length; i++) {
				addFigure(works[i]["imageUrl"],works[i]["title"],works[i]["category"]["id"],works[i]["id"]);
			}
		} else {
			throw new Error("HTTP error: " + response_works.status);
		}
	} catch (error) {
		console.log(error);
	}
};

const loadGallery = async function (e) {
	displayGallery();
	displayFilters();
};

window.addEventListener("load", loadGallery);


