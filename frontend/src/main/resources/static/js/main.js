console.log("G4UltimateMobile CRM Prototype Initialized");

import {getUserProfile, getPackageTypes, getPackageImageLink} from './model.js';

function displayAvailablePackages() {
    const packageTypesGrid = document.getElementById('packageTypesGrid');
    if (!packageTypesGrid) return;

    // Clear loading indicator
    packageTypesGrid.innerHTML = '';

    getPackageTypes()
        .then(packageTypes => {
            console.log("Displaying available packages:", packageTypes);

            packageTypes.forEach(packageType => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-3 mb-4';

                const card = document.createElement('div');
                card.className = 'card h-100';
                card.style.cursor = 'pointer';
                card.onclick = function() {
                    goToOrderPageWithPackage(packageType.id);
                };

                const img = document.createElement('img');
                img.src = getPackageImageLink(packageType.id);
                img.className = 'card-img-top';
                img.alt = packageType.name;

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                const title = document.createElement('h5');
                title.className = 'card-title';
                title.textContent = packageType.name;

                const price = document.createElement('p');
                price.className = 'card-text text-primary fw-bold';
                price.textContent = `from $${(packageType.basePrice || 0).toFixed(2)}`;

                const description = document.createElement('p');
                description.className = 'card-text';
                description.textContent = packageType.description || 'A flexible plan to meet your needs.';

                cardBody.appendChild(title);
                cardBody.appendChild(price);
                cardBody.appendChild(description);

                card.appendChild(img);
                card.appendChild(cardBody);

                col.appendChild(card);
                packageTypesGrid.appendChild(col);
            });
        })
        .catch(error => {
            console.error("Failed to load package types:", error);
            packageTypesGrid.innerHTML = '<div class="col-12 text-center text-danger">Failed to load available plans. Please try again later.</div>';
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

    // Display package types on the main page
    if (document.getElementById('packageTypesGrid')) {
        displayAvailablePackages();
    }

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
