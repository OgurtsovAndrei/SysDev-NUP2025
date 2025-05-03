plugins {
    // Применяем apply false, чтобы настроить версии централизованно
    kotlin("jvm") version "1.9.23" apply false
    kotlin("plugin.serialization") version "1.9.23" apply false
    id("io.ktor.plugin") version "2.3.10" apply false // Используйте актуальную версию Ktor
}

allprojects {
    repositories {
        mavenCentral()
    }
}