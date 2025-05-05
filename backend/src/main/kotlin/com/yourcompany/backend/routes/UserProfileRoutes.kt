package com.yourcompany.backend.routes

import com.yourcompany.backend.database.repositories.UserRepository
import com.yourcompany.backend.models.ApiResponse // Import API response model
import com.yourcompany.backend.models.UserProfile // Import UserProfile model
import com.yourcompany.backend.models.UpdateProfileRequest // Import UpdateProfileRequest model
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
const val SAFE_DELIMITER = "simulated_jwt_token_for_"
// Defines routes related to the user profile
fun Route.userProfileRoutes() {
    val userRepository = UserRepository()

    route("/api/user") {
        // GET /api/user/profile
        get("/profile") {
            // In a real application, get the authenticated user ID from the JWT token or session
            // For this mock, we'll use a hardcoded user ID
            val userId = call.request.headers["Authorization"]?.split(SAFE_DELIMITER)?.last() ?: "NaN"
            val user = userRepository.findUserById(userId)


            if (user != null) {
                // Convert the database entity to a model
                val userModel = userRepository.toModel(user)

                // Map the User model to the UserProfile response model
                val userProfileResponse = UserProfile(
                    id = userModel.id,
                    name = userModel.name,
                    email = userModel.email,
                    phone = userModel.phone,
                    accountNumber = userModel.accountNumber,
                    accountType = userModel.accountType,
                    registrationDate = userModel.registrationDate,
                    packages = userModel.packages,
                    paymentMethod = userModel.paymentMethod,
                    billingAddress = userModel.billingAddress
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
            val userId = call.request.headers["Authorization"]?.split(SAFE_DELIMITER)?.last() ?: "NaN"

            // Check if user exists
            val user = userRepository.findUserById(userId)
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

            // Update user in the database
            val success = userRepository.updateUser(
                id = userId,
                email = updateRequest.email,
                paymentMethod = updateRequest.paymentMethod,
                billingAddress = updateRequest.billingAddress
            )

            if (success) {
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, message = "Profile updated successfully"))
            } else {
                call.respond(HttpStatusCode.InternalServerError, ApiResponse(success = false, message = "Failed to update profile"))
            }
        }
    }
}
