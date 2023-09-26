const logout = document.getElementById('logout');
const accessAdmin = document.getElementById('accessAdmin');


logout.addEventListener('click', e => {
    e.preventDefault();
    fetch('/api/jwt/logout', {
        method: 'GET',
    }).then(result => {
        if (result.status === 200) {
            alert('Sesion cerrada');
            window.location.replace('/users/login');
        }
    })
})


//Habilitamos el boton de acceso a la pagina privada solo si el usuario es admin, aunque el boton aparezca por error si el usuario no esta habilitado como admin la pagina privada no se muestra, ya que se valida por la sesion

accessAdmin.value === "admin" ? "" : accessAdmin.style.display = "none";
accessAdmin.addEventListener('click', e => {
    e.preventDefault();
    window.location.replace(`/api/jwt/private/${accessAdmin.value}`);
});

