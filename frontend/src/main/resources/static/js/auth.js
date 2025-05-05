// Login and Register page functions
import { loginUser as loginUserAPI, registerUser as registerUserAPI } from './model.js';

// Login user
async function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  // Validate form
  if (!email || !password) {
    document.getElementById('loginError').textContent = 'Please enter both email and password.';
    document.getElementById('loginError').classList.remove('d-none');
    document.getElementById('loginSuccess').classList.add('d-none');
    return;
  }

  try {
    // Call the API to login
    const response = await loginUserAPI(email, password, rememberMe);

    if (response.success) {
      // Show success message
      document.getElementById('loginSuccess').classList.remove('d-none');
      document.getElementById('loginError').classList.add('d-none');

      // Log success
      console.log('Login successful');

      // Store the token in localStorage
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }

      // Redirect after login
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      // Show error message
      document.getElementById('loginError').textContent = response.message || 'Login failed. Please try again.';
      document.getElementById('loginError').classList.remove('d-none');
      document.getElementById('loginSuccess').classList.add('d-none');

      // Log error
      console.log('Login failed:', response.message);
    }
  } catch (error) {
    // Show error message
    document.getElementById('loginError').textContent = 'An error occurred during login. Please try again.';
    document.getElementById('loginError').classList.remove('d-none');
    document.getElementById('loginSuccess').classList.add('d-none');

    // Log error
    console.error('Login error:', error);
  }
}

// Initialize register page
function initializeRegisterPage() {
  // No initialization needed after removing package selection
}

// Register user
async function registerUser() {
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const agreeTerms = document.getElementById('agreeTerms').checked;

  // Validate form
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
    // Call the API to register
    const response = await registerUserAPI(fullName, email, password, confirmPassword, agreeTerms);

    if (response.success) {
      // Log registration
      console.log('User registered successfully');

      // Show success message
      document.getElementById('registerSuccess').classList.remove('d-none');

      // Reset form
      document.getElementById('registerForm').reset();

      // Redirect after registration
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 3000);
    } else {
      // Show error message
      alert(response.message || 'Registration failed. Please try again.');

      // Log error
      console.log('Registration failed:', response.message);
    }
  } catch (error) {
    // Show error message
    alert('An error occurred during registration. Please try again.');

    // Log error
    console.error('Registration error:', error);
  }
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('authToken') !== null;
}

// Logout user
function logoutUser() {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
}

// Expose functions to the global scope
window.loginUser = loginUser;
window.registerUser = registerUser;
window.initializeRegisterPage = initializeRegisterPage;
window.isLoggedIn = isLoggedIn;
window.logoutUser = logoutUser;
