package com.yourcompany.backend.database.repositories

import com.yourcompany.backend.database.DatabaseFactory
import com.yourcompany.backend.database.entities.*
import com.yourcompany.backend.models.*
import com.yourcompany.backend.models.UserPackage
import com.yourcompany.backend.models.PackageType as PackageTypeModel
import org.ktorm.dsl.*
import org.ktorm.entity.*
import java.math.BigDecimal
import java.time.Instant

/**
 * Repository for package-related database operations
 */
class PackageRepository {
    private val database = DatabaseFactory.getInstance()

    /**
     * Get all package types
     */
    fun getAllPackageTypes(): List<PackageTypeModel> {
        return database.sequenceOf(PackageTypes)
            .map { toPackageTypeModel(it) }
            .toList()
    }

    /**
     * Get package options for a specific package type
     */
    fun getPackageOptions(packageTypeId: String): PackageOptionsResponse? {
        val options = database.sequenceOf(PackageOptions)
            .filter { it.packageTypeId eq packageTypeId }
            .map { toOptionModel(it) }
            .groupBy { it.first }
            .mapValues { it.value.map { pair -> pair.second } }

        return when (packageTypeId) {
            "home_internet" -> PackageOptionsResponse(
                speeds = options["speeds"] ?: emptyList(),
                routers = options["routers"] ?: emptyList(),
                addOns = options["addOns"] ?: emptyList()
            )
            "mobile_hotspot", "mobile_no_hotspot" -> PackageOptionsResponse(
                dataPlans = options["dataPlans"] ?: emptyList(),
                addOns = options["addOns"] ?: emptyList()
            )
            "mobile_combo" -> PackageOptionsResponse(
                plans = options["plans"] ?: emptyList(),
                addOns = options["addOns"] ?: emptyList()
            )
            else -> PackageOptionsResponse()
        }
    }

    /**
     * Convert database PackageType entity to model
     */
    private fun toPackageTypeModel(packageType: PackageType): PackageTypeModel {
        return PackageTypeModel(
            id = packageType.id,
            name = packageType.name
        )
    }

    /**
     * Convert database PackageOption entity to model
     */
    private fun toOptionModel(packageOption: PackageOption): Pair<String, Option> {
        return Pair(
            packageOption.optionType,
            Option(
                id = packageOption.optionId,
                name = packageOption.name,
                price = packageOption.price.toDouble()
            )
        )
    }

