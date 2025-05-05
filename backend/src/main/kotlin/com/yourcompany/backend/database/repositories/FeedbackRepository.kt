package com.yourcompany.backend.database.repositories

import com.yourcompany.backend.database.DatabaseFactory
import com.yourcompany.backend.database.entities.*
import com.yourcompany.backend.models.FeedbackEntry
import com.yourcompany.backend.models.FeedbackSummary
import com.yourcompany.backend.models.SubmitFeedbackRequest
import org.ktorm.dsl.*
import org.ktorm.entity.*
import java.time.Instant
import java.util.UUID

/**
 * Repository for feedback-related database operations
 */
class FeedbackRepository {
    private val database = DatabaseFactory.getInstance()

    /**
     * Get feedback summary
     */
    fun getFeedbackSummary(): FeedbackSummary {
        // Get all feedback entries
        val feedbackEntries = database.sequenceOf(Feedbacks).toList()

        // Calculate average rating
        val averageRating = if (feedbackEntries.isNotEmpty()) {
            feedbackEntries.map { it.rating }.average()
        } else {
            0.0
        }

        // Get total number of reviews
        val totalReviews = feedbackEntries.size

        // Get recent feedback entries (up to 10)
        val recentFeedback = feedbackEntries
            .sortedByDescending { it.timestamp }
            .take(10)
            .map { toFeedbackEntryModel(it) }

        return FeedbackSummary(
            averageRating = averageRating,
            totalReviews = totalReviews,
            recentFeedback = recentFeedback
        )
    }

    /**
     * Submit feedback
     */
    fun submitFeedback(request: SubmitFeedbackRequest, userName: String = "Anonymous"): String {
        // Generate a unique ID for the feedback
        val feedbackId = "FB" + UUID.randomUUID().toString().substring(0, 8)

        // Insert the feedback into the database
        database.insert(Feedbacks) {
            set(it.id, feedbackId)
            set(it.rating, request.rating)
            set(it.topic, request.topic)
            set(it.text, request.text)
            set(it.timestamp, Instant.now())
            set(it.userName, userName)
        }

        return feedbackId
    }

    /**
     * Convert database Feedback entity to FeedbackEntry model
     */
    private fun toFeedbackEntryModel(feedback: Feedback): FeedbackEntry {
        return FeedbackEntry(
            id = feedback.id,
            rating = feedback.rating,
            topic = feedback.topic,
            text = feedback.text,
            timestamp = feedback.timestamp.toString(),
            user = feedback.userName
        )
    }

    /**
     * Initialize the database with mock feedback data
     */
    fun initializeMockData() {
        // Check if we already have feedback entries
        val existingFeedback = database.sequenceOf(Feedbacks).firstOrNull()
        if (existingFeedback != null) {
            return // Data already initialized
        }

        // Use a transaction to ensure all operations are committed
        database.useTransaction { transaction ->
            // Create feedback entries
            insertFeedback(
                id = "FB001",
                rating = 5,
                topic = "support",
                text = "The customer support team was extremely helpful and resolved my issue quickly.",
                timestamp = Instant.parse("2025-03-15T14:30:00Z"),
                userName = "John D."
            )

            insertFeedback(
                id = "FB002",
                rating = 4,
                topic = "deals",
                text = "Good deals, but I wish there were more options for international plans.",
                timestamp = Instant.parse("2025-03-12T09:15:00Z"),
                userName = "Sarah M."
            )

            insertFeedback(
                id = "FB003",
                rating = 5,
                topic = "app",
                text = "The mobile app is very intuitive and easy to use. Love the new features!",
                timestamp = Instant.parse("2025-03-10T16:45:00Z"),
                userName = "Michael T."
            )
        }
    }

    /**
     * Helper method to insert feedback
     */
    private fun insertFeedback(
        id: String,
        rating: Int,
        topic: String,
        text: String,
        timestamp: Instant,
        userName: String
    ) {
        database.insert(Feedbacks) {
            set(it.id, id)
            set(it.rating, rating)
            set(it.topic, topic)
            set(it.text, text)
            set(it.timestamp, timestamp)
            set(it.userName, userName)
        }
    }
}