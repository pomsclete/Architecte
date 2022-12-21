
// fonction pour ajouter une figure au portfolio

function addFigure (url, text, catID) {
	const gallery_div = document.getElementById("gallery");

	let image = document.createElement("img");
	image.src = url;
	image.alt = text;
	image.crossOrigin = "anonymous";

	let figure_caption = document.createElement("figcaption");
	figure_caption.appendChild(document.createTextNode(text));

	let figure = document.createElement("figure");

	figure.classList.add("category"+catID);
	figure.appendChild(image);
	figure.appendChild(figure_caption);

	gallery_div.appendChild(figure);
}

// fonction pour ajouter un bouton de filtre

function addFilter (name, catID) {
	const filter_div = document.getElementById("filters");
	let button = document.createElement("button");
	button.type = "button";
	button.classList.add("category"+catID);
	button.setAttribute("onclick", "selectFilter(\'category"+catID+"\')");
	button.appendChild(document.createTextNode(name));

	filter_div.appendChild(button);
}

// fonction pour sélectionner et appliquer un filtre (appelée via 'onclick')

function selectFilter (filterClass) {
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
		// console.log(document.querySelectorAll('.gallery figure'));
		let allFigures = document.querySelectorAll('.gallery figure');
		for (let figure of allFigures) {
			figure.style.display = 'inherit';
		}

	} else {
		let shownFigures = document.querySelectorAll('figure.'+filterClass);
		let hiddenFigures = document.querySelectorAll
			('.gallery figure:not(.'+filterClass+")");

		for (let figure of hiddenFigures) {
			figure.style.display = "none";
		}

		for (let figure of shownFigures) {
			figure.style.display = "inherit";
		}
	}
}

// requête fetch pour GET/works

const promise_works = fetch("http://localhost:5678/api/works");

promise_works
.then(function(response) {
		return response.json();
})
.then(function(works) {
	for (let i = 0; i < works.length; i++) {
		// ajout de la figure existante dans la BD
		// console.log(works[i]["category"]["name"])
		addFigure(works[i]["imageUrl"],works[i]["title"],works[i]["category"]["id"]);
	}
})
.catch(function(error) {
	console.log("Something went wrong.");
});

// requête fetch pour GET/categories

const promise_cat = fetch("http://localhost:5678/api/categories");

promise_cat
.then(function(response) {
	return response.json();
})
.then( function(categories) {
	// ajout de la catégorie "Tous"
	addFilter("Tous", 0);
	selectFilter("category0");

	// ajout dynamique des catégories
	for (let i = 0; i < categories.length; i++) {
		addFilter(categories[i]["name"],categories[i]["id"]);
	}
});

