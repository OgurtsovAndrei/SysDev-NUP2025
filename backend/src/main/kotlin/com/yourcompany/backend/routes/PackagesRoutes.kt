package com.yourcompany.backend.routes


import com.yourcompany.backend.data.mockPackageOptions // Import mock package options data
import com.yourcompany.backend.data.mockPackageTypes // Import mock package types data
import com.yourcompany.backend.data.mockPromoCodes // Import mock promo codes data
import com.yourcompany.backend.models.* // Import all models
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.util.UUID // For generating mock order IDs

// Defines routes related to packages and ordering
fun Route.packagesRoutes() {
    route("/api/packages") {
        // GET /api/packages/types
        get("/types") {
            // Return the list of mock package types
            call.respond(HttpStatusCode.OK, mockPackageTypes)
        }

        // GET /api/packages/{packageTypeId}/options
        get("/{packageTypeId}/options") {
            // Extract the package type ID from the path parameters
            val packageTypeId = call.parameters["packageTypeId"]

            // Find the options for the given package type ID in mock data
            val options = mockPackageOptions[packageTypeId]

            if (options != null) {
                // Return the package options if found
                call.respond(HttpStatusCode.OK, options)
            } else {
                // Return 404 Not Found if package type options are not in mock data
                call.respond(HttpStatusCode.NotFound, ApiResponse(success = false, message = "Package type options not found"))
            }
        }
    }

    route("/api/promo-codes") {
        // POST /api/promo-codes/validate
        post("/validate") {
            val validateRequest = try {
                call.receive<ValidatePromoCodeRequest>() // Receive and deserialize the promo code validation request
            } catch (e: Exception) {
                // Handle invalid request body
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Invalid request body"))
                return@post
            }

            // Find the promo code in mock data
            val promoCode = mockPromoCodes.find { it.code == validateRequest.promoCode }

            if (promoCode != null) {
                // Return validation success with discount details
                call.respond(HttpStatusCode.OK, ValidatePromoCodeResponse(
                    valid = true,
                    discount = promoCode.discount,
                    description = promoCode.description
                ))
            } else {
                // Return validation failure if promo code not found
                call.respond(HttpStatusCode.OK, ValidatePromoCodeResponse(
                    valid = false,
                    description = "Invalid promo code."
                ))
            }
        }
    }

    route("/api/orders") {
        // POST /api/orders
        post {
            // In a real application, you would authenticate the user here
            // and associate the order with the authenticated user ID.
            // For this mock, we'll just log the order details.

            val orderRequest = try {
                call.receive<OrderRequest>() // Receive and deserialize the order request body
            } catch (e: Exception) {
                // Handle invalid request body
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Invalid request body"))
                return@post
            }

            // Simulate order processing (replace with actual order creation logic and database insertion)
            val newOrderId = UUID.randomUUID().toString() // Generate a mock order ID

            println("Received new order:")
            println("  Package Type: ${orderRequest.packageType}")
            println("  Options: ${orderRequest.options}")
            println("  Promo Code: ${orderRequest.promoCode ?: "None"}")
            println("  Mock Order ID: $newOrderId")

            // Simulate successful order placement
            call.respond(HttpStatusCode.Created, ApiResponse(success = true, message = "Order placed successfully"))
        }
    }
}
