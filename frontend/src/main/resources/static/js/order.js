// Order page functions
import { getPackageTypes, getPackageOptions, validatePromoCode, submitOrder as submitOrderAPI } from './model.js';

let currentOrder = {
  packageType: '',
  options: {},
  promoCode: '',
  discount: 0,
  basePrice: 0,
  totalPrice: 0
};

// Store package options data fetched from API
let packageOptionsData = {};

// Initialize package type dropdown
async function initializePackageTypeDropdown() {
  const packageTypeSelect = document.getElementById('packageType');
  if (!packageTypeSelect) return; // Not on order page

  try {
    // Clear existing options (except the first one)
    while (packageTypeSelect.options.length > 1) {
      packageTypeSelect.remove(1);
    }

    // Fetch package types from API
    const packageTypes = await getPackageTypes();

    // Add options from API response
    packageTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = type.name;
      packageTypeSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load package types:', error);
    // Navigate to home page instead of showing error
    window.location.href = 'index.html';
  }
}

// Update package options based on selected package type
async function updatePackageOptions() {
  const packageType = document.getElementById('packageType').value;
  currentOrder.packageType = packageType;

  // Hide all option sections
  document.getElementById('home_internet_options').classList.add('d-none');
  document.getElementById('mobile_hotspot_options').classList.add('d-none');
  document.getElementById('mobile_no_hotspot_options').classList.add('d-none');
  document.getElementById('mobile_combo_options').classList.add('d-none');

  if (!packageType) return; // No package type selected

  try {
    // Fetch package options from API
    packageOptionsData[packageType] = await getPackageOptions(packageType);

    // Show the relevant section based on selection
    if (packageType === 'home_internet') {
      document.getElementById('home_internet_options').classList.remove('d-none');
      populateHomeInternetOptions();
    } else if (packageType === 'mobile_hotspot') {
      document.getElementById('mobile_hotspot_options').classList.remove('d-none');
      populateMobileHotspotOptions();
    } else if (packageType === 'mobile_no_hotspot') {
      document.getElementById('mobile_no_hotspot_options').classList.remove('d-none');
      populateMobileNoHotspotOptions();
    } else if (packageType === 'mobile_combo') {
      document.getElementById('mobile_combo_options').classList.remove('d-none');
      populateMobileComboOptions();
    }

    // Reset current order options
    currentOrder.options = {};
    currentOrder.basePrice = getBasePrice(packageType);

    // Update the order summary
    updateOrderSummary();
  } catch (error) {
    console.error(`Failed to fetch options for package type ${packageType}:`, error);
    // Navigate to home page instead of showing error
    window.location.href = 'index.html';
  }
}

// Get base price for package type
function getBasePrice(packageType) {
  switch (packageType) {
    case 'home_internet':
      return 29.99;
    case 'mobile_hotspot':
      return 15.99;
    case 'mobile_no_hotspot':
      return 10.99;
    case 'mobile_combo':
      return 19.99;
    default:
      return 0;
  }
}

