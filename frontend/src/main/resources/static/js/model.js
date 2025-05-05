// model.js
// Handles data fetching and manipulation by interacting with the backend API.
// Uses the API endpoint definitions from api-routes.js.

import {
    AUTH_ENDPOINTS,
    USER_ENDPOINTS,
    PACKAGES_ENDPOINTS,
    ORDER_ENDPOINTS,
    USAGE_ENDPOINTS,
    FEEDBACK_ENDPOINTS,
    CHAT_ENDPOINTS
} from './api-routes.js'; // Ensure the correct path to api-routes.js

// --- Type Definitions for API Responses ---

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Indicates if the API request was successful.
 * @property {string} message - A message related to the request result.
 * @property {any} [data] - Optional data returned by the API.
 * @property {string} [token] - Optional authentication token (e.g., for login).
 * @property {boolean} [valid] - Optional field for validation endpoints (e.g., promo code).
 * @property {number} [discount] - Optional discount value (e.g., for promo code).
 * @property {string} [description] - Optional description (e.g., for promo code).
 * @property {string} [orderId] - Optional ID of a created order.
 */

/**
 * @typedef {Object} LoginResponse
 * @property {boolean} success - Indicates if login was successful.
 * @property {string} message - Login result message.
 * @property {string} [token] - JWT or similar token on success.
 */

/**
 * @typedef {Object} RegisterResponse
 * @property {boolean} success - Indicates if registration was successful.
 * @property {string} message - Registration result message.
 */

/**
 * @typedef {Object} UserPackage
 * @property {string} id - Package ID.
 * @property {string} type - Package type (e.g., "mobile_combo", "home_internet").
 * @property {string} name - Package name.
 * @property {string} [plan] - Specific plan ID (if applicable).
 * @property {string} [speed] - Specific speed ID (if applicable).
 * @property {string} [router] - Specific router ID (if applicable).
 * @property {string[]} [addOns] - Array of add-on IDs.
 */

/**
 * @typedef {Object} BillingAddress
 * @property {string} street - Street address.
 * @property {string} city - City.
 * @property {string} state - State.
 * @property {string} zipCode - Zip code.
 * @property {string} country - Country.
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id - User ID.
 * @property {string} name - User's full name.
 * @property {string} email - User's email address.
 * @property {string} phone - User's phone number.
 * @property {string} accountNumber - User's account number.
 * @property {string} accountType - User's account type.
 * @property {string} registrationDate - Registration date (YYYY-MM-DD).
 * @property {UserPackage[]} packages - Array of user's active packages.
 * @property {string} paymentMethod - Masked payment method info.
 * @property {BillingAddress} billingAddress - User's billing address.
 */

/**
 * @typedef {Object} UpdateProfileResponse
 * @property {boolean} success - Indicates if the update was successful.
 * @property {string} message - Update result message.
 */

/**
 * @typedef {Object} SupportTicket
 * @property {string} id - Ticket ID.
 * @property {string} subject - Ticket subject.
 * @property {string} status - Ticket status (e.g., "Open", "Closed").
 * @property {string} createdDate - Creation date (YYYY-MM-DD).
 * @property {string} lastUpdated - Last update date (YYYY-MM-DD).
 * @property {string} priority - Ticket priority (e.g., "Medium", "High").
 * @property {string} [resolution] - Resolution details (if status is "Closed").
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Notification ID.
 * @property {string} type - Notification type (e.g., "billing", "promotion", "usage").
 * @property {string} message - Notification message.
 * @property {string} date - Notification date (YYYY-MM-DD).
 * @property {boolean} read - Read status.
 */

/**
 * @typedef {Object} MarkNotificationReadResponse
 * @property {boolean} success - Indicates if the update was successful.
 * @property {string} message - Result message.
 */

/**
 * @typedef {Object} PackageType
 * @property {string} id - Package type ID.
 * @property {string} name - Package type name.
 */

/**
 * @typedef {Object} PackageOptionItem
 * @property {string} id - Option item ID.
 * @property {string} name - Option item name.
 * @property {number} price - Option item price.
 */

/**
 * @typedef {Object} PackageOptions
 * @property {PackageOptionItem[]} [speeds] - Available speeds (for home_internet).
 * @property {PackageOptionItem[]} [routers] - Available routers (for home_internet).
 * @property {PackageOptionItem[]} [dataPlans] - Available data plans (for mobile_hotspot, mobile_no_hotspot).
 * @property {PackageOptionItem[]} [plans] - Available plans (for mobile_combo).
 * @property {PackageOptionItem[]} [addOns] - Available add-ons.
 * // ... other options specific to the package type
 */

