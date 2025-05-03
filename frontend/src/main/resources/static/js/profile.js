// Profile page functions
let isEditMode = false;

// Initialize profile page
function initializeProfilePage() {
  if (!document.getElementById('profileBody')) return; // Not on profile page

  // Render user profile data
  renderUserProfile();
}

// Render user profile data
function renderUserProfile() {
  const userInfo = mockData.userInfo;

  // Set profile name in header
  document.getElementById('profileName').textContent = userInfo.name;

  // Set profile fields
  document.getElementById('profileEmail').textContent = userInfo.email;
  document.getElementById('profilePaymentMethod').textContent = userInfo.paymentMethod;

  // Format billing address
  const address = userInfo.billingAddress;
  const formattedAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  document.getElementById('profileBillingAddress').textContent = formattedAddress;
}

// Toggle edit mode
function toggleEditMode() {
  const editButton = document.getElementById('editButton');
  const profileBody = document.getElementById('profileBody');
  const userInfo = mockData.userInfo;

  if (!isEditMode) {
    // Switch to edit mode
    isEditMode = true;
    editButton.textContent = 'Save Changes';
    editButton.classList.remove('btn-outline-primary');
    editButton.classList.add('btn-primary');
    editButton.onclick = saveProfileChanges;

    // Replace static fields with inputs
    document.getElementById('profileEmail').innerHTML = 
      `<input type="email" class="form-control" id="emailInput" value="${userInfo.email}">`;

    // Payment method (masked)
    document.getElementById('profilePaymentMethod').innerHTML = 
      `<input type="text" class="form-control" id="paymentMethodInput" value="${userInfo.paymentMethod}" placeholder="**** **** **** 1234">`;

    // Billing address
    const address = userInfo.billingAddress;
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
function saveProfileChanges() {
  // Get updated values
  const updatedProfile = {
    name: mockData.userInfo.name, // Name is not editable in this implementation
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

  // Log the updated profile
  console.log('Profile updated:', updatedProfile);

  // Show confirmation
  alert('Profile updated successfully!');

  // Reset edit mode
  resetEditMode();
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