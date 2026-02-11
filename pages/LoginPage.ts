import { BasePage } from './BasePage';
import { Locator, Page } from '@playwright/test';

export class LoginPage extends BasePage {
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;

    constructor(page: Page) {
        super(page, '/login');
        this.loginEmailInput = page.locator('[data-qa="login-email"]');
        this.loginPasswordInput = page.locator('[data-qa="login-password"]');
        this.loginButton = page.locator('[data-qa="login-button"]');
        this.signupNameInput = page.locator('[data-qa="signup-name"]');
        this.signupEmailInput = page.locator('[data-qa="signup-email"]');
        this.signupButton = page.locator('[data-qa="signup-button"]');
    }

    async login(email: string, pass: string) {
        await this.utils.fill(this.loginEmailInput, email);
        await this.utils.fill(this.loginPasswordInput, pass);
        await this.utils.click(this.loginButton);
    }

    async signup(name: string, email: string) {
        await this.utils.fill(this.signupNameInput, name);
        await this.utils.fill(this.signupEmailInput, email);
        await this.utils.click(this.signupButton);
    }
}
