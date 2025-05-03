package com.yourcompany.backend.plugins

import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import kotlinx.serialization.json.Json

// Configures content negotiation for JSON using Kotlinx Serialization
fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true // Pretty print JSON responses for readability
            isLenient = true // Be lenient with JSON parsing (useful during development)
        })
    }
}
