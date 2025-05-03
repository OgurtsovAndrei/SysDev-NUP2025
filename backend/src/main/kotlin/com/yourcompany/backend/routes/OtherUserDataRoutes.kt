package com.yourcompany.backend.routes

import com.yourcompany.backend.data.mockNotifications // Import mock notifications data
import com.yourcompany.backend.data.mockSupportTickets // Import mock support tickets data
import com.yourcompany.backend.models.ApiResponse // Import API response model
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlin.text.get

// Defines routes for other user-specific data like support tickets and notifications
fun Route.otherUserDataRoutes() {
    route("/api/user") {
        // GET /api/user/support-tickets
        get("/support-tickets") {
            // In a real application, get the authenticated user ID from the JWT token or session
            val userId = "USR12345" // Simulate authenticated user ID

            // Find the support tickets for the user in mock data
            val tickets = mockSupportTickets[userId] ?: emptyList() // Return empty list if no tickets

            // Return the user's support tickets
            call.respond(HttpStatusCode.OK, tickets)
        }

        // GET /api/user/notifications
        get("/notifications") {
            // In a real application, get the authenticated user ID from the JWT token or session
            val userId = "USR12345" // Simulate authenticated user ID

            // Find the notifications for the user in mock data
            val notifications = mockNotifications[userId] ?: emptyList() // Return empty list if no notifications

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

            // Find the user's notifications and the specific notification
            val userNotifications = mockNotifications[userId]
            val notificationToMark = userNotifications?.find { it.id == notificationId }

            if (notificationToMark != null) {
                // Simulate marking the notification as read
                // In a real application, update the 'read' status in the database
                val updatedNotification = notificationToMark.copy(read = true)

                // Find the index and replace the notification in the mutable list
                val notificationIndex = userNotifications.indexOfFirst { it.id == notificationId }
                if (notificationIndex != -1) {
                    userNotifications[notificationIndex] = updatedNotification
                    call.respond(HttpStatusCode.OK, ApiResponse(success = true, message = "Notification marked as read"))
                } else {
                    // Should not happen if notificationToMark was found, but as a fallback
                    call.respond(HttpStatusCode.InternalServerError, ApiResponse(success = false, message = "Failed to update notification status"))
                }

            } else {
                // Return 404 Not Found if the notification is not found for the user
                call.respond(HttpStatusCode.NotFound, ApiResponse(success = false, message = "Notification not found"))
            }
        }
    }
}