// Populate Home Internet options
function populateHomeInternetOptions() {
  const options = packageOptionsData['home_internet'];
  if (!options) return;

  // Populate internet speeds
  const speedSelect = document.getElementById('internetSpeed');
  while (speedSelect.options.length > 1) {
    speedSelect.remove(1);
  }

  if (options.speeds) {
    options.speeds.forEach(speed => {
      const option = document.createElement('option');
      option.value = speed.id;
      option.textContent = `${speed.name} (+$${speed.price.toFixed(2)})`;
      speedSelect.appendChild(option);
    });
  }

  // Populate router options
  const routerSelect = document.getElementById('routerOption');
  while (routerSelect.options.length > 1) {
    routerSelect.remove(1);
  }

  if (options.routers) {
    options.routers.forEach(router => {
      const option = document.createElement('option');
      option.value = router.id;
      option.textContent = `${router.name} ${router.price > 0 ? '(+$' + router.price.toFixed(2) + ')' : '(Included)'}`;
      routerSelect.appendChild(option);
    });
  }

  // Populate add-ons
  const addOnsContainer = document.getElementById('homeInternetAddOns');
  addOnsContainer.innerHTML = '';

  if (options.addOns) {
    options.addOns.forEach(addon => {
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
}

// Populate Mobile Internet with Hotspot options
function populateMobileHotspotOptions() {
  const options = packageOptionsData['mobile_hotspot'];
  if (!options) return;

  // Populate data plans
  const dataPlanSelect = document.getElementById('hotspotDataPlan');
  while (dataPlanSelect.options.length > 1) {
    dataPlanSelect.remove(1);
  }

  if (options.dataPlans) {
    options.dataPlans.forEach(plan => {
      const option = document.createElement('option');
      option.value = plan.id;
      option.textContent = `${plan.name} (+$${plan.price.toFixed(2)})`;
      dataPlanSelect.appendChild(option);
    });
  }

  // Populate add-ons
  const addOnsContainer = document.getElementById('mobileHotspotAddOns');
  addOnsContainer.innerHTML = '';

  if (options.addOns) {
    options.addOns.forEach(addon => {
      const checkboxDiv = document.createElement('div');
      checkboxDiv.className = 'form-check';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-check-input';
      checkbox.id = `addon-hotspot-${addon.id}`;
      checkbox.value = addon.id;
      checkbox.onchange = updateOrderSummary;

      const label = document.createElement('label');
      label.className = 'form-check-label';
      label.htmlFor = `addon-hotspot-${addon.id}`;
      label.textContent = `${addon.name} (+$${addon.price.toFixed(2)})`;

      checkboxDiv.appendChild(checkbox);
      checkboxDiv.appendChild(label);
      addOnsContainer.appendChild(checkboxDiv);
    });
  }
}

// Populate Mobile Internet without Hotspot options
function populateMobileNoHotspotOptions() {
  const options = packageOptionsData['mobile_no_hotspot'];
  if (!options) return;

  // Populate data plans
  const dataPlanSelect = document.getElementById('noHotspotDataPlan');
  while (dataPlanSelect.options.length > 1) {
    dataPlanSelect.remove(1);
  }

  if (options.dataPlans) {
    options.dataPlans.forEach(plan => {
      const option = document.createElement('option');
      option.value = plan.id;
      option.textContent = `${plan.name} (+$${plan.price.toFixed(2)})`;
      dataPlanSelect.appendChild(option);
    });
  }

  // Populate add-ons
  const addOnsContainer = document.getElementById('mobileNoHotspotAddOns');
  addOnsContainer.innerHTML = '';

  if (options.addOns) {
    options.addOns.forEach(addon => {
      const checkboxDiv = document.createElement('div');
      checkboxDiv.className = 'form-check';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-check-input';
      checkbox.id = `addon-no-hotspot-${addon.id}`;
      checkbox.value = addon.id;
      checkbox.onchange = updateOrderSummary;

      const label = document.createElement('label');
      label.className = 'form-check-label';
      label.htmlFor = `addon-no-hotspot-${addon.id}`;
      label.textContent = `${addon.name} (+$${addon.price.toFixed(2)})`;

      checkboxDiv.appendChild(checkbox);
      checkboxDiv.appendChild(label);
      addOnsContainer.appendChild(checkboxDiv);
    });
  }
}

// Populate Mobile Combo options
function populateMobileComboOptions() {
  const options = packageOptionsData['mobile_combo'];
  if (!options) return;

  // Populate plans
  const planSelect = document.getElementById('comboPlan');
  while (planSelect.options.length > 1) {
    planSelect.remove(1);
  }

  if (options.plans) {
    options.plans.forEach(plan => {
      const option = document.createElement('option');
      option.value = plan.id;
      option.textContent = `${plan.name} (+$${plan.price.toFixed(2)})`;
      planSelect.appendChild(option);
    });
  }

  // Populate add-ons
  const addOnsContainer = document.getElementById('mobileComboAddOns');
  addOnsContainer.innerHTML = '';

  if (options.addOns) {
    options.addOns.forEach(addon => {
      const checkboxDiv = document.createElement('div');
      checkboxDiv.className = 'form-check';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-check-input';
      checkbox.id = `addon-combo-${addon.id}`;
      checkbox.value = addon.id;
      checkbox.onchange = updateOrderSummary;

      const label = document.createElement('label');
      label.className = 'form-check-label';
      label.htmlFor = `addon-combo-${addon.id}`;
      label.textContent = `${addon.name} (+$${addon.price.toFixed(2)})`;

      checkboxDiv.appendChild(checkbox);
      checkboxDiv.appendChild(label);
      addOnsContainer.appendChild(checkboxDiv);
    });
  }
}

// Update order summary
function updateOrderSummary() {
  if (!currentOrder.packageType) return;

  let totalPrice = currentOrder.basePrice;
  const summaryDetails = document.getElementById('orderSummaryDetails');
  let summaryHTML = `<p><strong>Base Package:</strong> $${currentOrder.basePrice.toFixed(2)}</p>`;

  const options = packageOptionsData[currentOrder.packageType];
  if (!options) return;

  // Add selected options to the summary
  if (currentOrder.packageType === 'home_internet') {
    // Internet Speed
    const speedSelect = document.getElementById('internetSpeed');
    if (speedSelect.value && options.speeds) {
      const selectedSpeed = options.speeds.find(s => s.id === speedSelect.value);
      if (selectedSpeed) {
        totalPrice += selectedSpeed.price;
        summaryHTML += `<p><strong>Internet Speed:</strong> ${selectedSpeed.name} (+$${selectedSpeed.price.toFixed(2)})</p>`;
        currentOrder.options.speed = selectedSpeed;
      }
    }

    // Router Option
    const routerSelect = document.getElementById('routerOption');
    if (routerSelect.value && options.routers) {
      const selectedRouter = options.routers.find(r => r.id === routerSelect.value);
      if (selectedRouter) {
        totalPrice += selectedRouter.price;
        summaryHTML += `<p><strong>Router:</strong> ${selectedRouter.name} ${selectedRouter.price > 0 ? '(+$' + selectedRouter.price.toFixed(2) + ')' : '(Included)'}</p>`;
        currentOrder.options.router = selectedRouter;
      }
    }

    // Check for selected add-ons
    const selectedAddOns = [];
    if (options.addOns) {
      options.addOns.forEach(addon => {
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
    }
  } else if (currentOrder.packageType === 'mobile_hotspot') {
    // Data Plan
    const dataPlanSelect = document.getElementById('hotspotDataPlan');
    if (dataPlanSelect.value && options.dataPlans) {
      const selectedPlan = options.dataPlans.find(p => p.id === dataPlanSelect.value);
      if (selectedPlan) {
        totalPrice += selectedPlan.price;
        summaryHTML += `<p><strong>Data Plan:</strong> ${selectedPlan.name} (+$${selectedPlan.price.toFixed(2)})</p>`;
        currentOrder.options.dataPlan = selectedPlan;
      }
    }

    // Check for selected add-ons
    const selectedAddOns = [];
    if (options.addOns) {
      options.addOns.forEach(addon => {
        const checkbox = document.getElementById(`addon-hotspot-${addon.id}`);
        if (checkbox && checkbox.checked) {
          totalPrice += addon.price;
          selectedAddOns.push(addon);
          summaryHTML += `<p><strong>Add-on:</strong> ${addon.name} (+$${addon.price.toFixed(2)})</p>`;
        }
      });

      if (selectedAddOns.length > 0) {
        currentOrder.options.addOns = selectedAddOns;
      }
    }
  } else if (currentOrder.packageType === 'mobile_no_hotspot') {
    // Data Plan
    const dataPlanSelect = document.getElementById('noHotspotDataPlan');
    if (dataPlanSelect.value && options.dataPlans) {
      const selectedPlan = options.dataPlans.find(p => p.id === dataPlanSelect.value);
      if (selectedPlan) {
        totalPrice += selectedPlan.price;
        summaryHTML += `<p><strong>Data Plan:</strong> ${selectedPlan.name} (+$${selectedPlan.price.toFixed(2)})</p>`;
        currentOrder.options.dataPlan = selectedPlan;
      }
    }

    // Check for selected add-ons
    const selectedAddOns = [];
    if (options.addOns) {
      options.addOns.forEach(addon => {
        const checkbox = document.getElementById(`addon-no-hotspot-${addon.id}`);
        if (checkbox && checkbox.checked) {
          totalPrice += addon.price;
          selectedAddOns.push(addon);
          summaryHTML += `<p><strong>Add-on:</strong> ${addon.name} (+$${addon.price.toFixed(2)})</p>`;
        }
      });

      if (selectedAddOns.length > 0) {
        currentOrder.options.addOns = selectedAddOns;
      }
    }
  } else if (currentOrder.packageType === 'mobile_combo') {
    // Plan
    const planSelect = document.getElementById('comboPlan');
    if (planSelect.value && options.plans) {
      const selectedPlan = options.plans.find(p => p.id === planSelect.value);
      if (selectedPlan) {
        totalPrice += selectedPlan.price;
        summaryHTML += `<p><strong>Plan:</strong> ${selectedPlan.name} (+$${selectedPlan.price.toFixed(2)})</p>`;
        currentOrder.options.plan = selectedPlan;
      }
    }

    // Check for selected add-ons
    const selectedAddOns = [];
    if (options.addOns) {
      options.addOns.forEach(addon => {
        const checkbox = document.getElementById(`addon-combo-${addon.id}`);
        if (checkbox && checkbox.checked) {
          totalPrice += addon.price;
          selectedAddOns.push(addon);
          summaryHTML += `<p><strong>Add-on:</strong> ${addon.name} (+$${addon.price.toFixed(2)})</p>`;
        }
      });

      if (selectedAddOns.length > 0) {
        currentOrder.options.addOns = selectedAddOns;
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
async function applyPromoCode() {
  const promoCodeInput = document.getElementById('promoCode');
  const promoCode = promoCodeInput.value.trim();
  const feedbackElement = document.getElementById('promoCodeFeedback');

  if (!promoCode) {
    feedbackElement.textContent = 'Please enter a promo code.';
    feedbackElement.className = 'form-text text-danger';
    return;
  }

  try {
    // Validate promo code via API
    const validationResult = await validatePromoCode(promoCode);

    if (validationResult.valid) {
      currentOrder.promoCode = promoCode;
      currentOrder.discount = validationResult.discount;
      feedbackElement.textContent = `Promo code applied: ${validationResult.description}`;
      feedbackElement.className = 'form-text text-success';
      updateOrderSummary();
    } else {
      currentOrder.promoCode = '';
      currentOrder.discount = 0;
      feedbackElement.textContent = 'Invalid promo code.';
      feedbackElement.className = 'form-text text-danger';
      updateOrderSummary();
    }
  } catch (error) {
    console.error('Failed to validate promo code:', error);
    feedbackElement.textContent = 'Error validating promo code. Please try again.';
    feedbackElement.className = 'form-text text-danger';
    currentOrder.promoCode = '';
    currentOrder.discount = 0;
    updateOrderSummary();
  }
}

// Submit order
async function submitOrder() {
  if (!currentOrder.packageType) {
    alert('Please select a package type.');
    return;
  }

  try {
    // Prepare order details for API
    const orderDetails = {
      packageType: currentOrder.packageType,
      options: {},
      promoCode: currentOrder.promoCode || ''
    };

    // Add selected options based on package type
    if (currentOrder.packageType === 'home_internet') {
      if (currentOrder.options.speed) {
        orderDetails.options.speed = currentOrder.options.speed.id;
      }
      if (currentOrder.options.router) {
        orderDetails.options.router = currentOrder.options.router.id;
      }
    } else if (currentOrder.packageType === 'mobile_hotspot' || currentOrder.packageType === 'mobile_no_hotspot') {
      if (currentOrder.options.dataPlan) {
        orderDetails.options.dataPlan = currentOrder.options.dataPlan.id;
      }
    } else if (currentOrder.packageType === 'mobile_combo') {
      if (currentOrder.options.plan) {
        orderDetails.options.plan = currentOrder.options.plan.id;
      }
    }

    // Add add-ons if any
    if (currentOrder.options.addOns && currentOrder.options.addOns.length > 0) {
      orderDetails.options.addOns = currentOrder.options.addOns.map(addon => addon.id);
    }

    // Submit order to API
    const response = await submitOrderAPI(orderDetails);

    if (response.success) {
      // Show success message
      alert(`Your order has been placed! Order ID: ${response.orderId}`);

      // Reset form (optional)
      // resetOrderForm();
    } else {
      // Navigate to home page instead of showing error
      console.error(`Failed to place order: ${response.message}`);
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Failed to submit order:', error);
    // Navigate to home page instead of showing error
    window.location.href = 'index.html';
  }
}

// Expose functions to the global scope
window.initializePackageTypeDropdown = initializePackageTypeDropdown;
window.updatePackageOptions = updatePackageOptions;
window.updateOrderSummary = updateOrderSummary;
window.applyPromoCode = applyPromoCode;
window.submitOrder = submitOrder;