/**
 * @typedef {Object} ValidatePromoCodeResponse
 * @property {boolean} valid - Indicates if the promo code is valid.
 * @property {number} [discount] - Discount value (e.g., 0.1 for 10%).
 * @property {string} [description] - User-friendly description.
 */

/**
 * @typedef {Object} SubmitOrderRequest
 * @property {string} packageType - Selected package type ID.
 * @property {Object} options - Selected options.
 * @property {string} [options.speed] - ID of selected speed (if applicable).
 * @property {string} [options.router] - ID of selected router (if applicable).
 * @property {string} [options.dataPlan] - ID of selected data plan (if applicable).
 * @property {string} [options.plan] - ID of selected combo plan (if applicable).
 * @property {string[]} [options.addOns] - Array of selected add-on IDs.
 * @property {string} [promoCode] - Applied promo code (can be empty).
 */

/**
 * @typedef {Object} SubmitOrderResponse
 * @property {boolean} success - Indicates if the order was submitted successfully.
 * @property {string} message - Result message.
 * @property {string} [orderId] - ID of the created order.
 */

/**
 * @typedef {Object} PackageUsageData
 * @property {string} type - Package type.
 * @property {string} name - Package name.
 * @property {number} dataUsed - Data used in GB.
 * @property {number} dataTotal - Total data in GB.
 * @property {number} [callMinutesUsed] - Call minutes used (Mobile Combo).
 * @property {number|string} [callMinutesTotal] - Total call minutes or 'Unlimited' (Mobile Combo).
 * @property {number} [smsUsed] - SMS used (Mobile Combo).
 * @property {number|string} [smsTotal] - Total SMS or 'Unlimited' (Mobile Combo).
 * @property {string} [downloadSpeed] - Download speed (Home Internet).
 * @property {string} [uploadSpeed] - Upload speed (Home Internet).
 * @property {number} [devices] - Connected devices (Home Internet).
 * @property {boolean} [hotspotAllowed] - Indicates if hotspot is allowed (Mobile plans).
 * // Include only relevant fields based on package type
 */

/**
 * @typedef {Object} BillingCycleUsage
 * @property {string} startDate - Cycle start date (YYYY-MM-DD).
 * @property {string} endDate - Cycle end date (YYYY-MM-DD).
 * @property {{[packageId: string]: PackageUsageData}} packages - Usage data per package, keyed by package ID.
 */

/**
 * @typedef {Object} PreviousBillingCycleUsage
 * @property {string} period - Period description (e.g., "February 2025").
 * @property {{[packageId: string]: PackageUsageData}} packages - Usage data per package, keyed by package ID.
 */

/**
 * @typedef {Object} UserUsageData
 * @property {BillingCycleUsage} currentBillingCycle - Usage data for the current cycle.
 * @property {PreviousBillingCycleUsage[]} previousBillingCycles - Array of previous cycle usage data.
 */

/**
 * @typedef {Object} FeedbackEntry
 * @property {string} id - Feedback ID.
 * @property {number} rating - Rating (1-5).
 * @property {string} topic - Feedback topic.
 * @property {string} text - Feedback text.
 * @property {string} timestamp - Timestamp (ISO 8601).
 * @property {string} user - User identifier (e.g., masked name).
 */

/**
 * @typedef {Object} FeedbackSummary
 * @property {number} averageRating - Average rating.
 * @property {number} totalReviews - Total number of reviews.
 * @property {FeedbackEntry[]} [recentFeedback] - Optional array of recent feedback entries.
 */

/**
 * @typedef {Object} SubmitFeedbackRequest
 * @property {number} rating - Rating (1-5).
 * @property {string} topic - Feedback topic.
 * @property {string} text - Feedback text.
 */

/**
 * @typedef {Object} SubmitFeedbackResponse
 * @property {boolean} success - Indicates if feedback was submitted successfully.
 * @property {string} message - Result message.
 */


// Helper function to handle API responses
/**
 * Handles the API response, checking for errors and parsing the JSON body.
 * @param {Response} response - The fetch API Response object.
 * @returns {Promise<ApiResponse>} A promise that resolves with the JSON response body.
 * @throws {Error} If the response status is not OK.
 */
async function handleApiResponse(response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API request failed with status ${response.status}`);
    }
    return response.json();
}

// Helper function to get the authentication token (replace with your actual token storage logic)
/**
 * Retrieves the authentication token from storage.
 * @returns {string|null} The authentication token, or null if not found.
 */
function getAuthToken() {
    // This is a placeholder. In a real application, you would get the token
    // from localStorage, sessionStorage, or a state management system.
    return localStorage.getItem('authToken'); // Example: getting from localStorage
}

// Helper function to include the auth token in headers
/**
 * Creates headers object including Content-Type and Authorization if a token exists.
 * @returns {HeadersInit} The headers object.
 */
function getAuthHeaders() {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`; // Assuming JWT Bearer token
    }
    return headers;
}

