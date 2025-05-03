package com.yourcompany.backend.data

import com.yourcompany.backend.models.Address
import com.yourcompany.backend.models.BillingCycle
import com.yourcompany.backend.models.ChatMessage
import com.yourcompany.backend.models.FeedbackEntry
import com.yourcompany.backend.models.FeedbackSummary
import com.yourcompany.backend.models.Notification
import com.yourcompany.backend.models.Option
import com.yourcompany.backend.models.PackageOptionsResponse
import com.yourcompany.backend.models.PackageType
import com.yourcompany.backend.models.PackageUsage
import com.yourcompany.backend.models.PreviousBillingCycle
import com.yourcompany.backend.models.PreviousPackageUsage
import com.yourcompany.backend.models.SupportTicket
import com.yourcompany.backend.models.UsageDataResponse
import com.yourcompany.backend.models.UserPackage

// Simple data class to represent a user in our mock data
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

// Simple data class to represent a promo code in our mock data
data class PromoCode(
    val code: String,
    val discount: Double,
    val description: String
)

// Mutable list to hold mock user data
val mockUsers = mutableListOf(
    User(
        id = "USR12345",
        name = "John Doe",
        email = "john.doe@example.com",
        password = "password123", // Mock password
        phone = "+1 (555) 123-4567",
        accountNumber = "ACC987654321",
        accountType = "Premium",
        registrationDate = "2023-05-15",
        packages = listOf(
            UserPackage(
                id = "PKG002",
                type = "mobile_combo",
                name = "Standard Mobile Plan",
                plan = "standard",
                addOns = listOf("landline", "international")
            ),
            UserPackage(
                id = "PKG005",
                type = "home_internet",
                name = "Home Internet",
                speed = "standard",
                router = "premium",
                addOns = listOf("static_ip", "premium_support")
            )
        ),
        paymentMethod = "**** **** **** 1234",
        billingAddress = Address(
            street = "123 Main Street",
            city = "Anytown",
            state = "CA",
            zipCode = "90210",
            country = "USA"
        )
    )
    // Add more mock users here if needed
)

// Mock data for package types
val mockPackageTypes = listOf(
    PackageType(id = "home_internet", name = "Home Internet (limit only speed)"),
    PackageType(id = "mobile_hotspot", name = "Mobile Internet (with hotspot)"),
    PackageType(id = "mobile_no_hotspot", name = "Mobile Internet (no hotspot)"),
    PackageType(id = "mobile_combo", name = "Mobile Internet + Minutes + SMS")
)

// Mock data for package options
val mockPackageOptions = mapOf(
    "home_internet" to PackageOptionsResponse(
        speeds = listOf(
            Option(id = "basic", name = "Basic (50 Mbps)", price = 29.99),
            Option(id = "standard", name = "Standard (100 Mbps)", price = 49.99),
            Option(id = "premium", name = "Premium (500 Mbps)", price = 79.99),
            Option(id = "ultra", name = "Ultra (1 Gbps)", price = 99.99)
        ),
        routers = listOf(
            Option(id = "basic", name = "Basic Router", price = 0.0),
            Option(id = "premium", name = "Premium Router", price = 49.99),
            Option(id = "mesh", name = "Mesh WiFi System", price = 149.99)
        ),
        addOns = listOf(
            Option(id = "static_ip", name = "Static IP", price = 5.99),
            Option(id = "premium_support", name = "Premium Support", price = 10.99)
        )
    ),
    "mobile_hotspot" to PackageOptionsResponse(
        dataPlans = listOf(
            Option(id = "10gb", name = "10GB Data", price = 15.99),
            Option(id = "20gb", name = "20GB Data", price = 25.99),
            Option(id = "50gb", name = "50GB Data", price = 45.99),
            Option(id = "unlimited", name = "Unlimited Data", price = 65.99)
        ),
        addOns = listOf(
            Option(id = "international", name = "International Roaming", price = 10.99),
            Option(id = "priority", name = "Priority Data", price = 15.99)
        )
    ),
    "mobile_no_hotspot" to PackageOptionsResponse(
        dataPlans = listOf(
            Option(id = "10gb", name = "10GB Data", price = 10.99),
            Option(id = "20gb", name = "20GB Data", price = 20.99),
            Option(id = "50gb", name = "50GB Data", price = 40.99),
            Option(id = "unlimited", name = "Unlimited Data", price = 55.99)
        ),
        addOns = listOf(
            Option(id = "international", name = "International Roaming", price = 10.99),
            Option(id = "priority", name = "Priority Data", price = 15.99)
        )
    ),
    "mobile_combo" to PackageOptionsResponse(
        plans = listOf(
            Option(id = "basic", name = "Basic (5GB + 100 mins + 100 SMS)", price = 19.99),
            Option(id = "standard", name = "Standard (20GB + 500 mins + 500 SMS)", price = 39.99),
            Option(id = "premium", name = "Premium (50GB + Unlimited mins + Unlimited SMS)", price = 59.99),
            Option(
                id = "unlimited",
                name = "Unlimited (Unlimited Data + Unlimited mins + Unlimited SMS)",
                price = 79.99
            )
        ),
        addOns = listOf(
            Option(id = "landline", name = "Landline minutes", price = 5.99),
            Option(id = "international", name = "International minutes", price = 10.99),
            Option(id = "08numbers", name = "08-number calls", price = 3.99),
            Option(id = "international_sms", name = "International SMS", price = 5.99)
        )
    )
)

