console.log("G4UltimateMobile CRM Prototype Initialized");

// Navigation functions
function goToOrderPage() {
  console.log("Navigating to Order Page");
  window.location.href = "order.html";
}

function goToUsagePage() {
  console.log("Navigating to Usage Page");
  window.location.href = "usage.html";
}

function goToChatPage() {
  console.log("Navigating to Chat Page");
  window.location.href = "chat.html";
}

function goToFeedbackPage() {
  console.log("Navigating to Feedback Page");
  window.location.href = "feedback.html";
}

function goToProfilePage() {
  console.log("Navigating to Profile Page");
  window.location.href = "profile.html";
}

function goToLoginPage() {
  console.log("Navigating to Login Page");
  window.location.href = "login.html";
}

function goToRegisterPage() {
  console.log("Navigating to Register Page");
  window.location.href = "register.html";
}

// Example of using mock data
function displayAvailablePackages() {
  console.log("Displaying available packages:", mockData.packages);
  // In a real implementation, this would populate a UI element with the packages
}

function displayUserInfo() {
  console.log("Displaying user info:", mockData.userInfo);
  // In a real implementation, this would populate UI elements with user information
}

// Order page functions
let currentOrder = {
  packageType: '',
  options: {},
  promoCode: '',
  discount: 0,
  basePrice: 0,
  totalPrice: 0
};

// Initialize package type dropdown
function initializePackageTypeDropdown() {
  const packageTypeSelect = document.getElementById('packageType');
  if (!packageTypeSelect) return; // Not on order page

  // Clear existing options (except the first one)
  while (packageTypeSelect.options.length > 1) {
    packageTypeSelect.remove(1);
  }

  // Add options from mock data
  mockData.packageTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type.id;
    option.textContent = type.name;
    packageTypeSelect.appendChild(option);
  });
}

// Update package options based on selected package type
function updatePackageOptions() {
  const packageType = document.getElementById('packageType').value;
  currentOrder.packageType = packageType;

  // Hide all option sections
  document.getElementById('mobileOptions').classList.add('d-none');
  document.getElementById('broadbandOptions').classList.add('d-none');
  document.getElementById('tabletOptions').classList.add('d-none');

  // Show the relevant section based on selection
  if (packageType === 'mobile') {
    document.getElementById('mobileOptions').classList.remove('d-none');
    populateMobileOptions();
  } else if (packageType === 'broadband') {
    document.getElementById('broadbandOptions').classList.remove('d-none');
    populateBroadbandOptions();
  } else if (packageType === 'tablet') {
    document.getElementById('tabletOptions').classList.remove('d-none');
    populateTabletOptions();
  }

  // Reset current order options
  currentOrder.options = {};
  currentOrder.basePrice = getBasePrice(packageType);

  // Update the order summary
  updateOrderSummary();
}

// Populate mobile options
function populateMobileOptions() {
  // Populate phone models
  const phoneModelSelect = document.getElementById('phoneModel');
  while (phoneModelSelect.options.length > 1) {
    phoneModelSelect.remove(1);
  }

  mockData.packageOptions.mobile.phoneModels.forEach(model => {
    const option = document.createElement('option');
    option.value = model.id;
    option.textContent = `${model.name} (+$${model.price.toFixed(2)})`;
    phoneModelSelect.appendChild(option);
  });

  // Populate add-ons
  const addOnsContainer = document.getElementById('mobileAddOns');
  addOnsContainer.innerHTML = '';

  mockData.packageOptions.mobile.addOns.forEach(addon => {
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'form-check';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input';
    checkbox.id = `addon-${addon.id}`;
    checkbox.value = addon.id;
    checkbox.onchange = updateOrderSummary;

    const label = document.createElement('label');
    label.className = 'form-check-label';
    label.htmlFor = `addon-${addon.id}`;
    label.textContent = `${addon.name} (+$${addon.price.toFixed(2)})`;

    checkboxDiv.appendChild(checkbox);
    checkboxDiv.appendChild(label);
    addOnsContainer.appendChild(checkboxDiv);
  });
}

// Populate broadband options
function populateBroadbandOptions() {
  const routerSelect = document.getElementById('routerOption');
  while (routerSelect.options.length > 1) {
    routerSelect.remove(1);
  }

  mockData.packageOptions.broadband.routers.forEach(router => {
    const option = document.createElement('option');
    option.value = router.id;
    option.textContent = `${router.name} ${router.price > 0 ? '(+$' + router.price.toFixed(2) + ')' : '(Included)'}`;
    routerSelect.appendChild(option);
  });
}

