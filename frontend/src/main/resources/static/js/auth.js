// Login and Register page functions

// Login user

import {loginUserCall} from "./model";

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

  // Simulate login check (in a real app, this would be an API call)
  console.log('Login attempt:', { email, password, rememberMe });
  const result = await loginUserCall(email, password, rememberMe)
  // For demo purposes, accept any valid email format
  if (result.success) {
    // Show success message
    document.getElementById('loginSuccess').classList.remove('d-none');
    document.getElementById('loginError').classList.add('d-none');

    // Log success
    console.log('Login successful');

    // Simulate redirect after login
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  } else {
    // Show error message
    document.getElementById('loginError').textContent = 'Invalid email or password. Password must be at least 6 characters.';
    document.getElementById('loginError').classList.remove('d-none');
    document.getElementById('loginSuccess').classList.add('d-none');

    // Log error
    console.log('Login failed: Invalid credentials');
  }
}

// Initialize register page
function initializeRegisterPage() {
  // No initialization needed after removing package selection
}

// Register user
function registerUser() {
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

  // Create user object (in a real app, this would be sent to an API)
  const newUser = {
    name: fullName,
    email: email,
    registrationDate: new Date().toISOString().split('T')[0]
  };

  // Log registration
  console.log('User registered:', newUser);

  // Show success message
  document.getElementById('registerSuccess').classList.remove('d-none');

  // Reset form
  document.getElementById('registerForm').reset();

  // Simulate redirect after registration
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 3000);
}

export {
  registerUser,
  loginUser,
  initializeRegisterPage
}