import {loginUser as loginUserAPI, registerUser as registerUserAPI} from './model.js';

async function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!email || !password) {
        document.getElementById('loginError').textContent = 'Please enter both email and password.';
        document.getElementById('loginError').classList.remove('d-none');
        document.getElementById('loginSuccess').classList.add('d-none');
        return;
    }

    try {
        const response = await loginUserAPI(email, password, rememberMe);

        if (response.success) {
            document.getElementById('loginSuccess').classList.remove('d-none');
            document.getElementById('loginError').classList.add('d-none');

            console.log('Login successful');

            if (response.token) {
                localStorage.setItem('authToken', response.token);
            }

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            document.getElementById('loginError').textContent = response.message || 'Login failed. Please try again.';
            document.getElementById('loginError').classList.remove('d-none');
            document.getElementById('loginSuccess').classList.add('d-none');

            console.log('Login failed:', response.message);
        }
    } catch (error) {
        document.getElementById('loginError').textContent = 'An error occurred during login. Please try again.';
        document.getElementById('loginError').classList.remove('d-none');
        document.getElementById('loginSuccess').classList.add('d-none');

        console.error('Login error:', error);
    }
}

function initializeRegisterPage() {
}

async function registerUser() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    if (!fullName || !email || !password || !confirmPassword) {
        alert('Please fill in all required fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (!agreeTerms) {
        alert('You must agree to the Terms and Conditions.');
        return;
    }

    try {
        const response = await registerUserAPI(fullName, email, password, confirmPassword, agreeTerms);

        if (response.success) {
            console.log('User registered successfully');

            document.getElementById('registerSuccess').classList.remove('d-none');

            document.getElementById('registerForm').reset();

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        } else {
            alert(response.message || 'Registration failed. Please try again.');

            console.log('Registration failed:', response.message);
        }
    } catch (error) {
        alert('An error occurred during registration. Please try again.');

        console.error('Registration error:', error);
    }
}

function isLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

function logoutUser() {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
}

window.loginUser = loginUser;
window.registerUser = registerUser;
window.initializeRegisterPage = initializeRegisterPage;
window.isLoggedIn = isLoggedIn;
window.logoutUser = logoutUser;
