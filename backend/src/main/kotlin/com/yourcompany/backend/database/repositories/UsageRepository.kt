package com.yourcompany.backend.database.repositories

import com.yourcompany.backend.database.DatabaseFactory
import com.yourcompany.backend.database.entities.*
import com.yourcompany.backend.database.entities.User
import com.yourcompany.backend.database.repositories.base.Repository
import com.yourcompany.backend.models.*
import org.ktorm.dsl.*
import org.ktorm.entity.*
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import kotlin.reflect.KClass

/**
 * Repository for usage data-related database operations
 */
class UsageRepository : Repository {
    override val database = DatabaseFactory.getInstance()
    private val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")

    /**
     * Get usage data for a user
     */
    fun getUserUsageData(userId: String): UsageDataResponse? {
        val usageDataList = database.sequenceOf(UsageDataTable)
            .filter { it.userId eq userId }
            .sortedByDescending { it.billingCycleEnd }
            .toList()

        if (usageDataList.isEmpty()) {
            return null
        }
        val groupedByBillingCycle = usageDataList.groupBy { 
            "${it.billingCycleStart.format(formatter)}_${it.billingCycleEnd.format(formatter)}" 
        }
        val currentBillingCycleKey = groupedByBillingCycle.keys.first()
        val currentBillingCycleData = groupedByBillingCycle[currentBillingCycleKey] ?: return null
        val currentBillingCycle = createBillingCycle(currentBillingCycleData)
        val previousBillingCycles = groupedByBillingCycle.entries
            .filter { it.key != currentBillingCycleKey }
            .map { createPreviousBillingCycle(it.value) }
            .sortedByDescending { it.period }

        return UsageDataResponse(
            currentBillingCycle = currentBillingCycle,
            previousBillingCycles = previousBillingCycles
        )
    }

    /**
     * Create a BillingCycle from a list of UsageData
     */
    private fun createBillingCycle(usageDataList: List<UsageData>): BillingCycle {
        val startDate = usageDataList.first().billingCycleStart.format(formatter)
        val endDate = usageDataList.first().billingCycleEnd.format(formatter)
        val packageUsages = usageDataList.associate { usageData ->
            usageData.package_.id to createPackageUsage(usageData)
        }

        return BillingCycle(
            startDate = startDate,
            endDate = endDate,
            packages = packageUsages
        )
    }

    /**
     * Create a PackageUsage from UsageData
     */
    private fun createPackageUsage(usageData: UsageData): PackageUsage {
        return PackageUsage(
            type = usageData.package_.type,
            name = usageData.package_.name,
            dataUsed = usageData.dataUsed?.toDouble() ?: 0.0,
            dataTotal = usageData.dataTotal?.toDouble() ?: 0.0,
            callMinutesUsed = usageData.callMinutesUsed,
            callMinutesTotal = usageData.callMinutesTotal,
            smsUsed = usageData.smsUsed,
            smsTotal = usageData.smsTotal,
            downloadSpeed = usageData.downloadSpeed,
            uploadSpeed = usageData.uploadSpeed,
            devices = usageData.devices
        )
    }

    /**
     * Create a PreviousBillingCycle from a list of UsageData
     */
    private fun createPreviousBillingCycle(usageDataList: List<UsageData>): PreviousBillingCycle {
        val startDate = usageDataList.first().billingCycleStart
        val endDate = usageDataList.first().billingCycleEnd
        val period = "${startDate.month.name.lowercase().capitalize()} ${startDate.year}"
        val packageUsages = usageDataList.associate { usageData ->
            usageData.package_.id to createPreviousPackageUsage(usageData)
        }

        return PreviousBillingCycle(
            period = period,
            packages = packageUsages
        )
    }

    /**
     * Create a PreviousPackageUsage from UsageData
     */
    private fun createPreviousPackageUsage(usageData: UsageData): PreviousPackageUsage {
        return PreviousPackageUsage(
            type = usageData.package_.type,
            name = usageData.package_.name,
            dataUsed = usageData.dataUsed?.toDouble() ?: 0.0,
            dataTotal = usageData.dataTotal?.toDouble() ?: 0.0,
            callMinutesUsed = usageData.callMinutesUsed,
            callMinutesTotal = usageData.callMinutesTotal,
            smsUsed = usageData.smsUsed,
            smsTotal = usageData.smsTotal
        )
    }

