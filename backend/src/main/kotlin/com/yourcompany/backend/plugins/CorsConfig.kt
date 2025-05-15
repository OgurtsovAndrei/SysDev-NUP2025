package com.yourcompany.backend.plugins

import com.yourcompany.backend.plugins.base.PluginConfigBase
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*

/**
 * Configures Cross-Origin Resource Sharing (CORS)
 */
class CorsConfig : PluginConfigBase() {
    override fun Application.configurePlugin() {
        install(CORS) {
            allowHost("localhost:8081", schemes = listOf("http"))
            allowHost("127.0.0.1:8081", schemes = listOf("http"))
            allowHost("0.0.0.0:8081", schemes = listOf("http"))

            allowHeader(HttpHeaders.ContentType)
            allowHeader(HttpHeaders.Authorization)
            allowMethod(HttpMethod.Options)
            allowMethod(HttpMethod.Get)
            allowMethod(HttpMethod.Post)
            allowMethod(HttpMethod.Put)
            allowMethod(HttpMethod.Patch)
            allowMethod(HttpMethod.Delete)

            allowCredentials = true
            maxAgeInSeconds = 3600
        }
    }
}