// Populate tablet options
function populateTabletOptions() {
  // Populate tablet models
  const tabletModelSelect = document.getElementById('tabletModel');
  while (tabletModelSelect.options.length > 1) {
    tabletModelSelect.remove(1);
  }

  mockData.packageOptions.tablet.models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.id;
    option.textContent = `${model.name} (+$${model.price.toFixed(2)})`;
    tabletModelSelect.appendChild(option);
  });

  // Populate data plans
  const dataPlanSelect = document.getElementById('dataPlan');
  while (dataPlanSelect.options.length > 1) {
    dataPlanSelect.remove(1);
  }

  mockData.packageOptions.tablet.dataPlans.forEach(plan => {
    const option = document.createElement('option');
    option.value = plan.id;
    option.textContent = `${plan.name} (+$${plan.price.toFixed(2)})`;
    dataPlanSelect.appendChild(option);
  });
}

// Get base price for package type
function getBasePrice(packageType) {
  switch (packageType) {
    case 'mobile':
      return 29.99;
    case 'broadband':
      return 39.99;
    case 'tablet':
      return 19.99;
    default:
      return 0;
  }
}

// Update order summary
function updateOrderSummary() {
  if (!currentOrder.packageType) return;

  let totalPrice = currentOrder.basePrice;
  const summaryDetails = document.getElementById('orderSummaryDetails');
  let summaryHTML = `<p><strong>Base Package:</strong> $${currentOrder.basePrice.toFixed(2)}</p>`;

  // Add selected options to the summary
  if (currentOrder.packageType === 'mobile') {
    const phoneModelSelect = document.getElementById('phoneModel');
    if (phoneModelSelect.value) {
      const selectedModel = mockData.packageOptions.mobile.phoneModels.find(m => m.id === phoneModelSelect.value);
      if (selectedModel) {
        totalPrice += selectedModel.price;
        summaryHTML += `<p><strong>Phone Model:</strong> ${selectedModel.name} (+$${selectedModel.price.toFixed(2)})</p>`;
        currentOrder.options.phoneModel = selectedModel;
      }
    }

    // Check for selected add-ons
    const selectedAddOns = [];
    mockData.packageOptions.mobile.addOns.forEach(addon => {
      const checkbox = document.getElementById(`addon-${addon.id}`);
      if (checkbox && checkbox.checked) {
        totalPrice += addon.price;
        selectedAddOns.push(addon);
        summaryHTML += `<p><strong>Add-on:</strong> ${addon.name} (+$${addon.price.toFixed(2)})</p>`;
      }
    });

    if (selectedAddOns.length > 0) {
      currentOrder.options.addOns = selectedAddOns;
    }
  } else if (currentOrder.packageType === 'broadband') {
    const routerSelect = document.getElementById('routerOption');
    if (routerSelect.value) {
      const selectedRouter = mockData.packageOptions.broadband.routers.find(r => r.id === routerSelect.value);
      if (selectedRouter) {
        totalPrice += selectedRouter.price;
        summaryHTML += `<p><strong>Router:</strong> ${selectedRouter.name} ${selectedRouter.price > 0 ? '(+$' + selectedRouter.price.toFixed(2) + ')' : '(Included)'}</p>`;
        currentOrder.options.router = selectedRouter;
      }
    }
  } else if (currentOrder.packageType === 'tablet') {
    const tabletModelSelect = document.getElementById('tabletModel');
    if (tabletModelSelect.value) {
      const selectedModel = mockData.packageOptions.tablet.models.find(m => m.id === tabletModelSelect.value);
      if (selectedModel) {
        totalPrice += selectedModel.price;
        summaryHTML += `<p><strong>Tablet Model:</strong> ${selectedModel.name} (+$${selectedModel.price.toFixed(2)})</p>`;
        currentOrder.options.tabletModel = selectedModel;
      }
    }

    const dataPlanSelect = document.getElementById('dataPlan');
    if (dataPlanSelect.value) {
      const selectedPlan = mockData.packageOptions.tablet.dataPlans.find(p => p.id === dataPlanSelect.value);
      if (selectedPlan) {
        totalPrice += selectedPlan.price;
        summaryHTML += `<p><strong>Data Plan:</strong> ${selectedPlan.name} (+$${selectedPlan.price.toFixed(2)})</p>`;
        currentOrder.options.dataPlan = selectedPlan;
      }
    }
  }

  // Apply discount if promo code is active
  if (currentOrder.discount > 0) {
    const discountAmount = totalPrice * currentOrder.discount;
    totalPrice -= discountAmount;
    summaryHTML += `<p><strong>Discount:</strong> -$${discountAmount.toFixed(2)} (${currentOrder.discount * 100}% off)</p>`;
  }

  // Update the summary and total
  summaryDetails.innerHTML = summaryHTML;
  document.getElementById('orderTotal').textContent = `$${totalPrice.toFixed(2)}`;
  currentOrder.totalPrice = totalPrice;
}