// --- Authentication API Calls ---

/**
 * Sends a login request to the API.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @param {boolean} rememberMe - Remember me flag.
 * @returns {Promise<LoginResponse>} A promise that resolves with the login response.
 * @throws {Error} If the API request fails or returns an error.
 */
async function loginUser(email, password, rememberMe) {
    try {
        const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                rememberMe
            })
        });
        const data = await handleApiResponse(response);
        // In a real app, you would store the token here:
        // if (data.success && data.token) {
        //     localStorage.setItem('authToken', data.token);
        // }
        return data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error; // Re-throw to be handled by the caller
    }
}

/**
 * Sends a registration request to the API.
 * @param {string} fullName - User's full name.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @param {string} confirmPassword - Password confirmation.
 * @param {boolean} agreeTerms - Terms agreement flag.
 * @returns {Promise<RegisterResponse>} A promise that resolves with the registration response.
 * @throws {Error} If the API request fails or returns an error.
 */
async function registerUser(fullName, email, password, confirmPassword, agreeTerms) {
    try {
        const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName,
                email,
                password,
                confirmPassword,
                agreeTerms
            })
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}

// --- User Profile API Calls ---

/**
 * Fetches the authenticated user's profile details from the API.
 * @returns {Promise<UserProfile>} A promise that resolves with the user profile data.
 * @throws {Error} If the API request fails or returns an error.
 */
