package com.yourcompany.backend.database.repositories

import com.yourcompany.backend.database.DatabaseFactory
import com.yourcompany.backend.database.entities.*
import com.yourcompany.backend.models.ChatMessage as ChatMessageModel
import org.ktorm.dsl.*
import org.ktorm.entity.*
import java.time.Instant

/**
 * Repository for chat message-related database operations
 */
class ChatMessageRepository {
    private val database = DatabaseFactory.getInstance()

    /**
     * Get all chat messages for a user
     */
    fun getChatMessagesForUser(userId: String): List<ChatMessageModel> {
        val user = database.sequenceOf(Users).firstOrNull { it.id eq userId } ?: return emptyList()
        
        val messages = database
            .from(ChatMessages)
            .select()
            .where { ChatMessages.userId eq userId }
            .orderBy(ChatMessages.timestamp.asc())
            .map { row ->
                val message = ChatMessages.createEntity(row)
                toModel(message)
            }
        
        return messages
    }

    /**
     * Add a new chat message
     */
    fun addChatMessage(
        userId: String,
        text: String,
        isFromUser: Boolean
    ): Boolean {
        val user = database.sequenceOf(Users).firstOrNull { it.id eq userId } ?: return false
        
        val result = database.insert(ChatMessages) {
            set(it.userId, userId)
            set(it.message, text)
            set(it.timestamp, Instant.now())
            set(it.isFromUser, isFromUser)
        }
        
        return result > 0
    }

    /**
     * Convert database ChatMessage entity to model
     */
    private fun toModel(chatMessage: ChatMessage): ChatMessageModel {
        return ChatMessageModel(
            type = if (chatMessage.isFromUser) "user" else "operator",
            text = chatMessage.message,
            time = chatMessage.timestamp.toString()
        )
    }
}