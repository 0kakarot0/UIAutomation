import {Page, Locator, expect} from '@playwright/test';
import {WaitUtils} from './WaitUtils';

export class PlaywrightUtils {
    private page: Page;
    private waitUtils: WaitUtils;

    constructor(page: Page) {
        this.page = page;
        this.waitUtils = new WaitUtils(page);
    }

    /**
     * Navigates to a URL and waits for the load state.
     * @param url URL to navigate to.
     * @param waitState Load state to wait for (default: 'domcontentloaded').
     */
    async goto(url: string, waitState: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded') {
        await this.page.goto(url, {waitUntil: waitState});
    }

    /**
     * Clicks an element after ensuring it is visible and stable.
     * @param selector Selector or Locator to click.
     * @param options Click options (force, timeout, etc.)
     * @param waitState Optional load state to wait for after click.
     */
    async click(selector: string | Locator, options?: {
        force?: boolean,
        timeout?: number
    }, waitState?: 'load' | 'domcontentloaded' | 'networkidle') {
        await this.waitUtils.waitForSelectorVisible(selector);
        // await this.waitUtils.waitForPageLoad();
        // await this.waitUtils.waitForNetworkIdle();
        // await this.waitUtils.waitForDomContentLoaded();

        if (typeof selector === 'string') {
            await this.page.click(selector, options);
        } else {
            await selector.click(options);
        }

        if (waitState) {
            await this.page.waitForLoadState(waitState);
        }
    }

    /**
     * Fills an input field after ensuring it is visible.
     * @param selector Selector or Locator to fill.
     * @param value Value to enter.
     */
    async fill(selector: string | Locator, value: string) {
        try {
            await this.waitUtils.waitForSelectorVisible(selector);

            if (typeof selector === 'string') {
                await this.page.fill(selector, value);
            } else {
                await selector.fill(value);
            }
        } catch (e) {
            console.error("An error occurred:", e);
        }
    }

    /**
     * Gets text content of an element.
     * @param selector Selector or Locator.
     */
    async getText(selector: string | Locator): Promise<string | null> {
        await this.waitUtils.waitForSelectorVisible(selector);
        if (typeof selector === 'string') {
            return await this.page.textContent(selector);
        } else {
            return await selector.textContent();
        }
    }

    async setInputFiles(selector: string | Locator, files: string | string[] | {
        name: string;
        mimeType: string;
        buffer: Buffer;
    }[]) {
        await this.waitUtils.waitForSelectorVisible(selector);
        if (typeof selector === 'string') {
            await this.page.setInputFiles(selector, files);
        } else {
            await selector.setInputFiles(files);
        }
    }

    async expectVisible(selector: string | Locator, timeout: number = 30000) {
        await this.waitUtils.waitForDomContentLoaded();
        await this.waitUtils.waitForNetworkIdle();
        await this.waitUtils.waitForPageLoad();
        if (typeof selector === 'string') {
            await expect(this.page.locator(selector)).toBeVisible({timeout});
        } else {
            await expect(selector).toBeVisible({timeout});
        }
    }

    async hover(locator: Locator) {
        await locator.hover();
    }

    /**
     * Checks a checkbox or radio button after ensuring it is visible and enabled.
     * @param selector Selector or Locator
     */
    async check(selector: string | Locator) {
        const locator = typeof selector === 'string'
            ? this.page.locator(selector)
            : selector;

        await this.waitUtils.waitForSelectorVisible(locator);
        // await expect(locator).toBeEnabled();

        try {
            await locator.check();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    /**
     * Selects an option from a dropdown (<select> element).
     * @param selector Selector or Locator
     * @param value Value, label, or index of option
     */
    async selectOption(
        selector: string | Locator,
        value: string | { label?: string; value?: string; index?: number }
    ) {
        const locator = typeof selector === 'string'
            ? this.page.locator(selector)
            : selector;

        await expect(locator).toBeVisible();
        await expect(locator).toBeEnabled();

        if (typeof value === 'string') {
            // Try selecting by value first
            await locator.selectOption({value}).catch(async () => {
                // If not found by value, try label
                await locator.selectOption({label: value});
            });
        } else {
            await locator.selectOption(value);
        }
    }


}
