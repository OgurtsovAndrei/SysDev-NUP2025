package com.yourcompany.backend.routes

import com.yourcompany.backend.database.repositories.UserRepository
import com.yourcompany.backend.models.ApiResponse
import com.yourcompany.backend.models.UserProfile
import com.yourcompany.backend.models.UpdateProfileRequest
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
const val SAFE_DELIMITER = "simulated_jwt_token_for_"
fun Route.userProfileRoutes() {
    val userRepository = UserRepository()

    route("/api/user") {
        // GET /api/user/profile
        get("/profile") {
            val userId = call.request.headers["Authorization"]?.split(SAFE_DELIMITER)?.last() ?: "NaN"
            val user = userRepository.findUserById(userId)

            if (user != null) {
                val userModel = userRepository.toModel(user)
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
                call.respond(HttpStatusCode.NotFound, ApiResponse(success = false, message = "User not found"))
            }
        }

        // PUT /api/user/profile (or PATCH)
        put("/profile") {
            val userId = call.request.headers["Authorization"]?.split(SAFE_DELIMITER)?.last() ?: "NaN"
            val user = userRepository.findUserById(userId)
            if (user == null) {
                call.respond(HttpStatusCode.NotFound, ApiResponse(success = false, message = "User not found"))
                return@put
            }

            val updateRequest = try {
                call.receive<UpdateProfileRequest>()
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Invalid request body"))
                return@put
            }
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
