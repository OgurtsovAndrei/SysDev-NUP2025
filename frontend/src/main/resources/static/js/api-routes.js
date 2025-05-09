// api-routes.js
// Defines the base URL and specific endpoints for the G4UltimateMobile CRM API.

// Replace with the actual base URL of your backend server
const API_BASE_URL = 'http://localhost:8081/api'; // Example: assuming your server runs on localhost:8080

// Authentication Endpoints
const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`
};

// User Profile Endpoints
const USER_ENDPOINTS = {
    PROFILE: `${API_BASE_URL}/user/profile`,
    SUPPORT_TICKETS: `${API_BASE_URL}/user/support-tickets`,
    NOTIFICATIONS: `${API_BASE_URL}/user/notifications`,
    // Endpoint for marking a specific notification as read (requires notificationId)
    MARK_NOTIFICATION_READ: (notificationId) => `${API_BASE_URL}/user/notifications/${notificationId}/read`
};

// Packages and Ordering Endpoints
const PACKAGES_ENDPOINTS = {
    PACKAGE_TYPES: `${API_BASE_URL}/packages/types`,
    // Endpoint for getting options for a specific package type (requires packageTypeId)
    PACKAGE_OPTIONS: (packageTypeId) => `${API_BASE_URL}/packages/${packageTypeId}/options`
};

const ORDER_ENDPOINTS = {
    VALIDATE_PROMO_CODE: `${API_BASE_URL}/promo-codes/validate`,
    SUBMIT_ORDER: `${API_BASE_URL}/orders`
};

// Usage Data Endpoints
const USAGE_ENDPOINTS = {
    USER_USAGE: `${API_BASE_URL}/user/usage`,
    DELETE_PACKAGE: (packageId) => `${API_BASE_URL}/user/usage/${packageId}`
};

// Feedback Endpoints
const FEEDBACK_ENDPOINTS = {
    FEEDBACK_SUMMARY: `${API_BASE_URL}/feedback/summary`,
    SUBMIT_FEEDBACK: `${API_BASE_URL}/feedback`
};

// Chat Endpoints
const CHAT_ENDPOINTS = {
    CHAT_HISTORY: `${API_BASE_URL}/user/chat/history`,
    SEND_MESSAGE: `${API_BASE_URL}/chat/messages`
};

// Export the endpoints for use in other modules
export {
    AUTH_ENDPOINTS,
    USER_ENDPOINTS,
    PACKAGES_ENDPOINTS,
    ORDER_ENDPOINTS,
    USAGE_ENDPOINTS,
    FEEDBACK_ENDPOINTS,
    CHAT_ENDPOINTS
};
