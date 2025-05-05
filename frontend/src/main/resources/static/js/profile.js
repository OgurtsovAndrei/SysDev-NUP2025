// Profile page functions
import { getUserProfile, updateUserProfile } from './model.js';

let isEditMode = false;
let userProfile = null;

// Initialize profile page
async function initializeProfilePage() {
  if (!document.getElementById('profileBody')) return; // Not on profile page

  try {
    // Fetch user profile data from API
    userProfile = await getUserProfile();

    // Render user profile data
    renderUserProfile();
  } catch (error) {
    console.error('Failed to load profile data:', error);
    // Navigate to home page instead of showing error
    window.location.href = 'index.html';
  }
}

// Render user profile data
function renderUserProfile() {
  if (!userProfile) return;

  // Set profile name in header
  document.getElementById('profileName').textContent = userProfile.name;

  // Set profile fields
  document.getElementById('profileEmail').textContent = userProfile.email;
  document.getElementById('profilePaymentMethod').textContent = userProfile.paymentMethod;

  // Format billing address
  const address = userProfile.billingAddress;
  const formattedAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  document.getElementById('profileBillingAddress').textContent = formattedAddress;
}

// Toggle edit mode
function toggleEditMode() {
  const editButton = document.getElementById('editButton');
  const profileBody = document.getElementById('profileBody');

  if (!userProfile) {
    console.error('Cannot edit profile: user profile data not loaded');
    return;
  }

  if (!isEditMode) {
    // Switch to edit mode
    isEditMode = true;
    editButton.textContent = 'Save Changes';
    editButton.classList.remove('btn-outline-primary');
    editButton.classList.add('btn-primary');
    editButton.onclick = saveProfileChanges;

    // Replace static fields with inputs
    document.getElementById('profileEmail').innerHTML = 
      `<input type="email" class="form-control" id="emailInput" value="${userProfile.email}">`;

    // Payment method (masked)
    document.getElementById('profilePaymentMethod').innerHTML = 
      `<input type="text" class="form-control" id="paymentMethodInput" value="${userProfile.paymentMethod}" placeholder="**** **** **** 1234">`;

    // Billing address
    const address = userProfile.billingAddress;
    document.getElementById('profileBillingAddress').innerHTML = 
      `<div class="mb-2">
        <input type="text" class="form-control" id="streetInput" value="${address.street}" placeholder="Street">
      </div>
      <div class="row mb-2">
        <div class="col">
          <input type="text" class="form-control" id="cityInput" value="${address.city}" placeholder="City">
        </div>
        <div class="col">
          <input type="text" class="form-control" id="stateInput" value="${address.state}" placeholder="State">
        </div>
      </div>
      <div class="row">
        <div class="col">
          <input type="text" class="form-control" id="zipCodeInput" value="${address.zipCode}" placeholder="Zip Code">
        </div>
        <div class="col">
          <input type="text" class="form-control" id="countryInput" value="${address.country}" placeholder="Country">
        </div>
      </div>`;
  } else {
    // This should not be called directly, saveProfileChanges will handle it
    renderUserProfile();
    resetEditMode();
  }
}

// Save profile changes
async function saveProfileChanges() {
  try {
    // Get updated values
    const updatedProfile = {
      email: document.getElementById('emailInput').value,
      paymentMethod: document.getElementById('paymentMethodInput').value,
      billingAddress: {
        street: document.getElementById('streetInput').value,
        city: document.getElementById('cityInput').value,
        state: document.getElementById('stateInput').value,
        zipCode: document.getElementById('zipCodeInput').value,
        country: document.getElementById('countryInput').value
      }
    };

    // Show loading state
    const editButton = document.getElementById('editButton');
    const originalButtonText = editButton.textContent;
    editButton.textContent = 'Saving...';
    editButton.disabled = true;

    // Send update to API
    const response = await updateUserProfile(updatedProfile);

    // Update local userProfile with the changes
    userProfile = {
      ...userProfile,
      ...updatedProfile
    };

    // Log the updated profile
    console.log('Profile updated:', response);

    // Show confirmation
    alert('Profile updated successfully!');

    // Reset edit mode
    resetEditMode();
  } catch (error) {
    console.error('Failed to update profile:', error);
    // Navigate to home page instead of showing error
    // window.location.href = 'index.html';
  }
}

// Reset edit mode
function resetEditMode() {
  isEditMode = false;
  const editButton = document.getElementById('editButton');
  editButton.textContent = 'Edit';
  editButton.classList.remove('btn-primary');
  editButton.classList.add('btn-outline-primary');
  editButton.disabled = false;
  editButton.onclick = toggleEditMode;

  // Re-render the profile
  renderUserProfile();
}

// Expose functions to the global scope
window.initializeProfilePage = initializeProfilePage;
window.toggleEditMode = toggleEditMode;
window.saveProfileChanges = saveProfileChanges;
