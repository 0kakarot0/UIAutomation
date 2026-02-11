import { BasePage } from './BasePage';
import { Locator, Page, expect } from '@playwright/test';

export class AccountCreationPage extends BasePage {
    readonly titleMr: Locator;
    readonly passwordInput: Locator;
    readonly daysSelect: Locator;
    readonly monthsSelect: Locator;
    readonly monthsID: Locator;
    readonly yearsSelect: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly addressInput: Locator;
    readonly countrySelect: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipInput: Locator;
    readonly mobileInput: Locator;
    readonly createAccountButton: Locator;
    readonly accountCreatedMessage: Locator;
    readonly continueButton: Locator;
    readonly dateOfBirthLabel: Locator;

    constructor(page: Page) {
        super(page, '/signup');
        this.titleMr = page.getByLabel('Mr.');
        this.passwordInput = page.locator('[data-qa="password"]');
        this.daysSelect = page.locator('[data-qa="days"]');
        this.monthsID = page.locator('[id="uniform-months"]');
        this.dateOfBirthLabel = page.locator('form div:nth-child(5) label');

        this.monthsSelect = page.locator('[data-qa="months"]');

        this.yearsSelect = page.locator('[data-qa="years"]');
        this.firstNameInput = page.locator('[data-qa="first_name"]');
        this.lastNameInput = page.locator('[data-qa="last_name"]');
        this.addressInput = page.locator('[data-qa="address"]');
        this.countrySelect = page.locator('[data-qa="country"]');
        this.stateInput = page.locator('[data-qa="state"]');
        this.cityInput = page.locator('[data-qa="city"]');
        this.zipInput = page.locator('[data-qa="zipcode"]');
        this.mobileInput = page.locator('[data-qa="mobile_number"]');
        this.createAccountButton = page.locator('[data-qa="create-account"]');

        this.accountCreatedMessage = page.getByText('Account Created!');
        this.continueButton = page.locator('[data-qa="continue-button"]');
    }

    async fillAccountDetails(password: string, firstName: string, lastName: string, address: string, state: string, city: string, zip: string, mobile: string) {
        await this.utils.check(this.titleMr);
        await this.utils.fill(this.passwordInput, password);
        await this.utils.selectOption(this.daysSelect, '1');

        this.monthsID.scrollIntoViewIfNeeded();
        // await this.utils.click(this.monthsID);
        await this.utils.click(this.dateOfBirthLabel);
        await this.utils.selectOption(this.monthsSelect, 'January');

        // await this.utils.click(this.yearsSelect);
        await this.utils.selectOption(this.yearsSelect, '2000');

        await this.utils.fill(this.firstNameInput, firstName);
        await this.utils.fill(this.lastNameInput, lastName);
        await this.utils.fill(this.addressInput, address);
        await this.utils.selectOption(this.countrySelect, 'India');
        await this.utils.fill(this.stateInput, state);
        await this.utils.fill(this.cityInput, city);
        await this.utils.fill(this.zipInput, zip);
        await this.utils.fill(this.mobileInput, mobile);
    }

    async createAccount() {
        await this.utils.click(this.createAccountButton);
    }

    async verifyAccountCreated() {
        await this.utils.expectVisible(this.accountCreatedMessage);
    }

    async clickContinue() {
        await this.utils.click(this.continueButton);
    }
}
