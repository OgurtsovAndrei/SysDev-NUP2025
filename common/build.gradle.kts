plugins {
    kotlin("jvm")
    // Можно добавить serialization сразу, даже если пока не используется
    kotlin("plugin.serialization") version "1.9.23" // Убедитесь, что версия совпадает
}

// Зависимость для поддержки сериализации (понадобится позже)
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")
}