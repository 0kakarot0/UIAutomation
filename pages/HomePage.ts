import { BasePage } from './BasePage';
import { Locator, Page, expect } from '@playwright/test';

export class HomePage extends BasePage {
    readonly signupLoginLink: Locator;
    readonly productsLink: Locator;
    readonly cartLink: Locator;
    readonly logoutLink: Locator;
    readonly deleteAccountLink: Locator;
    readonly contactUsLink: Locator;
    readonly testCasesLink: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscribeButton: Locator;
    readonly successSubscribeMessage: Locator;
    readonly scrollUpArrow: Locator;
    readonly carouselIndicator: Locator;

    constructor(page: Page) {
        super(page, '/');
        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
        this.productsLink = page.getByRole('link', { name: 'Products' });
        this.cartLink = page.getByRole('link', { name: 'Cart' });
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
        this.contactUsLink = page.getByRole('link', { name: 'Contact us' });
        this.testCasesLink = page.locator('.shop-menu').getByRole('link', { name: 'Test Cases' });

        // Subscription
        this.subscriptionEmailInput = page.locator('#susbscribe_email');
        this.subscribeButton = page.locator('#subscribe');
        this.successSubscribeMessage = page.locator('.alert-success'); // 'You have been successfully subscribed!'

        // Scroll
        this.scrollUpArrow = page.locator('#scrollUp');
        this.carouselIndicator = page.locator('#slider-carousel');
    }

    async clickSignupLogin() {
        await this.utils.click(this.signupLoginLink);
    }

    async clickProducts() {
        await this.utils.click(this.productsLink);
    }

    async clickCart() {
        await this.utils.click(this.cartLink);
    }

    async clickLogout() {
        await this.utils.click(this.logoutLink);
    }

    async clickDeleteAccount() {
        await this.utils.click(this.deleteAccountLink);
    }

    async clickContactUs() {
        await this.utils.click(this.contactUsLink);
    }

    async clickTestCases() {
        await this.utils.click(this.testCasesLink);
    }

    async subscribe(email: string) {
        await this.utils.fill(this.subscriptionEmailInput, email);
        await this.utils.click(this.subscribeButton);
    }

    async verifySubscriptionSuccess() {
        // success message might be hidden or transient, checking for presence in DOM or text
        await this.utils.expectVisible(this.successSubscribeMessage);
        await expect(this.successSubscribeMessage).toContainText('You have been successfully subscribed!');
    }

    async scrollToBottom() {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    async clickScrollUpArrow() {
        await this.utils.click(this.scrollUpArrow);
    }

    async verifyFullTextOnCarousel() {
        await this.utils.expectVisible(this.carouselIndicator);
        await this.utils.expectVisible(this.page.getByText('Full-Fledged practice website for Automation Engineers').first());
    }
}
