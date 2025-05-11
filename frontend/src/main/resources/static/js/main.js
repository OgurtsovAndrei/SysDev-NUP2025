console.log("G4UltimateMobile CRM Prototype Initialized");

import {getUserProfile, getPackageTypes} from './model.js';

function displayAvailablePackages() {
    getPackageTypes()
        .then(packageTypes => {
            console.log("Displaying available packages:", packageTypes);
        })
        .catch(error => {
            console.error("Failed to load package types:", error);
        });
}

function displayUserInfo() {
    getUserProfile()
        .then(userProfile => {
            console.log("Displaying user info:", userProfile);
        })
        .catch(error => {
            console.error("Failed to load user profile:", error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("Page fully loaded");

    getUserProfile()
        .then(userProfile => {
            if (userProfile) {
                console.log("Welcome back, " + userProfile.name);
            }
        })
        .catch(error => {
            console.error("Failed to load user profile:", error);
        });

    if (document.getElementById('orderForm')) {
        initializePackageTypeDropdown();
    }

    if (document.getElementById('packageSections')) {
        initializeUsagePage();
    }

    if (document.getElementById('chatMessages')) {
        initializeChatPage();
    }

    if (document.getElementById('feedbackForm')) {
        initializeFeedbackPage();
    }

    if (document.getElementById('profileBody')) {
        initializeProfilePage();
    }

    if (document.getElementById('registerForm')) {
        initializeRegisterPage();
    }
});
