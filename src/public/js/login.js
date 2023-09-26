const form = document.getElementById('loginForm');


/* form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
            //aca se setean los headers para el acceso con jwt
            
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.replace('/users');
        }else if (result.status === 401) {
            alert('Usuario o contraseña incorrectos');
        };
    })
}); */

//request a la api de JWT
form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/jwt/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
            //aca se setean los headers para el acceso con jwt
            
        }
    }).then(result => {
        if (result.status === 200) {
            console.log(result);
            result.json()
            .then(json => { 
                //set local storage
                /* console.log(json);
                localStorage.setItem('authtoken', json.jwt); */

                //set token en cookie
                console.log("Cookie generada: "+ document.cookie);
                window.location.replace('/users');
            } 
            )}
            else if (result.status === 401) {
                alert('Usuario o contraseña incorrectos');
            };
    });
});
