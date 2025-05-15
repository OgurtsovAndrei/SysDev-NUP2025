package com.yourcompany.backend.plugins

import com.yourcompany.backend.plugins.base.PluginConfigBase
import io.ktor.server.application.*
import io.ktor.server.plugins.callloging.*
import org.slf4j.event.Level

/**
 * Configures call logging to log incoming requests
 */
class CallLoggingConfig : PluginConfigBase() {
    override fun Application.configurePlugin() {
        install(CallLogging) {
            level = Level.INFO
        }
    }
}
