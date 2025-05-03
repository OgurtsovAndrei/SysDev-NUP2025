// Usage page functions
function initializeUsagePage() {
  if (!document.getElementById('packageSections')) return; // Not on usage page

  // Display billing cycle dates
  const currentCycle = mockData.usageData.currentBillingCycle;
  document.getElementById('billingCycleDates').textContent = 
    `${currentCycle.startDate} to ${currentCycle.endDate}`;

  // Get the container for package sections
  const packageSectionsContainer = document.getElementById('packageSections');
  packageSectionsContainer.innerHTML = ''; // Clear any existing content

  // Get user packages
  const userPackages = mockData.userInfo.packages;

  // Create a section for each package
  userPackages.forEach(package => {
    // Create package section
    const packageSection = createPackageSection(package);
    packageSectionsContainer.appendChild(packageSection);
  });

  // Populate previous billing cycles table
  populatePreviousCycles();
}

// Create a section for a package
function createPackageSection(package) {
  // Create the package section container
  const packageSection = document.createElement('div');
  packageSection.className = 'mb-5';

  // Create the package header
  const packageHeader = document.createElement('div');
  packageHeader.className = 'mb-3';

  // Get a user-friendly package type name
  let packageTypeName = package.type;
  const packageTypeObj = mockData.packageTypes.find(pt => pt.id === package.type);
  if (packageTypeObj) {
    packageTypeName = packageTypeObj.name;
  }

  packageHeader.innerHTML = `
    <h3>${package.name}</h3>
    <p class="text-muted">${packageTypeName} ${package.addOns && package.addOns.length > 0 ? '• ' + package.addOns.join(', ') : ''}</p>
  `;
  packageSection.appendChild(packageHeader);

  // Get usage data for this package
  const packageUsage = mockData.usageData.currentBillingCycle.packages[package.id];

  // Create usage cards based on package type
  if (package.type === 'mobile_combo') {
    packageSection.appendChild(createMobileComboUsageCards(packageUsage));
  } else if (package.type === 'mobile_hotspot') {
    packageSection.appendChild(createMobileHotspotUsageCards(packageUsage));
  } else if (package.type === 'mobile_no_hotspot') {
    packageSection.appendChild(createMobileNoHotspotUsageCards(packageUsage));
  } else if (package.type === 'home_internet') {
    packageSection.appendChild(createHomeInternetUsageCards(packageUsage));
  }

  return packageSection;
}

// Create usage cards for Mobile Combo packages
function createMobileComboUsageCards(packageUsage) {
  const cardsContainer = document.createElement('div');

  // Data Usage Card
  const dataCard = createUsageCard(
    'Data Usage',
    `${packageUsage.dataUsed.toFixed(1)} GB / ${packageUsage.dataTotal} GB`,
    calculatePercentage(packageUsage.dataUsed, packageUsage.dataTotal)
  );
  cardsContainer.appendChild(dataCard);

  // Call Minutes Card
  const callMinutesCard = createUsageCard(
    'Call Minutes',
    `${packageUsage.callMinutesUsed} minutes / ${packageUsage.callMinutesTotal}`,
    packageUsage.callMinutesTotal === 'Unlimited' ? 100 : calculatePercentage(packageUsage.callMinutesUsed, parseInt(packageUsage.callMinutesTotal)),
    packageUsage.callMinutesTotal === 'Unlimited' ? 'unlimited' : null
  );
  cardsContainer.appendChild(callMinutesCard);

  // SMS Card
  const smsCard = createUsageCard(
    'Text Messages',
    `${packageUsage.smsUsed} messages / ${packageUsage.smsTotal}`,
    packageUsage.smsTotal === 'Unlimited' ? 100 : calculatePercentage(packageUsage.smsUsed, parseInt(packageUsage.smsTotal)),
    packageUsage.smsTotal === 'Unlimited' ? 'unlimited' : null
  );
  cardsContainer.appendChild(smsCard);

  return cardsContainer;
}

// Create usage cards for Mobile Hotspot packages
function createMobileHotspotUsageCards(packageUsage) {
  const cardsContainer = document.createElement('div');

  // Data Usage Card
  const dataCard = createUsageCard(
    'Data Usage',
    `${packageUsage.dataUsed.toFixed(1)} GB / ${packageUsage.dataTotal} GB`,
    calculatePercentage(packageUsage.dataUsed, packageUsage.dataTotal)
  );
  cardsContainer.appendChild(dataCard);

  // Hotspot Info Card
  const hotspotCard = document.createElement('div');
  hotspotCard.className = 'card usage-card';
  hotspotCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">Hotspot Information</h5>
      <p class="card-text">Hotspot sharing is enabled for this plan. You can share your data with other devices.</p>
    </div>
  `;
  cardsContainer.appendChild(hotspotCard);

  return cardsContainer;
}

// Create usage cards for Mobile No Hotspot packages
function createMobileNoHotspotUsageCards(packageUsage) {
  const cardsContainer = document.createElement('div');

  // Data Usage Card
  const dataCard = createUsageCard(
    'Data Usage',
    `${packageUsage.dataUsed.toFixed(1)} GB / ${packageUsage.dataTotal} GB`,
    calculatePercentage(packageUsage.dataUsed, packageUsage.dataTotal)
  );
  cardsContainer.appendChild(dataCard);

  // Hotspot Info Card
  const hotspotCard = document.createElement('div');
  hotspotCard.className = 'card usage-card';
  hotspotCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">Hotspot Information</h5>
      <p class="card-text">Hotspot sharing is not available for this plan. You cannot share your data with other devices.</p>
    </div>
  `;
  cardsContainer.appendChild(hotspotCard);

  return cardsContainer;
}

