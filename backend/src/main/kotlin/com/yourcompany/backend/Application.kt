package com.yourcompany.backend

import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.http.content.* // Для staticResources
import kotlinx.serialization.Serializable // Для простого ответа API

// Простой data class для API ответа
@Serializable
data class HelloResponse(val message: String)

fun main(args: Array<String>): Unit = EngineMain.main(args) // Стандартный запуск Ktor

// Функция модуля приложения, вызывается из application.conf
@Suppress("unused") // Используется через рефлексию Ktor
fun Application.module() {
    log.info("Starting Telecom Backend Module...") // Используем стандартный логгер Ktor

    // Настройка сериализации JSON
    install(ContentNegotiation) {
        json() // Используем kotlinx.serialization
    }

    // Настройка роутинга
    install(Routing) {
        // Простой API эндпоинт
        get("/api/hello") {
            application.log.info("Accessed /api/hello endpoint")
            call.respond(HelloResponse("Hello from Ktor Backend!"))
        }

        // Настройка для отдачи статических файлов из frontend модуля
        // "/" - корневой URL путь
        // "static" - папка внутри classpath (куда Gradle поместит ресурсы из frontend/src/main/resources/static)
        staticResources("/", "static") {
            application.log.info("Serving static content from classpath:static")
            // Указываем файл по умолчанию, если запрошен корень "/"
            default("index.html")
        }
    }
    log.info("Telecom Backend Module Started Successfully.")
}