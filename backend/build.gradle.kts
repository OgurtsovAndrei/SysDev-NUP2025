plugins {
    // Apply the Kotlin JVM plugin
    kotlin("jvm") version "1.9.23" // Убедитесь, что версия совпадает - Updated to user's version
    // Apply the Ktor plugin
    id("io.ktor.plugin") version "2.3.10" // Убедитесь, что версия совпадает - Updated to user's version
    // Apply the Kotlin serialization plugin for JSON handling
    kotlin("plugin.serialization") version "1.9.23" // Убедитесь, что версия совпадает - Updated to user's version
}

tasks.test {
    useJUnitPlatform()
}

application {
    mainClass.set("com.yourcompany.backend.ApplicationKt") // Путь к файлу с main функцией - Updated to user's path
}

repositories {
    mavenCentral() // Use Maven Central for dependencies
    maven { url = uri("https://maven.pkg.jetbrains.space/public/p/ktor/eap") } // Add Ktor EAP repository if needed for latest features
}

dependencies {
    // Multi-module dependencies (based on user's file - adjust paths as needed)
     implementation(project(":common")) // Dependency on a common module
     runtimeOnly(project(":frontend")) // Runtime dependency on a frontend module

    // Ktor Core & Engine
    implementation("io.ktor:ktor-server-core-jvm")
    implementation("io.ktor:ktor-server-netty-jvm") // Netty engine

    // Ktor for static files and Content Negotiation
    implementation("io.ktor:ktor-server-host-common-jvm") // For staticResources - Added from user's file
    implementation("io.ktor:ktor-server-content-negotiation-jvm") // Content negotiation for JSON
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm") // Kotlinx Serialization (JSON)

    // Ktorm ORM dependencies
    implementation("org.ktorm:ktorm-core:3.6.0")
    implementation("org.ktorm:ktorm-support-postgresql:3.6.0")

    // HikariCP for connection pooling
    implementation("com.zaxxer:HikariCP:5.1.0")

    // PostgreSQL Driver
    implementation("org.postgresql:postgresql:42.7.3")

    // Logging
    implementation("ch.qos.logback:logback-classic:1.4.14") // Updated to user's version

    // Ktor development mode features and testing
    testImplementation("io.ktor:ktor-server-test-host:2.3.10") // Updated to user's version
    testImplementation("org.jetbrains.kotlin:kotlin-test:1.9.23") // Updated to user's version
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2") // Added from user's file
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.10.2") // Added from user's file

    // Ktor Status Pages (Error handling) - Kept from previous version
    implementation("io.ktor:ktor-server-status-pages-jvm")

    // Ktor Call Logging - Kept from previous version
    implementation("io.ktor:ktor-server-call-logging-jvm")

    // Ktor CORS (for frontend communication) - Kept from previous version
    implementation("io.ktor:ktor-server-cors-jvm")

    // Ktor Authentication (if you implement it later) - Kept from previous version
    // implementation("io.ktor:ktor-server-auth-jvm")
    // implementation("io.ktor:ktor-server-auth-jwt-jvm") // For JWT
}