// Create usage cards for Home Internet packages
function createHomeInternetUsageCards(packageUsage) {
  const cardsContainer = document.createElement('div');

  // Data Usage Card
  const dataCard = createUsageCard(
    'Data Usage',
    `${packageUsage.dataUsed.toFixed(1)} GB / ${packageUsage.dataTotal} GB`,
    calculatePercentage(packageUsage.dataUsed, packageUsage.dataTotal)
  );
  cardsContainer.appendChild(dataCard);

  // Connection Speed Card
  const speedCard = document.createElement('div');
  speedCard.className = 'card usage-card';
  speedCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">Connection Speed</h5>
      <div class="row">
        <div class="col-md-6">
          <p class="card-text"><strong>Download:</strong> ${packageUsage.downloadSpeed}</p>
        </div>
        <div class="col-md-6">
          <p class="card-text"><strong>Upload:</strong> ${packageUsage.uploadSpeed}</p>
        </div>
      </div>
    </div>
  `;
  cardsContainer.appendChild(speedCard);

  // Connected Devices Card
  const devicesCard = document.createElement('div');
  devicesCard.className = 'card usage-card';
  devicesCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">Connected Devices</h5>
      <p class="card-text">${packageUsage.devices} devices currently connected</p>
    </div>
  `;
  cardsContainer.appendChild(devicesCard);

  return cardsContainer;
}

// Helper function to create a usage card with progress bar
function createUsageCard(title, text, percentage, customPercentageText = null) {
  const card = document.createElement('div');
  card.className = 'card usage-card';

  // Determine progress bar color
  let colorClass = 'bg-success';
  if (percentage >= 90) {
    colorClass = 'bg-danger';
  } else if (percentage >= 50) {
    colorClass = 'bg-warning';
  }

  // Set percentage text
  const percentageText = customPercentageText || `${Math.round(percentage)}%`;

  card.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">${text}</p>
      <div class="progress">
        <div class="progress-bar ${colorClass}" role="progressbar" style="width: ${percentage}%;" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
        <span class="progress-percentage">${percentageText}</span>
      </div>
    </div>
  `;

  return card;
}

// Helper function to calculate percentage
function calculatePercentage(used, total) {
  return (used / total) * 100;
}

function populatePreviousCycles() {
  const previousCycles = mockData.usageData.previousBillingCycles;
  const tableBody = document.getElementById('previousCyclesTable');
  const userPackages = mockData.userInfo.packages;

  // Clear existing rows
  tableBody.innerHTML = '';

  // Update table headers based on user packages
  const tableHead = document.querySelector('#previousCyclesTable').parentElement.querySelector('thead tr');
  tableHead.innerHTML = '<th>Period</th>';

  // Add headers for each package
  userPackages.forEach(package => {
    const packageHeader = document.createElement('th');
    packageHeader.textContent = package.name;
    tableHead.appendChild(packageHeader);
  });

  // Add a row for each previous cycle
  previousCycles.forEach(cycle => {
    const row = document.createElement('tr');

    // Period
    const periodCell = document.createElement('td');
    periodCell.textContent = cycle.period;
    row.appendChild(periodCell);

    // Add data for each package
    userPackages.forEach(package => {
      const packageData = cycle.packages[package.id];
      const packageCell = document.createElement('td');

      if (packageData) {
        if (package.type === 'mobile_combo') {
          packageCell.innerHTML = `
            <div><strong>Data:</strong> ${packageData.dataUsed.toFixed(1)} GB / ${packageData.dataTotal} GB</div>
            <div><strong>Calls:</strong> ${packageData.callMinutesUsed} minutes${packageData.callMinutesTotal ? ' / ' + packageData.callMinutesTotal + ' minutes' : ''}</div>
            <div><strong>SMS:</strong> ${packageData.smsUsed} messages${packageData.smsTotal ? ' / ' + packageData.smsTotal + ' messages' : ''}</div>
          `;
        } else if (package.type === 'mobile_hotspot' || package.type === 'mobile_no_hotspot') {
          packageCell.innerHTML = `
            <div><strong>Data:</strong> ${packageData.dataUsed.toFixed(1)} GB / ${packageData.dataTotal} GB</div>
            <div><strong>Hotspot:</strong> ${package.type === 'mobile_hotspot' ? 'Enabled' : 'Disabled'}</div>
          `;
        } else if (package.type === 'home_internet') {
          packageCell.innerHTML = `
            <div><strong>Data:</strong> ${packageData.dataUsed.toFixed(1)} GB / ${packageData.dataTotal} GB</div>
            ${packageData.downloadSpeed ? `<div><strong>Speed:</strong> ${packageData.downloadSpeed} down / ${packageData.uploadSpeed} up</div>` : ''}
          `;
        } else {
          // Fallback for any other package type
          packageCell.innerHTML = `
            <div><strong>Data:</strong> ${packageData.dataUsed.toFixed(1)} GB / ${packageData.dataTotal} GB</div>
          `;
        }
      } else {
        packageCell.textContent = 'No data available';
      }

      row.appendChild(packageCell);
    });

    tableBody.appendChild(row);
  });
}