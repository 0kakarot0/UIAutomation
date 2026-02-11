import { BasePage } from './BasePage';
import { Locator, Page, expect } from '@playwright/test';

export class ContactUsPage extends BasePage {
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly subjectInput: Locator;
    readonly messageTextarea: Locator;
    readonly uploadFileInput: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;
    readonly homeButtons: Locator;

    constructor(page: Page) {
        super(page, '/contact_us');
        this.nameInput = page.locator('[data-qa="name"]');
        this.emailInput = page.locator('[data-qa="email"]');
        this.subjectInput = page.locator('[data-qa="subject"]');
        this.messageTextarea = page.locator('[data-qa="message"]');
        this.uploadFileInput = page.locator('input[name="upload_file"]');
        this.submitButton = page.locator('[data-qa="submit-button"]');
        this.successMessage = page.locator('.status.alert.alert-success');
        this.homeButtons = page.locator('.btn.btn-success');
    }

    async submitContactForm(name: string, email: string, subject: string, message: string, filePath?: string) {
        await this.nameInput.scrollIntoViewIfNeeded();

        await this.utils.click(this.nameInput);
        await this.utils.fill(this.nameInput, name);
        await expect(this.nameInput).toHaveValue(name);

        await this.utils.click(this.emailInput);
        await this.utils.fill(this.emailInput, email);
        await expect(this.emailInput).toHaveValue(email);

        await this.utils.click(this.subjectInput);
        await this.utils.fill(this.subjectInput, subject);
        await expect(this.subjectInput).toHaveValue(subject);

        await this.utils.click(this.messageTextarea);
        await this.utils.fill(this.messageTextarea, message);
        await expect(this.messageTextarea).toHaveValue(message);

        if (filePath) {
            await this.utils.setInputFiles(this.uploadFileInput, filePath);
        }

        // Handling dialog if it appears
        this.page.once('dialog', dialog => dialog.accept());
        await this.utils.click(this.submitButton);
    }

    async verifySuccessMessage() {
        // Use specific class and first() to avoid ambiguity
        const successAlert = this.page.locator('.status.alert.alert-success').first();
        await this.utils.expectVisible(successAlert);
        await expect(successAlert).toContainText('Success! Your details have been submitted successfully.');
    }

    async goHome() {
        await this.utils.click(this.homeButtons);
    }
}
