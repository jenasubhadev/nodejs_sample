pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'your-docker-image:tag'
        KUBE_NAMESPACE = 'your-kubernetes-namespace'
        KUBE_DEPLOYMENT = 'your-deployment-name'
        KUBE_DEPLOYMENT_YAML = 'deployment.yaml'  
    }
    
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your/repository.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Push to Registry') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                }
                sh "docker push $DOCKER_IMAGE"
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    def deployCommand = "kubectl apply -f $KUBE_DEPLOYMENT_YAML --namespace=$KUBE_NAMESPACE"
                    sh deployCommand
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
        always {
            cleanWs()
        }
    }
}
