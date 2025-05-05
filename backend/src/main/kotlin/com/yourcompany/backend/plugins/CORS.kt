package com.yourcompany.backend.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*

// Configures Cross-Origin Resource Sharing (CORS)
fun Application.configureCORS() {
    install(CORS) {
        // Allow requests from your frontend's origin(s)
        // Replace "localhost:8000" with the actual host and port of your frontend
        // You can add multiple origins.
        // The scheme (http/https) is now specified in the 'schemes' parameter.
        allowHost("localhost:8081", schemes = listOf("http"))
        allowHost("0.0.0.0:8081", schemes = listOf("http"))
        // Or for development, allow any host (less secure in production)
        // anyHost()

        allowHeader(HttpHeaders.ContentType) // Allow Content-Type header
        allowHeader(HttpHeaders.Authorization) // Allow Authorization header (needed for JWT/token auth)
        allowMethod(HttpMethod.Options) // Allow OPTIONS method (used by browsers for preflight requests)
        allowMethod(HttpMethod.Get) // Allow GET requests
        allowMethod(HttpMethod.Post) // Allow POST requests
        allowMethod(HttpMethod.Put) // Allow PUT requests
        allowMethod(HttpMethod.Patch) // Allow PATCH requests
        allowMethod(HttpMethod.Delete) // Allow DELETE requests

        allowCredentials = true // Allow sending cookies or authorization headers with credentials

        // Optional: Configure max age for CORS preflight requests
        maxAgeInSeconds = 3600
    }
}
