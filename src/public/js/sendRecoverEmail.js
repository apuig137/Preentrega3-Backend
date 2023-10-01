const sendEmailForm = document.getElementById('emailPasswordForm');

sendEmailForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(sendEmailForm);
    const email = data.get("email");
    fetch(`/api/sessions/sendrecovermail/${email}`, {
        method: 'GET',
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
