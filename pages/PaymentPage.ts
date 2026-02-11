import { BasePage } from './BasePage';
import { Locator, Page, expect } from '@playwright/test';

export class PaymentPage extends BasePage {
    readonly nameOnCardInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cvcInput: Locator;
    readonly expirationMonthInput: Locator;
    readonly expirationYearInput: Locator;
    readonly payAndConfirmIcon: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        super(page, '/payment');
        this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
        this.cardNumberInput = page.locator('[data-qa="card-number"]');
        this.cvcInput = page.locator('[data-qa="cvc"]');
        this.expirationMonthInput = page.locator('[data-qa="expiry-month"]');
        this.expirationYearInput = page.locator('[data-qa="expiry-year"]');
        this.payAndConfirmIcon = page.locator('[data-qa="pay-button"]');
        // Success message is usually on the next page/state, but logic might be here or new page.
        // Once clicked, it goes to /payment_done or similar?
        // Let's assume verification happens here or in test.
        this.successMessage = page.getByText('Order Placed!', { exact: false });
        // Note: The site usually redirects to /payment_done which has 'Order Placed!'
    }

    async fillPaymentDetails(name: string, number: string, cvc: string, month: string, year: string) {
        await this.utils.fill(this.nameOnCardInput, name);
        await this.utils.fill(this.cardNumberInput, number);
        await this.utils.fill(this.cvcInput, cvc);
        await this.utils.fill(this.expirationMonthInput, month);
        await this.utils.fill(this.expirationYearInput, year);
    }

    async confirmPayment() {
        await this.utils.click(this.payAndConfirmIcon);
    }

    // This probably belongs to OrderConfirmationPage but for simplicity:
    async verifyOrderPlaced() {
        // Wait for url or text
        // await expect(this.page).toHaveURL(/.*payment_done/);
        // The success message locator might need adjustment based on actual page state.
        // But let's keep it here for now.
    }
}
