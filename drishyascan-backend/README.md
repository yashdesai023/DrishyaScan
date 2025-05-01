# DrishyaScan Backend

Backend service for DrishyaScan - Accessibility Analyzer, providing APIs for accessibility scanning, analysis, and reporting.

## Technology Stack

- **Java**: 21
- **Framework**: Spring Boot 3.2.x
- **Build Tool**: Maven
- **Database**: MySQL/PostgreSQL
- **API Documentation**: OpenAPI (Swagger)
- **Authentication**: JWT-based
- **CI/CD**: Jenkins

## Prerequisites

- JDK 21
- Maven 3.8+
- MySQL 8.0+ or PostgreSQL 14+
- Git

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-organization/drishyascan-backend.git
cd drishyascan-backend
```

### Configure Database

1. Create a MySQL/PostgreSQL database named `drishyascan`.
2. Update the database connection settings in `src/main/resources/application-dev.properties`.

### Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or run with specific profile
mvn spring-boot:run -Dspring.profiles.active=dev
```

The application will be available at `http://localhost:8080/api`

## API Documentation

Once the application is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- OpenAPI Spec: `http://localhost:8080/api/api-docs`

## Project Structure

```
drishyascan-backend/
├── src/main/java/com/drishyascan/
│   ├── config/         # Application configuration
│   ├── controller/     # REST API controllers
│   ├── dto/            # Data Transfer Objects
│   ├── exception/      # Custom exceptions and handlers
│   ├── model/          # Entity models
│   ├── repository/     # Data access layer
│   ├── security/       # Authentication and authorization
│   ├── service/        # Business logic
│   └── util/           # Utility classes and helpers
├── src/main/resources/
│   ├── application.properties          # Common properties
│   ├── application-dev.properties      # Development properties
│   └── application-prod.properties     # Production properties
├── pom.xml             # Maven build file
└── README.md           # This file
```

## Development Guidelines

- Always use appropriate packages for new classes
- Write unit tests for all new functionality
- Follow Java code conventions and naming standards
- Use Lombok to reduce boilerplate code
- Use DTOs for controller input/output
- Document public APIs with OpenAPI annotations

## Security

- API endpoints are secured using JWT authentication
- Configure proper CORS settings for frontend integration
- In production, ensure sensitive data is stored securely

## Deployment

### Development Environment
- Using Spring Boot embedded server
- Uses H2 or local database instance

### Production Environment
- Configure using environment variables
- Set `spring.profiles.active=prod`
- Use proper database credentials for production

## Contributing

1. Create feature branch from `develop`
2. Implement changes with tests
3. Ensure CI/CD pipeline passes
4. Submit pull request for review

## License

[Specify your license](https://choosealicense.com/)