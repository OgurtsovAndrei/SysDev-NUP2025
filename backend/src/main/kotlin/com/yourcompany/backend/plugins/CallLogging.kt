package com.yourcompany.backend.plugins

import io.ktor.server.application.*
import io.ktor.server.plugins.callloging.*
import org.slf4j.event.Level

// Configures call logging to log incoming requests
fun Application.configureCallLogging() {
    install(CallLogging) {
        level = Level.INFO
    }
}
