const form = document.getElementById('logForm');
form.addEventListener('submit', a => {
    a.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
        if (response.status === 200) {
            window.location.replace('/profile');
        }
    })
})