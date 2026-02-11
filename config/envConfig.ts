import dotenv from 'dotenv';
dotenv.config();

export interface TestUser {
    name: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export const testUser: TestUser = {
    name: process.env.TEST_NAME || 'Test User',
    email: process.env.TEST_EMAIL || 'test@example.com',
    password: process.env.TEST_PASSWORD || 'Test@12345',
};

export const config = {
    baseUrl: process.env.BASE_URL || 'https://www.automationexercise.com',
    timeouts: {
        global: parseInt(process.env.GLOBAL_TIMEOUT || '60000'),
        action: parseInt(process.env.ACTION_TIMEOUT || '35000'),
        navigation: parseInt(process.env.NAVIGATION_TIMEOUT || '300000'),
    },
};