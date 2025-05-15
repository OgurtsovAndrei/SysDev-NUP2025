package com.yourcompany.backend.plugins

import com.yourcompany.backend.plugins.base.PluginConfigBase
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*

/**
 * Configures status pages for handling HTTP errors
 */
class StatusPagesConfig : PluginConfigBase() {
    override fun Application.configurePlugin() {
        install(StatusPages) {
            exception<Throwable> { call, cause ->
                call.respondText(text = "500: ${cause.localizedMessage}", status = HttpStatusCode.InternalServerError)
            }
            status(HttpStatusCode.NotFound) { call, status ->
                call.respondText(text = "404: Page Not Found", status = status)
            }
        }
    }
}
