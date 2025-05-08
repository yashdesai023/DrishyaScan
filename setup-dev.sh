#!/bin/bash

echo "Setting up DrishyaScan Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Java is not installed. Please install Java JDK 17 or later"
    exit 1
fi

# Create necessary directories if they don't exist
mkdir -p drishyascan-frontend/drishyascan-frontend
mkdir -p drishyascan-backend

# Setup Frontend
echo "Setting up Frontend..."
cd drishyascan-frontend/drishyascan-frontend

# Create .env file
cat > .env << EOL
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WS_URL=ws://localhost:8080/ws
EOL

# Install dependencies
echo "Installing Frontend dependencies..."
npm install

# Setup Backend
echo "Setting up Backend..."
cd ../../drishyascan-backend

# Make mvnw executable
chmod +x mvnw

# Build backend
echo "Building Backend..."
./mvnw clean install

# Create start script
echo "Creating start script..."
cd ..
cat > start-dev.sh << 'EOL'
#!/bin/bash

# Start backend
gnome-terminal -- bash -c "cd drishyascan-backend && ./mvnw spring-boot:run; exec bash" &
# For macOS, use:
# osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/drishyascan-backend && ./mvnw spring-boot:run"'

# Start frontend
gnome-terminal -- bash -c "cd drishyascan-frontend/drishyascan-frontend && npm start; exec bash" &
# For macOS, use:
# osascript -e 'tell app "Terminal" to do script "cd '$(pwd)'/drishyascan-frontend/drishyascan-frontend && npm start"'
EOL

# Make start script executable
chmod +x start-dev.sh

echo
echo "Setup completed successfully!"
echo
echo "To start the development environment:"
echo "1. Run ./start-dev.sh"
echo "2. Access the application at http://localhost:3000"
echo
echo "Note: Make sure ports 3000 and 8080 are available" 