
pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "richerd13"        // Replace with your Docker Hub username
        IMAGE_NAME = "richerd13/mycalculatorapp"
        CONTAINER_NAME = "calculator-app"
        APP_PORT = "3000"
        DOCKER_CREDENTIALS = "dockerhubcredentials"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME} .
                    docker tag ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest
                """
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_CREDENTIALS}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                sh """
                    docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}
                    docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy Latest Image') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true

                    docker pull ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${APP_PORT}:3000 \
                        ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    docker ps
                    sleep 5
                    curl http://localhost:3000 || true
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully!"
            sh 'docker logout'
        }

        failure {
            echo "Pipeline failed."
        }

        always {
            sh 'docker image ls | head'
        }
    }
}
