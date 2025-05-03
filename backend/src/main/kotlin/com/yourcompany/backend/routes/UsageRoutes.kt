package com.yourcompany.backend.routes

import com.yourcompany.backend.data.mockUsageData
import com.yourcompany.backend.models.ApiResponse
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route

class UsageRoutes

// Defines routes related to user usage data
fun Route.usageRoutes() {
    route("/api/user") {
        // GET /api/user/usage
        get("/usage") {
            // In a real application, get the authenticated user ID from the JWT token or session
            // For this mock, we'll use a hardcoded user ID
            val userId = "USR12345" // Simulate authenticated user ID

            // Find the usage data for the user in mock data
            val usageData = mockUsageData[userId]

            if (usageData != null) {
                // Return the user's usage data
                call.respond(HttpStatusCode.OK, usageData)
            } else {
                // Return 404 Not Found if usage data for the user is not in mock data
                // In a real app, this might mean the user has no active packages or no usage data yet.
                call.respond(
                    HttpStatusCode.NotFound,
                    ApiResponse(success = false, message = "Usage data not found for user")
                )
            }
        }
    }
}