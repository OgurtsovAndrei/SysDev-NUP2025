package com.yourcompany.backend.routes.base

import io.ktor.server.routing.*

abstract class RouteConfigBase : RouteConfigurable {
    protected val SAFE_DELIMITER = "simulated_jwt_token_for_"

    override fun configure(route: Route) {
        route.configureRoutes()
    }

    protected abstract fun Route.configureRoutes()
}