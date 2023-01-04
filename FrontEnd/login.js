async function login_fetch (user) {

	const myheaders = new Headers ({
		'Content-Type': 'application/json;charset=utf-8',
		'accept': 'application/json'
	});

	const httpOptions = {
		method: "POST",
		headers: myheaders,
		body: JSON.stringify(user)
	};

	const url = "http://localhost:5678/api/users/login";
	const response = await fetch(url,httpOptions);
	return response;
}

document.getElementById("login_form").onsubmit = async (event) => {

	event.preventDefault();

	/* Remove error messages if any */
	const error_messages = document.querySelectorAll("#login_form p");
	error_messages.forEach((elem) => {elem.remove()});

	const email_input = document.getElementById("email_input");
	const pass_input = document.getElementById("pass_input");

	let form = document.getElementsByTagName('form');
	let form_data = new FormData(form[0]);

	const login_info = {
		"email": form_data.get("email"),
		"password": form_data.get("password")
	};

	try {
		const response = await login_fetch(login_info);
		let data = '';

		if (response.status === 200) {
			data = await response.json();
		} else {
			switch (response.status) {
			case 401:
				pass_input.insertAdjacentHTML("afterend","<p>Mot de passe incorrect</p>");
				break;
			case 404:
				email_input.insertAdjacentHTML("afterend","<p>Cet utilisateur n'existe pas</p>");
				email_input.value = "";
				break;
			default:
				throw new Error();
			}

			pass_input.value="";
			return;
		}

		const session = await data;
		sessionStorage.setItem("token", session["token"]);
		window.location.href = "index.html";
	} catch (error) {
		console.log(new Error("Erreur d'authentification"));
	}
};



