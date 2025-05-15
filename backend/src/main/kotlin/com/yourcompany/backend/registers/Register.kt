package com.yourcompany.backend.registers

sealed interface Register<T> {
    val registeredObjects: List<T>
}

