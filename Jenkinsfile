pipeline {
    agent any

    environment {
        HIREX_VPS = "${env.HIREX_VPS}"
        HIREX_VPS_USER = "${env.HIREX_VPS_USER}"
        HIREX_VPS_PW = "${env.HIREX_VPS_PW}"
        DOCKER_USER = "${env.DOCKER_USER}"
        DOCKER_PW = "${env.DOCKER_PW}"
        DOCKER_REPO = "${env.DOCKER_REPO}"
    }

    stages {
        stage('Build images') {
            steps {
                echo "Building Docker images for fe service...."
                sh "docker build -t fe:latest ."
            }
        }

        stage('Push images') {
            steps {
                script {
                    echo "Tagging and pushing Docker images to the registry...."

                    sh '''\
                        docker tag fe:latest $DOCKER_REPO/fe:latest
                        docker push $DOCKER_REPO/fe:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "Deploying Docker containers to prod server..."
                    sh '''
                        sshpass -p "$HIREX_VPS_PW" ssh -o StrictHostKeyChecking=no "$HIREX_VPS_USER@$HIREX_VPS" bash << 'EOF'
                            docker compose down && \
                            docker compose -f /root/hirex/deploy/docker-compose-fe.yml pull && \
                            docker compose -f /root/hirex/deploy/docker-compose-fe.yml up -d --remove-orphans
                        << EOF
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Deployment failed."
        }
    }
}
