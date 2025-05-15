package com.yourcompany.backend.routes.base

import io.ktor.server.routing.*

interface RouteConfigurable {
    fun configure(route: Route)
}