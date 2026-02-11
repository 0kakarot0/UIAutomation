import { Page, Locator, expect } from '@playwright/test';
import { PlaywrightUtils } from '../utils/PlaywrightUtils';

export abstract class BasePage {
    protected page: Page;
    protected utils: PlaywrightUtils;
    readonly url: string;

    constructor(page: Page, url: string = '') {
        this.page = page;
        this.url = url;
        this.utils = new PlaywrightUtils(page);
    }

    async navigateTo(path: string = '') {
        const targetUrl = path ? path : this.url;
        await this.utils.goto(targetUrl, 'domcontentloaded');
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async waitForUrl(url: string) {
        await this.page.waitForURL(url);
    }

    /**
     * Checks for common Google ad overlay (aswift_* iframe) and closes it if present.
     * Does NOT fail the test if no ad appears.
     *
     * @param timeoutMs - Maximum time (in ms) to wait for ad elements (default: 6000)
     * @returns `true` if an ad was found and closed, `false` otherwise
     */
    async closeGoogleAdIfPresent(timeoutMs: number = 6000): Promise<boolean> {
        // Target dynamic Google ad iframes: aswift_0, aswift_1, aswift_2, ...
        const adFrameLocator = this.page.frameLocator('iframe[name^="aswift_"]');

        // Give late-loading ads a small non-blocking chance to appear
        await this.page.waitForTimeout(800).catch(() => {});

        const outerFrameCount = await adFrameLocator.count;
        if (outerFrameCount === 0) {
            return false;
        }

        try {
            // Quick check for typical Google ad marker text
            const hasAdIndicator = await adFrameLocator
                .locator('text=/Ad|Feedback|Why this ad|AdChoices/i')
                .isVisible({ timeout: timeoutMs / 2 })
                .catch(() => false);

            if (!hasAdIndicator) {
                return false;
            }

            // Look inside the inner ad iframe for the close button
            const innerFrameLocator = adFrameLocator.frameLocator(
                'iframe[name="ad_iframe"], iframe[title*="Advertisement"], iframe[src*="googlesyndication"]'
            );

            const closeButton = innerFrameLocator.getByRole('button', {
                name: /Close|Close ad|×|Dismiss|Skip|Fechar/i,
            }).first();

            // Give it a bit more time to become interactive
            if (await closeButton.isVisible({ timeout: 4500 })) {
                await closeButton.click({ timeout: 6000 });
                console.log('[BasePage] → Closed Google ad overlay');

                // Optional: wait briefly and confirm it's gone (helps with flakiness)
                await expect(adFrameLocator).toBeHidden({ timeout: 4000 }).catch(() => {});

                return true;
            }
        } catch (err) {
            // Silent handling — don't break the test flow
            console.log('[BasePage] → Tried to close Google ad but no close button found or already gone:', (err as Error).message);
        }

        return false;
    }

    // Optional: convenience method that combines navigation + ad closing
    async closeAdIfPresent() {
        await this.closeGoogleAdIfPresent(7000);
    }
}