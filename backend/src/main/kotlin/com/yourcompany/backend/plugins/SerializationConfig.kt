package com.yourcompany.backend.plugins

import com.yourcompany.backend.plugins.base.PluginConfigBase
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import kotlinx.serialization.json.Json

/**
 * Configures content negotiation for JSON using Kotlinx Serialization
 */
class SerializationConfig : PluginConfigBase() {
    override fun Application.configurePlugin() {
        install(ContentNegotiation) {
            json(Json {
                prettyPrint = true
                isLenient = true
            })
        }
    }
}
