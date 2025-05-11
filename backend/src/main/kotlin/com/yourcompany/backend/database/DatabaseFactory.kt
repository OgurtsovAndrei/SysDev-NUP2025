package com.yourcompany.backend.database

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.application.*
import org.ktorm.database.Database
import org.ktorm.logging.Slf4jLoggerAdapter
import org.ktorm.support.postgresql.PostgreSqlDialect

/**
 * Factory for creating and managing database connections
 */
object DatabaseFactory {
    private lateinit var database: Database

    /**
     * Initialize the database connection
     */
    fun init(application: Application) {
        val config = application.environment.config.config("database")
        val jdbcUrl = config.property("url").getString()
        val driverClassName = config.property("driver").getString()
        val username = config.property("user").getString()
        val password = config.property("password").getString()
        val poolSize = config.property("poolSize").getString().toInt()

        application.log.info("Initializing database connection: $jdbcUrl")

        val hikariConfig = HikariConfig().apply {
            this.jdbcUrl = jdbcUrl
            this.driverClassName = driverClassName
            this.username = username
            this.password = password
            this.maximumPoolSize = poolSize
            this.isAutoCommit = true
            this.transactionIsolation = "TRANSACTION_REPEATABLE_READ"
            this.validate()
        }

        val dataSource = HikariDataSource(hikariConfig)

        database = Database.connect(
            dataSource = dataSource,
            dialect = PostgreSqlDialect(),
            logger = Slf4jLoggerAdapter("DatabaseLogger")
        )

        application.log.info("Database connection initialized successfully")
    }

    /**
     * Get the database instance
     */
    fun getInstance(): Database {
        if (!::database.isInitialized) {
            throw IllegalStateException("Database not initialized. Call init() first.")
        }
        return database
    }
}
