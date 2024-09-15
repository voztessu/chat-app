const userData = JSON.parse(localStorage.getItem("userData"));
if (userData) {
    window.location.href = "/";
}
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('userData', JSON.stringify({
                    username: data.username,
                    role: data.role
                }));
                window.location.href = '/';
            } else {
                document.getElementById('error-message').textContent = 'Sai tên tài khoản hoặc mật khẩu';
                document.getElementById('error-message').style.display = 'block';
            }
        });
});