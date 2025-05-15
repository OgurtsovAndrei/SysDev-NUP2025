package com.yourcompany.backend.database.repositories

import com.yourcompany.backend.database.DatabaseFactory
import com.yourcompany.backend.database.entities.*
import com.yourcompany.backend.database.repositories.base.Repository
import com.yourcompany.backend.models.PromoCode as PromoCodeModel
import org.ktorm.dsl.*
import org.ktorm.entity.*
import java.math.BigDecimal

/**
 * Repository for promo code-related database operations
 */
class PromoCodeRepository : Repository {
    override val database = DatabaseFactory.getInstance()

    /**
     * Find a promo code by code
     */
    fun findPromoCodeByCode(code: String): PromoCodeModel? {
        val promoCode = database.sequenceOf(PromoCodes)
            .firstOrNull { it.code eq code } ?: return null

        return toPromoCodeModel(promoCode)
    }

    /**
     * Convert database PromoCode entity to model
     */
    private fun toPromoCodeModel(promoCode: PromoCode): PromoCodeModel {
        return PromoCodeModel(
            code = promoCode.code,
            discount = promoCode.discount.toDouble(),
            description = promoCode.description
        )
    }

    /**
     * Initialize the database with mock promo code data
     */
    override fun initializeMockData() {
        val existingPromoCode = database.sequenceOf(PromoCodes).firstOrNull()
        if (existingPromoCode != null) {
            return
        }

        database.useTransaction { _ ->
            val promoCodes = listOf(
                PromoCodeModel(code = "WELCOME10", discount = 0.1, description = "10% off for new customers"),
                PromoCodeModel(code = "LOYALTY25", discount = 0.25, description = "25% off for loyal customers"),
                PromoCodeModel(code = "STUDENT10", discount = 0.1, description = "10% off for students"),
                PromoCodeModel(code = "SUMMER2025", discount = 0.15, description = "15% summer discount")
            )

            promoCodes.forEach { promoCode ->
                database.insert(PromoCodes) {
                    set(it.code, promoCode.code)
                    set(it.discount, BigDecimal.valueOf(promoCode.discount))
                    set(it.description, promoCode.description)
                }
            }
        }
    }
}
