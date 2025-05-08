pipeline {
    agent any
    
    tools {
        jdk 'JDK21'
        maven 'Maven3'
        nodejs 'Node18'
    }

    environment {
        DOCKER_IMAGE = 'drishyascan'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_REGISTRY = 'your-registry.com'  // Replace with your Docker registry
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('drishyascan-backend') {
                            sh './mvnw dependency:resolve'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('drishyascan-frontend/drishyascan-frontend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('drishyascan-backend') {
                            sh './mvnw clean package -DskipTests'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('drishyascan-frontend/drishyascan-frontend') {
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('drishyascan-backend') {
                            sh './mvnw test'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('drishyascan-frontend/drishyascan-frontend') {
                            sh 'npm test -- --watchAll=false'
                        }
                    }
                }
            }
        }

        stage('Code Quality') {
            parallel {
                stage('Backend Code Quality') {
                    steps {
                        dir('drishyascan-backend') {
                            sh './mvnw sonar:sonar'
                        }
                    }
                }
                stage('Frontend Code Quality') {
                    steps {
                        dir('drishyascan-frontend/drishyascan-frontend') {
                            sh 'npm run lint'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Build backend image
                    docker.build("${DOCKER_IMAGE}-backend:${DOCKER_TAG}", "--build-arg JAR_FILE=target/*.jar ./drishyascan-backend")
                    
                    // Build frontend image
                    docker.build("${DOCKER_IMAGE}-frontend:${DOCKER_TAG}", "./drishyascan-frontend/drishyascan-frontend")
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    // Push backend image
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-credentials') {
                        docker.image("${DOCKER_IMAGE}-backend:${DOCKER_TAG}").push()
                    }
                    
                    // Push frontend image
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-credentials') {
                        docker.image("${DOCKER_IMAGE}-frontend:${DOCKER_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Deploy to staging/production environment
                    // This will depend on your deployment strategy
                    // Example using kubectl:
                    // sh "kubectl set image deployment/drishyascan-backend backend=${DOCKER_REGISTRY}/${DOCKER_IMAGE}-backend:${DOCKER_TAG}"
                    // sh "kubectl set image deployment/drishyascan-frontend frontend=${DOCKER_REGISTRY}/${DOCKER_IMAGE}-frontend:${DOCKER_TAG}"
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        success {
            echo 'Pipeline executed successfully!'
            // Add notifications (e.g., Slack, email)
            // slackSend channel: '#deployments', color: 'good', message: "Pipeline succeeded: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
            // Add notifications (e.g., Slack, email)
            // slackSend channel: '#deployments', color: 'danger', message: "Pipeline failed: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
    }
}