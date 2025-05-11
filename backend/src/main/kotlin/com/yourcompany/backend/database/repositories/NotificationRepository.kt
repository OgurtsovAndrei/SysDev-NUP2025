package com.yourcompany.backend.database.repositories

import com.yourcompany.backend.database.DatabaseFactory
import com.yourcompany.backend.database.entities.*
import com.yourcompany.backend.models.Notification as NotificationModel
import org.ktorm.dsl.*
import org.ktorm.entity.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter

/**
 * Repository for notification-related database operations
 */
class NotificationRepository {
    private val database = DatabaseFactory.getInstance()
    private val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")

    /**
     * Get notifications for a user
     */
    fun getUserNotifications(userId: String): List<NotificationModel> {
        val user = database.sequenceOf(Users).firstOrNull { it.id eq userId } ?: return emptyList()
        val notifications = database.sequenceOf(Notifications)
            .filter { it.userId eq userId }
            .toList()

        // Convert to model objects
        return notifications.map { toModel(it) }
    }

    /**
     * Mark a notification as read
     */
    fun markNotificationAsRead(userId: String, notificationId: String): Boolean {
        val user = database.sequenceOf(Users).firstOrNull { it.id eq userId } ?: return false
        val notification = database.sequenceOf(Notifications)
            .firstOrNull { (it.userId eq userId) and (it.id eq notificationId) } ?: return false

        notification.read = true
        return notification.flushChanges() > 0
    }

    /**
     * Convert database Notification entity to model
     */
    private fun toModel(notification: Notification): NotificationModel {
        return NotificationModel(
            id = notification.id,
            type = notification.type,
            message = notification.message,
            date = notification.date.format(formatter),
            read = notification.read
        )
    }

    /**
     * Initialize the database with mock notification data
     */
    fun initializeMockData() {
        val existingNotification = database.sequenceOf(Notifications).firstOrNull()
        if (existingNotification != null) {
            return // Data already initialized
        }
        val user = database.sequenceOf(Users).firstOrNull { it.id eq "USR12345" } ?: return

        database.useTransaction { transaction ->
            insertNotification(
                id = "NTF001",
                user = user,
                type = "billing",
                message = "Your monthly bill of $49.99 is due in 5 days",
                date = LocalDate.of(2025, 3, 25),
                read = false
            )

            insertNotification(
                id = "NTF002",
                user = user,
                type = "promotion",
                message = "Special offer: Upgrade to Premium Mobile and get 3 months free!",
                date = LocalDate.of(2025, 3, 20),
                read = true
            )

            insertNotification(
                id = "NTF003",
                user = user,
                type = "usage",
                message = "You've used 80% of your monthly data allowance",
                date = LocalDate.of(2025, 3, 22),
                read = false
            )
        }
    }

    /**
     * Helper method to insert a notification
     */
    private fun insertNotification(
        id: String,
        user: User,
        type: String,
        message: String,
        date: LocalDate,
        read: Boolean
    ) {
        database.insert(Notifications) {
            set(it.id, id)
            set(it.userId, user.id)
            set(it.type, type)
            set(it.message, message)
            set(it.date, date)
            set(it.read, read)
        }
    }
}