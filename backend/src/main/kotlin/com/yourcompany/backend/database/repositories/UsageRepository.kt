package com.yourcompany.backend.database.repositories

import com.yourcompany.backend.database.DatabaseFactory
import com.yourcompany.backend.database.entities.*
import com.yourcompany.backend.models.BillingCycle
import com.yourcompany.backend.models.PackageUsage
import com.yourcompany.backend.models.PreviousBillingCycle
import com.yourcompany.backend.models.PreviousPackageUsage
import com.yourcompany.backend.models.UsageDataResponse
import org.ktorm.dsl.*
import org.ktorm.entity.*
import java.math.BigDecimal
import java.time.LocalDate
import java.time.format.DateTimeFormatter

/**
 * Repository for usage data-related database operations
 */
class UsageRepository {
    private val database = DatabaseFactory.getInstance()
    private val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")

    /**
     * Get usage data for a user
     */
    fun getUserUsageData(userId: String): UsageDataResponse? {
        // Check if user exists
        val user = database.sequenceOf(Users).firstOrNull { it.id eq userId } ?: return null

        // Get all usage data for the user
        val usageDataList = database.sequenceOf(UsageDataTable)
            .filter { it.userId eq userId }
            .sortedByDescending { it.billingCycleEnd }
            .toList()

        if (usageDataList.isEmpty()) {
            return null
        }

        // Group usage data by billing cycle
        val groupedByBillingCycle = usageDataList.groupBy { 
            "${it.billingCycleStart.format(formatter)}_${it.billingCycleEnd.format(formatter)}" 
        }

        // Get current billing cycle (the most recent one)
        val currentBillingCycleKey = groupedByBillingCycle.keys.first()
        val currentBillingCycleData = groupedByBillingCycle[currentBillingCycleKey] ?: return null

        // Create current billing cycle
        val currentBillingCycle = createBillingCycle(currentBillingCycleData)

        // Create previous billing cycles
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
        // All usage data in the list should have the same billing cycle start and end dates
        val startDate = usageDataList.first().billingCycleStart.format(formatter)
        val endDate = usageDataList.first().billingCycleEnd.format(formatter)

        // Group usage data by package
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
        // All usage data in the list should have the same billing cycle start and end dates
        val startDate = usageDataList.first().billingCycleStart
        val endDate = usageDataList.first().billingCycleEnd

        // Format period as "Month Year"
        val period = "${startDate.month.name.lowercase().capitalize()} ${startDate.year}"

        // Group usage data by package
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
    fun initializeMockData() {
        // Check if we already have usage data
        val existingUsageData = database.sequenceOf(UsageDataTable).firstOrNull()
        if (existingUsageData != null) {
            return // Data already initialized
        }

        // Get the user and packages
        val user = database.sequenceOf(Users).firstOrNull { it.id eq "USR12345" } ?: return
        val package1 = database.sequenceOf(Packages).firstOrNull { it.id eq "PKG002" } ?: return
        val package2 = database.sequenceOf(Packages).firstOrNull { it.id eq "PKG005" } ?: return

        // Use a transaction to ensure all operations are committed
        database.useTransaction { transaction ->
            // Current billing cycle (March 2025)
            insertUsageData(
                user = user,
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
                user = user,
                package_ = package2,
                billingCycleStart = LocalDate.of(2025, 3, 1),
                billingCycleEnd = LocalDate.of(2025, 3, 31),
                dataUsed = BigDecimal("250.5"),
                dataTotal = BigDecimal("500.0"),
                downloadSpeed = "100 Mbps",
                uploadSpeed = "20 Mbps",
                devices = 8
            )

            // Previous billing cycle (February 2025)
            insertUsageData(
                user = user,
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
                user = user,
                package_ = package2,
                billingCycleStart = LocalDate.of(2025, 2, 1),
                billingCycleEnd = LocalDate.of(2025, 2, 28),
                dataUsed = BigDecimal("320.7"),
                dataTotal = BigDecimal("500.0")
            )

            // Previous billing cycle (January 2025)
            insertUsageData(
                user = user,
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
                user = user,
                package_ = package2,
                billingCycleStart = LocalDate.of(2025, 1, 1),
                billingCycleEnd = LocalDate.of(2025, 1, 31),
                dataUsed = BigDecimal("280.3"),
                dataTotal = BigDecimal("500.0")
            )
        }
    }

    /**
     * Helper method to insert usage data
     */
    private fun insertUsageData(
        user: User,
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
            set(it.userId, user.id)
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
}