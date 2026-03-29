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
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh 'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"'
                    sh 'chmod +x ./kubectl'
                    // This handles authentication using the Secret File 'k8s-config'
                    withKubeConfig([credentialsId: 'k8s-config']) {
                        sh 'export KUBECONFIG=$KUBECONFIG; kubectl cluster-info' 
                        sh 'kubectl apply -f k8s/'
                    }
                }
            }
        }
    } // End of stages
}
