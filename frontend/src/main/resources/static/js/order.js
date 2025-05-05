// Order page functions
import {
  getPackageTypes,
  getPackageOptions,
  validatePromoCode,
  submitOrder as submitOrderToAPI
} from './model.js';

// Store package options for use in updateOrderSummary
let packageOptionsCache = {
  home_internet: null,
  mobile_hotspot: null,
  mobile_no_hotspot: null,
  mobile_combo: null
};

let currentOrder = {
  packageType: '',
  options: {},
  promoCode: '',
  discount: 0,
  basePrice: 0,
  totalPrice: 0
};

// Initialize package type dropdown
async function initializePackageTypeDropdown() {
  const packageTypeSelect = document.getElementById('packageType');
  if (!packageTypeSelect) return; // Not on order page

  try {
    // Clear existing options (except the first one)
    while (packageTypeSelect.options.length > 1) {
      packageTypeSelect.remove(1);
    }

    // Get package types from API
    const packageTypes = await getPackageTypes();

    // Add options from API data
    packageTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = type.name;
      packageTypeSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching package types:', error);
    // Optionally display an error message to the user
    alert('Failed to load package types. Please try again later.');
  }
}

// Update package options based on selected package type
async function updatePackageOptions() {
  const packageType = document.getElementById('packageType').value;
  currentOrder.packageType = packageType;

  try {
    // Hide all option sections
    document.getElementById('home_internet_options').classList.add('d-none');
    document.getElementById('mobile_hotspot_options').classList.add('d-none');
    document.getElementById('mobile_no_hotspot_options').classList.add('d-none');
    document.getElementById('mobile_combo_options').classList.add('d-none');

    // Show the relevant section based on selection
    if (packageType === 'home_internet') {
      document.getElementById('home_internet_options').classList.remove('d-none');
      await populateHomeInternetOptions();
    } else if (packageType === 'mobile_hotspot') {
      document.getElementById('mobile_hotspot_options').classList.remove('d-none');
      await populateMobileHotspotOptions();
    } else if (packageType === 'mobile_no_hotspot') {
      document.getElementById('mobile_no_hotspot_options').classList.remove('d-none');
      await populateMobileNoHotspotOptions();
    } else if (packageType === 'mobile_combo') {
      document.getElementById('mobile_combo_options').classList.remove('d-none');
      await populateMobileComboOptions();
    }

    // Reset current order options
    currentOrder.options = {};
    currentOrder.basePrice = getBasePrice(packageType);

    // Update the order summary
    updateOrderSummary();
  } catch (error) {
    console.error('Error updating package options:', error);
    alert('Failed to load package options. Please try again later.');
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
async function populateHomeInternetOptions() {
  try {
    // Get package options from API
    const packageOptions = await getPackageOptions('home_internet');

    // Store in cache for use in updateOrderSummary
    packageOptionsCache.home_internet = packageOptions;

    // Populate internet speeds
    const speedSelect = document.getElementById('internetSpeed');
    while (speedSelect.options.length > 1) {
      speedSelect.remove(1);
    }

    packageOptions.speeds.forEach(speed => {
      const option = document.createElement('option');
      option.value = speed.id;
      option.textContent = `${speed.name} (+$${speed.price.toFixed(2)})`;
      speedSelect.appendChild(option);
    });

    // Populate router options
    const routerSelect = document.getElementById('routerOption');
    while (routerSelect.options.length > 1) {
      routerSelect.remove(1);
    }

    packageOptions.routers.forEach(router => {
      const option = document.createElement('option');
      option.value = router.id;
      option.textContent = `${router.name} ${router.price > 0 ? '(+$' + router.price.toFixed(2) + ')' : '(Included)'}`;
      routerSelect.appendChild(option);
    });

    // Populate add-ons
    const addOnsContainer = document.getElementById('homeInternetAddOns');
    addOnsContainer.innerHTML = '';

    packageOptions.addOns.forEach(addon => {
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
  } catch (error) {
    console.error('Error fetching home internet options:', error);
    alert('Failed to load home internet options. Please try again later.');
  }
}

// Populate Mobile Internet with Hotspot options
async function populateMobileHotspotOptions() {
  try {
    // Get package options from API
    const packageOptions = await getPackageOptions('mobile_hotspot');

    // Store in cache for use in updateOrderSummary
    packageOptionsCache.mobile_hotspot = packageOptions;

    // Populate data plans
    const dataPlanSelect = document.getElementById('hotspotDataPlan');
    while (dataPlanSelect.options.length > 1) {
      dataPlanSelect.remove(1);
    }

    packageOptions.dataPlans.forEach(plan => {
      const option = document.createElement('option');
      option.value = plan.id;
      option.textContent = `${plan.name} (+$${plan.price.toFixed(2)})`;
      dataPlanSelect.appendChild(option);
    });

    // Populate add-ons
    const addOnsContainer = document.getElementById('mobileHotspotAddOns');
    addOnsContainer.innerHTML = '';

    packageOptions.addOns.forEach(addon => {
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
  } catch (error) {
    console.error('Error fetching mobile hotspot options:', error);
    alert('Failed to load mobile hotspot options. Please try again later.');
  }
}

// Populate Mobile Internet without Hotspot options
async function populateMobileNoHotspotOptions() {
  try {
    // Get package options from API
    const packageOptions = await getPackageOptions('mobile_no_hotspot');

    // Store in cache for use in updateOrderSummary
    packageOptionsCache.mobile_no_hotspot = packageOptions;

    // Populate data plans
    const dataPlanSelect = document.getElementById('noHotspotDataPlan');
    while (dataPlanSelect.options.length > 1) {
      dataPlanSelect.remove(1);
    }

    packageOptions.dataPlans.forEach(plan => {
      const option = document.createElement('option');
      option.value = plan.id;
      option.textContent = `${plan.name} (+$${plan.price.toFixed(2)})`;
      dataPlanSelect.appendChild(option);
    });

    // Populate add-ons
    const addOnsContainer = document.getElementById('mobileNoHotspotAddOns');
    addOnsContainer.innerHTML = '';

    packageOptions.addOns.forEach(addon => {
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
  } catch (error) {
    console.error('Error fetching mobile no-hotspot options:', error);
    alert('Failed to load mobile no-hotspot options. Please try again later.');
  }
}

// Populate Mobile Combo options
async function populateMobileComboOptions() {
  try {
    // Get package options from API
    const packageOptions = await getPackageOptions('mobile_combo');

    // Store in cache for use in updateOrderSummary
    packageOptionsCache.mobile_combo = packageOptions;

    // Populate plans
    const planSelect = document.getElementById('comboPlan');
    while (planSelect.options.length > 1) {
      planSelect.remove(1);
    }

    packageOptions.plans.forEach(plan => {
      const option = document.createElement('option');
      option.value = plan.id;
      option.textContent = `${plan.name} (+$${plan.price.toFixed(2)})`;
      planSelect.appendChild(option);
    });

    // Populate add-ons
    const addOnsContainer = document.getElementById('mobileComboAddOns');
    addOnsContainer.innerHTML = '';

    packageOptions.addOns.forEach(addon => {
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
  } catch (error) {
    console.error('Error fetching mobile combo options:', error);
    alert('Failed to load mobile combo options. Please try again later.');
  }
}

// Update order summary
function updateOrderSummary() {
  if (!currentOrder.packageType) return;

  let totalPrice = currentOrder.basePrice;
  const summaryDetails = document.getElementById('orderSummaryDetails');
  let summaryHTML = `<p><strong>Base Package:</strong> $${currentOrder.basePrice.toFixed(2)}</p>`;

  // Add selected options to the summary
  if (currentOrder.packageType === 'home_internet') {
    // Check if we have cached options
    if (!packageOptionsCache.home_internet) {
      console.error('Package options for home_internet not loaded');
      return;
    }

    // Internet Speed
    const speedSelect = document.getElementById('internetSpeed');
    if (speedSelect.value) {
      const selectedSpeed = packageOptionsCache.home_internet.speeds.find(s => s.id === speedSelect.value);
      if (selectedSpeed) {
        totalPrice += selectedSpeed.price;
        summaryHTML += `<p><strong>Internet Speed:</strong> ${selectedSpeed.name} (+$${selectedSpeed.price.toFixed(2)})</p>`;
        currentOrder.options.speed = selectedSpeed;
      }
    }

    // Router Option
    const routerSelect = document.getElementById('routerOption');
    if (routerSelect.value) {
      const selectedRouter = packageOptionsCache.home_internet.routers.find(r => r.id === routerSelect.value);
      if (selectedRouter) {
        totalPrice += selectedRouter.price;
        summaryHTML += `<p><strong>Router:</strong> ${selectedRouter.name} ${selectedRouter.price > 0 ? '(+$' + selectedRouter.price.toFixed(2) + ')' : '(Included)'}</p>`;
        currentOrder.options.router = selectedRouter;
      }
    }

    // Check for selected add-ons
    const selectedAddOns = [];
    packageOptionsCache.home_internet.addOns.forEach(addon => {
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
  } else if (currentOrder.packageType === 'mobile_hotspot') {
    // Check if we have cached options
    if (!packageOptionsCache.mobile_hotspot) {
      console.error('Package options for mobile_hotspot not loaded');
      return;
    }

    // Data Plan
    const dataPlanSelect = document.getElementById('hotspotDataPlan');
    if (dataPlanSelect.value) {
      const selectedPlan = packageOptionsCache.mobile_hotspot.dataPlans.find(p => p.id === dataPlanSelect.value);
      if (selectedPlan) {
        totalPrice += selectedPlan.price;
        summaryHTML += `<p><strong>Data Plan:</strong> ${selectedPlan.name} (+$${selectedPlan.price.toFixed(2)})</p>`;
        currentOrder.options.dataPlan = selectedPlan;
      }
    }

    // Check for selected add-ons
    const selectedAddOns = [];
    packageOptionsCache.mobile_hotspot.addOns.forEach(addon => {
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
  } else if (currentOrder.packageType === 'mobile_no_hotspot') {
    // Check if we have cached options
    if (!packageOptionsCache.mobile_no_hotspot) {
      console.error('Package options for mobile_no_hotspot not loaded');
      return;
    }

    // Data Plan
    const dataPlanSelect = document.getElementById('noHotspotDataPlan');
    if (dataPlanSelect.value) {
      const selectedPlan = packageOptionsCache.mobile_no_hotspot.dataPlans.find(p => p.id === dataPlanSelect.value);
      if (selectedPlan) {
        totalPrice += selectedPlan.price;
        summaryHTML += `<p><strong>Data Plan:</strong> ${selectedPlan.name} (+$${selectedPlan.price.toFixed(2)})</p>`;
        currentOrder.options.dataPlan = selectedPlan;
      }
    }

    // Check for selected add-ons
    const selectedAddOns = [];
    packageOptionsCache.mobile_no_hotspot.addOns.forEach(addon => {
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
  } else if (currentOrder.packageType === 'mobile_combo') {
    // Check if we have cached options
    if (!packageOptionsCache.mobile_combo) {
      console.error('Package options for mobile_combo not loaded');
      return;
    }

    // Plan
    const planSelect = document.getElementById('comboPlan');
    if (planSelect.value) {
      const selectedPlan = packageOptionsCache.mobile_combo.plans.find(p => p.id === planSelect.value);
      if (selectedPlan) {
        totalPrice += selectedPlan.price;
        summaryHTML += `<p><strong>Plan:</strong> ${selectedPlan.name} (+$${selectedPlan.price.toFixed(2)})</p>`;
        currentOrder.options.plan = selectedPlan;
      }
    }

    // Check for selected add-ons
    const selectedAddOns = [];
    packageOptionsCache.mobile_combo.addOns.forEach(addon => {
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
    // Validate promo code with API
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
    console.error('Error validating promo code:', error);
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
      options: currentOrder.options,
      promoCode: currentOrder.promoCode
    };

    // Submit order to API
    const response = await submitOrderToAPI(orderDetails);

    if (response.success) {
      // Show confirmation to user
      alert(`Your order has been placed! Order ID: ${response.orderId}`);

      // Reset form or redirect to confirmation page
      // window.location.href = `/order-confirmation.html?orderId=${response.orderId}`;
    } else {
      alert(`Failed to place order: ${response.message}`);
    }
  } catch (error) {
    console.error('Error submitting order:', error);
    alert('An error occurred while placing your order. Please try again later.');
  }
}

// Export functions for use in other modules
export {
  initializePackageTypeDropdown,
  updatePackageOptions,
  applyPromoCode,
  submitOrder
}
