import BasePage from './BasePage';

export default class RegistrationPage extends BasePage {
    async navigate() {
        await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/addUser');
    }

    async register(firstName: string, lastName: string, email: string, password: string) {
        await this.page.fill('#firstName', firstName);
        await this.page.fill('#lastName', lastName);
        await this.page.fill('#email', email);
        await this.page.fill('#password', password);
        await this.page.click('#submit');
    }
}
