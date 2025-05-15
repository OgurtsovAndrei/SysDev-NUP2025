package com.yourcompany.backend.plugins.base

import io.ktor.server.application.*

/**
 * Base abstract class for plugin configuration
 * Provides a common implementation pattern for all plugin classes
 */
abstract class PluginConfigBase : PluginConfigurable {
    override fun configure(application: Application) {
        application.configurePlugin()
    }

    /**
     * Abstract method that must be implemented by subclasses to configure the plugin
     * @receiver The application to configure the plugin for
     */
    protected abstract fun Application.configurePlugin()
}