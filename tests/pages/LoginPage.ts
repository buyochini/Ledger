import BasePage from './BasePage';
import {expect} from "@playwright/test";

export default class LoginPage extends BasePage {
    async navigate() {
        await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/login');
        await expect(this.page).toHaveURL(/.*login/);
    }

    async login(email: string, password: string) : Promise<void> {
        await this.page.locator('#email').fill(email);
        await this.page.locator('#password').fill(password);
        await this.page.locator('#submit').click();
    }
}