// Apply promo code
function applyPromoCode() {
  const promoCodeInput = document.getElementById('promoCode');
  const promoCode = promoCodeInput.value.trim();
  const feedbackElement = document.getElementById('promoCodeFeedback');

  if (!promoCode) {
    feedbackElement.textContent = 'Please enter a promo code.';
    feedbackElement.className = 'form-text text-danger';
    return;
  }

  // Check if promo code is valid
  const validPromo = mockData.promoCodes.find(p => p.code === promoCode);

  if (validPromo) {
    currentOrder.promoCode = promoCode;
    currentOrder.discount = validPromo.discount;
    feedbackElement.textContent = `Promo code applied: ${validPromo.description}`;
    feedbackElement.className = 'form-text text-success';
    updateOrderSummary();
  } else {
    currentOrder.promoCode = '';
    currentOrder.discount = 0;
    feedbackElement.textContent = 'Invalid promo code.';
    feedbackElement.className = 'form-text text-danger';
    updateOrderSummary();
  }
}

// Submit order
function submitOrder() {
  if (!currentOrder.packageType) {
    alert('Please select a package type.');
    return;
  }

  // Log the order details to console
  console.log('Order submitted:', currentOrder);

  // Show confirmation to user
  alert('Your order has been placed! Check the console for details.');
}

// Usage page functions
function initializeUsagePage() {
  if (!document.getElementById('dataProgressBar')) return; // Not on usage page

  // Display billing cycle dates
  const currentCycle = mockData.usageData.currentBillingCycle;
  document.getElementById('billingCycleDates').textContent = 
    `${currentCycle.startDate} to ${currentCycle.endDate}`;

  // Initialize usage data displays
  displayDataUsage();
  displayCallMinutes();
  displaySmsUsage();

  // Populate previous billing cycles table
  populatePreviousCycles();
}

function displayDataUsage() {
  const currentCycle = mockData.usageData.currentBillingCycle;
  const dataUsed = currentCycle.dataUsed;
  const dataTotal = currentCycle.dataTotal;

  // Calculate percentage
  const percentage = (dataUsed / dataTotal) * 100;

  // Update text
  document.getElementById('dataUsageText').textContent = 
    `${dataUsed.toFixed(1)} GB / ${dataTotal} GB`;

  // Update progress bar
  const progressBar = document.getElementById('dataProgressBar');
  progressBar.style.width = `${percentage}%`;
  progressBar.setAttribute('aria-valuenow', percentage);

  // Update percentage text in the center
  document.getElementById('dataProgressPercentage').textContent = `${Math.round(percentage)}%`;

  // Set color based on usage
  if (percentage < 50) {
    progressBar.classList.add('bg-success');
  } else if (percentage < 90) {
    progressBar.classList.add('bg-warning');
  } else {
    progressBar.classList.add('bg-danger');
  }
}

function displayCallMinutes() {
  const currentCycle = mockData.usageData.currentBillingCycle;
  const minutesUsed = currentCycle.callMinutesUsed;
  const minutesTotal = currentCycle.callMinutesTotal;

  // Update text
  document.getElementById('callMinutesText').textContent = 
    `${minutesUsed} minutes / ${minutesTotal}`;

  let percentage = 0;
  const progressBar = document.getElementById('callMinutesProgressBar');
  const percentageText = document.getElementById('callMinutesProgressPercentage');

  if (minutesTotal === "Unlimited") {
    // For unlimited plans, show full green progress bar
    percentage = 100;
    progressBar.classList.add('bg-success');
  } else {
    // For limited plans, calculate percentage and set color accordingly
    percentage = (minutesUsed / parseInt(minutesTotal)) * 100;

    // Set color based on usage
    if (percentage < 50) {
      progressBar.classList.add('bg-success');
    } else if (percentage < 90) {
      progressBar.classList.add('bg-warning');
    } else {
      progressBar.classList.add('bg-danger');
    }
  }

  // Update progress bar
  progressBar.style.width = `${percentage}%`;
  progressBar.setAttribute('aria-valuenow', percentage);

  // Set text content based on whether the plan is unlimited or not
  if (minutesTotal === "Unlimited") {
    percentageText.textContent = "unlimited";
  } else {
    percentageText.textContent = `${Math.round(percentage)}%`;
  }
}