    /**
     * Initialize the database with mock usage data
     */
    override fun initializeMockData() {
        val existingUsageData = database.sequenceOf(UsageDataTable).firstOrNull()
        if (existingUsageData != null) {
            return
        }
        val userId = database.sequenceOf(Users).firstOrNull { it.id eq "USR12345" }?.id ?: return
        val package1 = database.sequenceOf(Packages).firstOrNull { it.id eq "PKG002" } ?: return
        val package2 = database.sequenceOf(Packages).firstOrNull { it.id eq "PKG005" } ?: return

        database.useTransaction { _ ->
            insertUsageData(
                userId = userId,
                package_ = package1,
                billingCycleStart = LocalDate.of(2025, 3, 1),
                billingCycleEnd = LocalDate.of(2025, 3, 31),
                dataUsed = BigDecimal("12.5"),
                dataTotal = BigDecimal("20.0"),
                callMinutesUsed = 320,
                callMinutesTotal = "500",
                smsUsed = 45,
                smsTotal = "500"
            )

            insertUsageData(
                userId = userId,
                package_ = package2,
                billingCycleStart = LocalDate.of(2025, 3, 1),
                billingCycleEnd = LocalDate.of(2025, 3, 31),
                dataUsed = BigDecimal("250.5"),
                dataTotal = BigDecimal("500.0"),
                downloadSpeed = "100 Mbps",
                uploadSpeed = "20 Mbps",
                devices = 8
            )

            insertUsageData(
                userId = userId,
                package_ = package1,
                billingCycleStart = LocalDate.of(2025, 2, 1),
                billingCycleEnd = LocalDate.of(2025, 2, 28),
                dataUsed = BigDecimal("18.2"),
                dataTotal = BigDecimal("20.0"),
                callMinutesUsed = 450,
                callMinutesTotal = "500",
                smsUsed = 78,
                smsTotal = "500"
            )

            insertUsageData(
                userId = userId,
                package_ = package2,
                billingCycleStart = LocalDate.of(2025, 2, 1),
                billingCycleEnd = LocalDate.of(2025, 2, 28),
                dataUsed = BigDecimal("320.7"),
                dataTotal = BigDecimal("500.0")
            )

            insertUsageData(
                userId = userId,
                package_ = package1,
                billingCycleStart = LocalDate.of(2025, 1, 1),
                billingCycleEnd = LocalDate.of(2025, 1, 31),
                dataUsed = BigDecimal("15.7"),
                dataTotal = BigDecimal("20.0"),
                callMinutesUsed = 380,
                callMinutesTotal = "500",
                smsUsed = 62,
                smsTotal = "500"
            )

            insertUsageData(
                userId = userId,
                package_ = package2,
                billingCycleStart = LocalDate.of(2025, 1, 1),
                billingCycleEnd = LocalDate.of(2025, 1, 31),
                dataUsed = BigDecimal("280.3"),
                dataTotal = BigDecimal("500.0")
            )
        }
    }

