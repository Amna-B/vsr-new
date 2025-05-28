pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'amnab078/vsr-app'
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/Amna-B/vsr-new.git', branch: 'master'
            }
        }

        stage('Install & Test') {
            steps {
                dir('client') {
                    bat '''
                    echo Installing dependencies...
                    npm install
                    
                    echo Running tests...
                    npm test
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '''
                echo Building Docker image...
                docker build -t %DOCKER_IMAGE%:%DOCKER_TAG% .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat '''
                    echo Logging into Docker Hub...
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    
                    echo Pushing image to Docker Hub...
                    docker push %DOCKER_IMAGE%:%DOCKER_TAG%
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                bat '''
                echo Deploy stage - add your EC2 SSH and deployment script here
                '''
            }
        }
    }

    post {
        failure {
            echo 'Build failed!'
        }
        success {
            echo 'Build succeeded!'
        }
    }
}
