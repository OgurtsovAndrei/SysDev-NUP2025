package com.yourcompany.backend.registers

import com.yourcompany.backend.routes.*
import com.yourcompany.backend.routes.base.RouteConfigurable

data object RoutesConfigRegister : Register<RouteConfigurable> {
    override val registeredObjects: List<RouteConfigurable>
        get() = listOf(
            AuthRoutes(),
            UserProfileRoutes(),
            PackagesRoutes(),
            UsageRoutes(),
            ChatRoutes(),
            FeedbackRoutes(),
            OtherUserDataRoutes()
        )
}