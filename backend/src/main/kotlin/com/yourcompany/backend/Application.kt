package com.yourcompany.backend

import io.ktor.server.application.*
import io.ktor.server.netty.*
import com.yourcompany.backend.plugins.*
import com.yourcompany.backend.database.DatabaseFactory
import com.yourcompany.backend.database.Schema
import com.yourcompany.backend.database.repositories.FeedbackRepository
import com.yourcompany.backend.database.repositories.PackageRepository
import com.yourcompany.backend.database.repositories.PromoCodeRepository
import com.yourcompany.backend.database.repositories.SupportTicketRepository
import com.yourcompany.backend.database.repositories.NotificationRepository
import com.yourcompany.backend.database.repositories.UsageRepository
import com.yourcompany.backend.database.repositories.UserRepository

// Main Ktor application entry point (application.conf)
fun main(args: Array<String>): Unit = EngineMain.main(args)

@Suppress("unused")
fun Application.module() {
    log.info("Starting G4UltimateMobile CRM Backend Module...")

    log.info("Initializing database connection...")
    DatabaseFactory.init(this)

    log.info("Initializing database schema...")
    Schema.init(this)

    log.info("Database schema initialized successfully. Initializing mock data...")
    try {
        UserRepository().initializeMockData()
        PackageRepository().initializeMockData()
        PromoCodeRepository().initializeMockData()
        UsageRepository().initializeMockData()
        SupportTicketRepository().initializeMockData()
        NotificationRepository().initializeMockData()
        FeedbackRepository().initializeMockData()
        log.info("Mock data initialized successfully.")
    } catch (e: Exception) {
        log.error("Error initializing mock data: ${e.message}", e)
        throw e
    }
    // Configuration of all application's parts
    configureSerialization()
    configureRouting()
    configureStatusPages()
    configureCallLogging()
    configureCORS()

    log.info("G4UltimateMobile CRM Backend Module Started Successfully.")
}
