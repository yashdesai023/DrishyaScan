pipeline {
    agent any
    
    tools {
        jdk 'JDK21'
        maven 'Maven3'
        nodejs 'Node18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Backend Setup') {
            steps {
                dir('drishyascan-backend') {
                    // For now, just check if directory exists
                    sh 'pwd && ls -la'
                    
                    // When you have the pom.xml file
                    // sh 'mvn clean package -DskipTests'
                }
            }
        }
        
        stage('Frontend Setup') {
            steps {
                dir('drishyascan-frontend') {
                    // For now, just check if directory exists
                    sh 'pwd && ls -la'
                    
                    // When you have package.json file
                    // sh 'npm install'
                }
            }
        }
        
        stage('Build Status') {
            steps {
                echo 'Project structure verified successfully!'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
        }
    }
}