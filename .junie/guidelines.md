# Telecom Project Development Guidelines

This document provides essential information for developers working on the Telecom Project.

## Build/Configuration Instructions

### Project Structure
The project is organized as a multi-module Gradle project:
- **backend**: Ktor server application that handles API requests and serves static content
- **frontend**: Contains static web resources (HTML, CSS, JS)
- **common**: Shared code and data models used by both frontend and backend

### Prerequisites
- JDK 11 or newer
- Gradle 7.6 or newer (or use the included Gradle wrapper)

### Building the Project
To build the entire project:
```bash
./gradlew build
```

To build a specific module:
```bash
./gradlew :backend:build
```

### Running the Application
To run the backend server:
```bash
./gradlew :backend:run
```

The application will be available at http://localhost:8081

### Database Configuration
The project is configured to use PostgreSQL, but the database integration is not yet implemented. When implementing:

1. Configure database connection in `backend/src/main/resources/application.conf`:
```hocon
database {
    url = "jdbc:postgresql://localhost:5432/telecom_db"
    user = "postgres"
    password = "your_password"
}
```

2. Initialize the database connection in the Application.kt file using Exposed ORM.

## Testing Information

### Test Structure
- Tests are located in the `src/test/kotlin` directory of each module
- The project uses JUnit 5 with Kotlin Test for unit testing
- Ktor's test framework is used for testing HTTP endpoints

### Running Tests
To run all tests:
```bash
./gradlew test
```

To run tests for a specific module:
```bash
./gradlew :backend:test
```

To run a specific test class:
```bash
./gradlew :backend:test --tests "com.yourcompany.backend.ApplicationTest"
```

### Adding New Tests
1. Create test classes in the appropriate module's `src/test/kotlin` directory
2. For API tests, use the `testApplication` function from Ktor's testing framework
3. For unit tests, use standard JUnit 5 annotations (@Test, @BeforeEach, etc.)

### Example Test
Here's a simple example of a Ktor endpoint test:

```kotlin
@Test
fun testSimpleEndpoint() = testApplication {
    // Configure a simple test application
    application {
        routing {
            get("/test") {
                call.respond(TestResponse("Test response"))
            }
        }
    }
    
    // Act
    val response = client.get("/test")
    
    // Assert
    assertEquals(HttpStatusCode.OK, response.status)
    val responseText = response.bodyAsText()
    assert(responseText.contains("Test response"))
}
```

## Additional Development Information

### Code Style
- Follow Kotlin coding conventions
- Use meaningful names for classes, methods, and variables
- Document public APIs with KDoc comments
- Keep functions small and focused on a single responsibility

### Project Architecture
- The application follows a modular architecture with clear separation of concerns
- Backend uses Ktor for the web framework
- Frontend is currently simple static HTML/JS
- Data models should be defined in the common module for sharing between frontend and backend

### Adding New Features
1. Define data models in the common module
2. Implement backend logic in the backend module
3. Create API endpoints in the backend module
4. Implement frontend UI in the frontend module

### Debugging
- Ktor logs are available in the console when running the application
- Add debug logging with `application.log.debug("message")`
- For frontend debugging, use browser developer tools

### Deployment
For production deployment:
1. Build the application with `./gradlew :backend:shadowJar`
2. The resulting JAR in `backend/build/libs/backend-all.jar` contains the entire application
3. Run with `java -jar backend-all.jar`