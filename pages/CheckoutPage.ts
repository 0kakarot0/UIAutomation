import { BasePage } from './BasePage';
import { Locator, Page, expect } from '@playwright/test';

export class CheckoutPage extends BasePage {
    readonly addressDetails: Locator;
    readonly reviewOrderItems: Locator;
    readonly messageTextarea: Locator;
    readonly placeOrderButton: Locator;

    constructor(page: Page) {
        super(page, '/checkout');
        this.addressDetails = page.locator('#address_delivery');
        // The cart info table usually contains the items.
        this.reviewOrderItems = page.locator('#cart_info');
        this.messageTextarea = page.locator('textarea[name="message"]');
        this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
    }

    async verifyAddressDetails(firstName: string, lastName: string, address: string) {
        await this.utils.expectVisible(this.addressDetails);
        await expect(this.addressDetails).toContainText(firstName);
        await expect(this.addressDetails).toContainText(lastName);
        await expect(this.addressDetails).toContainText(address);
    }

    async verifyProductInCheckout(productName: string) {
        await this.utils.expectVisible(this.reviewOrderItems);
        await expect(this.reviewOrderItems).toContainText(productName);
    }

    async placeOrder(message: string = 'Test Order') {
        await this.utils.fill(this.messageTextarea, message);
        await this.utils.click(this.placeOrderButton);
    }
}
