pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Create Environment File') {
            steps {
                withCredentials([string(credentialsId: 'refernest-env', variable: 'ENV_FILE')]) {
                    powershell '''
                        [System.IO.File]::WriteAllText('.env', $env:ENV_FILE)
                    '''
                }

                powershell '''
                    $content = Get-Content ".env" -Raw
                    $emailExists = $content -match "(?m)^TEST_USER_EMAIL="
                    $passwordExists = $content -match "(?m)^TEST_USER_PASSWORD="

                    Write-Host "TEST_USER_EMAIL variable exists in .env: $emailExists"
                    Write-Host "TEST_USER_PASSWORD variable exists in .env: $passwordExists"
                '''
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }
}