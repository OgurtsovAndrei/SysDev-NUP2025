# G4UltimateMobile CRM API Endpoint Specification

This document outlines the proposed API endpoints for the G4UltimateMobile CRM prototype backend, based on the analysis
of the provided Javascript frontend code and mock data. These specifications will guide the development of the Ktor
server.

## Endpoint Categories

The endpoints are grouped into logical categories for clarity.

### 1. Authentication

Handles user login and registration.

* **POST /api/auth/login**
    * **Description:** Authenticates a user using their email and password.
    * **Request Body:**
      ```json
      {
        "email": "string",
        "password": "string", 
        "rememberMe": "boolean"
      }
      ```
    * **Response:**
      ```json
      {
        "success": "boolean",
        "message": "string",
        "token": "string" // JWT or similar token on success
        // Optional: basic user info like name or ID
      }
      ```

* **POST /api/auth/register**
    * **Description:** Creates a new user account.
    * **Request Body:**
      ```json
      {
        "fullName": "string",
        "email": "string",
        "password": "string",
        "confirmPassword": "string", // Validation should happen on backend too
        "agreeTerms": "boolean" // Backend should verify this is true
      }
      ```
    * **Response:**
      ```json
      {
        "success": "boolean",
        "message": "string"
      }
      ```

### 2. User Profile

Retrieves and updates user personal and account information. Requires authentication.

* **GET /api/user/profile**
    * **Description:** Fetches the authenticated user's profile details.
    * **Response:**
      ```json
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "accountNumber": "string",
        "accountType": "string",
        "registrationDate": "string (YYYY-MM-DD)",
        "packages": [
          {
            "id": "string",
            "type": "string", // e.g., "mobile_combo", "home_internet"
            "name": "string",
            "plan": "string", // Specific plan ID if applicable
            "speed": "string", // Specific speed ID if applicable
            "router": "string", // Specific router ID if applicable 
            "addOns": ["string"] // Array of add-on IDs
          }
        ],
        "paymentMethod": "string", // Masked payment method info
        "billingAddress": {
          "street": "string",
          "city": "string",
          "state": "string",
          "zipCode": "string",
          "country": "string"
        }
      }
      ```

* **PUT /api/user/profile** (or PATCH)
    * **Description:** Updates the authenticated user's profile details.
    * **Request Body:**
      ```json
      {
        "email": "string", // Optional, if email is editable
        "paymentMethod": "string", // Optional, if payment method is editable
        "billingAddress": { // Optional, if address is editable
          "street": "string",
          "city": "string", 
          "state": "string",
          "zipCode": "string",
          "country": "string"
        }
        // Only include fields that are being updated
      }
      ```
    * **Response:**
      ```json
      {
        "success": "boolean",
        "message": "string"
      }
      ```

### 3. Packages & Ordering

Handles browsing package options and submitting new orders. Authentication may be required for placing an order.

* **GET /api/packages/types**
    * **Description:** Retrieves the list of available package types for ordering.
    * **Response:**
      ```json
      [
        {
          "id": "string", // e.g., "home_internet"
          "name": "string" // e.g., "Home Internet (limit only speed)"
        }
      ]
      ```

* **GET /api/packages/{packageTypeId}/options**
    * **Description:** Fetches the specific options available for a given package type.
    * **Parameters:** {packageTypeId} (string, path parameter)
    * **Response:**
      ```json
      {
        "speeds": [ // For home_internet
          { "id": "string", "name": "string", "price": "number" }
        ],
        "routers": [ // For home_internet
          { "id": "string", "name": "string", "price": "number" }
        ],
        "dataPlans": [ // For mobile_hotspot, mobile_no_hotspot
          { "id": "string", "name": "string", "price": "number" }
        ],
        "plans": [ // For mobile_combo
          { "id": "string", "name": "string", "price": "number" }
        ],
        "addOns": [ // For all types (structure might vary slightly)
          { "id": "string", "name": "string", "price": "number" }
        ]
        // ... other options specific to the package type
      }
      ```

* **POST /api/promo-codes/validate**
    * **Description:** Validates a submitted promo code.
    * **Request Body:**
      ```json
      {
        "promoCode": "string"
      }
      ```
    * **Response:**
      ```json
      {
        "valid": "boolean",
        "discount": "number", // e.g., 0.1 for 10%
        "description": "string" // User-friendly description
      }
      ```

* **POST /api/orders**
    * **Description:** Submits a new order for the authenticated user.
    * **Request Body:**
      ```json
      {
        "packageType": "string",
        "options": {
          "speed": "string", // ID of selected speed (if applicable)
          "router": "string", // ID of selected router (if applicable)
          "dataPlan": "string", // ID of selected data plan (if applicable)
          "plan": "string", // ID of selected combo plan (if applicable)
          "addOns": ["string"] // Array of selected add-on IDs
          // Include only relevant options based on packageType
        },
        "promoCode": "string" // Applied promo code (can be empty)
      }
      ```
    * **Response:**
      ```json
      {
        "success": "boolean",
        "message": "string",
        "orderId": "string" // Optional: ID of the created order
      }
      ```

### 4. Usage Data