async function getUserProfile() {
    try {
        const response = await fetch(USER_ENDPOINTS.PROFILE, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        throw error;
    }
}

/**
 * Updates the authenticated user's profile details via the API.
 * @param {Object} profileData - The profile data to update.
 * @param {string} [profileData.email] - Optional updated email.
 * @param {string} [profileData.paymentMethod] - Optional updated payment method.
 * @param {BillingAddress} [profileData.billingAddress] - Optional updated billing address.
 * @returns {Promise<UpdateProfileResponse>} A promise that resolves with the update response.
 * @throws {Error} If the API request fails or returns an error.
 */
async function updateUserProfile(profileData) {
    try {
        const response = await fetch(USER_ENDPOINTS.PROFILE, {
            method: 'PUT', // Or 'PATCH' depending on your API spec
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData)
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to update user profile:', error);
        throw error;
    }
}

/**
 * Fetches the authenticated user's support tickets from the API.
 * @returns {Promise<SupportTicket[]>} A promise that resolves with an array of support tickets.
 * @throws {Error} If the API request fails or returns an error.
 */
async function getUserSupportTickets() {
    try {
        const response = await fetch(USER_ENDPOINTS.SUPPORT_TICKETS, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to fetch support tickets:', error);
        throw error;
    }
}

/**
 * Fetches the authenticated user's notifications from the API.
 * @returns {Promise<Notification[]>} A promise that resolves with an array of notifications.
 * @throws {Error} If the API request fails or returns an error.
 */
async function getUserNotifications() {
    try {
        const response = await fetch(USER_ENDPOINTS.NOTIFICATIONS, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
        throw error;
    }
}

/**
 * Marks a specific notification as read via the API.
 * @param {string} notificationId - The ID of the notification to mark as read.
 * @returns {Promise<MarkNotificationReadResponse>} A promise that resolves with the update response.
 * @throws {Error} If the API request fails or returns an error.
 */
async function markNotificationAsRead(notificationId) {
    try {
        const response = await fetch(USER_ENDPOINTS.MARK_NOTIFICATION_READ(notificationId), {
            method: 'PATCH', // Or 'PUT' depending on your API spec
            headers: getAuthHeaders()
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error(`Failed to mark notification ${notificationId} as read:`, error);
        throw error;
    }
}


// --- Packages and Ordering API Calls ---

/**
 * Fetches the available package types from the API.
 * @returns {Promise<PackageType[]>} A promise that resolves with an array of package types.
 * @throws {Error} If the API request fails or returns an error.
 */
async function getPackageTypes() {
    try {
        const response = await fetch(PACKAGES_ENDPOINTS.PACKAGE_TYPES, {
            method: 'GET',
            headers: getAuthHeaders() // May or may not require auth depending on API
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to fetch package types:', error);
        throw error;
    }
}

/**
 * Fetches the options available for a specific package type from the API.
 * @param {string} packageTypeId - The ID of the package type.
 * @returns {Promise<PackageOptions>} A promise that resolves with the package options data.
 * @throws {Error} If the API request fails or returns an error.
 */
async function getPackageOptions(packageTypeId) {
    try {
        const response = await fetch(PACKAGES_ENDPOINTS.PACKAGE_OPTIONS(packageTypeId), {
            method: 'GET',
            headers: getAuthHeaders() // May or may not require auth depending on API
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error(`Failed to fetch options for package type ${packageTypeId}:`, error);
        throw error;
    }
}

/**
 * Validates a promo code via the API.
 * @param {string} promoCode - The promo code to validate.
 * @returns {Promise<ValidatePromoCodeResponse>} A promise that resolves with the validation response.
 * @throws {Error} If the API request fails or returns an error.
 */
async function validatePromoCode(promoCode) {
    try {
        const response = await fetch(ORDER_ENDPOINTS.VALIDATE_PROMO_CODE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, // May or may not require auth depending on API
            body: JSON.stringify({
                promoCode
            })
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to validate promo code:', error);
        throw error;
    }
}

/**
 * Submits a new order via the API.
 * @param {SubmitOrderRequest} orderDetails - The details of the order to submit.
 * @returns {Promise<SubmitOrderResponse>} A promise that resolves with the order submission response.
 * @throws {Error} If the API request fails or returns an error.
 */
async function submitOrder(orderDetails) {
    try {
        const response = await fetch(ORDER_ENDPOINTS.SUBMIT_ORDER, {
            method: 'POST',
            headers: getAuthHeaders(), // Placing an order likely requires auth
            body: JSON.stringify(orderDetails)
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to submit order:', error);
        throw error;
    }
}

// --- Usage Data API Calls ---

/**
 * Fetches the authenticated user's usage data from the API.
 * @returns {Promise<UserUsageData>} A promise that resolves with the user usage data.
 * @throws {Error} If the API request fails or returns an error.
 */
async function getUserUsage() {
    try {
        const response = await fetch(USAGE_ENDPOINTS.USER_USAGE, {
            method: 'GET',
            headers: getAuthHeaders() // Usage data requires auth
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to fetch user usage data:', error);
        throw error;
    }
}

// --- Feedback API Calls ---

/**
 * Fetches the aggregate feedback summary from the API.
 * @returns {Promise<FeedbackSummary>} A promise that resolves with the feedback summary data.
 * @throws {Error} If the API request fails or returns an error.
 */
async function getFeedbackSummary() {
    try {
        const response = await fetch(FEEDBACK_ENDPOINTS.FEEDBACK_SUMMARY, {
            method: 'GET',
            headers: getAuthHeaders() // May or may not require auth depending on API
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to fetch feedback summary:', error);
        throw error;
    }
}

/**
 * Submits new feedback via the API.
 * @param {SubmitFeedbackRequest} feedbackData - The feedback data to submit.
 * @returns {Promise<SubmitFeedbackResponse>} A promise that resolves with the feedback submission response.
 * @throws {Error} If the API request fails or returns an error.
 */
async function submitFeedback(feedbackData) {
    try {
        const response = await fetch(FEEDBACK_ENDPOINTS.SUBMIT_FEEDBACK, {
            method: 'POST',
            headers: getAuthHeaders(), // Submitting feedback may require auth
            body: JSON.stringify(feedbackData)
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to submit feedback:', error);
        throw error;
    }
}


// --- Chat API Calls ---

/**
 * Fetches the chat history for the authenticated user from the API.
 * @returns {Promise<ChatMessage[]>} A promise that resolves with an array of chat messages.
 * @throws {Error} If the API request fails or returns an error.
 */
async function getChatHistory() {
    try {
        const response = await fetch(CHAT_ENDPOINTS.CHAT_HISTORY, {
            method: 'GET',
            headers: getAuthHeaders() // Chat history requires auth
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to fetch chat history:', error);
        throw error;
    }
}

/**
 * Sends a chat message to the API.
 * @param {string} messageText - The text of the message to send.
 * @returns {Promise<ApiResponse>} A promise that resolves with the API response.
 * @throws {Error} If the API request fails or returns an error.
 */
async function sendChatMessage(messageText) {
    try {
        const response = await fetch(CHAT_ENDPOINTS.SEND_MESSAGE, {
            method: 'POST',
            headers: getAuthHeaders(), // Sending a message requires auth
            body: JSON.stringify({
                messageText
            })
        });
        return handleApiResponse(response);
    } catch (error) {
        console.error('Failed to send chat message:', error);
        throw error;
    }
}

// Export the API interaction functions
export {
    loginUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUserSupportTickets,
    getUserNotifications,
    markNotificationAsRead,
    getPackageTypes,
    getPackageOptions,
    validatePromoCode,
    submitOrder,
    getUserUsage,
    getFeedbackSummary,
    submitFeedback,
    getChatHistory,
    sendChatMessage,
    // Add other exported functions as you create them
};
