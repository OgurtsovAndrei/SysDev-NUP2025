console.log("G4UltimateMobile CRM Prototype Initialized");
// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
  console.log("Page fully loaded");

  // Try to get user profile on page load
  try {
    const userInfo = await getUserProfile();
    if (userInfo) {
      console.log("Welcome back, " + userInfo.name);
    }
  } catch (error) {
    console.log("User not logged in or error fetching profile");
  }

  // Initialize order page if we're on it
  if (document.getElementById('orderForm')) {
    await initializePackageTypeDropdown();
  }

  // Initialize usage page if we're on it
  if (document.getElementById('packageSections')) {
    await initializeUsagePage();
  }

  // Initialize chat page if we're on it
  if (document.getElementById('chatMessages')) {
    initializeChatPage();
  }

  // Initialize feedback page if we're on it
  if (document.getElementById('feedbackForm')) {
    await initializeFeedbackPage();
  }

  // Initialize profile page if we're on it
  if (document.getElementById('profileBody')) {
    await initializeProfilePage();
  }

  // Initialize register page if we're on it
  if (document.getElementById('registerForm')) {
    initializeRegisterPage();
  }
});