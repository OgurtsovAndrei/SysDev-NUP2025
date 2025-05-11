package com.yourcompany.backend.routes

import com.yourcompany.backend.database.repositories.UsageRepository
import com.yourcompany.backend.models.ApiResponse
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.route

fun Route.usageRoutes() {
    val usageRepository = UsageRepository()

    route("/api/user") {
        // GET /api/user/usage
        get("/usage") {
            val userId = call.request.headers["Authorization"]?.split(SAFE_DELIMITER)?.last() ?: "NaN"
            val usageData = usageRepository.getUserUsageData(userId)

            if (usageData != null) {
                call.respond(HttpStatusCode.OK, usageData)
            } else {
                call.respond(
                    HttpStatusCode.NotFound,
                    ApiResponse(success = false, message = "Usage data not found for user")
                )
            }
        }

        // DELETE /api/user/usage/{packageId}
        delete("/usage/{packageId}") {
            val userId = call.request.headers["Authorization"]?.split(SAFE_DELIMITER)?.last() ?: "NaN"
            val packageId = call.parameters["packageId"] ?: run {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ApiResponse(success = false, message = "Package ID is required")
                )
                return@delete
            }
            val deleted = usageRepository.deletePackage(userId, packageId)

            if (deleted) {
                call.respond(
                    HttpStatusCode.OK,
                    ApiResponse(success = true, message = "Package deleted successfully")
                )
            } else {
                call.respond(
                    HttpStatusCode.NotFound,
                    ApiResponse(success = false, message = "Package not found or could not be deleted")
                )
            }
        }
    }
}
