plugins {
    kotlin("jvm") version "1.9.23" // Убедитесь, что версия совпадает
    id("io.ktor.plugin") version "2.3.10" // Убедитесь, что версия совпадает
    kotlin("plugin.serialization") version "1.9.23" // Убедитесь, что версия совпадает
}

tasks.test {
    useJUnitPlatform()
}

application {
    mainClass.set("com.yourcompany.backend.ApplicationKt") // Путь к файлу с main функцией
}

dependencies {
    implementation(project(":common")) // Зависимость от общего модуля
    // Важно: Включаем ресурсы из frontend модуля в runtime classpath бэкенда
    runtimeOnly(project(":frontend"))

    // Ktor Core & Engine
    implementation("io.ktor:ktor-server-core-jvm")
    implementation("io.ktor:ktor-server-netty-jvm")

    // Ktor для статических файлов и Content Negotiation
    implementation("io.ktor:ktor-server-host-common-jvm") // Для staticResources
    implementation("io.ktor:ktor-server-content-negotiation-jvm")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm")

    // Exposed ORM (добавляем зависимости, но пока не используем)
    implementation("org.jetbrains.exposed:exposed-core:0.49.0")
    implementation("org.jetbrains.exposed:exposed-dao:0.49.0")
    implementation("org.jetbrains.exposed:exposed-jdbc:0.49.0")
    implementation("org.jetbrains.exposed:exposed-java-time:0.49.0") // Для дат

    // PostgreSQL Driver (добавляем зависимость, но пока не используем)
    implementation("org.postgresql:postgresql:42.7.3")

    // Logging
    implementation("ch.qos.logback:logback-classic:1.4.14")

    // Testing
    testImplementation("io.ktor:ktor-server-test-host:2.3.10")
    testImplementation("org.jetbrains.kotlin:kotlin-test:1.9.23")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.10.2")
}
