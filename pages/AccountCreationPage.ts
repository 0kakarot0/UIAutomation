import { BasePage } from './BasePage';
import { Locator, Page } from '@playwright/test';
import {th} from "@faker-js/faker";

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
        this.passwordInput = page.locator('[id="password"]');
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

    async fillAccountDetails(
        password: string,
        firstName: string,
        lastName: string,
        address: string,
        state: string,
        city: string,
        zip: string,
        mobile: string
    ) {
        await this.selectTitleMr();
        await this.fillPassword(password);
        await this.selectDateOfBirth('1', 'January', '2000'); // ← pass values as params
        await this.fillPersonalInfo(firstName, lastName);
        await this.fillAddressAndContact(
            address,
            'India',
            state,
            city,
            zip,
            mobile
        );
    }

    // ── Small focused methods ───────────────────────────────────────

    private async selectTitleMr() {
        await this.utils.check(this.titleMr);
    }

    private async fillPassword(password: string) {
        await this.utils.click(this.passwordInput);
        await this.utils.fill(this.passwordInput, password);
    }

    private async selectDay(day: string) {
        await this.firstNameInput.scrollIntoViewIfNeeded();

        await this.daysSelect.selectOption(day);
    }

    private async selectMonth(month: string) {
        // await this.monthsID.click();
        await this.page.waitForTimeout(150);           // tiny stabilization delay — often helps
        await this.monthsSelect.selectOption({ label: month });  // safer than value/text mismatch
        // or: await this.monthsSelect.selectOption('4'); // if April → value="4"
    }

    private async selectYear(year: string) {
        // await this.yearsSelect.click();
        await this.yearsSelect.selectOption(year);
    }

    private async selectDateOfBirth(day: string, month: string, year: string) {
        await this.selectDay(day);
        await this.selectMonth(month);
        await this.selectYear(year);
    }

    private async fillPersonalInfo(firstName: string, lastName: string) {
        await this.utils.fill(this.firstNameInput, firstName);
        await this.utils.fill(this.lastNameInput, lastName);
    }

    private async fillAddressAndContact(
        address: string,
        country: string,
        state: string,
        city: string,
        zip: string,
        mobile: string
    ) {
        await this.addressInput.scrollIntoViewIfNeeded();
        await this.utils.fill(this.addressInput, address);

        await this.countrySelect.scrollIntoViewIfNeeded();
        await this.utils.selectOption(this.countrySelect, country);

        await this.utils.fill(this.stateInput, state);

        await this.utils.fill(this.cityInput, city);
        await this.utils.fill(this.zipInput, zip);
        await this.mobileInput.scrollIntoViewIfNeeded();
        await this.utils.fill(this.mobileInput, mobile);
    }

    async createAccount() {
        await this.utils.click(this.createAccountButton);
    }

    async verifyAccountCreated() {
        await this.closeAdIfPresent();
        await this.utils.expectVisible(this.accountCreatedMessage, 60000);
    }

    async clickContinue() {
        await this.utils.click(this.continueButton,{},"domcontentloaded" );
    }
}
