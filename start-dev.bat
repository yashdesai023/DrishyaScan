@echo off 
start cmd /k "cd drishyascan-backend && .\mvnw spring-boot:run" 
start cmd /k "cd drishyascan-frontend\drishyascan-frontend && npm start" 
