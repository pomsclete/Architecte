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
	for (elem of error_messages) {
		elem.remove();
	}
	
	const email_input = document.querySelector("#login_form :nth-child(2)");
	const pass_input = document.querySelector("#login_form :nth-child(4)");

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
				console.log("mdp not valid");
				break;
			case 404:
				email_input.insertAdjacentHTML("afterend","<p>Cet utilisateur n'existe pas</p>");
				console.log('user not found');
				email_input.value = "";
				break;
			default:
				throw new Error();
			}

			pass_input.value="";
			return;
		}

		const session = await data;
		console.log(session);
		sessionStorage.setItem("token", session["token"]);

		console.log(sessionStorage.getItem("token"));
		window.location.href = "index.html";
	} catch (error) {
		console.log(new Error("Erreur d'authentification"));
	}
};



