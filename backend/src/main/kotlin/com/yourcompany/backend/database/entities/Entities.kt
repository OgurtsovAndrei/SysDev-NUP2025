package com.yourcompany.backend.database.entities

import org.ktorm.entity.Entity
import org.ktorm.schema.*
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate

// Entity interfaces

interface Address : Entity<Address> {
    companion object : Entity.Factory<Address>()

    val id: Int
    var street: String
    var city: String
    var state: String
    var zipCode: String
    var country: String
}

interface User : Entity<User> {
    companion object : Entity.Factory<User>()

    val id: String
    var name: String
    var email: String
    var password: String
    var phone: String
    var accountNumber: String
    var accountType: String
    var registrationDate: LocalDate
    var paymentMethod: String
    var billingAddress: Address
}

interface Package : Entity<Package> {
    companion object : Entity.Factory<Package>()

    val id: String
    var type: String
    var name: String
    var plan: String?
    var speed: String?
    var router: String?
    var createdAt: Instant
    var addOns: List<String>
    var users: List<User>
}

interface PromoCode : Entity<PromoCode> {
    companion object : Entity.Factory<PromoCode>()

    val code: String
    var discount: BigDecimal
    var description: String
}

interface UsageData : Entity<UsageData> {
    companion object : Entity.Factory<UsageData>()

    val id: Int
    var user: User
    var package_: Package
    var billingCycleStart: LocalDate
    var billingCycleEnd: LocalDate
    var dataUsed: BigDecimal?
    var dataTotal: BigDecimal?
    var callMinutesUsed: Int?
    var callMinutesTotal: String?
    var smsUsed: Int?
    var smsTotal: String?
    var downloadSpeed: String?
    var uploadSpeed: String?
    var devices: Int?
}

interface SupportTicket : Entity<SupportTicket> {
    companion object : Entity.Factory<SupportTicket>()

    val id: String
    var user: User
    var subject: String
    var status: String
    var createdDate: LocalDate
    var lastUpdated: LocalDate
    var priority: String
    var resolution: String?
}

interface Notification : Entity<Notification> {
    companion object : Entity.Factory<Notification>()

    val id: String
    var user: User
    var type: String
    var message: String
    var date: LocalDate
    var read: Boolean
}

interface Feedback : Entity<Feedback> {
    companion object : Entity.Factory<Feedback>()

    val id: String
    var rating: Int
    var topic: String
    var text: String
    var timestamp: Instant
    var userName: String
}

interface ChatMessage : Entity<ChatMessage> {
    companion object : Entity.Factory<ChatMessage>()

    val id: Int
    var user: User
    var message: String
    var timestamp: Instant
    var isFromUser: Boolean
}

interface UserPackage : Entity<UserPackage> {
    companion object : Entity.Factory<UserPackage>()

    var user: User
    var package_: Package
}

interface PackageAddOn : Entity<PackageAddOn> {
    companion object : Entity.Factory<PackageAddOn>()

    var package_: Package
    var addOn: String
}

interface PackageType : Entity<PackageType> {
    companion object : Entity.Factory<PackageType>()

    val id: String
    var name: String
}

interface PackageOption : Entity<PackageOption> {
    companion object : Entity.Factory<PackageOption>()

    val id: Int
    var packageType: PackageType
    var optionType: String
    var optionId: String
    var name: String
    var price: BigDecimal
}

// Table schemas

object Addresses : Table<Address>("addresses") {
    val id = int("id").primaryKey().bindTo { it.id }
    val street = varchar("street").bindTo { it.street }
    val city = varchar("city").bindTo { it.city }
    val state = varchar("state").bindTo { it.state }
    val zipCode = varchar("zip_code").bindTo { it.zipCode }
    val country = varchar("country").bindTo { it.country }
}

object Users : Table<User>("users") {
    val id = varchar("id").primaryKey().bindTo { it.id }
    val name = varchar("name").bindTo { it.name }
    val email = varchar("email").bindTo { it.email }
    val password = varchar("password").bindTo { it.password }
    val phone = varchar("phone").bindTo { it.phone }
    val accountNumber = varchar("account_number").bindTo { it.accountNumber }
    val accountType = varchar("account_type").bindTo { it.accountType }
    val registrationDate = date("registration_date").bindTo { it.registrationDate }
    val paymentMethod = varchar("payment_method").bindTo { it.paymentMethod }
    val billingAddressId = int("billing_address_id").references(Addresses) { it.billingAddress }
}

