package com.yourcompany.backend.routes

import com.yourcompany.backend.database.repositories.NotificationRepository
import com.yourcompany.backend.database.repositories.SupportTicketRepository
import com.yourcompany.backend.models.ApiResponse
import com.yourcompany.backend.routes.base.RouteConfigBase
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

/**
 * Defines routes related to other user data like support tickets and notifications
 */
class OtherUserDataRoutes : RouteConfigBase() {
    private val supportTicketRepository = SupportTicketRepository()
    private val notificationRepository = NotificationRepository()

    override fun Route.configureRoutes() {
        route("/api/user") {
            // GET /api/user/support-tickets
            get("/support-tickets") {
                val userId = "USR12345" // Simulate authenticated user ID
                val tickets = supportTicketRepository.getUserSupportTickets(userId)

                call.respond(HttpStatusCode.OK, tickets)
            }

            // GET /api/user/notifications
            get("/notifications") {
                val userId = "USR12345" // Simulate authenticated user ID
                val notifications = notificationRepository.getUserNotifications(userId)

                call.respond(HttpStatusCode.OK, notifications)
            }

            // PATCH /api/user/notifications/{notificationId}/read
            patch("/notifications/{notificationId}/read") {
                val userId = "USR12345" // Simulate authenticated user ID
                val notificationId = call.parameters["notificationId"]

                if (notificationId == null) {
                    call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Notification ID is required"))
                    return@patch
                }

                val success = notificationRepository.markNotificationAsRead(userId, notificationId)
                if (success) {
                    call.respond(HttpStatusCode.OK, ApiResponse(success = true, message = "Notification marked as read"))
                } else {
                    call.respond(HttpStatusCode.NotFound, ApiResponse(success = false, message = "Notification not found"))
                }
            }
        }
    }
}
