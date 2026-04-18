pipeline {
    agent any

    stages {
        stage('Fetch Code') {
            steps {
                git branch: 'main', url: 'https://github.com/wittyvishnu/URL-Status-Checker.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm run test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t url-status-checker:${BUILD_NUMBER} .'
                echo 'Docker image built successfully'
            }
        }

                stage('Login to ECR') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                    export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                    export AWS_DEFAULT_REGION=us-east-1
                    
                    # Run login as a single line to avoid pipe errors
                    /usr/local/bin/aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 928331459079.dkr.ecr.us-east-1.amazonaws.com
                    '''
                }
            }
        }


        stage('Push to ECR') {
            steps {
                sh '''
                # Tag with build number
                docker tag url-status-checker:${BUILD_NUMBER} \
                928331459079.dkr.ecr.us-east-1.amazonaws.com/url-status-checker:${BUILD_NUMBER}
                # Push both
                docker push 928331459079.dkr.ecr.us-east-1.amazonaws.com/url-status-checker:${BUILD_NUMBER}
                '''
            }
        }
       stage('Deploy to Kubernetes') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'kops-ssh-key', keyFileVariable: 'KEY_FILE')]) {
                    sh '''
                    chmod 400 $KEY_FILE
        
                    ssh -o StrictHostKeyChecking=no -i $KEY_FILE ubuntu@35.172.180.164 << EOF
        
                    echo "Connected to EC2"
                    whoami
        
                    cd /home/ubuntu/k8s-manifests
        
                    echo "Updating image..."
                    kubectl set image deployment/url-status-checker \
                    url-checker=928331459079.dkr.ecr.us-east-1.amazonaws.com/url-status-checker:${BUILD_NUMBER}
        
                    echo "Waiting for rollout..."
                    kubectl rollout status deployment/url-status-checker
        
                    echo "Pods status:"
                    kubectl get pods
        
                    EOF
                    '''
                }
            }
        }
        stage('Cleanup Images') {
            steps {
                sh '''
                docker rmi url-status-checker:${BUILD_NUMBER} || true
                docker rmi 928331459079.dkr.ecr.us-east-1.amazonaws.com/url-status-checker:${BUILD_NUMBER} || true
                '''
            }
        }
    } // End of stages
} // End of pipeline
