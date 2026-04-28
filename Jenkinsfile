pipeline {
    agent any

    environment {
        // Your Azure Container Registry URL
        ACR_URL = "ruhunaecommerceacr.azurecr.io"
        // The Global Credential ID created in Jenkins
        AZURE_CRED_ID = "azure-registry-credentials"
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Retrieve the latest code from the GitHub repository
                checkout scm
            }
        }

        stage('Build & Push to Azure') {
            steps {
                script {
                    // List of service folders to process
                    def services = ['auth', 'order', 'product', 'api-gateway']
                    
                    // Log in to Azure using the stored credentials
                    withCredentials([usernamePassword(credentialsId: "${AZURE_CRED_ID}", passwordVariable: 'ACR_PASS', usernameVariable: 'ACR_USER')]) {
                        
                        // Docker login via CLI
                        sh "echo ${ACR_PASS} | docker login ${ACR_URL} -u ${ACR_USER} --password-stdin"
                        
                        for (s in services) {
                            // Detect if there are changes in the specific service folder
                            // This compares the current commit with the previous one
                            def changeInFolder = sh(script: "git diff --quiet HEAD~1 HEAD -- ${s} || echo 'changed'", returnStatus: false).trim()
                            
                            if (changeInFolder == 'changed') {
                                echo "-------------------------------------------"
                                echo "Changes detected in: ${s}. Starting build..."
                                echo "-------------------------------------------"
                                
                                // 1. Build the Docker Image using the Dockerfile inside the service folder
                                sh "docker build -t ${ACR_URL}/${s}:latest ./${s}"
                                
                                // 2. Push the newly built image to Azure ACR
                                sh "docker push ${ACR_URL}/${s}:latest"
                                
                                echo "Successfully pushed ${s} to Azure ACR!"
                            } else {
                                // If no changes were found in that folder, skip the build to save time
                                echo "No changes detected in ${s}. Skipping build."
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        success { 
            echo 'Pipeline finished successfully!' 
        }
        failure { 
            echo 'Pipeline failed! Please check the console log for details.' 
        }
        always { 
            // Clean up unused local images to save disk space on the Jenkins server
            sh "docker image prune -f" 
        }
    }
}