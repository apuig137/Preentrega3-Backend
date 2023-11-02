const deleteForms = document.querySelectorAll('#deleteUser');
const updateRoleForms = document.querySelectorAll('#changeRole');

deleteForms.forEach(form => {
    form.addEventListener("submit", e => {
        e.preventDefault();
        
        const uid = form.dataset.uid;
        
        fetch('/api/users/' + uid, {
            method: 'DELETE'
        })
        .then(result => {
            if (result.status === 200) {
                window.location.replace('/admin');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud fetch:', error);
        });
    });
});

updateRoleForms.forEach(form => {
    form.addEventListener("submit", e => {
        e.preventDefault();

        const uid = form.dataset.uid;

        fetch('/api/users/updateRole/' + uid, {
            method: 'POST'
        })
        .then(result => {
            if (result.status === 200) {
                window.location.replace('/admin');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud fetch:', error);
        });
    });
});