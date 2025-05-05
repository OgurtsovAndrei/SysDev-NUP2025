package com.yourcompany.backend.routes

import com.yourcompany.backend.database.repositories.NotificationRepository
import com.yourcompany.backend.database.repositories.SupportTicketRepository
import com.yourcompany.backend.models.ApiResponse // Import API response model
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

// Defines routes for other user-specific data like support tickets and notifications
fun Route.otherUserDataRoutes() {
    val supportTicketRepository = SupportTicketRepository()
    val notificationRepository = NotificationRepository()

    route("/api/user") {
        // GET /api/user/support-tickets
        get("/support-tickets") {
            // In a real application, get the authenticated user ID from the JWT token or session
            val userId = "USR12345" // Simulate authenticated user ID

            // Get the support tickets for the user from the database
            val tickets = supportTicketRepository.getUserSupportTickets(userId)

            // Return the user's support tickets
            call.respond(HttpStatusCode.OK, tickets)
        }

        // GET /api/user/notifications
        get("/notifications") {
            // In a real application, get the authenticated user ID from the JWT token or session
            val userId = "USR12345" // Simulate authenticated user ID

            // Get the notifications for the user from the database
            val notifications = notificationRepository.getUserNotifications(userId)

            // Return the user's notifications
            call.respond(HttpStatusCode.OK, notifications)
        }

        // PATCH /api/user/notifications/{notificationId}/read
        patch("/notifications/{notificationId}/read") {
            // In a real application, get the authenticated user ID from the JWT token or session
            val userId = "USR12345" // Simulate authenticated user ID

            // Extract the notification ID from the path parameters
            val notificationId = call.parameters["notificationId"]

            if (notificationId == null) {
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Notification ID is required"))
                return@patch
            }

            // Mark the notification as read in the database
            val success = notificationRepository.markNotificationAsRead(userId, notificationId)

            if (success) {
                call.respond(HttpStatusCode.OK, ApiResponse(success = true, message = "Notification marked as read"))
            } else {
                // Return 404 Not Found if the notification is not found for the user
                call.respond(HttpStatusCode.NotFound, ApiResponse(success = false, message = "Notification not found"))
            }
        }
    }
}
