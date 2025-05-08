# DrishyaScan - Web Accessibility Scanner

DrishyaScan is a comprehensive web accessibility scanning tool that helps organizations ensure their websites are accessible to all users, including those with disabilities. The platform provides detailed reports, compliance checks, and actionable recommendations to improve website accessibility.

## 🌟 Features

- **Automated Accessibility Scanning**: Scan websites for WCAG 2.1 compliance
- **Detailed Reports**: Get comprehensive reports with actionable insights
- **Real-time Monitoring**: Track accessibility improvements over time
- **Customizable Scans**: Configure scan depth and specific requirements
- **Multi-project Support**: Manage multiple websites and projects
- **User Management**: Role-based access control for team collaboration
- **API Integration**: RESTful API for integration with existing tools

## 🏗️ Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI for component library
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication
- Context API for state management

### Backend
- Spring Boot 3.x
- Java 17
- PostgreSQL for database
- JWT for authentication
- Lombok for reducing boilerplate
- Maven for dependency management

### DevOps
- Docker for containerization
- Jenkins for CI/CD
- SonarQube for code quality
- JUnit for testing

## 📋 Prerequisites

- Node.js 16.x or higher
- Java 17 or higher
- PostgreSQL 13.x or higher
- Maven 3.8.x or higher
- Docker (optional)

## 🚀 Getting Started

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/drishyascan.git
cd drishyascan/drishyascan-backend
```

2. Configure the database:
```bash
# Create a PostgreSQL database
createdb drishyascan

# Update application.properties with your database credentials
```

3. Build and run the backend:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../drishyascan-frontend/drishyascan-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 📚 Documentation

- [API Documentation](docs/api/README.md)
- [User Guide](docs/user-guide/README.md)
- [Developer Guide](docs/developer-guide/README.md)
- [Architecture Overview](docs/architecture/README.md)

## 🧪 Testing

### Backend Tests
```bash
cd drishyascan-backend
mvn test
```

### Frontend Tests
```bash
cd drishyascan-frontend/drishyascan-frontend
npm test
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```properties
DB_HOST=localhost
DB_PORT=5432
DB_NAME=drishyascan
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

#### Frontend (.env)
```properties
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_ENV=development
```

## 📦 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
1. Build the frontend:
```bash
cd drishyascan-frontend/drishyascan-frontend
npm run build
```

2. Build the backend:
```bash
cd drishyascan-backend
mvn clean package
```

3. Deploy the JAR file and frontend build to your server

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

### Project Lead
- **Name**: [Your Name]
- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile]

### Core Developers
- **Name**: [Developer Name]
- **Email**: developer.email@example.com
- **LinkedIn**: [Developer LinkedIn Profile]

## 📞 Support

For support, please email support@drishyascan.com or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- WCAG 2.1 Guidelines
- Spring Boot Team
- React Team
- Material-UI Team
- All contributors and supporters

## 📝 Project Documentation

For detailed project documentation, please refer to:
- [Project Overview](docs/project-overview.md)
- [Technical Architecture](docs/technical-architecture.md)
- [API Documentation](docs/api-documentation.md)
- [User Manual](docs/user-manual.md)
- [Development Guide](docs/development-guide.md)

---

Made with ❤️ by the DrishyaScan Team