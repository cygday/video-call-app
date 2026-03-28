pipeline {
    agent any

    environment {
        IMAGE_NAME = "video-call-app"
        DOCKERHUB_CREDENTIALS = "dockerhub-creds"
    }
    
    tools {
       // This 'docker' matches the Name you gave in step 2.4
            dockerTool 'docker'
        }


    stages {
       


        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Tag Image') {
            steps {
                sh 'docker tag $IMAGE_NAME your-dockerhub/$IMAGE_NAME:latest'
            }
        }

        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS,
                usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh 'docker push your-dockerhub/$IMAGE_NAME:latest'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }
}
