import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({

    // Tests folder
    testDir: './src/tests',

    // Maximum time one test can run
    timeout: 30 * 1000,

    // Run tests in parallel
    fullyParallel: true,

    // Fail CI if test.only is accidentally left
    forbidOnly: !!process.env.CI,

    // Retry on CI
    retries: process.env.CI ? 2 : 0,

    // One worker on CI
    workers: process.env.CI ? 1 : undefined,

    // Reporter
    reporter: 'html',

    // Shared settings
    use: {

        // Application URL
        baseURL: process.env.BASE_URL,

        // Use actual browser window size
        viewport: null,

        screenshot: 'only-on-failure',

        video: 'retain-on-failure',

        trace: 'retain-on-failure',
    },

    // Projects
    projects: [

        // =====================================================
        // AUTHENTICATION SETUP
        // =====================================================

        {
            name: 'setup',

            testMatch: /auth\.setup\.spec\.ts/,
        },

        // =====================================================
        // CHROMIUM
        // =====================================================

        {
            name: 'chromium',

            use: {
                storageState:
                    'src/resources/auth/auth.json',
            },

            dependencies: ['setup'],
        },

        // =====================================================
        // FIREFOX
        // =====================================================

        {
            name: 'firefox',

            use: {
                storageState:
                    'src/resources/auth/auth.json',
            },

            dependencies: ['setup'],
        },
    ],
});