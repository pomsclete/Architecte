async function login (user) {
	const httpOptions = {
		method: "GET",
		// headers: {'Content-Type': 'application/json;charset=utf-8',
					// 'accept': 'application/json'},
		// body: JSON.stringify(user)
	};

	const url = "http://localhost:5678/api/users/login";

	try {
		console.log("Coucou");
		const response = await fetch(url,httpOptions);
		return response;
	} catch (error) {
		console.log(error);
		console.log("Hello");
	}
}


document.getElementById("login_form").onsubmit = async () => {

	let form = document.getElementsByTagName('form');
	console.log(form[0]);
	let form_data = new FormData(form[0]);
	const login_info = {
		email: form_data.get("email"),
		password: form_data.get("password")
	};

	console.log("coucou1");
	try {
		let response = login(login_info);
		console.log("coucou2");
		let data;
		switch (response.status) {
		case 200:
			data = await response.json();
			break;
		case 401:
			throw new Error("Mot de passe incorrect");
			break;
		case 404:
			throw new Error("Cet utilisateur n'existe pas");
			break;
		default:
			throw new Error("Erreur d'authentification");
		}

		let session = await data;
		sessionStorage.setItem("token", session[0]["token"]);
		window.location.href = "index.html";
	} catch (error) {
		console.log(error);
	}
};