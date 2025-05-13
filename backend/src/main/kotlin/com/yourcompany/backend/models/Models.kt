package com.yourcompany.backend.models

import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: String,
    val name: String,
    val email: String,
    val password: String,
    val phone: String,
    val accountNumber: String,
    val accountType: String,
    val registrationDate: String,
    val packages: List<UserPackage>,
    val paymentMethod: String,
    val billingAddress: Address
)

@Serializable
data class LoginRequest(
    val email: String,
    val password: String,
    val rememberMe: Boolean
)

@Serializable
data class LoginResponse(
    val success: Boolean,
    val message: String,
    val token: String? = null
)

@Serializable
data class RegisterRequest(
    val fullName: String,
    val email: String,
    val password: String,
    val confirmPassword: String,
    val agreeTerms: Boolean
)

@Serializable
data class ApiResponse(
    val success: Boolean,
    val message: String
)

@Serializable
data class UserProfile(
    val id: String,
    val name: String,
    val email: String,
    val phone: String,
    val accountNumber: String,
    val accountType: String,
    val registrationDate: String,
    val packages: List<UserPackage>,
    val paymentMethod: String,
    val billingAddress: Address
)

@Serializable
data class UserPackage(
    val id: String,
    val type: String,
    val name: String,
    val plan: String? = null,
    val speed: String? = null,
    val router: String? = null,
    val addOns: List<String> = emptyList()
)

@Serializable
data class Address(
    val street: String,
    val city: String,
    val state: String,
    val zipCode: String,
    val country: String
)

@Serializable
data class UpdateProfileRequest(
    val email: String? = null,
    val paymentMethod: String? = null,
    val billingAddress: Address? = null
)

@Serializable
data class PackageType(
    val id: String,
    val name: String,
    val description: String = "",
    val basePrice: Double = 0.0
)

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

@Serializable
data class ValidatePromoCodeRequest(
    val promoCode: String
)

@Serializable
data class ValidatePromoCodeResponse(
    val valid: Boolean,
    val discount: Double = 0.0,
    val description: String? = null
)

@Serializable
data class OrderRequest(
    val packageType: String,
    val options: OrderOptions,
    val promoCode: String? = null
)

@Serializable
data class OrderOptions(
    val speed: String? = null,
    val router: String? = null,
    val dataPlan: String? = null,
    val plan: String? = null,
    val addOns: List<String> = emptyList()
)

@Serializable
data class UsageDataResponse(
    val currentBillingCycle: BillingCycle,
    val previousBillingCycles: List<PreviousBillingCycle>
)

@Serializable
data class BillingCycle(
    val startDate: String,
    val endDate: String,
    val packages: Map<String, PackageUsage>
)

@Serializable
data class PackageUsage(
    val type: String,
    val name: String,
    val dataUsed: Double, // GB
    val dataTotal: Double, // GB
    val callMinutesUsed: Int? = null,
    val callMinutesTotal: String? = null,
    val smsUsed: Int? = null,
    val smsTotal: String? = null,
    // Home Internet specific
    val downloadSpeed: String? = null,
    val uploadSpeed: String? = null,
    val devices: Int? = null
)

@Serializable
data class PreviousBillingCycle(
    val period: String,
    val packages: Map<String, PreviousPackageUsage>
)

@Serializable
data class PreviousPackageUsage(
    val type: String,
    val name: String,
    val dataUsed: Double, // GB
    val dataTotal: Double, // GB
    // Mobile Combo specific
    val callMinutesUsed: Int? = null,
    val callMinutesTotal: String? = null,
    val smsUsed: Int? = null,
    val smsTotal: String? = null
)

@Serializable
data class ChatMessage(
    val type: String,
    val text: String,
    val time: String
)

@Serializable
data class SendChatMessageRequest(
    val messageText: String
)

@Serializable
data class FeedbackSummary(
    val averageRating: Double,
    val totalReviews: Int,
    val recentFeedback: List<FeedbackEntry>? = null
)

@Serializable
data class FeedbackEntry(
    val id: String,
    val rating: Int,
    val topic: String,
    val text: String,
    val timestamp: String,
    val user: String
)

@Serializable
data class SubmitFeedbackRequest(
    val rating: Int,
    val topic: String,
    val text: String
)

@Serializable
data class SupportTicket(
    val id: String,
    val subject: String,
    val status: String,
    val createdDate: String,
    val lastUpdated: String,
    val priority: String,
    val resolution: String? = null
)

@Serializable
data class PromoCode(
    val code: String,
    val discount: Double,
    val description: String
)

@Serializable
data class Notification(
    val id: String,
    val type: String,
    val message: String,
    val date: String,
    val read: Boolean
)

@Serializable
data class CreatePackageRequest(
    val type: String,
    val name: String,
    val plan: String? = null,
    val speed: String? = null,
    val router: String? = null,
    val addOns: List<String> = emptyList(),
    val userId: String? = null
)
