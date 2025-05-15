package com.yourcompany.backend.plugins

import com.yourcompany.backend.plugins.base.PluginConfigBase
import io.ktor.server.application.*
import io.ktor.server.routing.*
import com.yourcompany.backend.registers.RoutesConfigRegister
import io.ktor.server.http.content.staticResources

/**
 * Configures the routing for all API endpoints
 */
class RoutingConfig : PluginConfigBase() {
    override fun Application.configurePlugin() {
        routing {
            RoutesConfigRegister.registeredObjects.forEach { routeConfig ->
                routeConfig.configure(this)
            }

            staticResources("/", "static") {
                application.log.info("Serving static content from classpath:static")
                default("index.html")
            }
        }
    }
}
