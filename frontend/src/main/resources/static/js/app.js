console.log("G4UltimateMobile CRM Prototype Initialized");

// Navigation functions
function goToOrderPage() {
  console.log("Navigating to Order Page");
  window.location.href = "order.html";
}

function goToUsagePage() {
  console.log("Navigating to Usage Page");
  alert("Usage Page would load here");
}

function goToChatPage() {
  console.log("Navigating to Chat Page");
  alert("Chat Support would open here");
}

function goToFeedbackPage() {
  console.log("Navigating to Feedback Page");
  alert("Feedback Form would load here");
}

function goToProfilePage() {
  console.log("Navigating to Profile Page");
  alert("User Profile would load here");
}

function goToLoginPage() {
  console.log("Navigating to Login Page");
  alert("Login Form would load here");
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
});
