const restartPasswordForm = document.getElementById('restartPasswordForm');

restartPasswordForm.addEventListener('submit', a => {
    a.preventDefault();
    const data = new FormData(restartPasswordForm);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/restartPassword', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => {
        if (response.status === 200) {
            window.location.replace('/login')
        }
    })
})