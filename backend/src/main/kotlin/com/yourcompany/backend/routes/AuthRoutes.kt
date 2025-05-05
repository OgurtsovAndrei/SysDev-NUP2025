package com.yourcompany.backend.routes

import com.yourcompany.backend.database.repositories.UserRepository
import com.yourcompany.backend.models.Address
import com.yourcompany.backend.models.ApiResponse
import com.yourcompany.backend.models.LoginRequest
import com.yourcompany.backend.models.LoginResponse
import com.yourcompany.backend.models.RegisterRequest
import com.yourcompany.backend.models.User
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.time.LocalDate

// Defines routes related to user authentication (login and registration)
fun Route.authRoutes() {
    val userRepository = UserRepository()

    route("/api/auth") {
        // POST /api/auth/login
        post("/login") {
            val loginRequest = try {
                call.receive<LoginRequest>() // Receive and deserialize the login request body
            } catch (e: Exception) {
                // Handle invalid request body
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Invalid request body"))
                return@post
            }

            // Find user by email
            val user = userRepository.findUserByEmail(loginRequest.email)

            if (user != null && user.password == loginRequest.password) {
                // Successful login
                // In a real application, generate and return a JWT token here
                val token = "simulated_jwt_token_for_${user.id}"
                call.respond(HttpStatusCode.OK,
                    LoginResponse(success = true, message = "Login successful", token = token)
                )
            } else {
                // Failed login
                call.respond(HttpStatusCode.Unauthorized,
                    ApiResponse(success = false, message = "Invalid email or password")
                )
            }
        }

        // POST /api/auth/register
        post("/register") {
            val registerRequest = try {
                call.receive<RegisterRequest>() // Receive and deserialize the registration request body
            } catch (e: Exception) {
                // Handle invalid request body
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Invalid request body"))
                return@post
            }

            // Basic validation (more robust validation needed in a real app)
            if (registerRequest.password != registerRequest.confirmPassword) {
                call.respond(HttpStatusCode.BadRequest,
                    ApiResponse(success = false, message = "Passwords do not match")
                )
                return@post
            }
            if (!registerRequest.agreeTerms) {
                call.respond(HttpStatusCode.BadRequest,
                    ApiResponse(success = false, message = "You must agree to the Terms and Conditions")
                )
                return@post
            }

            // Check if email already exists
            if (userRepository.findUserByEmail(registerRequest.email) != null) {
                call.respond(HttpStatusCode.Conflict, ApiResponse(success = false, message = "Email already exists"))
                return@post
            }

            // Generate a unique user ID
            val userId = "USR${System.currentTimeMillis()}"

            // Create the user in the database
            val newUser = userRepository.createUser(
                id = userId,
                name = registerRequest.fullName,
                email = registerRequest.email,
                password = registerRequest.password, // In a real app, hash the password!
                phone = "", // Default empty
                accountNumber = "ACC${System.currentTimeMillis()}", // Simple account number
                accountType = "Basic", // Default type
                registrationDate = LocalDate.now().toString(),
                paymentMethod = "", // Default empty
                billingAddress = Address("", "", "", "", "") // Default empty address
            )

            if (newUser != null) {
                // Successful registration
                call.respond(HttpStatusCode.Created, ApiResponse(success = true, message = "Registration successful"))
            } else {
                // Failed registration
                call.respond(HttpStatusCode.InternalServerError, ApiResponse(success = false, message = "Failed to create user"))
            }
        }
    }
}
