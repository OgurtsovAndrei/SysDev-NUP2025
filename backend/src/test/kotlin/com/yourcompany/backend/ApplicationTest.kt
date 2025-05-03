package com.yourcompany.backend

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.testing.*
import kotlinx.serialization.Serializable
import kotlin.test.Test
import kotlin.test.assertEquals

// Simple data class for testing
@Serializable
data class TestResponse(val message: String)

class ApplicationTest {

    @Test
    fun testSimpleEndpoint() = testApplication {
        // Configure a simple test application
        application {
            routing {
                get("/test") {
                    call.respond(TestResponse("Test response"))
                }
            }
        }

        // Act
        val response = client.get("/test")

        // Assert
        assertEquals(HttpStatusCode.OK, response.status)
        val responseText = response.bodyAsText()
        println("[DEBUG_LOG] Response: $responseText")
        assert(responseText.contains("Test response"))
    }

    @Test
    fun testHtmlResponse() = testApplication {
        // Configure a simple test application
        application {
            routing {
                get("/html") {
                    call.respondText(
                        """
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Test HTML</title>
                        </head>
                        <body>
                            <h1>Test HTML Page</h1>
                        </body>
                        </html>
                        """.trimIndent(),
                        contentType = ContentType.Text.Html
                    )
                }
            }
        }

        // Act
        val response = client.get("/html")

        // Assert
        assertEquals(HttpStatusCode.OK, response.status)
        val responseText = response.bodyAsText()
        println("[DEBUG_LOG] Response length: ${responseText.length}")
        assert(responseText.contains("<html>"))
        assert(responseText.contains("<title>Test HTML</title>"))
    }
}
