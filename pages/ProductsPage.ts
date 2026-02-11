import { BasePage } from './BasePage';
import { Locator, Page, expect } from '@playwright/test';

export class ProductsPage extends BasePage {
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly productsList: Locator;
    readonly viewCartLink: Locator;
    readonly continueShoppingButton: Locator;
    readonly categorySidebar: Locator;
    readonly brandsSidebar: Locator;
    readonly reviewNameInput: Locator;
    readonly reviewEmailInput: Locator;
    readonly reviewTextarea: Locator;
    readonly submitReviewButton: Locator;
    readonly reviewSuccessMessage: Locator;

    constructor(page: Page) {
        super(page, '/products');
        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.productsList = page.locator('.features_items');
        // Modal links
        this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });

        this.categorySidebar = page.locator('#accordian'); // Sidebar for categories
        this.brandsSidebar = page.locator('.brands_products');

        // Reviews
        this.reviewNameInput = page.locator('#name');
        this.reviewEmailInput = page.locator('#email');
        this.reviewTextarea = page.locator('#review');
        this.submitReviewButton = page.locator('#button-review');
        this.reviewSuccessMessage = page.locator('.alert-success span'); // Thank you for your review.
    }

    async searchProduct(productName: string) {
        await this.utils.fill(this.searchInput, productName);
        await this.utils.click(this.searchButton);
        await this.utils.expectVisible(this.productsList);
    }

    async addProductToCart(productName: string) {
        const productCard = this.page.locator('.product-image-wrapper', { hasText: productName }).first();
        await this.utils.hover(productCard);
        await this.utils.click(productCard.locator('.add-to-cart').first());
    }

    async addProductToCartByIndex(index: number) {
        // Add 1st or 2nd product
        const productCard = this.page.locator('.product-image-wrapper').nth(index);
        await this.utils.hover(productCard);
        await this.utils.click(productCard.locator('.add-to-cart').first());
    }

    async proceedToCart() {
        await this.utils.expectVisible(this.viewCartLink);
        await this.utils.click(this.viewCartLink);
    }

    async continueShopping() {
        await this.utils.click(this.continueShoppingButton);
    }

    async filterByCategory(category: string, subCategory: string) {
        await this.utils.click(this.categorySidebar.locator(`a[href="#${category}"]`));
        await this.utils.click(this.categorySidebar.locator(`#${category}`).getByRole('link', { name: subCategory }));
    }

    async filterByBrand(brand: string) {
        await this.utils.click(this.brandsSidebar.getByText(brand), { force: true });
    }

    async viewProductDetails(productName: string) {
        const productCard = this.page.locator('.product-image-wrapper', { hasText: productName }).first();
        await this.utils.click(productCard.getByText('View Product'));
    }

    async submitReview(name: string, email: string, review: string) {
        await this.utils.fill(this.reviewNameInput, name);
        await this.utils.fill(this.reviewEmailInput, email);
        await this.utils.fill(this.reviewTextarea, review);
        await this.utils.click(this.submitReviewButton);
    }

    async verifyReviewSuccess() {
        await expect(this.reviewSuccessMessage).toBeVisible();
        await expect(this.reviewSuccessMessage).toHaveText('Thank you for your review.');
    }
}
