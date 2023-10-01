const newPasswordForm = document.getElementById('newPasswordForm');

newPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(newPasswordForm);
    const newPassword = data.get("password");

    const newPasswordData = { newPassword: newPassword };

    fetch(`/api/sessions/changepass/${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPasswordData) 
    })
    .then(result => {
        if (result.status === 200) {
            window.location.replace('/');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud fetch:', error);
    });
});