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

                bat 'powershell -Command "Get-Content .env | ForEach-Object { ($_ -split ''='',2)[0] }"'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }
}