console.log("G4UltimateMobile CRM Prototype Initialized");

// Example of using mock data
function displayAvailablePackages() {
  console.log("Displaying available packages:", mockData.packages);
  // In a real implementation, this would populate a UI element with the packages
}

function displayUserInfo() {
  console.log("Displaying user info:", mockData.userInfo);
  // In a real implementation, this would populate UI elements with user information
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
  if (document.getElementById('packageSections')) {
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