pipeline {
    agent any

    environment {
        // ඔබේ Azure Container Registry එකේ URL එක
        ACR_URL = "ruhunaecommerceacr.azurecr.io"
        // අපි කලින් Jenkins වල හැදූ Global Credential ID එක
        AZURE_CRED_ID = "azure-registry-credentials"
    }

    stages {
        stage('Checkout Code') {
            steps {
                // GitHub එකෙන් code එක ලබා ගැනීම
                checkout scm
            }
        }

        stage('Build & Push to Azure') {
            steps {
                script {
                    // ඔබේ folder වල නම් මේ ලැයිස්තුවට ඇතුළත් කරන්න
                    def services = ['auth', 'order', 'product']
                    
                    // Azure credentials භාවිතයෙන් login වීම
                    withCredentials([usernamePassword(credentialsId: "${AZURE_CRED_ID}", passwordVariable: 'ACR_PASS', usernameVariable: 'ACR_USER')]) {
                        
                        // Docker CLI හරහා Azure එකට login වීම
                        sh "echo ${ACR_PASS} | docker login ${ACR_URL} -u ${ACR_USER} --password-stdin"
                        
                        for (s in services) {
                            echo "-------------------------------------------"
                            echo "Processing Service: ${s}"
                            echo "-------------------------------------------"
                            
                            // 1. Image එක Build කිරීම (Folder එක තුළ ඇති Dockerfile එක සොයයි)
                            sh "docker build -t ${ACR_URL}/${s}:latest ./${s}"
                            
                            // 2. Image එක Azure ACR එකට Push කිරීම
                            sh "docker push ${ACR_URL}/${s}:latest"
                            
                            echo "Successfully pushed ${s} to Azure!"
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Build and Push process completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the console output for errors.'
        }
        always {
            // Local එකේ හැදුණු images අයින් කර space ඉතිරි කිරීම
            sh "docker image prune -f"
        }
    }
}