    fun createAndInsertNewOrderData(userId: String, packageId: String, orderRequest: OrderRequest) {
        val package_ = database.sequenceOf(Packages).firstOrNull { it.id eq packageId } ?: return
        val date = LocalDate.now()
        val dataTotal: BigDecimal
        val callMinutesTotal: String?
        val smsTotal: String?
        val uploadSpeed: String?

        when (orderRequest.packageType) {
            "home_internet" -> {
                dataTotal = BigDecimal(99999)
                callMinutesTotal = null
                smsTotal = null
                uploadSpeed = package_.speed?.let { speed ->
                    val downloadSpeedValue = speed.split(" ")[0].toDoubleOrNull()
                    val unit = speed.split(" ").getOrNull(1) ?: "Mbps"
                    val uploadSpeedValue = downloadSpeedValue?.div(5)
                    "$uploadSpeedValue $unit"
                }
            }
            "mobile_hotspot", "mobile_no_hotspot" -> {
                dataTotal = orderRequest.options.dataPlan?.let { dataPlanId ->
                    when (dataPlanId) {
                        "10gb" -> BigDecimal("10")
                        "20gb" -> BigDecimal("20")
                        "50gb" -> BigDecimal("50")
                        "unlimited" -> BigDecimal(99999)
                        else -> BigDecimal("0")
                    }
                } ?: BigDecimal("0")
                callMinutesTotal = null
                smsTotal = null
                uploadSpeed = null
            }
            "mobile_combo" -> {
                val planInfo = orderRequest.options.plan
                println(orderRequest.options.plan)
                dataTotal = when {
                    planInfo?.contains("basic") == true -> BigDecimal("5")
                    planInfo?.contains("standard") == true -> BigDecimal("20")
                    planInfo?.contains("premium") == true -> BigDecimal("50")
                    planInfo?.contains("unlimited") == true -> BigDecimal(99999)
                    else -> BigDecimal("0")
                }
                callMinutesTotal = when {
                    planInfo?.contains("basic") == true -> "100"
                    planInfo?.contains("standard") == true -> "500"
                    planInfo?.contains("premium") == true || planInfo?.contains("unlimited") == true -> "Unlimited"
                    else -> "0"
                }
                smsTotal = when {
                    planInfo?.contains("basic") == true -> "100"
                    planInfo?.contains("standard") == true -> "500"
                    planInfo?.contains("premium") == true || planInfo?.contains("unlimited") == true -> "Unlimited"
                    else -> "0"
                }
                uploadSpeed = null
            }
            else -> {
                dataTotal = BigDecimal("0")
                callMinutesTotal = "0"
                smsTotal = "0"
                uploadSpeed = null
            }
        }

        database.useTransaction { transaction ->
            insertUsageData(
                userId = userId,
                package_ = package_,
                billingCycleStart = date,
                billingCycleEnd = LocalDate.ofYearDay(date.year, date.dayOfYear + 30),
                dataUsed = BigDecimal("0"),
                dataTotal = dataTotal,
                callMinutesUsed = 0,
                callMinutesTotal = callMinutesTotal,
                smsUsed = 0,
                smsTotal = smsTotal,
                downloadSpeed = package_.speed,
                uploadSpeed = uploadSpeed,
                devices = 1
            )
        }
    }

    /**
     * Helper method to insert usage data
     */
    private fun insertUsageData(
        userId: String,
        package_: Package,
        billingCycleStart: LocalDate,
        billingCycleEnd: LocalDate,
        dataUsed: BigDecimal,
        dataTotal: BigDecimal,
        callMinutesUsed: Int? = null,
        callMinutesTotal: String? = null,
        smsUsed: Int? = null,
        smsTotal: String? = null,
        downloadSpeed: String? = null,
        uploadSpeed: String? = null,
        devices: Int? = null
    ) {
        database.insert(UsageDataTable) {
            set(it.userId, userId)
            set(it.packageId, package_.id)
            set(it.billingCycleStart, billingCycleStart)
            set(it.billingCycleEnd, billingCycleEnd)
            set(it.dataUsed, dataUsed)
            set(it.dataTotal, dataTotal)
            set(it.callMinutesUsed, callMinutesUsed)
            set(it.callMinutesTotal, callMinutesTotal)
            set(it.smsUsed, smsUsed)
            set(it.smsTotal, smsTotal)
            set(it.downloadSpeed, downloadSpeed)
            set(it.uploadSpeed, uploadSpeed)
            set(it.devices, devices)
        }
    }

    /**
     * Delete a package from usage data
     */
    fun deletePackage(userId: String, packageId: String): Boolean {
        val deletedRows = database.delete(UsageDataTable) {
            (it.userId eq userId) and (it.packageId eq packageId)
        }

        return deletedRows > 0
    }
}
