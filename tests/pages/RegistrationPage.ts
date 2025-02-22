import BasePage from './BasePage';

export default class RegistrationPage extends BasePage {
    async navigate() {
        await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/addUser');
    }

    async register(firstName: string, lastName: string, email: string, password: string): Promise<void> {
        await this.page.locator('#firstName').fill(firstName);
        await this.page.locator('#lastName').fill(lastName);
        await this.page.locator('#email').fill(email);
        await this.page.locator('#password').fill(password);
        await this.page.locator('#submit').click();
    }
}
