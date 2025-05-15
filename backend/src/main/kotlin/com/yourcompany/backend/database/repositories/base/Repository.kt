package com.yourcompany.backend.database.repositories.base

import org.ktorm.database.Database

/**
 * Interface for all repository classes
 */
interface Repository {
    val database: Database
    /**
     * Initialize the database with mock data
     */
    fun initializeMockData()
}