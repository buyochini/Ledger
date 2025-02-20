import BasePage from './BasePage';

export default class LoginPage extends BasePage {
    async navigate() {
        await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/login');
    }

    async login(email: string, password: string) {
        await this.page.fill('#email', email);
        await this.page.fill('#password', password);
        await this.page.click('#submit');
    }
}
