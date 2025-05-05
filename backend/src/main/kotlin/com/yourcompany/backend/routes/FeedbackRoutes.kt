package com.yourcompany.backend.routes

import com.yourcompany.backend.database.repositories.FeedbackRepository
import com.yourcompany.backend.models.ApiResponse // Import API response model
import com.yourcompany.backend.models.SubmitFeedbackRequest // Import SubmitFeedbackRequest model
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

// Defines routes related to user feedback
fun Route.feedbackRoutes() {
    val feedbackRepository = FeedbackRepository()

    route("/api/feedback") {
        // GET /api/feedback/summary
        get("/summary") {
            // Get the feedback summary from the database
            val feedbackSummary = feedbackRepository.getFeedbackSummary()

            // Return the feedback summary
            call.respond(HttpStatusCode.OK, feedbackSummary)
        }

        // POST /api/feedback
        post {
            // In a real application, you would authenticate the user here
            // and associate the feedback with the authenticated user ID.

            val feedbackRequest = try {
                call.receive<SubmitFeedbackRequest>() // Receive and deserialize the feedback submission request
            } catch (e: Exception) {
                // Handle invalid request body
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Invalid request body"))
                return@post
            }

            // Basic validation (more robust validation needed in a real app)
            if (feedbackRequest.rating !in 1..5) {
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Rating must be between 1 and 5"))
                return@post
            }
            if (feedbackRequest.topic.isBlank()) {
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Feedback topic cannot be empty"))
                return@post
            }

            // Submit the feedback to the database
            val feedbackId = feedbackRepository.submitFeedback(feedbackRequest, "Anonymous User")

            // Return success response
            call.respond(HttpStatusCode.Created, ApiResponse(success = true, message = "Feedback submitted successfully"))
        }
    }
}

// Add mockFeedback data to MockData.kt if it's not already there
// This data is used by the GET /api/feedback/summary endpoint
/*
// Inside data/MockData.kt
val mockFeedback = FeedbackSummary(
    averageRating = 4.5,
    totalReviews = 128,
    recentFeedback = listOf(
        FeedbackEntry(
            id = "FB001",
            rating = 5,
            topic = "support",
            text = "The customer support team was extremely helpful and resolved my issue quickly.",
            timestamp = "2025-03-15T14:30:00Z",
            user = "John D."
        ),
        FeedbackEntry(
            id = "FB002",
            rating = 4,
            topic = "deals",
            text = "Good deals, but I wish there were more options for international plans.",
            timestamp = "2025-03-12T09:15:00Z",
            user = "Sarah M."
        ),
        FeedbackEntry(
            id = "FB003",
            rating = 5,
            topic = "app",
            text = "The mobile app is very intuitive and easy to use. Love the new features!",
            timestamp = "2025-03-10T16:45:00Z",
            user = "Michael T."
        )
    )
)
*/
