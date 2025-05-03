package com.yourcompany.backend.routes

import com.yourcompany.backend.data.mockUsers
import com.yourcompany.backend.models.ApiResponse // Import API response model
import com.yourcompany.backend.models.UserProfile // Import UserProfile model
import com.yourcompany.backend.models.UpdateProfileRequest // Import UpdateProfileRequest model
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

// Defines routes related to the user profile
fun Route.userProfileRoutes() {
    route("/api/user") {
        // GET /api/user/profile
        get("/profile") {
            // In a real application, get the authenticated user ID from the JWT token or session
            // For this mock, we'll use a hardcoded user ID or find the first user
            val userId = "USR12345" // Simulate authenticated user ID
            val user = mockUsers.find { it.id == userId }

            if (user != null) {
                // Map the internal User data class to the UserProfile response model
                val userProfileResponse = UserProfile(
                    id = user.id,
                    name = user.name,
                    email = user.email,
                    phone = user.phone,
                    accountNumber = user.accountNumber,
                    accountType = user.accountType,
                    registrationDate = user.registrationDate,
                    packages = user.packages,
                    paymentMethod = user.paymentMethod,
                    billingAddress = user.billingAddress
                )
                call.respond(HttpStatusCode.OK, userProfileResponse)
            } else {
                // Should not happen if authentication is working, but good practice to handle
                call.respond(HttpStatusCode.NotFound, ApiResponse(success = false, message = "User not found"))
            }
        }

        // PUT /api/user/profile (or PATCH)
        put("/profile") {
            // In a real application, get the authenticated user ID from the JWT token or session
            val userId = "USR12345" // Simulate authenticated user ID
            val user = mockUsers.find { it.id == userId }

            if (user == null) {
                call.respond(HttpStatusCode.NotFound, ApiResponse(success = false, message = "User not found"))
                return@put
            }

            val updateRequest = try {
                call.receive<UpdateProfileRequest>() // Receive and deserialize the update request body
            } catch (e: Exception) {
                // Handle invalid request body
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Invalid request body"))
                return@put
            }

            // Simulate updating user data (only update fields provided in the request)
            // In a real application, perform validation and update in the database
            val updatedUser = user.copy(
                email = updateRequest.email ?: user.email, // Update email if provided
                paymentMethod = updateRequest.paymentMethod ?: user.paymentMethod, // Update payment method if provided
                billingAddress = updateRequest.billingAddress ?: user.billingAddress // Update address if provided
            )

            // Find the index of the user in the mock list and replace
            val userIndex = mockUsers.indexOfFirst { it.id == userId }
            if (userIndex != -1) {
                mockUsers[userIndex] = updatedUser // Replace the old user object with the updated one
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, message = "Profile updated successfully"))
            } else {
                // Should not happen, but as a fallback
                call.respond(HttpStatusCode.InternalServerError, ApiResponse(success = false, message = "Failed to update profile"))
            }
        }
    }
}
