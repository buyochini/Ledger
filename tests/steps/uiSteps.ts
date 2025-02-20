import {Given, When, Then, After, Before} from '@cucumber/cucumber';
import {chromium, Browser, Page} from 'playwright';
import {expect} from '@playwright/test';
import RegistrationPage from '../pages/RegistrationPage';
import LoginPage from '../pages/LoginPage';
import ContactsPage from '../pages/ContactsPage';
import {Contact} from "./apiSteps";

let browser: Browser;
let page: Page;
let registrationPage: RegistrationPage;
let loginPage: LoginPage;
let contactsPage: ContactsPage;

const user = {
    firstName: 'Test',
    lastName: 'User',
    email: `testuser${Date.now()}@testaccount.com`,
    password: 'password123',
};

export const contact: Contact = {
    firstName: "John",
    lastName: "Williams",
    birthdate: "2021-01-01",
    email: user.email,
    phone: "1234567890",
    street1: "1 Washington street",
    street2: "washington street",
    city: "Greenwich",
    stateProvince: "London",
    postalCode: "12345",
    country: "UK"
}

Before("@ui", async function () {
    browser = await chromium.launch({headless: true});
    page = await browser.newPage();
    registrationPage = new RegistrationPage(page);
    loginPage = new LoginPage(page);
    contactsPage = new ContactsPage(page);
});

Given('I navigate to the registration page', async function () {
    await registrationPage.navigate();
});

When('I register a user with valid credentials', async function () {
    await registrationPage.register(user.firstName, user.lastName, user.email, user.password);
});

Given('I log in with the same credentials', async function () {
    await loginPage.navigate();
    await expect(page).toHaveURL(/.*login/);
    await loginPage.login(user.email, user.password);
});

When('I log in with email {string} and password {string}', async function (username: string, password: string) {
    await loginPage.login(username, password);
});

Then('I should see the contact list page', async function () {
    await expect(page).toHaveURL(/.*contactList/);
    await page.waitForSelector('#logout');
});

Given('I am logged in', async function () {
    await loginPage.navigate();
    await loginPage.login("bayomak@gmail.com", "London2025");
    await expect(page).toHaveURL(/.*contactList/);
    await page.waitForSelector('#logout');
});

Given('I am logged in with an existing contact', async function () {
    await loginPage.navigate();
    await loginPage.login("bayomak@gmail.com", "London2025");
    await expect(page).toHaveURL(/.*contactList/);
    await page.waitForSelector('#logout');
    await contactsPage.createContact(contact.firstName, contact.lastName, contact.birthdate, contact.email, contact.phone, contact.street1, contact.street2, contact.city, contact.stateProvince, contact.postalCode, contact.country);
});

When('I create a new contact with valid data', async function () {
    await contactsPage.createContact(contact.firstName, contact.lastName, contact.birthdate, contact.email, contact.phone, contact.street1, contact.street2, contact.city, contact.stateProvince, contact.postalCode, contact.country);
});

Then('I should see the contact in the list', async function () {
    await contactsPage.verifyContactExists(contact.email);
});

Given('I edit the contact\'s email', async function () {
    const contactName = contact.firstName + " " + contact.lastName;
    await contactsPage.selectContactRow(contactName)
    await contactsPage.editContact(contact.email);
});

Then('I should see the updated contact in the list', async function () {
    await page.locator(`text=${contact.email}`).waitFor();
});

After("@ui", async function () {
    try {
        if (browser) {
            await browser.close();
        }
    } catch (error) {
        console.error('Error during browser cleanup:', error);
    }
});

