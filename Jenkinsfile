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
                    // Use bat instead of sh for Windows
                    bat 'dir'
                    // When you have the pom.xml file
                    // bat 'mvn clean package -DskipTests'
                }
            }
        }
        stage('Frontend Setup') {
            steps {
                dir('drishyascan-frontend') {
                    // Use bat instead of sh for Windows
                    bat 'dir'
                    // When you have package.json file
                    // bat 'npm install'
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