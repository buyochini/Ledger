import BasePage from './BasePage';
import {expect} from "@playwright/test";

export default class ContactsPage extends BasePage {
    async createContact(firstName: string, lastName: string, birthDate: string, email: string, phone: string, street1: string, street2: string, city: string, stateProvince: string, postalCode: string, country: string) {
        await this.page.click('#add-contact');
        await this.page.waitForSelector('#firstName');
        await this.page.fill('#firstName', firstName);
        await this.page.fill('#lastName', lastName);
        await this.page.fill('#birthdate', birthDate);
        await this.page.fill('#email', email);
        await this.page.fill('#phone', phone);
        await this.page.fill('#street1', street1);
        await this.page.fill('#street2', street2);
        await this.page.fill('#city', city);
        await this.page.fill('#stateProvince', stateProvince);
        await this.page.fill('#postalCode', postalCode);
        await this.page.fill('#country', country);
        await this.page.click('#submit');
    }

    async clickEditContact() {
        await this.page.click('#edit-contact');
        await expect(this.page).toHaveURL(/.*editContact/);
    }

    async editContact(newEmail: string) {
        await this.clickEditContact();
        const handle = await this.page.$('#email');
        await handle?.selectText();
        await this.page.waitForLoadState('networkidle');
        await handle?.fill(newEmail);
        await this.page.click('#submit');
    }

    async verifyContactExists(contactEmail: string) {
        await this.page.waitForSelector('#myTable');
        await expect(this.page.locator(`text=${contactEmail}`)).toBeVisible();
    }

    async selectContactRow(contactName: string) {
        await this.page.click(`text=${contactName}`);
    }
}
