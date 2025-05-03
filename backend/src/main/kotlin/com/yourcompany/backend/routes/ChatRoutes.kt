package com.yourcompany.backend.routes

import com.yourcompany.backend.data.getChatMessagesForUser
import com.yourcompany.backend.models.ApiResponse
import com.yourcompany.backend.models.ChatMessage
import com.yourcompany.backend.models.SendChatMessageRequest
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.time.Instant // For timestamps

// Defines routes related to the chat/support feature
fun Route.chatRoutes() {
    route("/api/user") {
        // GET /api/user/chat/history (Optional)
        get("/chat/history") {
            // In a real application, get the authenticated user ID from the JWT token or session
            val userId = "USR12345" // Simulate authenticated user ID

            // Get the chat messages for the user from mock data
            val messages = getChatMessagesForUser(userId)

            // Return the chat history
            call.respond(HttpStatusCode.OK, messages)
        }
    }

    route("/api/chat") {
        // POST /api/chat/messages
        post("/messages") {
            // In a real application, get the authenticated user ID from the JWT token or session
            val userId = "USR12345" // Simulate authenticated user ID

            val messageRequest = try {
                call.receive<SendChatMessageRequest>() // Receive and deserialize the chat message request
            } catch (e: Exception) {
                // Handle invalid request body
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Invalid request body"))
                return@post
            }

            // Get the chat messages list for the user
            val userMessages = getChatMessagesForUser(userId)

            // Simulate adding the user message to the chat history
            val newUserMessage = ChatMessage(
                type = "user",
                text = messageRequest.messageText,
                time = Instant.now().toString() // Use current timestamp
            )
            userMessages.add(newUserMessage)

            // Simulate an operator response (basic keyword matching as in frontend mock)
            val operatorResponseText = simulateOperatorResponse(messageRequest.messageText)
            val operatorMessage = ChatMessage(
                type = "operator",
                text = operatorResponseText,
                time = Instant.now().toString() // Use current timestamp
            )
            userMessages.add(operatorMessage)


            // Simulate successful message sending
            call.respond(HttpStatusCode.OK, ApiResponse(success = true, message = "Message sent"))
        }
    }
}

// Helper function to simulate operator responses (basic implementation)
fun simulateOperatorResponse(userMessage: String): String {
    val lowerMessage = userMessage.toLowerCase()
    return when {
        lowerMessage.contains("billing") || lowerMessage.contains("payment") || lowerMessage.contains("invoice") ->
            "I can help you with billing issues. What specific question do you have about your bill?"

        lowerMessage.contains("upgrade") || lowerMessage.contains("plan") ->
            "We have several upgrade options available. Would you like to know about our Premium Mobile package?"

        lowerMessage.contains("technical") || lowerMessage.contains("problem") || lowerMessage.contains("issue") || lowerMessage.contains(
            "not working"
        ) ->
            "I'm sorry to hear you're experiencing technical issues. Could you please provide more details about the problem?"

        lowerMessage.contains("cancel") ->
            "We're sorry to hear you want to cancel. Is there anything we can do to improve your experience with us?"

        else -> {
            val defaultResponses = listOf(
                "Thank you for your message. How else can I assist you?",
                "I understand. Is there anything specific you'd like to know?",
                "Let me check that for you. Is there anything else you need help with?",
                "I'd be happy to help with that. Could you provide more details?"
            )
            defaultResponses.random() // Select a random default response
        }
    }
}
