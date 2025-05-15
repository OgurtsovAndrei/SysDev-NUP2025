package com.yourcompany.backend.database.repositories

import com.yourcompany.backend.database.DatabaseFactory
import com.yourcompany.backend.database.entities.*
import com.yourcompany.backend.database.repositories.base.Repository
import com.yourcompany.backend.models.Address as AddressModel
import com.yourcompany.backend.models.UserPackage
import org.ktorm.dsl.*
import org.ktorm.entity.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter

/**
 * Repository for user-related database operations
 */
class UserRepository : Repository {
    override val database = DatabaseFactory.getInstance()
    private val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")

    /**
     * Find a user by ID
     */
    fun findUserById(id: String): User? {
        return database.sequenceOf(Users).firstOrNull { it.id eq id }
    }

    /**
     * Find a user by email
     */
    fun findUserByEmail(email: String): User? {
        return database.sequenceOf(Users).firstOrNull { it.email eq email }
    }

    /**
     * Create a new user
     */
    fun createUser(
        id: String,
        name: String,
        email: String,
        password: String,
        phone: String,
        accountNumber: String,
        accountType: String,
        registrationDate: String,
        paymentMethod: String,
        billingAddress: AddressModel
    ): User? {
        var addressId: Int? = null
        database.useTransaction { _ ->
            addressId = database.insertAndGenerateKey(Addresses) {
                set(it.street, billingAddress.street)
                set(it.city, billingAddress.city)
                set(it.state, billingAddress.state)
                set(it.zipCode, billingAddress.zipCode)
                set(it.country, billingAddress.country)
            } as Int

            database.insert(Users) {
                set(it.id, id)
                set(it.name, name)
                set(it.email, email)
                set(it.password, password)
                set(it.phone, phone)
                set(it.accountNumber, accountNumber)
                set(it.accountType, accountType)
                set(it.registrationDate, LocalDate.parse(registrationDate, formatter))
                set(it.paymentMethod, paymentMethod)
                set(it.billingAddressId, addressId)
            }
        }

        return findUserById(id)
    }

    /**
     * Update a user
     */
    fun updateUser(
        id: String,
        email: String? = null,
        paymentMethod: String? = null,
        billingAddress: AddressModel? = null
    ): Boolean {
        val user = findUserById(id) ?: return false
        var result = false
        database.useTransaction { _ ->
            if (email != null) {
                user.email = email
            }
            if (paymentMethod != null) {
                user.paymentMethod = paymentMethod
            }
            if (billingAddress != null) {
                val address = user.billingAddress
                address.street = billingAddress.street
                address.city = billingAddress.city
                address.state = billingAddress.state
                address.zipCode = billingAddress.zipCode
                address.country = billingAddress.country
                address.flushChanges()
            }

            result = user.flushChanges() > 0
        }

        return result
    }

    /**
     * Get packages for a user
     */
    fun getUserPackages(userId: String): List<Package> {
        return database
            .from(UserPackages)
            .innerJoin(Packages, on = UserPackages.packageId eq Packages.id)
            .select()
            .where { UserPackages.userId eq userId }
            .map { row ->
                val packageId = row[Packages.id]!!
                val package_ = database.sequenceOf(Packages).first { it.id eq packageId }
                val addOns = database
                    .from(PackageAddOns)
                    .select(PackageAddOns.addOn)
                    .where { PackageAddOns.packageId eq packageId }
                    .map { it[PackageAddOns.addOn]!! }
                    .toList()
                package_.addOns = addOns
                package_
            }
    }

    /**
     * Convert database User entity to model
     */
    fun toModel(user: User): com.yourcompany.backend.models.User {
        val packages = getUserPackages(user.id).map { package_ ->
            UserPackage(
                id = package_.id,
                type = package_.type,
                name = package_.name,
                plan = package_.plan,
                speed = package_.speed,
                router = package_.router,
                addOns = package_.addOns
            )
        }

        return com.yourcompany.backend.models.User(
            id = user.id,
            name = user.name,
            email = user.email,
            password = user.password,
            phone = user.phone,
            accountNumber = user.accountNumber,
            accountType = user.accountType,
            registrationDate = user.registrationDate.toString(),
            packages = packages,
            paymentMethod = user.paymentMethod,
            billingAddress = AddressModel(
                street = user.billingAddress.street,
                city = user.billingAddress.city,
                state = user.billingAddress.state,
                zipCode = user.billingAddress.zipCode,
                country = user.billingAddress.country
            )
        )
    }

    /**
     * Initialize the database with mock data
     */
    override fun initializeMockData() {
        val existingUser = findUserById("USR12345")
        if (existingUser != null) {
            return
        }

        database.useTransaction { _ ->
            val user = createUser(
                id = "USR12345",
                name = "John Doe",
                email = "john.doe@example.com",
                password = "password123", // Mock password
                phone = "+1 (555) 123-4567",
                accountNumber = "ACC987654321",
                accountType = "Premium",
                registrationDate = "2023-05-15",
                paymentMethod = "**** **** **** 1234",
                billingAddress = AddressModel(
                    street = "123 Main Street",
                    city = "Anytown",
                    state = "CA",
                    zipCode = "90210",
                    country = "USA"
                )
            )
            val package1Id = "PKG002"
            val package2Id = "PKG005"

            database.insert(Packages) {
                set(it.id, package1Id)
                set(it.type, "mobile_combo")
                set(it.name, "Standard Mobile Plan")
                set(it.plan, "standard")
            }

            database.insert(Packages) {
                set(it.id, package2Id)
                set(it.type, "home_internet")
                set(it.name, "Home Internet")
                set(it.speed, "standard")
                set(it.router, "premium")
            }

            database.insert(UserPackages) {
                set(it.userId, "USR12345")
                set(it.packageId, package1Id)
            }

            database.insert(UserPackages) {
                set(it.userId, "USR12345")
                set(it.packageId, package2Id)
            }

            database.insert(PackageAddOns) {
                set(it.packageId, package1Id)
                set(it.addOn, "landline")
            }

            database.insert(PackageAddOns) {
                set(it.packageId, package1Id)
                set(it.addOn, "international")
            }

            database.insert(PackageAddOns) {
                set(it.packageId, package2Id)
                set(it.addOn, "static_ip")
            }

            database.insert(PackageAddOns) {
                set(it.packageId, package2Id)
                set(it.addOn, "premium_support")
            }
        }
    }
}