    /**
     * Initialize the database with mock package data
     */
    fun initializeMockData() {
        val existingPackageType = database.sequenceOf(PackageTypes).firstOrNull()
        if (existingPackageType != null) {
            return
        }

        database.useTransaction { _ ->
            val packageTypes = listOf(
                PackageTypeModel(id = "home_internet", name = "Home Internet (limit only speed)"),
                PackageTypeModel(id = "mobile_hotspot", name = "Mobile Internet (with hotspot)"),
                PackageTypeModel(id = "mobile_no_hotspot", name = "Mobile Internet (no hotspot)"),
                PackageTypeModel(id = "mobile_combo", name = "Mobile Internet + Minutes + SMS")
            )

            packageTypes.forEach { packageType ->
                database.insert(PackageTypes) {
                    set(it.id, packageType.id)
                    set(it.name, packageType.name)
                }
            }

            val homeInternetOptions = mapOf(
                "speeds" to listOf(
                    Option(id = "basic", name = "Basic (50 Mbps)", price = 29.99),
                    Option(id = "standard", name = "Standard (100 Mbps)", price = 49.99),
                    Option(id = "premium", name = "Premium (500 Mbps)", price = 79.99),
                    Option(id = "ultra", name = "Ultra (1 Gbps)", price = 99.99)
                ),
                "routers" to listOf(
                    Option(id = "basic", name = "Basic Router", price = 0.0),
                    Option(id = "premium", name = "Premium Router", price = 49.99),
                    Option(id = "mesh", name = "Mesh WiFi System", price = 149.99)
                ),
                "addOns" to listOf(
                    Option(id = "static_ip", name = "Static IP", price = 5.99),
                    Option(id = "premium_support", name = "Premium Support", price = 10.99)
                )
            )

            insertPackageOptions("home_internet", homeInternetOptions)
            val mobileHotspotOptions = mapOf(
                "dataPlans" to listOf(
                    Option(id = "10gb", name = "10GB Data", price = 15.99),
                    Option(id = "20gb", name = "20GB Data", price = 25.99),
                    Option(id = "50gb", name = "50GB Data", price = 45.99),
                    Option(id = "unlimited", name = "Unlimited Data", price = 65.99)
                ),
                "addOns" to listOf(
                    Option(id = "international", name = "International Roaming", price = 10.99),
                    Option(id = "priority", name = "Priority Data", price = 15.99)
                )
            )

            insertPackageOptions("mobile_hotspot", mobileHotspotOptions)
            val mobileNoHotspotOptions = mapOf(
                "dataPlans" to listOf(
                    Option(id = "10gb", name = "10GB Data", price = 10.99),
                    Option(id = "20gb", name = "20GB Data", price = 20.99),
                    Option(id = "50gb", name = "50GB Data", price = 40.99),
                    Option(id = "unlimited", name = "Unlimited Data", price = 55.99)
                ),
                "addOns" to listOf(
                    Option(id = "international", name = "International Roaming", price = 10.99),
                    Option(id = "priority", name = "Priority Data", price = 15.99)
                )
            )

            insertPackageOptions("mobile_no_hotspot", mobileNoHotspotOptions)
            val mobileComboOptions = mapOf(
                "plans" to listOf(
                    Option(id = "basic", name = "Basic (5GB + 100 mins + 100 SMS)", price = 19.99),
                    Option(id = "standard", name = "Standard (20GB + 500 mins + 500 SMS)", price = 39.99),
                    Option(id = "premium", name = "Premium (50GB + Unlimited mins + Unlimited SMS)", price = 59.99),
                    Option(id = "unlimited", name = "Unlimited (Unlimited Data + Unlimited mins + Unlimited SMS)", price = 79.99)
                ),
                "addOns" to listOf(
                    Option(id = "landline", name = "Landline minutes", price = 5.99),
                    Option(id = "international", name = "International minutes", price = 10.99),
                    Option(id = "08numbers", name = "08-number calls", price = 3.99),
                    Option(id = "international_sms", name = "International SMS", price = 5.99)
                )
            )

            insertPackageOptions("mobile_combo", mobileComboOptions)
        }
    }

    /**
     * Helper method to insert package options
     */
    private fun insertPackageOptions(packageTypeId: String, options: Map<String, List<Option>>) {
        options.forEach { (optionType, optionsList) ->
            optionsList.forEach { option ->
                database.insert(PackageOptions) {
                    set(it.packageTypeId, packageTypeId)
                    set(it.optionType, optionType)
                    set(it.optionId, option.id)
                    set(it.name, option.name)
                    set(it.price, BigDecimal.valueOf(option.price))
                }
            }
        }
    }

    /**
     * Create a new package
     */
    fun createPackage(userId: String, orderRequest: OrderRequest, packageTypeName: String): String {
        val request = CreatePackageRequest(
            name = packageTypeName,
            plan = orderRequest.options.plan,
            type = orderRequest.packageType,
            speed = orderRequest.options.speed,
            addOns = orderRequest.options.addOns,
            router = orderRequest.options.router,
            userId = userId
        )
        val packageId = "pkg_${System.currentTimeMillis()}"

        database.useTransaction {
            database.insert(Packages) {
                set(it.id, packageId)
                set(it.type, request.type)
                set(it.name, request.name)
                set(it.plan, request.plan)
                set(it.speed, request.speed)
                set(it.router, request.router)
                set(it.createdAt, Instant.now())
            }
            for (addOn in request.addOns) {
                database.insert(PackageAddOns) {
                    set(it.packageId, packageId)
                    set(it.addOn, addOn)
                }
            }
            if (request.userId != null) {
                database.insert(UserPackages) {
                    set(it.userId, request.userId)
                    set(it.packageId, packageId)
                }
            }
        }

        return packageId
    }
}
