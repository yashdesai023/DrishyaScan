@echo off
echo Setting up DrishyaScan Development Environment...

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    exit /b 1
)

:: Check if Java is installed
where java >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Java is not installed. Please install Java JDK 17 or later
    exit /b 1
)

:: Create necessary directories if they don't exist
if not exist "drishyascan-frontend\drishyascan-frontend" mkdir "drishyascan-frontend\drishyascan-frontend"
if not exist "drishyascan-backend" mkdir "drishyascan-backend"

:: Setup Frontend
echo Setting up Frontend...
cd drishyascan-frontend\drishyascan-frontend

:: Create .env file
echo REACT_APP_API_URL=http://localhost:8081/api > .env
echo REACT_APP_WS_URL=ws://localhost:8081/ws >> .env

:: Install dependencies
echo Installing Frontend dependencies...
call npm install

:: Setup Backend
echo Setting up Backend...
cd ..\..\drishyascan-backend

:: Build backend
echo Building Backend...
call .\mvnw clean install

:: Create start script
echo Creating start script...
cd ..
echo @echo off > start-dev.bat
echo start cmd /k "cd drishyascan-backend && .\mvnw spring-boot:run" >> start-dev.bat
echo start cmd /k "cd drishyascan-frontend\drishyascan-frontend && npm start" >> start-dev.bat

echo.
echo Setup completed successfully!
echo.
echo To start the development environment:
echo 1. Run start-dev.bat
echo 2. Access the application at http://localhost:3000
echo.
echo Note: Make sure ports 3000 and 8080 are available 