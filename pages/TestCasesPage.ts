import { BasePage } from './BasePage';
import { Locator, Page, expect } from '@playwright/test';

export class TestCasesPage extends BasePage {
    readonly pageTitle: Locator;

    constructor(page: Page) {
        super(page, '/test_cases');
        this.pageTitle = page.getByText('Test Cases', { exact: true }).first(); // Adjust selector if needed
    }

    async verifyPageLoaded() {
        await expect(this.page).toHaveURL(/.*test_cases/);
        await expect(this.pageTitle).toBeVisible();
    }
}
