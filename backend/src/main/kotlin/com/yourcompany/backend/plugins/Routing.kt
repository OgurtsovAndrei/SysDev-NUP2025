package com.yourcompany.backend.plugins

import io.ktor.server.application.*
import io.ktor.server.routing.*
import com.yourcompany.backend.routes.authRoutes
import com.yourcompany.backend.routes.chatRoutes
import com.yourcompany.backend.routes.feedbackRoutes
import com.yourcompany.backend.routes.otherUserDataRoutes
import com.yourcompany.backend.routes.packagesRoutes
import com.yourcompany.backend.routes.usageRoutes
import com.yourcompany.backend.routes.userProfileRoutes
import io.ktor.server.http.content.staticResources

// Configures the routing for all API endpoints
fun Application.configureRouting() {
    routing {
        // Include route definitions from separate files
        authRoutes() // Authentication routes
        userProfileRoutes() // User Profile routes
         packagesRoutes() // Uncomment when you create this file
         usageRoutes() // Uncomment when you create this file
         chatRoutes() // Uncomment when you create this file
         feedbackRoutes() // Uncomment when you create this file
         otherUserDataRoutes() // Uncomment when you create this file

        staticResources("/", "static") {
            application.log.info("Serving static content from classpath:static")
            default("index.html")
        }
    }
}
