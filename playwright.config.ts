import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const isCI = process.env.CI === 'true';

const setupTest =
    /auth\.setup\.spec\.ts$/;

const regressionTest =
    /TC_001_Refer_And_Earn_Homepage_Verification\.spec\.ts$/;

export default defineConfig({
    testDir: './src/tests',
    timeout: 30_000,
    fullyParallel: true,

    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    workers: isCI ? 1 : undefined,

    reporter: 'html',

    use: {
        baseURL: process.env.BASE_URL,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
    },

    projects: [
        {
            name: 'setup',
            testMatch: setupTest,
            use: {
                browserName: 'chromium',
                viewport: { width: 1366, height: 768 },
            },
        },
        {
            name: 'homefinder',
            testMatch: regressionTest,
            use: {
                browserName: 'chromium',
                storageState: {
                    cookies: [],
                    origins: [],
                },
            },
        },
        {
            name: 'chromium',
            testIgnore: [setupTest, regressionTest],
            use: {
                browserName: 'chromium',
                viewport: { width: 1366, height: 768 },
                storageState: 'src/resources/auth/auth.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'firefox',
            testIgnore: [setupTest, regressionTest],
            use: {
                browserName: 'firefox',
                viewport: { width: 1366, height: 768 },
                storageState: 'src/resources/auth/auth.json',
            },
            dependencies: ['setup'],
        },
    ],
});