import BasePage from './BasePage';
import {expect, Locator} from "@playwright/test";
import {Page} from "playwright";

export default class ContactsPage extends BasePage {
    public logOut: Locator;

    constructor(page: Page) {
        super(page);
        this.logOut = page.locator('#logout');
    }

    async createContact(firstName: string, lastName: string, birthDate: string, email: string, phone: string, street1: string, street2: string, city: string, stateProvince: string, postalCode: string, country: string): Promise<void> {
        await this.page.locator('#add-contact').click();
        await this.page.waitForSelector('#firstName');
        await this.page.locator('#firstName').fill(firstName);
        await this.page.locator('#lastName').fill(lastName);
        await this.page.locator('#birthdate').fill(birthDate);
        await this.page.locator('#email').fill(email);
        await this.page.locator('#phone').fill(phone);
        await this.page.locator('#street1').fill(street1);
        await this.page.locator('#street2').fill(street2);
        await this.page.locator('#city').fill(city);
        await this.page.locator('#stateProvince').fill(stateProvince);
        await this.page.locator('#postalCode').fill(postalCode);
        await this.page.locator('#country').fill(country);
        await this.page.locator('#submit').click();
    }

    async clickEditContact(): Promise<void> {
        await this.page.locator('#edit-contact').click();
        await expect(this.page).toHaveURL(/.*editContact/);
    }

    async editContact(newEmail: string): Promise<void> {
        await this.clickEditContact();
        const locator = this.page.locator('#email');
        await locator.clear();
        await this.page.waitForLoadState('networkidle');
        await locator.fill(newEmail);
        await this.page.locator('#submit').click();
    }

    async verifyContactExists(contactEmail: string): Promise<void> {
        await this.page.waitForSelector('#myTable');
        await expect(this.page.locator(`text=${contactEmail}`)).toBeVisible();
    }

    async selectContactRow(email: string): Promise<void> {
        await this.page.locator(`text=${email}`).click();
    }
}
