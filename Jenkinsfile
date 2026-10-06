pipeline {
    agent any

    environment {
        // credential 'docker-hub' (Username with password)
        // → tự sinh 2 biến: DOCKER_HUB_USR và DOCKER_HUB_PSW
        DOCKER_HUB = credentials('docker-hub')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login Docker Hub') {
            steps {
                sh '''
                    set -e
                    echo "$DOCKER_HUB_PSW" | docker login -u "$DOCKER_HUB_USR" --password-stdin
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t "$DOCKER_HUB_USR/my-app-backend:latest" ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t "$DOCKER_HUB_USR/my-app-frontend:latest" ./frontend'
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                    set -e
                    docker push "$DOCKER_HUB_USR/my-app-backend:latest"
                    docker push "$DOCKER_HUB_USR/my-app-frontend:latest"
                '''
            }
        }
    }
}