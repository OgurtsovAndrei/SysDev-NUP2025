package com.yourcompany.backend.models

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: String,
    val name: String,
    val email: String,
    val password: String, // In a real app, this would be hashed!
    val phone: String,
    val accountNumber: String,
    val accountType: String,
    val registrationDate: String,
    val packages: List<UserPackage>,
    val paymentMethod: String,
    val billingAddress: Address
)

// Data class for the Login Request body
@Serializable
data class LoginRequest(
    val email: String,
    val password: String,
    val rememberMe: Boolean
)

// Data class for the Login Response body
@Serializable
data class LoginResponse(
    val success: Boolean,
    val message: String,
    val token: String? = null // Token is optional (only present on success)
)

// Data class for the Register Request body
@Serializable
data class RegisterRequest(
    val fullName: String,
    val email: String,
    val password: String,
    val confirmPassword: String,
    val agreeTerms: Boolean
)

// Generic API Response data class
@Serializable
data class ApiResponse(
    val success: Boolean,
    val message: String
)

// Data class for the User Profile response
@Serializable
data class UserProfile(
    val id: String,
    val name: String,
    val email: String,
    val phone: String,
    val accountNumber: String,
    val accountType: String,
    val registrationDate: String,
    val packages: List<UserPackage>, // List of packages the user has
    val paymentMethod: String,
    val billingAddress: Address
)

// Data class for a User's Package within the profile
@Serializable
data class UserPackage(
    val id: String,
    val type: String, // e.g., "mobile_combo", "home_internet"
    val name: String,
    val plan: String? = null, // Specific plan ID if applicable
    val speed: String? = null, // Specific speed ID if applicable
    val router: String? = null, // Specific router ID if applicable
    val addOns: List<String> = emptyList() // Array of add-on IDs
)

// Data class for an Address
@Serializable
data class Address(
    val street: String,
    val city: String,
    val state: String,
    val zipCode: String,
    val country: String
)

// Data class for updating User Profile
@Serializable
data class UpdateProfileRequest(
    val email: String? = null,
    val paymentMethod: String? = null,
    val billingAddress: Address? = null
)


// Data class for Package Type
@Serializable
data class PackageType(
    val id: String,
    val name: String
)

// Data classes for Package Options (example structures, might need refinement based on mock data)
@Serializable
data class PackageOptionsResponse(
    val speeds: List<Option>? = null,
    val routers: List<Option>? = null,
    val dataPlans: List<Option>? = null,
    val plans: List<Option>? = null,
    val addOns: List<Option>? = null
)

@Serializable
data class Option(
    val id: String,
    val name: String,
    val price: Double
)

// Data class for Promo Code Validation Request
@Serializable
data class ValidatePromoCodeRequest(
    val promoCode: String
)

// Data class for Promo Code Validation Response
@Serializable
data class ValidatePromoCodeResponse(
    val valid: Boolean,
    val discount: Double = 0.0,
    val description: String? = null
)

// Data class for Order Request
@Serializable
data class OrderRequest(
    val packageType: String,
    val options: OrderOptions,
    val promoCode: String? = null
)

// Data class for Order Options within Order Request
@Serializable
data class OrderOptions(
    val speed: String? = null,
    val router: String? = null,
    val dataPlan: String? = null,
    val plan: String? = null,
    val addOns: List<String> = emptyList()
)

// Data class for Usage Data Response
@Serializable
data class UsageDataResponse(
    val currentBillingCycle: BillingCycle,
    val previousBillingCycles: List<PreviousBillingCycle>
)

// Data class for a Billing Cycle
@Serializable
data class BillingCycle(
    val startDate: String,
    val endDate: String,
    val packages: Map<String, PackageUsage> // Map of package ID to usage data
)

// Data class for Package Usage within a Billing Cycle
@Serializable
data class PackageUsage(
    val type: String,
    val name: String,
    val dataUsed: Double, // GB
    val dataTotal: Double, // GB
    // Mobile Combo specific
    val callMinutesUsed: Int? = null,
    val callMinutesTotal: String? = null, // Number or "Unlimited"
    val smsUsed: Int? = null,
    val smsTotal: String? = null, // Number or "Unlimited"
    // Home Internet specific
    val downloadSpeed: String? = null,
    val uploadSpeed: String? = null,
    val devices: Int? = null
)

// Data class for a Previous Billing Cycle
@Serializable
data class PreviousBillingCycle(
    val period: String, // e.g., "February 2025"
    val packages: Map<String, PreviousPackageUsage> // Map of package ID to usage data
)

// Data class for Package Usage within a Previous Billing Cycle
@Serializable
data class PreviousPackageUsage(
    val type: String, // Included for context
    val name: String, // Included for context
    val dataUsed: Double, // GB
    val dataTotal: Double, // GB
    // Mobile Combo specific
    val callMinutesUsed: Int? = null,
    val callMinutesTotal: String? = null, // Number or "Unlimited"
    val smsUsed: Int? = null,
    val smsTotal: String? = null // Number or "Unlimited"
    // Note: Speed/Devices not in mock for previous cycles
)

// Data class for Chat Message
@Serializable
data class ChatMessage(
    val type: String, // "user" or "operator"
    val text: String,
    val time: String // ISO 8601 timestamp
)

// Data class for sending a Chat Message
@Serializable
data class SendChatMessageRequest(
    val messageText: String
)


// Data class for Feedback Summary Response
@Serializable
data class FeedbackSummary(
    val averageRating: Double,
    val totalReviews: Int,
    val recentFeedback: List<FeedbackEntry>? = null
)

// Data class for a Feedback Entry
@Serializable
data class FeedbackEntry(
    val id: String,
    val rating: Int,
    val topic: String,
    val text: String,
    val timestamp: String,
    val user: String // User identifier
)

// Data class for Feedback Submission Request
@Serializable
data class SubmitFeedbackRequest(
    val rating: Int,
    val topic: String,
    val text: String
)

// Data class for Support Ticket
@Serializable
data class SupportTicket(
    val id: String,
    val subject: String,
    val status: String, // e.g., "Open", "Closed"
    val createdDate: String,
    val lastUpdated: String,
    val priority: String, // e.g., "Medium", "High"
    val resolution: String? = null // Present if status is "Closed"
)

// Data class for Notification
@Serializable
data class Notification(
    val id: String,
    val type: String, // e.g., "billing", "promotion", "usage"
    val message: String,
    val date: String,
    val read: Boolean
)
