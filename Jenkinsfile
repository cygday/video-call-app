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
                sh 'docker tag $IMAGE_NAME cygday/$IMAGE_NAME:latest'
            }
        }


        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', 
                         usernameVariable: 'USER', passwordVariable: 'PASS')]) {
            
            // Using the older -p flag because your Docker version is outdated
            sh "docker login -u ${USER} -p ${PASS}"
            sh "docker push cygday/video-call-app:latest"
        }
    }
}


        stage('Deploy to Kubernetes') {
            steps {
        // withKubeConfig handles the setup and cleanup of the config file
                withKubeConfig([credentialsId: 'k8s-config']) {
            sh 'kubectl apply -f k8s/'
        }
    }
}

}
