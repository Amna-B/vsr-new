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
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        echo "Connecting to EC2 and deploying..."

                        ssh -o StrictHostKeyChecking=no ubuntu@3.109.213.171 << 'EOF'
                            echo "Pulling latest Docker image..."
                            docker pull amnab078/vsr-app:latest

                            echo "Stopping existing container..."
                            docker stop vsr-app || true
                            docker rm vsr-app || true

                            echo "Running new container..."
                            docker run -d --name vsr-app -p 80:80 amnab078/vsr-app:latest
                        EOF
                    '''
                }
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
