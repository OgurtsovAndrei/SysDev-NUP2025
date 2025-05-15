package com.yourcompany.backend.plugins.base

import io.ktor.server.application.*

/**
 * Interface for plugin configuration
 * All plugin configurations should implement this interface
 */
interface PluginConfigurable {
    /**
     * Configures the plugin for the application
     * @param application The application to configure the plugin for
     */
    fun configure(application: Application)
}