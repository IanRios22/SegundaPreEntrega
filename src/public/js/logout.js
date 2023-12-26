const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', a => {
    a.preventDefault();
    fetch('/api/sessions/logout', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        }
    }).then(response => {
        if (response.status === 200) {
            window.location.replace('/login');
        }
    })
})