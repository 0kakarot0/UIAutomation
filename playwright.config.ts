import { defineConfig, devices } from '@playwright/test';
import { config } from './config/envConfig';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list']
    ],
    use: {
        baseURL: config.baseUrl,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 15000,
        navigationTimeout: 30000,
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                launchOptions: {
                    slowMo: 1000,
                },
            },

        },
        // {
        //     name: 'chromium-headed',
        //     use: {
        //         ...devices['Desktop Chrome'],
        //         headless: false,
        //         launchOptions: {
        //             slowMo: 1000,
        //         },
        //     },
        // },
    ],
});