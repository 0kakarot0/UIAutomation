import {test, expect} from '@playwright/test';
import {HomePage} from '../pages/HomePage';
import {LoginPage} from '../pages/LoginPage';
import {AccountCreationPage} from '../pages/AccountCreationPage';
import {generateRandomEmail, generateRandomName} from '../utils/helpers';
import {testUser} from '../config/envConfig';

test.describe('Authentication Tests', () => {
    let homePage: HomePage;
    let loginPage: LoginPage;
    let accountCreationPage: AccountCreationPage;

    test.beforeEach(async ({page, context}) => {
        // 🚫 Block Google Ads (must be before navigation)
        await context.route('**/*googlesyndication.com/**', route => route.abort());
        await context.route('**/*doubleclick.net/**', route => route.abort());

        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        accountCreationPage = new AccountCreationPage(page);
        await homePage.navigateTo();
        // await page.waitForLoadState("domcontentloaded");
        // await page.waitForLoadState("load");
    });

    // Test Case 1: Register User
    test('TC 1: Register User', async ({page}) => {
        const name = generateRandomName();
        const email = generateRandomEmail();

        await expect(page).toHaveTitle(/Automation Exercise/);
        await homePage.clickSignupLogin();
        await expect(page.getByText('New User Signup!')).toBeVisible();

        await loginPage.signup(name, email);
        await expect(page.getByText('Enter Account Information')).toBeVisible();

        await accountCreationPage.fillAccountDetails('Pass123', 'First', 'Last', 'Address', 'State', 'City', '10001', '1234567890');
        await accountCreationPage.createAccount();
        await accountCreationPage.verifyAccountCreated();

        await accountCreationPage.clickContinue();
        await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();

        await homePage.clickDeleteAccount();
        await expect(page.getByText('Account Deleted!')).toBeVisible();
    });

    // Test Case 2: Login User with correct email and password
    test('TC 2: Login User with correct email and password', async ({page}) => {
        await expect(page).toHaveTitle(/Automation Exercise/);
        await homePage.clickSignupLogin();
        await expect(page.getByText('Login to your account')).toBeVisible();

        // This requires a pre-existing user. For stability, we should probably create one or use env config.
        // Assuming testUser from config exists. If not, this might fail on fresh env.
        // Strategy: Create user, logout, then login.

        const name = generateRandomName();
        const email = generateRandomEmail();
        const password = 'Pass123';

        // Pre-requisite: Create user
        await loginPage.signup(name, email);
        await accountCreationPage.fillAccountDetails(password, 'First', 'Last', 'Address', 'State', 'City', '10001', '1234567890');
        await accountCreationPage.createAccount();
        await accountCreationPage.clickContinue();
        await homePage.clickLogout();

        // Actual Test
        await homePage.clickSignupLogin();
        await loginPage.login(email, password);
        await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();

        await homePage.clickDeleteAccount();
    });

    // Test Case 3: Login User with incorrect email and password
    test('TC 3: Login User with incorrect email and password', async ({page}) => {
        await homePage.clickSignupLogin();
        await loginPage.login('wrong@email.com', 'wrongpass');
        await expect(page.getByText(/incorrect/i)).toBeVisible();
    });

    // Test Case 4: Logout User
    test('TC 4: Logout User', async ({page}) => {
        // Create user to login first
        const name = generateRandomName();
        const email = generateRandomEmail();
        const password = 'Pass123';

        await homePage.clickSignupLogin();
        await loginPage.signup(name, email);
        await accountCreationPage.fillAccountDetails(password, 'First', 'Last', 'Address', 'State', 'City', '10001', '1234567890');
        await accountCreationPage.createAccount();
        await accountCreationPage.clickContinue();

        await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();
        await homePage.clickLogout();
        await expect(page).toHaveURL(/.*login/);
    });

    // Test Case 5: Register User with existing email
    test('TC 5: Register User with existing email', async ({page}) => {
        const name = generateRandomName();
        const email = generateRandomEmail();
        const password = 'Pass123';

        // Create user
        await homePage.clickSignupLogin();
        await loginPage.signup(name, email);
        await accountCreationPage.fillAccountDetails(password, 'First', 'Last', 'Address', 'State', 'City', '10001', '1234567890');
        await accountCreationPage.createAccount();
        await accountCreationPage.clickContinue();
        await homePage.clickLogout();

        // Try to register again
        await homePage.clickSignupLogin();
        await loginPage.signup('Another Name', email);
        await expect(page.getByText('Email Address already exist!')).toBeVisible();
    });
});
