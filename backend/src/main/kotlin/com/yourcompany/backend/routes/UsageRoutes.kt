package com.yourcompany.backend.routes

import com.yourcompany.backend.database.repositories.UsageRepository
import com.yourcompany.backend.models.ApiResponse
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route

// Defines routes related to user usage data
fun Route.usageRoutes() {
    val usageRepository = UsageRepository()

    route("/api/user") {
        // GET /api/user/usage
        get("/usage") {
            // In a real application, get the authenticated user ID from the JWT token or session
            // For this mock, we'll use a hardcoded user ID
            val userId = call.request.headers["Authorization"]?.split(SAFE_DELIMITER)?.last() ?: "NaN"

            // Get the usage data for the user from the database
            val usageData = usageRepository.getUserUsageData(userId)

            if (usageData != null) {
                // Return the user's usage data
                call.respond(HttpStatusCode.OK, usageData)
            } else {
                // Return 404 Not Found if usage data for the user is not found
                // In a real app, this might mean the user has no active packages or no usage data yet.
                call.respond(
                    HttpStatusCode.NotFound,
                    ApiResponse(success = false, message = "Usage data not found for user")
                )
            }
        }
    }
}
