const forms = document.querySelectorAll('#addProductToCart');

forms.forEach(form => {
    form.addEventListener("submit", e => {
        e.preventDefault();
        
        // Obtener el valor "pid" de los datos personalizados del formulario
        const pid = form.dataset.pid;
        
        fetch('/api/carts/64aac67fe5099ade10431358/product/' + pid, {
            method: 'POST'
        })
        .then(result => {
            if (result.status === 200) {
                window.location.replace('/api/carts/64aac67fe5099ade10431358'); // Redirigir al usuario a la página de carrito
            }
        })
        .catch(error => {
            console.error('Error en la solicitud fetch:', error);
        });
    });
});