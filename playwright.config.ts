import { defineConfig, devices } from '@playwright/test';
import { config } from './config/envConfig';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 3 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list']
    ],
    // ────────────────────────────────────────────────
    // Add this line here (top-level, same level as testDir, use, projects, etc.)
    timeout: 180_000,          // 90 seconds for each test (adjust as needed: 120_000, 180_000...)
    // ────────────────────────────────────────────────
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
                headless: true,
                launchOptions: {
                    slowMo: 1000,
                },
                viewport: { width: 1920, height: 1080 },
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