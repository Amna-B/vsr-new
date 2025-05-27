pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'yourdockerhubusername/my-fullstack-app'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/Amna-B/VSR'
            }
        }

        stage('Install & Test') {
            steps {
                dir('client') {
                    sh 'npm install'
                    // sh 'npm test'  # optional frontend tests
                }
                dir('server') {
                    sh 'npm install'
                    // sh 'npm test'  # optional backend tests
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-password', variable: 'DOCKERHUB_PASS')]) {
                    sh '''
                    echo "$DOCKERHUB_PASS" | docker login -u yourdockerhubusername --password-stdin
                    docker push $DOCKER_IMAGE
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-key']) {
                    sh 'ssh -o StrictHostKeyChecking=no ec2-user@your-ec2-ip "docker pull $DOCKER_IMAGE && docker stop app || true && docker rm app || true && docker run -d -p 80:5000 --name app $DOCKER_IMAGE"'
                }
            }
        }
    }
}
