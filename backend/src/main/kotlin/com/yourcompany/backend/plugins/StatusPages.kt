package com.yourcompany.backend.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*

// Configures status pages for handling HTTP errors
fun Application.configureStatusPages() {
    install(StatusPages) {
        // Catch specific exceptions and respond with appropriate status codes
        exception<Throwable> { call, cause ->
            call.respondText(text = "500: ${cause.localizedMessage}", status = HttpStatusCode.InternalServerError)
        }
        // Handle specific status codes
        status(HttpStatusCode.NotFound) { call, status ->
            call.respondText(text = "404: Page Not Found", status = status)
        }
    }
}
