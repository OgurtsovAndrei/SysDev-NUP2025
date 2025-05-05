package com.yourcompany.backend.database

import io.ktor.server.application.*
import org.ktorm.database.Database
import org.ktorm.support.postgresql.PostgreSqlDialect

/**
 * Database schema initialization
 */
object Schema {
    /**
     * Initialize the database schema
     */
    fun init(application: Application) {
        val database = DatabaseFactory.getInstance()

        application.log.info("Initializing database schema")

        // Create tables if they don't exist
        database.useConnection { connection ->
            // Set auto-commit to true for schema creation
            val originalAutoCommit = connection.autoCommit
            connection.autoCommit = true

            try {
                connection.prepareStatement("""
                    CREATE TABLE IF NOT EXISTS addresses (
                        id SERIAL PRIMARY KEY,
                        street VARCHAR(255) NOT NULL,
                        city VARCHAR(255) NOT NULL,
                        state VARCHAR(255) NOT NULL,
                        zip_code VARCHAR(20) NOT NULL,
                        country VARCHAR(255) NOT NULL
                    )
                """).execute()

                connection.prepareStatement("""
                    CREATE TABLE IF NOT EXISTS users (
                        id VARCHAR(20) PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL UNIQUE,
                        password VARCHAR(255) NOT NULL,
                        phone VARCHAR(20) NOT NULL,
                        account_number VARCHAR(20) NOT NULL UNIQUE,
                        account_type VARCHAR(50) NOT NULL,
                        registration_date DATE NOT NULL,
                        payment_method VARCHAR(255) NOT NULL,
                        billing_address_id INTEGER REFERENCES addresses(id)
                    )
                """).execute()

                connection.prepareStatement("""
                    CREATE TABLE IF NOT EXISTS packages (
                        id VARCHAR(20) PRIMARY KEY,
                        type VARCHAR(50) NOT NULL,
                        name VARCHAR(255) NOT NULL,
                        plan VARCHAR(50),
                        speed VARCHAR(50),
                        router VARCHAR(50),
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    )
                """).execute()

                connection.prepareStatement("""
                    CREATE TABLE IF NOT EXISTS user_packages (
                        user_id VARCHAR(20) REFERENCES users(id),
                        package_id VARCHAR(20) REFERENCES packages(id),
                        PRIMARY KEY (user_id, package_id)
                    )
                """).execute()

                connection.prepareStatement("""
                    CREATE TABLE IF NOT EXISTS package_add_ons (
                        package_id VARCHAR(20) REFERENCES packages(id),
                        add_on VARCHAR(50) NOT NULL,
                        PRIMARY KEY (package_id, add_on)
                    )
                """).execute()

                connection.prepareStatement("""
                    CREATE TABLE IF NOT EXISTS package_types (
                        id VARCHAR(50) PRIMARY KEY,
                        name VARCHAR(255) NOT NULL
                    )
                """).execute()

                connection.prepareStatement("""
                    CREATE TABLE IF NOT EXISTS package_options (
                        id SERIAL PRIMARY KEY,
                        package_type_id VARCHAR(50) REFERENCES package_types(id),
                        option_type VARCHAR(50) NOT NULL,
                        option_id VARCHAR(50) NOT NULL,
                        name VARCHAR(255) NOT NULL,
                        price DECIMAL(10,2) NOT NULL,
                        UNIQUE(package_type_id, option_type, option_id)
                    )
                """).execute()

                connection.prepareStatement("""
                    CREATE TABLE IF NOT EXISTS promo_codes (
                        code VARCHAR(20) PRIMARY KEY,
                        discount DECIMAL(5,2) NOT NULL,
                        description TEXT NOT NULL
                    )
                """).execute()

                connection.prepareStatement("""
                    CREATE TABLE IF NOT EXISTS usage_data (
                        id SERIAL PRIMARY KEY,
                        user_id VARCHAR(20) REFERENCES users(id),
                        package_id VARCHAR(20) REFERENCES packages(id),
                        billing_cycle_start DATE NOT NULL,
                        billing_cycle_end DATE NOT NULL,
                        data_used DECIMAL(10,2),
                        data_total DECIMAL(10,2),
                        call_minutes_used INTEGER,
                        call_minutes_total VARCHAR(20),
                        sms_used INTEGER,
                        sms_total VARCHAR(20),
                        download_speed VARCHAR(20),
                        upload_speed VARCHAR(20),
                        devices INTEGER
                    )
                """).execute()

                connection.prepareStatement("""
                    CREATE TABLE IF NOT EXISTS support_tickets (
                        id VARCHAR(20) PRIMARY KEY,
                        user_id VARCHAR(20) REFERENCES users(id),
                        subject VARCHAR(255) NOT NULL,
                        status VARCHAR(50) NOT NULL,
                        created_date DATE NOT NULL,
                        last_updated DATE NOT NULL,
                        priority VARCHAR(20) NOT NULL,
                        resolution TEXT
                    )
                """).execute()

                connection.prepareStatement("""
                    CREATE TABLE IF NOT EXISTS notifications (
                        id VARCHAR(20) PRIMARY KEY,
                        user_id VARCHAR(20) REFERENCES users(id),
                        type VARCHAR(50) NOT NULL,
                        message TEXT NOT NULL,
                        date DATE NOT NULL,
                        read BOOLEAN NOT NULL DEFAULT FALSE
                    )
                """).execute()

                connection.prepareStatement("""
                    CREATE TABLE IF NOT EXISTS feedback (
                        id VARCHAR(20) PRIMARY KEY,
                        rating INTEGER NOT NULL,
                        topic VARCHAR(50) NOT NULL,
                        text TEXT NOT NULL,
                        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
                        user_name VARCHAR(255) NOT NULL
                    )
                """).execute()

                connection.prepareStatement("""
                    CREATE TABLE IF NOT EXISTS chat_messages (
                        id SERIAL PRIMARY KEY,
                        user_id VARCHAR(20) REFERENCES users(id),
                        message TEXT NOT NULL,
                        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
                        is_from_user BOOLEAN NOT NULL
                    )
                """).execute()
            } finally {
                // Restore original auto-commit setting
                connection.autoCommit = originalAutoCommit
            }
        }

        application.log.info("Database schema initialized successfully")
    }
}
