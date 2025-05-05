package com.yourcompany.backend.database.repositories

import com.yourcompany.backend.database.DatabaseFactory
import com.yourcompany.backend.database.entities.*
import com.yourcompany.backend.models.SupportTicket as SupportTicketModel
import org.ktorm.dsl.*
import org.ktorm.entity.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter

/**
 * Repository for support ticket-related database operations
 */
class SupportTicketRepository {
    private val database = DatabaseFactory.getInstance()
    private val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")

    /**
     * Get support tickets for a user
     */
    fun getUserSupportTickets(userId: String): List<SupportTicketModel> {
        // Check if user exists
        val user = database.sequenceOf(Users).firstOrNull { it.id eq userId } ?: return emptyList()

        // Get all support tickets for the user
        val supportTickets = database.sequenceOf(SupportTickets)
            .filter { it.userId eq userId }
            .toList()

        // Convert to model objects
        return supportTickets.map { toModel(it) }
    }

    /**
     * Convert database SupportTicket entity to model
     */
    private fun toModel(supportTicket: SupportTicket): SupportTicketModel {
        return SupportTicketModel(
            id = supportTicket.id,
            subject = supportTicket.subject,
            status = supportTicket.status,
            createdDate = supportTicket.createdDate.format(formatter),
            lastUpdated = supportTicket.lastUpdated.format(formatter),
            priority = supportTicket.priority,
            resolution = supportTicket.resolution
        )
    }

    /**
     * Initialize the database with mock support ticket data
     */
    fun initializeMockData() {
        // Check if we already have support tickets
        val existingSupportTicket = database.sequenceOf(SupportTickets).firstOrNull()
        if (existingSupportTicket != null) {
            return // Data already initialized
        }

        // Get the user
        val user = database.sequenceOf(Users).firstOrNull { it.id eq "USR12345" } ?: return

        // Use a transaction to ensure all operations are committed
        database.useTransaction { transaction ->
            // Create support tickets
            insertSupportTicket(
                id = "TKT001",
                user = user,
                subject = "Billing inquiry",
                status = "Open",
                createdDate = LocalDate.of(2025, 3, 10),
                lastUpdated = LocalDate.of(2025, 3, 10),
                priority = "Medium"
            )

            insertSupportTicket(
                id = "TKT002",
                user = user,
                subject = "Network connectivity issues",
                status = "Closed",
                createdDate = LocalDate.of(2025, 2, 15),
                lastUpdated = LocalDate.of(2025, 2, 18),
                priority = "High",
                resolution = "Resolved by network reset"
            )
        }
    }

    /**
     * Helper method to insert a support ticket
     */
    private fun insertSupportTicket(
        id: String,
        user: User,
        subject: String,
        status: String,
        createdDate: LocalDate,
        lastUpdated: LocalDate,
        priority: String,
        resolution: String? = null
    ) {
        database.insert(SupportTickets) {
            set(it.id, id)
            set(it.userId, user.id)
            set(it.subject, subject)
            set(it.status, status)
            set(it.createdDate, createdDate)
            set(it.lastUpdated, lastUpdated)
            set(it.priority, priority)
            set(it.resolution, resolution)
        }
    }
}