package com.yourcompany.backend.routes

import com.yourcompany.backend.database.repositories.ChatMessageRepository
import com.yourcompany.backend.models.ApiResponse
import com.yourcompany.backend.models.ChatMessage
import com.yourcompany.backend.models.SendChatMessageRequest
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

private val chatMessageRepository = ChatMessageRepository()

fun getChatMessagesForUser(userId: String): List<ChatMessage> {
    return chatMessageRepository.getChatMessagesForUser(userId)
}

fun Route.chatRoutes() {
    route("/api/user") {
        // GET /api/user/chat/history (Optional)
        get("/chat/history") {
            val userId = call.request.headers["Authorization"]?.split(SAFE_DELIMITER)?.last() ?: "NaN"

            val messages = getChatMessagesForUser(userId)
            call.respond(HttpStatusCode.OK, messages)
        }
    }

    route("/api/chat") {
        // POST /api/chat/messages
        post("/messages") {
            val userId = call.request.headers["Authorization"]?.split(SAFE_DELIMITER)?.last() ?: "NaN"

            val messageRequest = try {
                call.receive<SendChatMessageRequest>()
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Invalid request body"))
                return@post
            }

            chatMessageRepository.addChatMessage(
                userId = userId,
                text = messageRequest.messageText,
                isFromUser = true
            )

            val operatorResponseText = simulateOperatorResponse(messageRequest.messageText)
            chatMessageRepository.addChatMessage(
                userId = userId,
                text = operatorResponseText,
                isFromUser = false
            )

            call.respond(HttpStatusCode.OK, ApiResponse(success = true, message = "Message sent"))
        }
    }
}

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
            defaultResponses.random()
        }
    }
}
