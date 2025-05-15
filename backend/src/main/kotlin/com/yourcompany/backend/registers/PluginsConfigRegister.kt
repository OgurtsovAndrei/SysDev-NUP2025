package com.yourcompany.backend.registers

import com.yourcompany.backend.plugins.*
import com.yourcompany.backend.plugins.base.PluginConfigurable

data object PluginsConfigRegister : Register<PluginConfigurable> {
    override val registeredObjects: List<PluginConfigurable>
        get() = listOf(
            SerializationConfig(),
            RoutingConfig(),
            StatusPagesConfig(),
            CallLoggingConfig(),
            CorsConfig()
        )
}