function displaySmsUsage() {
  const currentCycle = mockData.usageData.currentBillingCycle;
  const smsUsed = currentCycle.smsUsed;
  const smsTotal = currentCycle.smsTotal;

  // Update text
  document.getElementById('smsText').textContent = 
    `${smsUsed} messages / ${smsTotal}`;

  let percentage = 0;
  const progressBar = document.getElementById('smsProgressBar');
  const percentageText = document.getElementById('smsProgressPercentage');

  if (smsTotal === "Unlimited") {
    // For unlimited plans, show full green progress bar
    percentage = 100;
    progressBar.classList.add('bg-success');
  } else {
    // For limited plans, calculate percentage and set color accordingly
    percentage = (smsUsed / parseInt(smsTotal)) * 100;

    // Set color based on usage
    if (percentage < 50) {
      progressBar.classList.add('bg-success');
    } else if (percentage < 90) {
      progressBar.classList.add('bg-warning');
    } else {
      progressBar.classList.add('bg-danger');
    }
  }

  // Update progress bar
  progressBar.style.width = `${percentage}%`;
  progressBar.setAttribute('aria-valuenow', percentage);

  // Set text content based on whether the plan is unlimited or not
  if (smsTotal === "Unlimited") {
    percentageText.textContent = "unlimited";
  } else {
    percentageText.textContent = `${Math.round(percentage)}%`;
  }
}

function populatePreviousCycles() {
  const previousCycles = mockData.usageData.previousBillingCycles;
  const tableBody = document.getElementById('previousCyclesTable');

  // Clear existing rows
  tableBody.innerHTML = '';

  // Add a row for each previous cycle
  previousCycles.forEach(cycle => {
    const row = document.createElement('tr');

    // Period
    const periodCell = document.createElement('td');
    periodCell.textContent = cycle.period;
    row.appendChild(periodCell);

    // Data Used
    const dataCell = document.createElement('td');
    dataCell.textContent = `${cycle.dataUsed.toFixed(1)} GB / ${cycle.dataTotal} GB`;
    row.appendChild(dataCell);

    // Call Minutes
    const callCell = document.createElement('td');
    callCell.textContent = `${cycle.callMinutesUsed} minutes`;
    row.appendChild(callCell);

    // SMS
    const smsCell = document.createElement('td');
    smsCell.textContent = `${cycle.smsUsed} messages`;
    row.appendChild(smsCell);

    tableBody.appendChild(row);
  });
}

// Chat page functions
let chatMessages = [];

// Initialize chat page
function initializeChatPage() {
  if (!document.getElementById('chatMessages')) return; // Not on chat page

  // Display welcome message
  addOperatorMessage("Hello! How can I assist you today?");
}

// Add a user message to the chat
function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();

  if (!message) return; // Don't send empty messages

  // Add user message to chat
  addUserMessage(message);

  // Clear input field
  messageInput.value = '';

  // Simulate operator response after a delay
  setTimeout(() => {
    simulateOperatorResponse(message);
  }, 1000);
}

// Handle Enter key press in the input field
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
    event.preventDefault();
  }
}

// Insert a quick message into the input field
function insertQuickMessage(message) {
  const messageInput = document.getElementById('messageInput');
  messageInput.value = message;
  messageInput.focus();
}

// Add a user message to the chat display
function addUserMessage(message) {
  const chatMessagesElement = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.className = 'message user-message';

  // Add message text
  messageElement.textContent = message;

  // Add timestamp
  const timeElement = document.createElement('div');
  timeElement.className = 'message-time';
  timeElement.textContent = getCurrentTime();
  messageElement.appendChild(timeElement);

  // Add to chat display
  chatMessagesElement.appendChild(messageElement);

  // Store in messages array
  chatMessages.push({
    type: 'user',
    text: message,
    time: new Date()
  });

  // Scroll to bottom
  chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;

  // Log to console (simulating backend sending)
  console.log('User message sent:', message);
}

// Add an operator message to the chat display
function addOperatorMessage(message) {
  const chatMessagesElement = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.className = 'message operator-message';

  // Add message text
  messageElement.textContent = message;

  // Add timestamp
  const timeElement = document.createElement('div');
  timeElement.className = 'message-time';
  timeElement.textContent = getCurrentTime();
  messageElement.appendChild(timeElement);

  // Add to chat display
  chatMessagesElement.appendChild(messageElement);

  // Store in messages array
  chatMessages.push({
    type: 'operator',
    text: message,
    time: new Date()
  });

  // Scroll to bottom
  chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}