Provides current and historical usage information. Requires authentication.

* **GET /api/user/usage**
    * **Description:** Fetches the authenticated user's usage data for the current and previous billing cycles.
    * **Response:**
      ```json
      {
        "currentBillingCycle": {
          "startDate": "string (YYYY-MM-DD)",
          "endDate": "string (YYYY-MM-DD)",
          "packages": {
            "PKG_ID_1": { // Key is the package ID
              "type": "string",
              "name": "string",
              "dataUsed": "number", // GB
              "dataTotal": "number", // GB
              // Mobile Combo specific
              "callMinutesUsed": "number",
              "callMinutesTotal": "number or string ('Unlimited')",
              "smsUsed": "number",
              "smsTotal": "number or string ('Unlimited')",
              // Home Internet specific
              "downloadSpeed": "string",
              "uploadSpeed": "string",
              "devices": "number"
              // Include only relevant fields based on package type
            },
            "PKG_ID_2": {}
          }
        },
        "previousBillingCycles": [
          {
            "period": "string", // e.g., "February 2025"
            "packages": {
              "PKG_ID_1": { // Key is the package ID
                "type": "string", // Included for context, maybe not strictly needed if already in user profile
                "name": "string", // Included for context
                "dataUsed": "number", // GB
                "dataTotal": "number", // GB
                // Mobile Combo specific
                "callMinutesUsed": "number",
                "callMinutesTotal": "number or string ('Unlimited')",
                "smsUsed": "number",
                "smsTotal": "number or string ('Unlimited')"
                // Note: Speed/Devices not in mock for previous cycles
              },
              "PKG_ID_2": {}
            }
          }
          // ... more previous cycles
        ]
      }
      ```

### 5. Chat/Support

Facilitates real-time or near-real-time chat with support. Requires authentication.

* **GET /api/user/chat/history** (Optional, for loading previous messages)
    * **Description:** Retrieves the message history for the authenticated user's chat.
    * **Response:**
      ```json
      [
        {
          "type": "string", // "user" or "operator"
          "text": "string",
          "time": "string (ISO 8601 timestamp)"
        }
        // ... more messages
      ]
      ```

* **POST /api/chat/messages**
    * **Description:** Sends a user message to the support chat.
    * **Request Body:**
      ```json
      {
        "messageText": "string"
      }
      ```
    * **Response:**
      ```json
      {
        "success": "boolean",
        "message": "string" // e.g., "Message sent"
        // Optional: Operator's immediate simulated response could be included here
      }
      ```
    * **Note:** A more robust chat system would likely use WebSockets for real-time communication, but this endpoint
      supports the current JS simulation.

### 6. Feedback

Allows users to submit feedback and view aggregate feedback data. Authentication may be required for submitting
feedback.

* **GET /api/feedback/summary**
    * **Description:** Retrieves aggregate feedback data (average rating, total reviews) and potentially recent feedback
      entries.
    * **Response:**
      ```json
      {
        "averageRating": "number", // e.g., 4.5
        "totalReviews": "number", // e.g., 128
        "recentFeedback": [ // Optional: Array of recent feedback entries
          {
            "id": "string",
            "rating": "number",
            "topic": "string", 
            "text": "string",
            "timestamp": "string (ISO 8601 timestamp)",
            "user": "string" // User identifier (e.g., masked name)
          }
        ]
      }
      ```

* **POST /api/feedback**
    * **Description:** Submits new feedback from the authenticated user.
    * **Request Body:**
      ```json
      {
        "rating": "number", // 1-5
        "topic": "string",
        "text": "string"
      }
      ```
    * **Response:**
      ```json
      {
        "success": "boolean",
        "message": "string" // e.g., "Feedback submitted successfully"
      }
      ```

### 7. Other User Data (Based on Mock Data)

Endpoints for accessing additional user-specific information. Requires authentication.

* **GET /api/user/support-tickets**
    * **Description:** Retrieves a list of the authenticated user's support tickets.
    * **Response:**
      ```json
      [
        {
          "id": "string",
          "subject": "string",
          "status": "string", // e.g., "Open", "Closed"
          "createdDate": "string (YYYY-MM-DD)",
          "lastUpdated": "string (YYYY-MM-DD)",
          "priority": "string", // e.g., "Medium", "High"
          "resolution": "string" // Present if status is "Closed"
        }
      ]
      ```

* **GET /api/user/notifications**
    * **Description:** Retrieves a list of the authenticated user's notifications.
    * **Response:**
      ```json
      [
        {
          "id": "string",
          "type": "string", // e.g., "billing", "promotion", "usage"
          "message": "string",
          "date": "string (YYYY-MM-DD)",
          "read": "boolean"
        }
      ]
      ```

* **PATCH /api/user/notifications/{notificationId}/read**
    * **Description:** Marks a specific notification as read for the authenticated user.
    * **Parameters:** {notificationId} (string, path parameter)
    * **Response:**
      ```json
      {
        "success": "boolean",
        "message": "string" // e.g., "Notification marked as read"
      }
      ```

This specification provides a detailed outline for the Ktor backend development. Let me know when you're ready to start
building the Ktor server, and we can begin with the authentication endpoints.