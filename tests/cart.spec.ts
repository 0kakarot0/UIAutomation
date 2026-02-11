import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart Tests', () => {
    let homePage: HomePage;
    let productsPage: ProductsPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        await homePage.navigateTo();
    });

    // Test Case 12: Add Products in Cart
    test('TC 12: Add Products in Cart', async ({ page }) => {
        await homePage.clickProducts();
        // Hover and add first product
        await productsPage.addProductToCart('Blue Top');
        await productsPage.continueShopping();

        await productsPage.addProductToCart('Men Tshirt');
        await productsPage.proceedToCart();

        await expect(page.locator('#cart_info_table tbody tr')).toHaveCount(2);
    });

    // Test Case 13: Verify Product quantity in Cart
    test('TC 13: Verify Product quantity in Cart', async ({ page }) => {
        await homePage.clickProducts();
        await productsPage.viewProductDetails('Blue Top');
        await expect(page).toHaveURL(/.*product_details/);

        await page.locator('#quantity').click();
        await page.locator('#quantity').fill('4');
        await page.getByRole('button', { name: 'Add to cart' }).click();
        await productsPage.proceedToCart();

        // Cart Page verification
        // Check quantity is 4
        await expect(page.locator('#cart_info_table .cart_quantity button')).toHaveText('4');
    });

    // Test Case 17: Remove Products From Cart
    test('TC 17: Remove Products From Cart', async ({ page }) => {
        await homePage.clickProducts();
        await productsPage.addProductToCart('Blue Top');
        await productsPage.proceedToCart();
        await cartPage.verifyProductInCart('Blue Top');

        await cartPage.removeProduct('Blue Top');
        // Verify table empty or product gone
        await expect(page.getByText('Cart is empty!')).toBeVisible();
    });
});
