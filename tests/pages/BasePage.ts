import { Page } from 'playwright';

export default class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}
