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
                    def services = ['auth', 'order', 'product', 'api-gateway', 'frontend']
                    
                    withCredentials([usernamePassword(credentialsId: "${AZURE_CRED_ID}", passwordVariable: 'ACR_PASS', usernameVariable: 'ACR_USER')]) {
                        // Log in to ACR
                        sh "echo ${ACR_PASS} | docker login ${ACR_URL} -u ${ACR_USER} --password-stdin"
                        
                        for (s in services) {
                            // 1. Safety check to see if the folder exists
                            if (fileExists(s)) {
                                // 2. Check for changes between current and previous commit
                                // Note: On the very first run, if HEAD~1 fails, build all services manually once.
                                def statusCode = sh(script: "git diff --quiet HEAD~1 HEAD -- ${s}", returnStatus: true)
                                
                                if (statusCode != 0) { 
                                    echo "-------------------------------------------"
                                    echo "Changes detected in: ${s}. Starting build..."
                                    echo "-------------------------------------------"
                                    
                                    sh "docker build -t ${ACR_URL}/${s}:latest ./${s}"
                                    sh "docker push ${ACR_URL}/${s}:latest"
                                    
                                    echo "Successfully pushed ${s} to Azure ACR!"
                                } else {
                                    echo "No changes detected in ${s}. Skipping build."
                                }
                            } else {
                                echo "Folder ${s} not found, skipping..."
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
            // Clean up unused local images to save disk space on Jenkins agent
            sh "docker image prune -f" 
        }
    }
}