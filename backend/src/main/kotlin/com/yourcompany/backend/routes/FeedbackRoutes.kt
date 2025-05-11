package com.yourcompany.backend.routes

import com.yourcompany.backend.database.repositories.FeedbackRepository
import com.yourcompany.backend.models.ApiResponse
import com.yourcompany.backend.models.SubmitFeedbackRequest
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.feedbackRoutes() {
    val feedbackRepository = FeedbackRepository()

    route("/api/feedback") {
        // GET /api/feedback/summary
        get("/summary") {
            val feedbackSummary = feedbackRepository.getFeedbackSummary()
            call.respond(HttpStatusCode.OK, feedbackSummary)
        }

        // POST /api/feedback
        post {
            val feedbackRequest = try {
                call.receive<SubmitFeedbackRequest>()
            } catch (e: Exception) {

                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Invalid request body"))
                return@post
            }

            if (feedbackRequest.rating !in 1..5) {
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Rating must be between 1 and 5"))
                return@post
            }
            if (feedbackRequest.topic.isBlank()) {
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Feedback topic cannot be empty"))
                return@post
            }
            call.respond(HttpStatusCode.Created, ApiResponse(success = true, message = "Feedback submitted successfully"))
        }
    }
}
