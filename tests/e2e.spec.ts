import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { AccountCreationPage } from '../pages/AccountCreationPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { generateRandomEmail, generateRandomName } from '../utils/helpers';
import { testUser } from '../config/envConfig'; // Using env config or just inline data if prefered

test.describe('E2E Shopping Flow', () => {
    let homePage: HomePage;
    let loginPage: LoginPage;
    let accountCreationPage: AccountCreationPage;
    let productsPage: ProductsPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;
    let paymentPage: PaymentPage;

    const userName = generateRandomName();
    const userEmail = generateRandomEmail();
    const password = 'TestPassword123!';
    const productName = 'Blue Top'; // Existing product

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        accountCreationPage = new AccountCreationPage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        paymentPage = new PaymentPage(page);

        await homePage.navigateTo();
    });

    test('Complete E2E Flow: Register -> Shop -> Checkout', async ({ page }) => {
        // 1. Launch & Verify Home
        await expect(page).toHaveTitle(/Automation Exercise/);

        // 2. Register User (Prerequisite for Checkout)
        await test.step('Register New User', async () => {
            await homePage.clickSignupLogin();
            await loginPage.signup(userName, userEmail);
            await accountCreationPage.fillAccountDetails(password, 'First', 'Last', '123 Test St', 'State', 'City', '10001', '1234567890');
            await accountCreationPage.createAccount();
            await accountCreationPage.verifyAccountCreated();
            await accountCreationPage.clickContinue();
            // Verify logged in as user
            await expect(page.getByText(`Logged in as ${userName}`)).toBeVisible();
        });

        // 3. Navigate to Products & Search
        await test.step('Search and Add Product', async () => {
            await homePage.clickProducts();
            await productsPage.searchProduct(productName);
            await productsPage.addProductToCart(productName);
            await productsPage.proceedToCart();
        });

        // 4. Verify Cart
        await test.step('Verify Cart', async () => {
            await cartPage.verifyProductInCart(productName);
            await cartPage.proceedToCheckout();
        });

        // 5. Checkout
        await test.step('Checkout', async () => {
            await checkoutPage.verifyAddressDetails('First', 'Last', '123 Test St');
            await checkoutPage.verifyProductInCheckout(productName);
            await checkoutPage.placeOrder('Automated Test Order');
        });

        // 6. Payment
        await test.step('Payment', async () => {
            await paymentPage.fillPaymentDetails('Test User', '1234567812345678', '123', '01', '2030');
            await paymentPage.confirmPayment();
            // Verify success
            // Note: Site flow might require handling "Order Placed" page
            await expect(page.getByText('Order Placed!', { exact: false })).toBeVisible();
        });

        // Cleanup: Delete Account (Optional but good practice)
        await test.step('Delete Account', async () => {
            await homePage.clickDeleteAccount(); // Assuming method exists or added
            await expect(page.getByText('Account Deleted!')).toBeVisible();
        });
    });
});
