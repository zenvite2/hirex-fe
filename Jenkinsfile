pipeline {
    agent any

    environment {
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Build and deploy') {
            steps {
                echo "Building Docker images for hirex-fe services..."
                sh "docker compose down && docker compose -f ./docker-compose.yml up --build -d --remove-orphans"
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