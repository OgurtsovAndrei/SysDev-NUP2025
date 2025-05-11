package com.yourcompany.backend.routes

import com.yourcompany.backend.database.repositories.PackageRepository
import com.yourcompany.backend.database.repositories.PromoCodeRepository
import com.yourcompany.backend.database.repositories.UsageRepository
import com.yourcompany.backend.models.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.util.UUID

fun Route.packagesRoutes() {
    val packageRepository = PackageRepository()
    val promoCodeRepository = PromoCodeRepository()
    val usageRepository = UsageRepository()

    route("/api/packages") {
        // GET /api/packages/types
        get("/types") {
            val packageTypes = packageRepository.getAllPackageTypes()
            call.respond(HttpStatusCode.OK, packageTypes)
        }

        // GET /api/packages/{packageTypeId}/options
        get("/{packageTypeId}/options") {
            val packageTypeId = call.parameters["packageTypeId"]

            if (packageTypeId == null) {
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Package type ID is required"))
                return@get
            }

            val options = packageRepository.getPackageOptions(packageTypeId)

            if (options != null) {
                call.respond(HttpStatusCode.OK, options)
            } else {
                call.respond(HttpStatusCode.NotFound, ApiResponse(success = false, message = "Package type options not found"))
            }
        }
    }

    route("/api/promo-codes") {
        // POST /api/promo-codes/validate
        post("/validate") {
            val validateRequest = try {
                call.receive<ValidatePromoCodeRequest>()
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Invalid request body"))
                return@post
            }
            val promoCode = promoCodeRepository.findPromoCodeByCode(validateRequest.promoCode)

            if (promoCode != null) {

                call.respond(HttpStatusCode.OK, ValidatePromoCodeResponse(
                    valid = true,
                    discount = promoCode.discount,
                    description = promoCode.description
                ))
            } else {
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
            val orderRequest = try {
                call.receive<OrderRequest>()
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ApiResponse(success = false, message = "Invalid request body"))
                return@post
            }
            val userId = call.request.headers["Authorization"]?.split(SAFE_DELIMITER)?.last() ?: "NaN"
            val packageTypeName = packageRepository.getAllPackageTypes().find { it.id == orderRequest.packageType }?.name ?: "Unknown"
            val packageId = packageRepository.createPackage(userId, orderRequest, packageTypeName)

            usageRepository.createAndInsertNewOrderData(userId, packageId, orderRequest)
            call.respond(HttpStatusCode.Created, ApiResponse(success = true, message = "Order placed successfully"))
        }
    }
}
