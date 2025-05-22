//登录界面 
const showLoginBtn = document.getElementById('showLoginBtn');
const overlay = document.getElementById('overlay');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');

showLoginBtn.addEventListener('click', () => {
    overlay.style.display = 'block';
    loginModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    overlay.style.display = 'none';
    loginModal.style.display = 'none';
});

overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
    loginModal.style.display = 'none';
});

// 登录函数
const apiBase = 'http://localhost:2077';

// 登录函数
async function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        Swal.fire({
            icon: 'warning',
            title: '提示',
            text: '请输入用户名和密码'
        });
        return;
    }

    try {
        const res = await fetch(`${apiBase}/accounts`);
        const accounts = await res.json();

        if (!Array.isArray(accounts) || accounts.length === 0) {
            Swal.fire({
                icon: 'info',
                title: '暂无账号',
                text: '请先注册'
            });
            return;
        }

        const user = accounts.find(acc => acc.username === username && acc.password === password);
        if (user) {
            Swal.fire({
                icon: 'success',
                title: '登录成功',
                showConfirmButton: false,
                timer: 2000
            });
            // 后续操作
            setInterval(() => {
                window.location.href = '/manage';
            },2000);
        } else {
            Swal.fire({
                icon: 'error',
                title: '用户名或密码错误'
            });
        }
    } catch (err) {
        console.error('登录失败', err);
        Swal.fire({
            icon: 'error',
            title: '登录失败',
            text: '请稍后再试'
        });
    }
}

// 注册函数
async function register() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        Swal.fire({
            icon: 'warning',
            title: '提示',
            text: '请输入用户名和密码'
        });
        return;
    }

    try {
        const res = await fetch(`${apiBase}/accounts`);
        const accounts = await res.json();

        if (Array.isArray(accounts) && accounts.length > 0) {
            Swal.fire({
                icon: 'info',
                title: '已有账号存在',
                text: '请直接登录'
            });
            return;
        }

        const regRes = await fetch(`${apiBase}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const regData = await regRes.json();

        if (regRes.ok) {
            Swal.fire({
                icon: 'success',
                title: '注册成功',
                text: '请登录',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: '注册失败',
                text: regData.error || '请稍后再试'
            });
        }
    } catch (err) {
        console.error('注册失败', err);
        Swal.fire({
            icon: 'error',
            title: '注册失败',
            text: '请稍后再试'
        });
    }
}