// Simulate operator response based on user message
function simulateOperatorResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  let response;

  // Simple keyword-based responses
  if (lowerMessage.includes('billing') || lowerMessage.includes('payment') || lowerMessage.includes('invoice')) {
    response = "I can help you with billing issues. What specific question do you have about your bill?";
  } else if (lowerMessage.includes('upgrade') || lowerMessage.includes('plan')) {
    response = "We have several upgrade options available. Would you like to know about our Premium Mobile package?";
  } else if (lowerMessage.includes('technical') || lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('not working')) {
    response = "I'm sorry to hear you're experiencing technical issues. Could you please provide more details about the problem?";
  } else if (lowerMessage.includes('cancel')) {
    response = "We're sorry to hear you want to cancel. Is there anything we can do to improve your experience with us?";
  } else {
    // Default responses
    const defaultResponses = [
      "Thank you for your message. How else can I assist you?",
      "I understand. Is there anything specific you'd like to know?",
      "Let me check that for you. Is there anything else you need help with?",
      "I'd be happy to help with that. Could you provide more details?"
    ];
    response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  addOperatorMessage(response);
}

// Get current time in HH:MM format
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Feedback page functions
let currentRating = 0;

// Set the rating when a star is clicked
function setRating(rating) {
  currentRating = rating;
  document.getElementById('ratingValue').value = rating;

  // Update star display
  const stars = document.querySelectorAll('#ratingStars i');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.className = 'bi bi-star-fill';
    } else {
      star.className = 'bi bi-star';
    }
  });
}

// Initialize feedback page
function initializeFeedbackPage() {
  if (!document.getElementById('feedbackForm')) return; // Not on feedback page

  // If we have feedback data in mock data, initialize the average rating
  if (mockData && mockData.feedback) {
    const averageRating = mockData.feedback.averageRating;
    const totalReviews = mockData.feedback.totalReviews;

    // Update the average rating text
    document.querySelector('#averageRatingContainer p').innerHTML = 
      `<strong>${averageRating.toFixed(1)}</strong> out of 5 based on <strong>${totalReviews}</strong> reviews`;

    // Update the average rating stars
    const stars = document.querySelectorAll('#averageRatingStars i');
    stars.forEach((star, index) => {
      // For full stars
      if (index < Math.floor(averageRating)) {
        star.className = 'bi bi-star-fill';
      } 
      // For half stars
      else if (index === Math.floor(averageRating) && averageRating % 1 >= 0.5) {
        star.className = 'bi bi-star-half';
      } 
      // For empty stars
      else {
        star.className = 'bi bi-star';
      }
    });
  }
}

// Submit feedback
function submitFeedback() {
  // Get form values
  const rating = currentRating;
  const topic = document.getElementById('feedbackTopic').value;
  const text = document.getElementById('feedbackText').value;

  // Validate form
  if (rating === 0) {
    alert('Please select a rating');
    return;
  }

  if (!topic) {
    alert('Please select a feedback topic');
    return;
  }

  // Create feedback object
  const feedback = {
    rating: rating,
    topic: topic,
    text: text,
    timestamp: new Date().toISOString()
  };

  // Log feedback to console
  console.log('Feedback submitted:', feedback);

  // Show success message
  document.getElementById('feedbackSuccess').classList.remove('d-none');

  // Reset form
  setRating(0);
  document.getElementById('feedbackTopic').value = '';
  document.getElementById('feedbackText').value = '';

  // Hide success message after 5 seconds
  setTimeout(() => {
    document.getElementById('feedbackSuccess').classList.add('d-none');
  }, 5000);
}

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

// Login and Register page functions

// Login user
function loginUser() {
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

  // For demo purposes, accept any valid email format
  if (email.includes('@') && password.length >= 6) {
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

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  console.log("Page fully loaded");

  // Example of using mock data on page load
  if (mockData && mockData.userInfo) {
    console.log("Welcome back, " + mockData.userInfo.name);
  }

  // Initialize order page if we're on it
  if (document.getElementById('orderForm')) {
    initializePackageTypeDropdown();
  }

  // Initialize usage page if we're on it
  if (document.getElementById('dataProgressBar')) {
    initializeUsagePage();
  }

  // Initialize chat page if we're on it
  if (document.getElementById('chatMessages')) {
    initializeChatPage();
  }

  // Initialize feedback page if we're on it
  if (document.getElementById('feedbackForm')) {
    initializeFeedbackPage();
  }

  // Initialize profile page if we're on it
  if (document.getElementById('profileBody')) {
    initializeProfilePage();
  }

  // Initialize register page if we're on it
  if (document.getElementById('registerForm')) {
    initializeRegisterPage();
  }
});