// Mock data for promo codes
val mockPromoCodes = listOf(
    PromoCode(code = "WELCOME10", discount = 0.1, description = "10% off for new customers"),
    PromoCode(code = "LOYALTY25", discount = 0.25, description = "25% off for loyal customers"),
    PromoCode(code = "SUMMER2025", discount = 0.15, description = "15% summer discount")
)

// Mock data for usage data (linked to User ID)
val mockUsageData = mapOf(
    "USR12345" to UsageDataResponse(
        currentBillingCycle = BillingCycle(
            startDate = "2025-03-01",
            endDate = "2025-03-31",
            packages = mapOf(
                "PKG002" to PackageUsage(
                    type = "mobile_combo",
                    name = "Standard Mobile Plan",
                    dataUsed = 12.5,
                    dataTotal = 20.0,
                    callMinutesUsed = 320,
                    callMinutesTotal = "500",
                    smsUsed = 45,
                    smsTotal = "500"
                ),
                "PKG005" to PackageUsage(
                    type = "home_internet",
                    name = "Home Internet",
                    dataUsed = 250.5,
                    dataTotal = 500.0,
                    downloadSpeed = "100 Mbps",
                    uploadSpeed = "20 Mbps",
                    devices = 8
                )
            )
        ),
        previousBillingCycles = listOf(
            PreviousBillingCycle(
                period = "February 2025",
                packages = mapOf(
                    "PKG002" to PreviousPackageUsage(
                        type = "mobile_combo",
                        name = "Standard Mobile Plan",
                        dataUsed = 18.2,
                        dataTotal = 20.0,
                        callMinutesUsed = 450,
                        callMinutesTotal = "500",
                        smsUsed = 78,
                        smsTotal = "500"
                    ),
                    "PKG005" to PreviousPackageUsage(
                        type = "home_internet",
                        name = "Home Internet",
                        dataUsed = 320.7,
                        dataTotal = 500.0
                        // Speed/Devices not in mock for previous cycles
                    )
                )
            ),
            PreviousBillingCycle(
                period = "January 2025",
                packages = mapOf(
                    "PKG002" to PreviousPackageUsage(
                        type = "mobile_combo",
                        name = "Standard Mobile Plan",
                        dataUsed = 15.7,
                        dataTotal = 20.0,
                        callMinutesUsed = 380,
                        callMinutesTotal = "500",
                        smsUsed = 62,
                        smsTotal = "500"
                    ),
                    "PKG005" to PreviousPackageUsage(
                        type = "home_internet",
                        name = "Home Internet",
                        dataUsed = 280.3,
                        dataTotal = 500.0
                        // Speed/Devices not in mock for previous cycles
                    )
                )
            )
        )
    )
    // Add usage data for other mock users here
)

// Mock data for support tickets (linked to User ID)
val mockSupportTickets = mapOf(
    "USR12345" to mutableListOf(
        SupportTicket(
            id = "TKT001",
            subject = "Billing inquiry",
            status = "Open",
            createdDate = "2025-03-10",
            lastUpdated = "2025-03-10",
            priority = "Medium"
        ),
        SupportTicket(
            id = "TKT002",
            subject = "Network connectivity issues",
            status = "Closed",
            createdDate = "2025-02-15",
            lastUpdated = "2025-02-18",
            priority = "High",
            resolution = "Resolved by network reset"
        )
    )
    // Add support tickets for other mock users here
)

// Mock data for notifications (linked to User ID)
val mockNotifications = mapOf(
    "USR12345" to mutableListOf(
        Notification(
            id = "NTF001",
            type = "billing",
            message = "Your monthly bill of $49.99 is due in 5 days",
            date = "2025-03-25",
            read = false
        ),
        Notification(
            id = "NTF002",
            type = "promotion",
            message = "Special offer: Upgrade to Premium Mobile and get 3 months free!",
            date = "2025-03-20",
            read = true
        ),
        Notification(
            id = "NTF003",
            type = "usage",
            message = "You've used 80% of your monthly data allowance",
            date = "2025-03-22",
            read = false
        )
    )
    // Add notifications for other mock users here
)

val mockFeedback = FeedbackSummary(
    averageRating = 4.5, // Simulate average rating
    totalReviews = 128, // Simulate total number of reviews
    recentFeedback = listOf( // List of recent feedback entries
        FeedbackEntry(
            id = "FB001",
            rating = 5,
            topic = "support",
            text = "The customer support team was extremely helpful and resolved my issue quickly.",
            timestamp = "2025-03-15T14:30:00Z", // ISO 8601 timestamp
            user = "John D." // Mock user identifier
        ),
        FeedbackEntry(
            id = "FB002",
            rating = 4,
            topic = "deals",
            text = "Good deals, but I wish there were more options for international plans.",
            timestamp = "2025-03-12T09:15:00Z",
            user = "Sarah M."
        ),
        FeedbackEntry(
            id = "FB003",
            rating = 5,
            topic = "app",
            text = "The mobile app is very intuitive and easy to use. Love the new features!",
            timestamp = "2025-03-10T16:45:00Z",
            user = "Michael T."
        )
    )
)

// Mock data for chat messages (linked to User ID) - simple in-memory list per user
val mockChatMessages = mutableMapOf<String, MutableList<ChatMessage>>()

// Helper function to get chat messages for a user, initializing if needed
fun getChatMessagesForUser(userId: String): MutableList<ChatMessage> {
    return mockChatMessages.getOrPut(userId) { mutableListOf() }
}
