
import { defineConfig, devices } from '@playwright/test';
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

        // Capture debugging evidence
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
    },

    // Projects
    projects: [

        // ================================================
        // AUTHENTICATION SETUP FOR REFERNEST
        // ================================================
        {
            name: 'setup',
            testMatch: /auth\.setup\.spec\.ts/,
        },

        // ================================================
        // HOMEFINDER - PUBLIC TESTS WITHOUT AUTHENTICATION
        // ================================================
        {
            name: 'homefinder',

            // Run only the HomeFinder homepage smoke test
            testMatch: /TC_000_HomeFinder_Homepage\.spec\.ts/,

            // Clean browser context without authentication
            use: {
                browserName: 'chromium',
                viewport: null,
                storageState: {
                    cookies: [],
                    origins: [],
                },
            },
        },

        // ================================================
        // REFERNEST - CHROMIUM
        // ================================================
        {
            name: 'chromium',

            // Exclude setup and HomeFinder tests
            testIgnore: [
                /auth\.setup\.spec\.ts/,
                /TC_000_HomeFinder_Homepage\.spec\.ts/,
            ],

            use: {
                ...devices['Desktop Chrome'],
                viewport: null,
                storageState: 'src/resources/auth/auth.json',
            },

            // Run authentication setup first
            dependencies: ['setup'],
        },

        // ================================================
        // REFERNEST - FIREFOX
        // ================================================
        {
            name: 'firefox',

            // Exclude setup and HomeFinder tests
            testIgnore: [
                /auth\.setup\.spec\.ts/,
                /TC_000_HomeFinder_Homepage\.spec\.ts/,
            ],

            use: {
                ...devices['Desktop Firefox'],
                viewport: null,
                storageState: 'src/resources/auth/auth.json',
            },

            // Run authentication setup first
            dependencies: ['setup'],
        },
    ],
});