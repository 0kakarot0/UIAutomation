import { Page, Locator } from '@playwright/test';

export class WaitUtils {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Waits for the DOM to be in 'domcontentloaded' state.
     */
    async waitForDomContentLoaded() {
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Waits for the network to be idle.
     */
    async waitForNetworkIdle() {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Waits for the page to be fully loaded.
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }

    /**
     * Waits for a selector to be visible.
     *
     * Note: We intentionally do NOT wait for an explicit page load state here.
     * Playwright's built-in auto-waiting on locators is usually enough and
     * additional global waits (load/networkidle) have been a common source
     * of unnecessary timeouts on dynamic pages.
     *
     * @param selector The selector to wait for.
     * @param timeout Optional timeout in milliseconds.
     */
    async waitForSelectorVisible(selector: string | Locator, timeout: number = 10000) {
        if (typeof selector === 'string') {
            await this.page.waitForSelector(selector, { state: 'visible', timeout });
        } else {
            await selector.waitFor({ state: 'visible', timeout });
        }
    }

    /**
     * Waits for a selector to be attached to the DOM.
     * @param selector The selector to wait for.
     */
    async waitForSelectorAttached(selector: string | Locator, timeout: number = 10000) {
        if (typeof selector === 'string') {
            await this.page.waitForSelector(selector, { state: 'attached', timeout });
        } else {
            await selector.waitFor({ state: 'attached', timeout });
        }
    }

    /**
     * Explicit wait for a specified number of milliseconds.
     * @param ms Time in milliseconds
     */
    async wait(ms: number) {
        await this.page.waitForTimeout(ms);
    }
}
