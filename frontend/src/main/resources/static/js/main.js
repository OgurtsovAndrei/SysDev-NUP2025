console.log("G4UltimateMobile CRM Prototype Initialized");

import {getUserProfile, getPackageTypes} from './model.js';

function displayAvailablePackages() {
    const packageTypesGrid = document.getElementById('packageTypesGrid');
    if (!packageTypesGrid) return;

    // Clear loading indicator
    packageTypesGrid.innerHTML = '';

    getPackageTypes()
        .then(packageTypes => {
            console.log("Displaying available packages:", packageTypes);

            // Sample images for package types (in a real app, these would come from the API)
            const packageImages = {
                'home_internet': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
                'mobile_hotspot': 'https://images.unsplash.com/photo-1567581935884-3349723552ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
                'mobile_no_hotspot': 'https://images.unsplash.com/photo-1585399000684-d2f72660f092?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
                'mobile_combo': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
            };

            // Package descriptions and base prices now come from the API

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
                img.src = packageImages[packageType.id] || 'https://via.placeholder.com/300';
                img.className = 'card-img-top';
                img.alt = packageType.name;

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                const title = document.createElement('h5');
                title.className = 'card-title';
                title.textContent = packageType.name;

                const price = document.createElement('p');
                price.className = 'card-text text-primary fw-bold';
                price.textContent = `from $${packageType.basePrice.toFixed(2)}`;

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
