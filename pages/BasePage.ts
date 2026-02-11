import { Page, Locator } from '@playwright/test';
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

}
