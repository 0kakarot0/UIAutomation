import { BasePage } from './BasePage';
import { Locator, Page, expect } from '@playwright/test';

export class CartPage extends BasePage {
    readonly proceedToCheckoutButton: Locator;
    readonly cartTable: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscribeButton: Locator;
    readonly successSubscribeMessage: Locator;

    constructor(page: Page) {
        super(page, '/view_cart');
        this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
        this.cartTable = page.locator('#cart_info_table');

        // Subscription (Same footer as home)
        this.subscriptionEmailInput = page.locator('#susbscribe_email');
        this.subscribeButton = page.locator('#subscribe');
        this.successSubscribeMessage = page.locator('.alert-success');
    }

    async verifyProductInCart(productName: string) {
        await expect(this.cartTable).toBeVisible();
        await expect(this.cartTable).toContainText(productName);
    }

    async verifyProductQuantity(productName: string, quantity: string) {
        const row = this.cartTable.locator('tr', { hasText: productName });
        await expect(row.locator('.cart_quantity button')).toHaveText(quantity);
    }

    async removeProduct(productName: string) {
        const row = this.cartTable.locator('tr', { hasText: productName });
        await this.utils.click(row.locator('.cart_delete a'));
    }

    async verifyProductVariables(productName: string) {
        await expect(this.cartTable).not.toContainText(productName);
    }

    async proceedToCheckout() {
        // The \"Proceed To Checkout\" button can sometimes be below the fold.
        // Scroll it into view and give it a slightly longer timeout to
        // reduce cross-browser flakiness.
        await this.proceedToCheckoutButton.scrollIntoViewIfNeeded();
        await this.utils.click(this.proceedToCheckoutButton, { timeout: 20000 });
    }

    async subscribe(email: string) {
        await this.utils.fill(this.subscriptionEmailInput, email);
        await this.utils.click(this.subscribeButton);
    }

    async verifySubscriptionSuccess() {
        await expect(this.successSubscribeMessage).toBeVisible();
        await expect(this.successSubscribeMessage).toHaveText('You have been successfully subscribed!');
    }
}
