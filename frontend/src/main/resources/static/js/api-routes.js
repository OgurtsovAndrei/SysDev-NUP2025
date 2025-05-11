const API_BASE_URL = 'http://localhost:8081/api';

const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`
};

const USER_ENDPOINTS = {
    PROFILE: `${API_BASE_URL}/user/profile`,
    SUPPORT_TICKETS: `${API_BASE_URL}/user/support-tickets`,
    NOTIFICATIONS: `${API_BASE_URL}/user/notifications`,
    MARK_NOTIFICATION_READ: (notificationId) => `${API_BASE_URL}/user/notifications/${notificationId}/read`
};

const PACKAGES_ENDPOINTS = {
    PACKAGE_TYPES: `${API_BASE_URL}/packages/types`,
    PACKAGE_OPTIONS: (packageTypeId) => `${API_BASE_URL}/packages/${packageTypeId}/options`
};

const ORDER_ENDPOINTS = {
    VALIDATE_PROMO_CODE: `${API_BASE_URL}/promo-codes/validate`,
    SUBMIT_ORDER: `${API_BASE_URL}/orders`
};

const USAGE_ENDPOINTS = {
    USER_USAGE: `${API_BASE_URL}/user/usage`,
    DELETE_PACKAGE: (packageId) => `${API_BASE_URL}/user/usage/${packageId}`
};

const FEEDBACK_ENDPOINTS = {
    FEEDBACK_SUMMARY: `${API_BASE_URL}/feedback/summary`,
    SUBMIT_FEEDBACK: `${API_BASE_URL}/feedback`
};

const CHAT_ENDPOINTS = {
    CHAT_HISTORY: `${API_BASE_URL}/user/chat/history`,
    SEND_MESSAGE: `${API_BASE_URL}/chat/messages`
};

export {
    AUTH_ENDPOINTS,
    USER_ENDPOINTS,
    PACKAGES_ENDPOINTS,
    ORDER_ENDPOINTS,
    USAGE_ENDPOINTS,
    FEEDBACK_ENDPOINTS,
    CHAT_ENDPOINTS
};
