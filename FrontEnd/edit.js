document.addEventListener('DOMContentLoaded', async (event) => {
	const hash = await encode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4');
	console.log('coucou');
});

async function encode(message) {

  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(elem => elem.toString(16).join(''));
  	// .padStart(2, '0'))
  console.log(hashHex);
  return hashArray;
}


