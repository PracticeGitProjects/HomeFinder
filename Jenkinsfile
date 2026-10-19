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
                withCredentials([file(credentialsId: 'refernest-env-file', variable: 'ENV_FILE')]) {
                    powershell '''
                        Copy-Item $env:ENV_FILE '.env' -Force
                    '''
                }
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test src/tests/TC_000_HomeFinder_Homepage.spec.ts --project=chromium --no-deps'
            }
        }
    }
}