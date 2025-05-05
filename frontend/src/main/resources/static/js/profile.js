// Profile page functions
let isEditMode = false;
let currentUserProfile = null; // Store the current user profile

// Initialize profile page
async function initializeProfilePage() {
  if (!document.getElementById('profileBody')) return; // Not on profile page

  try {
    // Get user profile from API
    currentUserProfile = await getUserProfile();

    // Render user profile data
    renderUserProfile();
  } catch (error) {
    console.error('Error initializing profile page:', error);
    // Optionally display an error message to the user
    const profileBody = document.getElementById('profileBody');
    profileBody.innerHTML = '<div class="alert alert-danger">Failed to load profile data. Please try again later.</div>';
  }
}

// Render user profile data
function renderUserProfile() {
  if (!currentUserProfile) {
    console.error('No user profile data available');
    return;
  }

  // Set profile name in header
  document.getElementById('profileName').textContent = currentUserProfile.name;

  // Set profile fields
  document.getElementById('profileEmail').textContent = currentUserProfile.email;
  document.getElementById('profilePaymentMethod').textContent = currentUserProfile.paymentMethod;

  // Format billing address
  const address = currentUserProfile.billingAddress;
  const formattedAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  document.getElementById('profileBillingAddress').textContent = formattedAddress;
}

// Toggle edit mode
function toggleEditMode() {
  if (!currentUserProfile) {
    console.error('No user profile data available');
    return;
  }

  const editButton = document.getElementById('editButton');
  const profileBody = document.getElementById('profileBody');

  if (!isEditMode) {
    // Switch to edit mode
    isEditMode = true;
    editButton.textContent = 'Save Changes';
    editButton.classList.remove('btn-outline-primary');
    editButton.classList.add('btn-primary');
    editButton.onclick = saveProfileChanges;

    // Replace static fields with inputs
    document.getElementById('profileEmail').innerHTML = 
      `<input type="email" class="form-control" id="emailInput" value="${currentUserProfile.email}">`;

    // Payment method (masked)
    document.getElementById('profilePaymentMethod').innerHTML = 
      `<input type="text" class="form-control" id="paymentMethodInput" value="${currentUserProfile.paymentMethod}" placeholder="**** **** **** 1234">`;

    // Billing address
    const address = currentUserProfile.billingAddress;
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
  if (!currentUserProfile) {
    console.error('No user profile data available');
    return;
  }

  // Get updated values
  const updatedProfile = {
    name: currentUserProfile.name, // Name is not editable in this implementation
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

  try {
    // Submit updated profile to API
    const response = await updateUserProfile(updatedProfile);

    if (response.success) {
      // Update the current user profile with the new values
      currentUserProfile = await getUserProfile();

      // Show confirmation
      alert('Profile updated successfully!');

      // Reset edit mode
      resetEditMode();
    } else {
      alert(`Failed to update profile: ${response.message}`);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('An error occurred while updating your profile. Please try again later.');
  }
}

// Reset edit mode
function resetEditMode() {
  isEditMode = false;
  const editButton = document.getElementById('editButton');
  editButton.textContent = 'Edit';
  editButton.classList.remove('btn-primary');
  editButton.classList.add('btn-outline-primary');
  editButton.onclick = toggleEditMode;

  // Re-render the profile
  renderUserProfile();
}
