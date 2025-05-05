console.log("G4UltimateMobile CRM Prototype Initialized");

// Import the necessary functions from model.js
import { getUserProfile, getPackageTypes } from './model.js';

// Example of using mock data
function displayAvailablePackages() {
  getPackageTypes()
    .then(packageTypes => {
      console.log("Displaying available packages:", packageTypes);
      // In a real implementation, this would populate a UI element with the packages
    })
    .catch(error => {
      console.error("Failed to load package types:", error);
    });
}

function displayUserInfo() {
  getUserProfile()
    .then(userProfile => {
      console.log("Displaying user info:", userProfile);
      // In a real implementation, this would populate UI elements with user information
    })
    .catch(error => {
      console.error("Failed to load user profile:", error);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  console.log("Page fully loaded");

  // Get user profile from API
  getUserProfile()
    .then(userProfile => {
      if (userProfile) {
        console.log("Welcome back, " + userProfile.name);
      }
    })
    .catch(error => {
      console.error("Failed to load user profile:", error);
    });

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
