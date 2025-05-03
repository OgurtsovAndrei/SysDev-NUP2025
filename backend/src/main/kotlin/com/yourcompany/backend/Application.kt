package com.yourcompany.backend // Убедитесь, что пакет соответствует структуре вашего проекта

import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.http.content.* // Для staticResources, если вы планируете их использовать
import com.yourcompany.backend.plugins.* // Импортируем пакет с конфигурацией плагинов
import kotlinx.serialization.Serializable // Для простого ответа API (если нужен тестовый эндпоинт)

// Простой data class для API ответа (для примера)
// @Serializable
// data class HelloResponse(val message: String)

// Основная точка входа для Ktor приложения при использовании application.conf
fun main(args: Array<String>): Unit = EngineMain.main(args)

// Функция модуля приложения.
// Ktor вызывает эту функцию при старте сервера, используя конфигурацию из application.conf.
// @Suppress("unused") используется, потому что Ktor вызывает ее через рефлексию.
@Suppress("unused")
fun Application.module() {
    log.info("Starting G4UltimateMobile CRM Backend Module...") // Используем стандартный логгер Ktor

    // Установка и настройка плагинов
    configureSerialization() // Настройка сериализации JSON (из plugins/Serialization.kt)
    configureRouting() // Настройка роутинга (из plugins/Routing.kt)
    configureStatusPages() // Настройка обработки страниц статуса (из plugins/StatusPages.kt)
    configureCallLogging() // Настройка логирования вызовов (из plugins/CallLogging.kt)
    configureCORS() // Настройка CORS (из plugins/CORS.kt)
    // configureSecurity() // Раскомментируйте и реализуйте, если добавите аутентификацию/авторизацию

    // Пример настройки для отдачи статических файлов из frontend модуля
    // Если у вас есть папка 'static' в src/main/resources вашего frontend модуля,
    // этот блок позволит отдавать файлы из нее по корневому URL "/".
/*
    install(Routing) { // Routing уже установлен выше, можно добавить статику в существующий блок
        staticResources("/", "static") {
            application.log.info("Serving static content from classpath:static")
            // Указываем файл по умолчанию, если запрошен корень "/"
            default("index.html")
        }
    }*/

    log.info("G4UltimateMobile CRM Backend Module Started Successfully.")
}