object Packages : Table<Package>("packages") {
    val id = varchar("id").primaryKey().bindTo { it.id }
    val type = varchar("type").bindTo { it.type }
    val name = varchar("name").bindTo { it.name }
    val plan = varchar("plan").bindTo { it.plan }
    val speed = varchar("speed").bindTo { it.speed }
    val router = varchar("router").bindTo { it.router }
    val createdAt = timestamp("created_at").bindTo { it.createdAt }
}

object UserPackages : Table<UserPackage>("user_packages") {
    val userId = varchar("user_id").references(Users) { it.user }
    val packageId = varchar("package_id").references(Packages) { it.package_ }
}

object PackageAddOns : Table<PackageAddOn>("package_add_ons") {
    val packageId = varchar("package_id").references(Packages) { it.package_ }
    val addOn = varchar("add_on").bindTo { it.addOn }
}

object PromoCodes : Table<PromoCode>("promo_codes") {
    val code = varchar("code").primaryKey().bindTo { it.code }
    val discount = decimal("discount").bindTo { it.discount }
    val description = text("description").bindTo { it.description }
}

object UsageDataTable : Table<UsageData>("usage_data") {
    val id = int("id").primaryKey().bindTo { it.id }
    val userId = varchar("user_id").references(Users) { it.user }
    val packageId = varchar("package_id").references(Packages) { it.package_ }
    val billingCycleStart = date("billing_cycle_start").bindTo { it.billingCycleStart }
    val billingCycleEnd = date("billing_cycle_end").bindTo { it.billingCycleEnd }
    val dataUsed = decimal("data_used").bindTo { it.dataUsed }
    val dataTotal = decimal("data_total").bindTo { it.dataTotal }
    val callMinutesUsed = int("call_minutes_used").bindTo { it.callMinutesUsed }
    val callMinutesTotal = varchar("call_minutes_total").bindTo { it.callMinutesTotal }
    val smsUsed = int("sms_used").bindTo { it.smsUsed }
    val smsTotal = varchar("sms_total").bindTo { it.smsTotal }
    val downloadSpeed = varchar("download_speed").bindTo { it.downloadSpeed }
    val uploadSpeed = varchar("upload_speed").bindTo { it.uploadSpeed }
    val devices = int("devices").bindTo { it.devices }
}

object SupportTickets : Table<SupportTicket>("support_tickets") {
    val id = varchar("id").primaryKey().bindTo { it.id }
    val userId = varchar("user_id").references(Users) { it.user }
    val subject = varchar("subject").bindTo { it.subject }
    val status = varchar("status").bindTo { it.status }
    val createdDate = date("created_date").bindTo { it.createdDate }
    val lastUpdated = date("last_updated").bindTo { it.lastUpdated }
    val priority = varchar("priority").bindTo { it.priority }
    val resolution = text("resolution").bindTo { it.resolution }
}

object Notifications : Table<Notification>("notifications") {
    val id = varchar("id").primaryKey().bindTo { it.id }
    val userId = varchar("user_id").references(Users) { it.user }
    val type = varchar("type").bindTo { it.type }
    val message = text("message").bindTo { it.message }
    val date = date("date").bindTo { it.date }
    val read = boolean("read").bindTo { it.read }
}

object Feedbacks : Table<Feedback>("feedback") {
    val id = varchar("id").primaryKey().bindTo { it.id }
    val rating = int("rating").bindTo { it.rating }
    val topic = varchar("topic").bindTo { it.topic }
    val text = text("text").bindTo { it.text }
    val timestamp = timestamp("timestamp").bindTo { it.timestamp }
    val userName = varchar("user_name").bindTo { it.userName }
}

object PackageTypes : Table<PackageType>("package_types") {
    val id = varchar("id").primaryKey().bindTo { it.id }
    val name = varchar("name").bindTo { it.name }
}

object PackageOptions : Table<PackageOption>("package_options") {
    val id = int("id").primaryKey().bindTo { it.id }
    val packageTypeId = varchar("package_type_id").references(PackageTypes) { it.packageType }
    val optionType = varchar("option_type").bindTo { it.optionType }
    val optionId = varchar("option_id").bindTo { it.optionId }
    val name = varchar("name").bindTo { it.name }
    val price = decimal("price").bindTo { it.price }
}

object ChatMessages : Table<ChatMessage>("chat_messages") {
    val id = int("id").primaryKey().bindTo { it.id }
    val userId = varchar("user_id").references(Users) { it.user }
    val message = text("message").bindTo { it.message }
    val timestamp = timestamp("timestamp").bindTo { it.timestamp }
    val isFromUser = boolean("is_from_user").bindTo { it.isFromUser }
}
