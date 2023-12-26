const formRegister = document.getElementById('registerForm');

formRegister.addEventListener('submit', a => {
    a.preventDefault();
    const data = new FormData(formRegister);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => {
        if (response.status === 200) {
            window.location.replace('/login');
        }
    })
})