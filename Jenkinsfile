pipeline {
    agent any

    environment {
        IMAGE_NAME = "video-call-app"
        DOCKERHUB_CREDENTIALS = "dockerhub-creds"
    }
    
    tools {
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
                sh 'docker tag $IMAGE_NAME cygday/$IMAGE_NAME:latest'
            }
        }

        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', 
                         usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh "docker login -u ${USER} -p ${PASS}"
                    sh "docker push cygday/video-call-app:latest"
                }
            } // Close steps
        } // Close stage

        stage('Deploy to Kubernetes') {
            steps {
                // This requires the 'Kubernetes CLI' plugin to be installed
                withKubeConfig([credentialsId: 'k8s-config']) {
                    sh 'kubectl apply -f k8s/'
                }
            } // Close steps
        } // Close stage
    } // Close stages
}
