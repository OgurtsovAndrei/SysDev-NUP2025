package com.yourcompany.backend.routes

import com.yourcompany.backend.database.repositories.PackageRepository
import com.yourcompany.backend.database.repositories.PromoCodeRepository
import com.yourcompany.backend.database.repositories.UsageRepository
import com.yourcompany.backend.models.* // Import all models
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.util.UUID // For generating mock order IDs

// Defines routes related to packages and ordering
fun Route.packagesRoutes() {
    val packageRepository = PackageRepository()
    val promoCodeRepository = PromoCodeRepository()
    val usageRepository = UsageRepository()

    route("/api/packages") {
        // GET /api/packages/types
        get("/types") {
            // Get all package types from the database
            val packageTypes = packageRepository.getAllPackageTypes()
            call.respond(HttpStatusCode.OK, packageTypes)
        }

        // GET /api/packages/{packageTypeId}/options
        get("/{packageTypeId}/options") {
            // Extract the package type ID from the path parameters
            val packageTypeId = call.parameters["packageTypeId"]

            if (packageTypeId == null) {
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Package type ID is required"))
                return@get
            }

            // Get package options from the database
            val options = packageRepository.getPackageOptions(packageTypeId)

            if (options != null) {
                // Return the package options if found
                call.respond(HttpStatusCode.OK, options)
            } else {
                // Return 404 Not Found if package type options are not found
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

            // Find the promo code in the database
            val promoCode = promoCodeRepository.findPromoCodeByCode(validateRequest.promoCode)

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
            val userId = call.request.headers["Authorization"]?.split(SAFE_DELIMITER)?.last() ?: "NaN"
            val packageTypeName = packageRepository.getAllPackageTypes().find { it.id == orderRequest.packageType }?.name ?: "Unknown"

            val packageId = packageRepository.createPackage(userId, orderRequest, packageTypeName)

            usageRepository.createAndInsertNewOrderData(userId, packageId, orderRequest)
            // Simulate order processing (replace with actual order creation logic and database insertion)
            val newOrderId = UUID.randomUUID().toString() // Generate a mock order ID

            // Simulate successful order placement
            call.respond(HttpStatusCode.Created, ApiResponse(success = true, message = "Order placed successfully"))
        }
    }
}
