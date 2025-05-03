console.log("G4UltimateMobile CRM Prototype Initialized");

// Navigation functions
function goToOrderPage() {
  console.log("Navigating to Order Page");
  alert("Order Page would load here");
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

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  console.log("Page fully loaded");
  // Example of using mock data on page load
  if (mockData && mockData.userInfo) {
    console.log("Welcome back, " + mockData.userInfo.name);
  }
});
